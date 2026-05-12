import Link from 'next/link';
import ColorVisualizer from '@/components/ColorVisualizer';

export const metadata = {
  title: 'Professional Painting Services | Carpenterwala',
  description: 'Transform your home with expert interior and exterior painting services in Bangalore. Verified professional painters for a flawless finish.',
};

export default function PaintingPage() {
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
            <h3 style={{ marginBottom: '1rem' }}>Interior Wall Painting</h3>
            <p style={{ opacity: 0.8 }}>Transform your rooms with precision painting. We handle everything from surface preparation to the final coat, ensuring smooth, vibrant walls.</p>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ marginBottom: '1rem' }}>Exterior House Painting</h3>
            <p style={{ opacity: 0.8 }}>Protect your home from the elements with high-quality exterior paints and weather-resistant coatings that last for years.</p>
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
    </div>
  );
}
