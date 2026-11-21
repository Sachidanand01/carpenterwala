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
  const isProd = process.env.NODE_ENV === 'production';
  let serverUrl = 'https://carpenterwala.com';
  if (!isProd) {
    const host = request.headers.get('host') || 'localhost:3000';
    const proto = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    serverUrl = `${proto}://${host}`;
  }

  const paths = {};

  const CUSTOMER_TOOLS = new Set(['get_my_warranties', 'get_my_bookings', 'book_service_job']);
  const PRO_TOOLS = new Set(['get_my_assigned_jobs', 'update_job_status', 'get_my_pro_dashboard', 'set_my_availability']);

  for (const tool of MCP_TOOLS) {
    const isGetFriendly = [
      'search_verified_pros',
      'get_service_rate_card',
      'calculate_service_estimate',
      'check_onboarding_status',
      'get_my_warranties',
      'get_my_bookings',
      'get_my_assigned_jobs',
      'get_my_pro_dashboard'
    ].includes(tool.name);

    let securityRequirement = [];
    if (CUSTOMER_TOOLS.has(tool.name)) {
      securityRequirement = [{ oauth2: ['customer'] }];
    } else if (PRO_TOOLS.has(tool.name)) {
      securityRequirement = [{ oauth2: ['pro'] }];
    }

    const postOp = {
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
        '401': {
          description: 'OAuth 2.1 authentication required (valid Bearer token missing)'
        },
        '429': {
          description: 'Rate limit exceeded (max 5 onboarding sessions/24h per phone, 60 MCP requests/hr per IP)'
        }
      }
    };

    if (securityRequirement.length > 0) {
      postOp.security = securityRequirement;
    }

    paths[`/api/mcp/tools/${tool.name}`] = {
      post: postOp
    };

    if (isGetFriendly) {
      const getOp = {
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
          },
          '401': {
            description: 'OAuth 2.1 authentication required'
          }
        }
      };

      if (securityRequirement.length > 0) {
        getOp.security = securityRequirement;
      }

      paths[`/api/mcp/tools/${tool.name}`].get = getOp;
    }
  }

  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Carpenterwala AI Agent & MCP Tool API',
      version: '1.0.0',
      description: 'Official API and Model Context Protocol (MCP) tools for Carpenterwala — Pan-India 0% commission technician onboarding, Bangalore verified marketplace, and Customer/Pro OAuth 2.1 self-service portals.',
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
      securitySchemes: {
        oauth2: {
          type: 'oauth2',
          description: 'Carpenterwala OAuth 2.1 Authorization Code Grant with PKCE',
          flows: {
            authorizationCode: {
              authorizationUrl: `${serverUrl}/oauth/authorize`,
              tokenUrl: `${serverUrl}/api/oauth/token`,
              scopes: {
                customer: 'Access appliance warranties and repair bookings',
                pro: 'Access assigned leads and job management'
              }
            }
          }
        }
      }
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
