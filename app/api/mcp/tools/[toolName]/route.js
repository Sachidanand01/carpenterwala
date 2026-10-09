import { NextResponse } from 'next/server';
import { executeTool } from '@/lib/mcp/tool-handlers';
import { MCP_TOOLS } from '@/lib/mcp/tool-definitions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function getClientContext(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '127.0.0.1';
  const host = request.headers.get('host') || 'carpenterwala.com';
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const origin = `${proto}://${host}`;
  return { ip, origin };
}

// GET /api/mcp/tools/[toolName] — Support GET queries for read-only tools
export async function GET(request, { params }) {
  const resolvedParams = await params;
  const toolName = resolvedParams.toolName;
  const toolDef = MCP_TOOLS.find(t => t.name === toolName);

  if (!toolDef) {
    return NextResponse.json({
      error: `Tool "${toolName}" not found.`
    }, { status: 404, headers: CORS_HEADERS });
  }

  const { searchParams } = new URL(request.url);
  const args = {};
  for (const [key, value] of searchParams.entries()) {
    try {
      args[key] = JSON.parse(value);
    } catch {
      args[key] = value;
    }
  }

  const context = getClientContext(request);

  try {
    const result = await executeTool(toolName, args, context);
    return NextResponse.json({ success: true, tool: toolName, result }, { headers: CORS_HEADERS });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400, headers: CORS_HEADERS });
  }
}

// POST /api/mcp/tools/[toolName] — Support POST for state-modifying or complex tools
export async function POST(request, { params }) {
  const resolvedParams = await params;
  const toolName = resolvedParams.toolName;
  const toolDef = MCP_TOOLS.find(t => t.name === toolName);

  if (!toolDef) {
    return NextResponse.json({
      error: `Tool "${toolName}" not found.`
    }, { status: 404, headers: CORS_HEADERS });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const context = getClientContext(request);

  try {
    const result = await executeTool(toolName, body, context);
    return NextResponse.json({ success: true, tool: toolName, result }, { headers: CORS_HEADERS });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400, headers: CORS_HEADERS });
  }
}
