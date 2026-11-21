import { NextResponse } from 'next/server';
import { MCP_TOOLS } from '@/lib/mcp/tool-definitions';
import { executeTool } from '@/lib/mcp/tool-handlers';
import { checkWindowRateLimit, getClientIp, buildRateLimitHeaders } from '@/lib/rate-limiter';
import { verifyOAuthAccessToken } from '@/lib/oauth';

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_INFO = {
  name: 'carpenterwala-mcp-server',
  version: '1.0.0',
  description: 'Carpenterwala Pan-India Home Improvement Marketplace & AI Pro Onboarding Remote MCP Server (0% Commission)'
};

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, HEAD, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, x-api-key, mcp-session-id, Mcp-Session-Id, Last-Event-ID, X-Requested-With, OpenAI-Conversation-Id, OpenAI-Ephemeral-User-Id, X-OpenAI-Client-User-Agent',
  'Access-Control-Expose-Headers':
    'Content-Type, mcp-session-id, Mcp-Session-Id, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After',
  'Access-Control-Max-Age': '86400'
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}

export async function DELETE() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

function getClientContext(request) {
  const ip = getClientIp(request);
  const authHeader = request.headers.get('authorization') || '';
  const auth = verifyOAuthAccessToken(authHeader);

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (host) {
    const defaultProto = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    const proto = request.headers.get('x-forwarded-proto') || defaultProto;
    return { ip, origin: `${proto}://${host}`, auth };
  }

  try {
    const urlOrigin = new URL(request.url).origin;
    if (urlOrigin && urlOrigin !== 'null') {
      return { ip, origin: urlOrigin, auth };
    }
  } catch {
    // Fallback to default origin
  }

  return { ip, origin: process.env.NEXT_PUBLIC_SITE_URL || 'https://carpenterwala.com', auth };
}

// GET /api/mcp — Server discovery or SSE stream
export async function GET(request) {
  const accept = request.headers.get('accept') || '';

  // If client requests Server-Sent Events (SSE)
  if (accept.includes('text/event-stream')) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send initial endpoint announcement
        const initData = JSON.stringify({
          type: 'endpoint',
          endpoint: '/api/mcp'
        });
        controller.enqueue(encoder.encode(`event: endpoint\ndata: ${initData}\n\n`));
      }
    });

    return new Response(stream, {
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive'
      }
    });
  }

  // Standard JSON discovery
  return NextResponse.json({
    status: 'online',
    protocol: 'model-context-protocol',
    protocolVersion: PROTOCOL_VERSION,
    server: SERVER_INFO,
    documentation: 'https://carpenterwala.com/llms.txt',
    toolsCount: MCP_TOOLS.length,
    tools: MCP_TOOLS.map(t => ({
      name: t.name,
      title: t.title,
      description: t.description
    }))
  }, {
    headers: CORS_HEADERS
  });
}

// POST /api/mcp — JSON-RPC 2.0 Protocol Handler
export async function POST(request) {
  const context = getClientContext(request);

  // IP-based rate limit: Max 60 MCP JSON-RPC calls per hour per IP
  const ipRate = checkWindowRateLimit({
    key: `mcp-rpc-ip:${context.ip}`,
    maxAttempts: 60,
    windowMs: 60 * 60 * 1000
  });

  if (!ipRate.allowed) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32029,
          message: 'Rate limit exceeded: Too many MCP requests from this IP address. Please retry later.'
        }
      },
      {
        status: 429,
        headers: {
          ...CORS_HEADERS,
          ...buildRateLimitHeaders(ipRate, 60)
        }
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error: Invalid JSON' }
    }, { status: 400, headers: CORS_HEADERS });
  }

  // Handle single request or batch
  const handleSingleMessage = async (msg) => {
    if (!msg || typeof msg !== 'object') {
      return {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32600, message: 'Invalid Request' }
      };
    }

    const { id, method, params } = msg;

    // Handle MCP notifications (which have no id and start with "notifications/")
    if ((id === undefined || id === null) && typeof method === 'string' && method.startsWith('notifications/')) {
      return null;
    }

    // Support direct tool invocation shorthand: { tool: "...", arguments: {...} } or { name: "...", arguments: {...} }
    const effectiveMethod = method || (msg.tool || msg.name ? 'tools/call' : undefined);
    const effectiveParams =
      params ||
      (msg.tool || msg.name
        ? {
            name: msg.tool || msg.name,
            arguments: msg.arguments || msg.input || msg.params || {}
          }
        : {});
    const rpcId = id !== undefined ? id : 1;

    try {
      switch (effectiveMethod) {
        case 'initialize': {
          return {
            jsonrpc: '2.0',
            id: rpcId,
            result: {
              protocolVersion: PROTOCOL_VERSION,
              capabilities: {
                tools: { listChanged: false }
              },
              serverInfo: SERVER_INFO
            }
          };
        }

        case 'ping': {
          return {
            jsonrpc: '2.0',
            id: rpcId,
            result: {}
          };
        }

        case 'tools/list': {
          return {
            jsonrpc: '2.0',
            id: rpcId,
            result: {
              tools: MCP_TOOLS
            }
          };
        }

        case 'tools/call': {
          const toolName = effectiveParams?.name || effectiveParams?.tool;
          const toolArgs = effectiveParams?.arguments || effectiveParams?.input || {};

          if (!toolName) {
            return {
              jsonrpc: '2.0',
              id: rpcId,
              error: { code: -32602, message: 'Missing tool name in params' }
            };
          }

          try {
            const toolResult = await executeTool(toolName, toolArgs, context);
            const contentBlocks = [
              {
                type: 'text',
                text: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult, null, 2)
              }
            ];

            if (toolResult && typeof toolResult === 'object' && typeof toolResult.markdown === 'string') {
              contentBlocks.push({
                type: 'text',
                text: toolResult.markdown
              });
            }

            return {
              jsonrpc: '2.0',
              id: rpcId,
              result: {
                content: contentBlocks,
                structuredContent: typeof toolResult === 'object' && toolResult !== null ? toolResult : undefined,
                isError: false
              }
            };
          } catch (toolErr) {
            return {
              jsonrpc: '2.0',
              id: rpcId,
              result: {
                content: [
                  {
                    type: 'text',
                    text: `Error executing tool "${toolName}": ${toolErr.message}`
                  }
                ],
                isError: true
              }
            };
          }
        }

        default: {
          return {
            jsonrpc: '2.0',
            id: rpcId,
            error: { code: -32601, message: `Method "${effectiveMethod}" not found` }
          };
        }
      }
    } catch (err) {
      console.error('MCP internal execution error:', err);
      return {
        jsonrpc: '2.0',
        id: rpcId,
        error: { code: -32603, message: 'Internal server error: ' + err.message }
      };
    }
  };

  if (Array.isArray(body)) {
    if (body.length > 10) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: { code: -32600, message: 'Batch limit exceeded: Maximum 10 requests allowed per batch.' }
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    const responses = (await Promise.all(body.map(handleSingleMessage))).filter(Boolean);
    return NextResponse.json(responses, { headers: CORS_HEADERS });
  }

  const response = await handleSingleMessage(body);
  if (!response) {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  }

  return NextResponse.json(response, { headers: CORS_HEADERS });
}
