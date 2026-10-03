import Link from "next/link";
import {
  IconCarpentry,
  IconPainting,
  IconPlumbing,
  IconElectrical,
  IconSearch,
  IconTools,
  IconReels
} from "@/components/icons";

export const metadata = {
  title: "404: Page Not Found | Carpenterwala",
  description: "The page you are looking for does not exist on Carpenterwala. Find verified carpenters, painters, and professional handymen.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const quickCategories = [
    { name: "Carpentry & Furniture", href: "/services/carpentry", icon: <IconCarpentry size={18} color="var(--primary)" /> },
    { name: "Painting & Polish", href: "/services/painting", icon: <IconPainting size={18} color="#f59e0b" /> },
    { name: "Plumbing Leaks", href: "/services/plumbing", icon: <IconPlumbing size={18} color="#3b82f6" /> },
    { name: "Electrical Wiring", href: "/services/electrical", icon: <IconElectrical size={18} color="#eab308" /> },
    { name: "DIY Video Guides", href: "/diy-reels", icon: <IconReels size={18} color="var(--primary)" /> },
  ];

  return (
    <main
      id="not-found-page"
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
          maxWidth: "760px",
          width: "100%",
          padding: "3.5rem 2.5rem",
          borderRadius: "var(--border-radius-lg)",
          boxShadow: "0 20px 40px -15px rgba(194, 65, 12, 0.08), 0 0 1px 1px var(--glass-border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Top Accent Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, var(--primary) 0%, var(--accent) 50%, var(--primary-hover) 100%)",
          }}
        />

        {/* Playful Carpentry & Ruler 404 Illustration */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            marginBottom: "1.5rem",
          }}
        >
          {/* Wood Grain Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "linear-gradient(135deg, rgba(194, 65, 12, 0.08) 0%, rgba(217, 119, 6, 0.14) 100%)",
              border: "1.5px dashed var(--primary)",
              borderRadius: "16px",
              padding: "1rem 2rem",
            }}
          >
            {/* Hand Saw SVG Graphic */}
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 4L5 14v4l2 2h3l10-8V4z" />
              <path d="M6 15l-3 3a2 2 0 0 0 0 2.83l.17.17a2 2 0 0 0 2.83 0l3-3" />
              <circle cx="6.5" cy="18.5" r="1" fill="var(--primary)" />
              <path d="M10 12l2 2m2-4l2 2m2-4l2 2" strokeWidth="1.5" />
            </svg>

            {/* 404 Text */}
            <div style={{ textAlign: "left" }}>
              <span
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "3.75rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  color: "var(--primary)",
                  display: "block",
                }}
              >
                404
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--accent)",
                }}
              >
                Blueprint Missing
              </span>
            </div>
          </div>
        </div>

        {/* Heading & Friendly Craftsmanship Copy */}
        <h1
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: "var(--foreground)",
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}
        >
          Measure Twice, Cut Once!
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--foreground-muted)",
            maxWidth: "540px",
            margin: "0 auto 2.25rem auto",
            lineHeight: 1.6,
          }}
        >
          Looks like this board was trimmed off or the page you are looking for has been moved.
          Don&apos;t worry, our workbench is fully stocked to help you find what you need.
        </p>

        {/* Primary Action Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "2.75rem",
          }}
        >
          <Link
            id="notfound-btn-home"
            href="/"
            className="btn btn-primary"
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
            <IconTools size={18} color="#FFFFFF" />
            Back to Home
          </Link>

          <Link
            id="notfound-btn-find-pro"
            href="/find-a-professional"
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
            <IconSearch size={18} color="var(--primary)" />
            Find a Professional
          </Link>
        </div>

        {/* Quick Category Jump Pills */}
        <div
          style={{
            borderTop: "1px solid var(--glass-border)",
            paddingTop: "2rem",
            marginTop: "1rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Popular Work &amp; Services
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.6rem",
              justifyContent: "center",
            }}
          >
            {quickCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="chip-filter"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  background: "var(--background)",
                  border: "1px solid var(--card-border)",
                  fontSize: "0.875rem",
                  color: "var(--foreground)",
                  textDecoration: "none",
                  transition: "var(--transition)",
                }}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Support & Helpline Callout */}
        <div
          style={{
            marginTop: "2.5rem",
            padding: "1rem 1.25rem",
            background: "rgba(194, 65, 12, 0.05)",
            border: "1px solid rgba(194, 65, 12, 0.12)",
            borderRadius: "var(--border-radius)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            textAlign: "left",
          }}
        >
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)", margin: 0 }}>
              Need immediate carpenter or home assistance?
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", margin: 0 }}>
              Our support desk is active every day 8:00 AM - 8:00 PM IST.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a
              id="notfound-helpline-call"
              href="tel:+918095551001"
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--primary)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              📞 +91-809-555-1001
            </a>
            <a
              id="notfound-helpline-whatsapp"
              href="https://wa.me/918095551001?text=Hi%20Carpenterwala,%20I%20hit%20a%20broken%20page%20and%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#15803d",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              💬 WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
