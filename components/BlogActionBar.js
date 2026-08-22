'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function BlogActionBar({ title, slug, canonicalUrl }) {
  const [isSaved, setIsSaved] = useState(false);
  const [showSavePopover, setShowSavePopover] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const popoverRef = useRef(null);

  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('carpenterwala_saved_blogs') || '[]');
      if (savedList.some((item) => item.slug === slug)) {
        setIsSaved(true);
      }
    } catch (e) {
      console.error('Error reading saved articles from localStorage', e);
    }
  }, [slug]);

  // Handle clicking outside the popover to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowSavePopover(false);
      }
    }
    if (showSavePopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSavePopover]);

  const handleSaveToggle = () => {
    try {
      const savedList = JSON.parse(localStorage.getItem('carpenterwala_saved_blogs') || '[]');
      let updated;
      if (isSaved) {
        updated = savedList.filter((item) => item.slug !== slug);
        setIsSaved(false);
        setToastMessage('Removed from bookmarks');
      } else {
        updated = [...savedList, { slug, title, url: canonicalUrl, savedAt: new Date().toISOString() }];
        setIsSaved(true);
        setToastMessage('Article saved to bookmarks! 🔖');
        setShowSavePopover(true);
      }
      localStorage.setItem('carpenterwala_saved_blogs', JSON.stringify(updated));

      setTimeout(() => {
        setToastMessage('');
      }, 3000);
    } catch (e) {
      console.error('Error saving article to localStorage', e);
    }
  };

  const encodedPrompt = encodeURIComponent(`Please provide a concise, structured summary and key takeaways of this guide: ${canonicalUrl}`);

  const aiTools = [
    {
      name: 'ChatGPT',
      url: `https://chatgpt.com/?q=${encodedPrompt}`,
      icon: (
        <svg viewBox="0 0 512 509.639" fill="none" stroke="currentColor" stroke-Width="10">
          <path d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.5z" />
        </svg>
      )
    },
    {
      name: 'Claude',
      url: `https://claude.ai/new?q=${encodedPrompt}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a1 1 0 0 1 1 1v2.07a8 8 0 0 1 3.52 1.46l1.46-1.46a1 1 0 1 1 1.42 1.42l-1.46 1.46A8 8 0 0 1 19.4 11H21a1 1 0 1 1 0 2h-1.6a8 8 0 0 1-1.46 3.52l1.46 1.46a1 1 0 0 1-1.42 1.42l-1.46-1.46A8 8 0 0 1 13 19.4V21a1 1 0 1 1-2 0v-1.6a8 8 0 0 1-3.52-1.46l-1.46 1.46a1 1 0 0 1-1.42-1.42l1.46-1.46A8 8 0 0 1 4.6 13H3a1 1 0 1 1 0-2h1.6a8 8 0 0 1 1.46-3.52L4.6 6.02a1 1 0 0 1 1.42-1.42l1.46 1.46A8 8 0 0 1 11 4.6V3a1 1 0 0 1 1-1zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
        </svg>
      )
    },
    {
      name: 'Gemini',
      url: `https://gemini.google.com/app?q=${encodedPrompt}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.373 5.627-12 12-12-6.373 0-12-5.373-12-12z" />
        </svg>
      )
    },
    {
      name: 'Perplexity',
      url: `https://www.perplexity.ai/search?q=${encodedPrompt}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="m4.93 4.93 14.14 14.14" />
        </svg>
      )
    },
    {
      name: 'Grok',
      url: `https://x.com/i/grok?text=${encodedPrompt}`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'Copilot',
      url: `https://copilot.microsoft.com/?q=${encodedPrompt}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V15a1 1 0 0 0-2 0v1.93A8 8 0 0 1 4.07 13H6a1 1 0 0 0 0-2H4.07A8 8 0 0 1 11 4.07V6a1 1 0 0 0 2 0V4.07A8 8 0 0 1 19.93 11H18a1 1 0 0 0 0 2h1.93A8 8 0 0 1 13 16.93z" />
        </svg>
      )
    }
  ];

  return (
    <div className="blog-action-bar-wrapper" style={{ position: 'relative', zIndex: 30 }}>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          border: '1px solid var(--primary)',
          fontSize: '0.9rem',
          fontWeight: '500',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.25s ease'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="blog-action-bar-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        padding: '1rem 1.5rem',
        margin: '2rem 0 1rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)',
        borderRadius: '14px',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Left Section: Summarize with AI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.92rem',
            fontWeight: '600',
            color: 'var(--foreground)',
            letterSpacing: '0.2px'
          }}>
            Summarize with:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {aiTools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Summarize with ${tool.name}`}
                aria-label={`Summarize article using ${tool.name}`}
                className="social-icon"
                style={{ textDecoration: 'none' }}
              >
                {tool.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Section: Save (Bookmark) & Preferred on Google CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', position: 'relative' }}>

          {/* Save Button */}
          <div style={{ position: 'relative' }} ref={popoverRef}>
            <button
              onClick={handleSaveToggle}
              className="action-btn-save"
              aria-label={isSaved ? "Remove from saved articles" : "Save article for later"}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                backgroundColor: isSaved ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                border: isSaved ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isSaved ? 'var(--primary)' : 'var(--foreground)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{isSaved ? 'Saved' : 'Save'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>

            {/* Popover / Tooltip when saved */}
            {showSavePopover && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '260px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                zIndex: 100,
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#f8fafc', fontWeight: '600' }}>
                    Sign in to save for later
                  </p>
                  <button
                    onClick={() => setShowSavePopover(false)}
                    aria-label="Close save popover"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: 0,
                      lineHeight: 1
                    }}
                  >
                    ✕
                  </button>
                </div>
                <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
                  Create a free account or sign in to sync your bookmarked guides across all your devices.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href="/login"
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.78rem',
                      textAlign: 'center',
                      borderRadius: '6px'
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.78rem',
                      textAlign: 'center',
                      borderRadius: '6px'
                    }}
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Add as preferred on Google Button */}
          <a
            href="https://www.google.com/preferences/source?q=carpenterwala.com"
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn-google"
            aria-label="Add Carpenterwala as preferred source on Google"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.5rem 1.05rem',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              fontSize: '0.88rem',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
          >
            {/* Google Multi-Color G Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Add as preferred on Google</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .action-btn-save:hover {
          background-color: rgba(255, 255, 255, 0.12) !important;
          transform: translateY(-1px);
        }
        .action-btn-google:hover {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        @media (max-width: 768px) {
          .blog-action-bar-container {
            flex-direction: column;
            align-items: stretch !important;
            padding: 1rem !important;
          }
          .blog-action-bar-container > div {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
