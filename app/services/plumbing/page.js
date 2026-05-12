import Link from 'next/link';

export const metadata = {
  title: 'Professional Plumbing Services | Carpenterwala',
  description: 'Fast and reliable plumbing services in Bangalore. From leak repairs to full bathroom installations, our verified plumbers are here to help.',
};

export default function PlumbingPage() {
  return (
    <div className="animate-fade-in">
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
          backgroundImage: 'url("https://images.unsplash.com/photo-1581244276894-8a3fb524cfdc?q=80&w=2070&auto=format&fit=crop")',
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
            Expert <span className="text-gradient">Plumbing</span> Services
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2rem', opacity: 0.9 }}>
            Fast, reliable, and verified plumbing solutions for your home. From emergency leaks to new installations, we've got you covered.
          </p>
          <Link href="/find-a-professional?category=Plumber" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Find a Plumber Nearby
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Comprehensive Plumbing Solutions</h2>
          <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
            Our verified plumbers are equipped to handle everything from minor drips to major pipeline overhauls.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💧</div>
            <h3 style={{ marginBottom: '1rem' }}>Leak Detection & Repair</h3>
            <p style={{ opacity: 0.8 }}>Protect your home from water damage. We use advanced tools to find hidden leaks in walls, floors, and ceilings and fix them permanently.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚿</div>
            <h3 style={{ marginBottom: '1rem' }}>Fixture Installation</h3>
            <p style={{ opacity: 0.8 }}>Expert installation of faucets, showers, toilets, and sinks. We ensure everything is perfectly aligned and 100% leak-proof.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛁</div>
            <h3 style={{ marginBottom: '1rem' }}>Bathroom Renovations</h3>
            <p style={{ opacity: 0.8 }}>Complete plumbing support for bathroom upgrades, including pipe rerouting, vanity installation, and premium fixture setup.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔥</div>
            <h3 style={{ marginBottom: '1rem' }}>Water Heater Services</h3>
            <p style={{ opacity: 0.8 }}>Installation and maintenance of solar, gas, and electric water heaters. Get hot water whenever you need it.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛢️</div>
            <h3 style={{ marginBottom: '1rem' }}>Tank Cleaning & Repair</h3>
            <p style={{ opacity: 0.8 }}>Professional cleaning of overhead and underground water tanks to ensure your family gets clean, safe water.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛠️</div>
            <h3 style={{ marginBottom: '1rem' }}>Pipe Rerouting</h3>
            <p style={{ opacity: 0.8 }}>Upgrading old, corroded pipes or rerouting plumbing lines for kitchen or bathroom extensions.</p>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section style={{ backgroundColor: 'rgba(30, 41, 59, 0.3)', padding: '6rem 0', marginBottom: '6rem' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose <span className="text-gradient">Carpenterwala</span> Plumbers?</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
                Plumbing issues can be stressful. We ensure you get the best professionals who value quality and transparency.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Emergency Support:</strong> Our network includes professionals who can respond quickly to urgent leaks and bursts.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Transparent Pricing:</strong> Clear, upfront estimates based on the scope of work. No hidden "emergency fees".
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Quality Spare Parts:</strong> We only use genuine, ISI-marked fittings and pipes for all repairs and installations.
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div className="glass" style={{ padding: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Facing a Plumbing Emergency?</h3>
                <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
                  Don't let a small leak turn into a big disaster. Connect with a verified plumber in your area right now.
                </p>
                <Link href="/find-a-professional?category=Plumber" className="btn btn-primary" style={{ width: '100%' }}>
                  View Available Plumbers
                </Link>
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
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              Minor repairs like tap leaks usually have a base service fee. The final cost depends on whether a simple washer replacement is needed or the entire faucet needs to be changed.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>Do you provide a warranty on plumbing repairs?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              Most of our verified plumbers provide a 15-30 day warranty on their labor. The parts used carry the manufacturer's warranty.
            </div>
          </details>
          <details style={{ cursor: 'pointer' }} className="glass">
            <summary style={{ padding: '1.5rem', fontWeight: '600' }}>What should I do if a pipe bursts at night?</summary>
            <div style={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              First, locate and turn off your home's main water valve. Then, use our platform to find an available plumber for emergency repairs.
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
