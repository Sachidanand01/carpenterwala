import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex flex-col justify-center" style={{ minHeight: "calc(100vh - 70px)" }}>
      <section className="flex flex-col items-center justify-center gap-8" style={{ padding: "4rem 0", textAlign: "center" }}>
        
        <div className="animate-fade-in" style={{ maxWidth: "800px" }}>
          <h1 style={{ fontSize: "4rem", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Your Trusted <br/>
            <span className="text-gradient">Handyman Professionals</span>
          </h1>
          <p style={{ fontSize: "1.25rem", opacity: 0.8, marginBottom: "2rem" }}>
            Book verified carpenters, painters, and home improvement experts. Real reviews, transparent pricing, and guaranteed quality.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/find-a-professional" className="btn btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}>
              Find a Professional
            </Link>
            <Link href="/pro/login" className="btn btn-secondary" style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}>
              Join as a Pro
            </Link>
          </div>
        </div>

        <div className="glass animate-fade-in delay-200" style={{ width: "100%", padding: "2rem", marginTop: "3rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Why Choose Carpenterwala?</h2>
          <div className="flex justify-between gap-4" style={{ textAlign: "left", flexWrap: "wrap" }}>
            <div className="flex-col gap-2" style={{ flex: "1", minWidth: "250px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛡️</div>
              <h3 style={{ fontSize: "1.25rem" }}>Verified Pros</h3>
              <p style={{ opacity: 0.7 }}>Every handyman on our platform goes through a strict background check and skills verification process.</p>
            </div>
            <div className="flex-col gap-2" style={{ flex: "1", minWidth: "250px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⭐</div>
              <h3 style={{ fontSize: "1.25rem" }}>Real Reviews</h3>
              <p style={{ opacity: 0.7 }}>Read genuine reviews and see portfolio photos from past clients before making your decision.</p>
            </div>
            <div className="flex-col gap-2" style={{ flex: "1", minWidth: "250px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
              <h3 style={{ fontSize: "1.25rem" }}>Instant Contact</h3>
              <p style={{ opacity: 0.7 }}>Connect directly with professionals securely through our platform to get quotes fast.</p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
