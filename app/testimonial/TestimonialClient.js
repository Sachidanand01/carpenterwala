'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';

export default function TestimonialClient({ initialReviews, initialPagination, initialStats }) {
  const [filter, setFilter] = useState('4plus'); // Default: 4 stars and above
  const [reviews, setReviews] = useState(initialReviews || []);
  const [pagination, setPagination] = useState(initialPagination || { total: 0, page: 1, pageSize: 9, totalPages: 1 });
  const [stats, setStats] = useState(initialStats || { averageRating: 4.85, totalReviews: 1420 });
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (newFilter) => {
    if (newFilter === filter) return;
    setFilter(newFilter);
    fetchPageData(newFilter, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === pagination.page) return;
    fetchPageData(filter, newPage);
    // Smooth scroll to reviews section
    if (typeof window !== 'undefined') {
      const el = document.getElementById('reviews-grid-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const fetchPageData = (currentFilter, currentPage) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/reviews?filter=${encodeURIComponent(currentFilter)}&page=${currentPage}&pageSize=9`);
        const json = await res.json();
        if (json.success) {
          setReviews(json.data || []);
          setPagination(json.pagination || { total: 0, page: currentPage, pageSize: 9, totalPages: 1 });
          if (json.stats) setStats(json.stats);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    });
  };

  // Helper to render star SVGs
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={star <= rating ? '#F59E0B' : '#E2E8F0'}
            stroke={star <= rating ? '#D97706' : '#CBD5E1'}
            strokeWidth="1"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="testimonials-container">
      {/* ════════════════════════════════════════
          HERO SUMMARY BANNER
          ════════════════════════════════════════ */}
      <section className="glass animate-fade-in" style={{
        padding: '3rem 2rem',
        borderRadius: 'var(--border-radius-lg)',
        marginBottom: '2.5rem',
        border: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(194,65,12,0.15) 0%, rgba(245,158,11,0.05) 50%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto' }}>
          {/* Eyebrow badge */}
          <div className="flex items-center justify-center gap-2" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--primary)',
              background: 'var(--primary-light)',
              padding: '0.3rem 0.85rem',
              borderRadius: '20px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Verified Google Business Reviews
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>
              Live Automated Ingestion
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)',
            letterSpacing: '-0.025em',
            fontWeight: 800,
            lineHeight: 1.18,
            color: 'var(--foreground)',
            marginBottom: '0.75rem'
          }}>
            What Bangalore Homeowners Say About <span className="text-gradient">Carpenterwala</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--foreground-muted)',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Real stories from verified customers who hired trusted carpenters, painters, plumbers, and electricians without middleman commissions.
          </p>

          {/* Quick Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            background: 'var(--background)',
            padding: '1.25rem',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--card-border)'
          }}>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                {stats.averageRating} ★
              </div>
              <div style={{ marginTop: '0.25rem' }}>
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>Average Rating</div>
            </div>

            <div style={{ borderLeft: '1px solid var(--card-border)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1 }}>
                {stats.totalReviews.toLocaleString()}+
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)', marginTop: '0.4rem' }}>
                ✓ 100% Verified
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Google Customers</div>
            </div>

            <div style={{ borderLeft: '1px solid var(--card-border)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
                0%
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', marginTop: '0.4rem' }}>
                Zero Commission
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Direct Connections</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FILTER BAR & INTERACTIVE CONTROLS
          ════════════════════════════════════════ */}
      <section id="reviews-grid-section" style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--card-border)'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Customer Testimonials
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: '0.1rem 0 0 0', color: 'var(--foreground)' }}>
              Showing {pagination.total} Verified Review{pagination.total === 1 ? '' : 's'}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleFilterChange('4plus')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: filter === '4plus' ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                background: filter === '4plus' ? 'var(--primary)' : 'var(--background)',
                color: filter === '4plus' ? '#FFFFFF' : 'var(--foreground)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>⭐</span> 4★ &amp; Above <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>(Default)</span>
            </button>

            <button
              type="button"
              onClick={() => handleFilterChange('5')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: filter === '5' ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                background: filter === '5' ? 'var(--primary)' : 'var(--background)',
                color: filter === '5' ? '#FFFFFF' : 'var(--foreground)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              5 Stars Only
            </button>

            <button
              type="button"
              onClick={() => handleFilterChange('all')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: filter === 'all' ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                background: filter === 'all' ? 'var(--primary)' : 'var(--background)',
                color: filter === 'all' ? '#FFFFFF' : 'var(--foreground)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              All Ratings
            </button>

            <button
              type="button"
              onClick={() => handleFilterChange('4')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: filter === '4' ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                background: filter === '4' ? 'var(--primary)' : 'var(--background)',
                color: filter === '4' ? '#FFFFFF' : 'var(--foreground)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              4 Stars
            </button>

            <button
              type="button"
              onClick={() => handleFilterChange('3')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: filter === '3' ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                background: filter === '3' ? 'var(--primary)' : 'var(--background)',
                color: filter === '3' ? '#FFFFFF' : 'var(--foreground)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              3 Stars
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS MASONRY/GRID CARDS
          ════════════════════════════════════════ */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          opacity: isPending ? 0.6 : 1,
          transition: 'opacity 0.2s ease',
          marginBottom: '3rem'
        }}
      >
        {reviews.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--glass-bg)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px dashed var(--glass-border)'
          }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>💬</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No reviews match this filter</h3>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Try selecting "4★ &amp; Above" or "All Ratings" to view all genuine customer testimonials.
            </p>
            <button
              onClick={() => handleFilterChange('4plus')}
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}
            >
              Reset to 4★ &amp; Above
            </button>
          </div>
        ) : (
          reviews.map((rev) => {
            const displayName = rev.author_display_name || rev.author_name;
            const initials = displayName
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={rev.id || rev.google_review_id}
                className="testimonial-card glass animate-fade-in"
                style={{
                  padding: '1.75rem',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  position: 'relative'
                }}
              >
                {/* Top Row: Avatar, Masked Name & Google Badge */}
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: '1rem', gap: '0.75rem' }}>
                    <div className="flex items-center gap-3">
                      {/* Customer Display Picture or Fallback Monogram */}
                      {rev.author_photo_url ? (
                        <img
                          src={rev.author_photo_url}
                          alt={displayName}
                          loading="lazy"
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid rgba(194, 65, 12, 0.2)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                          }}
                          onError={(e) => {
                            // Fallback to avatar placeholder on broken image
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}

                      {/* Fallback Monogram Avatar */}
                      <div
                        style={{
                          display: rev.author_photo_url ? 'none' : 'flex',
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                          color: '#FFFFFF',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(194, 65, 12, 0.2)'
                        }}
                      >
                        {initials}
                      </div>

                      <div>
                        {/* Only First Name and Last Name as Initial */}
                        <h3 style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          margin: 0,
                          color: 'var(--foreground)'
                        }}>
                          {displayName}
                        </h3>
                        <span style={{ fontSize: '0.75rem', opacity: 0.65, display: 'block', marginTop: '1px' }}>
                          Bangalore Homeowner
                        </span>
                      </div>
                    </div>

                    {/* Google Attribution Badge */}
                    <div
                      title="Verified Google Review"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--foreground-muted)',
                        background: 'rgba(0,0,0,0.04)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--card-border)'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      Google
                    </div>
                  </div>

                  {/* Rating & Relative Time */}
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.85rem' }}>
                    {renderStars(rev.rating)}
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                      {rev.relative_time_description || 'Recently'}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p style={{
                    fontSize: '0.92rem',
                    lineHeight: '1.65',
                    color: 'var(--foreground)',
                    opacity: 0.9,
                    margin: 0,
                    fontStyle: 'normal'
                  }}>
                    &ldquo;{rev.review_text}&rdquo;
                  </p>
                </div>

                {/* Bottom Verified Strip */}
                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--foreground-muted)'
                }}>
                  <span style={{ color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Verified Customer
                  </span>
                  <span>Bangalore, KA</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ════════════════════════════════════════
          PAGINATION BAR
          ════════════════════════════════════════ */}
      {pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '2rem 0 4rem 0',
          flexWrap: 'wrap'
        }}>
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || isPending}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'var(--background)',
              border: '1px solid var(--card-border)',
              color: pagination.page <= 1 ? 'var(--foreground-muted)' : 'var(--foreground)',
              cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
              opacity: pagination.page <= 1 ? 0.5 : 1
            }}
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePageChange(p)}
              disabled={isPending}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: pagination.page === p ? 'var(--primary)' : 'var(--background)',
                color: pagination.page === p ? '#FFFFFF' : 'var(--foreground)',
                border: pagination.page === p ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p}
            </button>
          ))}

          {/* Next Button */}
          <button
            type="button"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || isPending}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'var(--background)',
              border: '1px solid var(--card-border)',
              color: pagination.page >= pagination.totalPages ? 'var(--foreground-muted)' : 'var(--foreground)',
              cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
              opacity: pagination.page >= pagination.totalPages ? 0.5 : 1
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════
          BOTTOM CTA SECTION
          ════════════════════════════════════════ */}
      <section className="glass" style={{
        padding: '3rem 2rem',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--foreground)' }}>
          Experience Bangalore's Trusted Handyman Network
        </h2>
        <p style={{ color: 'var(--foreground-muted)', maxWidth: '58ch', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
          Join thousands of satisfied homeowners across Bangalore. Hire verified carpenters, painters, plumbers, and electricians directly with 0% platform markup.
        </p>
        <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
          <Link href="/find-a-professional" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontWeight: 600 }}>
            Find a Verified Professional
          </Link>
          <Link href="/pro/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem', fontWeight: 600 }}>
            Join as a Service Pro
          </Link>
        </div>
      </section>
    </div>
  );
}
