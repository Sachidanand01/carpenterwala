// lib/blog-service.js
// Universal Data Access Layer for CarpenterWala Blog Posts
// Supports Supabase PostgreSQL with seamless fallback to lib/blog-data.js

import { supabase } from './supabase.js';
import { BLOG_POSTS as FALLBACK_POSTS } from './blog-data.js';

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    !url.includes('placeholder-url.supabase.co') &&
    key !== 'placeholder-key'
  );
}

export const INTENT_TAGS = ['How-to', 'Cost Guide', 'Comparison', 'Buying Guide'];

export function getIntentTags(post) {
  if (!post) return ['How-to'];
  if (Array.isArray(post.tags) && post.tags.length > 0) {
    return post.tags;
  }
  const text = `${post.title || ''} ${post.excerpt || ''} ${post.slug || ''}`.toLowerCase();
  const tags = [];

  if (/\b(cost|costs|price|prices|pricing|rate|rates|calculator|charges|how much)\b/i.test(text)) {
    tags.push('Cost Guide');
  }
  if (/\b(vs|versus|comparison|compare|comparing|difference between)\b/i.test(text)) {
    tags.push('Comparison');
  }
  if (/\b(how to|step-by-step|fix|fixing|repair|repairing|replace|replacing|unclog|unclogging|install|installation|troubleshooting|diy)\b/i.test(text)) {
    tags.push('How-to');
  }
  if (/\b(buying|buyer|choose|choosing|selection|checklist|materials|which is better|best|guide)\b/i.test(text)) {
    tags.push('Buying Guide');
  }

  if (tags.length === 0) {
    tags.push('How-to');
  }
  return Array.from(new Set(tags));
}

export function normalizeBlogPost(dbRow) {
  if (!dbRow) return null;
  const rawImage = dbRow.image_url || dbRow.image || '';
  // Prefer self-hosted local or Supabase Storage image over third-party external links
  const selfHostedPath = `/images/blogs/${dbRow.slug}.jpg`;
  const resolvedImage = (rawImage.includes('supabase.co') || rawImage.startsWith('/images/'))
    ? rawImage
    : selfHostedPath;

  return {
    slug: dbRow.slug,
    title: dbRow.title,
    metaTitle: dbRow.meta_title || dbRow.title,
    metaDescription: dbRow.meta_description || dbRow.excerpt || '',
    excerpt: dbRow.excerpt || '',
    category: dbRow.category || 'How to',
    tags: getIntentTags(dbRow),
    author: dbRow.author || 'Rajesh Sharma',
    date: dbRow.date || 'September 26, 2026',
    readTime: dbRow.read_time || '7 min read',
    image: resolvedImage,
    content: dbRow.content || '',
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  };
}

/**
 * Fetch all published blog posts.
 * Tries Supabase first; gracefully falls back to local BLOG_POSTS on any failure.
 */
export async function getAllBlogPosts() {
  if (!isSupabaseConfigured()) {
    return FALLBACK_POSTS.map(normalizeBlogPost);
  }

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('slug, title, meta_title, meta_description, excerpt, category, author, date, read_time, image_url, content, created_at, updated_at')
      .eq('status', 'published')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error && error.code !== 'PGRST116') {
        console.warn('[blog-service] Supabase query notice:', error.message, '— using fallback cache.');
      }
      return FALLBACK_POSTS.map(normalizeBlogPost);
    }

    return data.map(normalizeBlogPost);
  } catch (err) {
    console.warn('[blog-service] Supabase unreachable:', err.message, '— using fallback cache.');
    return FALLBACK_POSTS.map(normalizeBlogPost);
  }
}

/**
 * Fetch a single published blog post by slug.
 */
export async function getBlogPostBySlug(slug) {
  if (!slug) return null;

  if (!isSupabaseConfigured()) {
    const found = FALLBACK_POSTS.find((p) => p.slug === slug);
    return found ? normalizeBlogPost(found) : null;
  }

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error || !data) {
      const found = FALLBACK_POSTS.find((p) => p.slug === slug);
      return found ? normalizeBlogPost(found) : null;
    }

    return normalizeBlogPost(data);
  } catch (err) {
    const found = FALLBACK_POSTS.find((p) => p.slug === slug);
    return found ? normalizeBlogPost(found) : null;
  }
}

/**
 * Get distinct categories across all published blog posts.
 */
export async function getBlogCategories() {
  const posts = await getAllBlogPosts();
  const categorySet = new Set(posts.map((p) => p.category).filter(Boolean));
  return Array.from(categorySet);
}
