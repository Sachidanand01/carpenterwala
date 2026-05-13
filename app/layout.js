import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Carpenterwala | Professional Handyman Marketplace",
  description: "Find trusted and verified carpenters, painters, and handymen near you. Book services easily with transparent pricing and real reviews.",
  keywords: ["carpenter bangalore", "painter bangalore", "plumber bangalore", "electrician bangalore", "handyman services", "home repair"],
  openGraph: {
    title: "Carpenterwala | Professional Handyman Marketplace",
    description: "Book verified carpenters, painters, and home improvement experts in Bangalore.",
    url: "https://carpenterwala.com",
    siteName: "Carpenterwala",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carpenterwala | Professional Handyman Marketplace",
    description: "Find trusted and verified handymen near you.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Carpenterwala",
  "url": "https://carpenterwala.com",
  "logo": "https://carpenterwala.com/images/logo.png",
  "sameAs": [
    "https://facebook.com/carpenterwala",
    "https://instagram.com/carpenterwala",
    "https://linkedin.com/company/carpenterwala"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXXXXXXXXX",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": "en"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main style={{ paddingTop: "70px", minHeight: "100vh" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
