"use client";

import { useEffect, useState } from "react";

export default function AdSenseContainer({ 
  slot, 
  format = "auto", 
  responsive = "true", 
  style = {}, 
  className = "" 
}) {
  const [mounted, setMounted] = useState(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "ca-pub-1234567890123456";

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.warn("Google AdSense push warning: ", err.message);
    }
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ minHeight: "250px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", ...style }} 
        className={`ad-placeholder ${className}`}
      />
    );
  }

  return (
    <div 
      className={`ad-container ${className}`} 
      style={{ 
        minHeight: "250px", 
        margin: "2rem 0", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        background: "rgba(255, 255, 255, 0.01)", 
        borderRadius: "8px", 
        border: "1px solid rgba(255, 255, 255, 0.03)",
        overflow: "hidden", 
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%", ...style }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
