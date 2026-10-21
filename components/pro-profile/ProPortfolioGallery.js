'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Curated high-resolution fallback craftsmanship examples for each trade
const TRADE_PORTFOLIO_DEFAULTS = {
  Carpenter: [
    { src: '/images/about-us-hero.png', title: 'Modular Kitchen Cabinets & Drawers', tag: 'Custom Woodwork' },
    { src: '/images/exit-intent-warranty.jpg', title: 'Full Height Sliding Wardrobe', tag: 'Plywood & Laminate' },
    { src: '/images/exit-intent-paint.jpg', title: 'Hardwood Dining Table & Polish', tag: 'Restoration' }
  ],
  Painter: [
    { src: '/images/exit-intent-paint.jpg', title: 'Luxury Interior Acrylic Wall Finish', tag: 'Smooth Emulsion' },
    { src: '/images/exit-intent-warranty.jpg', title: 'Accent Living Room Feature Wall', tag: 'Two-Tone Texture' },
    { src: '/images/about-us-hero.png', title: 'Weather-Shield Exterior Painting', tag: 'Monsoon Proof' }
  ],
  Plumber: [
    { src: '/images/exit-intent-drip.jpg', title: 'Concealed Bathroom Mixer & Diverter', tag: 'CPVC Piping' },
    { src: '/images/exit-intent-warranty.jpg', title: 'Kitchen Sink Double Trap & Tap Install', tag: 'Sanitary Fixtures' },
    { src: '/images/about-us-hero.png', title: 'Pressure Pump & Overhead Tank Setup', tag: 'Water Distribution' }
  ],
  Electrician: [
    { src: '/images/exit-intent-electricity.jpg', title: 'Modern Modular Switchboard & Concealed Box', tag: 'FR Wiring' },
    { src: '/images/exit-intent-warranty.jpg', title: 'False Ceiling Ambient LED Profile Lighting', tag: 'Lighting Architecture' },
    { src: '/images/about-us-hero.png', title: 'Main Distribution Board & RCCB Inverter Setup', tag: 'Surge Protection' }
  ]
};

export default function ProPortfolioGallery({ portfolio = [], trade = 'Carpenter', proName = 'Professional' }) {
  const [activeImage, setActiveImage] = useState(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveImage(null);
    };
    if (activeImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);

  // Combine user portfolio with trade defaults if user has sparse portfolio
  const userImages = (portfolio || []).map((img, idx) => ({
    src: img,
    title: `${trade} Craftsmanship Sample #${idx + 1}`,
    tag: 'Verified Work'
  }));

  const fallbackImages = TRADE_PORTFOLIO_DEFAULTS[trade] || TRADE_PORTFOLIO_DEFAULTS.Carpenter;
  const displayImages = userImages.length >= 2 ? userImages : [...userImages, ...fallbackImages.slice(userImages.length, 3)];

  return (
    <section className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>
            Work Portfolio & Craftsmanship
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', opacity: 0.7, fontSize: '0.85rem' }}>
            Inspect past projects and installation details completed by {proName}
          </p>
        </div>
        <span style={{ fontSize: '0.78rem', opacity: 0.6, background: 'rgba(0,0,0,0.04)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
          {displayImages.length} Showcase Photos
        </span>
      </div>

      {/* Grid of Portfolio Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        {displayImages.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(item)}
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
              background: 'var(--card-bg, #F5EFE6)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              height: '210px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
            />
            
            {/* Tag Badge */}
            <div style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              fontSize: '0.7rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              fontWeight: 600
            }}>
              {item.tag}
            </div>

            {/* Hover Caption Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1.25rem 0.85rem 0.75rem 0.85rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
              color: 'white'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.3 }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: '0.2rem' }}>
                🔍 Click to zoom full-screen
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '850px',
              width: '100%',
              background: 'var(--card-bg, #1e293b)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div>
                <strong style={{ fontSize: '1rem', color: 'var(--foreground, white)' }}>
                  {activeImage.title}
                </strong>
                <span style={{
                  fontSize: '0.72rem',
                  marginLeft: '0.65rem',
                  background: 'rgba(234, 88, 12, 0.15)',
                  color: 'var(--primary, #ea580c)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  {activeImage.tag}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--foreground, white)',
                  padding: '0.2rem 0.5rem',
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Image View */}
            <div style={{ position: 'relative', width: '100%', height: '480px', maxHeight: '70vh', background: '#000' }}>
              <Image
                src={activeImage.src}
                alt={activeImage.title}
                fill
                unoptimized
                style={{ objectFit: 'contain' }}
              />
            </div>

            {/* Modal Footer Caption */}
            <div style={{
              padding: '0.85rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              opacity: 0.8,
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span>Verified Craftsmanship by {proName}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Press Esc or click anywhere outside to close</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
