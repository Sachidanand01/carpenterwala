import Link from 'next/link';
import MagneticCTA from "@/components/MagneticCTA";
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { supabase } from '@/lib/supabase';
import VerifiedBadge from '@/components/VerifiedBadge';

export const dynamicParams = true;

const LOCATIONS = {
  // Core Bangalore Tech & Urban Hubs
  'koramangala': { name: 'Koramangala', postalCode: '560034', hubName: 'South Bangalore', landmarks: 'Sony World Junction, 5th Block, Forum Mall' },
  'indiranagar': { name: 'Indiranagar', postalCode: '560038', hubName: 'East Bangalore', landmarks: '100ft Road, 12th Main, CMH Road' },
  'whitefield': { name: 'Whitefield', postalCode: '560066', hubName: 'IT Corridor East', landmarks: 'ITPL, Hope Farm Junction, EPIP Zone' },
  'hsr-layout': { name: 'HSR Layout', postalCode: '560102', hubName: 'Southeast Tech Hub', landmarks: 'Sector 1 to 7, 27th Main, BDA Complex' },
  'thanisandra': { name: 'Thanisandra', postalCode: '560077', hubName: 'North Bangalore', landmarks: 'Thanisandra Main Road, Manyata Tech Park, Bhartiya City' },
  'kothanur': { name: 'Kothanur', postalCode: '560077', hubName: 'North East Hub', landmarks: 'Hennur-Bagalur Main Road, Kristu Jayanti College' },
  'hennur': { name: 'Hennur', postalCode: '560043', hubName: 'North East Bangalore', landmarks: 'Hennur Cross, Kalyan Nagar, HRBR Layout' },
  'banashankari': { name: 'Banashankari', postalCode: '560085', hubName: 'South Bangalore', landmarks: '3rd Stage, BDA Complex, Kathriguppe' },
  'nayandahalli': { name: 'Nayandahalli', postalCode: '560039', hubName: 'West Bangalore', landmarks: 'Mysore Road Metro, Vijayanagar, Chandra Layout' },
  'solur': { name: 'Solur', postalCode: '562127', hubName: 'West Suburban Belt', landmarks: 'Nelamangala Highway, Solur Junction' },
  'sheshagirihalli': { name: 'Sheshagirihalli', postalCode: '562109', hubName: 'Southwest Corridor', landmarks: 'Bidadi Industrial Area, Mysore Road' },
  'jigani': { name: 'Jigani', postalCode: '560105', hubName: 'South Industrial Belt', landmarks: 'Jigani APC Circle, Bannerghatta Main Road' },
  'rt-nagar': { name: 'RT Nagar', postalCode: '560032', hubName: 'North Heritage Hub', landmarks: '80ft Road, Ganganagar, Matadahalli' },
  'jayanagar': { name: 'Jayanagar', postalCode: '560041', hubName: 'South Heritage Hub', landmarks: '4th Block Complex, 11th Main, South End Circle' },
  'jp-nagar': { name: 'JP Nagar', postalCode: '560078', hubName: 'South Residential Zone', landmarks: 'Phase 1 to 7, Dollar Layout, Outer Ring Road' },
  'bellandur': { name: 'Bellandur', postalCode: '560103', hubName: 'ORR Tech Corridor', landmarks: 'EcoSpace, Green Glen Layout, Bellandur Lake Road' },
  'marathahalli': { name: 'Marathahalli', postalCode: '560037', hubName: 'East Suburb Junction', landmarks: 'Spice Garden, Multiplex Junction, HAL Airport Road' },
  'hebbal': { name: 'Hebbal', postalCode: '560024', hubName: 'North Gateway Hub', landmarks: 'Hebbal Flyover, Esteem Mall, Nagavara Outer Ring Road' },
  'sarjapur-road': { name: 'Sarjapur Road', postalCode: '560035', hubName: 'Southeast Tech Belt', landmarks: 'Carmelaram, Wipro Corporate Office, Kaikondrahalli' },
  'electronic-city': { name: 'Electronic City', postalCode: '560100', hubName: 'South Tech Hub', landmarks: 'Phase 1 & 2, Neeladri Road, Infosys Gate' },
  'yelahanka': { name: 'Yelahanka', postalCode: '560064', hubName: 'North Satellite Hub', landmarks: 'Yelahanka New Town, Kogilu Cross, Judicial Layout' },
  
  // Metro Cities Across India
  'mumbai': { name: 'Mumbai', postalCode: '400001', hubName: 'Mumbai Metropolitan Region', landmarks: 'Andheri, Bandra, Powai, South Mumbai' },
  'delhi': { name: 'Delhi NCR', postalCode: '110001', hubName: 'National Capital Region', landmarks: 'Gurgaon, Noida, South Delhi, Dwarka' },
  'hyderabad': { name: 'Hyderabad', postalCode: '500081', hubName: 'Cyberabad & Greater Hyderabad', landmarks: 'Gachibowli, Hitech City, Madhapur, Jubilee Hills' },
  'pune': { name: 'Pune', postalCode: '411001', hubName: 'Pune Metropolis', landmarks: 'Hinjewadi, Baner, Kothrud, Viman Nagar' },
  'chennai': { name: 'Chennai', postalCode: '600001', hubName: 'Greater Chennai', landmarks: 'OMR, Anna Nagar, Velachery, T. Nagar' }
};

