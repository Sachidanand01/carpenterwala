"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  IconClose,
  IconChevronUp,
  IconChevronDown,
  IconHeart,
  IconShare,
  IconBookmark,
  IconYouTube,
  IconVolume,
  IconVolumeMute,
  IconCarpentry
} from '@/components/icons';
import { recordReelView, toggleReelLike } from '@/lib/reels';
import Link from 'next/link';

export default function ReelPlayerModal({
  reels = [],
  initialIndex = 0,
  onClose
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [likedMap, setLikedMap] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('cw_liked_reels') || '{}');
      } catch {
        return {};
      }
    }
    return {};
  });
  const [savedMap, setSavedMap] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('cw_saved_reels') || '{}');
      } catch {
        return {};
      }
    }
    return {};
  });
  const [showShareToast, setShowShareToast] = useState(false);
  const [showDescExpanded, setShowDescExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const containerRef = useRef(null);
  const currentReel = reels[currentIndex] || reels[0];

  // Sync active reel to URL & trigger view count
  useEffect(() => {
    if (!currentReel) return;
    
    // Sync browser URL search param without full reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('v', currentReel.youtube_id);
      window.history.replaceState({}, '', url.toString());
    }

    // Record on-site view
    if (currentReel.id) {
      recordReelView(currentReel.id);
    }
  }, [currentIndex, currentReel]);

  // Navigate next / previous
  const handleNext = useCallback(() => {
    setShowDescExpanded(false);
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop back to start for endless binge-watching
      setCurrentIndex(0);
    }
  }, [currentIndex, reels.length]);

  const handlePrev = useCallback(() => {
    setShowDescExpanded(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(reels.length - 1);
    }
  }, [currentIndex, reels.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background body scrolling while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, handleNext, handlePrev]);

  // Touch swipe gesture handlers for mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > 50;
    const isSwipeDown = distance < -50;

    if (isSwipeUp) {
      handleNext();
    } else if (isSwipeDown) {
      handlePrev();
    }
  };

  // Like handler
  const handleToggleLike = () => {
    if (!currentReel) return;
    const isCurrentlyLiked = !!likedMap[currentReel.youtube_id];
    const newLikedState = !isCurrentlyLiked;

    const newMap = { ...likedMap, [currentReel.youtube_id]: newLikedState };
    setLikedMap(newMap);
    localStorage.setItem('cw_liked_reels', JSON.stringify(newMap));

    // Update in database if reel has an ID
    if (currentReel.id) {
      toggleReelLike(currentReel.id, newLikedState ? 1 : -1);
    }
  };

  // Bookmark / Save handler
  const handleToggleSave = () => {
    if (!currentReel) return;
    const isCurrentlySaved = !!savedMap[currentReel.youtube_id];
    const newSavedState = !isCurrentlySaved;

    const newMap = { ...savedMap, [currentReel.youtube_id]: newSavedState };
    setSavedMap(newMap);
    localStorage.setItem('cw_saved_reels', JSON.stringify(newMap));
  };

  // Share handler
  const handleShare = () => {
    if (!currentReel) return;
    const shareUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/diy-reels?v=${currentReel.youtube_id}` 
      : `https://carpenterwala.com/diy-reels?v=${currentReel.youtube_id}`;
    
    const shareText = `Watch "${currentReel.title}" on Carpenterwala DIY Reels! 🛠️`;

    if (navigator.share) {
      navigator.share({
        title: currentReel.title,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const isLiked = !!likedMap[currentReel?.youtube_id];
  const isSaved = !!savedMap[currentReel?.youtube_id];
  const youtubeUrl = `https://www.youtube.com/shorts/${currentReel?.youtube_id}`;
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${currentReel?.youtube_id}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${currentReel?.youtube_id}&controls=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`;

  if (!currentReel) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(5, 7, 12, 0.94)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close Button Top Right */}
      <button
        onClick={onClose}
        title="Close (Esc)"
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          zIndex: 100,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
      >
        <IconClose size={24} color="#ffffff" />
      </button>

      {/* Share Toast Notification */}
      {showShareToast && (
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            padding: '10px 24px',
            borderRadius: '9999px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            fontWeight: 600,
            fontSize: '0.9rem',
            zIndex: 150,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          ✓ Link copied to clipboard!
        </div>
      )}

      {/* Main Player Center Column */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '430px',
          height: '92vh',
          maxHeight: '860px',
          aspectRatio: '9 / 16',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#000000',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(194, 65, 12, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* YouTube Embedded Video IFrame */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
          }}
        >
          <iframe
            key={`${currentReel.youtube_id}-${isMuted ? 'muted' : 'unmuted'}`}
            src={iframeSrc}
            title={currentReel.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
          />
        </div>

        {/* Floating Right Action Sidebar */}
        <div
          style={{
            position: 'absolute',
            right: '12px',
            bottom: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            zIndex: 20,
          }}
        >
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            title="Like this reel"
            style={{
              background: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isLiked ? '#ff4d4f' : '#ffffff',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <IconHeart size={24} fill={isLiked ? '#ff4d4f' : 'none'} color={isLiked ? '#ff4d4f' : '#ffffff'} />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleSave}
            title="Save to favorites"
            style={{
              background: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isSaved ? '#f59e0b' : '#ffffff',
              transition: 'transform 0.2s ease',
            }}
          >
            <IconBookmark size={22} fill={isSaved ? '#f59e0b' : 'none'} color={isSaved ? '#f59e0b' : '#ffffff'} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            title="Share reel / Copy link"
            style={{
              background: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              transition: 'transform 0.2s ease',
            }}
          >
            <IconShare size={22} color="#ffffff" />
          </button>

          {/* YouTube Subscribe / Watch on YouTube Button */}
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Subscribe & Watch on official YouTube"
            style={{
              background: 'rgba(255, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(255, 0, 0, 0.4)',
              transition: 'transform 0.2s ease',
            }}
          >
            <IconYouTube size={24} color="#ffffff" />
          </a>

          {/* Mute / Unmute Button */}
          <button
            onClick={() => setIsMuted(prev => !prev)}
            title={isMuted ? 'Unmute' : 'Mute'}
            style={{
              background: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
            }}
          >
            {isMuted ? <IconVolumeMute size={22} color="#ffffff" /> : <IconVolume size={22} color="#ffffff" />}
          </button>
        </div>

        {/* Bottom Info & CTA Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: '70px',
            padding: '16px 14px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'auto',
          }}
        >
          {/* Category Pill */}
          {currentReel.category_name && (
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {currentReel.category_name}
              </span>
            </div>
          )}

          {/* Title */}
          <h2
            style={{
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              lineHeight: 1.3,
              textShadow: '0 2px 4px rgba(0,0,0,0.7)',
            }}
          >
            {currentReel.title}
          </h2>

          {/* Description */}
          {currentReel.description && (
            <div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.8rem',
                  lineHeight: 1.4,
                  display: showDescExpanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: showDescExpanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {currentReel.description}
              </p>
              {currentReel.description.length > 90 && (
                <button
                  onClick={() => setShowDescExpanded(prev => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    marginTop: '2px',
                  }}
                >
                  {showDescExpanded ? 'Show less' : '...more'}
                </button>
              )}
            </div>
          )}

          {/* Service Pro Booking CTA */}
          <Link
            href="/services/carpentry"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              width: 'fit-content',
              marginTop: '4px',
              transition: 'background-color 0.2s',
            }}
          >
            <IconCarpentry size={16} color="var(--primary)" />
            Need help with this? Book a Pro →
          </Link>
        </div>
      </div>

      {/* Floating Desktop Next / Prev Navigation Controls */}
      <div
        style={{
          position: 'absolute',
          right: 'calc(50% - 280px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          zIndex: 50,
        }}
        className="desktop-only"
      >
        <button
          onClick={handlePrev}
          title="Previous Reel (Arrow Up)"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <IconChevronUp size={24} color="#ffffff" />
        </button>

        <button
          onClick={handleNext}
          title="Next Reel (Arrow Down)"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <IconChevronDown size={24} color="#ffffff" />
        </button>
      </div>

      {/* Reel Counter Pill Bottom Left */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          padding: '6px 14px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.8rem',
          fontWeight: 600,
        }}
        className="desktop-only"
      >
        Reel {currentIndex + 1} of {reels.length} • Use ↑ / ↓ keys to navigate
      </div>
    </div>
  );
}
