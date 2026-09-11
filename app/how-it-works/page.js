'use client';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function HowItWorks() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hiw-hero-section">
        <div className="container">
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumbs items={[
              { name: "Home", url: "/" },
              { name: "How it Works", url: "/how-it-works" }
            ]} />
          </div>

          <div className="hiw-hero-grid">
            <div className="hiw-hero-content">
              <h1 className="text-gradient hiw-hero-title">
                Connecting You with Bangalore's Best Handymen
              </h1>
              <p className="hiw-hero-desc">
                Carpenterwala is the smartest way to find, book, and work with trusted home service professionals in Bangalore. From custom furniture to quick repairs, we've got you covered.
              </p>
              <div className="hiw-btn-group">
                <Link href="/find-a-professional" className="btn btn-primary">Find a Pro</Link>
                <Link href="/pro/login" className="btn btn-secondary">Join as a Pro</Link>
              </div>
            </div>

            <div className="hiw-hero-image-wrap glass">
              <div className="hiw-hero-image-inner">
                <Image
                  src="/images/how-it-works-hero.png"
                  alt="Carpenterwala Marketplace"
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

      {/* For Homeowners Section */}
      <section className="hiw-section hiw-section-warm">
        <div className="container">
          <div className="section-header">
            <h2 className="text-gradient section-title">For Homeowners</h2>
            <p className="section-subtitle">Simple, transparent, and hassle-free booking experience.</p>
          </div>

          <div className="steps-grid">
            {[
              {
                step: "01",
                title: "Browse & Discover",
                desc: "Search through our curated directory of verified professionals in Bangalore. Filter by service, ratings, and location to find your perfect match."
              },
              {
                step: "02",
                title: "Connect & Quote",
                desc: "View detailed pro profiles, check their past work, and request a free quote directly. Chat with them to discuss your specific project needs."
              },
              {
                step: "03",
                title: "Book & Relax",
                desc: "Confirm your booking and schedule a visit. Pay securely and directly with zero platform commissions or hidden charges."
              }
            ].map((item, idx) => (
              <div key={idx} className="glass step-card">
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Professionals Section */}
      <section className="hiw-section">
        <div className="container">
          <div className="section-header">
            <h2 className="text-gradient section-title">For Professionals</h2>
            <p className="section-subtitle">Grow your business with a steady stream of local leads.</p>
          </div>

          <div className="steps-grid">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                desc: "Sign up as a pro and showcase your skills, experience, and portfolio. We verify your identity to build trust with potential clients."
              },
              {
                step: "02",
                title: "Get Quality Leads",
                desc: "Receive booking requests and quote inquiries from homeowners in your service area. Only take the jobs that fit your schedule."
              },
              {
                step: "03",
                title: "Build Your Reputation",
                desc: "Provide excellent service, get top-rated reviews, and watch your business grow through our platform's recommendation engine."
              }
            ].map((item, idx) => (
              <div key={idx} className="glass step-card step-card-pro">
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="hiw-section hiw-section-warm">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Bangalore Trusts Carpenterwala</h2>
          </div>

          <div className="trust-grid">
            {[
              { title: "Verified Pros", desc: "Every professional undergoes a multi-step background and skill verification process." },
              { title: "0% Commission", desc: "We are a pure facilitator with zero middleman commissions for both parties." },
              { title: "Local Expertise", desc: "Deeply rooted in Bangalore, we understand the specific needs of local homeowners." },
              { title: "24/7 Support", desc: "Our dedicated support team is always here to help you with any queries or issues." }
            ].map((item, idx) => (
              <div key={idx} className="glass trust-item">
                <h4 className="trust-title">{item.title}</h4>
                <p className="trust-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hiw-section hiw-cta-section">
        <div className="container">
          <div className="glass hiw-cta-card">
            <h2 className="hiw-cta-title">Ready to get started?</h2>
            <p className="hiw-cta-desc">
              Whether you're looking for a pro or looking to grow your business, join the Carpenterwala community today.
            </p>
            <div className="hiw-cta-buttons">
              <Link href="/find-a-professional" className="btn btn-primary hiw-cta-btn">Hire a Professional</Link>
              <Link href="/pro/login" className="btn btn-secondary hiw-cta-btn">Register as a Pro</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hiw-hero-section {
          padding: 3.5rem 0 4rem;
          background: radial-gradient(circle at top right, rgba(250, 248, 245, 1), transparent);
        }

        .hiw-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3.5rem;
          align-items: center;
        }

        .hiw-hero-content {
          order: 1;
        }

        .hiw-hero-title {
          font-size: clamp(2rem, 5vw, 3.6rem);
          margin-bottom: 1.25rem;
          line-height: 1.15;
          word-break: break-word;
        }

        .hiw-hero-desc {
          font-size: clamp(1.05rem, 2.5vw, 1.2rem);
          opacity: 0.85;
          margin-bottom: 2rem;
          line-height: 1.7;
          max-width: 540px;
        }

        .hiw-btn-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hiw-hero-image-wrap {
          order: 2;
          padding: 0.85rem;
          border-radius: 16px;
        }

        .hiw-hero-image-inner {
          position: relative;
          width: 100%;
          height: 460px;
          border-radius: 12px;
          overflow: hidden;
        }

        .hiw-section {
          padding: clamp(3.5rem, 6vw, 5rem) 0;
        }

        .hiw-section-warm {
          background-color: rgba(250, 248, 245, 1);
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          margin-bottom: 0.75rem;
          text-align: center;
        }

        .section-subtitle {
          opacity: 0.75;
          font-size: 1.05rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.75rem;
        }

        .step-card {
          padding: clamp(1.5rem, 3.5vw, 2.5rem);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .step-card-pro {
          border-left: 4px solid var(--accent);
        }

        .step-number {
          font-size: clamp(2.25rem, 5vw, 3rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 0.75rem;
          color: var(--accent);
        }

        .step-title {
          font-size: clamp(1.25rem, 3vw, 1.45rem);
          margin-bottom: 0.75rem;
        }

        .step-desc {
          opacity: 0.8;
          line-height: 1.65;
          font-size: 0.98rem;
          margin: 0;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .trust-item {
          padding: clamp(1.25rem, 3vw, 2rem);
          text-align: center;
        }

        .trust-title {
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
          color: var(--accent);
        }

        .trust-desc {
          opacity: 0.75;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        .hiw-cta-section {
          padding: clamp(3.5rem, 6vw, 6rem) 0;
        }

        .hiw-cta-card {
          padding: clamp(2rem, 5vw, 4rem);
          text-align: center;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(245, 158, 11, 0.15));
          border-radius: 16px;
        }

        .hiw-cta-title {
          font-size: clamp(1.85rem, 4.5vw, 2.75rem);
          margin-bottom: 1rem;
        }

        .hiw-cta-desc {
          font-size: clamp(1rem, 2.5vw, 1.15rem);
          opacity: 0.85;
          max-width: 580px;
          margin: 0 auto 2rem auto;
          line-height: 1.7;
        }

        .hiw-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hiw-cta-btn {
          padding: 0.85rem 2rem;
          font-size: 0.95rem;
        }

        @media (max-width: 992px) {
          .hiw-hero-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .hiw-hero-content {
            order: 1;
            text-align: left;
          }

          .hiw-hero-image-wrap {
            order: 2;
          }

          .hiw-hero-image-inner {
            height: clamp(260px, 50vw, 380px);
          }
        }

        @media (max-width: 576px) {
          .hiw-hero-section {
            padding: 2rem 0 3rem;
          }

          .hiw-btn-group .btn,
          .hiw-cta-buttons .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
