import { GET as mcpGet, POST as mcpPost } from '../app/api/mcp/route.js';
import { GET as openApiGet } from '../app/api/mcp/openapi.json/route.js';
import { GET as aiSessionGet } from '../app/api/pro/ai-session/route.js';
import { encryptToken } from '../lib/crypto.js';

async function testRoutes() {
  console.log('=== 1. Testing GET /api/mcp Discovery ===');
  const req1 = new Request('https://carpenterwala.com/api/mcp', {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  const res1 = await mcpGet(req1);
  const data1 = await res1.json();
  console.log('Status:', res1.status, 'Server name:', data1.server?.name, 'Tools count:', data1.toolsCount);
  if (data1.status !== 'online' || data1.toolsCount !== 6) {
    throw new Error('GET /api/mcp returned invalid discovery response');
  }

  console.log('\n=== 2. Testing POST /api/mcp (JSON-RPC initialize) ===');
  const reqInit = new Request('https://carpenterwala.com/api/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2024-11-05' }
    })
  });
  const resInit = await mcpPost(reqInit);
  const dataInit = await resInit.json();
  console.log('JSON-RPC init response:', dataInit);
  if (dataInit.result?.serverInfo?.name !== 'carpenterwala-mcp-server') {
    throw new Error('MCP initialize response mismatch');
  }

  console.log('\n=== 3. Testing POST /api/mcp (JSON-RPC tools/list) ===');
  const reqList = new Request('https://carpenterwala.com/api/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list'
    })
  });
  const resList = await mcpPost(reqList);
  const dataList = await resList.json();
  console.log('Tools listed:', dataList.result?.tools?.length);
  if (dataList.result?.tools?.length !== 6) {
    throw new Error('tools/list did not return 6 tools');
  }

  console.log('\n=== 4. Testing POST /api/mcp (JSON-RPC tools/call for rate card) ===');
  const reqCall = new Request('https://carpenterwala.com/api/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'get_service_rate_card',
        arguments: { serviceCategory: 'plumbing', jobType: 'tap' }
      }
    })
  });
  const resCall = await mcpPost(reqCall);
  const dataCall = await resCall.json();
  console.log('tools/call content type:', dataCall.result?.content?.[0]?.type);
  const parsedContent = JSON.parse(dataCall.result?.content?.[0]?.text);
  console.log('Returned rates for:', parsedContent.category, 'Found tasks:', parsedContent.rates?.length);

  console.log('\n=== 5. Testing GET /api/mcp/openapi.json ===');
  const reqOpenApi = new Request('https://carpenterwala.com/api/mcp/openapi.json', { method: 'GET' });
  const resOpenApi = await openApiGet(reqOpenApi);
  const dataOpenApi = await resOpenApi.json();
  console.log('OpenAPI Version:', dataOpenApi.openapi, 'Title:', dataOpenApi.info?.title);
  console.log('Paths mapped in OpenAPI:', Object.keys(dataOpenApi.paths).length);
  if (!dataOpenApi.paths['/api/mcp/tools/initiate_technician_onboarding']) {
    throw new Error('Missing initiate_technician_onboarding in OpenAPI paths');
  }

  console.log('\n=== 6. Testing GET /api/pro/ai-session with valid token ===');
  const sampleToken = encryptToken({
    type: 'ai_pro_onboarding',
    name: 'Suresh Kumar',
    phone: '9845012345',
    trade: 'Painter',
    location: 'Indiranagar',
    expiresAt: Date.now() + 30 * 60 * 1000
  });

  const reqSession = new Request(`https://carpenterwala.com/api/pro/ai-session?session=${encodeURIComponent(sampleToken)}`);
  const resSession = await aiSessionGet(reqSession);
  const dataSession = await resSession.json();
  console.log('Session resolved:', dataSession);
  if (!dataSession.success || dataSession.data?.name !== 'Suresh Kumar') {
    throw new Error('AI session endpoint failed to decrypt valid token');
  }

  console.log('\n=== All API Route Handlers Tested and Verified Successfully! ===');
}

testRoutes().catch(err => {
  console.error('Route test error:', err);
  process.exit(1);
});
