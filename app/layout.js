import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
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
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Meta Pixel Code */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){
                if(f.fbq)return;
                n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1378071947473122');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1378071947473122&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        <Navbar />
        <main style={{ paddingTop: "var(--navbar-height)", minHeight: "100vh" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
