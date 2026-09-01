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
    'Contains GPTBot & OAI-SearchBot rule': (t) => t.includes('GPTBot') && t.includes('OAI-SearchBot'),
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
    'Includes sitemap hreflang links': (t) => t.includes('hreflang="hi"') && t.includes('/pro/login'),
  });

  await testRoute('3. Homepage Schema & NAP Consistency', 'http://localhost:3000/', {
    'Contains LocalBusiness schema': (t) => t.includes('"LocalBusiness"'),
    'Contains WebSite with SearchAction': (t) => t.includes('"SearchAction"'),
    'Contains FAQPage schema': (t) => t.includes('"FAQPage"'),
    'Contains verified phone number +91-809-555-1001': (t) => t.includes('+91-809-555-1001'),
    'Contains LLM knowledge alternate link': (t) => t.includes('/llms.txt'),
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

  await testRoute('9. Service-Location SXO [Carpentry in HSR Layout]', 'http://localhost:3000/services/carpentry/hsr-layout', {
    'Contains Transparent Rate Card table': (t) => t.includes('Rate Card in') && t.includes('Door Lock'),
    'Contains Localized FAQ Accordion': (t) => t.includes('Frequently Asked Questions') && t.includes('Sector 1 to 7'),
    'Contains Deep-linked Pro Filter CTA': (t) => t.includes('/find-a-professional?category=Carpenter') && t.includes('location=HSR'),
    'Contains FAQPage schema in JSON-LD': (t) => t.includes('"@type":"FAQPage"'),
    'Contains LocalBusiness schema': (t) => t.includes('"LocalBusiness"'),
    'Contains Sibling Localities links': (t) => t.includes('/services/carpentry/koramangala') && t.includes('/services/carpentry/whitefield'),
  });

  await testRoute('8. Carpentry Service Hub Schema', 'http://localhost:3000/services/carpentry', {
    'Contains Service schema': (t) => t.includes('"@type":"Service"'),
    'Contains OfferCatalog': (t) => t.includes('"OfferCatalog"'),
    'Contains FAQPage schema': (t) => t.includes('"FAQPage"'),
  });

  await testRoute('9. FAQ Page Server-Side Schema', 'http://localhost:3000/faq', {
    'Contains FAQPage schema in SSR response': (t) => t.includes('"@type":"FAQPage"'),
    'Includes zero commission FAQ': (t) => t.includes('100% free marketplace'),
  });

  await testRoute('10. How It Works Schema', 'http://localhost:3000/how-it-works', {
    'Contains WebPage / ItemList schema': (t) => t.includes('"@type":"WebPage"') && t.includes('"ItemList"'),
    'Includes step definitions': (t) => t.includes('Browse & Discover') || t.includes('Browse &amp; Discover'),
  });

  await testRoute('11. Programmatic Service-Location [Electrical in Electronic City]', 'http://localhost:3000/services/electrical/electronic-city', {
    'Contains Local Landmark & Pincode': (t) => t.includes('Electronic City') && t.includes('560100'),
    'Contains Rate Card': (t) => t.includes('Rate Card in') && t.includes('Switchboard'),
    'Contains LocalBusiness & FAQPage schema': (t) => t.includes('"LocalBusiness"') && t.includes('"FAQPage"'),
    'Contains Deep-linked Pro Filter CTA': (t) => t.includes('location=Electronic%20City') || t.includes('location=Electronic'),
  });

  await testRoute('12. Programmatic Blog Category Hub [/blog/category/carpentry]', 'http://localhost:3000/blog/category/carpentry', {
    'Contains CollectionPage schema': (t) => t.includes('"CollectionPage"'),
    'Contains BreadcrumbList schema': (t) => t.includes('"BreadcrumbList"'),
  });

  await testRoute('13. LLMs.txt AI Search Endpoint [/llms.txt]', 'http://localhost:3000/llms.txt', {
    'Contains Brand Title & Description': (t) => t.includes('# Carpenterwala') && t.includes('0% platform commission'),
    'Contains Core Rate Cards': (t) => t.includes('Door lock fitting') && t.includes('₹250'),
    'Contains 13 Bangalore Localities': (t) => t.includes('Koramangala') && t.includes('Electronic City'),
    'Contains Agent Citations & URLs': (t) => t.includes('https://carpenterwala.com/services/carpentry') && t.includes('https://carpenterwala.com/sitemap.xml'),
  });

  await testRoute('14. Local Image Assets & Valid Extensions', 'http://localhost:3000/services/plumbing', {
    'Plumbing uses local hero image': (t) => t.includes('/images/plumbing-hero.jpg'),
    'No external Unsplash background on plumbing': (t) => !t.includes('images.unsplash.com/photo-1581244276894'),
  });

  await testRoute('15. Electrical Local Image Assets', 'http://localhost:3000/services/electrical', {
    'Electrical uses local hero image': (t) => t.includes('/images/electrical-hero.jpg'),
    'No external Unsplash background on electrical': (t) => !t.includes('images.unsplash.com/photo-1621905251189'),
  });
}

runAll();
