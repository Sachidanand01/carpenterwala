import Link from 'next/link';
import MagneticCTA from "@/components/MagneticCTA";
import ColorVisualizer from '@/components/ColorVisualizer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdSenseContainer from '@/components/AdSenseContainer';
import PaintCalculator from '@/components/PaintCalculator';

export const metadata = {
  title: 'Professional House Painting Services in India | CarpenterWala',
  description: 'Hire verified house painters in India for interior, exterior, and rental wall painting. View standard per sq ft rates, calculate costs, and book online.',
  keywords: [
    'house painting services india',
    'painter near me',
    'home painting cost guide india',
    'painter charges per sq ft',
    'interior wall painting india',
    'waterproofing painting contractors',
    'exterior home painting cost',
    'Painting Services in Bangalore',
    'Painters in Mumbai',
    'Best Painters in Delhi'
  ],
  alternates: {
    canonical: 'https://carpenterwala.com/services/painting',
  },
};

export default function PaintingPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://carpenterwala.com/services/painting#service",
        "name": "Professional Home & Commercial Painting Services in India",
        "serviceType": "Painting",
        "provider": {
          "@type": "Organization",
          "name": "Carpenterwala",
          "url": "https://carpenterwala.com",
          "telephone": "+91-809-555-1001"
        },
        "areaServed": [
          { "@type": "City", "name": "Bangalore" },
          { "@type": "City", "name": "Mumbai" },
          { "@type": "City", "name": "Delhi NCR" },
          { "@type": "City", "name": "Hyderabad" },
          { "@type": "City", "name": "Pune" },
          { "@type": "City", "name": "Chennai" }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Painting Services Catalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Interior Wall Painting & Repainting"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Exterior Weatherproof Coating"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Waterproofing & Damp Repair Treatment"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Accent Feature Wall Texturing"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Wall Putty & Primer Surface Prep"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Rental Fresh Distemper & Whitewash"
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://carpenterwala.com/services/painting#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How long does it take to paint a 2BHK house?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Typically, a full 2BHK interior repainting project takes between 3 to 5 days. Fresh painting with complete 2-coat putty application and drying takes 6 to 8 days."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to move the furniture myself?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our verified painters assist in shifting and covering your furniture and flooring with heavy plastic drop cloths to protect against paint splatters and dust."
            }
          },
          {
            "@type": "Question",
            "name": "Can you match a specific color I saw online?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our painting professionals utilize digital shade cards from leading brands (Asian Paints, Berger, Dulux, Nerolac) to match any desired shade or accent texture."
            }
          },
          {
            "@type": "Question",
            "name": "How is the total paintable wall area calculated in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In Indian apartments, total paintable surface area is standardly estimated by multiplying the flat's carpet area by 3.5. This formula accounts for 4 walls plus the ceiling in every room."
            }
          },
          {
            "@type": "Question",
            "name": "What is the cost of repainting vs fresh painting per sq ft in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Standard interior repainting ranges from ₹10 to ₹22 per sq. ft., while fresh painting (including 2 coats acrylic putty, 1 coat primer, and 2 top coats) ranges from ₹18 to ₹36 per sq. ft."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="animate-fade-in">
      <div className="container" style={{ padding: "1rem 2rem 0 2rem", marginBottom: "-1.5rem", position: "relative", zIndex: 10 }}>
        <Breadcrumbs items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Painting", url: "/services/painting" }
        ]} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '60vh',
        minHeight: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: '4rem'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("/images/painting-hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.85))',
          zIndex: -1,
        }}></div>

        <div className="container" style={{ textAlign: 'center' }}>
          <div className="hero-backdrop-card animate-fade-in">
            <h1 style={{ fontSize: '3.25rem', marginBottom: '1.25rem', color: '#0F172A' }}>
              Professional <span className="text-gradient">House Painting</span> Services Across India
            </h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '680px', margin: '0 auto 2rem' }}>
              Transform your interiors and protect exterior walls with expert color consultations, dust-free sanding, and verified local painters.
            </p>
            <MagneticCTA>
              <Link href="/find-a-professional?category=Painter" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                Find a Painter Nearby
              </Link>
            </MagneticCTA>
          </div>
        </div>
      </section>

      {/* Overview Section (Citable Answer Block for AI SEO) */}
      <section className="container animate-fade-in" style={{ marginBottom: '4rem', maxWidth: '850px', textAlign: 'center', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>What are Professional Painting Services?</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.85 }}>
          Professional painting services deliver comprehensive surface preparation, crack filling, moisture dampness treatment, and precision paint application using airless sprayers and mechanized rollers. Vetted painters provide accurate per-square-foot cost estimations and use premium low-VOC emulsions to ensure durable, washable, and vibrant wall finishes for homes and commercial offices throughout India.
        </p>
      </section>

      {/* Color Visualizer Section */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <ColorVisualizer />
      </section>

      {/* Services Grid */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Painting Expertise</h2>
          <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
            From fresh interior coats to weather-proof exterior coatings, hire vetted trade specialists.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ marginBottom: '1rem' }}>Interior Home Wall Painting</h3>
            <p style={{ opacity: 0.8 }}>Premium interior emulsion finishes, wall smoothing with acrylic putty, stain-resistant coatings, and seamless ceiling painting for flats and villas.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ marginBottom: '1rem' }}>Exterior Weatherproof Coating</h3>
            <p style={{ opacity: 0.8 }}>High-durability anti-algal and anti-fungal exterior paints (Apex, Ultima, WeatherCoat) that protect facades from harsh sun and monsoons.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💧</div>
            <h3 style={{ marginBottom: '1rem' }}>Wall Waterproofing & Damp Treatment</h3>
            <p style={{ opacity: 0.8 }}>Specialized polymer and silicone base waterproofing to eliminate efflorescence, bubbling paint, and interior wall seepage before painting.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎨</div>
            <h3 style={{ marginBottom: '1rem' }}>Texture & Accent Feature Walls</h3>
            <p style={{ opacity: 0.8 }}>Designer wall finishes, metallic luster coatings, Venetian plaster effects, and geometric stencil work to create captivating living room focal points.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚪</div>
            <h3 style={{ marginBottom: '1rem' }}>Door, Grill & Enamel Polishing</h3>
            <p style={{ opacity: 0.8 }}>High-gloss enamel painting for balcony safety grills, main gate ironwork, and natural PU polish for solid teak and veneer main doors.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏗️</div>
            <h3 style={{ marginBottom: '1rem' }}>Rental Turnover & Commercial Painting</h3>
            <p style={{ opacity: 0.8 }}>Fast-turnaround, budget-friendly distemper and economy plastic emulsion packages for tenants, landlords, and office workspaces.</p>
          </div>
        </div>
      </section>

      {/* Standard Home Painting Cost Guide India */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              Standard Home Painting Cost Guide in India
            </h2>
            <p style={{ opacity: 0.85, maxWidth: '750px', margin: '0 auto' }}>
              Standard market rates per square foot for interior and exterior painting across Indian cities. Compare labour-only charges versus full material packages.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--primary)', color: 'var(--primary)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Painting Package Type</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Labour Only Rate</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Labour + Material Rate</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Application Scope</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.95rem' }}>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Fresh Interior Painting</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹8 – ₹14 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹18 – ₹35 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>2 coats putty sanding + 1 coat primer + 2 top emulsion coats.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Interior Wall Repainting</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹5 – ₹9 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹11 – ₹22 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Minor crack touchup + 1 coat primer patch + 2 coats premium emulsion.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Luxury Silk / Royale Emulsion</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹12 – ₹18 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹28 – ₹55 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Ultra-smooth high-sheen washable finish (Royale Aspira / Velvet).</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Exterior Weatherproof Coating</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹7 – ₹12 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹16 – ₹32 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>High-pressure wash + crack sealing + 2 coats anti-fungal exterior paint.</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Rental Distemper / Whitewash</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹3.5 – ₹6 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹7 – ₹12 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Budget-friendly 2 coats tractor distemper for tenant turnover.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Wall Painting Cost & Quantity Overview */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            How to Calculate Paint Quantity and Labor Costs for 1BHK, 2BHK, and 3BHK Flats in India?
          </h2>
          <p style={{ opacity: 0.9, fontSize: '1.05rem' }}>
            When estimating wall painting requirements for Indian apartments, total paintable surface area is calculated by multiplying carpet area by 3.5 (accounting for 4 walls and ceiling). For a standard <strong>1,000 sq ft 2BHK flat</strong>, the total paintable wall surface is approximately 3,500 sq ft. Standard premium interior emulsion paints yield a coverage rate of <strong>120 to 140 sq ft per liter for two finishing coats</strong> over previously painted walls, requiring roughly 25 to 30 Litres of paint plus 10 Litres of primer for fresh coats. Professional painting labor rates in India range from ₹5 to ₹10 per sq ft for repainting, and ₹10 to ₹18 per sq ft for fresh painting with putty sanding. Using high-coverage acrylic emulsions prevents paint flaking, resists fungal growth during monsoons, and ensures long-lasting color retention. Calculate your exact paint volume and material costs with Carpenterwala's Paint Calculator below.
          </p>
        </div>
      </section>

      {/* Paint & Material Estimator Section */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <PaintCalculator />
      </section>

      {/* Surface Preparation Protocol Guide */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem', color: 'var(--primary)', textAlign: 'center' }}>
            5-Step Professional Wall Preparation Protocol
          </h2>
          <p style={{ opacity: 0.85, lineHeight: '1.8', maxWidth: '780px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
            80% of paint failures (peeling, bubbling, fungal patches) stem from poor surface preparation. Our verified painters follow a rigorous 5-step standard:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Step 1</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Moisture Check & Sanding</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>Digital moisture meter testing and mechanized scraping of loose or flaking old paint.</p>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Step 2</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Crack & Damp Repair</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>Sealing hairline cracks with acrylic sealant and applying anti-efflorescence damp block primer.</p>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Step 3</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Double Putty Smoothing</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>Applying two cross coats of white cement putty with thorough buffer sanding for mirror-smooth walls.</p>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Step 4</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Alkali-Resistant Primer</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>Deep-penetrating primer coat to equalize porosity and maximize topcoat color vibrancy.</p>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Step 5</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>2 Top Finish Coats</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>Even roller application with 4-hour inter-coat drying for streak-free, long-lasting rich walls.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Serving Major Cities Across India */}
      <section style={{ backgroundColor: 'rgba(250, 248, 245, 1)', padding: '5rem 0', marginBottom: '6rem' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', textAlign: 'center' }}>Serving Major Cities Across India</h2>
          <p style={{ opacity: 0.8, textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Book trusted local painters with complete floor masking and mess-free cleanup in your city.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Bangalore</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Expert <strong>Painting Services in Bangalore</strong>. Serving Whitefield, Koramangala, Indiranagar, HSR Layout, and Thanisandra.
              </p>
              <Link href="/find-a-professional?category=Painter&location=Bangalore" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Painters in Bangalore →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Mumbai</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Hire reliable <strong>Painters in Mumbai</strong> for coastal waterproofing, damp treatment, and luxury interior wall textures.
              </p>
              <Link href="/find-a-professional?category=Painter&location=Mumbai" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Painters in Mumbai →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Delhi NCR</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Connect with <strong>Best Painters in Delhi NCR</strong> for dust-free home repainting in Gurgaon, Noida, and South Delhi.
              </p>
              <Link href="/find-a-professional?category=Painter&location=Delhi" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Painters in Delhi →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Hyderabad</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Book skilled painters in Hyderabad for villa exterior coatings and apartment repainting in Gachibowli, Kondapur, and Jubilee Hills.
              </p>
              <Link href="/find-a-professional?category=Painter&location=Hyderabad" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Painters in Hyderabad →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section style={{ backgroundColor: 'rgba(250, 248, 245, 1)', padding: '6rem 0', marginBottom: '6rem' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose <span className="text-gradient">Carpenterwala</span> Painters?</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
                We bridge the gap between your vision and a perfectly painted home with our network of vetted professionals.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Dust-Free Execution:</strong> Our pros use modern tools and drop cloth masking to ensure a clean, hassle-free painting experience.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>On-Time Completion:</strong> We value your time. Our painters stick to strict schedules to finish your project as promised.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>100% Genuine Materials:</strong> We use authentic, sealed containers from certified brands like Asian Paints, Berger, and Dulux.
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div className="glass" style={{ padding: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Get a Free Color Consultation</h3>
                <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
                  Not sure which shade to choose? Connect with our experts for professional advice on colors, sheens, and waterproofing.
                </p>
                <MagneticCTA style={{ width: '100%' }}>
                  <Link href="/find-a-professional?category=Painter" className="btn btn-primary" style={{ width: '100%' }}>
                    View All Painters
                  </Link>
                </MagneticCTA>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Snippet */}
      <section className="container" style={{ marginBottom: '8rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center' }}>Painting FAQs</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>How long does it take to paint a 2BHK house?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Typically, a full 2BHK interior repainting project takes between 3 to 5 days. Fresh painting with complete 2-coat putty application and drying takes 6 to 8 days.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Do I need to move the furniture myself?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Our painters will assist in moving and covering your furniture with plastic drop sheets to protect them from paint splatters and dust.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Can you match a specific color I saw online?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Yes! Our professionals use advanced digital color codes and fan decks from major manufacturers (Asian Paints, Berger, Dulux) to achieve the exact shade you desire.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>How is the total paintable wall area calculated in India?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              In Indian apartments, total paintable surface area is standardly estimated by multiplying the flat's carpet area by 3.5. This formula accounts for 4 walls plus the ceiling in every room.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>What is the cost of repainting vs fresh painting per sq ft in India?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Standard interior repainting ranges from ₹10 to ₹22 per sq. ft., while fresh painting (including 2 coats acrylic putty, 1 coat primer, and 2 top coats) ranges from ₹18 to ₹36 per sq. ft.
            </div>
          </details>
        </div>
      </section>

      {/* Bottom AdSense Banner */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <AdSenseContainer
          slot="5678901234"
          format="auto"
          responsive="true"
          style={{ minHeight: '250px' }}
        />
      </section>
    </div>
  );
}
