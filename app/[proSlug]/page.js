import { getProfileBySlug } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import VerifiedBadge from '@/components/VerifiedBadge';
import LeadCaptureModal from '@/components/LeadCaptureModal';

export async function generateMetadata({ params }) {
  const { proSlug } = await params;
  const profile = await getProfileBySlug(proSlug);
  if (!profile) return { title: 'Not Found' };
  
  return {
    title: `${profile.name} - ${profile.trade} | Carpenterwala`,
    description: profile.about,
  };
}

export default async function ProProfile({ params }) {
  const { proSlug } = await params;
  const profile = await getProfileBySlug(proSlug);

  if (!profile) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: "3rem 2rem" }}>
      <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
        
        {/* Left Column: Profile Card */}
        <div style={{ flex: "1", minWidth: "300px", maxWidth: "400px" }}>
          <div className="glass flex flex-col items-center animate-fade-in" style={{ padding: "2rem", textAlign: "center", position: "sticky", top: "90px" }}>
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginBottom: "1rem", border: "4px solid var(--primary)" }}
            />
            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{profile.name}</h1>
            
            <div className="flex gap-2 items-center justify-center" style={{ marginBottom: "1.5rem" }}>
              <span style={{ padding: "0.25rem 0.75rem", background: "rgba(255,255,255,0.1)", borderRadius: "20px", fontSize: "0.85rem" }}>
                {profile.trade}
              </span>
              {profile.verified && <VerifiedBadge />}
            </div>

            <div className="flex flex-col gap-2" style={{ width: "100%", textAlign: "left", marginBottom: "2rem", fontSize: "0.9rem" }}>
              <div className="flex justify-between">
                <span style={{ opacity: 0.7 }}>Experience</span>
                <span style={{ fontWeight: 600 }}>{profile.experience}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ opacity: 0.7 }}>Location</span>
                <span style={{ fontWeight: 600 }}>{profile.location}</span>
              </div>
            </div>

            <LeadCaptureModal proName={profile.name} proId={profile.id} />
          </div>
        </div>

        {/* Right Column: Details & Portfolio */}
        <div className="flex flex-col gap-8 animate-fade-in delay-200" style={{ flex: "2", minWidth: "300px" }}>
          
          <section className="glass" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>About</h2>
            <p style={{ opacity: 0.8, lineHeight: 1.8 }}>{profile.about}</p>
            
            <h3 style={{ fontSize: "1.2rem", marginTop: "1.5rem", marginBottom: "1rem" }}>Skills</h3>
            <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
              {(profile.skills || []).map((skill, i) => (
                <span key={i} style={{ padding: "0.4rem 1rem", background: "var(--secondary)", borderRadius: "6px", fontSize: "0.85rem" }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {profile.portfolio && profile.portfolio.length > 0 && (
            <section className="glass" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Portfolio</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {profile.portfolio.map((img, i) => (
                  <img key={i} src={img} alt={`Work by ${profile.name}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} />
                ))}
              </div>
            </section>
          )}

          <section className="glass" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Reviews</h2>
            <div className="flex flex-col gap-4">
              {(profile.reviews || []).map(review => (
                <div key={review.id} style={{ padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: 600 }}>{review.author}</span>
                    <span style={{ color: "#facc15" }}>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span>
                  </div>
                  <p style={{ opacity: 0.8, fontSize: "0.95rem" }}>{review.text}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
