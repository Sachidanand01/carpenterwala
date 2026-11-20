import { NextResponse } from 'next/server';
import { executeTool } from '@/lib/mcp/tool-handlers';
import { MCP_TOOLS } from '@/lib/mcp/tool-definitions';
import { checkWindowRateLimit, getClientIp, buildRateLimitHeaders } from '@/lib/rate-limiter';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
};

const READ_ONLY_TOOLS = new Set([
  'search_verified_pros',
  'get_service_rate_card',
  'calculate_service_estimate',
  'check_onboarding_status'
]);

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function getClientContext(request) {
  const ip = getClientIp(request);
  const host = request.headers.get('host') || 'carpenterwala.com';
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const origin = `${proto}://${host}`;
  return { ip, origin };
}

// GET /api/mcp/tools/[toolName] — Support GET queries for read-only tools only
export async function GET(request, { params }) {
  const resolvedParams = await params;
  const toolName = resolvedParams.toolName;
  const toolDef = MCP_TOOLS.find(t => t.name === toolName);

  if (!toolDef) {
    return NextResponse.json({
      error: `Tool "${toolName}" not found.`
    }, { status: 404, headers: CORS_HEADERS });
  }

  if (!READ_ONLY_TOOLS.has(toolName)) {
    return NextResponse.json(
      {
        error: `Method Not Allowed: Tool "${toolName}" performs state modifications or side-effects and must be invoked via POST.`
      },
      {
        status: 405,
        headers: {
          ...CORS_HEADERS,
          Allow: 'POST, OPTIONS'
        }
      }
    );
  }

  const context = getClientContext(request);

  // Rate limit: Max 60 requests/hr per IP
  const ipRate = checkWindowRateLimit({
    key: `mcp-tool-ip:${context.ip}`,
    maxAttempts: 60,
    windowMs: 60 * 60 * 1000
  });

  if (!ipRate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded: Too many MCP tool requests from this IP. Please retry later.' },
      { status: 429, headers: { ...CORS_HEADERS, ...buildRateLimitHeaders(ipRate, 60) } }
    );
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

  const context = getClientContext(request);

  // Rate limit: Max 60 requests/hr per IP
  const ipRate = checkWindowRateLimit({
    key: `mcp-tool-ip:${context.ip}`,
    maxAttempts: 60,
    windowMs: 60 * 60 * 1000
  });

  if (!ipRate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded: Too many MCP tool requests from this IP. Please retry later.' },
      { status: 429, headers: { ...CORS_HEADERS, ...buildRateLimitHeaders(ipRate, 60) } }
    );
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  try {
    const result = await executeTool(toolName, body, context);
    return NextResponse.json({ success: true, tool: toolName, result }, { headers: CORS_HEADERS });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400, headers: CORS_HEADERS });
  }
}
