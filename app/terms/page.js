import Link from 'next/link';

export const metadata = {
  title: "Terms and Conditions | Carpenterwala",
  description: "Read the terms and conditions for using the Carpenterwala platform. Our policies ensure a safe and reliable experience for both customers and professionals.",
};

const sections = [
  { id: "intro", title: "1. Introduction", content: "Welcome to Carpenterwala. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to comply with and be bound by these terms." },
  { id: "services", title: "2. Services", content: "Carpenterwala provides a marketplace that connects users (Customers) with independent service professionals (Pros). Carpenterwala does not provide the services directly but acts as an intermediary to facilitate bookings and payments." },
  { id: "booking", title: "3. Booking & Payments", content: "All bookings must be made through the Carpenterwala platform. Payments are processed securely via our integrated payment gateway. Customers agree to pay the fees associated with the booked service, including any platform fees." },
  { id: "cancellation", title: "4. Cancellation & Refunds", content: "Cancellations made more than 24 hours before the scheduled service are eligible for a full refund. Cancellations made within 24 hours may incur a cancellation fee. Refunds are processed within 5-7 business days." },
  { id: "user-conduct", title: "5. User Responsibilities", content: "Users are responsible for providing accurate information and ensuring a safe working environment for the Professionals. Any harassment or inappropriate behavior will result in immediate suspension from the platform." },
  { id: "liability", title: "6. Limitation of Liability", content: "Carpenterwala is not responsible for any damages, losses, or disputes arising from the work performed by independent Professionals. We provide a platform for connection and our liability is limited to the platform fee paid for the service." },
  { id: "privacy", title: "7. Privacy", content: "Your use of the platform is also governed by our Privacy Policy. Please review it to understand how we collect and use your data." },
  { id: "governing-law", title: "8. Governing Law", content: "These terms are governed by the laws of India. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka." }
];

export default function TermsPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 2rem" }}>
      <div style={{ marginBottom: "4rem" }}>
        <h1 className="text-gradient" style={{ fontSize: "3rem", marginBottom: "1rem" }}>Terms & Conditions</h1>
        <p style={{ opacity: 0.7 }}>Last updated: May 2026</p>
      </div>

      <div className="footer-grid" style={{ gridTemplateColumns: "1fr 3fr", gap: "4rem", alignItems: "start" }}>
        {/* Sidebar Navigation */}
        <div className="glass sticky-top" style={{ padding: "1.5rem", position: "sticky", top: "2rem" }}>
          <h4 style={{ marginBottom: "1.5rem", fontSize: "1rem", color: "var(--primary)" }}>TABLE OF CONTENTS</h4>
          <nav className="flex flex-col gap-3">
            {sections.map(section => (
              <a 
                key={section.id} 
                href={`#${section.id}`} 
                className="toc-link"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-8">
          {sections.map(section => (
            <div key={section.id} id={section.id} className="glass" style={{ padding: "2.5rem" }}>
              <h2 style={{ marginBottom: "1.5rem", fontSize: "1.8rem" }}>{section.title}</h2>
              <p style={{ lineHeight: "1.8", opacity: 0.8, fontSize: "1.05rem" }}>
                {section.content}
              </p>
            </div>
          ))}

          <div className="glass" style={{ padding: "2rem", textAlign: "center", background: "rgba(59, 130, 246, 0.1)" }}>
            <p style={{ marginBottom: "1.5rem" }}>Have questions about our terms?</p>
            <Link href="/contact" className="btn btn-primary">Contact Legal Team</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
