import Link from 'next/link';
import MagneticCTA from "@/components/MagneticCTA";
import Breadcrumbs from '@/components/Breadcrumbs';
import AdSenseContainer from '@/components/AdSenseContainer';

export const metadata = {
  title: 'Professional Carpentry Services Across India | CarpenterWala',
  description: 'Hire verified local carpenters in India for furniture repair, custom wardrobes, and modular kitchen fittings. View standard rate cards and book online.',
  keywords: [
    'carpenter services india',
    'carpenter near me',
    'how to find trusted carpenter',
    'trusted carpenter near me',
    'verified carpenter india',
    'carpenter labour rate per sq ft',
    'hire carpenter for office fit-out',
    'furniture repair near me',
    'modular kitchen carpenter',
    'Carpenter Services in Bangalore',
    'Carpenter in Mumbai',
    'Best Carpenter in Delhi'
  ],
  alternates: {
    canonical: 'https://carpenterwala.com/services/carpentry',
  },
};

export default function CarpentryPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://carpenterwala.com/services/carpentry#service",
        "name": "Professional Carpentry Services in India",
        "serviceType": "Carpentry",
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
          "name": "Carpentry Services Catalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Furniture Repair & Restoration"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Custom Furniture & Wardrobe Assembly"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Modular Kitchen & Cabinet Repair"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Door Lock & Window Latch Installation"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Wood Polishing & PU Coating"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Office Fit-out & Commercial Partition Carpentry"
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://carpenterwala.com/services/carpentry#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I get a quote for my carpentry work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can browse verified carpenter profiles, view their past woodworking portfolios, and contact them directly through the platform to receive an itemized estimate."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide materials or should I buy them?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most of our professionals can either source certified grade materials (BWP ply, laminates, soft-close hardware) or work with materials you provide directly."
            }
          },
          {
            "@type": "Question",
            "name": "How much does a carpenter charge per day in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In Indian metropolitan cities, skilled carpenters typically charge between ₹800 to ₹1,400 per day for labour-only daily wages, depending on city tier and project complexity."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between Commercial MR Ply and BWP Marine Plywood?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "MR (Moisture Resistant) Commercial Plywood is suitable for dry areas like bedroom wardrobes and living TV units. BWP (Boiling Water Proof) Marine Plywood is mandatory for moisture-exposed areas like modular kitchens, vanity cabinets, and balconies."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a warranty on the carpentry services?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, verified professionals on Carpenterwala provide a 30-day service warranty on labour and joinery repairs."
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
          { name: "Carpentry", url: "/services/carpentry" }
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
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.85))',
          zIndex: -1,
        }}></div>

        <div className="container" style={{ textAlign: 'center' }}>
          <div className="hero-backdrop-card animate-fade-in">
            <h1 style={{ fontSize: '3.25rem', marginBottom: '1.25rem', color: '#0F172A' }}>
              Professional <span className="text-gradient">Carpentry</span> Services Across India
            </h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '680px', margin: '0 auto 2rem' }}>
              From bespoke furniture fabrication to quick hinge fixes and modular kitchen setups, connect directly with background-verified local carpenters.
            </p>
            <MagneticCTA>
              <Link href="/find-a-professional?category=Carpenter" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                Find a Carpenter Nearby
              </Link>
            </MagneticCTA>
          </div>
        </div>
      </section>

      {/* Overview Section (Citable Answer Block for AI SEO) */}
      <section className="container animate-fade-in" style={{ marginBottom: '4rem', maxWidth: '850px', textAlign: 'center', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>What are Professional Carpentry Services?</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.85 }}>
          Professional carpentry services encompass precision woodwork fabrication, furniture repair, modular kitchen assembly, and interior fit-outs executed by background-verified craftsmen. Hiring an experienced carpenter ensures seamless joinery, durable material selection (BWP marine ply, anti-termite laminates), and structural safety for residential apartments and commercial properties across India.
        </p>
      </section>

      {/* Services Grid */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Carpentry Expertise</h2>
          <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
            Direct access to specialized woodwork professionals for homes, offices, and commercial spaces.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🪑</div>
            <h3 style={{ marginBottom: '1rem' }}>Furniture Repair & Restoration</h3>
            <p style={{ opacity: 0.8 }}>Fixing wobbly dining tables, sofa frame alignment, broken chair legs, and antique wood restoration using premium adhesives and clamps.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔨</div>
            <h3 style={{ marginBottom: '1rem' }}>Custom Furniture & Wardrobes</h3>
            <p style={{ opacity: 0.8 }}>Bespoke floor-to-ceiling sliding wardrobes, study desks, and TV entertainment units built to your room dimensions and finish preferences.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚪</div>
            <h3 style={{ marginBottom: '1rem' }}>Doors, Locks & Windows</h3>
            <p style={{ opacity: 0.8 }}>Installation of Godrej/Yale digital and mortise locks, door planing to fix floor scraping, hydraulic door closers, and mosquito mesh frames.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📐</div>
            <h3 style={{ marginBottom: '1rem' }}>Modular Kitchen & Cabinets</h3>
            <p style={{ opacity: 0.8 }}>Repair and alignment of soft-close hydraulic channels, tandem boxes, loose cabinet hinges, and kitchen counter modifications.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🪵</div>
            <h3 style={{ marginBottom: '1rem' }}>Wood Polishing & PU Finishing</h3>
            <p style={{ opacity: 0.8 }}>Melamine, PU (Polyurethane), French polish, and natural teak oil finishes for doors, dining sets, and interior wall wooden cladding.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ marginBottom: '1rem' }}>Office Fit-Out & Partitions</h3>
            <p style={{ opacity: 0.8 }}>Commercial glass-wood partitions, conference tables, workstation assembly, and acoustic paneling for modern corporate workspaces.</p>
          </div>
        </div>
      </section>

      {/* Standard Carpenter Labour Rate Card in India */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              Standard Carpenter Labour Rate Card in India
            </h2>
            <p style={{ opacity: '0.85', maxWidth: '720px', margin: '0 auto' }}>
              Transparent market benchmark labour rates for standard home carpentry tasks. Prices reflect standard labour charges across major Indian metropolitan cities.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--primary)', color: 'var(--primary)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Carpentry Service Type</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Estimated Duration</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Estimated Labour Cost (INR)</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Scope of Work</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.95rem' }}>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Door Lock / Handle Fitting</td>
                  <td style={{ padding: '1rem 1.25rem' }}>45 - 60 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹249 – ₹499</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Mortise, cylindrical, or digital lock setup with latch alignment.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Door Planing & Alignment</td>
                  <td style={{ padding: '1rem 1.25rem' }}>30 - 45 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹199 – ₹399</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Bottom edge trimming for smooth floor clearance.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Bed / Wardrobe Assembly</td>
                  <td style={{ padding: '1rem 1.25rem' }}>2 - 3 hours</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹699 – ₹1,799</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Complete flat-pack knockdown furniture assembly (IKEA, Pepperfry, Urban Ladder).</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Modular Kitchen Hinge Repair</td>
                  <td style={{ padding: '1rem 1.25rem' }}>45 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹199 – ₹450 / shutter</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Hydraulic channel adjustment and soft-close hinge fitting.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Custom Wardrobe Fabrication</td>
                  <td style={{ padding: '1rem 1.25rem' }}>Project-based</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹280 – ₹450 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Labour cost for custom plywood carcass, internal drawers, and laminate pasting.</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Full-Day Carpenter Daily Wage</td>
                  <td style={{ padding: '1rem 1.25rem' }}>8 hours</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹900 – ₹1,400 / day</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Dedicated on-site master carpenter for multi-item home repairs.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.7, textAlign: 'center' }}>
            * Note: Material costs (plywood, laminates, screws, adhesives, hinges) are charged additionally based on actual market receipts.
          </p>
        </div>
      </section>

      {/* Plywood & Woodwork Material Guide */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem', color: 'var(--primary)', textAlign: 'center' }}>
            Woodwork Material Guide: Choosing the Right Grade
          </h2>
          <p style={{ opacity: 0.85, lineHeight: '1.8', maxWidth: '780px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
            Selecting the right engineered wood is vital to ensure long-term durability, termite resistance, and zero warping.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>Commercial Plywood (MR Grade)</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, marginBottom: '0.75rem' }}>
                IS 303 specification. Ideal for dry indoor areas including bedroom wardrobes, bookshelves, TV consoles, and wall panelling.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>Best for: Living & Bedroom Interiors</span>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>Marine Plywood (BWP / BWR Grade)</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, marginBottom: '0.75rem' }}>
                IS 710 Boiling Water Proof grade bonded with phenolic resins. Withstands continuous water exposure and high humidity.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>Best for: Modular Kitchens & Vanities</span>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>HDHMR Boards</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, marginBottom: '0.75rem' }}>
                High-Density High-Moisture Resistance engineered boards. Excellent screw-holding capacity, anti-termite, and ideal for router CNC carvings.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>Best for: Jali Partitions & Cabinet Shutters</span>
            </div>
          </div>
        </div>
      </section>

      {/* Serving Major Cities Across India */}
      <section style={{ backgroundColor: 'rgba(250, 248, 245, 1)', padding: '5rem 0', marginBottom: '6rem' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', textAlign: 'center' }}>Serving Major Cities Across India</h2>
          <p style={{ opacity: 0.8, textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Get connected with top-rated carpentry professionals in your local area. We match you with the right experts based on your specific city.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Bangalore</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Hire verified professionals for premium <strong>Carpenter Services in Bangalore</strong>. Covering HSR Layout, Whitefield, Indiranagar, Koramangala, Bellandur, and Electronic City.
              </p>
              <Link href="/find-a-professional?category=Carpenter&location=Bangalore" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Carpenters in Bangalore →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Mumbai</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Find a reliable and certified <strong>Carpenter in Mumbai</strong> for custom woodwork, furniture repairs, and apartment interior fittings across Andheri, Powai, Thane, and Bandra.
              </p>
              <Link href="/find-a-professional?category=Carpenter&location=Mumbai" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Carpenters in Mumbai →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Delhi NCR</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Connect with the <strong>Best Carpenter in Delhi NCR</strong> for home renovations, custom wardrobes, and commercial office fit-outs in Gurgaon, Noida, and South Delhi.
              </p>
              <Link href="/find-a-professional?category=Carpenter&location=Delhi" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Carpenters in Delhi →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Hyderabad</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Book skilled carpenters in Hyderabad for modular kitchen installation, bed assembly, and woodwork in Gachibowli, Madhapur, and Kukatpally.
              </p>
              <Link href="/find-a-professional?category=Carpenter&location=Hyderabad" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Carpenters in Hyderabad →
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
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose <span className="text-gradient">Carpenterwala</span> Professionals?</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
                We understand that your home is your sanctuary. That is why we only onboard the most skilled and reliable carpenters in the industry.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Verified Experts:</strong> Every professional undergoes a multi-step background check, identity verification, and skill audit.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Transparent Pricing:</strong> Clear rate card benchmarks without middleman commissions or surprise bills.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Guaranteed Craftsmanship:</strong> 30-day service warranty on labour to ensure long-lasting woodwork satisfaction.
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div className="glass" style={{ padding: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Ready to start your woodwork project?</h3>
                <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
                  Join thousands of satisfied homeowners across India who trust Carpenterwala for custom furniture, repairs, and fit-outs.
                </p>
                <MagneticCTA style={{ width: '100%' }}>
                  <Link href="/find-a-professional?category=Carpenter" className="btn btn-primary" style={{ width: '100%' }}>
                    View All Carpenters
                  </Link>
                </MagneticCTA>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informational Guide Section */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            How to Find a Trusted Carpenter Near You in India
          </h2>
          <p style={{ opacity: 0.9, lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Finding a reliable carpenter in India requires evaluating skill, transparency, and experience. Follow these three steps to hire the right professional:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent)', fontWeight: 'bold' }}>1. Verify Background & Identity</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Always choose verified carpenters with government ID checks and confirmed residential references before scheduling home visits.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent)', fontWeight: 'bold' }}>2. Review Past Portfolios</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Check actual on-site photos of finished wardrobes and modular kitchens rather than stock online catalog designs.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent)', fontWeight: 'bold' }}>3. Request Itemized Rate Cards</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Separate labour costs from hardware and plywood expenses to ensure complete financial clarity.</p>
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
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              You can browse carpenter profiles, view their past woodworking portfolios, and contact them directly through the platform to receive an itemized estimate. For custom modular projects, a brief site inspection is recommended.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Do you provide materials or should I buy them?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Most of our professionals can either source certified grade materials (BWP ply, laminates, soft-close hardware) or work with materials you provide directly.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>How much does a carpenter charge per day in India?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              In Indian metropolitan cities, skilled carpenters typically charge between ₹800 to ₹1,400 per day for labour-only daily wages, depending on city tier and the complexity of the assignment.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>What is the difference between Commercial MR Ply and BWP Marine Plywood?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              MR (Moisture Resistant) Commercial Plywood is suitable for dry areas like bedroom wardrobes and living TV units. BWP (Boiling Water Proof) Marine Plywood is mandatory for moisture-exposed areas like modular kitchens, vanity cabinets, and balconies.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Is there a warranty on the carpentry services?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Yes, verified professionals on Carpenterwala provide a 30-day service warranty on labour and joinery repairs.
            </div>
          </details>
        </div>
      </section>

      {/* Bottom AdSense Banner */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <AdSenseContainer
          slot="4567890123"
          format="auto"
          responsive="true"
          style={{ minHeight: '250px' }}
        />
      </section>
    </div>
  );
}
