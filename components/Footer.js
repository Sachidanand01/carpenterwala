import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="glass" style={{
      marginTop: "4rem",
      padding: "4rem 0 2rem 0",
      borderBottom: "none",
      borderLeft: "none",
      borderRight: "none",
      borderRadius: 0
    }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none', marginBottom: "1rem" }}>
              <span className="text-gradient" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                Carpenterwala
              </span>
            </Link>
            <p style={{ opacity: 0.7, maxWidth: "300px", fontSize: "0.95rem" }}>
              India's most trusted platform to find verified carpenters, painters, and professional handymen for your home improvement needs.
            </p>
            <div className="social-links" style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              {/* Social icons could go here */}
              <a href="#" className="social-icon">FB</a>
              <a href="#" className="social-icon">IG</a>
              <a href="#" className="social-icon">TW</a>
              <a href="#" className="social-icon">LN</a>
            </div>
          </div>

          <div className="footer-links">
            <h4 style={{ marginBottom: "1.5rem" }}>Services</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li><Link href="/services/carpentry" style={{ opacity: 0.8, fontSize: "0.9rem" }}>Carpentry</Link></li>
              <li><Link href="/services/painting" style={{ opacity: 0.8, fontSize: "0.9rem" }}>Painting</Link></li>
              <li><Link href="/services/plumbing" style={{ opacity: 0.8, fontSize: "0.9rem" }}>Plumbing</Link></li>
              <li><Link href="/services/electrical" style={{ opacity: 0.8, fontSize: "0.9rem" }}>Electrical</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 style={{ marginBottom: "1.5rem" }}>Company</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li><Link href="/about" style={{ opacity: 0.8, fontSize: "0.9rem" }}>About Us</Link></li>
              <li><Link href="/how-it-works" style={{ opacity: 0.8, fontSize: "0.9rem" }}>How it Works</Link></li>
              <li><Link href="/pro/login" style={{ opacity: 0.8, fontSize: "0.9rem" }}>Join as a Pro</Link></li>
              <li><Link href="/blog" style={{ opacity: 0.8, fontSize: "0.9rem" }}>Home Tips Blog</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 style={{ marginBottom: "1.5rem" }}>Support</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li><Link href="/contact" style={{ opacity: 0.8, fontSize: "0.9rem" }}>Contact Us</Link></li>
              <li><Link href="/faq" style={{ opacity: 0.8, fontSize: "0.9rem" }}>FAQs</Link></li>
              <li><Link href="/help" style={{ opacity: 0.8, fontSize: "0.9rem" }}>Help Center</Link></li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: "4rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--glass-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>
            © {new Date().getFullYear()} Carpenterwala Marketplace. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" style={{ opacity: 0.5, fontSize: "0.85rem" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ opacity: 0.5, fontSize: "0.85rem" }}>Terms of Service</Link>
          </div>
      </div>
    </footer>
  );
}
