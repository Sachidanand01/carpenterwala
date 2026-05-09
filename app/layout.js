import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Carpenterwala | Professional Handyman Marketplace",
  description: "Find trusted and verified carpenters, painters, and handymen near you. Book services easily with transparent pricing and real reviews.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
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
            <div className="flex items-center gap-2">
              <span className="text-gradient" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                Carpenterwala
              </span>
            </div>
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
      </body>
    </html>
  );
}
