import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdSenseContainer from '@/components/AdSenseContainer';
import BlogComments from '@/components/BlogComments';
import ProOnboardingVisualTour from '@/components/ProOnboardingVisualTour';
import BlogActionBar from '@/components/BlogActionBar';

const slugify = (cat) => cat.toLowerCase().replace(/\s+/g, '-');

const AUTHORS_BY_CATEGORY = {
  'Carpentry': {
    name: 'Rajesh Sharma',
    role: 'Master Carpenter & Woodwork Consultant',
    bio: 'Over 15 years of custom woodworking, furniture restoration, and modular interior fittings experience in Bangalore.',
    avatar: 'https://i.pravatar.cc/100?u=rajesh'
  },
  'Painting': {
    name: 'Amit Verma',
    role: 'Lead Coating & Waterproofing Consultant',
    bio: 'Wall-coating expert specializing in tropical humidity damp-proofing and premium interior color visualizers.',
    avatar: 'https://i.pravatar.cc/100?u=amit'
  },
  'Plumbing': {
    name: 'Suresh Gowda',
    role: 'Senior Plumbing Engineer & Hydraulics Advisor',
    bio: 'Expert in high-pressure leak detection, municipal water lines, and residential plumbing diagnostics in South India.',
    avatar: 'https://i.pravatar.cc/100?u=suresh'
  },
  'Electrical': {
    name: 'Vikram Rao',
    role: 'Certified Senior Electrical Systems Supervisor',
    bio: 'Licensed electrical inspector specializing in residential safety grids, MCB/ELCB diagnostics, and smart installations.',
    avatar: 'https://i.pravatar.cc/100?u=vikram'
  }
};

const DEFAULT_AUTHOR = {
  name: 'Carpenterwala Editorial Team',
  role: 'Home Improvement Advisors',
  bio: 'Our team of experienced coordinators and service verifiers writing expert tips for local Bangalore homes.',
  avatar: 'https://i.pravatar.cc/100?u=editorial'
};

function extractTOCAndInjectIds(htmlContent) {
  let count = 0;
  // Inject ID attributes into h2 and h3
  const modifiedHtml = htmlContent.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gis, (match, tag, attrs, innerHtml) => {
    const rawText = innerHtml.replace(/<[^>]+>/g, '').trim();
    if (!rawText) return match;

    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    let id = idMatch ? idMatch[1] : '';
    if (!id) {
      id = rawText
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      if (!id) id = `section-${count++}`;
      return `<${tag} id="${id}"${attrs}>${innerHtml}</${tag}>`;
    }
    return match;
  });

  const toc = [];
  const headingRegex = /<(h[23])[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/\1>/gis;
  let m;
  while ((m = headingRegex.exec(modifiedHtml)) !== null) {
    const level = m[1].toLowerCase() === 'h2' ? 2 : 3;
    const id = m[2];
    const text = m[3].replace(/<[^>]+>/g, '').trim();
    if (text && id) {
      toc.push({ id, text, level });
    }
  }

  return { html: modifiedHtml, toc };
}

function extractHowToSchema(post, canonicalUrl) {
  const isHowTo = /how to|diy|step-by-step|guide|fix|unclogging|changing|replacing|install/i.test(post.title);
  if (!isHowTo) return null;

  const steps = [];
  const olRegex = /<ol[^>]*>(.*?)<\/ol>/gis;
  let olMatch;
  let stepIndex = 1;

  while ((olMatch = olRegex.exec(post.content)) !== null) {
    const listContent = olMatch[1];
    const liRegex = /<li>(.*?)<\/li>/gis;
    let liMatch;
    while ((liMatch = liRegex.exec(listContent)) !== null) {
      const fullText = liMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (fullText.length > 5) {
        const strongMatch = liMatch[1].match(/<strong>(.*?)<\/strong>/i);
        const name = strongMatch
          ? strongMatch[1].replace(/<[^>]+>/g, '').replace(/[:.]/g, '').trim()
          : `Step ${stepIndex}`;
        steps.push({
          "@type": "HowToStep",
          "position": stepIndex,
          "name": name,
          "text": fullText,
          "url": `${canonicalUrl}#step-${stepIndex}`
        });
        stepIndex++;
      }
    }
  }

  if (steps.length === 0) return null;

  const supplyItems = [];
  const suppliesMatch = post.content.match(/<h2>What You Will Need<\/h2>\s*(?:<p>.*?<\/p>)?\s*<ul[^>]*>(.*?)<\/ul>/is);
  if (suppliesMatch) {
    const supplyLiRegex = /<li>(.*?)<\/li>/gis;
    let sMatch;
    while ((sMatch = supplyLiRegex.exec(suppliesMatch[1])) !== null) {
      const supplyText = sMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (supplyText) {
        supplyItems.push({
          "@type": "HowToSupply",
          "name": supplyText
        });
      }
    }
  }

  return {
    "@type": "HowTo",
    "@id": `${canonicalUrl}#howto`,
    "name": post.title,
    "description": post.excerpt,
    "image": post.image,
    "totalTime": "PT25M",
    ...(supplyItems.length > 0 ? { "supply": supplyItems } : {}),
    "step": steps
  };
}

