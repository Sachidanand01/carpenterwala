import { BLOG_POSTS } from '@/lib/blog-data';

export default function sitemap() {
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

  return [...staticPages, ...services, ...blogPosts, ...blogCategories];
}

