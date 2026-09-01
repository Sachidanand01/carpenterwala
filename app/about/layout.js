export const metadata = {
  title: "About Us - Verified Handyman Marketplace | Carpenterwala",
  description: "Learn more about Carpenterwala, India's premier digital marketplace for professional handymen.",
  alternates: {
    canonical: 'https://carpenterwala.com/about',
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://carpenterwala.com/about#webpage",
  "name": "About Carpenterwala",
  "url": "https://carpenterwala.com/about",
  "description": "Learn more about Carpenterwala, India's premier digital marketplace for professional handymen.",
  "publisher": {
    "@type": "Organization",
    "name": "Carpenterwala",
    "url": "https://carpenterwala.com",
    "logo": "https://carpenterwala.com/images/logo.png"
  },
  "mainEntity": {
    "@type": "Organization",
    "name": "Carpenterwala",
    "url": "https://carpenterwala.com",
    "description": "Bangalore's trusted marketplace for skilled carpenters, painters, plumbers, and electricians.",
    "foundingLocation": {
      "@type": "Place",
      "name": "Bangalore, India"
    }
  }
};

export default function AboutLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      {children}
    </>
  );
}