function extractFAQSchema(post, canonicalUrl) {
  const faqItems = [];
  const troubleMatch = post.content.match(/<h2>Troubleshooting(?: Common Mistakes)?<\/h2>\s*<ul[^>]*>(.*?)<\/ul>/is);
  if (troubleMatch) {
    const liRegex = /<li>(.*?)<\/li>/gis;
    let li;
    while ((li = liRegex.exec(troubleMatch[1])) !== null) {
      const rawLi = li[1];
      const qMatch = rawLi.match(/<strong>["“]?(.*?)["”?]?<\/strong>/i);
      if (qMatch) {
        let question = qMatch[1].replace(/<[^>]+>/g, '').trim();
        if (!question.endsWith('?')) question += '?';
        const answer = rawLi.replace(/<strong>.*?<\/strong>/i, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (question && answer) {
          faqItems.push({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answer
            }
          });
        }
      }
    }
  }

  if (faqItems.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": `${canonicalUrl}#faq`,
    "mainEntity": faqItems
  };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };

  const siteUrl = 'https://carpenterwala.com';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  let cleanTitle = post.title;
  if (cleanTitle.includes(':')) {
    cleanTitle = cleanTitle.split(':')[0].trim();
  }
  if (cleanTitle === "The Ultimate Guide to Termite Prevention in Bangalore Homes") {
    cleanTitle = "Termite Prevention Guide for Bangalore";
  } else if (cleanTitle === "The Ultimate Diwali Home Renovation Checklist for a Festive Makeover") {
    cleanTitle = "Diwali Home Renovation Checklist";
  } else if (cleanTitle === "The Annual Bangalore Home Maintenance Checklist") {
    cleanTitle = "Bangalore Home Maintenance Checklist";
  } else if (cleanTitle === "How to Choose the Perfect Paint for Your Living Room") {
    cleanTitle = "Choose the Perfect Living Room Paint";
  } else if (cleanTitle === "5 Essential Carpentry Tips for Every Homeowner") {
    cleanTitle = "5 Essential Home Carpentry Tips";
  } else if (cleanTitle === "Top 5 Smart Home Electrical Upgrades for 2026") {
    cleanTitle = "5 Smart Home Electrical Upgrades";
  }

  const pageTitle = `${cleanTitle} | Carpenterwala`;
  const pageDescription = post.excerpt;

  const baseKeywords = ['carpenter blog', 'home improvement tips', 'Bangalore', 'handyman tips', 'furniture maintenance'];
  const postKeywords = [
    post.category,
    ...post.title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3)
  ];
  const keywords = Array.from(new Set([...baseKeywords, ...postKeywords]));

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'Carpenterwala',
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      locale: 'en_IN',
      type: 'article',
      publishedTime: new Date(post.date || '2026-05-01').toISOString(),
      authors: [AUTHORS_BY_CATEGORY[post.category]?.name || DEFAULT_AUTHOR.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [post.image],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <h1>Post Not Found</h1>
        <Link href="/blog" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Blog</Link>
      </div>
    );
  }

  const siteUrl = 'https://carpenterwala.com';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const author = AUTHORS_BY_CATEGORY[post.category] || DEFAULT_AUTHOR;
  const { html: processedContent, toc } = extractTOCAndInjectIds(post.content);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.category, url: `/blog/category/${slugify(post.category)}` },
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  // Schema.org Structured Data
  const blogJsonLd = {
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#blogposting`,
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "inLanguage": "en-IN",
    "articleSection": post.category,
    "datePublished": post.date ? new Date(post.date).toISOString().split('T')[0] : "2026-05-01",
    "dateModified": post.date ? new Date(post.date).toISOString().split('T')[0] : "2026-05-01",
    "author": {
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.role,
      "description": author.bio,
      "image": author.avatar
    },
    "publisher": {
      "@type": "Organization",
      "name": "Carpenterwala",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  const breadcrumbsJsonLd = {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
    }))
  };

  const howToJsonLd = extractHowToSchema(post, canonicalUrl);
  const faqJsonLd = extractFAQSchema(post, canonicalUrl);

  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      blogJsonLd,
      breadcrumbsJsonLd,
      ...(howToJsonLd ? [howToJsonLd] : []),
      ...(faqJsonLd ? [faqJsonLd] : [])
    ]
  };

  return (
    <div className="animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
      />
      <div className="container" style={{ padding: "1.5rem 2rem 0 2rem", marginBottom: "-1.5rem", position: "relative", zIndex: 10 }}>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Blog Hero */}
      <section style={{ height: '52vh', minHeight: '420px', position: 'relative', overflow: 'hidden' }}>
        <img
          src={post.image}
          alt={post.title}
          width={1200}
          height={600}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.95))'
        }}></div>
        <div className="container" style={{ position: 'absolute', bottom: '3.5rem', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <Link
              href={`/blog/category/${slugify(post.category)}`}
              className="category-badge-link"
              style={{
                backgroundColor: 'var(--primary)',
                display: 'inline-block',
                padding: '0.35rem 1.1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'white',
                letterSpacing: '0.5px'
              }}
            >
              {post.category}
            </Link>
            {howToJsonLd && (
              <span style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '0.35rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                🛠️ Step-by-Step DIY Guide
              </span>
            )}
            {faqJsonLd && (
              <span style={{
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                padding: '0.35rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                💡 Troubleshooting Included
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: '1.2', maxWidth: '920px', marginBottom: '1.5rem', color: '#ffffff' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: '1.5rem', opacity: 0.9, flexWrap: 'wrap', fontSize: '0.95rem', color: 'white' }}>
            <span>By <strong>{author.name}</strong></span>
            <span>📅 {post.date} </span>
            <span>⏱️ {post.readTime} </span>
          </div>
        </div>
      </section>

      {/* Blog Action Bar (AI Summarize + Save + Google Preferred) */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        <BlogActionBar
          title={post.title}
          slug={post.slug}
          canonicalUrl={canonicalUrl}
        />
      </div>

      {/* Content Section */}
      <section className="container" style={{ padding: '2rem 0 6rem', display: 'flex', gap: '3.5rem', flexWrap: 'wrap' }}>
        <article style={{ flex: '2 1 620px', minWidth: '300px', fontSize: '1.15rem', lineHeight: '1.85' }}>
          <style dangerouslySetInnerHTML={{
            __html: `
            .blog-content h2 {
              font-size: 1.85rem;
              margin: 3.5rem 0 1.25rem;
              color: var(--primary);
              scroll-margin-top: 100px;
              line-height: 1.3;
            }
            .blog-content h3 {
              font-size: 1.4rem;
              margin: 2.5rem 0 1rem;
              color: #c2410c;
              scroll-margin-top: 100px;
            }
            .blog-content p {
              margin-bottom: 1.5rem;
              opacity: 0.92;
            }
            .blog-content ul, .blog-content ol {
              margin-bottom: 2rem;
              padding-left: 1.75rem;
            }
            .blog-content li {
              margin-bottom: 0.85rem;
            }
            .blog-content strong {
              color: #c2410c;
            }
            .category-link {
              transition: all 0.3s ease;
              text-decoration: none;
              color: inherit;
            }
            .category-link:hover {
              background-color: var(--primary) !important;
              color: white !important;
              transform: translateY(-2px);
            }
            .category-badge-link {
              transition: all 0.3s ease;
            }
            .category-badge-link:hover {
              transform: scale(1.05);
              filter: brightness(1.1);
            }
            .toc-mobile {
              display: none;
              margin-bottom: 2.5rem;
              padding: 1.5rem;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid var(--glass-border);
              border-radius: 12px;
            }
            @media (max-width: 992px) {
              .toc-mobile {
                display: block;
              }
            }
            .toc-link {
              color: var(--foreground);
              text-decoration: none;
              display: block;
              padding: 0.35rem 0;
              transition: all 0.2s ease;
              font-size: 0.95rem;
              line-height: 1.4;
            }
            .toc-link:hover {
              color: var(--primary);
              transform: translateX(4px);
            }
            .toc-level-3 {
              padding-left: 1.25rem;
              font-size: 0.88rem;
              opacity: 0.85;
            }
          `}} />

          {/* Mobile Collapsible Table of Contents */}
          {toc.length > 0 && (
            <details className="toc-mobile">
              <summary style={{ fontWeight: 'bold', cursor: 'pointer', color: 'var(--primary)', outline: 'none' }}>
                📑 Table of Contents ({toc.length} sections) — Tap to expand
              </summary>
              <nav style={{ marginTop: '1rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? 'toc-level-3' : ''}>
                      <a href={`#${item.id}`} className="toc-link">
                        {item.level === 2 ? '• ' : '↳ '}
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          )}

          {processedContent.includes('<!-- PRO_ONBOARDING_TOUR_WIDGET -->') ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: processedContent.split('<!-- PRO_ONBOARDING_TOUR_WIDGET -->')[0] }} className="blog-content" />
              <ProOnboardingVisualTour />
              <div dangerouslySetInnerHTML={{ __html: processedContent.split('<!-- PRO_ONBOARDING_TOUR_WIDGET -->')[1] }} className="blog-content" />
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: processedContent }} className="blog-content" />
          )}

          {/* Author Bio Card (E-E-A-T) */}
          <div className="glass" style={{ display: 'flex', gap: '1.5rem', padding: '2rem', marginTop: '4rem', alignItems: 'center', flexWrap: 'wrap', borderRadius: '12px' }}>
            <img
              src={author.avatar}
              alt={author.name}
              width={80}
              height={80}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
            />
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{author.name}</h4>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>
                  Verified Specialist
                </span>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '500' }}>{author.role}</p>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8, lineHeight: '1.6' }}>{author.bio}</p>
            </div>
          </div>

          {/* Bottom Content Native Ad */}
          <AdSenseContainer
            slot="2345678901"
            format="fluid"
            responsive="true"
            style={{ margin: '3rem 0', minHeight: '280px' }}
          />

          {/* Professional Support CTA Card */}
          <div style={{
            marginTop: '3.5rem',
            padding: '2.25rem',
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: '14px',
            border: '1px solid var(--glass-border)'
          }}>
            <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>Need Hands-On Professional Support?</h3>
            <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>If you are facing a home repair challenge that requires heavy diagnostic tools or certified technical experience, our verified specialists in Bangalore are ready to assist.</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/find-a-professional" className="btn btn-primary">Find a Verified Pro</Link>
              <Link href="/services" className="btn btn-secondary">Explore All Services</Link>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{ flex: '1 1 320px', minWidth: '280px' }}>
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Desktop Table of Contents */}
            {toc.length > 0 && (
              <div className="glass" style={{ padding: '1.75rem', borderRadius: '14px' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <span>📖</span> Table of Contents
                </h3>
                <nav style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {toc.map((item) => (
                      <li key={item.id} className={item.level === 3 ? 'toc-level-3' : ''}>
                        <a href={`#${item.id}`} className="toc-link">
                          {item.level === 2 ? '• ' : '↳ '}
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* Share Article */}
            <div className="glass" style={{ padding: '1.75rem', borderRadius: '14px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Share this guide</h3>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Share on Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Share on X (Twitter)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Share on LinkedIn"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${canonicalUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Share on WhatsApp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Browse Categories</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Array.from(new Set(BLOG_POSTS.map(p => p.category))).map(cat => (
                  <Link
                    key={cat}
                    href={`/blog/category/${slugify(cat)}`}
                    className="category-link"
                    style={{
                      padding: '0.4rem 0.9rem',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      fontSize: '0.85rem'
                    }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar Display Ad */}
            <AdSenseContainer
              slot="3456789012"
              format="auto"
              style={{ minHeight: '280px' }}
            />
          </div>
        </aside>
      </section>

      {/* Back to Blog */}
      <div className="container" style={{ paddingBottom: '2rem' }}>
        <Link href="/blog" style={{ opacity: 0.7, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
          <span>←</span> Back to Blog Hub
        </Link>
      </div>

      {/* Blog Comments Section */}
      <div className="container" style={{ paddingBottom: '6rem' }}>
        <BlogComments blogSlug={post.slug} />
      </div>
    </div>
  );
}
