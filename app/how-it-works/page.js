'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function HowItWorks() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: "6rem 0", background: "radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent)" }}>
        <div className="container">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "4rem", 
            alignItems: "center" 
          }}>
            <div>
              <h1 className="text-gradient" style={{ fontSize: "4rem", marginBottom: "1.5rem", lineHeight: "1.1" }}>
                Connecting You with Bangalore's Best Handymen
              </h1>
              <p style={{ fontSize: "1.25rem", opacity: 0.8, marginBottom: "2.5rem", maxWidth: "540px" }}>
                Carpenterwala is the smartest way to find, book, and work with trusted home service professionals in Bangalore. From custom furniture to quick repairs, we've got you covered.
              </p>
              <div className="flex gap-4">
                <Link href="/find-a-professional" className="btn btn-primary">Find a Pro</Link>
                <Link href="/pro/login" className="btn btn-secondary">Join as a Pro</Link>
              </div>
            </div>
            <div className="glass" style={{ padding: "1rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "relative", width: "100%", height: "500px", borderRadius: "12px", overflow: "hidden" }}>
                <Image 
                  src="/images/how-it-works-hero.png" 
                  alt="Carpenterwala Marketplace" 
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Homeowners Section */}
      <section style={{ padding: "5rem 0", backgroundColor: "rgba(15, 23, 42, 0.5)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>For Homeowners</h2>
            <p style={{ opacity: 0.7, fontSize: "1.1rem" }}>Simple, transparent, and hassle-free booking experience.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
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
                desc: "Confirm your booking and schedule a visit. Pay securely through our platform and enjoy a 100% service satisfaction guarantee."
              }
            ].map((item, idx) => (
              <div key={idx} className="glass" style={{ padding: "2.5rem", height: "100%" }}>
                <div style={{ 
                  fontSize: "3rem", 
                  fontWeight: "900", 
                  opacity: 0.1, 
                  marginBottom: "-1rem", 
                  color: "var(--primary)" 
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{item.title}</h3>
                <p style={{ opacity: 0.7, lineHeight: "1.6" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Professionals Section */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>For Professionals</h2>
            <p style={{ opacity: 0.7, fontSize: "1.1rem" }}>Grow your business with a steady stream of local leads.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
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
              <div key={idx} className="glass" style={{ padding: "2.5rem", height: "100%", borderLeft: "4px solid var(--accent)" }}>
                <div style={{ 
                  fontSize: "3rem", 
                  fontWeight: "900", 
                  opacity: 0.1, 
                  marginBottom: "-1rem", 
                  color: "var(--accent)" 
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{item.title}</h3>
                <p style={{ opacity: 0.7, lineHeight: "1.6" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "5rem 0", backgroundColor: "rgba(15, 23, 42, 0.5)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Why Bangalore Trusts Carpenterwala</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem" }}>
            {[
              { title: "Verified Pros", desc: "Every professional undergoes a multi-step background and skill verification process." },
              { title: "Secure Payments", desc: "Your money is safe with us until the work is completed to your satisfaction." },
              { title: "Local Expertise", desc: "Deeply rooted in Bangalore, we understand the specific needs of local homeowners." },
              { title: "24/7 Support", desc: "Our dedicated support team is always here to help you with any queries or issues." }
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <h4 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", color: "var(--accent)" }}>{item.title}</h4>
                <p style={{ opacity: 0.7, fontSize: "0.95rem" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "8rem 0" }}>
        <div className="container">
          <div className="glass" style={{ 
            padding: "4rem", 
            textAlign: "center", 
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(245, 158, 11, 0.2))" 
          }}>
            <h2 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>Ready to get started?</h2>
            <p style={{ fontSize: "1.2rem", opacity: 0.8, marginBottom: "2.5rem", maxWidth: "600px", margin: "0 auto 2.5rem auto" }}>
              Whether you're looking for a pro or looking to grow your business, join the Carpenterwala community today.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/find-a-professional" className="btn btn-primary" style={{ padding: "1rem 2.5rem" }}>Hire a Professional</Link>
              <Link href="/pro/login" className="btn btn-secondary" style={{ padding: "1rem 2.5rem" }}>Register as a Pro</Link>
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
          p { margin: 0 auto 2rem auto !important; }
          div[style*="justify-content: center"] { justify-content: center !important; }
          div[style*="height: 500px"] { height: 350px !important; }
        }
      `}</style>
    </div>
  );
}
