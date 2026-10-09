import { NextResponse } from 'next/server';
import { MCP_TOOLS } from '@/lib/mcp/tool-definitions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request) {
  const host = request.headers.get('host') || 'carpenterwala.com';
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const serverUrl = `${proto}://${host}`;

  const paths = {};

  for (const tool of MCP_TOOLS) {
    const isGetFriendly = ['search_verified_pros', 'get_service_rate_card'].includes(tool.name);

    paths[`/api/mcp/tools/${tool.name}`] = {
      post: {
        summary: tool.title,
        description: tool.description,
        operationId: tool.name,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: tool.inputSchema
            }
          }
        },
        responses: {
          '200': {
            description: 'Successful execution',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    tool: { type: 'string' },
                    result: { type: 'object' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error or invalid input parameters'
          },
          '429': {
            description: 'Rate limit exceeded (max 3/day per phone)'
          }
        }
      }
    };

    if (isGetFriendly) {
      paths[`/api/mcp/tools/${tool.name}`].get = {
        summary: `${tool.title} (Query)`,
        description: tool.description,
        operationId: `${tool.name}_get`,
        parameters: Object.entries(tool.inputSchema.properties || {}).map(([paramName, paramDef]) => ({
          name: paramName,
          in: 'query',
          required: (tool.inputSchema.required || []).includes(paramName),
          description: paramDef.description,
          schema: {
            type: paramDef.type || 'string'
          }
        })),
        responses: {
          '200': {
            description: 'Query results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    tool: { type: 'string' },
                    result: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      };
    }
  }

  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Carpenterwala AI Agent & MCP Tool API',
      version: '1.0.0',
      description: 'Official API and Model Context Protocol tools for Carpenterwala Bangalore marketplace. Connects homeowners and service technicians (carpenters, painters, plumbers, electricians) at 0% platform commission.',
      contact: {
        name: 'Carpenterwala Support',
        email: 'contact@carpenterwala.com',
        url: 'https://carpenterwala.com'
      }
    },
    servers: [
      {
        url: serverUrl,
        description: 'Current Environment API Server'
      },
      {
        url: 'https://carpenterwala.com',
        description: 'Production Live Server'
      }
    ],
    paths,
    components: {
      securitySchemes: {}
    }
  };

  return NextResponse.json(spec, {
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
