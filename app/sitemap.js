import { BLOG_POSTS } from '@/lib/blog-data';
import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://carpenterwala.com';

  // 1. Core static pages grouped by search value and updates frequency
  const homepage = [{
    url: `${baseUrl}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  }];

  const highPriorityPages = [
    '/services',
    '/find-a-professional',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const midPriorityPages = [
    '/about',
    '/faq',
    '/help',
    '/how-it-works',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const authPages = [
    '/login',
    '/pro/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const legalPages = [
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.3,
  }));

  const staticPages = [...homepage, ...highPriorityPages, ...midPriorityPages, ...authPages, ...legalPages];

  // 2. Service pages
  const serviceNames = ['carpentry', 'painting', 'plumbing', 'electrical'];
  const locations = ['koramangala', 'indiranagar', 'whitefield', 'hsr-layout', 'thanisandra'];

  const services = serviceNames.map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const locationServices = [];
  serviceNames.forEach((service) => {
    locations.forEach((location) => {
      locationServices.push({
        url: `${baseUrl}/services/${service}/${location}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    });
  });

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
        changeFrequency: 'daily',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Error fetching profiles for sitemap:", err);
  }

  return [...staticPages, ...services, ...locationServices, ...blogPosts, ...blogCategories, ...profileRoutes];
}

