import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data';
import Breadcrumbs from '@/components/Breadcrumbs';

const slugify = (cat) => cat.toLowerCase().replace(/\s+/g, '-');

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
  const pageTitle = `${post.title} | Carpenterwala Blog`;
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
      locale: 'en_US',
      type: 'article',
      publishedTime: new Date(post.date || '2026-05-01').toISOString(),
      authors: ['Carpenterwala Experts'],
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

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.category, url: `/blog/category/${slugify(post.category)}` },
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  return (
    <div className="animate-fade-in">
      <div className="container" style={{ padding: "1.5rem 2rem 0 2rem", marginBottom: "-1.5rem", position: "relative", zIndex: 10 }}>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      {/* Blog Hero */}
      <section style={{ height: '50vh', position: 'relative', overflow: 'hidden' }}>
        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.9))' 
        }}></div>
        <div className="container" style={{ position: 'absolute', bottom: '4rem', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
          <Link 
            href={`/blog/category/${slugify(post.category)}`}
            className="category-badge-link"
            style={{ 
              backgroundColor: 'var(--primary)', 
              display: 'inline-block', 
              padding: '0.3rem 1rem', 
              borderRadius: '20px', 
              fontSize: '0.9rem', 
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              textDecoration: 'none',
              color: 'white'
            }}
          >
            {post.category}
          </Link>
          <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', maxWidth: '900px' }}>{post.title}</h1>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', opacity: 0.8 }}>
            <span>By <strong>Carpenterwala Experts</strong></span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container" style={{ padding: '6rem 0', display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        <article style={{ flex: '2 1 600px', fontSize: '1.15rem', lineHeight: '1.8' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            .blog-content h2 {
              font-size: 2rem;
              margin: 3rem 0 1.5rem;
              color: var(--primary);
            }
            .blog-content p {
              margin-bottom: 1.5rem;
              opacity: 0.9;
            }
            .blog-content ul {
              margin-bottom: 2rem;
              padding-left: 1.5rem;
            }
            .blog-content li {
              margin-bottom: 0.75rem;
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
          `}} />
          <div dangerouslySetInnerHTML={{ __html: post.content }} className="blog-content" />
          
          <div style={{ 
            marginTop: '4rem', 
            padding: '2rem', 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            borderRadius: '12px',
            border: '1px solid var(--glass-border)'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Need professional help?</h3>
            <p style={{ marginBottom: '1.5rem' }}>If you're facing a home improvement challenge that requires an expert touch, we've got you covered.</p>
            <Link href="/find-a-professional" className="btn btn-primary">Find a Verified Pro</Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{ flex: '1 1 300px' }}>
          <div className="glass" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Share this article</h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <div className="social-icon" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.8rem' }}>FB</div>
              <div className="social-icon" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.8rem' }}>TW</div>
              <div className="social-icon" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.8rem' }}>LN</div>
              <div className="social-icon" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.8rem' }}>WA</div>
            </div>

            <h3 style={{ marginBottom: '1.5rem' }}>Related Categories</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {Array.from(new Set(BLOG_POSTS.map(p => p.category))).map(cat => (
                <Link 
                  key={cat} 
                  href={`/blog/category/${slugify(cat)}`}
                  className="category-link"
                  style={{ 
                    padding: '0.4rem 1rem', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '20px', 
                    fontSize: '0.9rem' 
                  }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Back to Blog */}
      <div className="container" style={{ paddingBottom: '6rem' }}>
        <Link href="/blog" style={{ opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>←</span> Back to Blog Listing
        </Link>
      </div>
    </div>
  );
}
