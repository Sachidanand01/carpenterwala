/**
 * Maintenance Worker: 48-Hour Alert + 90-Day KYC Document Purge
 * Run with: node scripts/purge-expired-kyc-docs.mjs
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runWorker() {
  console.log('----------------------------------------------------');
  console.log('🛡️  CARPENTERWALA KYC RETENTION & PURGE WORKER');
  console.log('----------------------------------------------------');

  // STEP 1: Check records scheduled for deletion within 48 Hours
  console.log('\n🔍 Step 1: Checking records expiring within 48 hours...');
  const { data: expiring, error: expiringErr } = await supabase.rpc('get_expiring_kyc_documents', {
    warning_hours: 48,
    retention_days: 90
  });

  if (expiringErr) {
    console.error('⚠️ Warning: Failed to query expiring records:', expiringErr.message);
  } else {
    const count = expiring?.length || 0;
    if (count > 0) {
      console.log(`⚠️  ALERT: ${count} profile(s) have KYC documents scheduled for deletion within 48 hours:`);
      expiring.forEach(p => {
        console.log(`   • [ID: ${p.id}] ${p.name} (${p.trade}) - ~${p.hours_remaining} hrs remaining`);
      });
    } else {
      console.log('✅ No records scheduled for deletion within the next 48 hours.');
    }
  }

  // STEP 2: Execute permanent purge for records older than 90 Days
  console.log('\n🗑️  Step 2: Executing permanent purge for records > 90 days...');
  const { data: purgeResult, error: purgeErr } = await supabase.rpc('purge_expired_kyc_documents', {
    retention_days: 90
  });

  if (purgeErr) {
    console.error('❌ Purge failed:', purgeErr.message);
    process.exit(1);
  }

  const purgedCount = purgeResult?.[0]?.purged_count ?? 0;
  console.log(`✅ Completed: Permanently cleared sensitive document files from ${purgedCount} profile(s).`);
  console.log('----------------------------------------------------\n');
}

runWorker();
