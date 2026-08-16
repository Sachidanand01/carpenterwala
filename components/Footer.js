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
            <div className="social-links" style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <a 
                href="https://www.facebook.com/your.carpenterwala" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/Carpenterwala" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="X (formerly Twitter)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@your-carpenterwala" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                  <polygon points="10 15 15 12 10 9" fill="currentColor"/>
                </svg>
              </a>
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
          <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
            <Link href="/sitemap" style={{ opacity: 0.5, fontSize: "0.85rem" }}>Sitemap</Link>
            <Link href="/privacy" style={{ opacity: 0.5, fontSize: "0.85rem" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ opacity: 0.5, fontSize: "0.85rem" }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
