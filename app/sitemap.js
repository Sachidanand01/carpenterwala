import { BLOG_POSTS } from '@/lib/blog-data';
import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://carpenterwala.com';
  const buildDate = new Date('2026-09-01T00:00:00.000Z');

  // 1. Core static high-intent discovery pages
  const staticHighPriority = [
    {
      url: `${baseUrl}`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 1.0,
      images: [`${baseUrl}/images/og-image.png`],
    },
    {
      url: `${baseUrl}/services`,
      lastModified: buildDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/find-a-professional`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // 2. Mid-priority informational & hub pages
  const staticMidPriority = [
    '/about',
    '/faq',
    '/help',
    '/how-it-works',
    '/contact',
    '/sitemap',
    '/pro/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: buildDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Legal pages
  const staticLegal = [
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2026-06-01T00:00:00.000Z'),
    changeFrequency: 'monthly',
    priority: 0.3,
  }));

  // 4. Trade service pages with hero image metadata
  const serviceImages = {
    carpentry: `${baseUrl}/images/carpentry-hero.png`,
    painting: `${baseUrl}/images/about-us-hero.png`,
    plumbing: `${baseUrl}/images/about-us-hero.png`,
    electrical: `${baseUrl}/images/about-us-hero.png`,
  };

  const serviceNames = ['carpentry', 'painting', 'plumbing', 'electrical'];
  const locations = [
    'koramangala',
    'indiranagar',
    'whitefield',
    'hsr-layout',
    'thanisandra',
    'jayanagar',
    'jp-nagar',
    'bellandur',
    'marathahalli',
    'hebbal',
    'sarjapur-road',
    'electronic-city',
    'yelahanka'
  ];

  const services = serviceNames.map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: buildDate,
    changeFrequency: 'weekly',
    priority: 0.8,
    images: serviceImages[service] ? [serviceImages[service]] : undefined,
  }));

  // 5. Localized Trade + Locality Hub Pages
  const locationServices = [];
  serviceNames.forEach((service) => {
    locations.forEach((location) => {
      locationServices.push({
        url: `${baseUrl}/services/${service}/${location}`,
        lastModified: buildDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // 6. Dynamic Blog Articles with structured image tags & accurate publication dates
  const blogPosts = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : buildDate,
    changeFrequency: 'monthly',
    priority: 0.6,
    images: post.image ? [post.image] : undefined,
  }));

  // 7. Dynamic Blog Categories
  const categories = Array.from(new Set(BLOG_POSTS.map((post) => post.category)));
  const blogCategories = categories.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: buildDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 8. Dynamic Verified Professional Profiles from database
  let profileRoutes = [];
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('slug, created_at, avatar, verified')
      .eq('verified', true);
    if (!error && profiles) {
      profileRoutes = profiles.map((profile) => ({
        url: `${baseUrl}/${profile.slug}`,
        lastModified: profile.created_at ? new Date(profile.created_at) : buildDate,
        changeFrequency: 'daily',
        priority: 0.8,
        images: profile.avatar ? [profile.avatar] : undefined,
      }));
    }
  } catch (err) {
    console.error("Error fetching profiles for sitemap:", err);
  }

  return [
    ...staticHighPriority,
    ...staticMidPriority,
    ...staticLegal,
    ...services,
    ...locationServices,
    ...blogPosts,
    ...blogCategories,
    ...profileRoutes,
  ];
}
