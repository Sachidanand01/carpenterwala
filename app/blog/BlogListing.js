"use client";

import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data';
import Breadcrumbs from '@/components/Breadcrumbs';

const slugify = (cat) => cat.toLowerCase().replace(/\s+/g, '-');

const CATEGORY_DESCRIPTIONS = {
  all: `
    <h2 style="margin-bottom: 1.5rem;">Explore Expert Home Improvement Guides</h2>
    <p style="margin-bottom: 1.2rem; opacity: 0.85;">Welcome to the Carpenterwala blog, your premium source for step-by-step tutorials, home repair guides, and trade insights in Bangalore. From simple DIY cabinet repairs to large-scale house painting and rewiring projects, our verified professionals share their industry expertise to help you maintain a safe, beautiful, and efficient home.</p>
    <p style="opacity: 0.85;">Whether you are looking to understand modular kitchen materials, plan bedroom wall painting colors, or avoid common repair service scams, our articles provide detailed checklists and practical tips. Browse our categories above to find the exact help you need today.</p>
  `,
  carpentry: `
    <h2 style="margin-bottom: 1.5rem;">Professional Carpentry Guides & Woodwork Tips</h2>
    <p style="margin-bottom: 1.2rem; opacity: 0.85;">Explore our custom woodworking articles covering wardrobe ergonomics, structural furniture design, termite prevention, and door installations. Our master carpenters share insights into selecting durable materials like BWR plywood vs MDF and selecting the right finishes (laminate vs PU polish) for Indian households.</p>
    <p style="opacity: 0.85;">Maintaining high-quality teak wood furniture requires consistent care. Use our monthly checklists to identify structural damage, prevent moisture warping during monsoons, and keep your home's custom woodwork in top-tier shape for generations.</p>
  `,
  painting: `
    <h2 style="margin-bottom: 1.5rem;">Expert Painting Guides, Color Selection, & Exterior Waterproofing</h2>
    <p style="margin-bottom: 1.2rem; opacity: 0.85;">Your home’s walls define its visual appeal and protect its structure. Read our professional guides on picking the best paint colors for bedrooms, managing external dampness during the Bangalore monsoons, and applying anti-algae elastomeric coatings.</p>
    <p style="opacity: 0.85;">We also cover modern paint choices like zero-VOC and low-VOC emulsions that protect your family’s respiratory health and improve indoor air quality. Get tips on how to prepare metal window grills before applying red-oxide rust-proofing primers.</p>
  `,
  plumbing: `
    <h2 style="margin-bottom: 1.5rem;">Plumber Repair Guides & Water Management Solutions</h2>
    <p style="margin-bottom: 1.2rem; opacity: 0.85;">Plumbing issues can cause massive structural damages if left unaddressed. Learn how to locate your home’s main water shut-off valve, execute temporary emergency pipe repairs during burst events, and check water meters for silent leaks.</p>
    <p style="opacity: 0.85;">We also specialize in resolving Bangalore-specific hard water challenges. Learn about ion-exchange softeners, magnetic descalers, and compact tap filters to lower TDS levels, protect bathroom geysers, and safeguard your skin.</p>
  `,
  electrical: `
    <h2 style="margin-bottom: 1.5rem;">Home Electrical Safety, Rewiring Guides, & Smart Upgrades</h2>
    <p style="margin-bottom: 1.2rem; opacity: 0.85;">Electricity is the heartbeat of the modern home, but safety must always come first. Read our comprehensive guides on understanding the difference between MCBs (Miniature Circuit Breakers) and ELCBs (Earth Leakage Circuit Breakers) to protect your appliances and family.</p>
    <p style="opacity: 0.85;">Identify the warning signs of deteriorating 90s copper/aluminum wiring, plan complete home rewiring projects, and prepare your distribution panel for hybrid solar energy integration. Keep your home secure and energy-efficient with our expert checklists.</p>
  `,
  maintenance: `
    <h2 style="margin-bottom: 1.5rem;">Seasonal Home Maintenance Checklists & Contractor Vetting</h2>
    <p style="margin-bottom: 1.2rem; opacity: 0.85;">Prevention is always more cost-effective than emergency repair. Follow our year-round Bangalore home maintenance checklist, detailing roof waterproofing tasks in April, false ceiling repair guides, and prep work before the festive Diwali season.</p>
    <p style="opacity: 0.85;">We also provide practical tips on how to vet local handymen, listing the top screening questions to ask potential contractors about service warranties and material grades before you commit to booking.</p>
  `
};

