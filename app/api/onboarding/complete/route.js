import { NextResponse } from 'next/server';
import { completeOnboardingSession } from '@/lib/onboarding';
import { checkWindowRateLimit, getClientIp, buildRateLimitHeaders } from '@/lib/rate-limiter';

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // IP-based rate limit: Max 20 completion submissions per hour per IP
    const rateCheck = checkWindowRateLimit({
      key: `onboarding-complete-ip:${ip}`,
      maxAttempts: 20,
      windowMs: 60 * 60 * 1000
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          error: 'Too many verification submissions from this IP address. Please try again later.'
        },
        {
          status: 429,
          headers: buildRateLimitHeaders(rateCheck, 20)
        }
      );
    }

    const body = await request.json();
    const result = await completeOnboardingSession(body);

    return NextResponse.json(
      {
        success: true,
        status: result.session.status,
        session_token: result.session.session_token,
        session: {
          id: result.session.id,
          session_token: result.session.session_token,
          pro_id: result.session.pro_id || null,
          phone_number: result.session.phone_number,
          full_name: result.session.full_name,
          trade: result.session.trade,
          city: result.session.city,
          locality: result.session.locality,
          pincode: result.session.pincode,
          experience_years: result.session.experience_years,
          aadhaar_front_url: result.session.aadhaar_front_url,
          aadhaar_back_url: result.session.aadhaar_back_url,
          pan_front_url: result.session.pan_front_url || null,
          pan_back_url: result.session.pan_back_url || null,
          voter_driving_front_url: result.session.voter_driving_front_url || null,
          voter_driving_back_url: result.session.voter_driving_back_url || null,
          police_verification_url: result.session.police_verification_url || null,
          portfolio_urls: result.session.portfolio_urls || [],
          status: result.session.status,
          verified_at: result.session.verified_at || null
        },
        profile: result.profile
      },
      {
        headers: buildRateLimitHeaders(rateCheck, 20)
      }
    );
  } catch (err) {
    console.error('[POST /api/onboarding/complete] Error:', err);
    const status = err.status || 500;
    return NextResponse.json(
      {
        success: false,
        code: err.code || 'ONBOARDING_COMPLETE_ERROR',
        expired_title: err.expired_title || undefined,
        localized_expired: err.localized_expired || undefined,
        error: err.message || 'Failed to complete onboarding verification.'
      },
      { status }
    );
  }
}
