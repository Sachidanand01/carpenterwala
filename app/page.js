import Link from "next/link";
import MagneticCTA from "@/components/MagneticCTA";

export const metadata = {
  title: "Carpenterwala | Professional Handyman Marketplace",
  description: "India's trusted digital marketplace to book verified background-checked carpenters, painters, plumbers, and electricians in Bangalore.",
  alternates: {
    canonical: 'https://carpenterwala.com',
  },
};

export default function Home() {
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://carpenterwala.com/#localbusiness",
        "name": "Carpenterwala",
        "image": "https://carpenterwala.com/images/og-image.png",
        "description": "India's trusted digital marketplace to book verified background-checked carpenters, painters, plumbers, and electricians in Bangalore.",
        "telephone": "+91-XXXXXXXXXX",
        "url": "https://carpenterwala.com",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "HSR Layout",
          "addressLocality": "Bangalore",
          "addressRegion": "Karnataka",
          "postalCode": "560102",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 12.9141,
          "longitude": 77.6413
        },
        "areaServed": [
          {
            "@type": "AdministrativeArea",
            "name": "Bangalore"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Bengaluru"
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
          "opens": "00:00",
          "closes": "23:59"
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
          "@id": "https://carpenterwala.com/#organization"
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
      <section className="hero-wrapper flex flex-col items-center justify-center gap-8" style={{ padding: "4rem 0", textAlign: "center", position: "relative", width: "100%" }}>
        
        {/* Floating handyman icons in the background */}
        <div className="floating-bg-icon float-1" style={{ left: "5%", top: "15%" }} aria-hidden="true">
          {/* Hammer (Carpentry) */}
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 5 4 4" />
            <path d="M21.5 2.5a2.12 2.12 0 0 0-3-3L11 7l-4 4-4 4v5h5l4-4 4-4 1.5-1.5z" />
            <path d="m9 11 3 3" />
          </svg>
        </div>

        <div className="floating-bg-icon float-2" style={{ right: "8%", top: "10%" }} aria-hidden="true">
          {/* Paint Roller (Painting) */}
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="16" height="6" x="2" y="6" rx="2" />
            <path d="M10 12v8c0 1.1-.9 2-2 2H6" />
            <path d="M22 10V8a2 2 0 0 0-2-2h-2" />
          </svg>
        </div>

        <div className="floating-bg-icon float-3" style={{ left: "10%", bottom: "25%" }} aria-hidden="true">
          {/* Wrench (Plumbing) */}
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>

        <div className="floating-bg-icon float-4" style={{ right: "12%", bottom: "20%" }} aria-hidden="true">
          {/* Lightning Bolt (Electrical) */}
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        <div className="animate-fade-in" style={{ maxWidth: "800px", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "4rem", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Your Trusted <span className="desktop-only"><br /></span>
            <span className="text-gradient">Handyman & Home Services App</span>
          </h1>
          <p style={{ fontSize: "1.25rem", opacity: 0.8, marginBottom: "2rem" }}>
            One of the best handyman apps in India to hire verified carpenters, painters, plumbers, and electricians near you. Experience the premium home services app in India with real reviews and transparent pricing.
          </p>

          <div className="flex gap-4 justify-center flex-mobile-col" style={{ alignItems: "center" }}>
            <MagneticCTA>
              <Link href="/find-a-professional" className="btn btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}>
                Find a Professional
              </Link>
            </MagneticCTA>
            <MagneticCTA>
              <Link href="/pro/login" className="btn btn-secondary" style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}>
                Join as a Pro
              </Link>
            </MagneticCTA>
          </div>
        </div>

        <div className="glass animate-fade-in delay-200" style={{ width: "100%", padding: "2rem", marginTop: "3rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Why Choose Carpenterwala?</h2>
          <div className="flex justify-between gap-4" style={{ textAlign: "left", flexWrap: "wrap" }}>
            <div className="flex-col gap-2" style={{ flex: "1", minWidth: "250px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛡️</div>
              <h3 style={{ fontSize: "1.25rem" }}>Verified Pros</h3>
              <p style={{ opacity: 0.7 }}>Every handyman on our platform goes through a strict background check and skills verification process.</p>
            </div>
            <div className="flex-col gap-2" style={{ flex: "1", minWidth: "250px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⭐</div>
              <h3 style={{ fontSize: "1.25rem" }}>Real Reviews</h3>
              <p style={{ opacity: 0.7 }}>Read genuine reviews and see portfolio photos from past clients before making your decision.</p>
            </div>
            <div className="flex-col gap-2" style={{ flex: "1", minWidth: "250px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
              <h3 style={{ fontSize: "1.25rem" }}>Instant Contact</h3>
              <p style={{ opacity: 0.7 }}>Connect directly with professionals securely through our platform to get quotes fast.</p>
            </div>
          </div>
        </div>

        <div className="glass animate-fade-in delay-300" style={{ width: "100%", padding: "2.5rem", marginTop: "3rem", textAlign: "left" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", alignItems: "center" }}>
            <div style={{ flex: "1 1 350px" }}>
              <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--primary)", fontWeight: "bold" }}>Flat Possession Solutions</span>
              <h2 style={{ fontSize: "2.25rem", marginTop: "0.5rem", marginBottom: "1rem" }}>Carpenterwala for New Flat Owners</h2>
              <p style={{ opacity: 0.85, lineHeight: "1.8", marginBottom: "1.5rem" }}>
                Just got the keys to your new apartment? Finding a reliable carpenter for your <strong>home setup after possession</strong> can be stressful. From custom wardrobes to modular kitchens, our verified professionals make setting up your new flat easy. We handle all the woodwork with clear pricing, quality materials, and a complete safety guarantee.
              </p>
              <MagneticCTA>
                <Link href="/find-a-professional?category=Carpenter" className="btn btn-primary">
                  Get Carpenter for New Flat
                </Link>
              </MagneticCTA>
            </div>
            <div style={{ flex: "1 1 300px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 style={{ color: "var(--accent)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Modular Fitting</h3>
                <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>Perfect assembly of pre-fabricated kitchen and wardrobe panels.</p>
              </div>
              <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 style={{ color: "var(--accent)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Teak Woodwork</h3>
                <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>Bespoke, high-end woodwork crafted custom on-site by Indian experts.</p>
              </div>
              <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 style={{ color: "var(--accent)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Wall Panelings</h3>
                <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>Modern wood laminates, fluted panels, and television backdrops.</p>
              </div>
              <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 style={{ color: "var(--accent)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Hassle-Free</h3>
                <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>Complete project milestones with transparent billing guarantees.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Localized FAQ & Coverage Block */}
        <div className="glass animate-fade-in delay-400" style={{ width: "100%", padding: "3rem", marginTop: "3rem", textAlign: "left", lineHeight: "1.7" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Professional Handyman App in Bangalore: Frequently Asked Questions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", color: "var(--primary)", marginBottom: "0.5rem" }}>How does the Carpenterwala handyman app match me with local pros?</h3>
              <p style={{ opacity: 0.8, fontSize: "0.95rem" }}>
                Our <strong>handyman app in India</strong> utilizes geolocation routing to find verified carpenters, painters, plumbers, and electricians near your specific neighborhood in Bangalore. Whether you are in HSR Layout, Indiranagar, Whitefield, or Koramangala, the platform showcases the closest available service professionals to minimize travel time and ensure speedy dispatch.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", color: "var(--primary)", marginBottom: "0.5rem" }}>What makes this the premium home services app in India?</h3>
              <p style={{ opacity: 0.8, fontSize: "0.95rem" }}>
                Unlike other platforms that charge hefty commissions, Carpenterwala is a <strong>100% free platform</strong> charging 0% fees from both customers and service professionals. You connect directly with verified experts, review their real portfolios, check actual reviews, and negotiate rates directly. There are no hidden fees or inflated service margins.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", color: "var(--primary)", marginBottom: "0.5rem" }}>Which areas of Bangalore do your background-checked pros cover?</h3>
              <p style={{ opacity: 0.8, fontSize: "0.95rem" }}>
                Our network covers all zones of Bangalore, including Bangalore South (Jayanagar, JP Nagar, HSR Layout), Bangalore East (Whitefield, Marathahalli, Bellandur), Bangalore Central (Koramangala, Indiranagar, MG Road), and Bangalore North (Hebbal, Thanisandra, Yelahanka). Every professional undergoes strict Aadhaar identity verification and skills assessment before onboarding.
              </p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
