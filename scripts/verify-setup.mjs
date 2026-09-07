import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local and .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const results = [];

function logSection(title) {
  console.log(`\n\x1b[1m\x1b[36m=== ${title} ===\x1b[0m`);
}

function recordResult(testName, passed, detail) {
  results.push({ testName, passed, detail });
  const status = passed ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m';
  console.log(`  ${status} ${testName}`);
  if (detail) {
    console.log(`         \x1b[90m${detail}\x1b[0m`);
  }
}

// 1. Check Git & Credential Security
function testGitSecurity() {
  logSection('1. Git & Credentials Safety Check');

  // Check .gitignore exists
  const gitignorePath = path.resolve('.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const ignoresEnv = gitignoreContent.includes('.env');
    recordResult('Gitignore Configuration', ignoresEnv, ignoresEnv ? '.env files are properly excluded from Git commits' : 'WARNING: .env is not in .gitignore!');
  } else {
    recordResult('Gitignore File Exists', false, '.gitignore file not found');
  }

  // Check if .env.local exists locally
  const envLocalExists = fs.existsSync(path.resolve('.env.local'));
  recordResult('Local Environment File (.env.local)', envLocalExists, envLocalExists ? 'Found .env.local on local filesystem' : 'Missing .env.local (copy from .env.example or configure)');
}

// 2. Check Supabase Environment Variables
function testEnvironmentVariables() {
  logSection('2. Supabase Environment Variables');

  const hasUrl = Boolean(SUPABASE_URL && SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('placeholder'));
  recordResult('NEXT_PUBLIC_SUPABASE_URL', hasUrl, hasUrl ? `Configured (${SUPABASE_URL})` : 'Missing or set to placeholder');

  const hasAnonKey = Boolean(SUPABASE_KEY && SUPABASE_KEY.length > 20 && !SUPABASE_KEY.includes('placeholder'));
  recordResult('NEXT_PUBLIC_SUPABASE_ANON_KEY', hasAnonKey, hasAnonKey ? 'Valid anon key string detected' : 'Missing or set to placeholder');
}

// 3. Test Database Connectivity & Tables
async function testDatabase(supabase) {
  logSection('3. Supabase Database Connectivity & Tables');

  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('placeholder')) {
    recordResult('Database Connection', false, 'Skipped due to missing environment variables');
    return;
  }

  // Test profiles table
  try {
    const { data, error } = await supabase.from('profiles').select('id, name, trade').limit(3);
    if (error) throw error;
    recordResult('Table: profiles', true, `Connected successfully (${data?.length || 0} sample rows fetched)`);
  } catch (err) {
    recordResult('Table: profiles', false, `Query failed: ${err.message}`);
  }

  // Test reviews table
  try {
    const { error } = await supabase.from('reviews').select('id').limit(1);
    if (error) throw error;
    recordResult('Table: reviews', true, 'Connected successfully');
  } catch (err) {
    recordResult('Table: reviews', false, `Query failed: ${err.message}`);
  }

  // Test warranties table
  try {
    const { error } = await supabase.from('warranties').select('id').limit(1);
    if (error) throw error;
    recordResult('Table: warranties', true, 'Connected successfully');
  } catch (err) {
    recordResult('Table: warranties', false, `Query failed: ${err.message}`);
  }
}

// 4. Test Storage Buckets & Access Control
async function testStorage(supabase) {
  logSection('4. Supabase Storage Buckets & Policies');

  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('placeholder')) {
    recordResult('Storage Tests', false, 'Skipped due to missing environment variables');
    return;
  }

  const testBuffer = Buffer.from('Carpenterwala Storage Integration Verification Test Asset');
  const testFileName = `test-verify-${Date.now()}.txt`;

  // Test Public Bucket: public-assets
  try {
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('public-assets')
      .upload(`diagnostics/${testFileName}`, testBuffer, {
        contentType: 'text/plain',
        upsert: true
      });

    if (uploadErr) throw uploadErr;

    const { data: publicUrlData } = supabase.storage
      .from('public-assets')
      .getPublicUrl(`diagnostics/${testFileName}`);

    recordResult('Public Bucket: public-assets (Upload & CDN URL)', true, `Uploaded to ${uploadData.path} | Public CDN URL: ${publicUrlData?.publicUrl}`);

    // Cleanup
    await supabase.storage.from('public-assets').remove([`diagnostics/${testFileName}`]);
  } catch (err) {
    recordResult('Public Bucket: public-assets', false, `Upload error: ${err.message}`);
  }

  // Test Private Bucket: kyc-documents (Upload + Signed URL)
  try {
    const { data: kycUploadData, error: kycUploadErr } = await supabase.storage
      .from('kyc-documents')
      .upload(`diagnostics/${testFileName}`, testBuffer, {
        contentType: 'text/plain',
        upsert: true
      });

    if (kycUploadErr) throw kycUploadErr;

    // Generate signed URL (valid for 15 minutes)
    const { data: signedData, error: signErr } = await supabase.storage
      .from('kyc-documents')
      .createSignedUrl(`diagnostics/${testFileName}`, 900);

    if (signErr || !signedData?.signedUrl) throw signErr || new Error('Signed URL empty');

    recordResult('Private Bucket: kyc-documents (Upload & Signed URL)', true, `Private path: ${kycUploadData.path} | Signed URL Token OK`);

    // Cleanup
    await supabase.storage.from('kyc-documents').remove([`diagnostics/${testFileName}`]);
  } catch (err) {
    recordResult('Private Bucket: kyc-documents', false, `KYC storage error: ${err.message}`);
  }
}

async function main() {
  console.log('\x1b[1m\x1b[35m=====================================================\x1b[0m');
  console.log('\x1b[1m\x1b[35m  Carpenterwala Setup & Integration Diagnostics      \x1b[0m');
  console.log('\x1b[1m\x1b[35m=====================================================\x1b[0m');

  testGitSecurity();
  testEnvironmentVariables();

  const clientKey = SERVICE_KEY || SUPABASE_KEY;
  if (SUPABASE_URL && clientKey && !SUPABASE_URL.includes('placeholder')) {
    const supabase = createClient(SUPABASE_URL, clientKey);
    await testDatabase(supabase);
    await testStorage(supabase);
  } else {
    logSection('3 & 4. Database & Storage');
    recordResult('Supabase Client Initialized', false, 'Provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to run live tests');
  }

  logSection('Summary Report');
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  console.log(`\n  Total Tests: \x1b[1m${results.length}\x1b[0m | Passed: \x1b[32m${passedCount}\x1b[0m | Issues: \x1b[31m${failedCount}\x1b[0m`);

  if (failedCount === 0) {
    console.log('\n\x1b[32m✨ All system diagnostics PASSED! Your Supabase and Git configurations are 100% verified.\x1b[0m\n');
  } else {
    console.log('\n\x1b[33m⚠️ Some checks require attention. Please see the details above.\x1b[0m\n');
  }
}

main().catch(console.error);
