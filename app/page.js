import Link from "next/link";
import MagneticCTA from "@/components/MagneticCTA";
import HeroLiveProCard from "@/components/HeroLiveProCard";
import LandingFAQAccordion from "@/components/LandingFAQAccordion";

export const metadata = {
  title: "Carpenterwala | Professional Handyman Marketplace",
  description: "India's trusted digital marketplace to book verified background-checked carpenters, painters, plumbers, and electricians in Bangalore.",
  alternates: {
    canonical: 'https://carpenterwala.com',
    types: {
      'text/plain': 'https://carpenterwala.com/llms.txt',
    },
  },
};

export default function Home() {
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["HomeAndConstructionBusiness", "ProfessionalService", "LocalBusiness"],
        "@id": "https://carpenterwala.com/#localbusiness",
        "name": "Carpenterwala",
        "image": "https://carpenterwala.com/images/og-image.png",
        "logo": "https://carpenterwala.com/images/logo.png",
        "description": "India's trusted digital marketplace to book verified background-checked carpenters, painters, plumbers, and electricians in Bangalore.",
        "telephone": "+91-809-555-1001",
        "url": "https://carpenterwala.com",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Thanisandra Main Road",
          "addressLocality": "Bangalore",
          "addressRegion": "Karnataka",
          "postalCode": "560077",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 13.055811,
          "longitude": 77.625443
        },
        "areaServed": [
          {
            "@type": "City",
            "name": "Bangalore"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Karnataka"
          }
        ],
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "08:00",
          "closes": "20:00"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.85",
          "reviewCount": "1420",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://carpenterwala.com/#website",
        "url": "https://carpenterwala.com",
        "name": "Carpenterwala",
        "description": "Find verified carpenters, painters, plumbers, and handymen near you in Bangalore.",
        "publisher": {
          "@id": "https://carpenterwala.com/#localbusiness"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://carpenterwala.com/find-a-professional?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://carpenterwala.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I book a verified handyman in Bangalore?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can book a verified professional by visiting our 'Find a Professional' page, choosing your required trade (Carpentry, Painting, Plumbing, or Electrical), reading reviews, and connecting directly to request a quote."
            }
          },
          {
            "@type": "Question",
            "name": "Are the service professionals background-checked?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, every professional registered on Carpenterwala goes through a robust identity background check and rigorous skill verification to guarantee safety and premium service quality."
            }
          },
          {
            "@type": "Question",
            "name": "Do you offer a warranty on home repairs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely. Registered customers can use our state-of-the-art Warranty Manager on their dashboard to easily upload receipts, track warranties, and request warranty support for any completed home repair jobs."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="container flex flex-col justify-center" style={{ minHeight: "calc(100vh - var(--navbar-height))" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      
      {/* ════════════════════════════════════════
          HERO SECTION — Split Asymmetric Layout
          ════════════════════════════════════════ */}
      <section className="hero-split-layout">
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Eyebrow badge */}
          <div className="flex items-center gap-2" style={{ flexWrap: "wrap" }}>
            <span 
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "var(--primary)",
                background: "var(--primary-light)",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px"
              }}
            >
              Bangalore's Verified Handyman Network
            </span>
            <span style={{ fontSize: "0.85rem", opacity: 0.75, fontWeight: 500 }}>
              ★ 4.85/5 (1,420+ Reviews)
            </span>
          </div>

          {/* Display Headline */}
          <h1 
            style={{ 
              fontSize: "clamp(2.4rem, 5vw, 3.75rem)", 
              letterSpacing: "-0.03em", 
              lineHeight: 1.15,
              fontWeight: 800,
              color: "var(--foreground)",
              textWrap: "balance"
            }}
          >
            Hire Verified Pros with <span className="text-gradient">Zero Commission.</span>
          </h1>

          {/* Subtext */}
          <p 
            style={{ 
              fontSize: "1.15rem", 
              lineHeight: 1.6,
              color: "var(--foreground-muted)",
              maxWidth: "54ch"
            }}
          >
            Connect directly with Aadhaar background-checked carpenters, painters, plumbers, and electricians in Bangalore. Transparent pricing with 0% platform markups.
          </p>

          {/* Trade Quick Chips */}
          <div className="trade-chips-wrapper flex gap-2" style={{ flexWrap: "wrap", margin: "0.5rem 0" }}>
            <Link href="/find-a-professional?category=Carpenter" className="trade-chip">
              <span>🪚</span>
              <span>Carpenters</span>
            </Link>
            <Link href="/find-a-professional?category=Painter" className="trade-chip">
              <span>🎨</span>
              <span>Painters</span>
            </Link>
            <Link href="/find-a-professional?category=Plumber" className="trade-chip">
              <span>🔧</span>
              <span>Plumbers</span>
            </Link>
            <Link href="/find-a-professional?category=Electrician" className="trade-chip">
              <span>⚡</span>
              <span>Electricians</span>
            </Link>
          </div>

          {/* Hero CTAs */}
          <div className="hero-actions flex gap-4 flex-mobile-col" style={{ alignItems: "center", marginTop: "0.5rem" }}>
            <MagneticCTA>
              <Link 
                href="/find-a-professional" 
                className="btn btn-primary" 
                style={{ fontSize: "1.05rem", padding: "0.9rem 1.8rem", fontWeight: 600 }}
              >
                Find a Professional
              </Link>
            </MagneticCTA>
            <MagneticCTA>
              <Link 
                href="/pro/login" 
                className="btn btn-secondary" 
                style={{ fontSize: "1.05rem", padding: "0.9rem 1.8rem", fontWeight: 600 }}
              >
                Join as a Pro
              </Link>
            </MagneticCTA>
          </div>

          {/* Micro Trust Strip */}
          <div className="flex items-center gap-4" style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", marginTop: "0.5rem", flexWrap: "wrap" }}>
            <span>✓ 100% Free Platform</span>
            <span>✓ Direct WhatsApp/Call</span>
            <span>✓ Warranty Manager Included</span>
          </div>

        </div>

        {/* Visual Anchor: Interactive Pro Card */}
        <div className="flex justify-center" style={{ width: "100%" }}>
          <HeroLiveProCard />
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES — Asymmetric Bento Grid
          ════════════════════════════════════════ */}
      <section style={{ padding: "4rem 0" }}>
        <div style={{ textAlign: "left", marginBottom: "2.5rem" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--primary)", fontWeight: 700 }}>
            Why Choose Carpenterwala
          </span>
          <h2 style={{ fontSize: "2.25rem", letterSpacing: "-0.02em", marginTop: "0.4rem", color: "var(--foreground)" }}>
            Built for Trust. Zero Hidden Margins.
          </h2>
        </div>

        <div className="bento-grid-features">
          
          {/* Bento Card 1 (Hero Card - Identity & Skill Checks) */}
          <div className="bento-card bento-card-hero">
            <div>
              <div 
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem"
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: "1.45rem", marginBottom: "0.75rem", color: "var(--foreground)" }}>
                Strict Background & Identity Verification
              </h3>
              <p style={{ color: "var(--foreground-muted)", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                We verify government Aadhaar credentials, police clearances, and real trade skill portfolios before any handyman can receive customer leads.
              </p>
            </div>

            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                padding: "1rem",
                background: "var(--background)",
                borderRadius: "var(--border-radius-sm)",
                border: "1px solid var(--card-border)"
              }}
            >
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)" }}>✓ Aadhaar ID Check</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)" }}>✓ Real Project Photos</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)" }}>✓ Background Clearances</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)" }}>✓ Skill Certification</div>
            </div>
          </div>

          {/* Bento Card 2 (Real Portfolios & Reviews) */}
          <div className="bento-card">
            <div 
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "var(--accent-light)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem"
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--foreground)" }}>
              Genuine Portfolios & Real Reviews
            </h3>
            <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Inspect authentic on-site photos of finished wardrobes, paint finishes, and plumbing installations alongside verified client ratings.
            </p>
          </div>

          {/* Bento Card 3 (Direct Contact & 0% Commission) */}
          <div className="bento-card">
            <div 
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(22, 163, 74, 0.12)",
                color: "var(--success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem"
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--foreground)" }}>
              Direct Contact · 0% Platform Commission
            </h3>
            <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Connect directly over phone or WhatsApp without middleman markups. Negotiate terms directly and keep full project flexibility.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          FLAT POSSESSION & CRAFTSMANSHIP
          ════════════════════════════════════════ */}
      <section 
        className="glass animate-fade-in" 
        style={{ 
          width: "100%", 
          padding: "3rem", 
          margin: "1rem 0 3rem 0", 
          textAlign: "left",
          borderRadius: "var(--border-radius-lg)"
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "center" }}>
          
          {/* Left Narrative */}
          <div>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--primary)", fontWeight: 700 }}>
              New Flat Handover Solutions
            </span>
            <h2 style={{ fontSize: "2.25rem", letterSpacing: "-0.02em", marginTop: "0.4rem", marginBottom: "1rem", color: "var(--foreground)" }}>
              Specialized Woodwork for New Flat Owners
            </h2>
            <p style={{ color: "var(--foreground-muted)", lineHeight: "1.8", marginBottom: "1.75rem", fontSize: "1rem" }}>
              Just received the keys to your new apartment in Bangalore? Setting up bespoke carpentry and modular cabinetry doesn&apos;t have to be stressful. From pre-laminated kitchens to custom hydraulic beds and acoustic fluted panels, connect with verified master woodworkers.
            </p>
            <MagneticCTA>
              <Link 
                href="/find-a-professional?category=Carpenter" 
                className="btn btn-primary"
                style={{ padding: "0.85rem 1.6rem", fontWeight: 600 }}
              >
                Find Carpenters for New Flat
              </Link>
            </MagneticCTA>
          </div>

          {/* Right Capability Tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            
            <div className="possession-tile">
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>Modular</span>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)" }}>Kitchen & Wardrobes</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", lineHeight: "1.5" }}>
                Precision assembly of pre-fabricated kitchen units and soft-close storage.
              </p>
            </div>

            <div className="possession-tile">
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase" }}>Custom</span>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)" }}>Solid Teak Woodwork</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", lineHeight: "1.5" }}>
                Bespoke on-site craftsmanship for main doors, puja units, and dining setups.
              </p>
            </div>

            <div className="possession-tile">
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>Aesthetics</span>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)" }}>Fluted Wall Paneling</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", lineHeight: "1.5" }}>
                Modern TV backdrops, wooden louvers, and seamless veneer highlights.
              </p>
            </div>

            <div className="possession-tile">
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--success)", textTransform: "uppercase" }}>Guaranteed</span>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)" }}>Transparent Milestones</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", lineHeight: "1.5" }}>
                Structured material billing and digital warranty management on dashboard.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ & LOCAL BANGALORE COVERAGE
          ════════════════════════════════════════ */}
      <section style={{ padding: "2rem 0 4rem 0", textAlign: "left" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--primary)", fontWeight: 700 }}>
            Got Questions?
          </span>
          <h2 style={{ fontSize: "2.25rem", letterSpacing: "-0.02em", marginTop: "0.4rem", color: "var(--foreground)" }}>
            Frequently Asked Questions & Local Coverage
          </h2>
        </div>

        <LandingFAQAccordion />
      </section>

    </div>
  );
}

