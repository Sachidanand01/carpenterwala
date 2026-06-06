'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProGuidedTour from '@/components/ProGuidedTour';

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
      {[1, 2, 3, 4, 5].map(i => (
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

  // Onboarding Wizard State
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardForm, setOnboardForm] = useState({
    phone: '',
    full_address: '',
    experience: '',
    about: '',
    skills: '',
    avatar: '',
    aadhaar_front: '',
    aadhaar_back: '',
    pan_front: '',
    pan_back: '',
    voter_driving_front: '',
    voter_driving_back: '',
    police_verification: '',
  });
  const [onboardError, setOnboardError] = useState('');
  const [savingStep, setSavingStep] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [tourActive, setTourActive] = useState(false);

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

  // Auto-start guided tour if profile is loaded and onboarding not completed
  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      const dismissed = localStorage.getItem('pro_tour_dismissed');
      if (!dismissed) {
        setTourActive(true);
      }
    }
  }, [profile]);

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

        // Populate standard form
        setForm({
          name: profData.profile.name || '',
          trade: profData.profile.trade || '',
          experience: profData.profile.experience || '',
          location: profData.profile.location || '',
          about: profData.profile.about || '',
          skills: Array.isArray(profData.profile.skills) ? profData.profile.skills.join(', ') : '',
        });

        // Populate onboarding wizard form
        setOnboardForm({
          phone: profData.profile.phone || '',
          full_address: profData.profile.full_address || '',
          experience: profData.profile.experience || '',
          about: profData.profile.about || '',
          skills: Array.isArray(profData.profile.skills) ? profData.profile.skills.join(', ') : '',
          avatar: profData.profile.avatar || '',
          aadhaar_front: profData.profile.aadhaar_front || '',
          aadhaar_back: profData.profile.aadhaar_back || '',
          pan_front: profData.profile.pan_front || '',
          pan_back: profData.profile.pan_back || '',
          voter_driving_front: profData.profile.voter_driving_front || '',
          voter_driving_back: profData.profile.voter_driving_back || '',
          police_verification: profData.profile.police_verification || '',
        });

        if (profData.profile.onboarding_step) {
          setOnboardStep(profData.profile.onboarding_step);
        }
      }
      if (leadsData.leads) setLeads(leadsData.leads);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = () => {
    ['pro_id', 'pro_slug', 'pro_name', 'pro_trade'].forEach(k => localStorage.removeItem(k));
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

  // Base64 Compression Utility
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_width = 600; // Keep image compact & responsive
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_width) {
              height *= max_width / width;
              width = max_width;
            }
          } else {
            if (height > max_width) {
              width *= max_width / height;
              height = max_width;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress JPEG with 0.6 quality for minimal payload overhead (avg ~40KB)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
      };
    });
  };

  // Handle file uploads in wizard
  const handleFileChange = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Must be image
    if (!file.type.startsWith('image/')) {
      setOnboardError('Please select a valid image file (PNG, JPG, JPEG).');
      return;
    }

    setOnboardError('');
    setUploadingField(field);
    try {
      const base64 = await compressImage(file);
      setOnboardForm(prev => ({ ...prev, [field]: base64 }));
    } catch (err) {
      setOnboardError('Failed to process image. Please try another copy.');
    } finally {
      setUploadingField(null);
    }
  };

  // Wizard Step Validation & Traversal
  const saveWizardProgress = async (nextStepVal, completionStatus = false) => {
    setSavingStep(true);
    setOnboardError('');
    try {
      const payload = {
        id: proInfo.id,
        ...onboardForm,
        onboarding_step: nextStepVal,
      };
      if (completionStatus) {
        payload.onboarding_completed = true;
      }

      const res = await fetch('/api/pro/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (completionStatus) {
          // Completed wizard! Trigger reload
          fetchData(proInfo.id);
        } else {
          setOnboardStep(nextStepVal);
        }
      } else {
        setOnboardError('Failed to save your progress. Please try again.');
      }
    } catch (err) {
      setOnboardError('Network error. Failed to save progress.');
    } finally {
      setSavingStep(false);
    }
  };

  const handleNextStep = () => {
    if (onboardStep === 1) {
      if (!onboardForm.phone || !/^[6-9]\d{9}$/.test(onboardForm.phone.trim())) {
        setOnboardError('Please enter a valid 10-digit mobile number.'); return;
      }
      if (!onboardForm.full_address || onboardForm.full_address.trim().length < 10) {
        setOnboardError('Please enter a complete, detailed current address (min 10 characters).'); return;
      }
      if (!onboardForm.experience || onboardForm.experience.trim() === '') {
        setOnboardError('Please specify your years of experience.'); return;
      }
      if (!onboardForm.about || onboardForm.about.trim().length < 15) {
        setOnboardError('Please write a brief about section so customers get to know you (min 15 characters).'); return;
      }
      saveWizardProgress(2);
    } else if (onboardStep === 2) {
      if (!onboardForm.aadhaar_front) {
        setOnboardError('Please scan and upload Aadhaar Card Front Side.'); return;
      }
      if (!onboardForm.aadhaar_back) {
        setOnboardError('Please scan and upload Aadhaar Card Back Side.'); return;
      }
      if (!onboardForm.pan_front) {
        setOnboardError('Please scan and upload PAN Card Front Side.'); return;
      }
      saveWizardProgress(3);
    } else if (onboardStep === 3) {
      if (!onboardForm.avatar) {
        setOnboardError('Please upload a clear profile photo to display on your public page.'); return;
      }
      if (!onboardForm.voter_driving_front) {
        setOnboardError('Please scan and upload Voter ID/Driving License (Front).'); return;
      }
      if (!onboardForm.police_verification) {
        setOnboardError('Please upload a copy of your Police Verification Certificate.'); return;
      }
      saveWizardProgress(4);
    }
  };

  const handlePrevStep = () => {
    if (onboardStep > 1) {
      setOnboardStep(prev => prev - 1);
    }
  };

  const handleCompleteOnboarding = () => {
    saveWizardProgress(4, true);
  };

  const avgRating = profile?.reviews?.length
    ? (profile.reviews.reduce((s, r) => s + r.rating, 0) / profile.reviews.length).toFixed(1)
    : '—';

  const inputStyle = {
    padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', width: '100%'
  };

  if (loadingProfile) return (
    <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
      <div style={{ textAlign: 'center', opacity: 0.7 }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚙️</div>
        <p>Loading your dashboard…</p>
      </div>
    </div>
  );

  const displayName = profile?.name || proInfo?.name || 'Pro';
  const displayTrade = profile?.trade || proInfo?.trade || '';
  const initial = displayName.charAt(0).toUpperCase();

  // ── ONBOARDING WIZARD SCREEN ──
  if (profile && !profile.onboarding_completed) {
    const stepsList = [
      { num: 1, label: '📞 Contact & Details' },
      { num: 2, label: '🆔 Identity Scans' },
      { num: 3, label: '🛡️ Background checks' },
      { num: 4, label: '🏁 Review & Submit' }
    ];

    const currentPercent = Math.round(((onboardStep - 1) / 3) * 100);

    return (
      <div style={{ minHeight: 'calc(100vh - var(--navbar-height))', padding: '3rem 0' }}>
        {/* Guided Tour Walkthrough Overlay */}
        <ProGuidedTour
          onboardStep={onboardStep}
          isActive={tourActive}
          setIsActive={setTourActive}
        />

        <div className="container" style={{ maxWidth: '780px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>✨ Carpenterwala Professional Portal</span>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>Complete Your Professional Profile</h1>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={() => setTourActive(true)}
                className="btn btn-secondary"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  borderColor: 'var(--accent)',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                📖 Guide / मदद
              </button>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Sign Out</button>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              {stepsList.map(s => (
                <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: onboardStep === s.num ? 'var(--primary)' : (onboardStep > s.num ? '#10b981' : 'rgba(255,255,255,0.1)'),
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 'bold'
                  }}>
                    {onboardStep > s.num ? '✓' : s.num}
                  </div>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: 600,
                    opacity: onboardStep === s.num ? 1 : 0.6,
                    color: onboardStep === s.num ? 'var(--primary)' : 'white'
                  }}>{s.label}</span>
                </div>
              ))}
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                width: `${currentPercent}%`, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.8rem', opacity: 0.65 }}>
              <span>Onboarding Progress</span>
              <span>{currentPercent}% Complete</span>
            </div>
          </div>

          {/* Error Banner */}
          {onboardError && (
            <div style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', padding: '0.9rem 1.25rem', borderRadius: '10px',
              fontSize: '0.9rem', marginBottom: '1.5rem'
            }}>⚠️ {onboardError}</div>
          )}

          {/* Form Wizard Step Card */}
          <div className="glass animate-fade-in" style={{ padding: '2.5rem', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>

            {/* STEP 1: CONTACT INFO & BIO */}
            {onboardStep === 1 && (
              <div className="flex flex-col gap-4">
                <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2.2rem' }}>📞</span>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Contact & Background</h2>
                    <p style={{ opacity: 0.65, fontSize: '0.85rem', marginTop: '0.1rem' }}>We require verified contact information for customer bookings.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '240px' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 600, opacity: 0.9 }}>Mobile Number (Mandatory for Contact)</label>
                    <input id="tour-phone" type="tel" maxLength={10} placeholder="e.g. 9876543210" value={onboardForm.phone}
                      onChange={e => setOnboardForm({ ...onboardForm, phone: e.target.value.replace(/\D/g, '') })} style={inputStyle} />
                  </div>
                  <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '240px' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 600, opacity: 0.9 }}>Years of Experience</label>
                    <input id="tour-experience" type="text" placeholder="e.g. 5 Years" value={onboardForm.experience}
                      onChange={e => setOnboardForm({ ...onboardForm, experience: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.88rem', fontWeight: 600, opacity: 0.9 }}>Full Address with Zipcode (Current Location for Booking Ranges)</label>
                  <textarea id="tour-address" rows={2} placeholder="Enter your full home or office address..." value={onboardForm.full_address}
                    onChange={e => setOnboardForm({ ...onboardForm, full_address: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>This remains strictly private and is never shown in your public listing.</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.88rem', fontWeight: 600, opacity: 0.9 }}>About Me / Description</label>
                  <textarea id="tour-about" rows={3} placeholder="Tell customers about your skills, specialties, and why they should hire you..." value={onboardForm.about}
                    onChange={e => setOnboardForm({ ...onboardForm, about: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.88rem', fontWeight: 600, opacity: 0.9 }}>Skills & Specialties <span style={{ opacity: 0.55 }}>(comma-separated)</span></label>
                  <input id="tour-skills" type="text" placeholder="e.g. Sofa Repairs, Modular Kitchens, Wooden Polish" value={onboardForm.skills}
                    onChange={e => setOnboardForm({ ...onboardForm, skills: e.target.value })} style={inputStyle} />
                </div>
              </div>
            )}

            {/* STEP 2: IDENTITY DOCUMENTS (Aadhaar & PAN) */}
            {onboardStep === 2 && (
              <div className="flex flex-col gap-5">
                <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2.2rem' }}>🆔</span>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Scan Identity Documents</h2>
                    <p style={{ opacity: 0.65, fontSize: '0.85rem', marginTop: '0.1rem' }}>Upload Aadhaar and PAN Card. Sensitive uploads are kept entirely confidential.</p>
                  </div>
                </div>

                {/* Aadhaar Card */}
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>1. Aadhaar Card Scan</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>

                    {/* Aadhaar Front */}
                    <div id="tour-aadhaar-front" style={{
                      padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--glass-border)',
                      borderRadius: '12px', textAlign: 'center', position: 'relative'
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>📇</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Aadhaar Front Side</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.2rem', marginBottom: '0.75rem' }}>Upload clear picture scan</div>

                      {onboardForm.aadhaar_front ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={onboardForm.aadhaar_front} style={{ width: '100%', maxHeight: '110px', objectFit: 'contain', borderRadius: '6px' }} />
                          <button onClick={() => setOnboardForm(prev => ({ ...prev, aadhaar_front: '' }))}
                            style={{ padding: '0.25rem 0.6rem', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                            Delete Scan
                          </button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-block' }}>
                          {uploadingField === 'aadhaar_front' ? 'Processing…' : '📷 Take Photo / Upload'}
                          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'aadhaar_front')} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>

                    {/* Aadhaar Back */}
                    <div id="tour-aadhaar-back" style={{
                      padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--glass-border)',
                      borderRadius: '12px', textAlign: 'center', position: 'relative'
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>📇</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Aadhaar Back Side</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.2rem', marginBottom: '0.75rem' }}>Upload address page scan</div>

                      {onboardForm.aadhaar_back ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={onboardForm.aadhaar_back} style={{ width: '100%', maxHeight: '110px', objectFit: 'contain', borderRadius: '6px' }} />
                          <button onClick={() => setOnboardForm(prev => ({ ...prev, aadhaar_back: '' }))}
                            style={{ padding: '0.25rem 0.6rem', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                            Delete Scan
                          </button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-block' }}>
                          {uploadingField === 'aadhaar_back' ? 'Processing…' : '📷 Take Photo / Upload'}
                          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'aadhaar_back')} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>

                  </div>
                </div>

                {/* PAN Card */}
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>2. PAN Card Scan</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>

                    {/* PAN Front */}
                    <div id="tour-pan-front" style={{
                      padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--glass-border)',
                      borderRadius: '12px', textAlign: 'center', position: 'relative'
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>💳</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>PAN Front Side</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.2rem', marginBottom: '0.75rem' }}>Upload details front scan</div>

                      {onboardForm.pan_front ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={onboardForm.pan_front} style={{ width: '100%', maxHeight: '110px', objectFit: 'contain', borderRadius: '6px' }} />
                          <button onClick={() => setOnboardForm(prev => ({ ...prev, pan_front: '' }))}
                            style={{ padding: '0.25rem 0.6rem', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                            Delete Scan
                          </button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-block' }}>
                          {uploadingField === 'pan_front' ? 'Processing…' : '📷 Take Photo / Upload'}
                          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'pan_front')} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>

                    {/* PAN Back (Optional) */}
                    <div id="tour-pan-back" style={{
                      padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--glass-border)',
                      borderRadius: '12px', textAlign: 'center', opacity: onboardForm.pan_back ? 1 : 0.7
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>💳</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>PAN Back Side <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>(Optional)</span></div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.2rem', marginBottom: '0.75rem' }}>Upload signature back scan</div>

                      {onboardForm.pan_back ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={onboardForm.pan_back} style={{ width: '100%', maxHeight: '110px', objectFit: 'contain', borderRadius: '6px' }} />
                          <button onClick={() => setOnboardForm(prev => ({ ...prev, pan_back: '' }))}
                            style={{ padding: '0.25rem 0.6rem', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                            Delete Scan
                          </button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-block', opacity: 0.8 }}>
                          {uploadingField === 'pan_back' ? 'Processing…' : '📷 Take Photo / Upload'}
                          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'pan_back')} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* STEP 3: BACKGROUND CHECK & DISPLAY PHOTO */}
            {onboardStep === 3 && (
              <div className="flex flex-col gap-5">
                <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2.2rem' }}>🛡️</span>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Background Verification & Profile Photo</h2>
                    <p style={{ opacity: 0.65, fontSize: '0.85rem', marginTop: '0.1rem' }}>We verify your background to list you with high integrity on the portal.</p>
                  </div>
                </div>

                {/* Profile Photo */}
                <div id="tour-avatar" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '90px', height: '90px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)', border: '2px solid var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', flexShrink: 0
                    }}>
                      {onboardForm.avatar ? (
                        <img src={onboardForm.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '2.5rem', opacity: 0.6 }}>👤</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Clear Public Profile Photo (Mandatory)</h3>
                      <p style={{ opacity: 0.55, fontSize: '0.78rem', marginTop: '0.15rem', marginBottom: '0.6rem' }}>This image is displayed to Bengaluru customers on your public profile page.</p>

                      {onboardForm.avatar ? (
                        <button onClick={() => setOnboardForm(prev => ({ ...prev, avatar: '' }))} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                          Change Profile Photo
                        </button>
                      ) : (
                        <label className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-block' }}>
                          {uploadingField === 'avatar' ? 'Processing…' : '📷 Take Portrait / Upload'}
                          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'avatar')} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Voter ID Front & Back */}
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>1. Voter ID or Driving License</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>

                    {/* Voter Front */}
                    <div id="tour-voter-front" style={{
                      padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--glass-border)',
                      borderRadius: '12px', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🪪</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Front Side Scan</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.2rem', marginBottom: '0.75rem' }}>Upload details front scan</div>

                      {onboardForm.voter_driving_front ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={onboardForm.voter_driving_front} style={{ width: '100%', maxHeight: '110px', objectFit: 'contain', borderRadius: '6px' }} />
                          <button onClick={() => setOnboardForm(prev => ({ ...prev, voter_driving_front: '' }))}
                            style={{ padding: '0.25rem 0.6rem', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                            Delete Scan
                          </button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-block' }}>
                          {uploadingField === 'voter_driving_front' ? 'Processing…' : '📷 Take Photo / Upload'}
                          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'voter_driving_front')} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>

                    {/* Voter Back */}
                    <div id="tour-voter-back" style={{
                      padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--glass-border)',
                      borderRadius: '12px', textAlign: 'center', opacity: onboardForm.voter_driving_back ? 1 : 0.7
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🪪</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Back Side Scan <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>(Optional)</span></div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.2rem', marginBottom: '0.75rem' }}>Upload address back scan</div>

                      {onboardForm.voter_driving_back ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={onboardForm.voter_driving_back} style={{ width: '100%', maxHeight: '110px', objectFit: 'contain', borderRadius: '6px' }} />
                          <button onClick={() => setOnboardForm(prev => ({ ...prev, voter_driving_back: '' }))}
                            style={{ padding: '0.25rem 0.6rem', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                            Delete Scan
                          </button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-block', opacity: 0.8 }}>
                          {uploadingField === 'voter_driving_back' ? 'Processing…' : '📷 Take Photo / Upload'}
                          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'voter_driving_back')} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>

                  </div>
                </div>

                {/* Police Verification copy */}
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>2. Official Police Verification Copy (Mandatory)</h3>
                  <div id="tour-police" style={{
                    padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--glass-border)',
                    borderRadius: '12px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>👮‍♂️</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Police Verification Certificate Scan</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.2rem', marginBottom: '0.75rem' }}>Upload certificate image (PNG/JPG)</div>

                    {onboardForm.police_verification ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={onboardForm.police_verification} style={{ width: '100%', maxHeight: '140px', objectFit: 'contain', borderRadius: '6px' }} />
                        <button onClick={() => setOnboardForm(prev => ({ ...prev, police_verification: '' }))}
                          style={{ padding: '0.25rem 0.6rem', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                          Delete Scan
                        </button>
                      </div>
                    ) : (
                      <label className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-block' }}>
                        {uploadingField === 'police_verification' ? 'Processing…' : '📷 Take Portrait / Upload Scan'}
                        <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'police_verification')} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 4: REVIEW & CONFIRM */}
            {onboardStep === 4 && (
              <div className="flex flex-col gap-5">
                <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2.2rem' }}>🏁</span>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Review Profile Details</h2>
                    <p style={{ opacity: 0.65, fontSize: '0.85rem', marginTop: '0.1rem' }}>Double check all data before submitting for admin verification.</p>
                  </div>
                </div>

                <div id="tour-summary" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.88rem' }}>Name</span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{displayName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.88rem' }}>Profession / Trade</span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{displayTrade}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.88rem' }}>Contact Mobile</span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', fontFamily: 'monospace' }}>{onboardForm.phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.88rem' }}>Experience</span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{onboardForm.experience}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.88rem' }}>Private Home Address</span>
                    <span style={{ fontSize: '0.85rem' }}>{onboardForm.full_address}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', margin: '0.5rem 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Front ID</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Aadhaar</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Back ID</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Aadhaar</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ PAN Front</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Identity card</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Background Scan</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Police cert</span>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>👮 Confidentiality & Verification Guarantee</h3>
                  <p style={{ fontSize: '0.78rem', opacity: 0.85, lineHeight: 1.5 }}>
                    Your documents are stored securely and never made accessible via public URLs or search queries. Administrators will review your identity and background check within 24 hours. Your public listing status will automatically switch to **Verified (✓)** upon successful verification.
                  </p>
                </div>
              </div>
            )}

            {/* Traversal Buttons */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              {onboardStep > 1 ? (
                <button onClick={handlePrevStep} className="btn btn-secondary" style={{ padding: '0.7rem 1.5rem' }}>
                  ← Previous Step
                </button>
              ) : (
                <div />
              )}

              {onboardStep < 4 ? (
                <button id="tour-next-btn" onClick={handleNextStep} disabled={savingStep} className="btn btn-primary" style={{ padding: '0.7rem 1.8rem' }}>
                  {savingStep ? 'Saving Progress…' : 'Next Step →'}
                </button>
              ) : (
                <button id="tour-submit" onClick={handleCompleteOnboarding} disabled={savingStep} className="btn btn-primary" style={{
                  padding: '0.7rem 2.2rem', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none',
                  boxShadow: '0 4px 15px rgba(16,185,129,0.3)'
                }}>
                  {savingStep ? 'Submitting Profile…' : '🚀 Complete & Submit Profile'}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── STANDARD PRO DASHBOARD Experience ──
  return (
    <div style={{ minHeight: 'calc(100vh - var(--navbar-height))', padding: '2rem 0' }}>
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
                {profile?.verified ? (
                  <span style={{
                    background: 'rgba(52,211,153,0.15)', color: '#34d399',
                    padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
                  }}>✓ Verified</span>
                ) : (
                  <span style={{
                    background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
                    padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
                  }}>⏳ Verification Pending</span>
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

            {/* Pending Verification Notice */}
            {!profile?.verified && (
              <div className="glass" style={{
                padding: '1.25rem 1.5rem', borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.15)', borderLeftWidth: '4px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '1.8rem' }}>🛡️</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b' }}>Profile Submission Under Verification Review</h3>
                  <p style={{ fontSize: '0.82rem', opacity: 0.8, marginTop: '0.15rem' }}>
                    Your onboarding documentation is being audited. Our safety and verification team normally reviews submissions within 24 hours. Your profile is kept hidden from public searches until review completes successfully.
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <StatCard label="Total Leads" value={leads.length} sub="All time" color="var(--primary)" />
              <StatCard label="Avg Rating" value={avgRating} sub={`${profile?.reviews?.length || 0} reviews`} color="#f59e0b" />
              <StatCard label="Reviews" value={profile?.reviews?.length || 0} sub="From customers" color="#34d399" />
              <StatCard label="Verification Status" value={profile?.verified ? 'Verified ✓' : 'Under Review ⏳'} sub={profile?.verified ? 'Active on listing' : 'Temporary hold'} color={profile?.verified ? '#34d399' : '#f59e0b'} />
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
                  <p>No leads yet. Once verified, customer leads will appear here!</p>
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
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Trade / Profession</label>
                  <input type="text" value={form.trade} onChange={e => setForm({ ...form, trade: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Years of Experience</label>
                  <input type="text" placeholder="e.g. 8 Years" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Service Area / Location</label>
                  <input type="text" placeholder="e.g. Indiranagar, Bangalore" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>About Me</label>
                <textarea rows={4} value={form.about} onChange={e => setForm({ ...form, about: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Skills <span style={{ opacity: 0.5 }}>(comma separated)</span></label>
                <input type="text" placeholder="e.g. Interior Painting, Wall Texture, Waterproofing"
                  value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} style={inputStyle} />
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
