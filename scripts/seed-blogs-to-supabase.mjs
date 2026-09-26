// scripts/seed-blogs-to-supabase.mjs
// Seeds or synchronizes all 90+ blog posts from lib/blog-data.js into Supabase `blogs` table.

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

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder-url.supabase.co')) {
  console.log('⚠️ Supabase environment variables not configured.');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to seed into Supabase.');
  console.log('Example:');
  console.log('  $env:NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"');
  console.log('  $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  console.log('  node scripts/seed-blogs-to-supabase.mjs');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Check if image migration map exists
let imageMap = {};
const mapPath = path.join(rootDir, 'scratch', 'image-migration-map.json');
if (fs.existsSync(mapPath)) {
  try {
    const list = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
    list.forEach(item => {
      if (item.supabaseUrl) {
        imageMap[item.slug] = item.supabaseUrl;
      }
    });
    console.log(`Loaded ${Object.keys(imageMap).length} self-hosted Supabase image mappings.`);
  } catch (err) {
    console.warn('Could not parse image map, proceeding with default images.');
  }
}

async function run() {
  console.log('====================================================');
  console.log(`🚀 Seeding ${BLOG_POSTS.length} Blog Posts into Supabase`);
  console.log(`Target Supabase: ${supabaseUrl}`);
  console.log('====================================================\n');

  let successCount = 0;
  let errorCount = 0;

  // Process in batches of 10 for speed and network reliability
  const batchSize = 10;
  for (let i = 0; i < BLOG_POSTS.length; i += batchSize) {
    const batch = BLOG_POSTS.slice(i, i + batchSize);
    const rows = batch.map(post => {
      const finalImage = imageMap[post.slug] || post.image;
      return {
        slug: post.slug,
        title: post.title,
        meta_title: post.metaTitle || post.title,
        meta_description: post.metaDescription || post.excerpt || '',
        excerpt: post.excerpt || '',
        category: post.category || 'How to',
        author: post.author || 'Rajesh Sharma',
        date: post.date || 'September 26, 2026',
        read_time: post.readTime || '7 min read',
        image_url: finalImage,
        content: post.content,
        status: 'published'
      };
    });

    const { data, error } = await supabase
      .from('blogs')
      .upsert(rows, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Batch error [${i + 1}-${i + rows.length}]:`, error.message);
      errorCount += rows.length;
    } else {
      successCount += rows.length;
      console.log(`✅ Upserted batch [${i + 1}-${i + rows.length}] (${successCount}/${BLOG_POSTS.length})`);
    }
  }

  console.log('\n====================================================');
  console.log(`Done! Successfully seeded: ${successCount}, Errors: ${errorCount}`);
  console.log('====================================================');
}

run().catch(err => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
