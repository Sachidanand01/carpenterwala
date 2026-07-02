import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata = {
  title: "Contact Us - Customer Care & Support | Carpenterwala",
  description: "Get in touch with Carpenterwala for any queries, support, or feedback. We are here to help you with your home improvement needs.",
  alternates: {
    canonical: 'https://carpenterwala.com/contact',
  },
};

export default function ContactUs() {
  return (
    <div className="container animate-fade-in" style={{ padding: "2rem 2rem 4rem 2rem" }}>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Contact Us", url: "/contact" }
      ]} />
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
          <h2 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>Email Us</h2>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem", fontSize: "0.95rem" }}>Our team usually responds within 24 hours.</p>
          <span dangerouslySetInnerHTML={{ __html: '<!--email_off-->' }} />
          <a href="mailto:contact@carpenterwala.com" style={{ color: "var(--primary)", fontWeight: "bold" }}>contact@carpenterwala.com</a>
          <span dangerouslySetInnerHTML={{ __html: '<!--/email_off-->' }} />
        </div>

        <div className="glass" style={{ padding: "2.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏢</div>
          <h2 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>Head Office</h2>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem", fontSize: "0.95rem" }}>Visit us for corporate inquiries.</p>
          <p style={{ fontSize: "0.9rem" }}>Thanisandra, Bangalore, KA, India</p>
        </div>

        <div className="glass" style={{ padding: "2.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>❓</div>
          <h2 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>Help Center</h2>
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
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>Our Regional Offices</h2>
            <div className="flex flex-col gap-6" style={{ marginBottom: "1.5rem" }}>
              <div className="glass" style={{ padding: "1.5rem" }}>
                <h3 style={{ color: "var(--primary)", marginBottom: "0.25rem", fontSize: "1.1rem" }}>Bangalore (Head Office)</h3>
                <p style={{ opacity: 0.7, fontSize: "0.9rem", marginBottom: "0.5rem" }}>Thanisandra, Bangalore, Karnataka, India.</p>
                <p style={{ fontSize: "0.9rem" }}>
                  📞 Support: <a href="tel:+918095551001" style={{ color: "var(--accent)", fontWeight: "bold", textDecoration: "none" }}>+91-80-4912-3456</a>
                </p>
              </div>
            </div>

            {/* Google Map Embed of Thanisandra, Bangalore */}
            <div className="glass" style={{ padding: "1rem", height: "300px", overflow: "hidden", borderRadius: "12px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15546.73516543886!2d77.62544299863836!3d13.055811068832047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1e4b3e6c0ea7%3A0xebc30eb7b03b10b0!2sThanisandra%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1719919543180!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Carpenterwala Thanisandra Location Map"
              ></iframe>
            </div>
          </div>

          <div className="glass" style={{ padding: "2rem", background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(245, 158, 11, 0.1))" }}>
            <h3 style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>Corporate Inquiries</h3>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", marginBottom: "1rem" }}>Interested in a business partnership or bulk requirements?</p>
            <span dangerouslySetInnerHTML={{ __html: '<!--email_off-->' }} />
            <a href="mailto:corporate@carpenterwala.com" className="text-gradient" style={{ fontWeight: "bold" }}>corporate@carpenterwala.com</a>
            <span dangerouslySetInnerHTML={{ __html: '<!--/email_off-->' }} />
          </div>
        </div>
      </div>

      {/* Search Engine Information Block */}
      <div className="glass" style={{ padding: "3rem", marginTop: "4rem", lineHeight: "1.7", opacity: 0.9 }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Our Service Commitment & Regional Operations</h2>
        <p style={{ marginBottom: "1.2rem" }}>
          At Carpenterwala, we are dedicated to providing the highest standards of customer care. When you <strong>contact Carpenterwala</strong>, your request is routed directly to our centralized support team in Bangalore. We specialize in matching homeowners with vetted professionals for custom carpentry, interior painting, household plumbing, and electrical installations.
        </p>
        <p style={{ marginBottom: "1.2rem" }}>
          Need to report a booking issue, request an estimate for a large-scale commercial project, or ask about our partner program? Our local team handles standard support tickets within 24 hours. For businesses looking to establish regional partnerships, our corporate office provides bespoke service contracts tailored to real estate managers and office fit-outs.
        </p>
        <p>
          We physically verify all our local service providers, ensuring that every professional is vetted for both skill and safety. Reach out to our team today to get your home renovation projects started with peace of mind.
        </p>
      </div>
    </div>
  );
}
