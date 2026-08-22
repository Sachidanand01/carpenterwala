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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l2.64-1.523 2.64 1.523v3.046l-2.64 1.523-2.64-1.523z" />
        </svg>
      )
    },
    {
      name: 'Claude',
      url: `https://claude.ai/new?q=${encodedPrompt}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a1 1 0 0 1 1 1v2.07a8 8 0 0 1 3.52 1.46l1.46-1.46a1 1 0 1 1 1.42 1.42l-1.46 1.46A8 8 0 0 1 19.4 11H21a1 1 0 1 1 0 2h-1.6a8 8 0 0 1-1.46 3.52l1.46 1.46a1 1 0 0 1-1.42 1.42l-1.46-1.46A8 8 0 0 1 13 19.4V21a1 1 0 1 1-2 0v-1.6a8 8 0 0 1-3.52-1.46l-1.46 1.46a1 1 0 0 1-1.42-1.42l1.46-1.46A8 8 0 0 1 4.6 13H3a1 1 0 1 1 0-2h1.6a8 8 0 0 1 1.46-3.52L4.6 6.02a1 1 0 0 1 1.42-1.42l1.46 1.46A8 8 0 0 1 11 4.6V3a1 1 0 0 1 1-1zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
        </svg>
      )
    },
    {
      name: 'Gemini',
      url: `https://gemini.google.com/app?q=${encodedPrompt}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.373 5.627-12 12-12-6.373 0-12-5.373-12-12z" />
        </svg>
      )
    },
    {
      name: 'Perplexity',
      url: `https://www.perplexity.ai/search?q=${encodedPrompt}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="m4.93 4.93 14.14 14.14" />
        </svg>
      )
    },
    {
      name: 'Copilot',
      url: `https://copilot.microsoft.com/?q=${encodedPrompt}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
            fontSize: '0.9rem',
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
                className="ai-tool-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
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
                color: isSaved ? 'var(--primary)' : '#0f172a',
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
        .ai-tool-btn:hover {
          background-color: rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          border-color: var(--primary) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }
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
