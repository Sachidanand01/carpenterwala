'use client';
import { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is Carpenterwala?",
        a: "Carpenterwala is an easy-to-use site to find trusted local handymen in Bangalore. We connect you directly with verified carpenters, painters, plumbers, and electricians who are background-checked and rated by real customers."
      },
      {
        q: "Is Carpenterwala available in my city?",
        a: "Right now, we only operate in Bangalore. We plan to expand to other major cities across India very soon. We will share updates as we grow!"
      },
      {
        q: "Are there any service charges or hidden fees when booking a professional?",
        a: "No hidden fees at all! The price you agree on with your professional is exactly what you pay. We charge our service professionals a small fee for matching them with you. This keeps pricing clean, direct, and transparent for you."
      }
    ]
  },
  {
    category: "Services",
    questions: [
      {
        q: "What kind of services can I book?",
        a: "You can book almost any home repair! This includes assembling furniture, fixing wooden items, custom woodwork, painting inside or outside your house, plumbing repairs, and electrical work."
      },
      {
        q: "Do I need to provide tools or materials?",
        a: "Our pros bring all the special tools needed for the job. For materials like wood, paint, or pipes, you can buy them yourself or pay the pro to buy them for you."
      },
      {
        q: "Can I request custom-designed furniture or large-scale renovations?",
        a: "Yes! Our pros handle both small home repairs and large renovations. When you list a job, you can upload photos, designs, or details. This helps us match you with the right pro who has the exact skills for your project."
      }
    ]
  },
  {
    category: "Booking & Pros",
    questions: [
      {
        q: "How are the professionals verified?",
        a: "We check every professional on our platform. This includes checking their ID cards, verifying their skills, and running background checks. We only list pros who are reliable, safe, and do high-quality work."
      },
      {
        q: "How do I book a professional?",
        a: "It is simple! Browse our 'Find a Pro' section, pick the service you need, and view nearby pro profiles. You can ask for a price quote directly from their page."
      },
      {
        q: "What should I do if the professional doesn't show up on time?",
        a: "If your pro is running late, you can call them directly using their number in your dashboard. If you can't reach them, just call our help support team. We will contact them for you or send a replacement pro quickly so your job gets done."
      }
    ]
  },
  {
    category: "Payments & Pricing",
    questions: [
      {
        q: "How is the pricing determined?",
        a: "Pricing depends on the job size. Many pros charge simple hourly rates, while larger projects like custom carpentry are priced based on the work details. You can talk and agree on a price directly with your pro."
      },
      {
        q: "Is it safe to pay through the platform?",
        a: "Yes! We use safe, industry-standard systems to handle your payments securely. Paying online also covers your booking under our service guarantee."
      },
      {
        q: "What is your refund and booking cancellation policy?",
        a: "You can cancel your booking for free up to 2 hours before the scheduled time. If you cancel later than that, we may charge a small fee to help cover the pro's travel cost. If you are due a refund, it will show up in your account in 5 to 7 working days."
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap(cat => 
      cat.questions.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    )
  };

  return (
    <div className="container animate-fade-in" style={{ padding: "2rem 2rem 4rem 2rem" }}>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "FAQ", url: "/faq" }
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
