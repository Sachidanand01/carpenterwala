import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { checkWindowRateLimit, getClientIp } from '@/lib/rate-limiter';
import { encryptToken, decryptToken } from '@/lib/crypto';
import { createAuthorizationCode, isValidRedirectUri } from '@/lib/oauth';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// POST /api/oauth/otp
export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const {
      action = 'send',
      phone,
      otp,
      otpToken,
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod = 'S256',
      scopes = ['customer']
    } = body;

    // Validate phone number format (10-digit Indian mobile)
    const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
    const mobileNumber = cleanPhone.length === 12 && cleanPhone.startsWith('91') 
      ? cleanPhone.slice(2) 
      : cleanPhone;

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // ─────────────────────────────────────────────────────────────
    // 1. ACTION: SEND OTP
    // ─────────────────────────────────────────────────────────────
    if (action === 'send') {
      const rateCheck = checkWindowRateLimit({
        key: `oauth-otp-send:${ip}:${mobileNumber}`,
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000
      });

      if (!rateCheck.allowed) {
        return NextResponse.json(
          { error: 'Too many OTP requests. Please wait a few minutes before trying again.' },
          { status: 429, headers: CORS_HEADERS }
        );
      }

      const generatedOtp = String(crypto.randomInt(100000, 1000000));
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      console.log(`[OAuth OTP] Generated OTP for +91${mobileNumber}: ${generatedOtp}`);

      const signedToken = encryptToken({
        type: 'oauth_otp',
        phone: mobileNumber,
        otp: generatedOtp,
        expiresAt
      });

      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully to your mobile number.',
        otpToken: signedToken,
        // In local/test environments provide dev convenience
        debugOtp: process.env.NODE_ENV !== 'production' ? generatedOtp : undefined
      }, { headers: CORS_HEADERS });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. ACTION: VERIFY OTP & MINT AUTHORIZATION CODE
    // ─────────────────────────────────────────────────────────────
    if (action === 'verify') {
      const verifyRate = checkWindowRateLimit({
        key: `oauth-otp-verify:${ip}:${mobileNumber}`,
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000
      });

      if (!verifyRate.allowed) {
        return NextResponse.json(
          { error: 'Too many invalid attempts. Please wait 15 minutes before trying again.' },
          { status: 429, headers: CORS_HEADERS }
        );
      }

      if (!otpToken) {
        return NextResponse.json(
          { error: 'Session expired. Please request a new OTP.' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      const decrypted = decryptToken(otpToken);
      if (!decrypted || decrypted.type !== 'oauth_otp' || decrypted.phone !== mobileNumber) {
        return NextResponse.json(
          { error: 'Invalid or expired OTP session. Please request a new OTP.' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      if (decrypted.expiresAt && decrypted.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: 'OTP has expired. Please request a fresh one.' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      if (String(decrypted.otp).trim() !== String(otp).trim()) {
        return NextResponse.json(
          { error: 'Incorrect OTP. Please enter the 6-digit code sent to your phone.' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      if (redirectUri && !isValidRedirectUri(redirectUri)) {
        return NextResponse.json(
          { error: 'Invalid or untrusted redirect_uri.' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      // Check user identity in database (detect whether Customer, Pro, or both)
      let role = 'customer';
      let proId = null;
      let userName = null;

      try {
        if (supabaseAdmin) {
          // Check for professional profile
          const { data: proProfile } = await supabaseAdmin
            .from('profiles')
            .select('id, name, trade')
            .eq('phone', mobileNumber)
            .maybeSingle();

          if (proProfile) {
            role = 'pro';
            proId = proProfile.id;
            userName = proProfile.name;
          }

          // Check if customer record exists
          const { data: customerRow } = await supabaseAdmin
            .from('customers')
            .select('id, first_name, last_name')
            .eq('phone', mobileNumber)
            .maybeSingle();

          if (customerRow) {
            const customerName = [customerRow.first_name, customerRow.last_name].filter(Boolean).join(' ');
            userName = userName || customerName;
            if (role === 'pro') {
              role = 'both';
            }
          }
        }
      } catch (dbErr) {
        console.warn('[OAuth] DB lookup non-critical warning:', dbErr.message);
      }

      // Mint Authorization Code
      const code = createAuthorizationCode({
        phone: mobileNumber,
        role,
        proId,
        clientId: clientId || 'chatgpt',
        redirectUri: redirectUri || '',
        codeChallenge: codeChallenge || '',
        codeChallengeMethod: codeChallengeMethod || 'S256',
        scopes: Array.isArray(scopes) ? scopes : ['customer']
      });

      return NextResponse.json({
        success: true,
        code,
        role,
        proId,
        name: userName || 'User'
      }, { headers: CORS_HEADERS });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400, headers: CORS_HEADERS });
  } catch (err) {
    console.error('OAuth OTP route error:', err);
    return NextResponse.json({ error: 'Internal server error: ' + err.message }, { status: 500, headers: CORS_HEADERS });
  }
}
