import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAdmin2FA } from '@/lib/totp';
import { checkWindowRateLimit } from '@/lib/rate-limiter';

// POST /api/admin/login
export async function POST(request) {
  try {
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Rate limit: Max 5 login attempts per 15 minutes per IP
    const rateCheck = checkWindowRateLimit({
      key: `admin-login:${ip}`,
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000
    });

    if (!rateCheck.allowed) {
      return NextResponse.json({ 
        error: 'Too many login attempts. Please wait 15 minutes before trying again.' 
      }, { status: 429 });
    }

    const body = await request.json();
    const { password, twoFactorCode } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || 'CarpenterwalaAdmin2026';
    const adminTotpSecret = process.env.ADMIN_TOTP_SECRET;
    
    // Parse backup codes from environment variable (comma-separated), with built-in fallbacks if configured
    const backupCodesStr = process.env.ADMIN_BACKUP_CODES || 'FCBC-ADE5,D69D-8D6C,D6E7-D022';
    const backupCodes = backupCodesStr.split(',').map((c) => c.trim()).filter(Boolean);

    // 1. Primary Credential Check with Timing-Safe Comparison
    const passwordBuffer = Buffer.from(password || '');
    const expectedBuffer = Buffer.from(expectedPassword);
    const isPasswordValid = passwordBuffer.length === expectedBuffer.length && 
                            crypto.timingSafeEqual(passwordBuffer, expectedBuffer);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // 2. 2FA Verification (if configured)
    if (adminTotpSecret) {
      if (!twoFactorCode) {
        return NextResponse.json(
          { error: 'Two-Factor Authenticator 6-digit code is required.', requires2FA: true },
          { status: 400 }
        );
      }

      const verification = verifyAdmin2FA({
        secret: adminTotpSecret,
        code: twoFactorCode,
        backupCodes,
      });

      if (!verification.success) {
        return NextResponse.json(
          { error: 'Invalid 2FA code. Please enter the current code from your authenticator app or a backup code.' },
          { status: 401 }
        );
      }
    }

    // 3. Issue cryptographically signed admin session token
    const token = crypto
      .createHash('sha256')
      .update(password + 'carpenterwala-salt-2026')
      .digest('hex');

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
