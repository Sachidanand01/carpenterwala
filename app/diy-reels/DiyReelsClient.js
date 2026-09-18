"use client";
import React, { useState, useEffect, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  IconSearch,
  IconReels,
  IconTools,
  IconClose,
  IconYouTube,
  IconBlog,
  IconCarpentry
} from '@/components/icons';
import ReelCard from '@/components/reels/ReelCard';
import ReelPlayerModal from '@/components/reels/ReelPlayerModal';
import { getDiyReels, getDiyCategories } from '@/lib/reels';

export default function DiyReelsClient({ initialReels = [], initialCategories = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialVideoId = searchParams.get('v');
  const initialCategory = searchParams.get('category') || 'all';

  const [reels, setReels] = useState(initialReels);
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [activePlayerIndex, setActivePlayerIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Load fresh reels & categories from client on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [reelsData, catsData] = await Promise.all([
          getDiyReels({ limit: 100 }),
          getDiyCategories()
        ]);
        if (reelsData && reelsData.length > 0) setReels(reelsData);
        if (catsData && catsData.length > 0) setCategories(catsData);
      } catch (e) {
        console.warn("Error refreshing DIY reels data:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync category param from URL if changed
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);
  }, [searchParams]);

  // Open player modal if URL has ?v=[video_id]
  useEffect(() => {
    if (initialVideoId && reels.length > 0) {
      const idx = reels.findIndex(r => r.youtube_id === initialVideoId);
      if (idx !== -1) {
        setActivePlayerIndex(idx);
      }
    }
  }, [initialVideoId, reels]);

  // Handle category change
  const handleCategoryChange = (catSlug) => {
    setSelectedCategory(catSlug);
    startTransition(() => {
      const url = new URL(window.location.href);
      if (catSlug && catSlug !== 'all') {
        url.searchParams.set('category', catSlug);
      } else {
        url.searchParams.delete('category');
      }
      router.replace(url.pathname + url.search, { scroll: false });
    });
  };

  // Close player modal
  const handleClosePlayer = () => {
    setActivePlayerIndex(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('v');
    window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
  };

  // Filter reels based on search term & category
  const filteredReels = useMemo(() => {
    return reels.filter((reel) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' ||
        reel.category_name?.toLowerCase() === selectedCategory.toLowerCase() ||
        String(reel.category_id) === String(selectedCategory);

      // Search term filter
      const matchesSearch =
        !searchTerm.trim() ||
        reel.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        reel.description?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        reel.tags?.some(tag => tag.toLowerCase().includes(searchTerm.trim().toLowerCase())) ||
        reel.category_name?.toLowerCase().includes(searchTerm.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [reels, selectedCategory, searchTerm]);

  // Extract unique category names from custom categories and reels
  const allCategoryOptions = useMemo(() => {
    const list = [...categories];
    // If some reels have category_name that is not in custom categories list, include it
    reels.forEach(r => {
      if (r.category_name && !list.some(c => c.name.toLowerCase() === r.category_name.toLowerCase())) {
        list.push({ id: `dyn-${r.category_name}`, name: r.category_name, slug: r.category_name.toLowerCase() });
      }
    });
    return list;
  }, [categories, reels]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', paddingTop: '100px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              backgroundColor: 'var(--primary-light)',
              borderRadius: '9999px',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '14px',
              border: '1px solid rgba(194, 65, 12, 0.25)',
            }}
          >
            <IconReels size={18} color="var(--primary)" />
            <span>Shorts & Woodworking Video Guides</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: 'var(--foreground)',
              lineHeight: 1.15,
              marginBottom: '14px',
              letterSpacing: '-0.02em',
            }}
          >
            DIY <span className="text-gradient">Reels</span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--foreground-muted)',
              maxWidth: '650px',
              margin: '0 auto 28px',
              lineHeight: 1.6,
            }}
          >
            Watch bite-sized carpentry hacks, DIY furniture polish tips, quick hinge fixes, and pro home improvement tricks in under 60 seconds.
          </p>

          {/* Search Bar & Category Filter Bar */}
          <div
            style={{
              maxWidth: '780px',
              margin: '0 auto',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '16px',
              padding: '10px',
              border: '1px solid var(--card-border)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                flex: '1 1 280px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'var(--background)',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(15, 23, 42, 0.1)',
              }}
            >
              <IconSearch size={18} color="var(--foreground-muted)" />
              <input
                type="text"
                placeholder="Search reels (e.g., door hinge, polish, kitchen)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '0.95rem',
                  color: 'var(--foreground)',
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--foreground-muted)',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconClose size={16} color="var(--foreground-muted)" />
                </button>
              )}
            </div>

            {/* Categories Dropdown Selector */}
            <div style={{ flex: '0 0 auto', minWidth: '180px' }}>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                aria-label="Filter reels by category"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(15, 23, 42, 0.1)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Categories ({reels.length})</option>
                {allCategoryOptions.map((cat) => (
                  <option key={cat.id || cat.slug || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Pill Chips */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '18px',
            }}
          >
            <button
              onClick={() => handleCategoryChange('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedCategory === 'all' ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                backgroundColor: selectedCategory === 'all' ? 'var(--primary)' : 'var(--card-bg)',
                color: selectedCategory === 'all' ? '#ffffff' : 'var(--foreground-muted)',
                transition: 'all 0.2s ease',
              }}
            >
              All
            </button>
            {allCategoryOptions.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={`pill-${cat.id || cat.name}`}
                  onClick={() => handleCategoryChange(cat.name)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                    backgroundColor: isSelected ? 'var(--primary)' : 'var(--card-bg)',
                    color: isSelected ? '#ffffff' : 'var(--foreground-muted)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--card-border)',
          }}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>
            Showing <span style={{ color: 'var(--foreground)', fontWeight: 700 }}>{filteredReels.length}</span> DIY {filteredReels.length === 1 ? 'reel' : 'reels'}
            {selectedCategory !== 'all' && (
              <span> in <strong style={{ color: 'var(--primary)' }}>{selectedCategory}</strong></span>
            )}
            {searchTerm && (
              <span> matching &ldquo;<strong>{searchTerm}</strong>&rdquo;</span>
            )}
          </div>

          {(selectedCategory !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                handleCategoryChange('all');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Video Grid or Coming Soon / Empty State */}
        {filteredReels.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredReels.map((reel, index) => (
              <ReelCard
                key={reel.id || reel.youtube_id}
                reel={reel}
                onClick={() => setActivePlayerIndex(index)}
              />
            ))}
          </div>
        ) : reels.length === 0 ? (
          /* 🚀 Premium Coming Soon / Stay Tuned Showcase */
          <div
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '24px',
              border: '1px solid var(--card-border)',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.06)',
              maxWidth: '860px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 25px var(--primary-glow)',
                fontSize: '2rem',
              }}
            >
              🚀
            </div>

            <div
              style={{
                display: 'inline-block',
                padding: '4px 14px',
                backgroundColor: 'rgba(194, 65, 12, 0.12)',
                borderRadius: '9999px',
                color: 'var(--primary)',
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '12px',
              }}
            >
              Coming Soon • Premiere Week
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--foreground)',
                marginBottom: '12px',
                lineHeight: 1.25,
              }}
            >
              Stay Tuned! Fresh DIY Reels Are Dropping Soon
            </h2>

            <p
              style={{
                color: 'var(--foreground-muted)',
                fontSize: '1rem',
                maxWidth: '620px',
                margin: '0 auto 32px',
                lineHeight: 1.6,
              }}
            >
              We are currently in the workshop crafting quick 60-second carpentry hacks, furniture restoration tricks, soft-close hinge fixes, and woodworking shorts. Our first reel series goes live this week!
            </p>

            {/* Teaser 3-Column Action Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
                textAlign: 'left',
              }}
            >
              {/* Card 1: Explore Blogs */}
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--background)',
                  borderRadius: '14px',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <IconBlog size={20} color="var(--primary)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Expert DIY Blogs</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--foreground-muted)', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                    Read in-depth home improvement guides, polish comparisons, and repair checklists while you wait.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="btn btn-primary"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  Explore Blogs →
                </Link>
              </div>

              {/* Card 2: Subscribe YouTube */}
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--background)',
                  borderRadius: '14px',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <IconYouTube size={20} color="#FF0000" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>YouTube Channel</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--foreground-muted)', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                    Subscribe to get notified the exact minute our first carpentry short goes live!
                  </p>
                </div>
                <a
                  href="https://www.youtube.com/@your-carpenterwala?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    backgroundColor: '#FF0000',
                    borderColor: '#FF0000',
                    textAlign: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <IconYouTube size={16} color="#ffffff" />
                  Subscribe on YouTube
                </a>
              </div>

              {/* Card 3: Book a Verified Carpenter */}
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--background)',
                  borderRadius: '14px',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <IconCarpentry size={20} color="var(--primary)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Need Urgent Repairs?</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--foreground-muted)', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                    Connect directly with verified background-checked carpenters near you in Bangalore.
                  </p>
                </div>
                <Link
                  href="/find-a-professional"
                  className="btn btn-secondary"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  Find a Carpenter →
                </Link>
              </div>
            </div>

            {/* Upcoming Topics Sneak Peek */}
            <div
              style={{
                borderTop: '1px solid var(--card-border)',
                paddingTop: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--foreground-muted)',
              }}
            >
              <strong style={{ color: 'var(--foreground)' }}>Sneak Peek:</strong>
              <span style={{ padding: '4px 10px', backgroundColor: 'var(--background)', borderRadius: '9999px' }}>🪚 Teak Wood Polish</span>
              <span style={{ padding: '4px 10px', backgroundColor: 'var(--background)', borderRadius: '9999px' }}>🚪 Squeaky Hinge 30-Sec Fix</span>
              <span style={{ padding: '4px 10px', backgroundColor: 'var(--background)', borderRadius: '9999px' }}>🍳 Modular Kitchen Hardware</span>
              <span style={{ padding: '4px 10px', backgroundColor: 'var(--background)', borderRadius: '9999px' }}>🪟 Sliding Wardrobe Tracks</span>
            </div>
          </div>
        ) : (
          /* Filter No Results State (when search query has no match) */
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '20px',
              border: '1px solid var(--card-border)',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
              }}
            >
              <IconTools size={28} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              No DIY Reels matched your search
            </h3>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
              {searchTerm
                ? `No video shorts matched "${searchTerm}". Try checking your spelling or search for another keyword.`
                : `No videos found in this category.`}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                handleCategoryChange('all');
              }}
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
            >
              Reset Filters &amp; View All
            </button>
          </div>
        )}

        {/* Official YouTube Channel CTA Banner */}
        <div
          style={{
            marginTop: '60px',
            padding: '30px',
            borderRadius: '20px',
            backgroundColor: '#0F172A',
            color: '#ffffff',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <IconYouTube size={22} color="#FF0000" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#ff4d4f' }}>
                Carpenterwala Official Channel
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
              Subscribe on YouTube for Weekly Carpentry & DIY Shorts
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '600px', margin: 0 }}>
              Get instant notifications when new step-by-step woodworking projects, tool reviews, and quick home repairs are published.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@your-carpenterwala?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FF0000',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(255, 0, 0, 0.4)',
              transition: 'transform 0.2s',
            }}
          >
            <IconYouTube size={20} color="#ffffff" />
            Subscribe on YouTube
          </a>
        </div>
      </div>

      {/* Immersive Vertical Short-Form Player Modal */}
      {activePlayerIndex !== null && filteredReels.length > 0 && (
        <ReelPlayerModal
          reels={filteredReels}
          initialIndex={activePlayerIndex}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}
