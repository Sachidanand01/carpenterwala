'use client';
import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is Carpenterwala?",
        a: "Carpenterwala is India's premier marketplace for finding trusted and verified home service professionals, including carpenters, painters, plumbers, and electricians. We connect homeowners with skilled pros who are background-checked and rated by the community."
      },
      {
        q: "Is Carpenterwala available in my city?",
        a: "We currently operate exclusively in Bangalore. We are planning to expand to other major metro cities across India soon. Stay tuned for updates!"
      }
    ]
  },
  {
    category: "Services",
    questions: [
      {
        q: "What kind of services can I book?",
        a: "You can book a wide range of services including furniture assembly, repair, custom carpentry, interior/exterior painting, plumbing fixes, and electrical installations. Each category has specialized professionals to ensure high-quality work."
      },
      {
        q: "Do I need to provide tools or materials?",
        a: "Our professionals bring their own specialized tools to every job. For materials (like wood, paint, or spare parts), you can either provide them yourself or ask the pro to procure them for you at an additional cost."
      }
    ]
  },
  {
    category: "Booking & Pros",
    questions: [
      {
        q: "How are the professionals verified?",
        a: "Every professional on Carpenterwala goes through a multi-step verification process, including identity checks, skill assessments, and background verification. We only list pros who meet our high standards of quality and reliability."
      },
      {
        q: "How do I book a professional?",
        a: "Simply browse our 'Find a Pro' section, select the category you need, and view profiles of top-rated professionals near you. You can request a quote directly from their profile page."
      }
    ]
  },
  {
    category: "Payments & Pricing",
    questions: [
      {
        q: "How is the pricing determined?",
        a: "Pricing depends on the scope of work. Many pros offer competitive hourly rates, while larger projects like custom carpentry are priced based on the specific requirements. You can discuss and finalize the quote directly with the professional."
      },
      {
        q: "Is it safe to pay through the platform?",
        a: "Yes, we use industry-standard encryption for all transactions. Paying through the platform also ensures that your booking is covered by our service guarantees."
      }
    ]
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass" style={{ marginBottom: "1rem", overflow: "hidden" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          color: "white",
          textAlign: "left",
          cursor: "pointer",
          fontSize: "1.1rem",
          fontWeight: 600
        }}
      >
        <span>{question}</span>
        <span style={{ 
          fontSize: "1.5rem", 
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
          opacity: 0.6
        }}>+</span>
      </button>
      
      <div style={{
        maxHeight: isOpen ? "500px" : "0",
        padding: isOpen ? "0 1.5rem 1.5rem 1.5rem" : "0 1.5rem",
        opacity: isOpen ? 1 : 0,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        lineHeight: "1.6",
        color: "rgba(255,255,255,0.7)"
      }}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("General");

  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="text-gradient" style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>Frequently Asked Questions</h1>
        <p style={{ opacity: 0.8, fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto" }}>
          Everything you need to know about Carpenterwala services, bookings, and our community of professionals.
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "3rem", flexWrap: "wrap" }}>
        {faqs.map(cat => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`btn ${activeCategory === cat.category ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: "0.6rem 1.5rem" }}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {faqs.find(c => c.category === activeCategory).questions.map((faq, index) => (
          <FAQItem key={index} question={faq.q} answer={faq.a} />
        ))}
      </div>

      <div className="glass" style={{ 
        marginTop: "5rem", 
        padding: "3rem", 
        textAlign: "center",
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(245, 158, 11, 0.1))"
      }}>
        <h2 style={{ marginBottom: "1rem" }}>Still have questions?</h2>
        <p style={{ opacity: 0.7, marginBottom: "2rem" }}>
          Can't find the answer you're looking for? Our support team is here to help you 24/7.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/contact" className="btn btn-primary">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