const RATE_CARDS = {
  'carpentry': [
    { task: 'Door Lock & Latch Fitting / Repair', price: '₹249 - ₹499', time: '30 - 45 mins' },
    { task: 'Modular Kitchen Hinge / Hydraulic Repair', price: '₹199 - ₹450', time: '20 - 40 mins' },
    { task: 'Bed & Wardrobe Knockdown Assembly', price: '₹699 - ₹1,799', time: '1 - 3 hours' },
    { task: 'Furniture Restoration & Polish Touch-up', price: '₹399 - ₹899', time: '1 - 2 hours' },
    { task: 'Custom Wardrobe Carpentry (Labour)', price: '₹280 - ₹450 / sq ft', time: 'Project' },
  ],
  'painting': [
    { task: '1 BHK Interior Wall Repaint (Labour)', price: '₹4,500 - ₹7,500', time: '1 - 2 days' },
    { task: '2 BHK Interior Wall Repaint (Labour)', price: '₹8,000 - ₹13,000', time: '2 - 3 days' },
    { task: '3 BHK Interior Wall Repaint (Labour)', price: '₹12,000 - ₹19,000', time: '3 - 5 days' },
    { task: 'Water Damp-Proof Primer & Putty Touch-up', price: '₹18 - ₹32 / sq ft', time: 'Half day' },
    { task: 'Feature Accent Wall Texture Painting', price: '₹1,200 - ₹2,500', time: '3 - 5 hours' },
  ],
  'plumbing': [
    { task: 'Tap & Faucet Leak Repair / Replacement', price: '₹149 - ₹299', time: '20 - 30 mins' },
    { task: 'Flush Tank & Commode Leakage Fix', price: '₹349 - ₹699', time: '30 - 60 mins' },
    { task: 'Kitchen Sink Drain Pipe Unclogging', price: '₹249 - ₹449', time: '25 - 45 mins' },
    { task: 'Overhead Water Tank Deep Cleaning (500L-1000L)', price: '₹699 - ₹1,299', time: '1 - 2 hours' },
    { task: 'Bathroom Sanitary Fitting Installation', price: '₹349 - ₹749', time: '45 - 90 mins' },
  ],
  'electrical': [
    { task: 'Switchboard / Power Socket Fitting', price: '₹99 - ₹180 / pt', time: '15 - 30 mins' },
    { task: 'Ceiling Fan & BLDC Remote Fitting', price: '₹149 - ₹299', time: '20 - 45 mins' },
    { task: 'MCB Trip Diagnostics & DB Repair', price: '₹349 - ₹699', time: '30 - 60 mins' },
    { task: 'Inverter & Battery Wiring Setup', price: '₹499 - ₹999', time: '1 - 2 hours' },
    { task: 'Heavy Appliance Line (Geyser / AC)', price: '₹349 - ₹699', time: '45 - 75 mins' },
  ]
};

