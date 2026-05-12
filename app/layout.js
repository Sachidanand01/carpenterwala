import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Footer from "@/components/Footer";

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
        <nav className="glass" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderRadius: 0,
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none"
        }}>
          <div className="container flex items-center justify-between" style={{ height: "70px" }}>
            <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
              <span className="text-gradient" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                Carpenterwala
              </span>
            </Link>
            <div className="flex gap-4 items-center">
              <Link href="/find-a-professional" style={{ fontWeight: 500, opacity: 0.8 }}>Find a Pro</Link>
              <Link href="/services" style={{ fontWeight: 500, opacity: 0.8 }}>Services</Link>
              <a href="/pro/login" className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>
                Pro Login
              </a>
            </div>
          </div>
        </nav>
        <main style={{ paddingTop: "70px", minHeight: "100vh" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
