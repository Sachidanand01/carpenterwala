import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';

/**
 * Loads .env.local into process.env when not already provided (e.g. plain `node scripts/test-ai-onboarding.mjs`)
 */
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex <= 0) continue;
    const key = line.slice(0, eqIndex).trim();
    let val = line.slice(eqIndex + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function waitForServerReady(baseUrl, getExitState, timeoutMs = 45000) {
  const startedAt = Date.now();
  let lastErr = '';
  while (Date.now() - startedAt < timeoutMs) {
    const exitState = getExitState ? getExitState() : null;
    if (exitState) {
      throw new Error(`Next.js server exited prematurely (code=${exitState.code}, signal=${exitState.signal}).`);
    }
    try {
      const res = await fetch(`${baseUrl}/api/mcp`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(15000)
      });
      if (res.ok) return;
      lastErr = `HTTP ${res.status}`;
    } catch (err) {
      lastErr = err?.message || String(err);
    }
    await new Promise((r) => setTimeout(r, 750));
  }
  throw new Error(`Next.js server at ${baseUrl} did not become ready within ${timeoutMs}ms (last error: ${lastErr}).`);
}

function stopChildProcess(child) {
  if (!child || child.killed) return;
  try {
    if (process.platform === 'win32' && child.pid) {
      execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' });
    } else {
      child.kill('SIGTERM');
    }
  } catch {
    try {
      child.kill('SIGKILL');
    } catch {
      // Ignore already-exited process
    }
  }
}

