import Link from 'next/link';

export const metadata = {
  title: 'Professional Electrical Services | Carpenterwala',
  description: 'Certified electricians for your home and office in Bangalore. From wiring repairs to smart home installations, we ensure safety and quality.',
};

export default function ElectricalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Electrical",
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
      "name": "Electrical Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Wiring & Rewiring"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Fixture Installation"
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
        "name": "Why are my lights flickering frequently?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Flickering can be caused by loose wiring, voltage fluctuations, or an overloaded circuit. It's best to have an electrician check it immediately to prevent short circuits."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe to use high-power appliances on normal sockets?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, appliances like ACs, Geysers, and Microwaves should be used with 15A/16A power sockets and dedicated MCBs to prevent overheating of wires."
        }
      }
    ]
  };

  return (
    <div className="animate-fade-in">
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
          backgroundImage: 'url("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop")',
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
            Expert <span className="text-gradient">Electrical</span> Services
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2rem', opacity: 0.9 }}>
            Safety-first electrical solutions for your home. Our certified electricians handle everything from minor repairs to complete rewiring.
          </p>
          <Link href="/find-a-professional?category=Electrician" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Find an Electrician Nearby
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Electrical Expertise</h2>
          <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
            We connect you with licensed professionals specialized in modern electrical systems and safety standards.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ marginBottom: '1rem' }}>Wiring & Rewiring</h3>
            <p style={{ opacity: 0.8 }}>Complete house wiring for new constructions or safe rewiring of old homes to handle modern appliance loads and prevent short circuits.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
            <h3 style={{ marginBottom: '1rem' }}>Lighting & Fixtures</h3>
            <p style={{ opacity: 0.8 }}>Installation of decorative lights, chandeliers, LED strips, and outdoor lighting. We ensure perfect placement and secure mounting.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔌</div>
            <h3 style={{ marginBottom: '1rem' }}>Socket & Switch Repairs</h3>
            <p style={{ opacity: 0.8 }}>Fixing burnt sockets, loose switches, or upgrading to modern modular switchboards with surge protection.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📟</div>
            <h3 style={{ marginBottom: '1rem' }}>Appliance Installation</h3>
            <p style={{ opacity: 0.8 }}>Safe installation of heavy appliances like ACs, geysers, ovens, and chimneys with appropriate MCBs and earthing.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
            <h3 style={{ marginBottom: '1rem' }}>Safety Inspections</h3>
            <p style={{ opacity: 0.8 }}>Thorough checking of earthing, MCBs, and wiring health to protect your family and expensive electronics from voltage fluctuations.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ marginBottom: '1rem' }}>Smart Home Setup</h3>
            <p style={{ opacity: 0.8 }}>Installation of smart switches, video doorbells, and automated lighting systems for a truly modern living experience.</p>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section style={{ backgroundColor: 'rgba(30, 41, 59, 0.3)', padding: '6rem 0', marginBottom: '6rem' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose <span className="text-gradient">Carpenterwala</span> Electricians?</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
                Electricity is not something to take lightly. We ensure you get the most qualified professionals who prioritize your safety.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Licensed Professionals:</strong> All our electricians are certified and have years of experience handling complex systems.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Safety First Approach:</strong> We follow strict protocols including proper earthing checks and using the right gauge wires.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Emergency Troubleshooting:</strong> Quick response for power outages, sparking, or burning smells in your electrical system.
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div className="glass" style={{ padding: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Need an Electrical Safety Audit?</h3>
                <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
                  Protect your home from potential fire hazards. Our experts can perform a comprehensive check of your entire electrical system.
                </p>
                <Link href="/find-a-professional?category=Electrician" className="btn btn-primary" style={{ width: '100%' }}>
                  Book an Electrician Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Snippet */}
      <section className="container" style={{ marginBottom: '8rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center' }}>Electrical FAQs</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Why are my lights flickering frequently?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              Flickering can be caused by loose wiring, voltage fluctuations, or an overloaded circuit. It's best to have an electrician check it immediately to prevent short circuits.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Is it safe to use high-power appliances on normal sockets?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              No, appliances like ACs, Geysers, and Microwaves should be used with 15A/16A power sockets and dedicated MCBs to prevent overheating of wires.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>How often should I check my home's earthing?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              We recommend an earthing check every 2-3 years, especially before the monsoon season, to ensure proper protection against electrical shocks.
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
