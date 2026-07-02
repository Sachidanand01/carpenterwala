import { getProfileBySlug } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import VerifiedBadge from '@/components/VerifiedBadge';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateMetadata({ params }) {
  const { proSlug } = await params;
  const profile = await getProfileBySlug(proSlug);
  if (!profile) return { title: 'Not Found' };
  
  const siteUrl = 'https://carpenterwala.com';
  const canonicalUrl = `${siteUrl}/${profile.slug}`;
  const pageTitle = `${profile.name} - Verified ${profile.trade} in ${profile.location} | Carpenterwala`;
  const pageDescription = `Hire ${profile.name}, a verified ${profile.trade} in ${profile.location} with ${profile.experience} of experience. Specializing in ${profile.skills ? profile.skills.slice(0, 3).join(', ') : ''}. Book now on Carpenterwala.`;
  
  const baseKeywords = ['carpenter', 'home services', 'handyman', 'Bangalore', 'verified professionals'];
  const profileKeywords = [
    profile.name,
    profile.trade,
    profile.location,
    ...(profile.skills || [])
  ];
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
          url: `${siteUrl}/images/about-us-hero.png`,
          width: 1200,
          height: 630,
          alt: 'Carpenterwala Professional Services',
        }
      ],
      locale: 'en_US',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [`${siteUrl}/images/about-us-hero.png`],
    },
  };
}

export default async function ProProfile({ params }) {
  const { proSlug } = await params;
  const profile = await getProfileBySlug(proSlug);

  if (!profile) {
    notFound();
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

  const proJsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `https://carpenterwala.com/${profile.slug}#localbusiness`,
    "name": profile.name,
    "image": profile.avatar || "https://carpenterwala.com/images/default-avatar.png",
    "description": profile.about || `Verified ${profile.trade} in ${profile.location} with ${profile.experience} of experience.`,
    "telephone": profile.phone || "+91-XXXXXXXXXX",
    "url": `https://carpenterwala.com/${profile.slug}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": profile.full_address || profile.location || "HSR Layout",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": "560102",
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

  return (
    <div className="container" style={{ padding: "2rem 2rem 4rem 2rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(proJsonLd) }}
      />
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Find a Professional", url: "/find-a-professional" },
        { name: profile.name, url: `/${profile.slug}` }
      ]} />
      <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
        
        {/* Left Column: Profile Card */}
        <div style={{ flex: "1", minWidth: "300px", maxWidth: "400px" }}>
          <div className="glass flex flex-col items-center animate-fade-in" style={{ padding: "2rem", textAlign: "center", position: "sticky", top: "90px" }}>
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginBottom: "1rem", border: "4px solid var(--primary)" }}
            />
            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{profile.name}</h1>
            
            <div className="flex gap-2 items-center justify-center" style={{ marginBottom: "1.5rem" }}>
              <span style={{ padding: "0.25rem 0.75rem", background: "rgba(255,255,255,0.1)", borderRadius: "20px", fontSize: "0.85rem" }}>
                {profile.trade}
              </span>
              {profile.verified && <VerifiedBadge />}
            </div>

            <div className="flex flex-col gap-2" style={{ width: "100%", textAlign: "left", marginBottom: "2rem", fontSize: "0.9rem" }}>
              <div className="flex justify-between">
                <span style={{ opacity: 0.7 }}>Experience</span>
                <span style={{ fontWeight: 600 }}>{profile.experience}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ opacity: 0.7 }}>Location</span>
                <span style={{ fontWeight: 600 }}>{profile.location}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ opacity: 0.7 }}>Accepting Bookings</span>
                <span style={{ fontWeight: 600, color: profile.accepting_leads !== false ? '#34d399' : '#f87171' }}>
                  {profile.accepting_leads !== false ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <LeadCaptureModal proName={profile.name} proId={profile.id} acceptingLeads={profile.accepting_leads !== false} />
          </div>
        </div>

        {/* Right Column: Details & Portfolio */}
        <div className="flex flex-col gap-8 animate-fade-in delay-200" style={{ flex: "2", minWidth: "300px" }}>
          
          <section className="glass" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>About</h2>
            <p style={{ opacity: 0.8, lineHeight: 1.8 }}>{profile.about}</p>
            
            <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "1rem" }}>Skills</h3>
            <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
              {(profile.skills || []).map((skill, i) => (
                <span key={i} style={{ padding: "0.4rem 1rem", background: "var(--secondary)", borderRadius: "6px", fontSize: "0.85rem" }}>
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
                  <img key={i} src={img} alt={`Work by ${profile.name}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} />
                ))}
              </div>
            </section>
          )}

          <section className="glass" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Reviews</h2>
            <div className="flex flex-col gap-4">
              {(profile.reviews || []).map(review => (
                <div key={review.id} style={{ padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: 600 }}>{review.author}</span>
                    <span style={{ color: "#facc15" }}>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span>
                  </div>
                  <p style={{ opacity: 0.8, fontSize: "0.95rem" }}>{review.text}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
