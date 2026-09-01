const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://carpenterwala.com/faq#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does Carpenterwala match me with local professionals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our platform matches you with verified carpenters, painters, plumbers, and electricians based on proximity to your neighborhood in Bangalore, verified trade skills, and real past customer reviews."
      }
    },
    {
      "@type": "Question",
      "name": "Are the service professionals on Carpenterwala background-checked?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, every professional on Carpenterwala goes through a mandatory Aadhaar identity verification, police background check, and trade skills verification."
      }
    },
    {
      "@type": "Question",
      "name": "Does Carpenterwala charge a commission on bookings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No! Carpenterwala is a 100% free marketplace charging 0% commission from both homeowners and professionals. You connect and pay directly."
      }
    },
    {
      "@type": "Question",
      "name": "What if I am not satisfied with the service provided?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All registered professionals offer satisfaction guarantees. If an issue arises, you can submit a support ticket or warranty request via your dashboard."
      }
    }
  ]
};

export const metadata = {
  title: "Frequently Asked Questions | Carpenterwala",
  description: "Find answers to frequently asked questions about booking, payments, and services on Carpenterwala.",
  keywords: ['carpenterwala faq', 'handyman booking questions', 'how to book carpenter Bangalore', 'carpenter service pricing', 'verified handymen safety'],
  alternates: {
    canonical: 'https://carpenterwala.com/faq',
  },
};

export default function FAQLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
