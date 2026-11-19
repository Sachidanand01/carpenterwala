import { NextResponse } from 'next/server';
import {
  getOnboardingSessionStatus,
  getOnboardingSessionProfile,
  resolveOrigin,
  normalizeIndianPhone,
  getLocalizedExpiredMessage,
  LOCALIZED_EXPIRED_MESSAGES
} from '@/lib/onboarding';
import { checkWindowRateLimit, getClientIp, buildRateLimitHeaders } from '@/lib/rate-limiter';

export async function GET(request, { params }) {
  try {
    const ip = getClientIp(request);

    // IP-based rate limit: Max 120 status checks per hour per IP (supports 3s UI polling while blocking enumeration)
    const rateCheck = checkWindowRateLimit({
      key: `onboarding-status-ip:${ip}`,
      maxAttempts: 120,
      windowMs: 60 * 60 * 1000
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          error: 'Too many status requests from this IP address. Please wait a moment.'
        },
        {
          status: 429,
          headers: buildRateLimitHeaders(rateCheck, 120)
        }
      );
    }

    const resolvedParams = await params;
    const rawToken = resolvedParams?.token ? String(resolvedParams.token).trim() : '';

    if (!rawToken) {
      return NextResponse.json(
        { success: false, error: 'Session token is required.' },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const langParam = url.searchParams.get('lang') || request.headers.get('accept-language')?.split(',')[0] || 'en';
    const localizedExpired = getLocalizedExpiredMessage(langParam);

    // Deterministic expired token check for testing/preview (/api/onboarding/status/expired)
    if (rawToken.toLowerCase() === 'expired') {
      const expiredAt = new Date(Date.now() - 65 * 60 * 1000).toISOString();
      return NextResponse.json({
        success: true,
        session_token: 'expired',
        status: 'EXPIRED',
        is_expired: true,
        expired_title: localizedExpired.title,
        expired_message: localizedExpired.message,
        localized_expired: LOCALIZED_EXPIRED_MESSAGES,
        session: {
          id: 'expired-session',
          session_token: 'expired',
          phone_number: '9876543210',
          full_name: 'Ramesh Kumar',
          trade: 'carpentry',
          city: 'Bangalore',
          locality: 'Indiranagar',
          status: 'EXPIRED',
          expires_at: expiredAt,
          created_at: new Date(Date.now() - 125 * 60 * 1000).toISOString()
        }
      });
    }

    // Validate lookup input: if numeric/phone-shaped, require strict 10-digit Indian mobile; otherwise valid token format
    let lookupValue = rawToken;
    const looksLikePhone = /^\+?\d[\d\s\-().]{7,}$/.test(rawToken);
    if (looksLikePhone) {
      const cleanPhone = normalizeIndianPhone(rawToken);
      if (!cleanPhone) {
        return NextResponse.json(
          {
            success: false,
            code: 'INVALID_INDIAN_MOBILE',
            error: 'Invalid mobile number. Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
          },
          { status: 400 }
        );
      }
      lookupValue = cleanPhone;
    } else if (!/^[A-Za-z0-9_-]{3,32}$/.test(rawToken)) {
      return NextResponse.json(
        { success: false, error: 'Invalid session token format.' },
        { status: 400 }
      );
    }

    const session = await getOnboardingSessionStatus(lookupValue);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Onboarding session not found.' },
        { status: 404 }
      );
    }

    const origin = resolveOrigin(request);
    const verifyUrl = `${origin.replace(/\/$/, '')}/v/${session.session_token}`;
    const isExpired = session.status === 'EXPIRED';
    const profile = session.status === 'VERIFIED' ? await getOnboardingSessionProfile(session) : null;

    return NextResponse.json({
      success: true,
      session_token: session.session_token,
      status: session.status,
      verify_url: verifyUrl,
      is_expired: isExpired,
      expired_title: isExpired ? localizedExpired.title : null,
      expired_message: isExpired ? localizedExpired.message : null,
      localized_expired: isExpired ? LOCALIZED_EXPIRED_MESSAGES : undefined,
      profile,
      session: {
        id: session.id,
        session_token: session.session_token,
        pro_id: session.pro_id || null,
        phone_number: session.phone_number,
        email: session.email,
        full_name: session.full_name,
        trade: session.trade,
        city: session.city,
        locality: session.locality,
        pincode: session.pincode,
        experience_years: session.experience_years,
        aadhaar_front_url: session.aadhaar_front_url,
        aadhaar_back_url: session.aadhaar_back_url,
        pan_front_url: session.pan_front_url || null,
        pan_back_url: session.pan_back_url || null,
        voter_driving_front_url: session.voter_driving_front_url || null,
        voter_driving_back_url: session.voter_driving_back_url || null,
        police_verification_url: session.police_verification_url || null,
        portfolio_urls: session.portfolio_urls || [],
        status: session.status,
        expires_at: session.expires_at,
        verified_at: session.verified_at || null,
        created_at: session.created_at
      }
    });
  } catch (err) {
    console.error('[GET /api/onboarding/status/[token]] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to fetch onboarding session status.'
      },
      { status: 500 }
    );
  }
}
