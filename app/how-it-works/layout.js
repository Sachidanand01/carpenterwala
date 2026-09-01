export const metadata = {
  title: "How It Works - Handyman Booking Process | Carpenterwala",
  description: "Learn how easy it is to find, book, and review verified professionals on Carpenterwala.",
  alternates: {
    canonical: 'https://carpenterwala.com/how-it-works',
  },
};

const howItWorksJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://carpenterwala.com/how-it-works#webpage",
  "name": "How Carpenterwala Works",
  "url": "https://carpenterwala.com/how-it-works",
  "description": "Step-by-step process of discovering, booking, and hiring verified home repair experts in Bangalore with zero commission.",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Browse & Discover",
        "description": "Search through our curated directory of verified professionals in Bangalore. Filter by service, ratings, and location."
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Connect & Quote",
        "description": "View detailed pro profiles, inspect past work photos, and connect directly for a transparent estimate."
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Book & Relax",
        "description": "Confirm your booking, get swift local arrival within 60-90 minutes, and pay directly with zero platform markups."
      }
    ]
  }
};

export default function HowItWorksLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howItWorksJsonLd) }}
      />
      {children}
    </>
  );
}
