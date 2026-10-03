"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconTools, IconSearch } from "@/components/icons";

export default function ErrorBoundary({ error, reset, unstable_retry }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log error to console / error monitoring
    console.error("Carpenterwala Application Error Boundary:", error);
  }, [error]);

  const handleRetry = () => {
    if (typeof unstable_retry === "function") {
      unstable_retry();
    } else if (typeof reset === "function") {
      reset();
    } else {
      window.location.reload();
    }
  };

  const copyErrorDetails = () => {
    const details = `Error Digest: ${error?.digest || "N/A"}\nMessage: ${error?.message || "Unknown error"}`;
    navigator.clipboard.writeText(details).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <main
      id="error-boundary-page"
      className="container animate-fade-in"
      style={{
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem 6rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div
        className="glass"
        style={{
          maxWidth: "720px",
          width: "100%",
          padding: "3.5rem 2.5rem",
          borderRadius: "var(--border-radius-lg)",
          boxShadow: "0 20px 40px -15px rgba(185, 28, 28, 0.08), 0 0 1px 1px var(--glass-border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Top Accent Bar in Safety Amber/Rust */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, #b91c1c 0%, #d97706 50%, #c2410c 100%)",
          }}
        />

        {/* Playful Construction / Tool Malfunction Graphic */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "rgba(185, 28, 28, 0.06)",
              border: "1.5px dashed rgba(185, 28, 28, 0.35)",
              borderRadius: "16px",
              padding: "1rem 2rem",
            }}
          >
            {/* Wrench / Tool Box Icon */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b91c1c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>

            <div style={{ textAlign: "left" }}>
              <span
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "3.25rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  color: "#b91c1c",
                  display: "block",
                }}
              >
                500
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#d97706",
                }}
              >
                Workbench Hiccup
              </span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.35rem)",
            fontWeight: 800,
            color: "var(--foreground)",
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}
        >
          Our Tools Hit a Snag!
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--foreground-muted)",
            maxWidth: "520px",
            margin: "0 auto 2rem auto",
            lineHeight: 1.6,
          }}
        >
          An unexpected glitch stopped this operation in its tracks. You can try running the repair
          again, or head back to safety.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          <button
            id="error-btn-retry"
            type="button"
            onClick={handleRetry}
            className="btn btn-primary"
            style={{
              padding: "0.85rem 1.85rem",
              fontSize: "1rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              border: "none",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            Try Again
          </button>

          <Link
            id="error-btn-home"
            href="/"
            className="btn btn-secondary"
            style={{
              padding: "0.85rem 1.85rem",
              fontSize: "1rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <IconTools size={18} color="var(--primary)" />
            Return to Home
          </Link>

          <Link
            id="error-btn-find-pro"
            href="/find-a-professional"
            className="btn"
            style={{
              padding: "0.85rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              border: "1px solid var(--glass-border)",
              color: "var(--foreground)",
            }}
          >
            <IconSearch size={18} color="var(--foreground-muted)" />
            Find Pros
          </Link>
        </div>

        {/* Collapsible Technical Details for Debugging */}
        <details
          style={{
            textAlign: "left",
            background: "var(--background)",
            border: "1px solid var(--card-border)",
            borderRadius: "var(--border-radius)",
            padding: "0.85rem 1.25rem",
            fontSize: "0.875rem",
            color: "var(--foreground-muted)",
            marginBottom: "2rem",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontWeight: 600,
              color: "var(--foreground)",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Technical Diagnostics</span>
            <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>Click to expand</span>
          </summary>

          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {error?.digest && (
              <p style={{ margin: 0, wordBreak: "break-all" }}>
                <strong>Digest:</strong> <code>{error.digest}</code>
              </p>
            )}
            {error?.message && (
              <p style={{ margin: 0, wordBreak: "break-all" }}>
                <strong>Message:</strong> <code>{error.message}</code>
              </p>
            )}
            {!error?.digest && !error?.message && (
              <p style={{ margin: 0, fontStyle: "italic" }}>
                No additional debug information forwarded by server runtime.
              </p>
            )}

            <div style={{ marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={copyErrorDetails}
                style={{
                  fontSize: "0.8rem",
                  padding: "0.35rem 0.75rem",
                  background: "var(--secondary)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "var(--foreground)",
                }}
              >
                {copied ? "✓ Copied to clipboard" : "Copy error details"}
              </button>
            </div>
          </div>
        </details>

        {/* Helpline & Quick Contact */}
        <div
          style={{
            borderTop: "1px solid var(--glass-border)",
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            textAlign: "left",
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "var(--foreground-muted)", margin: 0 }}>
            Persistent issue? Reach our technical support directly.
          </p>

          <div style={{ display: "flex", gap: "1rem" }}>
            <a
              id="error-contact-email"
              href="mailto:contact@carpenterwala.com?subject=Reporting%20Website%20Error"
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              ✉️ Email Support
            </a>
            <a
              id="error-contact-whatsapp"
              href="https://wa.me/918095551001?text=Hi%20Carpenterwala,%20I%20am%20facing%20an%20error%20on%20the%20website."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#15803d",
                textDecoration: "none",
              }}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
