import { POST } from '../app/api/ai-onboard-chat/route.js';

async function runTest() {
  console.log('--- Testing Phase 4: AI Onboarding Chat API ---');

  // Test Turn 1: Handyman says their name and trade in Hindi/Hinglish
  const turn1Req = new Request('http://localhost:3000/api/ai-onboard-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Mera naam Ramesh Kumar hai, main Whitefield Bangalore me carpenter hoon',
      messages: [],
      current_data: {},
      lang: 'hi'
    })
  });

  const res1 = await POST(turn1Req);
  const data1 = await res1.json();
  console.log('\n[Turn 1 Response]:');
  console.log('Success:', data1.success);
  console.log('Extracted Data:', data1.extracted_data);
  console.log('Is Complete:', data1.is_complete);
  console.log('Missing Fields:', data1.missing_fields);
  console.log('AI Reply:', data1.reply);

  if (!data1.extracted_data.full_name || !data1.extracted_data.trade || !data1.extracted_data.locality) {
    throw new Error('Failed to extract name, trade, or locality in Turn 1');
  }

  // Test Turn 2: Handyman provides mobile number and experience
  const turn2Req = new Request('http://localhost:3000/api/ai-onboard-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', host: 'localhost:3000' },
    body: JSON.stringify({
      message: 'Mera mobile number 9876543210 hai aur mujhe 8 saal ka experience hai',
      messages: [
        { role: 'user', content: 'Mera naam Ramesh Kumar hai, main Whitefield Bangalore me carpenter hoon' },
        { role: 'assistant', content: data1.reply }
      ],
      current_data: data1.extracted_data,
      lang: 'hi'
    })
  });

  const res2 = await POST(turn2Req);
  const data2 = await res2.json();
  console.log('\n[Turn 2 Response]:');
  console.log('Success:', data2.success);
  console.log('Extracted Data:', data2.extracted_data);
  console.log('Is Complete:', data2.is_complete);
  console.log('Missing Fields:', data2.missing_fields);
  console.log('AI Reply:', data2.reply);
  console.log('Onboarding Session:', data2.onboarding);

  if (!data2.is_complete) {
    throw new Error('Turn 2 should be complete with all required details');
  }

  if (!data2.onboarding?.session_token || !data2.onboarding?.verify_url || !data2.onboarding?.qr_code_url) {
    throw new Error('Onboarding handoff details missing from response');
  }

  console.log('\n✅ Phase 4 AI Onboard Chat test passed successfully!');
}

runTest().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
