import Link from 'next/link';
import ColorVisualizer from '@/components/ColorVisualizer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdSenseContainer from '@/components/AdSenseContainer';
import PaintCalculator from '@/components/PaintCalculator';

export const metadata = {
  title: 'Professional Painting Services | Home Painting Cost Guide',
  description: 'Find verified painting services in Bangalore. Check painter charges per sq ft and estimate home painting cost in India with our guide.',
  keywords: ['home painting cost guide india', 'home painting cost India', 'painter charges per sq ft', 'interior painting tips indian homes', 'best paint for Indian homes'],
  alternates: {
    canonical: 'https://carpenterwala.com/services/painting',
  },
};

export default function PaintingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Painting",
    "provider": {
      "@type": "Organization",
      "name": "Carpenterwala"
    },
    "areaServed": {
      "@type": "City",
      "name": "Bangalore"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Painting Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Interior Painting"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Exterior Painting"
          }
        }
      ]
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does it take to paint a 2BHK house?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Typically, a full 2BHK interior painting project takes between 4 to 7 days, depending on the complexity and the number of coats required."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to move the furniture myself?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our painters will assist in moving and covering your furniture with plastic sheets to protect them from paint splatters and dust."
        }
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '60vh',
        minHeight: '400px',
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
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8))',
          zIndex: -1,
        }}></div>
        
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Expert <span className="text-gradient">Painting</span> Services
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2rem', opacity: 0.9 }}>
            Revitalize your living space with professional color consultations and flawless execution by Bangalore's top-rated painters.
          </p>
          <Link href="/find-a-professional?category=Painter" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Find a Painter Nearby
          </Link>
        </div>
      </section>

      {/* Overview Section (Citable Answer Block for AI SEO) */}
      <section className="container animate-fade-in" style={{ marginBottom: '4rem', maxWidth: '800px', textAlign: 'center', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>What are Professional Painting Services?</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.85 }}>
          Professional painting services deliver high-quality interior and exterior wall finishes, customized color consultations, and thorough surface preparation. Verified painters on our handyman marketplace ensure accurate sq ft estimation and use premium weather-resistant paints to protect and beautify homes or offices throughout Bangalore.
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
            From fresh interior coats to durable exterior finishes, we provide comprehensive painting solutions.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ marginBottom: '1rem' }}>Painter for Home Interior</h3>
            <p style={{ opacity: 0.8 }}>Transform your rooms with premium interior wall painting. Hire a skilled painter for home interior design updates, surface prep, and a flawless paint coating.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ marginBottom: '1rem' }}>Painter for Exterior Work</h3>
            <p style={{ opacity: 0.8 }}>Protect your home from the elements. Hire a vetted painter for exterior work, including crack-filling, prime coats, and durable weather-proof wall coatings.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💧</div>
            <h3 style={{ marginBottom: '1rem' }}>Waterproofing Solutions</h3>
            <p style={{ opacity: 0.8 }}>Advanced waterproofing treatments for walls and ceilings to prevent dampness, mold, and structural damage.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎨</div>
            <h3 style={{ marginBottom: '1rem' }}>Texture & Accent Walls</h3>
            <p style={{ opacity: 0.8 }}>Create a focal point with designer textures, metallic finishes, or unique patterns that reflect your personality.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚪</div>
            <h3 style={{ marginBottom: '1rem' }}>Door & Window Polishing</h3>
            <p style={{ opacity: 0.8 }}>Professional wood polishing and painting for doors, window frames, and cabinets to give them a premium, new look.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏗️</div>
            <h3 style={{ marginBottom: '1rem' }}>Commercial Painting</h3>
            <p style={{ opacity: 0.8 }}>Scalable painting solutions for offices, showrooms, and commercial buildings with minimal disruption to your business.</p>
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
            When estimating wall painting requirements for Indian apartments, total paintable surface area is calculated by multiplying carpet area by 3.5 (accounting for 4 walls and ceiling). For a standard <strong>1,000 sq ft 2BHK flat</strong>, the total paintable wall surface is approximately 3,500 sq ft. Standard premium interior emulsion paints yield a coverage rate of <strong>120 to 140 sq ft per liter for two finishing coats</strong> over previously painted walls, requiring roughly 25 to 30 Litres of paint plus 10 Litres of primer for fresh coats. Professional painting labor rates in Bangalore range from ₹8 to ₹15 per sq ft for repainting, and ₹15 to ₹25 per sq ft for fresh painting with putty sanding. Using high-coverage acrylic emulsions prevents paint flaking, resists fungal growth during monsoons, and ensures long-lasting color retention. Calculate your exact paint volume and material costs with Carpenterwala's Paint Calculator below.
          </p>
        </div>
      </section>

      {/* Paint & Material Estimator Section */}
      <section className="container">
        <PaintCalculator />
      </section>

      {/* Home Painting Cost Guide India */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Home Painting Cost Guide India</h2>
          <p style={{ opacity: 0.8, textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            Estimating your home painting cost in India depends on multiple factors like size, paint type, and surface condition. Explore typical painter charges per sq ft to budget your project.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>1. Fresh Wall Painting Charges</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '1rem' }}>Best for new walls requiring putty, primer, and double top coats.</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹18 – ₹35 / sq ft</div>
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Includes 2 coats of putty, 1 coat of primer, 2 coats of paint.</span>
            </div>
            
            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>2. Wall Repainting Charges</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '1rem' }}>Ideal for touch-ups or colour changes on walls in good condition.</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹12 – ₹24 / sq ft</div>
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Includes minor sanding, primer patch, and 2 coats of top-tier paint.</span>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>3. Texture & Accent Wall Painting</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '1rem' }}>Customized designs, metallic shades, or premium patterns.</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹80 – ₹200 / sq ft</div>
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Price varies depending on material and pattern complexity.</span>
            </div>
          </div>
          
          <div style={{ marginTop: '2.5rem', padding: '1.5rem', borderRadius: '8px', border: '1px dashed rgba(255, 255, 255, 0.2)', textAlign: 'center', fontSize: '0.95rem' }}>
            💡 <strong>Pro Tip:</strong> Exterior house painting charges typically range from <strong>₹15 to ₹40 per sq ft</strong>, including scaffolding, high-pressure cleaning, and weather-proof coats.
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section style={{ backgroundColor: 'rgba(30, 41, 59, 0.3)', padding: '6rem 0', marginBottom: '6rem' }}>
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
                    <strong>Dust-Free Execution:</strong> Our pros use modern tools and techniques to ensure a clean, hassle-free painting experience.
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
                    <strong>Premium Materials:</strong> We use top-tier paint brands and genuine products for a lasting and safe finish.
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div className="glass" style={{ padding: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Get a Free Color Consultation</h3>
                <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
                  Not sure which shade to choose? Connect with our experts for professional advice on colors and finishes.
                </p>
                <Link href="/find-a-professional?category=Painter" className="btn btn-primary" style={{ width: '100%' }}>
                  View All Painters
                </Link>
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
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              Typically, a full 2BHK interior painting project takes between 4 to 7 days, depending on the complexity and the number of coats required.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Do I need to move the furniture myself?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              Our painters will assist in moving and covering your furniture with plastic sheets to protect them from paint splatters and dust.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Can you match a specific color I saw online?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              Yes! Our professionals use advanced color-matching tools and can match almost any shade from major paint manufacturers.
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
