import { BLOG_POSTS } from '../lib/blog-data.js';

const KNOWN_VALID_BASE_ROUTES = [
  '/',
  '/blog',
  '/services',
  '/about',
  '/faq',
  '/help',
  '/how-it-works',
  '/contact',
  '/find-a-professional',
  '/find-pros',
  '/login',
  '/pro/login',
  '/privacy',
  '/terms',
  '/services/carpentry',
  '/services/painting',
  '/services/plumbing',
  '/services/electrical',
  '/services/carpentry/whitefield',
  '/services/carpentry/koramangala',
  '/services/carpentry/indiranagar',
  '/services/carpentry/hsr-layout',
  '/services/carpentry/thanisandra',
  '/services/painting/whitefield',
  '/services/painting/koramangala',
  '/services/painting/indiranagar',
  '/services/painting/hsr-layout',
  '/services/painting/thanisandra',
  '/services/plumbing/whitefield',
  '/services/plumbing/koramangala',
  '/services/plumbing/indiranagar',
  '/services/plumbing/hsr-layout',
  '/services/plumbing/thanisandra',
  '/services/electrical/whitefield',
  '/services/electrical/koramangala',
  '/services/electrical/indiranagar',
  '/services/electrical/hsr-layout',
  '/services/electrical/thanisandra'
];

const VALID_CATEGORIES = ['Carpentry', 'Painting', 'Plumbing', 'Electrical', 'Maintenance'];

const knownSlugs = new Set(BLOG_POSTS.map(p => p.slug));

function auditBlog(post, index) {
  const issues = [];
  const scoreBreakdown = {
    eeat: 20,
    schema: 20,
    internalLinks: 20,
    aiCitability: 20,
    contentDepth: 20
  };

  // 1. E-E-A-T & Category Persona Check
  if (!VALID_CATEGORIES.includes(post.category)) {
    issues.push(`[E-E-A-T] Unrecognized category "${post.category}"`);
    scoreBreakdown.eeat -= 10;
  }
  if (!post.date) {
    issues.push('[E-E-A-T] Missing publication date');
    scoreBreakdown.eeat -= 5;
  }

  // 2. Schema Readiness Check
  if (!post.title || post.title.length < 10) {
    issues.push('[Schema] Title is missing or too short');
    scoreBreakdown.schema -= 10;
  }
  if (!post.excerpt || post.excerpt.length < 40) {
    issues.push('[Schema] Excerpt/meta description is missing or thin');
    scoreBreakdown.schema -= 5;
  }
  if (!post.image) {
    issues.push('[Schema] Missing featured image URL');
    scoreBreakdown.schema -= 5;
  }

  // 3. Content Depth & Word Count Check
  const plainText = post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(/\s+/).length;
  if (wordCount < 400) {
    issues.push(`[Content] Very thin content (${wordCount} words)`);
    scoreBreakdown.contentDepth -= 15;
  } else if (wordCount < 700) {
    issues.push(`[Content] Short content (${wordCount} words, >700 recommended)`);
    scoreBreakdown.contentDepth -= 5;
  }

  // 4. Internal Link Integrity Check
  const linkRegex = /href=["']([^"']+)["']/gi;
  let linkMatch;
  let internalLinksCount = 0;
  while ((linkMatch = linkRegex.exec(post.content)) !== null) {
    const href = linkMatch[1];
    if (href.startsWith('/')) {
      internalLinksCount++;
      const [path] = href.split('#');
      if (path.startsWith('/blog/category/')) {
        // category link is valid
      } else if (path.startsWith('/blog/')) {
        const blogSlug = path.replace('/blog/', '');
        if (blogSlug && !knownSlugs.has(blogSlug)) {
          issues.push(`[Links] Broken internal blog link: ${path}`);
          scoreBreakdown.internalLinks -= 5;
        }
      } else if (!KNOWN_VALID_BASE_ROUTES.includes(path)) {
        issues.push(`[Links] Unrecognized route: ${path}`);
        scoreBreakdown.internalLinks -= 3;
      }
    }
  }
  if (internalLinksCount === 0) {
    issues.push('[Links] No internal links found');
    scoreBreakdown.internalLinks -= 10;
  }

  // 5. AI Citability & GEO Structure
  const isHowTo = /how to|diy|fix|unclogging|changing|replacing|guide|install/i.test(post.title);
  const hasSafetyAlert = /safety warnings|⚠️/i.test(post.content);
  const hasTroubleshooting = /troubleshooting/i.test(post.content);
  const hasNumberedSteps = /<ol[^>]*>/i.test(post.content);

  if (isHowTo && !hasNumberedSteps) {
    issues.push('[AI-SEO] How-to post is missing structured <ol> steps');
    scoreBreakdown.aiCitability -= 5;
  }
  if (!hasSafetyAlert && isHowTo) {
    issues.push('[AI-SEO] Missing safety warnings callout block');
    scoreBreakdown.aiCitability -= 5;
  }
  if (!hasTroubleshooting && isHowTo) {
    issues.push('[AI-SEO] Missing troubleshooting FAQ block');
    scoreBreakdown.aiCitability -= 5;
  }

  const totalScore = Math.max(
    0,
    scoreBreakdown.eeat +
    scoreBreakdown.schema +
    scoreBreakdown.internalLinks +
    scoreBreakdown.aiCitability +
    scoreBreakdown.contentDepth
  );

  return {
    index: index + 1,
    title: post.title,
    slug: post.slug,
    category: post.category,
    wordCount,
    internalLinksCount,
    score: totalScore,
    isHowTo,
    hasSafetyAlert,
    hasTroubleshooting,
    issues
  };
}

