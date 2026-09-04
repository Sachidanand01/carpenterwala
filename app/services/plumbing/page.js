import Link from 'next/link';
import MagneticCTA from "@/components/MagneticCTA";
import Breadcrumbs from '@/components/Breadcrumbs';
import AdSenseContainer from '@/components/AdSenseContainer';
import DripCalculator from '@/components/DripCalculator';

export const metadata = {
  title: 'Professional Plumber Services & Leak Repair | CarpenterWala',
  description: 'Hire verified local plumbers in India for pipe leakage repair, bathroom sanitary fittings, and drain unblocking. View standard rate cards and book online.',
  keywords: [
    'plumbing services india',
    'plumber near me',
    'emergency plumber near me',
    'leak repair plumber',
    'bathroom sanitary fitting',
    'drain unclogging service',
    'plumber repair services',
    'Plumber Services in Bangalore',
    'Plumber in Mumbai',
    'Best Plumber in Delhi'
  ],
  alternates: {
    canonical: 'https://carpenterwala.com/services/plumbing',
  },
};

export default function PlumbingPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://carpenterwala.com/services/plumbing#service",
        "name": "Professional Plumbing & Leak Repair Services in India",
        "serviceType": "Plumbing",
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
          "name": "Plumbing Services Catalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Leak Detection & Pipe Repair"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Bathroom & Sanitary Fixture Installation"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Water Tank Deep Cleaning (500L-1000L)"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Kitchen Sink Drain Unclogging"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Toilet Flush Tank & Cistern Repair"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Geyser Inlet Connection & Safety Valve Installation"
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://carpenterwala.com/services/plumbing#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does it cost to fix a leaking tap?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Standard tap and faucet repairs range between ₹149 to ₹299 for washer replacement or cartridge tightening. Complete faucet replacement labour is ₹199 to ₹349."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide a warranty on plumbing repairs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most of our verified plumbers provide a 30-day warranty on their workmanship and leak seals."
            }
          },
          {
            "@type": "Question",
            "name": "What should I do if a pipe bursts at night?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "First, immediately turn off your home's main water inlet valve located near the meter or overhead tank. Then, request an emergency plumber through Carpenterwala for quick dispatch."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between CPVC and UPVC pipes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CPVC (Chlorinated Polyvinyl Chloride) is engineered to withstand both hot and cold pressurized water (ideal for geyser lines). UPVC is designed strictly for cold potable water distribution."
            }
          },
          {
            "@type": "Question",
            "name": "How do plumbers clear deep drainage blocks in apartment lines?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our professionals utilize mechanical drain snakes and high-pressure chemical-safe cleaning to clear grease buildup, hair clogs, and foreign objects without damaging PVC waste pipes."
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
          { name: "Plumbing", url: "/services/plumbing" }
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
          backgroundImage: 'url("/images/plumbing-hero.jpg")',
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
              Expert <span className="text-gradient">Plumber Services</span> Across India
            </h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '680px', margin: '0 auto 2rem' }}>
              Fast, reliable, and verified plumber repair services. From emergency pipe bursts to full bathroom sanitary installations, get prompt doorstep assistance.
            </p>
            <MagneticCTA>
              <Link href="/find-a-professional?category=Plumber" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                Find a Plumber Nearby
              </Link>
            </MagneticCTA>
          </div>
        </div>
      </section>

      {/* Overview Section (Citable Answer Block for AI SEO) */}
      <section className="container animate-fade-in" style={{ marginBottom: '4rem', maxWidth: '850px', textAlign: 'center', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>What are Professional Plumbing Services?</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.85 }}>
          Professional plumbing services provide prompt diagnostics and long-lasting repairs for water leaks, blocked drain lines, faucet replacements, sanitary commode installations, and water heater piping. Booking verified plumbers ensures the use of ISI-marked CPVC/UPVC fittings, correct slope alignments, and leak-free guarantees for residential apartments and commercial buildings across India.
        </p>
      </section>

      {/* Services Grid */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Comprehensive Plumbing Solutions</h2>
          <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
            Our verified plumbers handle everything from minor drips to whole-house pipeline overhauls.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💧</div>
            <h3 style={{ marginBottom: '1rem' }}>Leak Detection & Pipe Repair</h3>
            <p style={{ opacity: 0.8 }}>Locate and fix concealed pipeline leaks inside walls and ceilings. Replace rusted GI joints with durable CPVC hot and cold water pipes.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚿</div>
            <h3 style={{ marginBottom: '1rem' }}>Sanitary Ware & Tap Fitting</h3>
            <p style={{ opacity: 0.8 }}>Precision installation of bathroom diverters, pillar taps, vanity washbasins, wall-hung commodes, and concealed flush tanks (Jaquar, Kohler, Hindware).</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚽</div>
            <h3 style={{ marginBottom: '1rem' }}>Drain Unclogging & Machine Cleaning</h3>
            <p style={{ opacity: 0.8 }}>Heavy-duty mechanical snake unclogging for kitchen sinks, bathroom floor traps, and main apartment gully traps without damaging tiles.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔥</div>
            <h3 style={{ marginBottom: '1rem' }}>Water Heater & Geyser Piping</h3>
            <p style={{ opacity: 0.8 }}>Safe inlet/outlet piping connections, pressure relief valve setup, and anti-scald mixing valves for storage and instant geysers.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛢️</div>
            <h3 style={{ marginBottom: '1rem' }}>Water Tank Deep Cleaning</h3>
            <p style={{ opacity: 0.8 }}>Multi-stage mechanized cleaning and UV disinfection for overhead Sintex tanks and underground sumps to ensure 100% hygienic water.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛠️</div>
            <h3 style={{ marginBottom: '1rem' }}>Motor & Pressure Pump Setup</h3>
            <p style={{ opacity: 0.8 }}>Installation and wiring of automatic water level controllers, self-priming booster pumps, and submersible motors for uninterrupted pressure.</p>
          </div>
        </div>
      </section>

      {/* Standard Plumbing Labour Rate Card in India */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              Standard Plumbing Labour Rate Card in India
            </h2>
            <p style={{ opacity: 0.85, maxWidth: '720px', margin: '0 auto' }}>
              Benchmark market labour charges for standard home plumbing repairs and fixture installations across Indian metropolitan cities.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--primary)', color: 'var(--primary)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Plumbing Service Task</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Estimated Time</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Estimated Labour Cost (INR)</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Work Scope Details</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.95rem' }}>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Tap / Faucet Replacement</td>
                  <td style={{ padding: '1rem 1.25rem' }}>30 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹149 – ₹299</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Removal of old tap, teflon tape wrapping, and leak testing.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Washbasin / Sink Waste Pipe Fix</td>
                  <td style={{ padding: '1rem 1.25rem' }}>45 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹249 – ₹449</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Coupling replacement, bottle trap cleaning, and seal silicone.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Flush Tank / Cistern Repair</td>
                  <td style={{ padding: '1rem 1.25rem' }}>45 - 60 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹349 – ₹699</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Internal ball valve, syphon washer, and flush button alignment.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Drain Unclogging (Sink / Trap)</td>
                  <td style={{ padding: '1rem 1.25rem' }}>45 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹399 – ₹799</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Machine spiral wire snake cleaning to remove stubborn hair/grease clogs.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(194, 65, 12, 0.12)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Water Geyser Connection</td>
                  <td style={{ padding: '1rem 1.25rem' }}>45 mins</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹299 – ₹549</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>Inlet/outlet braided hose connection and pressure valve test.</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Water Tank Cleaning (500L-1000L)</td>
                  <td style={{ padding: '1rem 1.25rem' }}>1.5 - 2 hours</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>₹699 – ₹1,299</td>
                  <td style={{ padding: '1rem 1.25rem', opacity: 0.85 }}>High-pressure de-sludging, antibacterial scrub, and UV sanitization.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Indian Drip Calculator & Water Loss Overview */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            How Much Water and Money Does a Leaking Tap Waste in India?
          </h2>
          <p style={{ opacity: 0.9, fontSize: '1.05rem' }}>
            In Indian households across Bangalore, Mumbai, and major metros, a single leaking tap dripping at a rate of 30 drops per minute wastes over <strong>10.8 Liters of water daily</strong>, translating to more than <strong>324 Liters of lost water every month</strong>. When calculated against private water tanker supply rates (~₹900 per 5,000L) or municipal water utility bills, a slow leak can quietly inflate your monthly household utility expenses by ₹60 to ₹300 per tap. Beyond financial loss, unchecked tap dripping damages sink seals, rusts valve cartridges, and leads to wall seepage inside kitchens and bathrooms. Fixing a leaking faucet or toilet flush valve early prevents structural dampness and conserves precious municipal water. Use Carpenterwala's interactive Water Wastage Calculator below to estimate your exact water loss and financial savings.
          </p>
        </div>
      </section>

      {/* Indian Drip Calculator Section */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <DripCalculator />
      </section>

      {/* Piping Standards Guide */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem', color: 'var(--primary)', textAlign: 'center' }}>
            Plumbing Piping Guide: CPVC vs UPVC vs SWR PVC
          </h2>
          <p style={{ opacity: 0.85, lineHeight: '1.8', maxWidth: '780px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
            Using the wrong pipe type can cause joint failure under pressure or hot water melting. Here is the Indian standard guideline:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>CPVC Pipes (SDR 11 / SDR 13.5)</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, marginBottom: '0.75rem' }}>
                Handles water temperatures up to 93°C. Non-corrosive and pressure-rated for geysers, showers, and main internal supply.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>Application: Hot & Cold Water Lines</span>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>UPVC Pipes (Schedule 40 / 80)</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, marginBottom: '0.75rem' }}>
                High tensile strength and UV resistant. Ideal for outdoor down-take water lines from overhead tanks to bathroom inlets.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>Application: Cold Water Supply & Outdoor Mains</span>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(194, 65, 12, 0.15)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>SWR PVC Drainage Pipes</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, marginBottom: '0.75rem' }}>
                Soil, Waste, and Rainwater ring-fit pipes with smooth inner walls to prevent debris clogging and sewer odor leakage.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>Application: Drainage, Sinks & Toilet Waste</span>
            </div>
          </div>
        </div>
      </section>

      {/* Serving Major Cities Across India */}
      <section style={{ backgroundColor: 'rgba(250, 248, 245, 1)', padding: '5rem 0', marginBottom: '6rem' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', textAlign: 'center' }}>Serving Major Cities Across India</h2>
          <p style={{ opacity: 0.8, textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Book emergency and scheduled plumbing technicians across major Indian metros with transparent pricing.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Bangalore</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Verified <strong>Plumber Services in Bangalore</strong> covering Koramangala, Indiranagar, HSR Layout, Whitefield, and Bellandur.
              </p>
              <Link href="/find-a-professional?category=Plumber&location=Bangalore" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Plumbers in Bangalore →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Mumbai</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Fast emergency <strong>Plumber in Mumbai</strong> for high-rise bathroom seepage, pipe burst repair, and flush valve replacements.
              </p>
              <Link href="/find-a-professional?category=Plumber&location=Mumbai" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Plumbers in Mumbai →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Delhi NCR</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Hire certified <strong>Plumbers in Delhi NCR</strong> for booster pump fittings, geyser installation, and drain unclogging in Gurgaon & Noida.
              </p>
              <Link href="/find-a-professional?category=Plumber&location=Delhi" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Plumbers in Delhi →
              </Link>
            </div>

            <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📍 Hyderabad</h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Experienced plumbers in Hyderabad for water tank cleaning and sanitary fittings across Madhapur, Hitech City, and Banjara Hills.
              </p>
              <Link href="/find-a-professional?category=Plumber&location=Hyderabad" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                Find Plumbers in Hyderabad →
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
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose <span className="text-gradient">Carpenterwala</span> Plumbers?</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
                Plumbing issues can be stressful. We ensure you get the best professionals who value quality, responsiveness, and transparency.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Emergency Support:</strong> Our network responds promptly to urgent pipe leaks, toilet overflows, and motor breakdowns.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Transparent Pricing:</strong> Clear, upfront estimates based on the scope of work without middleman markups.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Genuine ISI Fittings:</strong> We only install certified fittings from reputable manufacturers (Astral, Supreme, Jaquar).
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div className="glass" style={{ padding: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Facing a Plumbing Emergency?</h3>
                <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
                  Do not let a small pipe leak turn into major structural damage. Connect with a verified plumber near you right now.
                </p>
                <MagneticCTA style={{ width: '100%' }}>
                  <Link href="/find-a-professional?category=Plumber" className="btn btn-primary" style={{ width: '100%' }}>
                    View Available Plumbers
                  </Link>
                </MagneticCTA>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Snippet */}
      <section className="container" style={{ marginBottom: '8rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center' }}>Plumbing FAQs</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>How much does it cost to fix a leaking tap?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Standard tap and faucet repairs range between ₹149 to ₹299 for washer replacement or cartridge tightening. Complete faucet replacement labour is ₹199 to ₹349.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Do you provide a warranty on plumbing repairs?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Most of our verified plumbers provide a 30-day warranty on their workmanship and leak seals.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>What should I do if a pipe bursts at night?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              First, immediately turn off your home's main water inlet valve located near the meter or overhead tank. Then, request an emergency plumber through Carpenterwala for quick dispatch.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>What is the difference between CPVC and UPVC pipes?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              CPVC (Chlorinated Polyvinyl Chloride) is engineered to withstand both hot and cold pressurized water (ideal for geyser lines). UPVC is designed strictly for cold potable water distribution.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>How do plumbers clear deep drainage blocks in apartment lines?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.85, lineHeight: '1.7' }}>
              Our professionals utilize mechanical drain snakes and high-pressure chemical-safe cleaning to clear grease buildup, hair clogs, and foreign objects without damaging PVC waste pipes.
            </div>
          </details>
        </div>
      </section>

      {/* Bottom AdSense Banner */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <AdSenseContainer
          slot="7890123456"
          format="auto"
          responsive="true"
          style={{ minHeight: '250px' }}
        />
      </section>
    </div>
  );
}
