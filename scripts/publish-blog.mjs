// scripts/publish-blog.mjs
// Programmatic Blog Publisher for CarpenterWala
// Usage: node scripts/publish-blog.mjs --file ./scratch/post.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseLive = supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder-url.supabase.co');
const supabase = isSupabaseLive ? createClient(supabaseUrl, supabaseKey) : null;

export async function publishBlogPost(post) {
  if (!post.slug || !post.title || !post.content) {
    throw new Error('Missing required blog fields: slug, title, content');
  }

  console.log(`\n========================================`);
  console.log(`🚀 Publishing: "${post.title}"`);
  console.log(`Slug: ${post.slug}`);
  console.log(`========================================`);

  let finalImageUrl = post.image || '';

  // 1. If post specifies a local image to upload to Supabase Storage
  if (post.localImagePath && fs.existsSync(post.localImagePath) && isSupabaseLive) {
    console.log(`📷 Uploading image to Supabase Storage: ${post.localImagePath}`);
    const fileBuffer = fs.readFileSync(post.localImagePath);
    const ext = path.extname(post.localImagePath).toLowerCase() || '.jpg';
    const storagePath = `${post.slug}${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('blog-images')
      .upload(storagePath, fileBuffer, {
        contentType: ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg',
        upsert: true,
      });

    if (uploadErr) {
      console.warn('⚠️ Supabase image upload notice:', uploadErr.message);
    } else {
      finalImageUrl = `${supabaseUrl}/storage/v1/object/public/blog-images/${storagePath}`;
      console.log(`✅ Uploaded to: ${finalImageUrl}`);
    }
  }

  // 2. Insert or update in Supabase
  if (isSupabaseLive) {
    console.log(`💾 Storing post in Supabase 'blogs' table...`);
    const dbPayload = {
      slug: post.slug,
      title: post.title,
      meta_title: post.metaTitle || post.title,
      meta_description: post.metaDescription || post.excerpt || '',
      excerpt: post.excerpt || '',
      category: post.category || 'How to',
      author: post.author || 'Rajesh Sharma',
      date: post.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      read_time: post.readTime || '7 min read',
      image_url: finalImageUrl,
      content: post.content,
      status: post.status || 'published',
    };

    const { error: dbErr } = await supabase.from('blogs').upsert(dbPayload, { onConflict: 'slug' });
    if (dbErr) {
      console.error('❌ Supabase database error:', dbErr.message);
    } else {
      console.log('✅ Successfully persisted in Supabase database.');
    }
  } else {
    console.log('ℹ️ Supabase offline or credentials not set. Synchronizing with local fallback cache only.');
  }

  // 3. Keep local fallback cache (lib/blog-data.js) updated
  const blogDataJsPath = path.join(rootDir, 'lib', 'blog-data.js');
  if (fs.existsSync(blogDataJsPath)) {
    console.log(`🔄 Updating local fallback cache at lib/blog-data.js...`);
    const contentStr = fs.readFileSync(blogDataJsPath, 'utf-8');
    
    // Check if post already exists
    if (contentStr.includes(`slug: '${post.slug}'`) || contentStr.includes(`slug: "${post.slug}"`)) {
      console.log(`ℹ️ Post '${post.slug}' already present in lib/blog-data.js.`);
    } else {
      const insertionPoint = contentStr.indexOf('export const BLOG_POSTS = [');
      if (insertionPoint !== -1) {
        const afterBracket = insertionPoint + 'export const BLOG_POSTS = ['.length;
        const postObjectCode = `\n  {
    slug: ${JSON.stringify(post.slug)},
    title: ${JSON.stringify(post.title)},
    metaTitle: ${JSON.stringify(post.metaTitle || post.title)},
    metaDescription: ${JSON.stringify(post.metaDescription || post.excerpt || '')},
    excerpt: ${JSON.stringify(post.excerpt || '')},
    category: ${JSON.stringify(post.category || 'How to')},
    date: ${JSON.stringify(post.date || 'September 26, 2026')},
    readTime: ${JSON.stringify(post.readTime || '7 min read')},
    image: ${JSON.stringify(finalImageUrl)},
    content: \`
${post.content.replace(/`/g, '\\`').replace(/\${/g, '\\${')}
\`
  },`;
        const updatedCode = contentStr.slice(0, afterBracket) + postObjectCode + contentStr.slice(afterBracket);
        fs.writeFileSync(blogDataJsPath, updatedCode, 'utf-8');
        console.log(`✅ Post synchronized into lib/blog-data.js.`);
      }
    }
  }

  // 4. Trigger On-Demand Revalidation if site URL is configured
  const siteUrl = process.env.SITE_URL || 'https://carpenterwala.com';
  const secret = process.env.REVALIDATION_SECRET;
  if (secret) {
    try {
      console.log(`⚡ Triggering ISR revalidation for /blog/${post.slug}...`);
      const revalRes = await fetch(`${siteUrl}/api/revalidate?secret=${secret}&slug=${post.slug}`, { method: 'POST' });
      if (revalRes.ok) {
        console.log('✅ Edge cache revalidated successfully.');
      } else {
        console.warn(`⚠️ Revalidation response: HTTP ${revalRes.status}`);
      }
    } catch (revalErr) {
      console.warn(`⚠️ Could not reach revalidation endpoint:`, revalErr.message);
    }
  }

  console.log(`\n🎉 Finished! Post is live at: /blog/${post.slug}\n`);
}

// CLI handler
const args = process.argv.slice(2);
const fileArgIndex = args.indexOf('--file');
if (fileArgIndex !== -1 && args[fileArgIndex + 1]) {
  const targetPath = path.resolve(process.cwd(), args[fileArgIndex + 1]);
  if (fs.existsSync(targetPath)) {
    const postData = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    publishBlogPost(postData).catch(err => {
      console.error('Fatal publishing error:', err);
      process.exit(1);
    });
  } else {
    console.error(`File not found: ${targetPath}`);
    process.exit(1);
  }
}