const SERVICES = {
  'carpentry': {
    title: 'Professional Carpenters in',
    type: 'Carpenter',
    serviceName: 'Carpentry',
    description: 'Find top-rated, background-verified carpenters near you for furniture repair, modular kitchen setup, door lock fitting, and custom woodwork.',
    keywords: ['carpenter near me', 'custom carpentry', 'furniture repair']
  },
  'painting': {
    title: 'Expert Home Painters in',
    type: 'Painter',
    serviceName: 'Painting',
    description: 'Book verified interior and exterior painters with transparent pricing, wall putty prep, and clean post-painting finish.',
    keywords: ['painters near me', 'house painting', 'wall painting cost']
  },
  'plumbing': {
    title: 'Certified Plumbers in',
    type: 'Plumber',
    serviceName: 'Plumbing',
    description: 'Fast local plumbers for tap leak repairs, pipe fitting, water tank cleaning, and bathroom sanitary installations.',
    keywords: ['plumber near me', 'leak repair', 'emergency plumber']
  },
  'electrical': {
    title: 'Certified Electricians in',
    type: 'Electrician',
    serviceName: 'Electrical',
    description: 'Experienced electricians for house rewiring, MCB trip fixes, switchboard installation, and appliance setup.',
    keywords: ['electrician near me', 'electrical repair', 'wiring electrician']
  }
};

// Format slug into clean name
function resolveLocation(slug) {
  if (LOCATIONS[slug]) {
    return LOCATIONS[slug];
  }
  // Dynamic fallback formatting: e.g. "kothanur-bangalore" -> "Kothanur Bangalore"
  const formattedName = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    name: formattedName,
    postalCode: 'Local Area',
    hubName: `${formattedName} Region`,
    landmarks: `Localities and neighborhoods across ${formattedName}`
  };
}

export async function generateStaticParams() {
  const paramsList = [];
  Object.keys(SERVICES).forEach((service) => {
    Object.keys(LOCATIONS).forEach((location) => {
      paramsList.push({ service, location });
    });
  });
  return paramsList;
}

export async function generateMetadata({ params }) {
  const { service, location } = await params;
  const srv = SERVICES[service];

  if (!srv) {
    return { title: 'Service Not Found | CarpenterWala' };
  }

  const loc = resolveLocation(location);

  return {
    title: `${srv.title} ${loc.name} | Verified Doorstep Pros | CarpenterWala`,
    description: `${srv.description} Direct contact with verified local ${srv.type.toLowerCase()}s in ${loc.name} with transparent rate cards and zero middleman fees.`,
    keywords: srv.keywords.map(k => `${k} ${loc.name}`),
    alternates: {
      canonical: `https://carpenterwala.com/services/${service}/${location}`,
    },
  };
}

