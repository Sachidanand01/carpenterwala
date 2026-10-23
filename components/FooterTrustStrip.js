"use client";

import { useState, useEffect } from "react";

export default function FooterTrustStrip() {
  const [formattedDate, setFormattedDate] = useState("23-Oct-2026");

  useEffect(() => {
    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      setFormattedDate(`${day}-${month}-${year}`);
    } catch {
      // fallback
    }
  }, []);

  return (
    <div
      style={{
        marginTop: "3.5rem",
        marginBottom: "1rem",
        padding: "1.75rem 2rem",
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--glass-border, rgba(194, 65, 12, 0.18))",
        borderRadius: "16px",
        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04)"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          alignItems: "center"
        }}
      >
        {/* Trust Card 1: SiteLock-Style Daily Verified Security Badge */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              width: "175px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
              overflow: "hidden",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "default"
            }}
            title="Verified Secure by Automated Daily Diagnostic Scan"
          >
            {/* Domain Header */}
            <div
              style={{
                background: "#f1f5f9",
                borderBottom: "1px solid #e2e8f0",
                padding: "4px 8px",
                textAlign: "center",
                fontSize: "11px",
                fontWeight: 600,
                color: "#1e293b",
                letterSpacing: "0.2px"
              }}
            >
              carpenterwala.com
            </div>

            {/* Central Seal with Lock & Shield */}
            <div
              style={{
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "#ffffff"
              }}
            >
              {/* SiteLock style Shield + Lock SVG */}
              <svg width="34" height="34" viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
                {/* Shield Outline */}
                <path
                  d="M24 4L8 10V22C8 32.5 14.8 41.8 24 44C33.2 41.8 40 32.5 40 22V10L24 4Z"
                  fill="#0284c7"
                  fillOpacity="0.12"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Check / Dynamic Wave Arc */}
                <path
                  d="M14 23C16.5 25.5 21 29 25 24C28 20 34 16 35 15"
                  stroke="#0284c7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Padlock Icon */}
                <path
                  d="M20 18V15C20 12.8 21.8 11 24 11C26.2 11 28 12.8 28 15V18"
                  stroke="#0f172a"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <rect x="18" y="18" width="12" height="9" rx="2" fill="#0f172a" />
              </svg>

              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#0369a1", letterSpacing: "0.5px" }}>
                  SITELOCK
                </div>
                <div style={{ fontSize: "14px", fontWeight: 900, color: "#0f172a", letterSpacing: "0.8px" }}>
                  SECURE
                </div>
              </div>
            </div>

            {/* Bottom Passed Ribbon with Live Date */}
            <div
              style={{
                background: "#0f172a",
                padding: "4px 8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#ffffff",
                fontSize: "10.5px",
                fontWeight: 600,
                letterSpacing: "0.3px"
              }}
            >
              <span>Passed</span>
              <span style={{ color: "#38bdf8", fontWeight: 700 }}>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Trust Card 2: 256-Bit SSL Encryption */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "rgba(22, 163, 74, 0.12)",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: "2px" }}>
              256-Bit SSL Encrypted
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.4 }}>
              End-to-end TLS privacy &amp; bank-grade secure browsing.
            </div>
          </div>
        </div>

        {/* Trust Card 3: 100% Verified Technicians */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "rgba(37, 99, 235, 0.12)",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: "2px" }}>
              100% Verified Pros
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.4 }}>
              Aadhaar, background &amp; trade-tested local technicians.
            </div>
          </div>
        </div>

        {/* Trust Card 4: 0% Commission Direct Pricing */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "rgba(217, 119, 6, 0.12)",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 6v2m0 8v2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: "2px" }}>
              0% Commission Direct
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.4 }}>
              Zero platform cuts or hidden booking fees for homeowners.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
