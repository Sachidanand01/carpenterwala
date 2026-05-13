import Link from 'next/link';

export const metadata = {
  title: "Contact Us | Carpenterwala",
  description: "Get in touch with Carpenterwala for any queries, support, or feedback. We are here to help you with your home improvement needs.",
};

export default function ContactUs() {
  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="text-gradient" style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>Contact Us</h1>
        <p style={{ opacity: 0.8, fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
          We're here to help. Whether you have a question about our services, need help with a booking, or want to join as a pro.
        </p>
      </div>

      <div className="footer-grid" style={{ marginBottom: "5rem", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {/* Support Cards */}
        <div className="glass" style={{ padding: "2.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✉️</div>
          <h3 style={{ marginBottom: "0.5rem" }}>Email Us</h3>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem", fontSize: "0.95rem" }}>Our team usually responds within 24 hours.</p>
          <a href="mailto:contact@carpenterwala.com" style={{ color: "var(--primary)", fontWeight: "bold" }}>contact@carpenterwala.com</a>
        </div>

        <div className="glass" style={{ padding: "2.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏢</div>
          <h3 style={{ marginBottom: "0.5rem" }}>Head Office</h3>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem", fontSize: "0.95rem" }}>Visit us for corporate inquiries.</p>
          <p style={{ fontSize: "0.9rem" }}>Promenade Road, Bangalore, KA</p>
        </div>

        <div className="glass" style={{ padding: "2.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>❓</div>
          <h3 style={{ marginBottom: "0.5rem" }}>Help Center</h3>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem", fontSize: "0.95rem" }}>Find answers in our extensive FAQ.</p>
          <Link href="/faq" className="btn btn-secondary" style={{ padding: "0.5rem 1.5rem" }}>Go to FAQ</Link>
        </div>
      </div>

      <div className="footer-grid" style={{ gridTemplateColumns: "1.5fr 1fr", gap: "4rem" }}>
        {/* Contact Form */}
        <div className="glass" style={{ padding: "3rem" }}>
          <h2 style={{ marginBottom: "2rem" }}>Send us a Message</h2>
          <form className="flex flex-col gap-6">
            <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
              <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.8 }}>Full Name</label>
                <input type="text" placeholder="John Doe" style={{
                  padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
                }} />
              </div>
              <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.8 }}>Email Address</label>
                <input type="email" placeholder="john@example.com" style={{
                  padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
                }} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.8 }}>Subject</label>
              <select style={{
                padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(30,41,59,0.9)", color: "white"
              }}>
                <option>General Inquiry</option>
                <option>Booking Issue</option>
                <option>Partner with us</option>
                <option>Feedback</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.8 }}>Message</label>
              <textarea rows="5" placeholder="How can we help you?" style={{
                padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", resize: "vertical"
              }}></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "1rem 2.5rem" }}>
              Submit Message
            </button>
          </form>
        </div>

        {/* Office Info */}
        <div className="flex flex-col gap-8">
          <div>
            <h3 style={{ marginBottom: "1.5rem" }}>Our Regional Offices</h3>
            <div className="flex flex-col gap-6">
              <div className="glass" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--primary)", marginBottom: "0.25rem" }}>Bangalore (Head Office)</h4>
                <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>#40 Promenade Road, Milwaukee Building, Bangalore, Karnataka.</p>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: "2rem", background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(245, 158, 11, 0.1))" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>Corporate Inquiries</h4>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", marginBottom: "1rem" }}>Interested in a business partnership or bulk requirements?</p>
            <a href="mailto:corporate@carpenterwala.com" className="text-gradient" style={{ fontWeight: "bold" }}>corporate@carpenterwala.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}
