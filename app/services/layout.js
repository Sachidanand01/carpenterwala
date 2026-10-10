export const metadata = {
  title: "Our Handyman Services | Carpenterwala",
  description: "Explore our wide range of professional handyman services in Bangalore, including carpentry, painting, plumbing, and electrical work.",
  alternates: {
    canonical: 'https://carpenterwala.com/services',
  },
  openGraph: {
    title: "Our Handyman Services | Carpenterwala",
    description: "Explore our wide range of professional handyman services in Bangalore, including carpentry, painting, plumbing, and electrical work.",
    url: "https://carpenterwala.com/services",
    siteName: "Carpenterwala",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/carpentry-hero.png",
        width: 1200,
        height: 630,
        alt: "Carpenterwala Handyman Services in Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Handyman Services | Carpenterwala",
    description: "Explore our wide range of professional handyman services in Bangalore, including carpentry, painting, plumbing, and electrical work.",
    images: ["/images/carpentry-hero.png"],
  },
};

export default function ServicesLayout({ children }) {
  return children;
}