export default function BlogListing({ selectedCategorySlug = 'all' }) {
  // Dynamically extract categories from all posts
  const categoriesFromPosts = Array.from(new Set(BLOG_POSTS.map(post => post.category)));
  const CATEGORIES = ['All', ...categoriesFromPosts];

  // Resolve the active category from the slug
  const activeCategory = CATEGORIES.find(
    (cat) => slugify(cat) === selectedCategorySlug.toLowerCase()
  ) || 'All';

  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  const breadcrumbItems = [
    { name: "Home", url: "/" }
  ];
  if (activeCategory === 'All') {
    breadcrumbItems.push({ name: "Blog", url: "/blog" });
  } else {
    breadcrumbItems.push({ name: "Blog", url: "/blog" });
    breadcrumbItems.push({ name: activeCategory, url: `/blog/category/${selectedCategorySlug}` });
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '8rem' }}>
      {/* Blog Hero */}
      <section className="glass" style={{ 
        padding: '2rem 0 6rem', 
        marginBottom: '4rem',
        background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.1) 0%, transparent 100%)',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div className="container" style={{ textAlign: 'left', marginBottom: '2rem', paddingLeft: '2rem' }}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', fontWeight: '800' }}>
            {activeCategory === 'All' ? 'Expert Insights & Guides' : `${activeCategory} Insights`}
          </h1>
          <p style={{ fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto', opacity: 0.8 }}>
            {activeCategory === 'All' 
              ? "Professional advice, step-by-step tutorials, and industry secrets from Bangalore's most trusted handymen."
              : `Expert guides, professional tips, and articles about ${activeCategory.toLowerCase()} for your home.`}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          padding: '1rem',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '50px',
          border: '1px solid var(--glass-border)',
          width: 'fit-content',
          margin: '0 auto'
        }}>
          {CATEGORIES.map(cat => {
            const catSlug = slugify(cat);
            const href = cat === 'All' ? '/blog' : `/blog/category/${catSlug}`;
            const isActive = activeCategory === cat;

            return (
              <Link
                key={cat}
                href={href}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '25px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="container">
        <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>
          {activeCategory === 'All' ? 'Latest Handyman Articles' : `Latest ${activeCategory} Guides`}
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '3rem' 
        }}>
          {filteredPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article className="glass blog-card" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} className="card-image" />
                  <div style={{ 
                    position: 'absolute', 
                    top: '1.5rem', 
                    left: '1.5rem', 
                    backgroundColor: 'rgba(15, 23, 42, 0.7)', 
                    backdropFilter: 'blur(10px)',
                    padding: '0.4rem 1rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {post.category}
                  </div>
                </div>
                <div style={{ padding: '2.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                    <span>{post.date}</span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', lineHeight: '1.3' }}>{post.title}</h3>
                  <p style={{ opacity: 0.7, lineHeight: '1.6', marginBottom: '2rem', flexGrow: 1 }}>{post.excerpt}</p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: 'var(--primary)', 
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}>
                    Read Article <span style={{ transition: 'transform 0.3s ease' }} className="arrow">→</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2>No articles found in this category.</h2>
            <Link href="/blog" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
              View All Articles
            </Link>
          </div>
        )}

        {/* Category Description Block */}
        <div 
          className="glass" 
          style={{ padding: '3rem', marginTop: '5rem', lineHeight: '1.7', opacity: 0.9 }}
          dangerouslySetInnerHTML={{ __html: CATEGORY_DESCRIPTIONS[selectedCategorySlug.toLowerCase()] || CATEGORY_DESCRIPTIONS['all'] }} 
        />
      </div>

      <style jsx>{`
        .blog-card:hover {
          transform: translateY(-10px);
          border-color: var(--primary);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .blog-card:hover .card-image {
          transform: scale(1.1);
        }
        .blog-card:hover .arrow {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
}
