"use client";
import React, { useRef, useEffect } from "react";

// Curated list of 10 high-quality handyman icons from public/images/svg/
const ICONS = [
  { src: "/images/svg/hammer.svg", label: "Hammer", top: "15%", left: "6%", size: 52, floatClass: "float-1" },
  { src: "/images/svg/paint-brush.svg", label: "Paint Brush", top: "12%", right: "6%", size: 48, floatClass: "float-2" },
  { src: "/images/svg/Measurement Ruler.svg", label: "Measurement Ruler", top: "30%", left: "10%", size: 50, floatClass: "float-4" },
  { src: "/images/svg/builder-tool.svg", label: "Builder Tool", top: "28%", right: "9%", size: 48, floatClass: "float-1" },
  { src: "/images/svg/broken-pipe.svg", label: "Broken Pipe", top: "45%", left: "8%", size: 52, floatClass: "float-3" },
  { src: "/images/svg/drill-machine.svg", label: "Drill Machine", top: "42%", right: "8%", size: 54, floatClass: "float-4" },
  { src: "/images/svg/plumber.svg", label: "Plumber", top: "60%", left: "7%", size: 52, floatClass: "float-1" },
  { src: "/images/svg/screw-driver.svg", label: "Screwdriver", top: "62%", right: "10%", size: 42, floatClass: "float-3" },
  { src: "/images/svg/light-bulb.svg", label: "Light Bulb", top: "78%", left: "5%", size: 48, floatClass: "float-2" },
  { src: "/images/svg/measuring-tape.svg", label: "Measuring Tape", top: "80%", right: "7%", size: 46, floatClass: "float-1" }
];

export default function FloatingBackground() {
  const refs = useRef([]);

  // Initialize refs for each icon
  if (refs.current.length !== ICONS.length) {
    refs.current = Array(ICONS.length)
      .fill(null)
      .map((_, i) => refs.current[i] || React.createRef());
  }

  useEffect(() => {
    // Disable effect for users with reduced motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const threshold = 220; // Distance of attraction in pixels
    const maxStrength = 35; // Maximum displacement in pixels

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      refs.current.forEach((ref) => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const inner = el.querySelector(".magnetic-inner");
        if (!inner) return;

        if (distance < threshold) {
          // Attract: pull towards cursor. The pull factor is stronger when closer.
          const factor = (threshold - distance) / threshold;
          const pullX = (dx / distance) * factor * maxStrength;
          const pullY = (dy / distance) * factor * maxStrength;

          inner.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
          
          const img = inner.querySelector(".floating-bg-icon-img");
          if (img) {
            img.style.opacity = `${0.08 + factor * 0.14}`; // fades up to 0.22 opacity
          }
        } else {
          // Let go: reset back to center
          inner.style.transform = `translate3d(0, 0, 0)`;
          const img = inner.querySelector(".floating-bg-icon-img");
          if (img) {
            img.style.opacity = "0.08";
          }
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="floating-bg-container" aria-hidden="true">
      {ICONS.map((icon, idx) => {
        // Construct position styling dynamically
        const positionStyle = {
          position: "fixed",
          top: icon.top,
          left: icon.left || "auto",
          right: icon.right || "auto",
          width: `${icon.size}px`,
          height: `${icon.size}px`
        };

        return (
          <div
            key={idx}
            ref={refs.current[idx]}
            style={positionStyle}
            className={`floating-bg-icon-wrapper ${icon.floatClass}`}
          >
            <div className="magnetic-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={icon.src}
                alt={icon.label}
                className="floating-bg-icon-img"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
