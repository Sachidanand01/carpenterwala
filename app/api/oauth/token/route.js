import { NextResponse } from 'next/server';
import {
  verifyAuthorizationCode,
  verifyCodeChallenge,
  createOAuthAccessToken,
  isValidRedirectUri
} from '@/lib/oauth';
import { checkWindowRateLimit, getClientIp } from '@/lib/rate-limiter';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-store, no-cache'
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// POST /api/oauth/token
export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // Rate limiting: Max 30 token requests per minute per IP
    const rateCheck = checkWindowRateLimit({
      key: `oauth-token:${ip}`,
      maxAttempts: 30,
      windowMs: 60 * 1000
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'slow_down', error_description: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429, headers: CORS_HEADERS }
      );
    }

    // Parse form-urlencoded or JSON body
    const contentType = request.headers.get('content-type') || '';
    let grantType, code, redirectUri, clientId, codeVerifier;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      grantType = params.get('grant_type');
      code = params.get('code');
      redirectUri = params.get('redirect_uri');
      clientId = params.get('client_id');
      codeVerifier = params.get('code_verifier');
    } else {
      const json = await request.json().catch(() => ({}));
      grantType = json.grant_type;
      code = json.code;
      redirectUri = json.redirect_uri;
      clientId = json.client_id;
      codeVerifier = json.code_verifier;
    }

    if (grantType !== 'authorization_code') {
      return NextResponse.json(
        {
          error: 'unsupported_grant_type',
          error_description: 'Only grant_type=authorization_code is supported.'
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Missing authorization code.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 1. Verify Authorization Code
    const authCode = verifyAuthorizationCode(code);
    if (!authCode) {
      return NextResponse.json(
        {
          error: 'invalid_grant',
          error_description: 'Authorization code is invalid or has expired.'
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 2. Validate redirect_uri matches authorization request
    if (authCode.redirectUri && redirectUri && authCode.redirectUri !== redirectUri) {
      return NextResponse.json(
        {
          error: 'invalid_grant',
          error_description: 'redirect_uri does not match authorization request.'
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 3. Verify PKCE (RFC 7636)
    if (authCode.codeChallenge) {
      if (!codeVerifier) {
        return NextResponse.json(
          {
            error: 'invalid_request',
            error_description: 'code_verifier is required for PKCE-enabled authorization.'
          },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      const isValidPkce = verifyCodeChallenge(
        codeVerifier,
        authCode.codeChallenge,
        authCode.codeChallengeMethod
      );

      if (!isValidPkce) {
        return NextResponse.json(
          {
            error: 'invalid_grant',
            error_description: 'PKCE verification failed: code_verifier does not match code_challenge.'
          },
          { status: 400, headers: CORS_HEADERS }
        );
      }
    }

    // 4. Issue OAuth 2.1 Access Token (30 days TTL)
    const accessToken = createOAuthAccessToken({
      phone: authCode.phone,
      role: authCode.role,
      proId: authCode.proId,
      clientId: clientId || authCode.clientId || 'unknown',
      scopes: authCode.scopes || ['customer']
    });

    const responsePayload = {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 30 * 24 * 60 * 60, // 30 days in seconds
      scope: (authCode.scopes || ['customer']).join(' '),
      user: {
        phone: authCode.phone,
        role: authCode.role,
        proId: authCode.proId
      }
    };

    return NextResponse.json(responsePayload, { headers: CORS_HEADERS });
  } catch (err) {
    console.error('OAuth token exchange error:', err);
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error: ' + err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
