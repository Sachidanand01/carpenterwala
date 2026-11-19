import { executeTool } from '../lib/mcp/tool-handlers.js';
import { MCP_TOOLS } from '../lib/mcp/tool-definitions.js';
import { checkRateLimit } from '../lib/rate-limiter.js';

async function runTests() {
  console.log('=== 1. Validating MCP Tool Definitions ===');
  console.log(`Found ${MCP_TOOLS.length} declared tools.`);
  if (MCP_TOOLS.length !== 6) {
    throw new Error(`Expected 6 tools, found ${MCP_TOOLS.length}`);
  }
  const names = MCP_TOOLS.map(t => t.name);
  console.log(' Tools:', names.join(', '));
  if (!names.includes('start_carpenterwala_onboarding') || !names.includes('check_onboarding_status')) {
    throw new Error('Missing Pan-India onboarding tools in MCP_TOOLS');
  }
  if (names.includes('initiate_technician_onboarding') || names.includes('check_technician_application_status')) {
    throw new Error('Legacy OTP onboarding tools should be removed from MCP_TOOLS');
  }

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

  console.log('\n=== 6. Testing start_carpenterwala_onboarding ===');
  const freshPhone = '9876543210';
  const onboardRes = await executeTool('start_carpenterwala_onboarding', {
    full_name: 'Ram Singh',
    phone_number: freshPhone,
    trade: 'carpentry',
    city: 'Bangalore',
    locality: 'HSR Layout Sector 2',
    experience_years: 6
  }, { origin: 'https://carpenterwala.com', ip: '10.0.0.1' });

  console.log('Onboarding response success:', onboardRes.success);
  console.log('Verify URL generated:', onboardRes.verify_url);
  console.log('QR payload matches verify_url:', onboardRes.qr_payload === onboardRes.verify_url);

  if (!onboardRes.success || !onboardRes.session_token || !onboardRes.verify_url?.includes(`/v/${onboardRes.session_token}`)) {
    throw new Error('start_carpenterwala_onboarding failed to return valid verify_url & session_token!');
  }
  console.log(' Pan-India Dual-Handoff onboarding verification passed.');

  console.log('\n=== All Local MCP Logic Tests Passed Successfully! ===');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
