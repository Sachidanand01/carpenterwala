import { executeTool } from '../lib/mcp/tool-handlers.js';
import { MCP_TOOLS } from '../lib/mcp/tool-definitions.js';
import { checkRateLimit } from '../lib/rate-limiter.js';
import { decryptToken } from '../lib/crypto.js';

async function runTests() {
  console.log('=== 1. Validating MCP Tool Definitions ===');
  console.log(`Found ${MCP_TOOLS.length} declared tools.`);
  if (MCP_TOOLS.length !== 6) {
    throw new Error(`Expected 6 tools, found ${MCP_TOOLS.length}`);
  }
  console.log(' Tools:', MCP_TOOLS.map(t => t.name).join(', '));

  console.log('\n=== 2. Testing Rate Limiter (Max 3/day) ===');
  const testPhone = '9900112233';
  const testIp = '192.168.1.50';

  const r1 = checkRateLimit({ phone: testPhone, ip: testIp, maxAttempts: 3 });
  console.log('Attempt 1 allowed:', r1.allowed, 'remaining:', r1.remaining);
  const r2 = checkRateLimit({ phone: testPhone, ip: testIp, maxAttempts: 3 });
  console.log('Attempt 2 allowed:', r2.allowed, 'remaining:', r2.remaining);
  const r3 = checkRateLimit({ phone: testPhone, ip: testIp, maxAttempts: 3 });
  console.log('Attempt 3 allowed:', r3.allowed, 'remaining:', r3.remaining);
  const r4 = checkRateLimit({ phone: testPhone, ip: testIp, maxAttempts: 3 });
  console.log('Attempt 4 allowed:', r4.allowed, 'remaining:', r4.remaining, 'reason:', r4.reason);

  if (r1.allowed !== true || r2.allowed !== true || r3.allowed !== true || r4.allowed !== false) {
    throw new Error('Rate limit enforcement failed!');
  }
  console.log(' Rate limiter strictly enforced 3-attempt ceiling.');

  console.log('\n=== 3. Testing get_service_rate_card ===');
  const ratesResult = await executeTool('get_service_rate_card', {
    serviceCategory: 'carpentry',
    jobType: 'lock'
  }, { origin: 'https://carpenterwala.com' });
  console.log('Rates returned:', ratesResult.rates?.length, 'tasks. First task:', ratesResult.rates?.[0]?.task);

  console.log('\n=== 4. Testing calculate_service_estimate (paint_cost) ===');
  const paintEstimate = await executeTool('calculate_service_estimate', {
    calculatorType: 'paint_cost',
    params: { flatType: '2bhk', carpetAreaSqFt: 900, paintQuality: 'premium' }
  }, { origin: 'https://carpenterwala.com' });
  console.log('Paintable area:', paintEstimate.paintableWallAreaSqFt, 'sq ft, liters:', paintEstimate.paintLitersRequired, 'estimated INR:', paintEstimate.estimatedCostINR);

  console.log('\n=== 5. Testing calculate_service_estimate (water_wastage) ===');
  const waterEstimate = await executeTool('calculate_service_estimate', {
    calculatorType: 'water_wastage',
    params: { drippingTaps: 2, dripRate: 'medium' }
  }, { origin: 'https://carpenterwala.com' });
  console.log('Monthly water loss:', waterEstimate.monthlyWaterLossLitres, 'litres, loss ₹:', waterEstimate.monthlyFinancialLossINR);

  console.log('\n=== 6. Testing initiate_technician_onboarding ===');
  const freshPhone = '9876543210';
  const onboardRes = await executeTool('initiate_technician_onboarding', {
    name: 'Ram Singh',
    phone: freshPhone,
    trade: 'carpentry',
    location: 'HSR Layout Sector 2'
  }, { origin: 'https://carpenterwala.com', ip: '10.0.0.1' });

  console.log('Onboarding response success:', onboardRes.success);
  console.log('Onboarding URL generated:', onboardRes.onboardingUrl);

  const urlObj = new URL(onboardRes.onboardingUrl);
  const sessionToken = urlObj.searchParams.get('session');
  console.log('Encrypted session token present:', !!sessionToken);

  const decrypted = decryptToken(sessionToken);
  console.log('Decrypted session payload:', {
    type: decrypted?.type,
    name: decrypted?.name,
    phone: decrypted?.phone,
    trade: decrypted?.trade,
    location: decrypted?.location
  });

  if (decrypted?.type !== 'ai_pro_onboarding' || decrypted?.name !== 'Ram Singh') {
    throw new Error('Session token decryption verification mismatch!');
  }
  console.log(' Hybrid Secure Token generation & verification passed.');

  console.log('\n=== All Local MCP Logic Tests Passed Successfully! ===');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
