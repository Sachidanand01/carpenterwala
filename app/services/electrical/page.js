import Link from 'next/link';
import MagneticCTA from "@/components/MagneticCTA";
import Breadcrumbs from '@/components/Breadcrumbs';
import AdSenseContainer from '@/components/AdSenseContainer';
import ElectricityCalculator from '@/components/ElectricityCalculator';

export const metadata = {
  title: 'Verified Electrician Services for Home & Office | CarpenterWala',
  description: 'Book certified electricians in India for fan installation, switchboard repair, MCB tripping issues, and home rewiring. Safe, verified doorstep assistance.',
  keywords: [
    'electrician services india',
    'electrician near me',
    'hire electrician India',
    'house wiring electrician',
    'MCB tripping repair',
    'switchboard repair near me',
    'electrical repairs india',
    'Electrician in Bangalore',
    'Electrician in Mumbai',
    'Best Electrician in Delhi'
  ],
  alternates: {
    canonical: 'https://carpenterwala.com/services/electrical',
  },
};

export default function ElectricalPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://carpenterwala.com/services/electrical#service",
        "name": "Professional Electrical Repair & Installation Services in India",
        "serviceType": "Electrical",
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
          "name": "Electrical Services Catalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "House Wiring & Rewiring"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Switchboard & Power Socket Installation"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "MCB Trip Diagnostics & Fuse Repair"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Ceiling Fan & Light Fixture Fitting"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Inverter & Battery Wiring Setup"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Smart Home Automation & Relay Fitting"
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://carpenterwala.com/services/electrical#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why are my lights flickering frequently?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Flickering lights are typically caused by loose neutral connections, voltage fluctuations from the transformer, or an overloaded sub-circuit. A licensed electrician should inspect the distribution board to avoid short circuits."
            }
          },
          {
            "@type": "Question",
            "name": "Is it safe to use high-power appliances on normal sockets?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, appliances exceeding 1,000 Watts (ACs, geysers, microwaves, EV chargers) must be powered via dedicated 16A/20A sockets with separate 2.5 sq mm or 4.0 sq mm copper wiring and individual MCBs."
            }
          },
          {
            "@type": "Question",
            "name": "How often should I check my home's earthing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We recommend an earthing and insulation resistance check every 2 to 3 years, particularly before the monsoon season, to protect sensitive electronics and prevent accidental shocks."
            }
          },
          {
            "@type": "Question",
            "name": "What is the standard electrician charge per point in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In Indian metropolitan areas, light and fan point wiring labour ranges from ₹180 to ₹350 per point for conduit concealed wiring, and ₹120 to ₹220 per point for surface PVC casing."
            }
          },
          {
            "@type": "Question",
            "name": "How do I prevent my MCB from repeatedly tripping?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Frequent MCB tripping indicates either a line short circuit, phase-neutral ground fault, or connected appliance load exceeding the breaker rating (e.g. 10A breaker running a 16A geyser). An electrician will test each sub-loop with a multimeter."
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
          { name: "Electrical", url: "/services/electrical" }
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
          backgroundImage: 'url("/images/electrical-hero.jpg")',
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
              Verified <span className="text-gradient">Electrician Services</span> Across India
            </h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '680px', margin: '0 auto 2rem' }}>
              Safe, compliant, and certified electrical work. From emergency short circuit diagnostics to complete house rewiring and smart automation.
            </p>
            <MagneticCTA>
              <Link href="/find-a-professional?category=Electrician" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                Find an Electrician Nearby
              </Link>
            </MagneticCTA>
          </div>
        </div>
      </section>

      {/* Overview Section (Citable Answer Block for AI SEO) */}
      <section className="container animate-fade-in" style={{ marginBottom: '4rem', maxWidth: '850px', textAlign: 'center', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>What are Professional Electrician Services?</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.85 }}>
          Professional electrician services encompass certified residential and commercial wiring, distribution board (DB) load balancing, MCB and RCCB safety device installation, heavy appliance cabling, and energy-efficient lighting setups. Booking licensed electricians ensures full compliance with Indian Electricity (IE) standards, preventing fire hazards, voltage surges, and power leakage across properties in India.
        </p>
      </section>

      {/* Services Grid */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Electrical Expertise</h2>
          <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
            Direct connection with certified electricians specialized in modern electrical systems and fire-safety standards.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ marginBottom: '1rem' }}>House Wiring & Concealed Conduit</h3>
            <p style={{ opacity: 0.8 }}>New home electrical wiring, full rewiring of older apartments with FRLS fire-retardant copper conductors, and PVC conduit channel cutting.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
            <h3 style={{ marginBottom: '1rem' }}>Fan, Light & Chandelier Fitting</h3>
            <p style={{ opacity: 0.8 }}>Secure ceiling fan assembly, BLDC remote fan installation, false ceiling COB spotlights, LED strip profiles, and heavy chandelier mounting.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔌</div>
            <h3 style={{ marginBottom: '1rem' }}>Switchboard & Power Points</h3>
            <p style={{ opacity: 0.8 }}>Modular switchboard replacement (Anchor, Legrand, Schneider), dedicated 16A/25A AC & Geyser points, and USB fast-charging wall sockets.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
            <h3 style={{ marginBottom: '1rem' }}>MCB, RCCB & Short Circuit Fix</h3>
            <p style={{ opacity: 0.8 }}>Diagnostics for frequent fuse blowouts, tripping main breakers, phase imbalance, and Residual Current Circuit Breaker (RCCB) shock protection.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔋</div>
            <h3 style={{ marginBottom: '1rem' }}>Inverter & Battery Wiring</h3>
            <p style={{ opacity: 0.8 }}>Inverter line separation, double-battery trolley setup, bypass switch configuration, and UPS power line stabilization for home offices.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ marginBottom: '1rem' }}>Smart Home Automation Setup</h3>
            <p style={{ opacity: 0.8 }}>Integration of WiFi smart touch switches, automated sensor nightlights, smart doorbells, and voice-activated lighting modules.</p>
          </div>
        </div>
      </section>

      {/* Standard Electrician Charges & Rate Card in India */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              Standard Electrician Charges & Rate Card in India
            </h2>
            <p style={{ opacity: 0.85, maxWidth: '720px', margin: '0 auto' }}>
              Standard labour benchmarks for common electrical repairs, fixture mounting, and wiring points across Indian cities.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--primary)', color: 'var(--primary)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Electrical Service Type</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Estimated Time</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Estimated Labour Cost (INR)</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Service Scope</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.95rem' }}>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Ceiling Fan Installation</td>
                  <td style={{ padding: '1rem 1.25rem' }}>30 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹149 – ₹299</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Downrod assembly, canopy fixing, blade balancing, and safety hook test.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Switch / Socket Replacement</td>
                  <td style={{ padding: '1rem 1.25rem' }}>20 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹99 – ₹180 / point</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Burnt socket removal, screw terminal tightening, and faceplate fitting.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>MCB / DB Tripping Diagnostic</td>
                  <td style={{ padding: '1rem 1.25rem' }}>45 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹349 – ₹699</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Circuit continuity testing, neutral fault tracing, and faulty breaker swap.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Inverter & Battery Setup</td>
                  <td style={{ padding: '1rem 1.25rem' }}>1 hour</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹499 – ₹999</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Backfeed loop wiring, terminal greasing, and automatic changeover test.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Complete Apartment Rewiring</td>
                  <td style={{ padding: '1rem 1.25rem' }}>Project-based</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹14 – ₹26 / sq ft</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Labour for pulling new circuit wires, load distribution, and earthing pit connection.</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Chandelier / Heavy Light Mounting</td>
                  <td style={{ padding: '1rem 1.25rem' }}>1 - 2 hours</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹499 – ₹1,299</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Ceiling anchor fastener bolting, crystal assembly, and circuit dimmer test.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Electricity Wastage Overview */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            How Does Faulty Wiring & Appliance Standby Power Inflate Electricity Bills in India?
          </h2>
          <p style={{ opacity: 0.9, fontSize: '1.05rem' }}>
            In Indian residences, unoptimized electrical appliances and legacy non-star-rated ceiling fans account for up to <strong>30% of unnecessary power consumption</strong>. For instance, operating an older 75-Watt conventional ceiling fan for 12 hours daily consumes 0.9 kWh per day, whereas an energy-efficient BLDC fan uses only 0.33 kWh, saving nearly <strong>17 kWh per month per fan</strong>. Similarly, vampire standby power drawn by televisions, microwave displays, and plugged-in chargers slowly drains electricity even when switched off at the device level. Overloaded circuits, worn-out insulation, and loose wire terminations also generate electrical resistance and heat, raising monthly electricity utility tariff slab rates. Installing 5-star rated appliances and scheduling regular electrical safety audits prevents voltage spikes and cuts energy bills. Calculate your home appliance power consumption using Carpenterwala's interactive Electricity Calculator below.
          </p>
        </div>
      </section>

      {/* Electricity Wastage Calculator Section */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <ElectricityCalculator />
      </section>

      {/* Wire Gauge & Fire Safety Guide */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem', color: 'var(--primary)', textAlign: 'center' }}>
            Wire Gauge & Electrical Safety Standards
          </h2>
          <p style={{ opacity: 0.85, lineHeight: '1.8', maxWidth: '780px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
            Using under-gauge wires for high-wattage appliances causes wire heating, melting insulation, and electrical fires. Follow these standard guidelines:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>1.0 sq mm to 1.5 sq mm</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, marginBottom: '0.75rem' }}>
                Rated up to 10–14 Amps. Ideal for LED ceiling lights, exhaust fans, chandeliers, and standard 6A electronic device sockets.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>Application: Lighting & 6A Sockets</span>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>2.5 sq mm Copper Wires</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, marginBottom: '0.75rem' }}>
                Rated up to 18–20 Amps. Essential for power sockets powering refrigerators, washing machines, microwaves, and room heaters.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>Application: 16A Kitchen & Utility Outlets</span>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>4.0 sq mm to 6.0 sq mm</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, marginBottom: '0.75rem' }}>
                Rated up to 28–34 Amps. Mandatory for Air Conditioners (1.5T/2.0T), water geysers, induction cooktops, and EV home chargers.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>Application: AC, Geyser & Main Sub-lines</span>
            </div>
          </div>
        </div>
      </section>

      {/* Serving Major Cities Across India */}
      <section style={{ backgroundColor: 'rgba(250, 248, 245, 1)', padding: '5rem 0', marginBottom: '6rem' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', textAlign: 'center' }}>Serving Major Cities Across India</h2>
          <p style={{ opacity: 0.8, textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Connect with background-checked, certified local electricians for residential and commercial repairs.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Bangalore</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Hire certified <strong>Electricians in Bangalore</strong> for home rewiring, fan mounting, and DB fixes in Whitefield, Indiranagar, and HSR Layout.
              </p>
              <Link href="/find-a-professional?category=Electrician&location=Bangalore" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Electricians in Bangalore →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Mumbai</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Emergency <strong>Electrician in Mumbai</strong> for tripping MCBs, geyser power point setup, and apartment electrical safety audits.
              </p>
              <Link href="/find-a-professional?category=Electrician&location=Mumbai" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Electricians in Mumbai →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Delhi NCR</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Top-rated <strong>Electricians in Delhi NCR</strong> for AC power line installation, inverter wiring, and smart home lighting in Gurgaon & Noida.
              </p>
              <Link href="/find-a-professional?category=Electrician&location=Delhi" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Electricians in Delhi →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Hyderabad</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Skilled electricians in Hyderabad for false ceiling spotlight fittings, switchboard updates, and rewiring in Gachibowli & Madhapur.
              </p>
              <Link href="/find-a-professional?category=Electrician&location=Hyderabad" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Electricians in Hyderabad →
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
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose <span className="text-gradient">Carpenterwala</span> Electricians?</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
                Electricity requires rigorous training and strict safety protocols. We ensure you get certified professionals who prioritize your family's safety.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Certified Professionals:</strong> All electricians have verifiable trade experience and background security clearance.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Safety First Approach:</strong> Proper wire load calculation, fire-retardant materials, and earthing checks on every visit.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Transparent Pricing:</strong> Standard point-based and job-based rate cards without commission markups.
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div className="glass" style={{ padding: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Need an Electrical Safety Audit?</h3>
                <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
                  Protect your appliances and home against short circuits. Schedule a comprehensive inspection with a verified electrician today.
                </p>
                <MagneticCTA style={{ width: '100%' }}>
                  <Link href="/find-a-professional?category=Electrician" className="btn btn-primary" style={{ width: '100%' }}>
                    Book an Electrician Now
                  </Link>
                </MagneticCTA>
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
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Flickering lights are typically caused by loose neutral connections, voltage fluctuations from the transformer, or an overloaded sub-circuit. A licensed electrician should inspect the distribution board to avoid short circuits.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Is it safe to use high-power appliances on normal sockets?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              No, appliances exceeding 1,000 Watts (ACs, geysers, microwaves, EV chargers) must be powered via dedicated 16A/20A sockets with separate 2.5 sq mm or 4.0 sq mm copper wiring and individual MCBs.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>How often should I check my home's earthing?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              We recommend an earthing and insulation resistance check every 2 to 3 years, particularly before the monsoon season, to protect sensitive electronics and prevent accidental shocks.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>What is the standard electrician charge per point in India?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              In Indian metropolitan areas, light and fan point wiring labour ranges from ₹180 to ₹350 per point for conduit concealed wiring, and ₹120 to ₹220 per point for surface PVC casing.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>How do I prevent my MCB from repeatedly tripping?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Frequent MCB tripping indicates either a line short circuit, phase-neutral ground fault, or connected appliance load exceeding the breaker rating (e.g. 10A breaker running a 16A geyser). An electrician will test each sub-loop with a multimeter.
            </div>
          </details>
        </div>
      </section>

      {/* Bottom AdSense Banner */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <AdSenseContainer
          slot="6789012345"
          format="auto"
          responsive="true"
          style={{ minHeight: '250px' }}
        />
      </section>
    </div>
  );
}
