"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data';

const CATEGORIES = ['All', 'Carpentry', 'Painting', 'Plumbing', 'Electrical', 'Maintenance'];

export default function BlogLanding() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '8rem' }}>
      {/* Blog Hero */}
      <section className="glass" style={{ 
        padding: '8rem 0 6rem', 
        marginBottom: '4rem',
        background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.1) 0%, transparent 100%)',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', fontWeight: '800' }}>Expert Insights & Guides</h1>
          <p style={{ fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto', opacity: 0.8 }}>
            Professional advice, step-by-step tutorials, and industry secrets from Bangalore's most trusted handymen.
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
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '25px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeCategory === cat ? 'var(--primary)' : 'transparent',
                color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container">
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
            <button onClick={() => setActiveCategory('All')} className="btn btn-primary" style={{ marginTop: '2rem' }}>View All Articles</button>
          </div>
        )}
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
