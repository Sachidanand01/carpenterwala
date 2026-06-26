import { BLOG_POSTS } from '@/lib/blog-data';
import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://carpenterwala.com';

  // 1. Core static pages
  const staticPages = [
    '',
    '/about',
    '/faq',
    '/find-a-professional',
    '/help',
    '/how-it-works',
    '/login',
    '/privacy',
    '/pro/login',
    '/services',
    '/terms',
    '/contact',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/blog' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/services' || route === '/find-a-professional' ? 0.9 : 0.7,
  }));

  // 2. Service pages
  const services = ['carpentry', 'painting', 'plumbing', 'electrical'].map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Blog articles
  const blogPosts = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || '2026-05-01'),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // 4. Dynamic Blog categories
  const categories = Array.from(new Set(BLOG_POSTS.map((post) => post.category)));
  const blogCategories = categories.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 5. Dynamic Professional Profiles
  let profileRoutes = [];
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('slug, created_at');
    if (!error && profiles) {
      profileRoutes = profiles.map((profile) => ({
        url: `${baseUrl}/${profile.slug}`,
        lastModified: profile.created_at ? new Date(profile.created_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Error fetching profiles for sitemap:", err);
  }

  return [...staticPages, ...services, ...blogPosts, ...blogCategories, ...profileRoutes];
}

