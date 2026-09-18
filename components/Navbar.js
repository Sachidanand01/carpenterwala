"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MagneticCTA from "./MagneticCTA";
import {
  IconSearch,
  IconTools,
  IconBlog,
  IconAbout,
  IconCarpentry,
  IconPainting,
  IconPlumbing,
  IconElectrical,
  IconUser,
  IconCalendar,
  IconHardhat,
  IconLock,
  IconHandshake,
  IconReels
} from "@/components/icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const checkLogin = () => {
    if (typeof window !== "undefined") {
      const phone = localStorage.getItem("customer_phone");
      const name = localStorage.getItem("customer_name");
      setCustomer(phone ? { phone, name } : null);
    }
  };

  useEffect(() => {
    checkLogin();
    window.addEventListener("customer-login-changed", checkLogin);
    return () => window.removeEventListener("customer-login-changed", checkLogin);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("customer_phone");
      localStorage.removeItem("customer_name");
      window.dispatchEvent(new Event("customer-login-changed"));
      router.push("/");
    }
  };

  const coreServices = [
    { title: "Carpentry", icon: <IconCarpentry size={22} color="var(--primary)" />, href: "/services/carpentry", desc: "Furniture, repairs & modular" },
    { title: "Painting", icon: <IconPainting size={22} color="#f59e0b" />, href: "/services/painting", desc: "Interior, exterior & waterproofing" },
    { title: "Plumbing", icon: <IconPlumbing size={22} color="#3b82f6" />, href: "/services/plumbing", desc: "Leaks, fittings & drainage" },
    { title: "Electrical", icon: <IconElectrical size={22} color="#eab308" />, href: "/services/electrical", desc: "Wiring, fixtures & safety grids" }
  ];

  return (
    <>
      <nav className="glass" style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderRadius: 0,
        borderLeft: "none",
        borderRight: "none",
        borderTop: "none"
      }}>
        <div className="container flex items-center justify-between" style={{ height: "70px" }}>
          <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }} onClick={closeMenu}>
            <span className="text-gradient" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Carpenterwala
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="desktop-only flex gap-6 items-center">
            <Link href="/find-a-professional" className="nav-link">Find a Pro</Link>
            <Link href="/services" className="nav-link">Services</Link>
            <Link href="/diy-reels" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>●</span> DIY Reels
            </Link>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/about" className="nav-link">About</Link>
            {customer ? (
              <>
                <Link href="/bookings" className="nav-link">My Bookings</Link>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-secondary" 
                  style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="nav-link">My Account</Link>
            )}
            <MagneticCTA>
              <Link href="/pro/login" className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>
                Pro Portal
              </Link>
            </MagneticCTA>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`mobile-only hamburger ${isOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div className="marquee-container">
          <div className="marquee-track">
            <div className="marquee-item">
              <span><IconLock size={15} color="var(--primary)" /> <strong>100% Free Platform:</strong> Carpenterwala is a pure facilitator. We charge <strong>0% fees/commissions</strong> from both Customers and Service Professionals.</span>
            </div>
            <div className="marquee-item">
              <span><IconHandshake size={15} color="#10b981" /> <strong>Direct Connection:</strong> Deal directly, pay directly. <strong>No hidden platform costs</strong> or service charges!</span>
            </div>
            {/* Duplicate for seamless infinite loop */}
            <div className="marquee-item">
              <span><IconLock size={15} color="var(--primary)" /> <strong>100% Free Platform:</strong> Carpenterwala is a pure facilitator. We charge <strong>0% fees/commissions</strong> from both Customers and Service Professionals.</span>
            </div>
            <div className="marquee-item">
              <span><IconHandshake size={15} color="#10b981" /> <strong>Direct Connection:</strong> Deal directly, pay directly. <strong>No hidden platform costs</strong> or service charges!</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}>
        {/* Core Nav Links */}
        <div className="mobile-menu-links">
          <Link href="/find-a-professional" className="mobile-menu-link" onClick={closeMenu}>
            <span className="mobile-menu-link-label">
              <IconSearch size={19} color="var(--primary)" className="menu-icon" />
              <span>Find a Professional</span>
            </span>
            <span className="mobile-menu-arrow">→</span>
          </Link>
          <Link href="/diy-reels" className="mobile-menu-link" onClick={closeMenu}>
            <span className="mobile-menu-link-label">
              <IconReels size={19} color="var(--primary)" className="menu-icon" />
              <span>DIY Reels</span>
            </span>
            <span className="mobile-menu-arrow">→</span>
          </Link>
          <Link href="/services" className="mobile-menu-link" onClick={closeMenu}>
            <span className="mobile-menu-link-label">
              <IconTools size={19} color="var(--primary)" className="menu-icon" />
              <span>All Services</span>
            </span>
            <span className="mobile-menu-arrow">→</span>
          </Link>
          <Link href="/blog" className="mobile-menu-link" onClick={closeMenu}>
            <span className="mobile-menu-link-label">
              <IconBlog size={19} color="var(--primary)" className="menu-icon" />
              <span>Blog &amp; Guides</span>
            </span>
            <span className="mobile-menu-arrow">→</span>
          </Link>
          <Link href="/about" className="mobile-menu-link" onClick={closeMenu}>
            <span className="mobile-menu-link-label">
              <IconAbout size={19} color="var(--primary)" className="menu-icon" />
              <span>About Us</span>
            </span>
            <span className="mobile-menu-arrow">→</span>
          </Link>
        </div>

        {/* Popular Services Section */}
        <div className="mobile-menu-services-section">
          <div className="mobile-menu-section-label">Popular Services</div>
          <div className="mobile-menu-services-grid">
            {coreServices.map((srv) => (
              <Link
                key={srv.title}
                href={srv.href}
                className="mobile-menu-service-chip"
                onClick={closeMenu}
              >
                <span className="service-chip-icon">{srv.icon}</span>
                <div className="service-chip-text">
                  <span className="service-chip-title">{srv.title}</span>
                  <span className="service-chip-desc">{srv.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* User Account / Bookings */}
        <div className="mobile-menu-account-section">
          {customer ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link href="/bookings" className="mobile-menu-link" onClick={closeMenu}>
                <span className="mobile-menu-link-label">
                  <IconCalendar size={19} color="var(--primary)" className="menu-icon" />
                  <span>My Bookings</span>
                </span>
                <span className="mobile-menu-arrow">→</span>
              </Link>
              <button 
                onClick={() => { handleLogout(); closeMenu(); }} 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '0.85rem' }}
              >
                Logout ({customer.name || customer.phone})
              </button>
            </div>
          ) : (
            <Link href="/login" className="mobile-menu-link" onClick={closeMenu}>
              <span className="mobile-menu-link-label">
                <IconUser size={19} color="var(--primary)" className="menu-icon" />
                <span>My Account / Login</span>
              </span>
              <span className="mobile-menu-arrow">→</span>
            </Link>
          )}
        </div>

        {/* Pro Portal Button */}
        <div className="mobile-menu-pro-cta">
          <Link href="/pro/login" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', gap: '0.6rem' }} onClick={closeMenu}>
            <IconHardhat size={20} color="#ffffff" />
            <span>Pro Portal (Join as a Pro)</span>
          </Link>
        </div>

        {/* Footer & Social Icons */}
        <div className="mobile-menu-footer">
          <div className="mobile-menu-social-links">
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
          <p className="mobile-menu-note">
            <IconLock size={13} color="var(--primary)" /> 100% Free Platform • 0% Commission
          </p>
        </div>
      </div>
    </>
  );
}

