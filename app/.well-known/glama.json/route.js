import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=3600'
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      "$schema": "https://glama.ai/mcp/schemas/connector.json",
      "claim": "glama_claim_Ndni_9y9CVVpOeoGmmbInX2mP5FFw3EG"
    },
    { headers: CORS_HEADERS }
  );
}
