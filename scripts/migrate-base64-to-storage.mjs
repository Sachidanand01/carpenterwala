import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local / .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const isDryRun = process.argv.includes('--dry-run');

const BUCKETS = {
  PUBLIC: 'public-assets',
  KYC: 'kyc-documents'
};

const PRO_DOC_COLUMNS = [
  { field: 'avatar', bucket: BUCKETS.PUBLIC, prefix: 'avatars', isPublic: true },
  { field: 'pending_avatar', bucket: BUCKETS.PUBLIC, prefix: 'pending-avatars', isPublic: true },
  { field: 'aadhaar_front', bucket: BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  { field: 'aadhaar_back', bucket: BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  { field: 'pan_front', bucket: BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  { field: 'pan_back', bucket: BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  { field: 'voter_driving_front', bucket: BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  { field: 'voter_driving_back', bucket: BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  { field: 'police_verification', bucket: BUCKETS.KYC, prefix: 'kyc', isPublic: false },
];

const WARRANTY_COLUMNS = [
  { field: 'receipt_copy', bucket: BUCKETS.KYC, prefix: 'warranties', isPublic: false },
  { field: 'invoice_copy', bucket: BUCKETS.KYC, prefix: 'warranties', isPublic: false },
  { field: 'warranty_card_copy', bucket: BUCKETS.KYC, prefix: 'warranties', isPublic: false },
];

function parseBase64Data(base64Str) {
  if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image/')) {
    return null;
  }
  const match = base64Str.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1];
  const rawBase64 = match[2];
  const buffer = Buffer.from(rawBase64, 'base64');
  const extension = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';

  return { buffer, mimeType, extension, sizeBytes: buffer.length };
}

async function uploadBuffer(bucket, storagePath, buffer, mimeType) {
  const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
    contentType: mimeType,
    upsert: true
  });
  if (error) throw error;
}

function getPublicUrl(bucket, storagePath) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data?.publicUrl || '';
}

async function migrateProfiles() {
  console.log('\n--- 1. Checking Profiles Table ---');
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('Failed to fetch profiles:', error.message);
    return { scanned: 0, migrated: 0 };
  }

  let migratedCount = 0;

  for (const pro of profiles || []) {
    const updates = {};
    let hasUpdates = false;

    // A. Check Single Document / Avatar Columns
    for (const { field, bucket, prefix, isPublic } of PRO_DOC_COLUMNS) {
      const val = pro[field];
      const parsed = parseBase64Data(val);
      if (parsed) {
        const storagePath = `${prefix}/${pro.id}/${field}_${Date.now()}.${parsed.extension}`;
        console.log(`  [FOUND BASE64] Pro ${pro.id} (${pro.name || 'unnamed'}) -> ${field} (${Math.round(parsed.sizeBytes / 1024)} KB)`);

        if (!isDryRun) {
          try {
            await uploadBuffer(bucket, storagePath, parsed.buffer, parsed.mimeType);
            updates[field] = isPublic ? getPublicUrl(bucket, storagePath) : storagePath;
            hasUpdates = true;
            migratedCount++;
            console.log(`    ✓ Uploaded to ${bucket}/${storagePath}`);
          } catch (err) {
            console.error(`    ❌ Upload failed for Pro ${pro.id} ${field}:`, err.message);
          }
        } else {
          migratedCount++;
          console.log(`    [DRY RUN] Would upload to ${bucket}/${storagePath}`);
        }
      }
    }

    // B. Check Portfolio Array
    if (Array.isArray(pro.portfolio) && pro.portfolio.length > 0) {
      let portfolioUpdated = false;
      const newPortfolio = [];

      for (let i = 0; i < pro.portfolio.length; i++) {
        const photoItem = pro.portfolio[i];
        const parsed = parseBase64Data(photoItem);
        if (parsed) {
          const storagePath = `portfolio/${pro.id}/portfolio_${i + 1}_${Date.now()}.${parsed.extension}`;
          console.log(`  [FOUND BASE64] Pro ${pro.id} Portfolio photo #${i + 1} (${Math.round(parsed.sizeBytes / 1024)} KB)`);

          if (!isDryRun) {
            try {
              await uploadBuffer(BUCKETS.PUBLIC, storagePath, parsed.buffer, parsed.mimeType);
              newPortfolio.push(getPublicUrl(BUCKETS.PUBLIC, storagePath));
              portfolioUpdated = true;
              migratedCount++;
              console.log(`    ✓ Uploaded portfolio photo to ${storagePath}`);
            } catch (err) {
              console.error(`    ❌ Portfolio upload failed:`, err.message);
              newPortfolio.push(photoItem); // Keep original on error
            }
          } else {
            migratedCount++;
            newPortfolio.push(photoItem);
            console.log(`    [DRY RUN] Would upload to ${BUCKETS.PUBLIC}/${storagePath}`);
          }
        } else {
          newPortfolio.push(photoItem);
        }
      }

      if (portfolioUpdated) {
        updates.portfolio = newPortfolio;
        hasUpdates = true;
      }
    }

    // Save updates to DB
    if (hasUpdates && !isDryRun) {
      const { error: updateErr } = await supabase.from('profiles').update(updates).eq('id', pro.id);
      if (updateErr) {
        console.error(`  ❌ Failed to update Profile ${pro.id} in DB:`, updateErr.message);
      } else {
        console.log(`  ✅ Profile ${pro.id} updated with storage references.`);
      }
    }
  }

  return { scanned: profiles?.length || 0, migrated: migratedCount };
}

