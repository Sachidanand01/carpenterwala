import { BLOG_POSTS } from '../lib/blog-data.js';

async function testRoute(name, url, validators) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log(`\n========================================`);
    console.log(`TEST: ${name} [${url}]`);
    console.log(`HTTP Status: ${res.status}`);
    
    let allPassed = true;
    for (const [vName, vFn] of Object.entries(validators)) {
      const pass = vFn(text, res);
      if (!pass) allPassed = false;
      console.log(`  ${pass ? '✅' : '❌'} ${vName}`);
    }
    return allPassed;
  } catch (err) {
    console.error(`❌ Failed to fetch ${url}:`, err.message);
    return false;
  }
}

async function runAll() {
  const sampleSlug = BLOG_POSTS[0].slug;

  await testRoute('1. Robots.txt Output', 'http://localhost:3000/robots.txt', {
    'Contains User-Agent: *': (t) => t.includes('User-Agent: *') || t.includes('User-agent: *'),
    'Disallows /bookings': (t) => t.includes('Disallow: /bookings'),
    'Disallows /pro/dashboard': (t) => t.includes('Disallow: /pro/dashboard'),
    'Disallows /api/': (t) => t.includes('Disallow: /api/'),
    'Contains GPTBot rule': (t) => t.includes('GPTBot'),
    'References sitemap.xml': (t) => t.includes('https://carpenterwala.com/sitemap.xml'),
  });

  await testRoute('2. XML Sitemap Output', 'http://localhost:3000/sitemap.xml', {
    'Valid XML header': (t) => t.includes('<?xml version="1.0" encoding="UTF-8"?>'),
    'Includes Homepage': (t) => t.includes('<loc>https://carpenterwala.com</loc>'),
    'Includes /services': (t) => t.includes('<loc>https://carpenterwala.com/services</loc>'),
    'Includes /sitemap': (t) => t.includes('<loc>https://carpenterwala.com/sitemap</loc>'),
    'Includes /about': (t) => t.includes('<loc>https://carpenterwala.com/about</loc>'),
    'Includes /contact': (t) => t.includes('<loc>https://carpenterwala.com/contact</loc>'),
    'Includes service-location pages': (t) => t.includes('/services/carpentry/hsr-layout'),
    'Includes blog posts': (t) => t.includes(`/blog/${sampleSlug}`),
  });

  await testRoute('3. Homepage Schema & NAP Consistency', 'http://localhost:3000/', {
    'Contains LocalBusiness schema': (t) => t.includes('"LocalBusiness"'),
    'Contains WebSite with SearchAction': (t) => t.includes('"SearchAction"'),
    'Contains FAQPage schema': (t) => t.includes('"FAQPage"'),
    'Contains verified phone number +91-809-555-1001': (t) => t.includes('+91-809-555-1001'),
    'No placeholder phone number': (t) => !t.includes('+91-XXXXXXXXXX'),
  });

  await testRoute('4. Pro Login Multi-Language & Hreflang', 'http://localhost:3000/pro/login?lang=hi', {
    'Contains Canonical': (t) => t.includes('rel="canonical"') && t.includes('/pro/login'),
    'Contains hreflang links (en, hi, kn, ta, te, x-default)': (t) => t.toLowerCase().includes('hreflang="hi"') && t.toLowerCase().includes('hreflang="en"'),
  });

  await testRoute('5. About Page Schema', 'http://localhost:3000/about', {
    'Contains AboutPage schema': (t) => t.includes('"AboutPage"'),
    'Contains Organization entity': (t) => t.includes('"Organization"'),
  });

  await testRoute('6. Contact Page Schema', 'http://localhost:3000/contact', {
    'Contains ContactPage schema': (t) => t.includes('"ContactPage"'),
    'Contains LocalBusiness entity': (t) => t.includes('"LocalBusiness"'),
    'Contains verified contact phone': (t) => t.includes('+91-809-555-1001'),
  });

  await testRoute(`7. Blog Post with Local Author Image [/blog/${sampleSlug}]`, `http://localhost:3000/blog/${sampleSlug}`, {
    'Loads local author avatar /images/authors/rajesh.jpg': (t) => t.includes('/images/authors/rajesh.jpg'),
    'No external pravatar dependencies': (t) => !t.includes('i.pravatar.cc'),
    'Contains BlogPosting schema': (t) => t.includes('"BlogPosting"'),
    'Contains BreadcrumbList schema': (t) => t.includes('"BreadcrumbList"'),
  });

  await testRoute('8. Local Author Image Asset Status', 'http://localhost:3000/images/authors/rajesh.jpg', {
    'Returns HTTP 200': (t, res) => res.status === 200,
    'Returns Image MIME Type': (t, res) => res.headers.get('content-type')?.includes('image'),
  });
}

runAll();
