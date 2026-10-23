import { getProfileByProCode, getProfileBySlug } from '@/lib/supabase';
import { getProUrl, toTradeSlug, toUrlSlug } from '@/lib/pro-slug';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import VerifiedBadge from '@/components/VerifiedBadge';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProVisitingCardActions from '@/components/pro-profile/ProVisitingCardActions';
import ProLocalNewsCard from '@/components/pro-profile/ProLocalNewsCard';
import ProPortfolioGallery from '@/components/pro-profile/ProPortfolioGallery';
import ProTradeEstimator from '@/components/pro-profile/ProTradeEstimator';
import ProTradeBlogs from '@/components/pro-profile/ProTradeBlogs';
import { getAllBlogPosts } from '@/lib/blog-service';

// Reversible Feature Flag: toggle to false anytime to revert to legacy layout
const USE_ENHANCED_LAYOUT = true;

export async function generateMetadata({ params }) {
  const { trade, proCode, name } = await params;
  let profile = await getProfileByProCode(proCode);
  if (!profile) {
    profile = await getProfileBySlug(name);
  }
  if (!profile) return { title: 'Professional Not Found | Carpenterwala' };
  
  const siteUrl = 'https://carpenterwala.com';
  const canonicalUrl = `${siteUrl}${getProUrl(profile)}`;
  const pageTitle = `${profile.name} - Verified ${profile.trade} in ${profile.location} | Carpenterwala`;
  const pageDescription = `Hire ${profile.name}, a trusted ${profile.trade} in ${profile.location} with ${profile.experience} of experience. Specializing in ${profile.skills ? profile.skills.slice(0, 3).join(', ') : ''}. Book directly on Carpenterwala.`;
  
  const baseKeywords = ['carpenter', 'home services', 'handyman', 'Bangalore', 'verified professionals', profile.trade.toLowerCase()];
  const profileKeywords = [
    profile.name,
    profile.trade,
    profile.location,
    profile.pro_code,
    ...(profile.skills || [])
  ].filter(Boolean);
  const keywords = Array.from(new Set([...baseKeywords, ...profileKeywords]));

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'Carpenterwala',
      images: [
        {
          url: profile.avatar || `${siteUrl}/images/about-us-hero.png`,
          width: 1200,
          height: 630,
          alt: `${profile.name} - ${profile.trade}`,
        }
      ],
      locale: 'en_IN',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [profile.avatar || `${siteUrl}/images/about-us-hero.png`],
    },
  };
}

