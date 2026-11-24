import { NextResponse } from 'next/server';
import crypto from 'crypto';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-store, no-cache'
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// RFC 7591: OAuth 2.0 Dynamic Client Registration Protocol for MCP Clients
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Generate a unique client_id
    const clientId = 'mcp_' + crypto.randomBytes(8).toString('hex');
    const clientName = body.client_name || 'Dynamic MCP Client';
    const redirectUris = Array.isArray(body.redirect_uris) ? body.redirect_uris : [];

    // Return RFC 7591 compliant client registration response
    const registrationResponse = {
      client_id: clientId,
      client_name: clientName,
      redirect_uris: redirectUris,
      grant_types: body.grant_types || ['authorization_code'],
      response_types: body.response_types || ['code'],
      token_endpoint_auth_method: 'none',
      scope: 'customer pro'
    };

    return NextResponse.json(registrationResponse, {
      status: 201,
      headers: CORS_HEADERS
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'invalid_client_metadata', error_description: err.message },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
