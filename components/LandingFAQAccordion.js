"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    id: "faq-1",
    question: "How does the Carpenterwala handyman app match me with local pros?",
    answer: "Our handyman platform utilizes neighborhood routing to match you directly with verified carpenters, painters, plumbers, and electricians near you in Bangalore. Whether you are in HSR Layout, Indiranagar, Whitefield, or Thanisandra, you see real portfolios, ratings, and past job photos so you can choose and contact experts directly."
  },
  {
    id: "faq-2",
    question: "What makes this the premium home services platform in India?",
    answer: "Unlike aggregators that charge 20–30% platform commissions and markup labor costs, Carpenterwala is 100% free for both homeowners and service professionals. You connect directly with verified experts, review real past projects, and negotiate fair, transparent rates with 0% inflated margins."
  },
  {
    id: "faq-3",
    question: "How does Carpenterwala verify background and craft skills?",
    answer: "Every service professional undergoes a multi-step verification process including Government Aadhaar identity validation, criminal background verification, and trade skill assessment before earning the verified badge on their public portfolio."
  },
  {
    id: "faq-4",
    question: "Do you offer a warranty on home repairs and woodwork?",
    answer: "Yes. Registered homeowners can use our built-in digital Warranty Manager on their dashboard to upload receipts, track active service guarantees, and request warranty assistance on any completed carpentry, painting, or repair project."
  }
];

const BANGALORE_AREAS = [
  "HSR Layout",
  "Indiranagar",
  "Whitefield",
  "Koramangala",
  "Thanisandra",
  "Jayanagar",
  "JP Nagar",
  "Bellandur",
  "Marathahalli",
  "Hebbal",
  "Electronic City",
  "Sarjapur Road"
];

export default function LandingFAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="faq-wrapper" style={{ width: "100%" }}>
      {/* Accordion List */}
      <div className="flex flex-col gap-3" style={{ marginBottom: "2.5rem" }}>
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.id}
              className="faq-item"
              style={{
                border: "1px solid var(--card-border)",
                borderRadius: "var(--border-radius)",
                background: isOpen ? "var(--background)" : "var(--glass-bg)",
                transition: "var(--transition)",
                overflow: "hidden"
              }}
            >
              <button
                type="button"
                id={`faq-btn-${idx}`}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                onClick={() => toggleFaq(idx)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "1.25rem 1.5rem",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "var(--foreground)",
                  fontSize: "1.05rem",
                  fontWeight: 600
                }}
              >
                <span>{faq.question}</span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: isOpen ? "var(--primary-light)" : "var(--secondary)",
                    color: isOpen ? "var(--primary)" : "var(--foreground-muted)",
                    transition: "transform 0.25s ease",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    flexShrink: 0
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                  style={{
                    padding: "0 1.5rem 1.25rem 1.5rem",
                    color: "var(--foreground-muted)",
                    fontSize: "0.95rem",
                    lineHeight: "1.7"
                  }}
                >
                  <div style={{ paddingTop: "0.5rem", borderTop: "1px solid var(--card-border)" }}>
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Local Bangalore Area Coverage Badges */}
      <div 
        style={{
          padding: "1.5rem",
          background: "var(--secondary)",
          borderRadius: "var(--border-radius)",
          border: "1px solid var(--card-border)"
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: "0.85rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Serving Top Neighborhoods Across Bangalore
          </span>
        </div>
        <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
          {BANGALORE_AREAS.map((area) => (
            <Link
              key={area}
              href={`/find-a-professional?search=${encodeURIComponent(area)}`}
              className="neighborhood-chip"
              style={{
                fontSize: "0.82rem",
                fontWeight: 500,
                padding: "0.35rem 0.75rem",
                borderRadius: "20px",
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--card-border)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                transition: "var(--transition)"
              }}
            >
              <span>{area}</span>
              <span style={{ opacity: 0.4, fontSize: "0.75rem" }}>↗</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
