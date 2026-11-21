import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { checkWindowRateLimit, getClientIp } from '@/lib/rate-limiter';
import { encryptToken, decryptToken } from '@/lib/crypto';
import { createAuthorizationCode, isValidRedirectUri } from '@/lib/oauth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

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
      email,
      phone,
      otp,
      otpToken,
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod = 'S256',
      scopes = ['customer']
    } = body;

    // Detect whether user provided email or phone
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;
    let mobileNumber = null;
    if (phone) {
      const cleanPhone = String(phone).replace(/[^0-9]/g, '');
      mobileNumber = cleanPhone.length === 12 && cleanPhone.startsWith('91') 
        ? cleanPhone.slice(2) 
        : cleanPhone;
    }

    const identifier = cleanEmail || mobileNumber;
    if (!identifier) {
      return NextResponse.json(
        { error: 'Please enter a valid email address or 10-digit mobile number.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (mobileNumber && !/^[6-9]\d{9}$/.test(mobileNumber)) {
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
        key: `oauth-otp-send:${ip}:${identifier}`,
        maxAttempts: 6,
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

      console.log(`[OAuth OTP] Generated OTP for ${identifier}: ${generatedOtp}`);

      // If email, send transactional email via Resend
      if (cleanEmail && process.env.RESEND_API_KEY) {
        try {
          const emailHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; background: #ffffff; color: #1e293b; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; border-radius: 14px; background: linear-gradient(135deg, #FF6B00 0%, #EA580C 100%); color: #ffffff; font-size: 24px; font-weight: bold; text-align: center;">CW</div>
                <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 16px 0 4px 0;">Carpenterwala Login Verification</h1>
                <p style="font-size: 14px; color: #64748b; margin: 0;">Use the code below to authorize your Claude / ChatGPT connection.</p>
              </div>

              <div style="text-align: center; margin: 28px 0; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #EA580C; font-family: monospace;">${generatedOtp}</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 8px 0 0 0;">Valid for 10 minutes · Do not share this code</p>
              </div>

              <div style="background: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #9a3412;">
                🔒 This code confirms your identity to access your appliance warranties, service bookings, or technician leads.
              </div>

              <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
              <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Carpenterwala Home Improvement Marketplace · 0% Commission Platform</p>
            </div>
          `;

          let emailRes = await resend.emails.send({
            from: 'Carpenterwala <onboarding@carpenterwala.com>',
            to: cleanEmail,
            subject: `${generatedOtp} is your Carpenterwala Verification Code`,
            html: emailHtml
          });

          if (emailRes.error) {
            console.warn('[OAuth Resend] Custom domain fallback:', emailRes.error.message);
            await resend.emails.send({
              from: 'Carpenterwala <onboarding@resend.dev>',
              to: cleanEmail,
              subject: `${generatedOtp} is your Carpenterwala Verification Code`,
              html: emailHtml
            });
          }
          console.log(`[OAuth Resend] Dispatched verification email to ${cleanEmail}`);
        } catch (resendErr) {
          console.warn('[OAuth Resend Dispatch Warning]:', resendErr.message);
        }
      }

      const signedToken = encryptToken({
        type: 'oauth_otp',
        identifier,
        email: cleanEmail,
        phone: mobileNumber,
        otp: generatedOtp,
        expiresAt
      });

      return NextResponse.json({
        success: true,
        message: cleanEmail 
          ? `Verification code sent to ${cleanEmail}. Please check your inbox.`
          : `Verification code sent to +91 ${mobileNumber}.`,
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
        key: `oauth-otp-verify:${ip}:${identifier}`,
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
          { error: 'Session expired. Please request a new verification code.' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      const decrypted = decryptToken(otpToken);
      if (!decrypted || decrypted.type !== 'oauth_otp' || decrypted.identifier !== identifier) {
        return NextResponse.json(
          { error: 'Invalid or expired session. Please request a new verification code.' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      if (decrypted.expiresAt && decrypted.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: 'Verification code has expired. Please request a fresh one.' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      if (String(decrypted.otp).trim() !== String(otp).trim()) {
        return NextResponse.json(
          { error: 'Incorrect code. Please enter the 6-digit verification code.' },
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
          // 1. Check for professional profile by email or phone
          let proQuery = supabaseAdmin.from('profiles').select('id, name, trade, email, phone');
          if (cleanEmail && mobileNumber) {
            proQuery = proQuery.or(`email.eq.${cleanEmail},phone.eq.${mobileNumber}`);
          } else if (cleanEmail) {
            proQuery = proQuery.eq('email', cleanEmail);
          } else {
            proQuery = proQuery.eq('phone', mobileNumber);
          }
          const { data: proProfile } = await proQuery.maybeSingle();

          if (proProfile) {
            role = 'pro';
            proId = proProfile.id;
            userName = proProfile.name;
          }

          // 2. Check customer record
          let custQuery = supabaseAdmin.from('customers').select('id, first_name, last_name, email, phone');
          if (cleanEmail && mobileNumber) {
            custQuery = custQuery.or(`email.eq.${cleanEmail},phone.eq.${mobileNumber}`);
          } else if (cleanEmail) {
            custQuery = custQuery.eq('email', cleanEmail);
          } else {
            custQuery = custQuery.eq('phone', mobileNumber);
          }
          const { data: customerRow } = await custQuery.maybeSingle();

          if (customerRow) {
            const customerName = [customerRow.first_name, customerRow.last_name].filter(Boolean).join(' ');
            userName = userName || customerName;
            if (role === 'pro') {
              role = 'both';
            }
          } else if (role === 'customer' && cleanEmail) {
            // Auto-onboard new customer record
            try {
              const { data: newCust } = await supabaseAdmin
                .from('customers')
                .insert([{ email: cleanEmail, phone: mobileNumber, first_name: 'Verified Customer' }])
                .select('id, first_name, last_name')
                .maybeSingle();
              if (newCust) {
                userName = 'Verified Customer';
              }
            } catch (createErr) {
              console.warn('[OAuth] Auto-create customer record notice:', createErr.message);
            }
          }
        }
      } catch (dbErr) {
        console.warn('[OAuth] DB lookup non-critical warning:', dbErr.message);
      }

      // Mint Authorization Code
      const code = createAuthorizationCode({
        email: cleanEmail,
        phone: mobileNumber,
        role,
        proId,
        clientId: clientId || 'claude',
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
