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

// Load Next.js cache helpers universally (compatible with Next.js bundler and standalone Node scripts)
let nextCacheModule = null;
try {
  nextCacheModule = await import('next/cache.js').catch(() => null) || await import('next/cache').catch(() => null);
} catch {
  // Ignored in non-Next environments
}

/**
 * Robust wrapper around Next.js unstable_cache.
 * Uses Next.js data cache in server runtime while safely falling back to direct execution
 * in standalone Node.js scripts (avoiding 'incrementalCache missing' invariant errors).
 */
function withCache(fn, keyParts, options) {
  const unstableCache = nextCacheModule?.unstable_cache;
  if (!unstableCache) {
    return fn;
  }

  try {
    const cachedFn = unstableCache(fn, keyParts, options);
    return async (...args) => {
      try {
        return await cachedFn(...args);
      } catch (err) {
        if (err?.message?.includes('incrementalCache missing')) {
          return await fn(...args);
        }
        throw err;
      }
    };
  } catch {
    return fn;
  }
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
  const selfHostedPath = `/images/blogs/${dbRow.slug}.jpg`;

  // Prioritize local CDN-served static image (/images/blogs/[slug].jpg)
  // This completely eliminates Supabase Storage bandwidth egress.
  let resolvedImage = selfHostedPath;
  if (rawImage && rawImage.startsWith('/images/')) {
    resolvedImage = rawImage;
  } else if (rawImage && !rawImage.includes('supabase.co') && (rawImage.startsWith('http://') || rawImage.startsWith('https://'))) {
    resolvedImage = rawImage;
  }

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
 * Underlying database fetcher for published blog summaries.
 * CRITICAL EGRESS OPTIMIZATION:
 * Excludes heavy 'content' column to drop payload size by ~98% (from ~3MB to ~40KB per query).
 */
async function fetchAllBlogPostsFromDb() {
  if (!isSupabaseConfigured()) {
    return FALLBACK_POSTS.map(normalizeBlogPost);
  }

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('slug, title, meta_title, meta_description, excerpt, category, author, date, read_time, image_url, created_at, updated_at')
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
 * Fetch all published blog post summaries.
 * Cached via Next.js unstable_cache with a 1-hour TTL and 'blogs' tag.
 */
export const getAllBlogPosts = withCache(
  fetchAllBlogPostsFromDb,
  ['all-published-blogs-v2'],
  { revalidate: 3600, tags: ['blogs'] }
);

/**
 * Underlying database fetcher for a single post by slug (includes full content).
 */
async function fetchBlogPostBySlugFromDb(slug) {
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
 * Fetch a single published blog post by slug.
 * Cached via Next.js unstable_cache with a 1-hour TTL and post-specific tag.
 */
export async function getBlogPostBySlug(slug) {
  if (!slug) return null;
  const cachedFn = withCache(
    () => fetchBlogPostBySlugFromDb(slug),
    ['blog-post-detail', slug],
    { revalidate: 3600, tags: ['blogs', `blog-${slug}`] }
  );
  return cachedFn();
}

/**
 * Get distinct categories across all published blog posts without extra queries.
 */
export async function getBlogCategories() {
  const posts = await getAllBlogPosts();
  const categorySet = new Set(posts.map((p) => p.category).filter(Boolean));
  return Array.from(categorySet);
}

/**
 * Lightweight helper for recommending blogs on Pro profile pages.
 * Reuses cached post summaries to avoid repetitive DB reads.
 */
export async function getRelatedBlogsForTrade(trade, limit = 3) {
  const allPosts = await getAllBlogPosts();
  const tradeLower = (trade || '').toLowerCase();
  
  const matched = allPosts.filter(p => {
    const titleLower = (p.title || '').toLowerCase();
    const catLower = (p.category || '').toLowerCase();
    const slugLower = (p.slug || '').toLowerCase();
    return titleLower.includes(tradeLower) || catLower.includes(tradeLower) || slugLower.includes(tradeLower);
  });

  return (matched.length > 0 ? matched : allPosts).slice(0, limit);
}
