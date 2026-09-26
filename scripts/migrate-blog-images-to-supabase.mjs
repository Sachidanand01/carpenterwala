// scripts/migrate-blog-images-to-supabase.mjs
// Audits, downloads, and migrates all 90 blog images to self-hosted Supabase Storage (`blog-images` bucket).
// Zero third-party Unsplash dependencies.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { BLOG_POSTS } from '../lib/blog-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseLive = supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder-url.supabase.co');

const supabase = isSupabaseLive ? createClient(supabaseUrl, supabaseKey) : null;

// Local mirror directory to ensure assets are always backed up offline as well
const localImagesDir = path.join(rootDir, 'public', 'images', 'blogs');
if (!fs.existsSync(localImagesDir)) {
  fs.mkdirSync(localImagesDir, { recursive: true });
}

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CarpenterWala Image Migrator/1.0',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function run() {
  console.log('====================================================');
  console.log('📷 CarpenterWala Blog Image Migration Pipeline');
  console.log(`Found ${BLOG_POSTS.length} blog posts to audit.`);
  console.log(`Supabase Storage Status: ${isSupabaseLive ? 'Connected (' + supabaseUrl + ')' : 'Offline / Standalone mode'}`);
  console.log('====================================================\n');

  const migrationMap = [];
  let downloadedCount = 0;
  let uploadedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < BLOG_POSTS.length; i++) {
    const post = BLOG_POSTS[i];
    const slug = post.slug;
    const currentImg = post.image;

    console.log(`[${i + 1}/${BLOG_POSTS.length}] Processing: ${slug}`);

    if (!currentImg) {
      console.warn(`  ⚠️ Post has no image defined.`);
      continue;
    }

    const localFileName = `${slug}.jpg`;
    const localFilePath = path.join(localImagesDir, localFileName);
    let imageBuffer = null;

    // 1. Download image if external or read from local disk
    try {
      if (currentImg.startsWith('http://') || currentImg.startsWith('https://')) {
        if (!fs.existsSync(localFilePath)) {
          console.log(`  ⬇️ Downloading from external source...`);
          imageBuffer = await downloadImage(currentImg);
          fs.writeFileSync(localFilePath, imageBuffer);
          downloadedCount++;
        } else {
          imageBuffer = fs.readFileSync(localFilePath);
        }
      } else {
        // Local path
        const resolvedPath = path.join(rootDir, 'public', currentImg.replace(/^\//, ''));
        if (fs.existsSync(resolvedPath)) {
          imageBuffer = fs.readFileSync(resolvedPath);
        }
      }
    } catch (err) {
      console.error(`  ❌ Failed to retrieve image for ${slug}:`, err.message);
      failedCount++;
      continue;
    }

    // 2. Upload to Supabase Storage if live
    let finalSupabaseUrl = null;
    if (isSupabaseLive && imageBuffer) {
      try {
        const storagePath = `${slug}.jpg`;
        const { error } = await supabase.storage
          .from('blog-images')
          .upload(storagePath, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (error) {
          console.warn(`  ⚠️ Supabase upload notice for ${slug}:`, error.message);
        } else {
          finalSupabaseUrl = `${supabaseUrl}/storage/v1/object/public/blog-images/${storagePath}`;
          uploadedCount++;
          console.log(`  ☁️ Uploaded to Supabase Storage: ${storagePath}`);
        }
      } catch (uploadErr) {
        console.warn(`  ⚠️ Supabase upload error:`, uploadErr.message);
      }
    }

    migrationMap.push({
      slug,
      title: post.title,
      originalUrl: currentImg,
      localPath: `/images/blogs/${localFileName}`,
      supabaseUrl: finalSupabaseUrl || (isSupabaseLive ? `${supabaseUrl}/storage/v1/object/public/blog-images/${slug}.jpg` : null),
    });
  }

  // Save the migration map
  const mapPath = path.join(rootDir, 'scratch', 'image-migration-map.json');
  const scratchDir = path.join(rootDir, 'scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }
  fs.writeFileSync(mapPath, JSON.stringify(migrationMap, null, 2), 'utf-8');

  console.log('\n====================================================');
  console.log('✅ Migration Run Summary:');
  console.log(`- Total Audited: ${BLOG_POSTS.length}`);
  console.log(`- Downloaded & Cached Locally: ${downloadedCount}`);
  console.log(`- Uploaded to Supabase Storage: ${uploadedCount}`);
  console.log(`- Failures: ${failedCount}`);
  console.log(`- Migration Map saved to: ${mapPath}`);
  console.log('====================================================');
}

run().catch((err) => {
  console.error('Fatal migration script error:', err);
  process.exit(1);
});
