"use client";
import { useState, useEffect } from "react";

const themes = [
  { id: "refined-warmth", name: "Refined Warmth", icon: "🟫", primary: "#E8913A", bg: "#0E0D0B" },
  { id: "clean-craftsmanship", name: "Clean Craftsmanship", icon: "🟧", primary: "#C2410C", bg: "#FAF8F5" },
  { id: "modern-tech", name: "Modern Tech & Steel", icon: "🟦", primary: "#FF9F0A", bg: "#0F172A" },
  { id: "eco-friendly", name: "Eco-Friendly Naturalist", icon: "🟩", primary: "#E2B13C", bg: "#0B1A13" },
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("refined-warmth");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("carpenterwala-theme");
    if (savedTheme) {
      setTimeout(() => {
        setCurrentTheme(savedTheme);
      }, 0);
      if (savedTheme === "refined-warmth") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    }
  }, []);

  const selectTheme = (themeId) => {
    setCurrentTheme(themeId);
    if (themeId === "refined-warmth") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeId);
    }
    localStorage.setItem("carpenterwala-theme", themeId);
    setIsOpen(false);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 9999,
      fontFamily: "var(--font-outfit), sans-serif",
    }}>
      {/* Menu popup */}
      {isOpen && (
        <div className="glass" style={{
          position: "absolute",
          bottom: "70px",
          right: "0",
          width: "260px",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          border: "1px solid var(--glass-border-hover)",
          transform: "translateY(0)",
        }}>
          <h4 style={{ fontSize: "0.85rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem", color: "var(--foreground)" }}>
            Select Website Theme
          </h4>
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => selectTheme(theme.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.6rem 0.8rem",
                borderRadius: "8px",
                background: currentTheme === theme.id ? "var(--primary-light)" : "transparent",
                border: currentTheme === theme.id ? "1px solid var(--primary)" : "1px solid transparent",
                color: "var(--foreground)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                fontWeight: currentTheme === theme.id ? "600" : "400",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (currentTheme !== theme.id) e.currentTarget.style.background = "var(--secondary)";
              }}
              onMouseLeave={(e) => {
                if (currentTheme !== theme.id) e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>{theme.icon}</span>
                <span style={{ fontSize: "0.9rem" }}>{theme.name}</span>
              </div>
              {/* Color dots preview */}
              <div style={{ display: "flex", gap: "3px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: theme.primary, display: "inline-block" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: theme.bg, display: "inline-block", border: "1px solid rgba(255,255,255,0.2)" }} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          border: isOpen ? "2px solid var(--primary)" : "1px solid var(--glass-border)",
          transition: "var(--transition)",
          background: "var(--glass-bg)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
        }}
      >
        🎨
      </button>
    </div>
  );
}