export default async function ServiceLocationPage({ params }) {
  const { service, location } = await params;
  const srv = SERVICES[service];

  if (!srv) {
    notFound();
  }

  const loc = resolveLocation(location);
  const rateCard = RATE_CARDS[service] || [];
  const directFilterUrl = `/find-a-professional?category=${encodeURIComponent(srv.type)}&location=${encodeURIComponent(loc.name)}`;

  // Query Supabase for verified pros in this trade
  let verifiedPros = [];
  try {
    const { data: pros, error } = await supabase
      .from('profiles')
      .select('id, name, slug, avatar, trade, rating, review_count, experience_years, verified, city')
      .eq('verified', true)
      .eq('trade', srv.type)
      .limit(6);

    if (!error && pros) {
      verifiedPros = pros;
    }
  } catch (err) {
    console.error("Error fetching location pros:", err);
  }

  const localFaqs = [
    {
      q: `How quickly can a verified ${srv.type.toLowerCase()} arrive in ${loc.name}?`,
      a: `Technicians operating in ${loc.name} (${loc.landmarks}) typically arrive within 60 to 90 minutes of booking confirmation for standard service calls and emergency repairs.`
    },
    {
      q: `What is the visiting and inspection charge in ${loc.name}?`,
      a: `Our verified professionals charge a nominal inspection fee (₹100 to ₹150), which is fully adjusted against your final labor bill if you proceed with the service work.`
    },
    {
      q: `Do professionals bring spare parts and materials?`,
      a: `Yes, professionals carry standard diagnostic tools and common replacement parts. For specialized hardware, they can purchase authentic items with genuine receipts or install parts you have provided.`
    },
    {
      q: `Is there any platform commission or middleman fee?`,
      a: `No! Carpenterwala is 100% free for both homeowners and service pros. You negotiate and pay directly to the professional with zero commission markups.`
    }
  ];

  const localJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
        "@id": `https://carpenterwala.com/services/${service}/${location}#localbusiness`,
        "name": `Carpenterwala ${srv.serviceName} Services - ${loc.name}`,
        "url": `https://carpenterwala.com/services/${service}/${location}`,
        "telephone": "+91-809-555-1001",
        "priceRange": "₹₹",
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": loc.name
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": `${loc.landmarks}, ${loc.name}`,
          "addressLocality": loc.name,
          "addressRegion": "India",
          "postalCode": loc.postalCode,
          "addressCountry": "IN"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "08:00",
          "closes": "20:00"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `https://carpenterwala.com/services/${service}/${location}#faq`,
        "mainEntity": localFaqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 2rem 4rem 2rem' }}>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
        { name: srv.serviceName, url: `/services/${service}` },
        { name: loc.name, url: `/services/${service}/${location}` }
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localJsonLd) }}
      />

      {/* Hero Header */}
      <div style={{ textAlign: 'center', margin: '2rem 0 3.5rem 0' }}>
        <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', fontWeight: 'bold' }}>
          📍 {loc.hubName} · {loc.postalCode !== 'Local Area' ? `Pincode: ${loc.postalCode}` : 'Doorstep Service'}
        </span>
        <h1 className="text-gradient" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', margin: '0.75rem 0 1rem 0' }}>
          {srv.title} <span style={{ color: 'var(--accent)' }}>{loc.name}</span>
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.15rem', maxWidth: '750px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          {srv.description} Direct contact with top-rated technicians covering {loc.landmarks}.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <MagneticCTA>
            <Link href={directFilterUrl} className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              🔍 View Verified {srv.type}s in {loc.name}
            </Link>
          </MagneticCTA>
          <a
            href={`https://api.whatsapp.com/send?phone=918095551001&text=${encodeURIComponent(`Hi Carpenterwala, I am looking for a verified ${srv.type} in ${loc.name} (${loc.postalCode}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: '0.9rem 1.8rem', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>💬</span> Quick WhatsApp Match
          </a>
        </div>
      </div>

      {/* Verified Professionals Directory View */}
      {verifiedPros.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>
                Verified <span className="text-gradient">{srv.type}s</span> Available in {loc.name}
              </h2>
              <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>
                Background-checked local craftsmen ready for immediate dispatch in {loc.name}.
              </p>
            </div>
            <Link href={directFilterUrl} style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
              See All Profiles →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {verifiedPros.map((pro) => (
              <div key={pro.id} className="glass" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(194, 65, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', overflow: 'hidden' }}>
                      {pro.avatar ? (
                        <img src={pro.avatar} alt={pro.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        '👷'
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{pro.name}</h3>
                        {pro.verified && <VerifiedBadge size={16} />}
                      </div>
                      <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{pro.trade} · {pro.experience_years ? `${pro.experience_years}+ Yrs Exp` : 'Verified Pro'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    <span style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#15803d', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600 }}>
                      ✓ Servicing {loc.name}
                    </span>
                    {pro.rating && (
                      <span style={{ background: 'rgba(217, 119, 6, 0.12)', color: 'var(--accent)', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600 }}>
                        ★ {pro.rating} ({pro.review_count || 1})
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <Link
                    href={`/${pro.slug || pro.id}`}
                    className="btn btn-primary"
                    style={{ flex: 1, textAlign: 'center', padding: '0.6rem 0.5rem', fontSize: '0.9rem' }}
                  >
                    View Profile
                  </Link>
                  <a
                    href={`tel:+918095551001`}
                    className="btn btn-secondary"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Call Now"
                  >
                    📞 Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Localized Transparent Rate Card */}
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.3rem' }}>
              Standard {srv.serviceName} Rate Card in <span className="text-gradient">{loc.name}</span>
            </h2>
            <p style={{ opacity: 0.75, fontSize: '0.95rem' }}>
              Transparent baseline labor charges. 100% direct payment with 0% platform commission.
            </p>
          </div>
          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.4rem 0.9rem', borderRadius: '20px', fontWeight: '600', fontSize: '0.85rem' }}>
            ✓ Verified Upfront Pricing
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '480px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--primary)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Standard Service Task</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Estimated Labor Range</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Typical Duration</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rateCard.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{item.task}</td>
                  <td style={{ padding: '1rem', color: 'var(--accent)', fontWeight: 600 }}>{item.price}</td>
                  <td style={{ padding: '1rem', opacity: 0.8 }}>{item.time}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <Link
                      href={directFilterUrl}
                      style={{
                        fontSize: '0.85rem',
                        padding: '0.4rem 0.8rem',
                        background: 'rgba(194, 65, 12, 0.1)',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: 'var(--primary)',
                        fontWeight: 600
                      }}
                    >
                      Book Pro →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Localized Why Choose Trust Card */}
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', marginBottom: '3.5rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>
          Why {loc.name} Residents Choose <span className="text-gradient">Carpenterwala</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(194, 65, 12, 0.1)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>60–90 Min Dispatch</h3>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Nearby pros based around {loc.landmarks} ensure fast turnarounds.</p>
          </div>
          <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(194, 65, 12, 0.1)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>ID-Verified Craftsmen</h3>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Every pro is KYC background-checked and skills-tested for household safety.</p>
          </div>
          <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(194, 65, 12, 0.1)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💸</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>0% Commission Free</h3>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>No hidden customer fees or middlemen cuts. Transparent direct quotes.</p>
          </div>
          <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(194, 65, 12, 0.1)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Genuine Local Reviews</h3>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Read real feedback and inspect past repair photos from neighbors in {loc.name}.</p>
          </div>
        </div>
      </div>

      {/* Localized FAQ Accordion (FAQPage Schema Supported) */}
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
          Frequently Asked Questions: <span className="text-gradient">{srv.serviceName} in {loc.name}</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {localFaqs.map((faq, index) => (
            <div key={index} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', borderLeft: '3px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{faq.q}</h3>
              <p style={{ opacity: 0.85, fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Sibling Localities Internal Linking Hub */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', opacity: 0.9 }}>
          Other Localities for {srv.serviceName}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {Object.entries(LOCATIONS).slice(0, 16).map(([locKey, locObj]) => (
            <Link
              key={locKey}
              href={`/services/${service}/${locKey}`}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.88rem',
                textDecoration: 'none',
                background: locKey === location ? 'var(--primary)' : 'rgba(194, 65, 12, 0.08)',
                color: locKey === location ? '#ffffff' : 'inherit',
                fontWeight: locKey === location ? 600 : 400,
                transition: 'all 0.2s ease'
              }}
            >
              {srv.serviceName} in {locObj.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