async function migrateWarranties() {
  console.log('\n--- 2. Checking Warranties Table ---');
  const { data: warranties, error } = await supabase.from('warranties').select('*');
  if (error) {
    console.log('  ℹ️ Warranties table not found or empty:', error.message);
    return { scanned: 0, migrated: 0 };
  }

  let migratedCount = 0;

  for (const w of warranties || []) {
    const updates = {};
    let hasUpdates = false;

    for (const { field, bucket, prefix } of WARRANTY_COLUMNS) {
      const val = w[field];
      const parsed = parseBase64Data(val);
      if (parsed) {
        const cleanPhone = (w.customer_phone || 'anon').replace(/[^a-zA-Z0-9_-]/g, '_');
        const storagePath = `${prefix}/${cleanPhone}/${field}_${w.id}_${Date.now()}.${parsed.extension}`;
        console.log(`  [FOUND BASE64] Warranty ${w.id} (${w.appliance_name}) -> ${field} (${Math.round(parsed.sizeBytes / 1024)} KB)`);

        if (!isDryRun) {
          try {
            await uploadBuffer(bucket, storagePath, parsed.buffer, parsed.mimeType);
            updates[field] = storagePath;
            hasUpdates = true;
            migratedCount++;
            console.log(`    ✓ Uploaded to ${bucket}/${storagePath}`);
          } catch (err) {
            console.error(`    ❌ Upload failed for Warranty ${w.id} ${field}:`, err.message);
          }
        } else {
          migratedCount++;
          console.log(`    [DRY RUN] Would upload to ${bucket}/${storagePath}`);
        }
      }
    }

    if (hasUpdates && !isDryRun) {
      const { error: updateErr } = await supabase.from('warranties').update(updates).eq('id', w.id);
      if (updateErr) {
        console.error(`  ❌ Failed to update Warranty ${w.id} in DB:`, updateErr.message);
      } else {
        console.log(`  ✅ Warranty ${w.id} updated with storage paths.`);
      }
    }
  }

  return { scanned: warranties?.length || 0, migrated: migratedCount };
}

async function main() {
  console.log('=====================================================');
  console.log('  Carpenterwala Base64 to Supabase Storage Migration  ');
  console.log(`  Mode: ${isDryRun ? '🔍 DRY RUN (Simulation only)' : '🚀 LIVE MIGRATION'}`);
  console.log('=====================================================');

  const proStats = await migrateProfiles();
  const warStats = await migrateWarranties();

  console.log('\n=====================================================');
  console.log('  Migration Summary                                  ');
  console.log('=====================================================');
  console.log(`  Profiles Scanned:   ${proStats.scanned}`);
  console.log(`  Warranties Scanned: ${warStats.scanned}`);
  console.log(`  Total Base64 Files: ${proStats.migrated + warStats.migrated}`);
  if (isDryRun) {
    console.log('\n💡 To perform the real migration, run without --dry-run:');
    console.log('   node scripts/migrate-base64-to-storage.mjs');
  } else {
    console.log('\n🎉 Migration complete!');
  }
}

main().catch(console.error);
