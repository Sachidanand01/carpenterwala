import { NextResponse } from 'next/server';
import { initOnboardingSession, resolveOrigin, normalizeIndianPhone } from '@/lib/onboarding';
import {
  checkRateLimit,
  checkWindowRateLimit,
  getClientIp,
  buildRateLimitHeaders
} from '@/lib/rate-limiter';

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // 1. IP-based window rate limit (max 25 init requests per hour per IP)
    const ipWindowCheck = checkWindowRateLimit({
      key: `onboarding-init-ip:${ip}`,
      maxAttempts: 25,
      windowMs: 60 * 60 * 1000
    });

    if (!ipWindowCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          error: 'Too many onboarding requests from this IP address. Please wait before trying again.'
        },
        {
          status: 429,
          headers: buildRateLimitHeaders(ipWindowCheck, 25)
        }
      );
    }

    const body = await request.json();

    // 2. Strict 10-digit Indian mobile validation (must start with 6, 7, 8, or 9)
    const cleanPhone = normalizeIndianPhone(body?.phone_number ?? body?.phone);
    if (!cleanPhone) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_INDIAN_MOBILE',
          error: 'Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
        },
        { status: 400 }
      );
    }

    // 3. Sliding 24-hour rate limit per phone number & IP
    const rateCheck = checkRateLimit({
      phone: cleanPhone,
      ip,
      maxAttempts: 5,
      ipMaxAttempts: 25
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          error: rateCheck.reason,
          reset_at: rateCheck.resetAt.toISOString()
        },
        {
          status: 429,
          headers: buildRateLimitHeaders(rateCheck, 5)
        }
      );
    }

    const origin = resolveOrigin(request);
    const result = await initOnboardingSession({ ...body, phone_number: cleanPhone }, origin);

    return NextResponse.json(
      {
        success: true,
        session_token: result.session_token,
        verify_url: result.verify_url,
        expires_at: result.expires_at,
        status: result.status,
        session: {
          id: result.session.id,
          session_token: result.session.session_token,
          phone_number: result.session.phone_number,
          email: result.session.email,
          full_name: result.session.full_name,
          trade: result.session.trade,
          city: result.session.city,
          locality: result.session.locality,
          pincode: result.session.pincode,
          experience_years: result.session.experience_years,
          status: result.session.status,
          expires_at: result.session.expires_at
        }
      },
      {
        headers: buildRateLimitHeaders(rateCheck, 5)
      }
    );
  } catch (err) {
    console.error('[POST /api/onboarding/init] Error:', err);
    const status = err.status || 500;
    return NextResponse.json(
      {
        success: false,
        code: err.code || 'ONBOARDING_INIT_ERROR',
        error: err.message || 'Failed to initialize onboarding session.'
      },
      { status }
    );
  }
}
