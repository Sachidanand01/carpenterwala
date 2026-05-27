'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TABS = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'leads', label: '📋 Leads' },
  { id: 'profile', label: '👤 My Profile' },
  { id: 'portfolio', label: '📸 Portfolio' },
  { id: 'reviews', label: '⭐ Reviews' },
];

function StatCard({ label, value, sub, color }) {
  return (
    <div className="glass" style={{
      padding: '1.5rem', borderRadius: '14px', flex: '1', minWidth: '140px',
      borderTop: `3px solid ${color}`, position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontWeight: 600, marginTop: '0.25rem', fontSize: '0.95rem' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.8rem', opacity: 0.55, marginTop: '0.2rem' }}>{sub}</div>}
    </div>
  );
}

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>★</span>
      ))}
    </span>
  );
}

export default function ProDashboard() {
  const [tab, setTab] = useState('overview');
  const [proInfo, setProInfo] = useState(null);
  const [profile, setProfile] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [form, setForm] = useState({});
  const [portfolio, setPortfolio] = useState([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [portfolioStatus, setPortfolioStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('pro_id');
    if (!id) { router.push('/pro/login'); return; }
    setProInfo({
      id, slug: localStorage.getItem('pro_slug'),
      name: localStorage.getItem('pro_name'),
      trade: localStorage.getItem('pro_trade'),
    });
    fetchData(id);
  }, [router]);

  const fetchData = async (id) => {
    setLoadingProfile(true);
    try {
      const [profRes, leadsRes] = await Promise.all([
        fetch(`/api/pro/profile?id=${id}`),
        fetch(`/api/pro/leads?pro_id=${id}`),
      ]);
      const profData = await profRes.json();
      const leadsData = await leadsRes.json();
      if (profData.profile) {
        setProfile(profData.profile);
        setPortfolio(profData.profile.portfolio || []);
        setForm({
          name: profData.profile.name || '',
          trade: profData.profile.trade || '',
          experience: profData.profile.experience || '',
          location: profData.profile.location || '',
          about: profData.profile.about || '',
          skills: Array.isArray(profData.profile.skills) ? profData.profile.skills.join(', ') : '',
        });
      }
      if (leadsData.leads) setLeads(leadsData.leads);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = () => {
    ['pro_id','pro_slug','pro_name','pro_trade'].forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new Event('pro-login-changed'));
    router.push('/pro/login');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/pro/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: proInfo.id, ...form }),
      });
      if (res.ok) {
        setSaveStatus('saved');
        localStorage.setItem('pro_name', form.name);
        localStorage.setItem('pro_trade', form.trade);
        setTimeout(() => setSaveStatus(''), 3000);
      } else setSaveStatus('error');
    } catch { setSaveStatus('error'); }
  };

  const handleAddPhoto = () => {
    const url = newPhotoUrl.trim();
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      setPortfolioStatus('invalid'); setTimeout(() => setPortfolioStatus(''), 2000); return;
    }
    if (portfolio.includes(url)) { setPortfolioStatus('duplicate'); setTimeout(() => setPortfolioStatus(''), 2000); return; }
    setPortfolio(prev => [...prev, url]);
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (url) => setPortfolio(prev => prev.filter(p => p !== url));

  const handleSavePortfolio = async () => {
    setPortfolioStatus('saving');
    try {
      const res = await fetch('/api/pro/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: proInfo.id, portfolio }),
      });
      if (res.ok) { setPortfolioStatus('saved'); setTimeout(() => setPortfolioStatus(''), 3000); }
      else setPortfolioStatus('error');
    } catch { setPortfolioStatus('error'); }
  };

  const avgRating = profile?.reviews?.length
    ? (profile.reviews.reduce((s, r) => s + r.rating, 0) / profile.reviews.length).toFixed(1)
    : '—';

  const inputStyle = {
    padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', width: '100%'
  };

  if (loadingProfile) return (
    <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ textAlign: 'center', opacity: 0.7 }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚙️</div>
        <p>Loading your dashboard…</p>
      </div>
    </div>
  );

  const displayName = profile?.name || proInfo?.name || 'Pro';
  const displayTrade = profile?.trade || proInfo?.trade || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', padding: '2rem 0' }}>
      <div className="container">

        {/* Top header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '1.3rem', flexShrink: 0
            }}>{initial}</div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Welcome, {displayName.split(' ')[0]}!</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <span style={{
                  background: 'rgba(59,130,246,0.2)', color: 'var(--primary)',
                  padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
                }}>{displayTrade}</span>
                {profile?.verified && (
                  <span style={{
                    background: 'rgba(52,211,153,0.15)', color: '#34d399',
                    padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
                  }}>✓ Verified</span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href={`/${proInfo?.slug}`} target="_blank" style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
              fontSize: '0.85rem', fontWeight: 500, opacity: 0.8
            }}>View Public Profile ↗</Link>
            <button onClick={handleLogout} className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Sign Out</button>
          </div>
        </div>

        {/* Tab Nav */}
        <div style={{
          display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.04)',
          borderRadius: '12px', padding: '0.35rem', marginBottom: '2rem',
          border: '1px solid var(--glass-border)', flexWrap: 'wrap'
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '0.6rem 1.1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
              background: tab === t.id ? 'var(--primary)' : 'transparent',
              color: tab === t.id ? 'white' : 'rgba(255,255,255,0.6)',
              boxShadow: tab === t.id ? '0 2px 12px rgba(59,130,246,0.35)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <StatCard label="Total Leads" value={leads.length} sub="All time" color="var(--primary)" />
              <StatCard label="Avg Rating" value={avgRating} sub={`${profile?.reviews?.length || 0} reviews`} color="#f59e0b" />
              <StatCard label="Reviews" value={profile?.reviews?.length || 0} sub="From customers" color="#34d399" />
              <StatCard label="Profile" value={profile?.verified ? '✓' : '—'} sub={profile?.verified ? 'Verified Pro' : 'Pending'} color={profile?.verified ? '#34d399' : 'rgba(255,255,255,0.3)'} />
            </div>

            {/* Recent Leads */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Leads</h2>
                <button onClick={() => setTab('leads')} style={{
                  background: 'none', border: 'none', color: 'var(--primary)',
                  fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600
                }}>View all →</button>
              </div>
              {leads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                  <p>No leads yet. Your profile is live — customers will find you!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {leads.slice(0, 5).map(lead => (
                    <div key={lead.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.9rem',
                      background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
                      border: '1px solid var(--glass-border)'
                    }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59,130,246,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, color: 'var(--primary)', flexShrink: 0
                      }}>{lead.name.charAt(0)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{lead.name}</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.65, marginTop: '0.1rem' }}>{lead.task}</div>
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5, whiteSpace: 'nowrap' }}>
                        {new Date(lead.created_at).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── LEADS TAB ── */}
        {tab === 'leads' && (
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '14px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              All Incoming Leads <span style={{ fontSize: '0.9rem', opacity: 0.5, fontWeight: 400 }}>({leads.length})</span>
            </h2>
            {leads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p>No leads yet. Keep your profile updated to attract more customers.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      {['Customer', 'Phone', 'Service Requested', 'Date'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 0.5rem', textAlign: 'left', opacity: 0.6, fontWeight: 600, fontSize: '0.8rem' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '0.9rem 0.5rem', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>
                              {lead.name.charAt(0)}
                            </div>
                            {lead.name}
                          </div>
                        </td>
                        <td style={{ padding: '0.9rem 0.5rem', opacity: 0.7, fontFamily: 'monospace' }}>
                          {lead.phone.replace(/(\d{5})(\d{5})/, '$1*****')}
                        </td>
                        <td style={{ padding: '0.9rem 0.5rem', opacity: 0.8 }}>{lead.task}</td>
                        <td style={{ padding: '0.9rem 0.5rem', opacity: 0.55, fontSize: '0.8rem' }}>
                          {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '14px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>Edit My Profile</h2>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Changes will appear on your public listing at <Link href={`/${proInfo?.slug}`} style={{ color: 'var(--primary)' }}>carpenterwala.com/{proInfo?.slug}</Link>
            </p>
            <form className="flex flex-col gap-4" onSubmit={handleSaveProfile}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Full Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Trade / Profession</label>
                  <input type="text" value={form.trade} onChange={e => setForm({...form, trade: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Years of Experience</label>
                  <input type="text" placeholder="e.g. 8 Years" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Service Area / Location</label>
                  <input type="text" placeholder="e.g. Indiranagar, Bangalore" value={form.location} onChange={e => setForm({...form, location: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>About Me</label>
                <textarea rows={4} value={form.about} onChange={e => setForm({...form, about: e.target.value})}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Skills <span style={{ opacity: 0.5 }}>(comma separated)</span></label>
                <input type="text" placeholder="e.g. Interior Painting, Wall Texture, Waterproofing"
                  value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={saveStatus === 'saving'}>
                  {saveStatus === 'saving' ? 'Saving…' : 'Save Changes'}
                </button>
                {saveStatus === 'saved' && <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>✓ Profile updated!</span>}
                {saveStatus === 'error' && <span style={{ color: '#f87171', fontSize: '0.9rem' }}>Failed to save. Try again.</span>}
              </div>
            </form>
          </div>
        )}

        {/* ── PORTFOLIO TAB ── */}
        {tab === 'portfolio' && (
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '14px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>My Portfolio</h2>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Add photos of your past work. They will appear on your public profile to attract customers.
            </p>

            {/* Add new photo */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <input
                type="url"
                placeholder="Paste a photo URL (e.g. https://...)"
                value={newPhotoUrl}
                onChange={e => setNewPhotoUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddPhoto()}
                style={{ flex: 1, minWidth: '250px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem' }}
              />
              <button onClick={handleAddPhoto} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}>
                + Add Photo
              </button>
            </div>

            {portfolioStatus === 'invalid' && <div style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>⚠️ Please enter a valid URL starting with http:// or https://</div>}
            {portfolioStatus === 'duplicate' && <div style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>⚠️ This photo URL is already in your portfolio.</div>}

            {/* Photo grid */}
            {portfolio.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.45, border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '12px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🖼️</div>
                <p>No photos yet. Paste an image URL above to add your first portfolio photo.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Tip: Upload your photos to Google Drive, Imgur, or Unsplash and paste the direct link here.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {portfolio.map((url, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                    <img src={url} alt={`Portfolio ${i + 1}`}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                    <div style={{ display: 'none', height: '180px', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', fontSize: '0.8rem', opacity: 0.5 }}>Image failed to load</div>
                    <button onClick={() => handleRemovePhoto(url)} style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: '50%',
                      width: '28px', height: '28px', cursor: 'pointer', color: 'white',
                      fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {portfolio.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <button onClick={handleSavePortfolio} className="btn btn-primary" disabled={portfolioStatus === 'saving'}>
                  {portfolioStatus === 'saving' ? 'Saving…' : `Save Portfolio (${portfolio.length} photos)`}
                </button>
                {portfolioStatus === 'saved' && <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>✓ Portfolio updated on your public profile!</span>}
                {portfolioStatus === 'error' && <span style={{ color: '#f87171', fontSize: '0.9rem' }}>Failed to save. Try again.</span>}
              </div>
            )}
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {tab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="glass" style={{ padding: '1.5rem 2rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b' }}>{avgRating}</div>
                <Stars rating={Math.round(Number(avgRating))} />
                <div style={{ fontSize: '0.8rem', opacity: 0.55, marginTop: '0.4rem' }}>{profile?.reviews?.length || 0} reviews</div>
              </div>
              <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                Reviews are left by customers after they book your services. Keep delivering great work!
              </div>
            </div>

            {(!profile?.reviews || profile.reviews.length === 0) ? (
              <div className="glass" style={{ padding: '3rem', borderRadius: '14px', textAlign: 'center', opacity: 0.6 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⭐</div>
                <p>No reviews yet. Your first review will appear here once a customer rates you.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {profile.reviews.map(review => (
                  <div key={review.id} className="glass" style={{ padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{review.author}</div>
                        <Stars rating={review.rating} />
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                        {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    {review.text && <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>"{review.text}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