export function runBlogAudit() {
  console.log('\n🔍 =================================================================');
  console.log('   CARPENTERWALA BLOG SKILLS & SEO AUDIT (32 Workspace Skills)');
  console.log('   Auditing all posts against E-E-A-T, Schema, AI-SEO, & Links...');
  console.log('=================================================================\n');

  const results = BLOG_POSTS.map(auditBlog);
  let totalScore = 0;
  let perfectCount = 0;
  let warningCount = 0;

  console.log(`| #  | Score | Words | Links | Category   | Post Title`);
  console.log(`|----|-------|-------|-------|------------|----------------------------------------------`);

  results.forEach((r) => {
    totalScore += r.score;
    const scoreColor = r.score >= 90 ? '🟢' : r.score >= 75 ? '🟡' : '🔴';
    if (r.score === 100) perfectCount++;
    if (r.issues.length > 0) warningCount += r.issues.length;

    const shortTitle = r.title.length > 44 ? r.title.slice(0, 41) + '...' : r.title.padEnd(44);
    const cat = r.category.padEnd(10);
    const words = String(r.wordCount).padStart(5);
    const links = String(r.internalLinksCount).padStart(5);
    const score = `${scoreColor} ${String(r.score).padStart(3)}%`;

    console.log(`| ${String(r.index).padStart(2)} | ${score} | ${words} | ${links} | ${cat} | ${shortTitle}`);
  });

  const avgScore = (totalScore / results.length).toFixed(1);

  console.log('\n=================================================================');
  console.log(`📊 AUDIT SUMMARY:`);
  console.log(`   • Total Posts Audited: ${results.length}`);
  console.log(`   • Average Health Score: ${avgScore}%`);
  console.log(`   • Perfect Posts (100% Score): ${perfectCount}/${results.length}`);
  console.log(`   • Total Notices/Warnings: ${warningCount}`);
  console.log('=================================================================\n');

  // Print any issues for posts below 90%
  const flagged = results.filter(r => r.issues.length > 0);
  if (flagged.length > 0) {
    console.log('⚠️  DETAILED NOTICES & RECOMMENDATIONS:');
    flagged.forEach(f => {
      console.log(`\n📌 [${f.category}] ${f.title} (${f.score}%)`);
      f.issues.forEach(issue => console.log(`   - ${issue}`));
    });
    console.log('\n');
  }

  return { results, avgScore };
}

// Execute if run directly via CLI
if (process.argv[1]?.endsWith('audit-blog-skills.mjs')) {
  runBlogAudit();
}
