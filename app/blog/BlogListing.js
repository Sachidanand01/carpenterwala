"use client";

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blog-data';
import Breadcrumbs from '@/components/Breadcrumbs';

const POSTS_PER_PAGE = 8;

const slugify = (cat) => cat.toLowerCase().replace(/\s+/g, '-');

const CATEGORY_ICONS = {
  All: '📚',
  Carpentry: '🪚',
  Painting: '🎨',
  Plumbing: '🔧',
  Electrical: '⚡',
  Maintenance: '🏡'
};

const CATEGORY_DESCRIPTIONS = {
  all: `
    <h2 style="margin-bottom: 1.2rem; font-size: 1.6rem; color: var(--foreground);">Explore Expert Home Improvement Guides</h2>
    <p style="margin-bottom: 1rem; opacity: 0.85; line-height: 1.7;">Welcome to the Carpenterwala blog, your premium source for step-by-step tutorials, home repair guides, and trade insights in Bangalore. From simple DIY cabinet repairs to large-scale house painting and rewiring projects, our verified professionals share their industry expertise to help you maintain a safe, beautiful, and efficient home.</p>
    <p style="opacity: 0.85; line-height: 1.7;">Whether you are looking to understand modular kitchen materials, plan bedroom wall painting colors, or avoid common repair service scams, our articles provide detailed checklists and practical tips. Browse our categories in the sidebar to find the exact help you need today.</p>
  `,
  carpentry: `
    <h2 style="margin-bottom: 1.2rem; font-size: 1.6rem; color: var(--foreground);">Professional Carpentry Guides & Woodwork Tips</h2>
    <p style="margin-bottom: 1rem; opacity: 0.85; line-height: 1.7;">Explore our custom woodworking articles covering wardrobe ergonomics, structural furniture design, termite prevention, and door installations. Our master carpenters share insights into selecting durable materials like BWR plywood vs MDF and selecting the right finishes (laminate vs PU polish) for Indian households.</p>
    <p style="opacity: 0.85; line-height: 1.7;">Maintaining high-quality teak wood furniture requires consistent care. Use our checklists to identify structural damage, prevent moisture warping during monsoons, and keep your home's custom woodwork in top-tier shape for generations.</p>
  `,
  painting: `
    <h2 style="margin-bottom: 1.2rem; font-size: 1.6rem; color: var(--foreground);">Expert Painting Guides, Color Selection, & Exterior Waterproofing</h2>
    <p style="margin-bottom: 1rem; opacity: 0.85; line-height: 1.7;">Your home’s walls define its visual appeal and protect its structure. Read our professional guides on picking the best paint colors for bedrooms, managing external dampness during the Bangalore monsoons, and applying anti-algae elastomeric coatings.</p>
    <p style="opacity: 0.85; line-height: 1.7;">We also cover modern paint choices like zero-VOC and low-VOC emulsions that protect your family’s respiratory health and improve indoor air quality. Get tips on how to prepare metal window grills before applying red-oxide rust-proofing primers.</p>
  `,
  plumbing: `
    <h2 style="margin-bottom: 1.2rem; font-size: 1.6rem; color: var(--foreground);">Plumber Repair Guides & Water Management Solutions</h2>
    <p style="margin-bottom: 1rem; opacity: 0.85; line-height: 1.7;">Plumbing issues can cause massive structural damages if left unaddressed. Learn how to locate your home’s main water shut-off valve, execute temporary emergency pipe repairs during burst events, and check water meters for silent leaks.</p>
    <p style="opacity: 0.85; line-height: 1.7;">We also specialize in resolving Bangalore-specific hard water challenges. Learn about ion-exchange softeners, magnetic descalers, and compact tap filters to lower TDS levels, protect bathroom geysers, and safeguard your skin.</p>
  `,
  electrical: `
    <h2 style="margin-bottom: 1.2rem; font-size: 1.6rem; color: var(--foreground);">Home Electrical Safety, Rewiring Guides, & Smart Upgrades</h2>
    <p style="margin-bottom: 1rem; opacity: 0.85; line-height: 1.7;">Electricity is the heartbeat of the modern home, but safety must always come first. Read our comprehensive guides on understanding the difference between MCBs (Miniature Circuit Breakers) and ELCBs (Earth Leakage Circuit Breakers) to protect your appliances and family.</p>
    <p style="opacity: 0.85; line-height: 1.7;">Identify the warning signs of deteriorating 90s copper/aluminum wiring, plan complete home rewiring projects, and prepare your distribution panel for hybrid solar energy integration. Keep your home secure and energy-efficient with our expert checklists.</p>
  `,
  maintenance: `
    <h2 style="margin-bottom: 1.2rem; font-size: 1.6rem; color: var(--foreground);">Seasonal Home Maintenance Checklists & Contractor Vetting</h2>
    <p style="margin-bottom: 1rem; opacity: 0.85; line-height: 1.7;">Prevention is always more cost-effective than emergency repair. Follow our year-round Bangalore home maintenance checklist, detailing roof waterproofing tasks in April, false ceiling repair guides, and prep work before the festive Diwali season.</p>
    <p style="opacity: 0.85; line-height: 1.7;">We also provide practical tips on how to vet local handymen, listing the top screening questions to ask potential contractors about service warranties and material grades before you commit to booking.</p>
  `
};

