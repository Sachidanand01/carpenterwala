import { NextResponse } from 'next/server';
import { MCP_TOOLS } from '@/lib/mcp/tool-definitions';
import { executeTool } from '@/lib/mcp/tool-handlers';

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_INFO = {
  name: 'carpenterwala-mcp-server',
  version: '1.0.0',
  description: 'Carpenterwala Bangalore Home Improvement Marketplace WebMCP Server (0% Commission)'
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, mcp-session-id',
  'Access-Control-Expose-Headers': 'Content-Type, mcp-session-id'
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

function getClientContext(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '127.0.0.1';
  const host = request.headers.get('host') || 'carpenterwala.com';
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const origin = `${proto}://${host}`;
  return { ip, origin };
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

    // Handle notifications (no id)
    if (id === undefined || id === null) {
      if (method === 'notifications/initialized') {
        return null; // No response needed for notification
      }
      return null;
    }

    try {
      switch (method) {
        case 'initialize': {
          return {
            jsonrpc: '2.0',
            id,
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
            id,
            result: {}
          };
        }

        case 'tools/list': {
          return {
            jsonrpc: '2.0',
            id,
            result: {
              tools: MCP_TOOLS
            }
          };
        }

        case 'tools/call': {
          const toolName = params?.name;
          const toolArgs = params?.arguments || {};

          if (!toolName) {
            return {
              jsonrpc: '2.0',
              id,
              error: { code: -32602, message: 'Missing tool name in params' }
            };
          }

          try {
            const toolResult = await executeTool(toolName, toolArgs, context);
            return {
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult, null, 2)
                  }
                ],
                isError: false
              }
            };
          } catch (toolErr) {
            return {
              jsonrpc: '2.0',
              id,
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
            id,
            error: { code: -32601, message: `Method "${method}" not found` }
          };
        }
      }
    } catch (err) {
      console.error('MCP internal execution error:', err);
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: 'Internal server error: ' + err.message }
      };
    }
  };

  if (Array.isArray(body)) {
    const responses = (await Promise.all(body.map(handleSingleMessage))).filter(Boolean);
    return NextResponse.json(responses, { headers: CORS_HEADERS });
  }

  const response = await handleSingleMessage(body);
  if (!response) {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  }

  return NextResponse.json(response, { headers: CORS_HEADERS });
}
