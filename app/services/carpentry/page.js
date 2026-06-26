import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata = {
  title: 'Professional Carpentry Services | Find Trusted Carpenters',
  description: 'Looking for verified carpenters in India? Find trusted local carpenters near me for furniture repair, home renovation, custom carpentry, and office fit-out.',
  keywords: [
    'how to find trusted carpenter', 
    'trusted carpenter near me', 
    'verified carpenter india', 
    'hire carpenter for office fit-out', 
    'office carpenter India', 
    'commercial carpentry work',
    'Carpenter Services in Bangalore',
    'Carpenter in Mumbai',
    'Best Carpenter in Delhi'
  ],
  alternates: {
    canonical: 'https://carpenterwala.com/services/carpentry',
  },
};

export default function CarpentryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Carpentry",
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
      "name": "Carpentry Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Furniture Repair"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Carpentry"
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
        "name": "How do I get a quote for my carpentry work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can browse carpenter profiles, view their past work, and contact them directly through the platform to get an initial estimate."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide materials or should I buy them?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most of our professionals can either bring the necessary materials or work with materials you provide."
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
          { name: "Carpentry", url: "/services/carpentry" }
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
          backgroundImage: 'url("/images/carpentry-hero.png")',
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
            Expert <span className="text-gradient">Carpentry</span> Services
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2rem', opacity: 0.9 }}>
            From intricate furniture restoration to modern home fittings, our verified carpenters deliver craftsmanship you can trust.
          </p>
          <Link href="/find-a-professional?category=Carpenter" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Find a Carpenter Nearby
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Carpentry Expertise</h2>
          <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
            We connect you with professionals who specialize in various woodworking and home improvement tasks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🪑</div>
            <h3 style={{ marginBottom: '1rem' }}>Furniture Repair & Restoration</h3>
            <p style={{ opacity: 0.8 }}>Fixing wobbly chairs, broken table legs, or restoring antique pieces to their former glory. Our pros handle all types of wood with care.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔨</div>
            <h3 style={{ marginBottom: '1rem' }}>Custom Furniture Creation</h3>
            <p style={{ opacity: 0.8 }}>Looking for a bespoke wardrobe or a custom study desk? Get custom-made furniture designed exactly for your space and style.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚪</div>
            <h3 style={{ marginBottom: '1rem' }}>Doors & Windows</h3>
            <p style={{ opacity: 0.8 }}>Installation and repair of wooden doors, window frames, hinges, and locks. Ensuring security and smooth operation for your home.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📐</div>
            <h3 style={{ marginBottom: '1rem' }}>Modular Kitchen & Cabinets</h3>
            <p style={{ opacity: 0.8 }}>Expert assembly and repair of modular kitchen units, bathroom cabinets, and office storage solutions.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛠️</div>
            <h3 style={{ marginBottom: '1rem' }}>General Woodwork</h3>
            <p style={{ opacity: 0.8 }}>From hanging picture frames to installing wall shelves and decorative wooden panels. No job is too small.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ marginBottom: '1rem' }}>Office Fit-Out & Commercial Carpentry</h3>
            <p style={{ opacity: 0.8 }}>Professional commercial carpentry work in India. From customized office partitions to desk installations, we connect you with expert office carpenters.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ marginBottom: '1rem' }}>Full Home Renovations</h3>
            <p style={{ opacity: 0.8 }}>Complete carpentry support for your home renovation projects, working seamlessly with architects and designers.</p>
          </div>
        </div>
      </section>

      {/* Serving Major Cities Across India */}
      <section style={{ backgroundColor: 'rgba(30, 41, 59, 0.2)', padding: '5rem 0', marginBottom: '6rem' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', textAlign: 'center' }}>Serving Major Cities Across India</h2>
          <p style={{ opacity: 0.8, textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Get connected with top-rated carpentry professionals in your local area. We match you with the right experts based on your specific city.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Bangalore</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Hire verified professionals for premium <strong>Carpenter Services in Bangalore</strong>. Covering HSR Layout, Whitefield, Indiranagar, Koramangala, and more.
              </p>
              <Link href="/find-a-professional?category=Carpenter&location=Bangalore" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Carpenters in Bangalore →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Mumbai</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Find a reliable and certified <strong>Carpenter in Mumbai</strong> for custom woodwork, furniture repairs, and apartment interior fittings.
              </p>
              <Link href="/find-a-professional?category=Carpenter&location=Mumbai" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Carpenters in Mumbai →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Delhi NCR</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Connect with the <strong>Best Carpenter in Delhi</strong> for home renovations, custom wardrobes, and commercial office fit-outs.
              </p>
              <Link href="/find-a-professional?category=Carpenter&location=Delhi" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Carpenters in Delhi →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section style={{ backgroundColor: 'rgba(30, 41, 59, 0.3)', padding: '6rem 0', marginBottom: '6rem' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose <span className="text-gradient">Carpenterwala</span> Professionals?</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
                We understand that your home is your sanctuary. That's why we only onboard the most skilled and reliable carpenters in the industry.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Verified Experts:</strong> Every professional undergoes a multi-step background check and skill assessment.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Transparent Pricing:</strong> Get fair estimates without hidden costs. You pay for the quality you receive.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Guaranteed Satisfaction:</strong> Our support team is here to ensure your project is completed to your liking.
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div className="glass" style={{ padding: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Ready to start your project?</h3>
                <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
                  Join thousands of happy homeowners in Bangalore who trust Carpenterwala for their home improvement needs.
                </p>
                <Link href="/find-a-professional?category=Carpenter" className="btn btn-primary" style={{ width: '100%' }}>
                  View All Carpenters
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informational Guide Section: How to Find Trusted Carpenter */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            How to Find a Trusted Carpenter Near You in India
          </h2>
          <p style={{ opacity: 0.9, lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Finding a reliable carpenter in India can be a challenge. With countless local options, it is critical to know how to filter the experts from the amateurs. Whether you need a simple hinge adjustment or full home woodwork, follow these three steps:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>1. Verify Credentials</h4>
              <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Always look for verified carpenters in India. Verify background checks, identity records, and past customer reviews before allowing anyone into your home.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>2. Review Past Portfolios</h4>
              <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Check actual photos of completed carpentry projects rather than generic online catalog designs. Trusted carpenters gladly showcase their real wood craftsmanship.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>3. Request Detailed Quotes</h4>
              <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Ask for itemized billing. Clear expectations on cost of materials vs. labour charges will help prevent surprise expenses or disputes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Snippet */}
      <section className="container" style={{ marginBottom: '8rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center' }}>Carpentry FAQs</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>How do I get a quote for my carpentry work?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              You can browse carpenter profiles, view their past work, and contact them directly through the platform to get an initial estimate. For larger projects, we recommend a site visit.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Do you provide materials or should I buy them?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              Most of our professionals can either bring the necessary materials (added to the bill) or work with materials you provide. This can be discussed during the initial consultation.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Is there a warranty on the carpentry services?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              Many of our verified professionals offer a limited service warranty. Be sure to discuss this with your chosen pro before starting the work.
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
