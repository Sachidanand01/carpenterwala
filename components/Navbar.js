"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
            <Link href="/pro/login" className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>
              Pro Portal
            </Link>
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
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}>
        <Link href="/find-a-professional" style={{ fontSize: "1.5rem", fontWeight: 600 }} onClick={closeMenu}>
          Find a Professional
        </Link>
        <Link href="/services" style={{ fontSize: "1.5rem", fontWeight: 600 }} onClick={closeMenu}>
          Services
        </Link>
        {customer ? (
          <>
            <Link href="/bookings" style={{ fontSize: "1.5rem", fontWeight: 600 }} onClick={closeMenu}>
              My Bookings
            </Link>
            <button 
              onClick={() => { handleLogout(); closeMenu(); }} 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" style={{ fontSize: "1.5rem", fontWeight: 600 }} onClick={closeMenu}>
            My Account
          </Link>
        )}
        <div style={{ marginTop: 'auto' }}>
          <Link href="/pro/login" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={closeMenu}>
            Pro Portal
          </Link>
        </div>
      </div>
    </>
  );
}