async function callMcpTool(baseUrl, toolName, args, id = 1) {
  const res = await fetch(`${baseUrl}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    })
  });

  assert.equal(res.status, 200, `POST /api/mcp (${toolName}) returned HTTP ${res.status}`);
  const rpc = await res.json();
  assert.equal(rpc.jsonrpc, '2.0', 'MCP response must be JSON-RPC 2.0');
  assert.equal(rpc.id, id, 'MCP response id must match request id');
  assert.ok(!rpc.error, `MCP JSON-RPC returned error: ${JSON.stringify(rpc.error)}`);
  assert.ok(rpc.result, 'MCP response missing result');
  assert.equal(
    rpc.result.isError,
    false,
    `MCP tool "${toolName}" failed: ${rpc.result.content?.[0]?.text || 'unknown error'}`
  );

  const parsed =
    rpc.result.structuredContent ||
    JSON.parse(rpc.result.content?.[0]?.text || '{}');

  return { rpc, data: parsed };
}

async function run() {
  loadEnvLocal();

  const argBaseUrl = process.argv.find((a) => a.startsWith('--base-url='))?.split('=')[1];
  const keepTestData = process.argv.includes('--keep-test-data');
  let baseUrl = argBaseUrl || process.env.TEST_BASE_URL || '';
  let serverProc = null;
  let serverLogs = '';

  const createdSessionIds = [];
  const createdProfileIds = [];

  try {
    if (!baseUrl) {
      const port = await getFreePort();
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Starting Next.js dev server at ${baseUrl} ...`);

      const nextBin = path.resolve(process.cwd(), 'node_modules/next/dist/bin/next');
      serverProc = spawn(process.execPath, [nextBin, 'dev', '-p', String(port), '-H', '127.0.0.1'], {
        cwd: process.cwd(),
        env: { ...process.env, PORT: String(port) },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let exitState = null;
      serverProc.on('exit', (code, signal) => {
        exitState = { code, signal };
      });
      serverProc.stdout.on('data', (chunk) => {
        serverLogs += chunk.toString();
      });
      serverProc.stderr.on('data', (chunk) => {
        serverLogs += chunk.toString();
      });

      await waitForServerReady(baseUrl, () => exitState);
      console.log('Next.js dev server is ready.\n');
    } else {
      baseUrl = baseUrl.replace(/\/$/, '');
      console.log(`Using existing Next.js server at ${baseUrl}\n`);
    }

    // Track pre-existing profiles on our synthetic test numbers so cleanup never deletes real records
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

    const testPros = [
      {
        full_name: 'Ramesh E2E Test',
        phone_number: '9999000101',
        email: 'ramesh.e2e@example.com',
        trade: 'carpentry',
        city: 'Bangalore',
        locality: 'HSR Layout',
        pincode: '560102',
        experience_years: 8,
        lookupMode: 'token'
      },
      {
        full_name: 'Suresh E2E Test',
        phone_number: '9999000102',
        trade: 'plumbing',
        city: 'Mumbai',
        locality: 'Andheri West',
        pincode: '400053',
        experience_years: 5,
        lookupMode: 'phone'
      },
      {
        full_name: 'Mahesh E2E Test',
        phone_number: '9999000103',
        trade: 'electrical',
        city: 'Delhi',
        locality: 'Lajpat Nagar',
        pincode: '110024',
        experience_years: 10,
        lookupMode: 'token'
      }
    ];

    const preExistingPhones = new Set();
    if (supabase) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('phone')
        .in('phone', testPros.map((p) => p.phone_number));
      for (const row of existing || []) {
        if (row.phone) preExistingPhones.add(row.phone);
      }
    }

    // Verify MCP server discovery first
    console.log('=== 0. Checking GET /api/mcp Discovery ===');
    const discoveryRes = await fetch(`${baseUrl}/api/mcp`, {
      headers: { Accept: 'application/json' }
    });
    assert.equal(discoveryRes.status, 200, 'GET /api/mcp should return 200');
    const discoveryJson = await discoveryRes.json();
    assert.equal(discoveryJson.status, 'online');
    const toolNames = (discoveryJson.tools || []).map((t) => t.name);
    assert.ok(toolNames.includes('start_carpenterwala_onboarding'), 'start_carpenterwala_onboarding must be exposed');
    assert.ok(toolNames.includes('check_onboarding_status'), 'check_onboarding_status must be exposed');
    console.log(`PASS: /api/mcp online with ${discoveryJson.toolsCount} tools.\n`);

    let rpcId = 1;

    for (const pro of testPros) {
      console.log(`=== Testing End-to-End Flow: ${pro.full_name} (${pro.trade} | ${pro.locality}, ${pro.city}) ===`);

      // 1. Call start_carpenterwala_onboarding via /api/mcp
      const { data: startRes } = await callMcpTool(
        baseUrl,
        'start_carpenterwala_onboarding',
        {
          phone_number: pro.phone_number,
          email: pro.email,
          full_name: pro.full_name,
          trade: pro.trade,
          city: pro.city,
          locality: pro.locality,
          pincode: pro.pincode,
          experience_years: pro.experience_years
        },
        rpcId++
      );

      assert.equal(startRes.success, true, 'start_carpenterwala_onboarding should succeed');
      assert.equal(startRes.status, 'PENDING_UPLOAD', 'Initial session status must be PENDING_UPLOAD');
      assert.ok(
        startRes.session_token && startRes.session_token.length >= 6,
        `Expected valid session_token, got "${startRes.session_token}"`
      );
      assert.equal(startRes.professional?.city, pro.city, 'City should match');
      assert.equal(startRes.professional?.locality, pro.locality, 'Locality should match');
      assert.equal(startRes.professional?.trade, pro.trade, 'Trade should match');
      console.log(`  1. start_carpenterwala_onboarding OK -> token=${startRes.session_token}, status=${startRes.status}`);

      // 2. Verify verify_url and QR payload
      assert.ok(startRes.verify_url, 'verify_url must be present');
      const parsedVerifyUrl = new URL(startRes.verify_url);
      assert.equal(
        parsedVerifyUrl.pathname,
        `/v/${startRes.session_token}`,
        `verify_url pathname should be /v/${startRes.session_token}`
      );
      assert.equal(startRes.qr_payload, startRes.verify_url, 'qr_payload must equal verify_url');
      assert.equal(startRes.handoff?.mobile?.url, startRes.verify_url, 'Mobile handoff url must match verify_url');
      assert.equal(startRes.handoff?.desktop?.qr_payload, startRes.verify_url, 'Desktop handoff qr_payload must match verify_url');
      assert.ok(startRes.qr_code_url, 'qr_code_url must be present');

      const parsedQrUrl = new URL(startRes.qr_code_url);
      assert.equal(
        parsedQrUrl.searchParams.get('data'),
        startRes.verify_url,
        'QR code URL data parameter must decode to verify_url'
      );
      assert.ok(
        startRes.markdown?.includes(`[Tap Here to Upload](${startRes.verify_url})`),
        'Markdown output must include mobile clickable upload link'
      );

      // Also verify /api/onboarding/status/[token] and /v/[token] are reachable
      const preStatusRes = await fetch(`${baseUrl}/api/onboarding/status/${encodeURIComponent(startRes.session_token)}`);
      assert.equal(preStatusRes.status, 200, 'GET /api/onboarding/status/[token] must return 200');
      const preStatusJson = await preStatusRes.json();
      assert.equal(preStatusJson.status, 'PENDING_UPLOAD', 'Status endpoint should report PENDING_UPLOAD before completion');
      if (preStatusJson.session?.id) {
        createdSessionIds.push(preStatusJson.session.id);
      }

      const verifyPageRes = await fetch(`${baseUrl}/v/${encodeURIComponent(startRes.session_token)}`);
      assert.equal(verifyPageRes.status, 200, `GET /v/${startRes.session_token} page must return HTTP 200`);
      console.log(`  2. verify_url & QR payload verified -> ${startRes.verify_url}`);

      // 3. Call POST /api/onboarding/complete with mock Supabase storage URLs
      const mockPrefix = `pro-documents/test-e2e/${startRes.session_token}`;
      const mockPortfolioBase = `${supabaseUrl || 'https://example.supabase.co'}/storage/v1/object/public/pro-portfolio/test-e2e/${startRes.session_token}`;

      const completeRes = await fetch(`${baseUrl}/api/onboarding/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: startRes.session_token,
          aadhaar_front_url: `${mockPrefix}/aadhaar-front.jpg`,
          aadhaar_back_url: `${mockPrefix}/aadhaar-back.jpg`,
          pan_front_url: `${mockPrefix}/pan-front.jpg`,
          voter_driving_front_url: `${mockPrefix}/voter-driving.jpg`,
          police_verification_url: `${mockPrefix}/police-verification.jpg`,
          portfolio_urls: [
            `${mockPortfolioBase}/work-1.jpg`,
            `${mockPortfolioBase}/work-2.jpg`
          ]
        })
      });

      assert.equal(completeRes.status, 200, `POST /api/onboarding/complete returned HTTP ${completeRes.status}`);
      const completeJson = await completeRes.json();
      assert.equal(completeJson.success, true, 'complete response success must be true');
      assert.equal(completeJson.status, 'VERIFIED', 'complete response status must transition to VERIFIED');
      assert.equal(completeJson.session?.status, 'VERIFIED', 'session.status must be VERIFIED');
      assert.equal(completeJson.session?.aadhaar_front_url, `${mockPrefix}/aadhaar-front.jpg`);
      assert.equal(completeJson.session?.aadhaar_back_url, `${mockPrefix}/aadhaar-back.jpg`);
      assert.ok(completeJson.profile?.id, 'Synced profile id must be returned');
      assert.equal(completeJson.profile?.verified, true, 'Synced profile must be marked verified: true');
      assert.match(completeJson.profile?.pro_code || '', /^CW-/, 'Synced profile must have CW- pro_code');

      if (!preExistingPhones.has(pro.phone_number) && completeJson.profile?.id) {
        createdProfileIds.push(completeJson.profile.id);
      }
      console.log(`  3. POST /api/onboarding/complete OK -> pro_code=${completeJson.profile.pro_code}, status=VERIFIED`);

      // 4. Call check_onboarding_status via /api/mcp and assert status transitions to VERIFIED
      const statusLookupArgs =
        pro.lookupMode === 'phone'
          ? { phone_number: pro.phone_number }
          : { session_token: startRes.session_token };

      const { data: checkRes } = await callMcpTool(
        baseUrl,
        'check_onboarding_status',
        statusLookupArgs,
        rpcId++
      );

      assert.equal(checkRes.success, true, 'check_onboarding_status must succeed');
      assert.equal(checkRes.found, true, 'check_onboarding_status must find the session');
      assert.equal(checkRes.status, 'VERIFIED', 'check_onboarding_status must report VERIFIED');
      assert.equal(checkRes.verified, true, 'check_onboarding_status verified flag must be true');
      assert.equal(checkRes.session_token, startRes.session_token, 'Returned session_token must match');
      assert.ok(checkRes.welcome_message?.includes(pro.full_name), 'Welcome message should greet the pro by name');
      assert.equal(checkRes.professional?.city, pro.city, 'Verified professional city must match');
      assert.equal(checkRes.professional?.locality, pro.locality, 'Verified professional locality must match');
      assert.equal(checkRes.documents_uploaded?.aadhaar_front, true, 'aadhaar_front uploaded flag must be true');
      assert.equal(checkRes.documents_uploaded?.aadhaar_back, true, 'aadhaar_back uploaded flag must be true');
      assert.equal(checkRes.documents_uploaded?.portfolio_count, 2, 'portfolio_count must equal 2');

      // Also assert GET /api/onboarding/status/[token] returns VERIFIED + profile
      const postStatusRes = await fetch(`${baseUrl}/api/onboarding/status/${encodeURIComponent(startRes.session_token)}`);
      assert.equal(postStatusRes.status, 200);
      const postStatusJson = await postStatusRes.json();
      assert.equal(postStatusJson.status, 'VERIFIED', 'REST status endpoint must report VERIFIED');
      assert.equal(postStatusJson.profile?.pro_code, completeJson.profile.pro_code, 'REST status endpoint must include profile');

      console.log(`  4. check_onboarding_status (${pro.lookupMode}) OK -> status=VERIFIED, profile_url=${checkRes.professional?.profile_url}\n`);
    }

    // =====================================================================
    // PHASE 6: Security & Production Hardening Assertions
    // =====================================================================
    console.log('=== Phase 6: Security & Production Hardening Checks ===');

    // 1. CORS headers on /api/mcp for ChatGPT App Directory review
    const optionsRes = await fetch(`${baseUrl}/api/mcp`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://chatgpt.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, mcp-session-id, OpenAI-Conversation-Id'
      }
    });
    assert.equal(optionsRes.status, 204, 'OPTIONS /api/mcp must return 204');
    assert.equal(optionsRes.headers.get('access-control-allow-origin'), '*', 'CORS Allow-Origin must be *');
    assert.ok(
      optionsRes.headers.get('access-control-allow-methods')?.includes('POST'),
      'CORS Allow-Methods must include POST'
    );
    assert.ok(
      optionsRes.headers.get('access-control-allow-headers')?.includes('mcp-session-id'),
      'CORS Allow-Headers must include mcp-session-id'
    );
    console.log('  1. /api/mcp CORS preflight & ChatGPT App Directory headers OK');

    // 2. Strict 10-digit Indian mobile validation (must start with 6-9, exact 10 digits)
    const invalidPhones = ['1234567890', '5555555555', '987654321', '99999999999'];
    for (const badPhone of invalidPhones) {
      const badInitRes = await fetch(`${baseUrl}/api/onboarding/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: badPhone,
          full_name: 'Invalid Phone Test',
          trade: 'carpentry',
          city: 'Bangalore',
          locality: 'Whitefield'
        })
      });
      assert.equal(badInitRes.status, 400, `Expected 400 for invalid Indian mobile "${badPhone}"`);
    }
    console.log('  2. Strict 10-digit Indian mobile validation OK');

    // 3. Strict File Validation (JPEG/PNG/WebP only, max 2MB, private kyc-documents bucket for Aadhaar)
    const pdfSignRes = await fetch(`${baseUrl}/api/upload/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'aadhaar_front',
        ownerId: 'test-sec',
        fileType: 'application/pdf',
        fileSize: 400 * 1024
      })
    });
    assert.equal(pdfSignRes.status, 400, 'PDF upload must be rejected with HTTP 400');

    const largeSignRes = await fetch(`${baseUrl}/api/upload/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'aadhaar_front',
        ownerId: 'test-sec',
        fileType: 'image/jpeg',
        fileSize: 3 * 1024 * 1024 // 3MB > 2MB limit
      })
    });
    assert.equal(largeSignRes.status, 413, 'File > 2MB must be rejected with HTTP 413');

    const validSignRes = await fetch(`${baseUrl}/api/upload/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'aadhaar_front',
        ownerId: 'test-sec',
        fileType: 'image/jpeg',
        fileSize: 450 * 1024
      })
    });
    assert.equal(validSignRes.status, 200, 'Valid JPEG < 2MB must be accepted');
    const validSignJson = await validSignRes.json();
    assert.equal(validSignJson.bucket, 'kyc-documents', 'Aadhaar must be routed to private kyc-documents bucket');
    assert.equal(validSignJson.isPublic, false, 'Aadhaar bucket isPublic flag must be false');
    assert.equal(validSignJson.publicUrl, null, 'Aadhaar upload must never expose a publicUrl');
    console.log('  3. Strict file validation (JPEG/PNG/WebP, max 2MB, private kyc-documents bucket) OK');

    // 4. Expired tokens (> 60 mins) localized "Link Expired" message
    const expiredHiRes = await fetch(`${baseUrl}/api/onboarding/status/expired?lang=hi`);
    assert.equal(expiredHiRes.status, 200);
    const expiredHiJson = await expiredHiRes.json();
    assert.equal(expiredHiJson.status, 'EXPIRED');
    assert.equal(expiredHiJson.is_expired, true);
    assert.ok(expiredHiJson.expired_title?.includes('Link Expired'), 'Expired title must include Link Expired');
    assert.ok(expiredHiJson.localized_expired?.hi, 'Hindi localized expired message must be present');
    assert.ok(expiredHiJson.localized_expired?.kn, 'Kannada localized expired message must be present');
    assert.ok(expiredHiJson.localized_expired?.ta, 'Tamil localized expired message must be present');
    console.log('  4. Expired token (> 60 mins) localized "Link Expired" response OK\n');

    console.log('ALL PHASE 5 & PHASE 6 END-TO-END TESTS PASSED (3 cities, MCP + REST + Security Hardening verified)!');
  } catch (err) {
    console.error('\nPhase 5 E2E Test FAILED:', err);
    if (serverLogs) {
      console.error('\n--- Server Logs Tail ---\n' + serverLogs.slice(-2000));
    }
    process.exitCode = 1;
  } finally {
    // Cleanup synthetic test records from Supabase so DB stays clean
    if (!keepTestData && (createdSessionIds.length > 0 || createdProfileIds.length > 0)) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceKey) {
        try {
          const admin = createClient(supabaseUrl, serviceKey);
          if (createdSessionIds.length > 0) {
            await admin.from('pro_onboarding_sessions').delete().in('id', createdSessionIds);
          }
          if (createdProfileIds.length > 0) {
            await admin.from('profiles').delete().in('id', createdProfileIds);
          }
          console.log(
            `Cleaned up ${createdSessionIds.length} test onboarding session(s) and ${createdProfileIds.length} synthetic test profile(s).`
          );
        } catch (cleanupErr) {
          console.warn('Cleanup warning:', cleanupErr.message);
        }
      }
    }
    stopChildProcess(serverProc);
  }
}

run();
