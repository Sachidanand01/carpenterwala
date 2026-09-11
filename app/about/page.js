'use client';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="container">
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumbs items={[
              { name: "Home", url: "/" },
              { name: "About Us", url: "/about" }
            ]} />
          </div>

          <div className="about-hero-grid">
            <div className="about-hero-content">
              <h1 className="text-gradient about-hero-title">
                We're on a Mission to Professionalize Home Services
              </h1>
              <p className="about-hero-desc">
                Carpenterwala is Bangalore's most trusted marketplace for skilled handymen. We are building a community where quality meets reliability, and every home gets the professional care it deserves.
              </p>
              <div className="about-btn-group">
                <Link href="/find-a-professional" className="btn btn-primary">Book a Service</Link>
                <Link href="/contact" className="btn btn-secondary">Get in Touch</Link>
              </div>
            </div>

            <div className="about-hero-image-wrap glass">
              <div className="about-hero-image-inner">
                <Image
                  src="/images/about-us-hero.png"
                  alt="Carpenterwala Team"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-section about-section-warm">
        <div className="container">
          <div className="story-container">
            <h2 className="text-gradient section-title">Our Story</h2>
            <div className="glass story-card">
              <p>
                Born in the heart of Bangalore, Carpenterwala started with a simple observation: finding a reliable, skilled, and professional handyman was far more difficult than it should be. Homeowners faced endless follow-ups, inconsistent pricing, and quality concerns.
              </p>
              <p>
                We saw an opportunity not just to build a booking platform, but to empower local skilled professionals with the tools they need to succeed in a digital world. We focused on Bangalore—a city that values both tradition and innovation—to create a model that puts trust and transparency first.
              </p>
              <p style={{ marginBottom: 0 }}>
                Today, Carpenterwala is more than just a website. It's a growing ecosystem of verified carpenters, painters, plumbers, and electricians who take pride in their craft and provide exceptional service to thousands of homes across the city.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-section">
        <div className="container">
          <div className="mission-grid">
            <div className="glass mission-card mission-card-primary">
              <h3 className="mission-title" style={{ color: "var(--primary)" }}>Our Mission</h3>
              <p className="mission-desc">
                To empower home service professionals in India by providing them with a platform that rewards skill, integrity, and exceptional customer service, while offering homeowners a seamless and reliable booking experience.
              </p>
            </div>
            <div className="glass mission-card mission-card-accent">
              <h3 className="mission-title" style={{ color: "var(--accent)" }}>Our Vision</h3>
              <p className="mission-desc">
                To become India's #1 destination for home improvement, recognized for setting the gold standard in service quality, professional verification, and community trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-section about-section-warm">
        <div className="container">
          <div className="section-header">
            <h2 className="text-gradient section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do.</p>
          </div>

          <div className="values-grid">
            {[
              { title: "Trust First", desc: "We believe trust is the foundation of every service. Every pro is strictly verified." },
              { title: "Quality Always", desc: "We don't settle for 'good enough'. We strive for excellence in every project." },
              { title: "Radical Transparency", desc: "No hidden costs. No surprises. Clear communication from start to finish." },
              { title: "Community Driven", desc: "We grow when our professionals grow and our customers are happy." }
            ].map((value, idx) => (
              <div key={idx} className="glass value-card">
                <h4 className="value-title">{value.title}</h4>
                <p className="value-desc">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="about-section">
        <div className="container">
          <div className="glass impact-card">
            <h2 className="section-title" style={{ marginBottom: "2.5rem" }}>Our Impact in Bangalore</h2>
            <div className="impact-grid">
              {[
                { label: "Homes Improved", value: "5,000+" },
                { label: "Verified Professionals", value: "250+" },
                { label: "Service Categories", value: "12+" },
                { label: "Average Rating", value: "4.8/5" }
              ].map((stat, idx) => (
                <div key={idx} className="impact-item">
                  <div className="impact-value">{stat.value}</div>
                  <div className="impact-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section about-cta-section">
        <div className="container">
          <div className="glass cta-card">
            <h2 className="cta-title">Be Part of Our Journey</h2>
            <p className="cta-desc">
              Whether you're a homeowner looking for quality work or a professional looking to grow, we'd love to have you on board.
            </p>
            <div className="cta-btn-group">
              <Link href="/find-a-professional" className="btn btn-primary cta-btn">Find a Professional</Link>
              <Link href="/pro/login" className="btn btn-secondary cta-btn">Join as a Professional</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-hero-section {
          padding: 3.5rem 0 4rem;
          background: radial-gradient(circle at top left, rgba(250, 248, 245, 1), transparent);
        }

        .about-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3.5rem;
          align-items: center;
        }

        .about-hero-content {
          order: 1;
        }

        .about-hero-title {
          font-size: clamp(2rem, 5vw, 3.6rem);
          margin-bottom: 1.25rem;
          line-height: 1.15;
          word-break: break-word;
        }

        .about-hero-desc {
          font-size: clamp(1.05rem, 2.5vw, 1.2rem);
          opacity: 0.85;
          margin-bottom: 2rem;
          line-height: 1.7;
          max-width: 540px;
        }

        .about-btn-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .about-hero-image-wrap {
          order: 2;
          padding: 0.85rem;
          border-radius: 16px;
        }

        .about-hero-image-inner {
          position: relative;
          width: 100%;
          height: 460px;
          border-radius: 12px;
          overflow: hidden;
        }

        .about-section {
          padding: clamp(3.5rem, 6vw, 5rem) 0;
        }

        .about-section-warm {
          background-color: rgba(250, 248, 245, 1);
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          margin-bottom: 1rem;
          text-align: center;
        }

        .section-subtitle {
          opacity: 0.75;
          font-size: 1.05rem;
        }

        .story-container {
          max-width: 820px;
          margin: 0 auto;
        }

        .story-card {
          padding: clamp(1.5rem, 4vw, 3rem);
          text-align: left;
        }

        .story-card p {
          font-size: 1.05rem;
          opacity: 0.88;
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }

        .mission-card {
          padding: clamp(1.5rem, 4vw, 2.75rem);
        }

        .mission-card-primary {
          border-top: 4px solid var(--primary);
        }

        .mission-card-accent {
          border-top: 4px solid var(--accent);
        }

        .mission-title {
          font-size: clamp(1.4rem, 3vw, 1.85rem);
          margin-bottom: 1rem;
        }

        .mission-desc {
          font-size: 1.05rem;
          opacity: 0.85;
          line-height: 1.75;
          margin: 0;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1.5rem;
        }

        .value-card {
          padding: clamp(1.25rem, 3vw, 2rem);
          text-align: center;
        }

        .value-title {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          color: var(--primary);
        }

        .value-desc {
          opacity: 0.75;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        .impact-card {
          padding: clamp(2rem, 5vw, 4rem);
          text-align: center;
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 2rem 1.5rem;
        }

        .impact-item {
          padding: 0.5rem;
        }

        .impact-value {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.4rem;
          line-height: 1.1;
        }

        .impact-label {
          font-size: clamp(0.9rem, 2vw, 1.05rem);
          opacity: 0.7;
        }

        .about-cta-section {
          padding: clamp(3.5rem, 6vw, 6rem) 0;
        }

        .cta-card {
          padding: clamp(2rem, 5vw, 4rem);
          text-align: center;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(59, 130, 246, 0.15));
        }

        .cta-title {
          font-size: clamp(1.85rem, 4.5vw, 2.75rem);
          margin-bottom: 1rem;
        }

        .cta-desc {
          font-size: clamp(1rem, 2.5vw, 1.15rem);
          opacity: 0.85;
          max-width: 580px;
          margin: 0 auto 2rem auto;
          line-height: 1.7;
        }

        .cta-btn-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-btn {
          padding: 0.85rem 2rem;
          font-size: 0.95rem;
        }

        @media (max-width: 992px) {
          .about-hero-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .about-hero-content {
            order: 1;
            text-align: left;
          }

          .about-hero-image-wrap {
            order: 2;
          }

          .about-hero-image-inner {
            height: clamp(260px, 50vw, 380px);
          }

          .mission-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .about-hero-section {
            padding: 2rem 0 3rem;
          }

          .about-btn-group .btn,
          .cta-btn-group .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
