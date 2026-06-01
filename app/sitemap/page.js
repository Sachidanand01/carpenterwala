import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data';

export const metadata = {
  title: 'Sitemap | Carpenterwala Handyman Marketplace',
  description: 'Navigate easily through the Carpenterwala Professional Handyman Marketplace. Find verified carpenters, painters, plumbers, electricians, and home maintenance tips in Bangalore.',
  keywords: ['carpenterwala sitemap', 'handyman site directory', 'home service pages', 'bangalore contractor links'],
};

export default function SitemapPage() {
  // Define sitemap categories
  const categories = [
    {
      title: 'Core Platform',
      icon: '🏠',
      links: [
        { href: '/', label: 'Home Page', desc: 'Main hub to search and book handymen' },
        { href: '/find-a-professional', label: 'Find a Professional', desc: 'Browse and contact verified pros near you' },
        { href: '/about', label: 'About Us', desc: 'Our story, mission, and how we ensure quality' },
        { href: '/how-it-works', label: 'How it Works', desc: 'Understanding the booking & verification process' },
        { href: '/contact', label: 'Contact Us', desc: 'Get in touch with customer support' },
      ],
    },
    {
      title: 'Our Handyman Services',
      icon: '🛠️',
      links: [
        { href: '/services/carpentry', label: 'Carpentry Services', desc: 'Teak polishing, wardrobe custom build, general wooden repairs' },
        { href: '/services/painting', label: 'Painting Services', desc: 'Interior & exterior wall painting, waterproof wall coatings' },
        { href: '/services/plumbing', label: 'Plumbing Services', desc: 'Water softening, leak repair, general pipe fixture fixes' },
        { href: '/services/electrical', label: 'Electrical Services', desc: 'Smart home upgrades, wiring overhauls, MCB safety setup' },
      ],
    },
    {
      title: 'Portal Access',
      icon: '🔑',
      links: [
        { href: '/login', label: 'Customer Login / Sign Up', desc: 'Access bookings, manage warranties & profile details' },
        { href: '/pro/login', label: 'Service Pro Portal', desc: 'Sign up as a professional contractor or handyman' },
        { href: '/pro/dashboard', label: 'Pro Dashboard', desc: 'Manage incoming job leads, customer reviews & profiles' },
      ],
    },
    {
      title: 'Support & FAQs',
      icon: '💬',
      links: [
        { href: '/faq', label: 'Frequently Asked Questions', desc: 'Quick answers regarding charges, safety & warranty' },
        { href: '/help', label: 'Help Center', desc: 'Step-by-step guides for custom requests & payments' },
        { href: '/privacy', label: 'Privacy Policy', desc: 'How we protect your phone number and email data' },
        { href: '/terms', label: 'Terms & Conditions', desc: 'User agreement rules for customers and service pros' },
      ],
    },
  ];

  return (
    <div className="container" style={{ padding: '4rem 2rem 6rem 2rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient animate-fade-in" style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Carpenterwala Site Directory
        </h1>
        <p className="animate-fade-in delay-100" style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '750px', margin: '0 auto' }}>
          Explore our site directory. Use this map to navigate easily across our Bangalore handyman platform, direct services, portal gateways, and home improvement knowledge resources.
        </p>
      </section>

      {/* Grid of Categories */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}
      >
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            className="glass" 
            style={{ 
              padding: '2.25rem',
              transition: 'transform 0.3s ease, border-color 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '1.8rem' }}>{cat.icon}</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700' }}>{cat.title}</h2>
            </div>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cat.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <Link 
                    href={link.href} 
                    id={`sitemap-link-${idx}-${lIdx}`}
                    style={{ 
                      display: 'block', 
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <span 
                      style={{ 
                        fontWeight: '600', 
                        color: 'var(--primary)', 
                        fontSize: '1rem',
                        transition: 'color 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {link.label} <span>→</span>
                    </span>
                    <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '0.25rem' }}>
                      {link.desc}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Blog Hub Directory */}
      <section className="glass animate-fade-in delay-200" style={{ padding: '3rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.25rem' }}>
          <span style={{ fontSize: '2.5rem' }}>📚</span>
          <div>
            <h2 style={{ fontSize: '1.8rem' }}>Expert Home Tips & Resource Guides</h2>
            <p style={{ fontSize: '0.95rem', opacity: 0.7, marginTop: '0.25rem' }}>
              Read our latest professional tips on home improvement, wood Vastu advice, smart device setup, and maintenance.
            </p>
          </div>
        </div>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {BLOG_POSTS.map((post, postIdx) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={postIdx}
              id={`sitemap-blog-link-${postIdx}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                transition: 'all 0.25s ease',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em' }}>
                {post.category}
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                {post.title}
              </h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: 'auto' }}>
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
