"use client";
import React, { useState } from 'react';
import { IconPlay, IconHeart } from '@/components/icons';

export default function ReelCard({ reel, onClick }) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const fallbackThumbnail = `https://img.youtube.com/vi/${reel.youtube_id}/hqdefault.jpg`;
  const displayThumb = imgError 
    ? fallbackThumbnail 
    : (reel.thumbnail_url || `https://img.youtube.com/vi/${reel.youtube_id}/maxresdefault.jpg`);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '9 / 16',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#1e293b',
        boxShadow: isHovered 
          ? '0 20px 30px -10px rgba(194, 65, 12, 0.3), 0 8px 16px rgba(0,0,0,0.12)' 
          : '0 4px 14px rgba(0,0,0,0.08)',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isHovered ? '2px solid var(--primary)' : '1px solid rgba(15, 23, 42, 0.08)',
      }}
    >
      {/* Background Image Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displayThumb}
        alt={reel.title}
        onError={() => setImgError(true)}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.5s ease',
        }}
      />

      {/* Dark Vignette Gradient Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.85) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Bar: Category Pill & DIY Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        {reel.category_name ? (
          <span
            style={{
              padding: '4px 10px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              letterSpacing: '0.02em',
            }}
          >
            {reel.category_name}
          </span>
        ) : (
          <span
            style={{
              padding: '4px 10px',
              backgroundColor: 'rgba(194, 65, 12, 0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            DIY Short
          </span>
        )}

        {/* Play Icon Indicator */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: isHovered ? 'var(--primary)' : 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            transition: 'all 0.25s ease',
          }}
        >
          <IconPlay size={14} fill="#ffffff" color="#ffffff" />
        </div>
      </div>

      {/* Center Hover Play Button */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${isHovered ? 1 : 0.8})`,
          opacity: isHovered ? 1 : 0,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(194, 65, 12, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(194, 65, 12, 0.6)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 3,
        }}
      >
        <IconPlay size={24} fill="#ffffff" color="#ffffff" style={{ marginLeft: '3px' }} />
      </div>

      {/* Bottom Content Info */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 14px',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <h3
          style={{
            color: '#ffffff',
            fontSize: '0.98rem',
            fontWeight: 700,
            lineHeight: 1.35,
            textShadow: '0 2px 4px rgba(0,0,0,0.6)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {reel.title}
        </h3>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.85)',
            marginTop: '2px',
          }}
        >
          <span>{reel.views_count ? `${Number(reel.views_count).toLocaleString()} views` : 'Watch Short'}</span>
          {reel.likes_count ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IconHeart size={13} fill="#ff4d4f" color="#ff4d4f" />
              {reel.likes_count}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
