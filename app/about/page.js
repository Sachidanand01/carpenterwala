'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: "6rem 0", background: "radial-gradient(circle at top left, rgba(245, 158, 11, 0.1), transparent)" }}>
        <div className="container">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "4rem", 
            alignItems: "center" 
          }}>
            <div className="glass" style={{ padding: "1rem", order: 2 }}>
              <div style={{ position: "relative", width: "100%", height: "500px", borderRadius: "12px", overflow: "hidden" }}>
                <Image 
                  src="/images/about-us-hero.png" 
                  alt="Carpenterwala Team" 
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
            <div style={{ order: 1 }}>
              <h1 className="text-gradient" style={{ fontSize: "4rem", marginBottom: "1.5rem", lineHeight: "1.1" }}>
                We're on a Mission to Professionalize Home Services
              </h1>
              <p style={{ fontSize: "1.25rem", opacity: 0.8, marginBottom: "2.5rem", maxWidth: "540px" }}>
                Carpenterwala is Bangalore's most trusted marketplace for skilled handymen. We are building a community where quality meets reliability, and every home gets the professional care it deserves.
              </p>
              <div className="flex gap-4">
                <Link href="/find-a-professional" className="btn btn-primary">Book a Service</Link>
                <Link href="/contact" className="btn btn-secondary">Get in Touch</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section style={{ padding: "5rem 0", backgroundColor: "rgba(15, 23, 42, 0.5)" }}>
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <h2 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Our Story</h2>
            <div className="glass" style={{ padding: "3rem", textAlign: "left" }}>
              <p style={{ fontSize: "1.1rem", opacity: 0.8, marginBottom: "1.5rem", lineHeight: "1.8" }}>
                Born in the heart of Bangalore, Carpenterwala started with a simple observation: finding a reliable, skilled, and professional handyman was far more difficult than it should be. Homeowners faced endless follow-ups, inconsistent pricing, and quality concerns.
              </p>
              <p style={{ fontSize: "1.1rem", opacity: 0.8, marginBottom: "1.5rem", lineHeight: "1.8" }}>
                We saw an opportunity not just to build a booking platform, but to empower local skilled professionals with the tools they need to succeed in a digital world. We focused on Bangalore—a city that values both tradition and innovation—to create a model that puts trust and transparency first.
              </p>
              <p style={{ fontSize: "1.1rem", opacity: 0.8, lineHeight: "1.8" }}>
                Today, Carpenterwala is more than just a website. It's a growing ecosystem of verified carpenters, painters, plumbers, and electricians who take pride in their craft and provide exceptional service to thousands of homes across the city.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
            <div className="glass" style={{ padding: "3rem", borderTop: "4px solid var(--primary)" }}>
              <h3 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "var(--primary)" }}>Our Mission</h3>
              <p style={{ fontSize: "1.1rem", opacity: 0.8, lineHeight: "1.7" }}>
                To empower home service professionals in India by providing them with a platform that rewards skill, integrity, and exceptional customer service, while offering homeowners a seamless and reliable booking experience.
              </p>
            </div>
            <div className="glass" style={{ padding: "3rem", borderTop: "4px solid var(--accent)" }}>
              <h3 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "var(--accent)" }}>Our Vision</h3>
              <p style={{ fontSize: "1.1rem", opacity: 0.8, lineHeight: "1.7" }}>
                To become India's #1 destination for home improvement, recognized for setting the gold standard in service quality, professional verification, and community trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section style={{ padding: "5rem 0", backgroundColor: "rgba(15, 23, 42, 0.5)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Our Core Values</h2>
            <p style={{ opacity: 0.7, fontSize: "1.1rem" }}>The principles that guide everything we do.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            {[
              { title: "Trust First", desc: "We believe trust is the foundation of every service. Every pro is strictly verified." },
              { title: "Quality Always", desc: "We don't settle for 'good enough'. We strive for excellence in every project." },
              { title: "Radical Transparency", desc: "No hidden costs. No surprises. Clear communication from start to finish." },
              { title: "Community Driven", desc: "We grow when our professionals grow and our customers are happy." }
            ].map((value, idx) => (
              <div key={idx} className="glass" style={{ padding: "2rem", textAlign: "center" }}>
                <h4 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "white" }}>{value.title}</h4>
                <p style={{ opacity: 0.7, fontSize: "0.95rem", lineHeight: "1.6" }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div className="glass" style={{ padding: "4rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>Our Impact in Bangalore</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
              {[
                { label: "Homes Improved", value: "5,000+" },
                { label: "Verified Professionals", value: "250+" },
                { label: "Service Categories", value: "12+" },
                { label: "Average Rating", value: "4.8/5" }
              ].map((stat, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "var(--primary)", marginBottom: "0.5rem" }}>{stat.value}</div>
                  <div style={{ fontSize: "1.1rem", opacity: 0.6 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "8rem 0" }}>
        <div className="container">
          <div className="glass" style={{ 
            padding: "4rem", 
            textAlign: "center", 
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(59, 130, 246, 0.2))" 
          }}>
            <h2 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>Be Part of Our Journey</h2>
            <p style={{ fontSize: "1.2rem", opacity: 0.8, marginBottom: "2.5rem", maxWidth: "600px", margin: "0 auto 2.5rem auto" }}>
              Whether you're a homeowner looking for quality work or a professional looking to grow, we'd love to have you on board.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/find-a-professional" className="btn btn-primary" style={{ padding: "1rem 2.5rem" }}>Find a Professional</Link>
              <Link href="/pro/login" className="btn btn-secondary" style={{ padding: "1rem 2.5rem" }}>Join as a Professional</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 992px) {
          section { padding: 4rem 0 !important; }
          h1 { fontSize: 3rem !important; }
          div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          div[style*="order: 2"] { order: 1 !important; }
          div[style*="order: 1"] { order: 2 !important; }
          p { margin: 0 auto 2rem auto !important; }
          div[style*="justify-content: center"] { justify-content: center !important; }
          div[style*="height: 500px"] { height: 350px !important; }
        }
      `}</style>
    </div>
  );
}
