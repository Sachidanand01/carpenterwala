import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'public, max-age=3600'
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request) {
  const host = request.headers.get('host') || 'carpenterwala.com';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const issuer = process.env.NODE_ENV === 'production' ? 'https://carpenterwala.com' : `${proto}://${host}`;

  const metadata = {
    issuer,
    authorization_endpoint: `${issuer}/oauth/authorize`,
    token_endpoint: `${issuer}/api/oauth/token`,
    response_types_supported: ['code'],
    response_modes_supported: ['query'],
    grant_types_supported: ['authorization_code'],
    code_challenge_methods_supported: ['S256', 'plain'],
    token_endpoint_auth_methods_supported: ['none', 'client_secret_post', 'client_secret_basic'],
    scopes_supported: ['customer', 'pro', 'openid', 'profile'],
    service_documentation: `${issuer}/llms.txt`,
    ui_locales_supported: ['en', 'hi', 'kn', 'ta', 'te', 'mr', 'bn']
  };

  return NextResponse.json(metadata, { headers: CORS_HEADERS });
}
