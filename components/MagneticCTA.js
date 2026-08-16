"use client";
import React, { useRef, useState, useEffect } from "react";

/**
 * MagneticCTA provides a premium physics-based magnetic pull hover effect
 * for primary CTA buttons to increase clicks and user engagement.
 */
export default function MagneticCTA({ 
  children, 
  strength = 0.35,      // Pull strength of the button
  textStrength = 0.15,  // Pull strength of the text (creates parallax)
  className = "",
  style = {}
}) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Disable effect for users with reduced motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      // Calculate coordinates of the center of the magnetic field
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      // Offset of cursor from the center
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      // Apply magnetic translation coefficients
      setPosition({ x: deltaX * strength, y: deltaY * strength });
      setTextPosition({ x: deltaX * textStrength, y: deltaY * textStrength });
    };

    const handleMouseLeave = () => {
      // Reset position back to center
      setPosition({ x: 0, y: 0 });
      setTextPosition({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, [strength, textStrength]);

  const containerStyle = {
    display: style.width === "100%" ? "block" : "inline-block",
    position: "relative",
    // Padding creates the magnetic field boundary around the button
    padding: "24px",
    margin: "-24px",
    zIndex: 5,
    ...style
  };

  const buttonStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    // Disable transitions during hover to prevent drag lag, enable on leave for a smooth snap-back
    transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
    willChange: "transform",
    display: style.width === "100%" ? "flex" : "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: style.width === "100%" ? "100%" : "auto"
  };

  const textStyle = {
    transform: `translate3d(${textPosition.x}px, ${textPosition.y}px, 0)`,
    transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
    willChange: "transform",
    width: style.width === "100%" ? "100%" : "auto"
  };

  return (
    <div ref={containerRef} style={containerStyle} className={className}>
      <div style={buttonStyle}>
        <div style={textStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}
