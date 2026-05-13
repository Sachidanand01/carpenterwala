"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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
            <Link href="/find-a-professional" style={{ fontWeight: 500, opacity: 0.8 }}>Find a Pro</Link>
            <Link href="/services" style={{ fontWeight: 500, opacity: 0.8 }}>Services</Link>
            <Link href="/pro/login" className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>
              Pro Login
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
        <div style={{ marginTop: 'auto' }}>
          <Link href="/pro/login" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={closeMenu}>
            Join as a Pro / Login
          </Link>
        </div>
      </div>
    </>
  );
}
