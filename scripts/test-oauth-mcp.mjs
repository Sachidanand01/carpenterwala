/**
 * Comprehensive verification suite for Carpenterwala OAuth 2.1 PKCE & Authenticated MCP Tools
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// 1. Load .env.local BEFORE importing modules that depend on Supabase environment variables
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.warn('Could not read .env.local:', e.message);
}

// 2. Dynamically import modules now that process.env is populated
const {
  verifyCodeChallenge,
  isValidRedirectUri,
  createAuthorizationCode,
  verifyAuthorizationCode,
  createOAuthAccessToken,
  verifyOAuthAccessToken
} = await import('../lib/oauth.js');
const { executeTool } = await import('../lib/mcp/tool-handlers.js');
const { MCP_TOOLS } = await import('../lib/mcp/tool-definitions.js');

let passed = 0;
let failed = 0;

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n=== CARPENTERWALA OAUTH 2.1 & MCP TOOLS VERIFICATION ===\n');

  // Test 1: Redirect URI Validation
  console.log('1. Redirect URI Validation:');
  assert(isValidRedirectUri('https://chatgpt.com/api/v1/auth/callback'), 'Validates ChatGPT redirect URI');
  assert(isValidRedirectUri('https://claude.ai/oauth/callback'), 'Validates Claude redirect URI');
  assert(isValidRedirectUri('http://localhost:3000/callback'), 'Validates localhost dev URI');
  assert(isValidRedirectUri('https://carpenterwala.com/oauth/callback'), 'Validates Carpenterwala URI');
  assert(!isValidRedirectUri('https://malicious-site.com/callback'), 'Rejects unauthorized redirect URI');

  // Test 2: PKCE Verification (RFC 7636 S256 & plain)
  console.log('\n2. PKCE Verification (S256 & plain):');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

  assert(verifyCodeChallenge(codeVerifier, codeChallenge, 'S256'), 'Validates matching S256 code_verifier');
  assert(!verifyCodeChallenge('wrong_verifier', codeChallenge, 'S256'), 'Rejects non-matching S256 code_verifier');
  assert(verifyCodeChallenge('test_plain_123', 'test_plain_123', 'plain'), 'Validates plain code_verifier');
  assert(!verifyCodeChallenge('wrong_plain', 'test_plain_123', 'plain'), 'Rejects non-matching plain code_verifier');

  // Test 3: Authorization Code Lifecycle
  console.log('\n3. Authorization Code Lifecycle:');
  const authCode = createAuthorizationCode({
    phone: '9876543210',
    role: 'customer',
    clientId: 'chatgpt',
    redirectUri: 'https://chatgpt.com/api/v1/auth/callback',
    codeChallenge,
    codeChallengeMethod: 'S256',
    scopes: ['customer']
  });
  assert(typeof authCode === 'string' && authCode.length > 20, 'Issues encrypted authorization code string');

  const decryptedCode = verifyAuthorizationCode(authCode);
  assert(decryptedCode !== null, 'Successfully unpacks valid authorization code');
  assert(decryptedCode?.phone === '9876543210', 'Preserves phone number in authorization code');
  assert(decryptedCode?.role === 'customer', 'Preserves customer role');
  assert(decryptedCode?.codeChallenge === codeChallenge, 'Preserves code_challenge');
  assert(verifyAuthorizationCode('invalid_tampered_code') === null, 'Rejects invalid or tampered authorization code');

  // Test 4: Access Token Minting & Bearer Parsing
  console.log('\n4. OAuth 2.1 Access Token Verification:');
  const accessToken = createOAuthAccessToken({
    phone: '9876543210',
    role: 'customer',
    clientId: 'chatgpt',
    scopes: ['customer']
  });
  assert(typeof accessToken === 'string' && accessToken.length > 20, 'Issues encrypted access token');

  const tokenWithBearer = `Bearer ${accessToken}`;
  const verifiedToken = verifyOAuthAccessToken(tokenWithBearer);
  assert(verifiedToken !== null, 'Successfully verifies Bearer token header');
  assert(verifiedToken?.phone === '9876543210', 'Payload contains authenticated customer phone');
  assert(verifiedToken?.role === 'customer', 'Payload contains customer role');
  assert(verifyOAuthAccessToken('Bearer wrong_token') === null, 'Rejects forged Bearer token');
  assert(verifyOAuthAccessToken('') === null, 'Rejects empty token header');

  // Test 5: Tool Count and Schema Registry
  console.log('\n5. Tool Registry Integrity:');
  assert(MCP_TOOLS.length === 13, 'MCP_TOOLS registry contains exactly 13 tools', `Actual: ${MCP_TOOLS.length}`);

  const toolNames = MCP_TOOLS.map(t => t.name);
  const expectedTools = [
    'start_carpenterwala_onboarding',
    'check_onboarding_status',
    'search_verified_pros',
    'get_service_rate_card',
    'calculate_service_estimate',
    'request_service_callback',
    'get_my_warranties',
    'get_my_bookings',
    'book_service_job',
    'get_my_assigned_jobs',
    'update_job_status',
    'get_my_pro_dashboard',
    'set_my_availability'
  ];
  for (const name of expectedTools) {
    assert(toolNames.includes(name), `Registry includes tool "${name}"`);
  }

  // Test 6: Public Tools Execute Without Auth
  console.log('\n6. Public Tools Execution (No Auth Required):');
  const rateCardRes = await executeTool('get_service_rate_card', { serviceCategory: 'carpentry' }, { ip: '127.0.0.1' });
  assert(Boolean(rateCardRes.rates), 'get_service_rate_card succeeds without auth');
  assert(Array.isArray(rateCardRes.rates) && rateCardRes.rates.length > 0, 'Rate card returns labor rates');

  const estimateRes = await executeTool('calculate_service_estimate', {
    calculatorType: 'paint_cost',
    params: { carpetAreaSqFt: 1000 }
  }, { ip: '127.0.0.1' });
  assert(Boolean(estimateRes.calculator), 'calculate_service_estimate succeeds without auth');

  // Test 7: Customer Tools Auth Gating
  console.log('\n7. Customer Tools Auth Gating:');
  const unauthWarranties = await executeTool('get_my_warranties', {}, { ip: '127.0.0.1', auth: null });
  assert(unauthWarranties.success === false, 'get_my_warranties fails without auth');
  assert(unauthWarranties.error === 'AUTH_REQUIRED', 'get_my_warranties returns AUTH_REQUIRED');
  assert(Boolean(unauthWarranties.authorizationUrl), 'get_my_warranties provides authorizationUrl');

  const unauthBookings = await executeTool('get_my_bookings', {}, { ip: '127.0.0.1', auth: null });
  assert(unauthBookings.success === false, 'get_my_bookings fails without auth');
  assert(unauthBookings.error === 'AUTH_REQUIRED', 'get_my_bookings returns AUTH_REQUIRED');

  // Customer Tool Execution With Valid Customer Token (phone with real test warranty: 6459509506)
  const customerAuth = { phone: '6459509506', role: 'customer' };
  const customerWarranties = await executeTool('get_my_warranties', {}, { ip: '127.0.0.1', auth: customerAuth });
  assert(customerWarranties.success === true, 'get_my_warranties succeeds with customer auth', JSON.stringify(customerWarranties));
  assert(customerWarranties.phone === '6459509506', 'get_my_warranties returns customer phone');
  assert(Array.isArray(customerWarranties.warranties), 'get_my_warranties returns warranties array');

  const customerBookings = await executeTool('get_my_bookings', {}, { ip: '127.0.0.1', auth: customerAuth });
  assert(customerBookings.success === true, 'get_my_bookings succeeds with customer auth', JSON.stringify(customerBookings));

  // Customer Direct Booking
  const bookingRes = await executeTool('book_service_job', {
    trade: 'carpentry',
    locality: 'Indiranagar',
    taskDescription: 'Modular wardrobe soft-close hinge replacement'
  }, { ip: '127.0.0.1', auth: customerAuth });
  assert(bookingRes.success === true, 'book_service_job creates booking with customer auth');
  assert(Boolean(bookingRes.bookingId), 'book_service_job returns bookingId');

  // Test 8: Pro Tools Auth & Role Gating
  console.log('\n8. Pro Tools Auth & Role Gating:');
  const unauthAssigned = await executeTool('get_my_assigned_jobs', {}, { ip: '127.0.0.1', auth: null });
  assert(unauthAssigned.success === false, 'get_my_assigned_jobs fails without auth');
  assert(unauthAssigned.error === 'AUTH_REQUIRED', 'get_my_assigned_jobs returns AUTH_REQUIRED');

  // Pro tool called with customer-only role
  const customerCallingProTool = await executeTool('get_my_assigned_jobs', {}, { ip: '127.0.0.1', auth: customerAuth });
  assert(customerCallingProTool.success === false, 'Pro tool rejects customer-only role');
  assert(customerCallingProTool.error === 'PRO_ROLE_REQUIRED', 'Pro tool returns PRO_ROLE_REQUIRED');

  // Pro tool called with verified pro in database (Syed Nowman, ID 9, CW-RSN3, phone 9901122941)
  const proAuth = { phone: '9901122941', role: 'pro', proId: 9 };
  const proAssigned = await executeTool('get_my_assigned_jobs', {}, { ip: '127.0.0.1', auth: proAuth });
  assert(proAssigned.success === true, 'get_my_assigned_jobs succeeds with pro auth', JSON.stringify(proAssigned));

  const proDashboard = await executeTool('get_my_pro_dashboard', {}, { ip: '127.0.0.1', auth: proAuth });
  assert(proDashboard.success === true, 'get_my_pro_dashboard succeeds with pro auth', JSON.stringify(proDashboard));
  assert(proDashboard.proCode === 'CW-RSN3', 'pro dashboard returns correct pro_code');

  // Pro Availability Toggle
  const availRes = await executeTool('set_my_availability', { accepting_leads: true }, { ip: '127.0.0.1', auth: proAuth });
  assert(availRes.success === true, 'set_my_availability succeeds with pro auth', JSON.stringify(availRes));
  assert(availRes.acceptingLeads === true, 'set_my_availability enables accepting_leads');

  // Summary
  console.log('\n========================================');
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
