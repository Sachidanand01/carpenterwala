'use client';
import { useState } from 'react';

export default function ProDashboard() {
  const [profile, setProfile] = useState({
    name: 'Ram Singh',
    trade: 'Carpenter',
    location: 'Bangalore South',
    about: 'Expert in modular kitchen fitting, wardrobe design, and antique furniture repair.',
    skills: 'Modular Kitchen, Wardrobes, Wood Polishing',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated! (This will save to Supabase in production)');
  };

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
        
        {/* Sidebar */}
        <div className="glass" style={{ width: "250px", padding: "1.5rem", alignSelf: "flex-start" }}>
          <div className="flex flex-col items-center gap-2" style={{ marginBottom: "2rem" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "bold" }}>
              R
            </div>
            <h3 style={{ textAlign: "center" }}>Ram Singh</h3>
            <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>Pro Member</span>
          </div>

          <nav className="flex flex-col gap-2">
            <a href="#" style={{ padding: "0.75rem", background: "rgba(255,255,255,0.1)", borderRadius: "8px", fontWeight: 500 }}>Profile</a>
            <a href="#" style={{ padding: "0.75rem", borderRadius: "8px", opacity: 0.7 }}>Leads</a>
            <a href="#" style={{ padding: "0.75rem", borderRadius: "8px", opacity: 0.7 }}>Reviews</a>
            <a href="#" style={{ padding: "0.75rem", borderRadius: "8px", opacity: 0.7 }}>Settings</a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="glass flex-col" style={{ flex: "1", padding: "2.5rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Digital Shopfront</h1>
          <p style={{ opacity: 0.8, marginBottom: "2rem" }}>Update your public profile details here.</p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
              <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Full Name</label>
                <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} style={{
                  padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
                }} />
              </div>
              <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Trade / Profession</label>
                <input type="text" value={profile.trade} onChange={e => setProfile({...profile, trade: e.target.value})} style={{
                  padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
                }} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Service Area / Location</label>
              <input type="text" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} style={{
                padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
              }} />
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>About Me</label>
              <textarea rows="4" value={profile.about} onChange={e => setProfile({...profile, about: e.target.value})} style={{
                padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", resize: "vertical"
              }}></textarea>
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Skills (comma separated)</label>
              <input type="text" value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} style={{
                padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
              }} />
            </div>

            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--glass-border)" }}>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