export default async function CanonicalProProfile({ params }) {
  const { trade, proCode, name } = await params;
  
  // 1. Fetch profile by pro_code (O(1) index) with slug fallback
  let profile = await getProfileByProCode(proCode);
  if (!profile) {
    profile = await getProfileBySlug(name);
  }

  if (!profile) {
    notFound();
  }

  // 2. Canonical URL validation & redirect
  // If URL has mismatched casing, outdated trade, or outdated name, 301 redirect to canonical
  const canonicalPath = getProUrl(profile);
  const currentPath = `/pro/${trade}/${proCode}/${name}`;
  if (currentPath !== canonicalPath) {
    redirect(canonicalPath);
  }

  // Map trade to Schema.org LocalBusiness sub-types
  let schemaType = "ProfessionalService";
  if (profile.trade === "Plumber") {
    schemaType = "Plumber";
  } else if (profile.trade === "Electrician") {
    schemaType = "Electrician";
  } else if (profile.trade === "Painter") {
    schemaType = "HousePainter";
  } else if (profile.trade === "Carpenter") {
    schemaType = "HomeAndConstructionBusiness";
  }

  // Construct coordinates if available
  const geo = (profile.latitude && profile.longitude) ? {
    "@type": "GeoCoordinates",
    "latitude": profile.latitude,
    "longitude": profile.longitude
  } : null;

  // Construct aggregate rating if reviews exist
  const aggregateRating = (profile.reviews && profile.reviews.length > 0) ? {
    "@type": "AggregateRating",
    "ratingValue": profile.average_rating ? profile.average_rating.toFixed(2) : (profile.reviews.reduce((sum, r) => sum + r.rating, 0) / profile.reviews.length).toFixed(2),
    "reviewCount": profile.reviews.length.toString(),
    "bestRating": "5",
    "worstRating": "1"
  } : null;

  // Construct reviews array
  const reviewsSchema = (profile.reviews || []).map(r => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": r.author
    },
    "datePublished": r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    "reviewBody": r.text || "",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": r.rating.toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  }));

  const siteUrl = 'https://carpenterwala.com';
  const proCanonicalUrl = `${siteUrl}${canonicalPath}`;

  const proJsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${proCanonicalUrl}#localbusiness`,
    "name": profile.name,
    "identifier": profile.pro_code,
    "image": profile.avatar || `${siteUrl}/images/about-us-hero.png`,
    "description": profile.about || `Verified ${profile.trade} in ${profile.location} with ${profile.experience} of experience.`,
    "telephone": profile.phone || "+91-809-555-1001",
    "url": proCanonicalUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": profile.full_address || profile.location || "Bangalore",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": "560077",
      "addressCountry": "IN"
    },
    "priceRange": "₹₹",
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Bangalore"
      }
    ],
    "knowsLanguage": profile.languages || ["English", "Hindi"]
  };

  if (geo) proJsonLd.geo = geo;
  if (aggregateRating) proJsonLd.aggregateRating = aggregateRating;
  if (reviewsSchema.length > 0) proJsonLd.review = reviewsSchema;

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Find a Professional",
        "item": `${siteUrl}/find-a-professional`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${profile.trade}s`,
        "item": `${siteUrl}/services`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": profile.name,
        "item": proCanonicalUrl
      }
    ]
  };

  // 3. Fetch trade-specific blog guides for related reading
  let tradeBlogs = [];
  try {
    const allPosts = await getAllBlogPosts();
    const tradeLower = (profile.trade || '').toLowerCase();
    tradeBlogs = allPosts.filter(p => {
      const titleLower = (p.title || '').toLowerCase();
      const catLower = (p.category || '').toLowerCase();
      const slugLower = (p.slug || '').toLowerCase();
      return titleLower.includes(tradeLower) || catLower.includes(tradeLower) || slugLower.includes(tradeLower);
    });
    if (tradeBlogs.length === 0) {
      tradeBlogs = allPosts.slice(0, 3);
    } else {
      tradeBlogs = tradeBlogs.slice(0, 3);
    }
  } catch (err) {
    console.warn("Could not load blogs for pro profile:", err);
  }

  const isAcceptingLeads = profile.accepting_leads !== false;

  return (
    <div className="container" style={{ padding: "2rem 2rem 4rem 2rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(proJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Find a Professional", url: "/find-a-professional" },
        { name: profile.trade, url: "/services" },
        { name: profile.name, url: canonicalPath }
      ]} />

      {USE_ENHANCED_LAYOUT ? (
        /* ── ENHANCED HIGH-ENGAGEMENT LAYOUT ── */
        <div className="flex gap-8" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
          
          {/* Left Column: Pro Card, WhatsApp Visiting Card & Local News Bulletin */}
          <div style={{ flex: "1", minWidth: "300px", maxWidth: "380px" }}>
            <div className="glass flex flex-col items-center animate-fade-in" style={{ padding: "2rem", textAlign: "center", borderRadius: "16px", position: "relative" }}>
              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <Image 
                  src={profile.avatar || "/images/about-us-hero.png"} 
                  alt={profile.name} 
                  width={130}
                  height={130}
                  unoptimized
                  style={{
                    width: "130px",
                    height: "130px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid var(--primary, #ea580c)",
                    boxShadow: "0 8px 24px rgba(234, 88, 12, 0.2)"
                  }}
                />
                {profile.verified && (
                  <div style={{ position: "absolute", bottom: "4px", right: "4px", background: "white", borderRadius: "50%", padding: "2px", display: "flex" }}>
                    <VerifiedBadge />
                  </div>
                )}
              </div>

              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--foreground)" }}>
                {profile.name}
              </h1>

              <div className="flex gap-2 items-center justify-center" style={{ marginBottom: "1.25rem" }}>
                <span style={{
                  padding: "0.25rem 0.85rem",
                  background: "rgba(0,0,0,0.05)",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--foreground)"
                }}>
                  {profile.trade}
                </span>
                {profile.verified && <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 600 }}>✓ Verified Pro</span>}
              </div>

              {/* Quick Key Metrics */}
              <div className="flex flex-col gap-2" style={{ width: "100%", textAlign: "left", marginBottom: "1.5rem", fontSize: "0.88rem" }}>
                <div className="flex justify-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.4rem" }}>
                  <span style={{ opacity: 0.7 }}>Experience</span>
                  <span style={{ fontWeight: 700 }}>{profile.experience || 'Experienced'}</span>
                </div>
                <div className="flex justify-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.4rem" }}>
                  <span style={{ opacity: 0.7 }}>Service Area</span>
                  <span style={{ fontWeight: 700 }}>{profile.location || 'Bangalore'}</span>
                </div>
                <div className="flex justify-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.4rem" }}>
                  <span style={{ opacity: 0.7 }}>Accepting Bookings</span>
                  <span style={{ fontWeight: 700, color: isAcceptingLeads ? '#16a34a' : '#ef4444' }}>
                    {isAcceptingLeads ? '● Open for Work' : '○ Fully Booked'}
                  </span>
                </div>
              </div>

              {/* Booking Quote Modal Action */}
              <div style={{ width: "100%" }}>
                <LeadCaptureModal proName={profile.name} proId={profile.id} acceptingLeads={isAcceptingLeads} />
              </div>

              {/* WhatsApp Visiting Card & Trust Credentials */}
              <ProVisitingCardActions profile={profile} canonicalUrl={proCanonicalUrl} />
            </div>

            {/* Left Column: Local News & Seasonal Trade Bulletin */}
            <ProLocalNewsCard trade={profile.trade} location={profile.location} />
          </div>

          {/* Right Column: About, Specialty Skills, Trade Estimator, Portfolio, Reviews, Blogs */}
          <div className="flex flex-col gap-6 animate-fade-in delay-200" style={{ flex: "2", minWidth: "320px" }}>
            
            {/* About Section */}
            <section className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.85rem", color: "var(--foreground)" }}>
                About {profile.name}
              </h2>
              <p style={{ opacity: 0.85, lineHeight: 1.8, fontSize: "0.95rem", margin: 0 }}>
                {profile.about || `${profile.name} is a verified ${profile.trade} offering professional, on-demand services across ${profile.location || 'Bangalore'}. Background-verified, certified, and committed to high craftsmanship standards.`}
              </p>
              
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "1.5rem", marginBottom: "0.75rem", color: "var(--foreground)" }}>
                Specialty Craft Skills
              </h3>
              <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                {(profile.skills && profile.skills.length > 0 ? profile.skills : [profile.trade, 'Installation', 'Repair', 'Maintenance', 'Emergency Fixes']).map((skill, i) => (
                  <span key={i} style={{
                    padding: "0.4rem 0.9rem",
                    background: "var(--secondary, rgba(0,0,0,0.04))",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 550,
                    transition: "all 0.2s"
                  }}>
                    ✨ {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Embedded Interactive Trade Estimator */}
            <ProTradeEstimator trade={profile.trade} proName={profile.name} />

            {/* Interactive Portfolio Gallery with Lightbox Zoom */}
            <ProPortfolioGallery portfolio={profile.portfolio} trade={profile.trade} proName={profile.name} />

            {/* Customer Reviews Section */}
            <section className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "var(--foreground)" }}>
                    Verified Customer Reviews
                  </h2>
                  <p style={{ margin: "0.25rem 0 0 0", opacity: 0.7, fontSize: "0.85rem" }}>
                    Feedback from homeowners who hired {profile.name} on Carpenterwala
                  </p>
                </div>
                {aggregateRating && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(245, 158, 11, 0.12)", padding: "0.3rem 0.75rem", borderRadius: "20px" }}>
                    <span style={{ color: "#d97706", fontWeight: 800, fontSize: "1rem" }}>★ {aggregateRating.ratingValue}</span>
                    <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>({aggregateRating.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {profile.reviews && profile.reviews.length > 0 ? (
                  profile.reviews.map((review, idx) => (
                    <div key={review.id || idx} style={{
                      padding: "1.25rem",
                      background: "rgba(0,0,0,0.02)",
                      borderRadius: "12px",
                      border: "1px solid var(--glass-border)"
                    }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{review.author}</span>
                          <span style={{ fontSize: "0.72rem", background: "rgba(34, 197, 94, 0.1)", color: "#16a34a", padding: "0.1rem 0.45rem", borderRadius: "4px", fontWeight: 600 }}>
                            ✓ Verified Hiring
                          </span>
                        </div>
                        <span style={{ color: "#f59e0b", fontSize: "1rem" }}>
                          {"★".repeat(review.rating || 5)}{"☆".repeat(Math.max(0, 5 - (review.rating || 5)))}
                        </span>
                      </div>
                      <p style={{ opacity: 0.85, fontSize: "0.92rem", margin: 0, lineHeight: 1.6 }}>{review.text}</p>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem 1rem", background: "rgba(0,0,0,0.02)", borderRadius: "12px" }}>
                    <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>⭐</span>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Be the First to Review {profile.name}</strong>
                    <p style={{ opacity: 0.7, fontSize: "0.85rem", maxWidth: "400px", margin: "0 auto" }}>
                      Book today and share your verified experience to help other homeowners in {profile.location || 'Bangalore'}.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Related Trade Blog Guides */}
            <ProTradeBlogs blogs={tradeBlogs} trade={profile.trade} proName={profile.name} />

          </div>
        </div>
      ) : (
        /* ── LEGACY REVERTIBLE FALLBACK LAYOUT ── */
        <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
          
          {/* Left Column: Profile Card */}
          <div style={{ flex: "1", minWidth: "300px", maxWidth: "400px" }}>
            <div className="glass flex flex-col items-center animate-fade-in" style={{ padding: "2rem", textAlign: "center", position: "sticky", top: "90px" }}>
              <Image 
                src={profile.avatar || "/images/about-us-hero.png"} 
                alt={profile.name} 
                width={120}
                height={120}
                unoptimized
                style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginBottom: "1rem", border: "4px solid var(--primary)" }}
              />
              <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{profile.name}</h1>

              <div className="flex gap-2 items-center justify-center" style={{ marginBottom: "1.5rem" }}>
                <span style={{ padding: "0.25rem 0.75rem", background: "rgba(255,255,255,0.1)", borderRadius: "20px", fontSize: "0.85rem" }}>
                  {profile.trade}
                </span>
                {profile.verified && <VerifiedBadge />}
              </div>

              <div className="flex flex-col gap-2" style={{ width: "100%", textAlign: "left", marginBottom: "2rem", fontSize: "0.9rem" }}>
                <div className="flex justify-between">
                  <span style={{ opacity: 0.7 }}>Experience</span>
                  <span style={{ fontWeight: 600 }}>{profile.experience || 'Experienced'}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ opacity: 0.7 }}>Location</span>
                  <span style={{ fontWeight: 600 }}>{profile.location || 'Bangalore'}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ opacity: 0.7 }}>Accepting Bookings</span>
                  <span style={{ fontWeight: 600, color: isAcceptingLeads ? '#34d399' : '#f87171' }}>
                    {isAcceptingLeads ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <LeadCaptureModal proName={profile.name} proId={profile.id} acceptingLeads={isAcceptingLeads} />
            </div>
          </div>

          {/* Right Column: Details & Portfolio */}
          <div className="flex flex-col gap-8 animate-fade-in delay-200" style={{ flex: "2", minWidth: "300px" }}>
            
            <section className="glass" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>About</h2>
              <p style={{ opacity: 0.8, lineHeight: 1.8 }}>{profile.about || `${profile.name} is a verified ${profile.trade} offering professional on-demand services across ${profile.location || 'Bangalore'}.`}</p>
              
              <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "1rem" }}>Skills</h3>
              <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                {(profile.skills && profile.skills.length > 0 ? profile.skills : [profile.trade, 'Installation', 'Repair', 'Maintenance']).map((skill, i) => (
                  <span key={i} style={{ padding: "0.4rem 1rem", background: "var(--secondary, rgba(255,255,255,0.08))", borderRadius: "6px", fontSize: "0.85rem" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {profile.portfolio && profile.portfolio.length > 0 && (
              <section className="glass" style={{ padding: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Portfolio</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                  {profile.portfolio.map((img, i) => (
                    <Image key={i} src={img} alt={`Work by ${profile.name}`} width={300} height={200} unoptimized style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} />
                  ))}
                </div>
              </section>
            )}

            <section className="glass" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Reviews</h2>
              <div className="flex flex-col gap-4">
                {profile.reviews && profile.reviews.length > 0 ? (
                  profile.reviews.map(review => (
                    <div key={review.id} style={{ padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: 600 }}>{review.author}</span>
                        <span style={{ color: "#facc15" }}>{"★".repeat(review.rating || 5)}{"☆".repeat(Math.max(0, 5 - (review.rating || 5)))}</span>
                      </div>
                      <p style={{ opacity: 0.8, fontSize: "0.95rem" }}>{review.text}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>No reviews submitted yet. Book {profile.name} today to be the first to leave a review!</p>
                )}
              </div>
            </section>

          </div>
        </div>
      )}
    </div>
  );
}