function BlogListingInner({ selectedCategorySlug = 'all' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gridTopRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Read page from URL params if present
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(isNaN(pageParam) || pageParam < 1 ? 1 : pageParam);

  // Sync state when URL page param changes
  useEffect(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    setCurrentPage(isNaN(p) || p < 1 ? 1 : p);
  }, [searchParams]);

  // 1. Sort all articles chronologically (newest first)
  const sortedAllPosts = useMemo(() => {
    return [...BLOG_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  // 2. Extract distinct categories & count map
  const categoriesFromPosts = useMemo(() => {
    return Array.from(new Set(sortedAllPosts.map(post => post.category)));
  }, [sortedAllPosts]);

  const CATEGORIES = useMemo(() => ['All', ...categoriesFromPosts], [categoriesFromPosts]);

  const categoryCounts = useMemo(() => {
    const counts = { All: sortedAllPosts.length };
    sortedAllPosts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, [sortedAllPosts]);

  // 3. Resolve active category from URL slug
  const activeCategory = useMemo(() => {
    return CATEGORIES.find(
      (cat) => slugify(cat) === selectedCategorySlug.toLowerCase()
    ) || 'All';
  }, [CATEGORIES, selectedCategorySlug]);

  // 4. Featured / Trending Guides (Curated top articles for sidebar)
  const featuredGuides = useMemo(() => {
    return sortedAllPosts.slice(0, 4);
  }, [sortedAllPosts]);

  // 5. Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    let list = activeCategory === 'All' 
      ? sortedAllPosts 
      : sortedAllPosts.filter(post => post.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(post => 
        post.title.toLowerCase().includes(q) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
        (post.category && post.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [sortedAllPosts, activeCategory, searchQuery]);

  // 6. Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE;
  const endIndex = Math.min(startIndex + POSTS_PER_PAGE, filteredPosts.length);
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Smooth scroll to top of grid when page changes
  const scrollToGridTop = () => {
    if (gridTopRef.current) {
      const yOffset = -120; // clearance for sticky header
      const y = gridTopRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === safeCurrentPage) return;
    setCurrentPage(newPage);

    // Update URL with page query parameter without full reload
    const currentPath = activeCategory === 'All' 
      ? '/blog' 
      : `/blog/category/${selectedCategorySlug}`;
    const newUrl = newPage === 1 ? currentPath : `${currentPath}?page=${newPage}`;
    router.push(newUrl, { scroll: false });

    scrollToGridTop();
  };

  // Reset page to 1 on search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Generate pagination items with smart ellipses
  const paginationItems = useMemo(() => {
    const items = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (safeCurrentPage > 3) items.push('ellipsis-start');
      
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (safeCurrentPage < totalPages - 2) items.push('ellipsis-end');
      items.push(totalPages);
    }
    return items;
  }, [totalPages, safeCurrentPage]);

  const breadcrumbItems = [{ name: "Home", url: "/" }];
  if (activeCategory === 'All') {
    breadcrumbItems.push({ name: "Blog", url: "/blog" });
  } else {
    breadcrumbItems.push({ name: "Blog", url: "/blog" });
    breadcrumbItems.push({ name: activeCategory, url: `/blog/category/${selectedCategorySlug}` });
  }

  return (
    <div className="blog-page-wrapper animate-fade-in" style={{ paddingBottom: '7rem' }}>
      {/* Blog Hero Header */}
      <section className="glass blog-hero-section">
        <div className="container" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="hero-pill-badge">
            <span className="live-dot" />
            <span>Bangalore Homeowner Knowledge Base</span>
          </div>
          <h1 className="hero-title">
            {activeCategory === 'All' ? 'Expert Insights & Guides' : `${activeCategory} Insights & Guides`}
          </h1>
          <p className="hero-subtitle">
            {activeCategory === 'All' 
              ? "Step-by-step tutorials, material selection guides, and trade secrets from Bangalore's verified master handymen."
              : `Professional checklists, repair techniques, and expert guides for ${activeCategory.toLowerCase()} in Bangalore homes.`}
          </p>
        </div>
      </section>

      {/* Mobile Horizontal Category Bar (Visible on mobile/tablet) */}
      <div className="mobile-category-bar-wrapper container">
        <div className="mobile-category-scroll">
          {CATEGORIES.map(cat => {
            const catSlug = slugify(cat);
            const href = cat === 'All' ? '/blog' : `/blog/category/${catSlug}`;
            const isActive = activeCategory === cat;
            const icon = CATEGORY_ICONS[cat] || '📌';
            const count = categoryCounts[cat] || 0;

            return (
              <Link
                key={cat}
                href={href}
                className={`mobile-cat-pill ${isActive ? 'active' : ''}`}
              >
                <span>{icon} {cat}</span>
                <span className="pill-count">({count})</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="container" ref={gridTopRef}>
        <div className="blog-main-grid-layout">
          
          {/* ════════ LEFT COLUMN: Blog Cards & Pagination ════════ */}
          <main className="blog-feed-column">
            
            {/* Listing Status Bar */}
            <div className="listing-status-bar glass">
              <div>
                <h2 className="feed-title">
                  {activeCategory === 'All' ? 'All Handyman Articles' : `${activeCategory} Guides`}
                </h2>
                <p className="feed-counter">
                  {filteredPosts.length > 0 ? (
                    <>
                      Showing <strong style={{ color: 'var(--primary)' }}>{startIndex + 1}–{endIndex}</strong> of <strong>{filteredPosts.length}</strong> articles (Newest first)
                    </>
                  ) : (
                    'No articles found'
                  )}
                </p>
              </div>

              {searchQuery && (
                <div className="active-search-indicator">
                  <span>Filtering: &ldquo;{searchQuery}&rdquo;</span>
                  <button onClick={clearSearch} aria-label="Clear search" className="clear-chip-btn">✕</button>
                </div>
              )}
            </div>

            {/* Post Cards Grid (Max 8 cards) */}
            {currentPosts.length > 0 ? (
              <div className="posts-cards-grid">
                {currentPosts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card-link">
                    <article className="glass blog-card">
                      <div className="card-image-wrap">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          loading="lazy"
                          className="card-image" 
                        />
                        <div className="category-tag">
                          {CATEGORY_ICONS[post.category] || '📌'} {post.category}
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="card-meta">
                          <span className="card-date">{post.date}</span>
                          <span className="meta-sep">•</span>
                          <span className="card-readtime">{post.readTime}</span>
                        </div>

                        <h3 className="card-title">{post.title}</h3>
                        <p className="card-excerpt">{post.excerpt}</p>

                        <div className="card-footer-cta">
                          <span>Read Full Guide</span>
                          <span className="cta-arrow">→</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass empty-state-box">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3>No articles found matching your criteria</h3>
                <p style={{ opacity: 0.8, marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                  Try adjusting your search keywords or explore another category.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  {searchQuery && (
                    <button onClick={clearSearch} className="btn-secondary-custom">
                      Clear Search Filter
                    </button>
                  )}
                  <Link href="/blog" className="btn-primary-custom">
                    View All Articles
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-wrapper glass">
                <button
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  className={`pagination-nav-btn ${safeCurrentPage === 1 ? 'disabled' : ''}`}
                  aria-label="Previous page"
                >
                  ← Previous
                </button>

                <div className="pagination-numbers">
                  {paginationItems.map((item, idx) => {
                    if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                      return (
                        <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                          …
                        </span>
                      );
                    }

                    const isCurrent = item === safeCurrentPage;
                    return (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        className={`pagination-num-btn ${isCurrent ? 'active' : ''}`}
                        aria-label={`Go to page ${item}`}
                        aria-current={isCurrent ? 'page' : undefined}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  className={`pagination-nav-btn ${safeCurrentPage === totalPages ? 'disabled' : ''}`}
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Detailed SEO Category Editorial Block */}
            <div 
              className="glass category-editorial-block"
              dangerouslySetInnerHTML={{ 
                __html: CATEGORY_DESCRIPTIONS[selectedCategorySlug.toLowerCase()] || CATEGORY_DESCRIPTIONS['all'] 
              }} 
            />
          </main>

          {/* ════════ RIGHT COLUMN: Sticky Sidebar ════════ */}
          <aside className="blog-sidebar-column">
            <div className="sticky-sidebar-inner">
              
              {/* Widget 1: Live Instant Search */}
              <div className="glass sidebar-widget">
                <h3 className="widget-title">
                  <span>🔎</span> Search Knowledge Base
                </h3>
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search guides, tools, repairs..."
                    className="sidebar-search-input"
                    aria-label="Search blog articles"
                  />
                  {searchQuery && (
                    <button 
                      onClick={clearSearch} 
                      className="search-clear-icon-btn"
                      aria-label="Clear input"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="search-live-count">
                    Found {filteredPosts.length} matching {filteredPosts.length === 1 ? 'article' : 'articles'}
                  </p>
                )}
              </div>

              {/* Widget 2: Category Navigation with Badges */}
              <div className="glass sidebar-widget">
                <div className="widget-header-row">
                  <h3 className="widget-title">
                    <span>📑</span> Explore Categories
                  </h3>
                  <span className="total-badge">{sortedAllPosts.length} Guides</span>
                </div>

                <nav className="category-vertical-list" aria-label="Blog categories">
                  {CATEGORIES.map(cat => {
                    const catSlug = slugify(cat);
                    const href = cat === 'All' ? '/blog' : `/blog/category/${catSlug}`;
                    const isActive = activeCategory === cat;
                    const icon = CATEGORY_ICONS[cat] || '📌';
                    const count = categoryCounts[cat] || 0;

                    return (
                      <Link
                        key={cat}
                        href={href}
                        className={`category-item-row ${isActive ? 'active' : ''}`}
                      >
                        <div className="cat-left">
                          <span className="cat-icon">{icon}</span>
                          <span className="cat-name">{cat}</span>
                        </div>
                        <span className={`cat-count-badge ${isActive ? 'active' : ''}`}>
                          {count}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Widget 3: Bangalore Handyman Booking CTA */}
              <div className="glass sidebar-widget cta-widget-box">
                <div className="cta-icon-glow">🛠️</div>
                <h3 className="cta-widget-title">Need a Handyman in Bangalore?</h3>
                <p className="cta-widget-desc">
                  Hire verified carpenters, painters, electricians & plumbers at upfront transparent pricing.
                </p>
                <ul className="cta-benefits-list">
                  <li><span>✓</span> Background-verified professionals</li>
                  <li><span>✓</span> 30-day service warranty</li>
                  <li><span>✓</span> No hidden material markups</li>
                </ul>
                <Link href="/#services" className="cta-book-button">
                  Book a Verified Pro →
                </Link>
              </div>

              {/* Widget 4: Trending / Featured Guides */}
              <div className="glass sidebar-widget">
                <h3 className="widget-title">
                  <span>🔥</span> Trending Guides
                </h3>
                <div className="featured-posts-list">
                  {featuredGuides.map((guide, idx) => (
                    <Link href={`/blog/${guide.slug}`} key={guide.slug} className="featured-post-item">
                      <div className="featured-thumb-wrap">
                        <img src={guide.image} alt={guide.title} loading="lazy" />
                        <span className="featured-rank">{idx + 1}</span>
                      </div>
                      <div className="featured-content">
                        <h4 className="featured-title">{guide.title}</h4>
                        <div className="featured-meta">
                          <span>{guide.category}</span>
                          <span>•</span>
                          <span>{guide.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* Styled JSX Scoped Styles */}
      <style jsx>{`
        .blog-page-wrapper {
          min-height: 100vh;
        }

        /* Hero Section */
        .blog-hero-section {
          padding: 2.5rem 0 5rem;
          margin-bottom: 3rem;
          background: linear-gradient(135deg, rgba(194, 65, 12, 0.08) 0%, rgba(245, 239, 230, 0.4) 100%);
          border-bottom: 1px solid var(--glass-border);
        }
        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(194, 65, 12, 0.1);
          border: 1px solid rgba(194, 65, 12, 0.25);
          color: var(--primary, #C2410C);
          padding: 0.4rem 1.1rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          letter-spacing: 0.02em;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary, #C2410C);
          display: inline-block;
          animation: pulseDot 2s infinite ease-in-out;
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
        .hero-title {
          font-size: 3.2rem;
          margin-bottom: 1.2rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          max-width: 780px;
          margin: 0 auto;
          opacity: 0.85;
          line-height: 1.6;
        }

        /* Mobile Category Bar */
        .mobile-category-bar-wrapper {
          display: none;
          margin-bottom: 2rem;
        }
        .mobile-category-scroll {
          display: flex;
          gap: 0.6rem;
          overflow-x: auto;
          padding: 0.5rem 0.25rem 0.75rem;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-category-scroll::-webkit-scrollbar {
          display: none;
        }
        .mobile-cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
          padding: 0.55rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          background: var(--card-bg, #F5EFE6);
          border: 1px solid var(--glass-border);
          color: var(--foreground-muted, #475569);
          text-decoration: none;
          transition: var(--transition);
        }
        .mobile-cat-pill.active {
          background: var(--primary, #C2410C);
          color: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 4px 12px var(--primary-glow);
        }
        .pill-count {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        /* 2-Column Grid Layout */
        .blog-main-grid-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2.5rem;
          align-items: start;
        }

        /* Left Column / Feed */
        .blog-feed-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          min-width: 0;
        }
        .listing-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.25rem 1.75rem;
          border-radius: var(--border-radius);
        }
        .feed-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--foreground);
          margin-bottom: 0.25rem;
        }
        .feed-counter {
          font-size: 0.92rem;
          color: var(--foreground-muted);
        }
        .active-search-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          font-size: 0.88rem;
          font-weight: 600;
          border: 1px solid rgba(194, 65, 12, 0.2);
        }
        .clear-chip-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--primary);
          font-weight: bold;
          font-size: 0.9rem;
          line-height: 1;
          padding: 0;
        }

        /* 2-Column Cards Grid in Feed */
        .posts-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
        }
        .blog-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
          height: 100%;
        }
        .blog-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
        }
        .blog-card:hover {
          transform: translateY(-6px);
          border-color: var(--primary);
          box-shadow: 0 16px 36px rgba(194, 65, 12, 0.14);
        }
        .card-image-wrap {
          height: 200px;
          overflow: hidden;
          position: relative;
          background: #e2e8f0;
        }
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .blog-card:hover .card-image {
          transform: scale(1.06);
        }
        .category-tag {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: var(--primary, #C2410C);
          color: #ffffff;
          padding: 0.3rem 0.75rem;
          border-radius: 16px;
          font-size: 0.78rem;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          letter-spacing: 0.02em;
        }
        .card-body {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .card-meta {
          font-size: 0.82rem;
          color: var(--primary);
          font-weight: 700;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .meta-sep {
          opacity: 0.4;
        }
        .card-title {
          font-size: 1.25rem;
          line-height: 1.35;
          margin-bottom: 0.75rem;
          font-weight: 750;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: var(--foreground);
        }
        .card-excerpt {
          font-size: 0.92rem;
          opacity: 0.75;
          line-height: 1.55;
          margin-bottom: 1.25rem;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-footer-cta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.92rem;
          margin-top: auto;
        }
        .cta-arrow {
          transition: transform 0.25s ease;
        }
        .blog-card:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* Empty State */
        .empty-state-box {
          text-align: center;
          padding: 4rem 2rem;
          border-radius: var(--border-radius);
        }
        .btn-primary-custom {
          background: var(--primary);
          color: #fff;
          padding: 0.65rem 1.4rem;
          border-radius: 25px;
          font-weight: 700;
          text-decoration: none;
          font-size: 0.95rem;
          transition: var(--transition);
          display: inline-block;
        }
        .btn-primary-custom:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }
        .btn-secondary-custom {
          background: transparent;
          color: var(--foreground);
          border: 1px solid var(--glass-border);
          padding: 0.65rem 1.4rem;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-secondary-custom:hover {
          background: rgba(194, 65, 12, 0.08);
          border-color: var(--primary);
        }

        /* Pagination Bar */
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-radius: 50px;
          margin-top: 1rem;
        }
        .pagination-nav-btn {
          background: var(--card-bg, #F5EFE6);
          border: 1px solid var(--glass-border);
          color: var(--foreground);
          padding: 0.55rem 1.1rem;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .pagination-nav-btn:hover:not(.disabled) {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
        }
        .pagination-nav-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .pagination-numbers {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .pagination-num-btn {
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid transparent;
          background: transparent;
          color: var(--foreground);
          font-weight: 600;
          font-size: 0.92rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .pagination-num-btn:hover:not(.active) {
          background: rgba(194, 65, 12, 0.1);
          border-color: rgba(194, 65, 12, 0.25);
        }
        .pagination-num-btn.active {
          background: var(--primary, #C2410C);
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 12px var(--primary-glow);
        }
        .pagination-ellipsis {
          padding: 0 0.3rem;
          opacity: 0.5;
          font-weight: bold;
        }

        /* Editorial Description Box */
        .category-editorial-block {
          padding: 2.25rem;
          border-radius: var(--border-radius);
          line-height: 1.7;
          margin-top: 1.5rem;
        }

        /* ════════ RIGHT COLUMN / Sticky Sidebar ════════ */
        .blog-sidebar-column {
          position: relative;
        }
        .sticky-sidebar-inner {
          position: sticky;
          top: 120px;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .sidebar-widget {
          padding: 1.5rem;
          border-radius: 18px;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
        }
        .widget-title {
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--foreground);
        }
        .widget-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.1rem;
        }
        .widget-header-row .widget-title {
          margin-bottom: 0;
        }
        .total-badge {
          font-size: 0.78rem;
          font-weight: 700;
          background: rgba(194, 65, 12, 0.12);
          color: var(--primary);
          padding: 0.25rem 0.6rem;
          border-radius: 12px;
        }

        /* Search Input */
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .sidebar-search-input {
          width: 100%;
          padding: 0.75rem 2.25rem 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          background: var(--card-bg, #F5EFE6);
          color: var(--foreground);
          font-size: 0.92rem;
          outline: none;
          transition: var(--transition);
        }
        .sidebar-search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-light);
        }
        .search-clear-icon-btn {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: var(--foreground-muted);
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0.2rem;
        }
        .search-live-count {
          font-size: 0.82rem;
          color: var(--primary);
          margin-top: 0.6rem;
          font-weight: 600;
        }

        /* Category Vertical List */
        .category-vertical-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .category-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.7rem 0.9rem;
          border-radius: 12px;
          text-decoration: none;
          color: var(--foreground);
          font-weight: 600;
          font-size: 0.94rem;
          transition: var(--transition);
          border: 1px solid transparent;
        }
        .category-item-row:hover {
          background: rgba(194, 65, 12, 0.08);
          transform: translateX(3px);
        }
        .category-item-row.active {
          background: var(--primary, #C2410C);
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 14px var(--primary-glow);
        }
        .cat-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .cat-icon {
          font-size: 1.1rem;
        }
        .cat-count-badge {
          font-size: 0.8rem;
          padding: 0.2rem 0.55rem;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.06);
          color: var(--foreground-muted);
        }
        .cat-count-badge.active {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        /* Handyman Booking CTA Box */
        .cta-widget-box {
          background: linear-gradient(135deg, rgba(194, 65, 12, 0.12) 0%, rgba(217, 119, 6, 0.12) 100%);
          border-color: rgba(194, 65, 12, 0.3);
          position: relative;
          overflow: hidden;
        }
        .cta-icon-glow {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .cta-widget-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--foreground);
          margin-bottom: 0.6rem;
          line-height: 1.3;
        }
        .cta-widget-desc {
          font-size: 0.88rem;
          opacity: 0.85;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .cta-benefits-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.25rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--foreground);
        }
        .cta-benefits-list span {
          color: var(--success, #15803d);
          font-weight: bold;
          margin-right: 0.35rem;
        }
        .cta-book-button {
          display: block;
          text-align: center;
          background: var(--primary, #C2410C);
          color: #ffffff;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          box-shadow: 0 4px 14px var(--primary-glow);
          transition: var(--transition);
        }
        .cta-book-button:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px var(--primary-glow);
        }

        /* Trending Guides List */
        .featured-posts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .featured-post-item {
          display: flex;
          gap: 0.85rem;
          text-decoration: none;
          color: inherit;
          padding: 0.4rem;
          border-radius: 10px;
          transition: var(--transition);
        }
        .featured-post-item:hover {
          background: rgba(194, 65, 12, 0.06);
        }
        .featured-thumb-wrap {
          width: 65px;
          height: 65px;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
          background: #e2e8f0;
        }
        .featured-thumb-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .featured-rank {
          position: absolute;
          bottom: 2px;
          left: 2px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          font-size: 0.7rem;
          font-weight: bold;
          padding: 1px 5px;
          border-radius: 4px;
        }
        .featured-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }
        .featured-title {
          font-size: 0.88rem;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 0.35rem;
          color: var(--foreground);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .featured-meta {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
          display: flex;
          gap: 0.4rem;
          align-items: center;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .blog-main-grid-layout {
            grid-template-columns: 1fr;
          }
          .mobile-category-bar-wrapper {
            display: block;
          }
          .sticky-sidebar-inner {
            position: static;
          }
          .hero-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .posts-cards-grid {
            grid-template-columns: 1fr;
          }
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .card-image-wrap {
            height: 180px;
          }
          .pagination-wrapper {
            flex-wrap: wrap;
            border-radius: 20px;
          }
          .pagination-numbers {
            order: 3;
            width: 100%;
            justify-content: center;
            margin-top: 0.5rem;
          }
          .listing-status-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default function BlogListing(props) {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}>Loading Articles...</div>
        <p style={{ opacity: 0.7 }}>Preparing Bangalore's master repair guides...</p>
      </div>
    }>
      <BlogListingInner {...props} />
    </Suspense>
  );
}
