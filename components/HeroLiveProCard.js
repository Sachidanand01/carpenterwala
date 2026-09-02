"use client";

import Link from "next/link";
import { useState } from "react";

export default function HeroLiveProCard() {
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <div 
      className="hero-pro-card glass animate-fade-in"
      style={{
        position: "relative",
        padding: "1.75rem",
        borderRadius: "var(--border-radius-lg)",
        maxWidth: "480px",
        width: "100%",
        boxShadow: "0 20px 50px rgba(194, 65, 12, 0.08)",
        border: "1px solid var(--glass-border)",
        background: "var(--glass-bg)",
        backdropFilter: "blur(16px)"
      }}
    >
      {/* Live Status Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: "1.25rem" }}>
        <div className="flex items-center gap-2" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--success)" }}>
          <span 
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--success)",
              boxShadow: "0 0 0 3px var(--success-bg)"
            }}
          />
          Verified Pro Live in Bangalore
        </div>
        <span 
          style={{
            fontSize: "0.75rem",
            padding: "0.25rem 0.6rem",
            borderRadius: "20px",
            background: "var(--primary-light)",
            color: "var(--primary)",
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}
        >
          0% COMMISSION
        </span>
      </div>

      {/* Pro Profile Header */}
      <div className="flex gap-4 items-center" style={{ marginBottom: "1.25rem" }}>
        <div 
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(194, 65, 12, 0.25)"
          }}
        >
          RK
        </div>
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-2" style={{ flexWrap: "wrap" }}>
            <h4 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
              Rajesh Kumar
            </h4>
            <span 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--success)",
                background: "var(--success-bg)",
                padding: "0.15rem 0.5rem",
                borderRadius: "12px"
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Aadhaar Verified
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", opacity: 0.75, margin: "2px 0 0 0" }}>
            Master Carpenter & Modular Fitting Specialist
          </p>
        </div>
      </div>

      {/* Stats Strip */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.75rem",
          padding: "0.85rem",
          background: "var(--background)",
          borderRadius: "var(--border-radius-sm)",
          marginBottom: "1.25rem",
          border: "1px solid var(--card-border)",
          textAlign: "center"
        }}
      >
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary)" }}>4.92 ★</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>128 Reviews</div>
        </div>
        <div style={{ borderLeft: "1px solid var(--card-border)", borderRight: "1px solid var(--card-border)" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--foreground)" }}>8+ Yrs</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Experience</div>
        </div>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent)" }}>&lt; 15 min</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Response</div>
        </div>
      </div>

      {/* Interactive Tabs: Recent Work vs Specializations */}
      <div className="flex gap-2" style={{ marginBottom: "0.85rem", borderBottom: "1px solid var(--card-border)", paddingBottom: "0.5rem" }}>
        <button
          type="button"
          onClick={() => setActiveTab("portfolio")}
          style={{
            background: "none",
            border: "none",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            color: activeTab === "portfolio" ? "var(--primary)" : "var(--foreground-muted)",
            borderBottom: activeTab === "portfolio" ? "2px solid var(--primary)" : "2px solid transparent"
          }}
        >
          Recent Completed Job
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("skills")}
          style={{
            background: "none",
            border: "none",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            color: activeTab === "skills" ? "var(--primary)" : "var(--foreground-muted)",
            borderBottom: activeTab === "skills" ? "2px solid var(--primary)" : "2px solid transparent"
          }}
        >
          Specializations
        </button>
      </div>

      {activeTab === "portfolio" ? (
        <div 
          style={{
            fontSize: "0.85rem",
            lineHeight: "1.5",
            padding: "0.75rem",
            borderRadius: "8px",
            background: "rgba(194, 65, 12, 0.04)",
            border: "1px solid rgba(194, 65, 12, 0.1)",
            marginBottom: "1.25rem"
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 600, color: "var(--primary)", fontSize: "0.8rem" }}>📍 Thanisandra, Bangalore</span>
            <span style={{ fontSize: "0.75rem", opacity: 0.65 }}>Yesterday</span>
          </div>
          <p style={{ opacity: 0.85, margin: 0, fontSize: "0.82rem" }}>
            &ldquo;Complete modular kitchen installation and custom hydraulic bed woodwork for a 3BHK flat.&rdquo;
          </p>
        </div>
      ) : (
        <div className="flex gap-2" style={{ flexWrap: "wrap", marginBottom: "1.25rem" }}>
          {["Modular Kitchen", "Hydraulic Bed", "Fluted Wall Panels", "Door Lock Fitting"].map((skill) => (
            <span 
              key={skill}
              style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.6rem",
                background: "var(--secondary)",
                borderRadius: "6px",
                border: "1px solid var(--card-border)",
                fontWeight: 500
              }}
            >
              ✓ {skill}
            </span>
          ))}
        </div>
      )}

      {/* Action Footer */}
      <Link 
        href="/find-a-professional?category=Carpenter" 
        className="btn btn-primary"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "0.8rem 1rem",
          fontSize: "0.95rem",
          fontWeight: 600,
          borderRadius: "var(--border-radius-sm)"
        }}
      >
        <span>Connect with Verified Carpenters</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </Link>
    </div>
  );
}
