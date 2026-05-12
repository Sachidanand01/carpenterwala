"use client";

import Link from 'next/link';

const BLOG_POSTS = [
  {
    slug: '5-essential-carpentry-tips',
    title: '5 Essential Carpentry Tips for Every Homeowner',
    excerpt: 'Maintenance is key to making your furniture last. Learn these simple yet effective carpentry tips to keep your home in top shape.',
    category: 'Carpentry',
    date: 'May 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop'
  },
  {
    slug: 'choosing-the-right-paint',
    title: 'How to Choose the Perfect Paint for Your Living Room',
    excerpt: 'Colors can change the mood of your home. Discover how to pick the right finish and shade for your space with our expert guide.',
    category: 'Painting',
    date: 'May 8, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=2031&auto=format&fit=crop'
  },
  {
    slug: 'preventing-common-plumbing-issues',
    title: 'Preventing Common Plumbing Issues: A Homeowner’s Guide',
    excerpt: 'Leaks and clogs can be a nightmare. Learn how to identify early signs of plumbing problems and how to prevent them.',
    category: 'Plumbing',
    date: 'May 5, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1504148455328-497c5efdf13d?q=80&w=2070&auto=format&fit=crop'
  },
  {
    slug: 'smart-home-electrical-upgrades',
    title: 'Top 5 Smart Home Electrical Upgrades for 2026',
    excerpt: 'Make your home more efficient and secure with these must-have electrical upgrades, from smart switches to video doorbells.',
    category: 'Electrical',
    date: 'May 2, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070&auto=format&fit=crop'
  }
];

export default function BlogLanding() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '6rem 0', textAlign: 'center', marginBottom: '4rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
            The <span className="text-gradient">Home Tips</span> Blog
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
            Expert advice, DIY tips, and professional insights to help you build, maintain, and love your home.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container" style={{ marginBottom: '8rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {BLOG_POSTS.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} style={{ display: 'flex' }}>
              <article className="glass" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden', 
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ height: '220px', position: 'relative' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ 
                    position: 'absolute', 
                    top: '1rem', 
                    left: '1rem', 
                    backgroundColor: 'var(--primary)', 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold' 
                  }}>
                    {post.category}
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6, fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', lineHeight: '1.3' }}>{post.title}</h2>
                  <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>{post.excerpt}</p>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Read Full Article <span>→</span>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '6rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Stay Updated with Home Tips</h2>
            <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Subscribe to our newsletter and get the latest maintenance tips and exclusive offers delivered to your inbox.</p>
            <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap' }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={{ 
                  flex: 1, 
                  padding: '0.75rem 1rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--glass-border)', 
                  background: 'rgba(0,0,0,0.2)', 
                  color: 'white',
                  minWidth: '200px'
                }} 
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
