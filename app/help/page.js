import Link from 'next/link';

export const metadata = {
  title: "Help Center | Carpenterwala",
  description: "Find answers, get support, and learn how to get the most out of Carpenterwala.",
};

export default function HelpPage() {
  const categories = [
    { title: "Getting Started", icon: "🚀", desc: "Learn how to book your first pro and set up your profile." },
    { title: "Bookings", icon: "📅", desc: "How to track, reschedule, or cancel your service bookings." },
    { title: "Payments", icon: "💳", desc: "Information about pricing, invoices, and secure payments." },
    { title: "For Professionals", icon: "🛠️", desc: "Help for pros: managing leads, profiles, and payouts." },
    { title: "Safety & Trust", icon: "🛡️", desc: "Our verification process and how we keep your home safe." },
    { title: "Account Settings", icon: "👤", desc: "Managing your personal info, notifications, and security." }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 2rem" }}>
      {/* Hero Section */}
      <div className="glass" style={{ 
        padding: "5rem 2rem", 
        textAlign: "center", 
        marginBottom: "4rem",
        background: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000') center/cover"
      }}>
        <h1 className="text-gradient" style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>How can we help you?</h1>
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
          <input 
            type="text" 
            placeholder="Search for articles (e.g. how to book a pro)..." 
            style={{
              width: "100%",
              padding: "1.2rem 1.5rem",
              borderRadius: "50px",
              border: "1px solid var(--glass-border)",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              fontSize: "1.1rem",
              backdropFilter: "blur(10px)"
            }}
          />
        </div>
      </div>

      {/* Help Categories Grid */}
      <div className="footer-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "5rem" }}>
        {categories.map((cat, idx) => (
          <div key={idx} className="glass" style={{ padding: "2.5rem", transition: "transform 0.3s ease", cursor: "pointer" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>{cat.icon}</div>
            <h3 style={{ marginBottom: "0.75rem" }}>{cat.title}</h3>
            <p style={{ opacity: 0.7, fontSize: "0.95rem", lineHeight: "1.5" }}>{cat.desc}</p>
          </div>
        ))}
      </div>

      {/* Popular Articles & Contact CTA */}
      <div className="footer-grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "4rem" }}>
        <div>
          <h2 style={{ marginBottom: "2rem" }}>Popular Articles</h2>
          <div className="flex flex-col gap-4">
            {[
              "How do I reschedule my booking?",
              "What is the 'Verified Pro' badge?",
              "How to apply as a professional carpenter?",
              "Understanding our service guarantee",
              "Can I pay the professional directly?"
            ].map((article, idx) => (
              <div key={idx} className="glass" style={{ 
                padding: "1.2rem 1.5rem", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                cursor: "pointer"
              }}>
                <span>{article}</span>
                <span style={{ opacity: 0.5 }}>→</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass" style={{ padding: "2rem", textAlign: "center", background: "rgba(59, 130, 246, 0.1)" }}>
            <h3 style={{ marginBottom: "1rem" }}>Still stuck?</h3>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", marginBottom: "2rem" }}>
              Our support team is available 9am - 8pm for any urgent queries.
            </p>
            <div className="flex flex-col gap-5">
              <Link href="/contact" className="btn btn-primary" style={{ width: "100%" }}>Contact Us</Link>
              <Link href="/faq" className="btn btn-secondary" style={{ width: "100%" }}>View All FAQs</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
