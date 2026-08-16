"use client";
import React, { useRef, useEffect, useState } from "react";

// Helper component to fetch and inline the SVGs so they can inherit CSS brand colors
function InlineSVG({ src, className, style }) {
  const [svgHtml, setSvgHtml] = useState("");

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((data) => {
        // Replace hardcoded fills/strokes with currentColor so they inherit CSS colors
        const processed = data
          .replace(/fill="#000000"/g, 'fill="currentColor"')
          .replace(/stroke="#000000"/g, 'stroke="currentColor"');
        setSvgHtml(processed);
      })
      .catch((err) => console.error("Error loading SVG:", err));
  }, [src]);

  if (!svgHtml) {
    return <div style={style} className={className} />;
  }

  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}

// All 14 custom handyman icons distributed across the screen width and height
const ICONS = [
  { src: "/images/svg/hammer.svg", label: "Hammer", top: "12%", left: "15%", size: 50, floatClass: "float-1" },
  { src: "/images/svg/paint-brush.svg", label: "Paint Brush 1", top: "8%", left: "75%", size: 48, floatClass: "float-2" },
  { src: "/images/svg/Measurement Ruler.svg", label: "Measurement Ruler", top: "25%", left: "45%", size: 48, floatClass: "float-4" },
  { src: "/images/svg/builder-tool.svg", label: "Builder Tool", top: "20%", left: "85%", size: 48, floatClass: "float-1" },
  { src: "/images/svg/broken-pipe.svg", label: "Broken Pipe", top: "35%", left: "10%", size: 52, floatClass: "float-3" },
  { src: "/images/svg/drill-machine.svg", label: "Drill Machine", top: "32%", left: "70%", size: 54, floatClass: "float-4" },
  { src: "/images/svg/plumber.svg", label: "Plumber", top: "48%", left: "30%", size: 50, floatClass: "float-1" },
  { src: "/images/svg/screw-driver.svg", label: "Screwdriver", top: "58%", left: "85%", size: 42, floatClass: "float-2" },
  { src: "/images/svg/gardening-tools.svg", label: "Gardening Tools", top: "62%", left: "12%", size: 52, floatClass: "float-2" },
  { src: "/images/svg/light-bulb.svg", label: "Light Bulb", top: "75%", left: "55%", size: 46, floatClass: "float-3" },
  { src: "/images/svg/welder.svg", label: "Welder", top: "88%", left: "90%", size: 52, floatClass: "float-4" },
  { src: "/images/svg/paintBrush.svg", label: "Paint Brush 2", top: "45%", left: "60%", size: 50, floatClass: "float-3" },
  { src: "/images/svg/hammering-nail.svg", label: "Hammering Nail", top: "70%", left: "25%", size: 52, floatClass: "float-1" },
  { src: "/images/svg/measuring-tape.svg", label: "Measuring Tape", top: "82%", left: "38%", size: 46, floatClass: "float-4" }
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

          // High-performance: disable transition during mouse-move tracking to eliminate drag lag
          inner.style.transition = "none";
          inner.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
          
          const svg = inner.querySelector(".floating-bg-icon-svg");
          if (svg) {
            svg.style.opacity = `${0.06 + factor * 0.16}`; // scales from 0.06 up to 0.22 opacity
          }
        } else {
          // Let go: smoothly ease back to original position
          inner.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
          inner.style.transform = `translate3d(0, 0, 0)`;
          
          const svg = inner.querySelector(".floating-bg-icon-svg");
          if (svg) {
            svg.style.opacity = "0.06";
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
        const positionStyle = {
          position: "absolute",
          top: icon.top,
          left: icon.left,
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
              <InlineSVG
                src={icon.src}
                className="floating-bg-icon-svg"
                style={{
                  width: "100%",
                  height: "100%",
                  color: "var(--primary)",
                  opacity: 0.06,
                  transition: "opacity 0.3s ease"
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
