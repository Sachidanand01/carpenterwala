import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProTradeBlogs({ blogs = [], trade = 'Carpenter', proName = 'Professional' }) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>
            📚 Expert {trade} Guides & Tips
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', opacity: 0.7, fontSize: '0.85rem' }}>
            Learn maintenance best practices and DIY care recommended by verified pros like {proName}
          </p>
        </div>
        <Link
          href="/blog"
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--primary)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <span>View All Guides</span>
          <span>→</span>
        </Link>
      </div>

      {/* 3-Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        {blogs.slice(0, 3).map((post, idx) => (
          <Link
            key={idx}
            href={`/blog/${post.slug}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--card-bg, #F5EFE6)',
              border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            className="hover-card"
          >
            {/* Thumbnail */}
            <div style={{ position: 'relative', width: '100%', height: '150px', background: 'rgba(0,0,0,0.05)' }}>
              <Image
                src={post.image || '/images/about-us-hero.png'}
                alt={post.title}
                fill
                unoptimized
                style={{ objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                top: '0.65rem',
                left: '0.65rem',
                fontSize: '0.68rem',
                fontWeight: 700,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(4px)',
                color: 'white',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                {post.category || trade}
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.title}
                </h3>
                <p style={{
                  fontSize: '0.8rem',
                  opacity: 0.7,
                  margin: 0,
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.excerpt || post.metaDescription}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1rem',
                fontSize: '0.75rem',
                opacity: 0.6,
                borderTop: '1px solid var(--glass-border, rgba(0,0,0,0.06))',
                paddingTop: '0.65rem'
              }}>
                <span>⏱️ {post.readTime || '5 min read'}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Read Article →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
