'use client';
import { useState, useEffect } from 'react';
import { PRO_TSHIRT_CAMPAIGN } from '@/lib/proCampaign';

export default function TshirtClaimCard({ profile, onClaimSuccess }) {
  const [lang, setLang] = useState('en');
  const [size, setSize] = useState('L (40-42)');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('pro_lang') || 'en';
      setLang(savedLang);
    }
  }, []);

  const t = PRO_TSHIRT_CAMPAIGN.translations[lang] || PRO_TSHIRT_CAMPAIGN.translations.en;

  // Check if this pro has already claimed their T-shirt
  const tags = Array.isArray(profile?.languages) ? profile.languages : [];
  const hasClaimed = tags.some(item => typeof item === 'string' && item.startsWith('tshirt_claimed:true'));
  const claimedSize = tags.find(item => typeof item === 'string' && item.startsWith('tshirt_size:'))?.replace('tshirt_size:', '') || '';
  const claimedPincode = tags.find(item => typeof item === 'string' && item.startsWith('tshirt_pincode:'))?.replace('tshirt_pincode:', '') || '';
  const claimedDate = tags.find(item => typeof item === 'string' && item.startsWith('tshirt_date:'))?.replace('tshirt_date:', '') || '';

  // Pre-fill address from profile if available
  useEffect(() => {
    if (profile?.full_address && !fullAddress) {
      setFullAddress(profile.full_address);
      const matchPin = profile.full_address.match(/\b([1-9][0-9]{5})\b/);
      if (matchPin && matchPin[1] && !pincode) {
        setPincode(matchPin[1]);
      }
    }
    if (claimedSize) setSize(claimedSize);
    if (claimedPincode) setPincode(claimedPincode);
  }, [profile]);

  if (!PRO_TSHIRT_CAMPAIGN.isActive) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!size) {
      setError(lang === 'hi' ? 'कृपया अपनी टी-शर्ट का साइज चुनें।' : 'Please select your T-shirt size.');
      return;
    }
    if (!fullAddress.trim() || fullAddress.trim().length < 8) {
      setError(lang === 'hi' ? 'कृपया पूरा कूरियर डिलीवरी पता दर्ज करें।' : 'Please enter your complete courier delivery address.');
      return;
    }
    const cleanPin = pincode.trim().replace(/\D/g, '');
    if (!/^\d{6}$/.test(cleanPin)) {
      setError(lang === 'hi' ? 'कृपया 6 अंकों का सही पिनकोड दर्ज करें।' : 'Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/pro/claim-tshirt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proId: profile.id,
          size,
          fullAddress: fullAddress.trim(),
          landmark: landmark.trim(),
          pincode: cleanPin
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit claim. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(t.claim_success);
      setShowEdit(false);
      if (onClaimSuccess) onClaimSuccess(data.data);
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '0.75rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(0,0,0,0.35)',
    color: 'var(--foreground)',
    fontSize: '0.9rem',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div className="glass animate-fade-in" style={{
      borderRadius: '18px',
      padding: '1.5rem',
      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
      border: '1.5px solid rgba(245, 158, 11, 0.4)',
      boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15), transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header section with T-shirt Graphic & Headline */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            position: 'relative',
            width: '74px',
            height: '74px',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1.5px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
            flexShrink: 0,
            background: '#0f172a'
          }}>
            <img
              src={PRO_TSHIRT_CAMPAIGN.image}
              alt="Carpenterwala Pro T-Shirt"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.85)',
              fontSize: '0.55rem',
              textAlign: 'center',
              color: '#34d399',
              fontWeight: 800,
              padding: '1px 0'
            }}>
              VERIFIED
            </div>
          </div>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '0.35rem',
              textTransform: 'uppercase'
            }}>
              <span>👕</span> {t.badge}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              {t.dashboard_card_title}
            </h2>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              {t.dashboard_card_desc}
            </p>
          </div>
        </div>

        {/* Free Shipping Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.8rem',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          <span>📦</span>
          <span>{t.tag_zero_cost}</span>
        </div>
      </div>

      {/* State A: Pro Has Already Claimed Their T-shirt */}
      {hasClaimed && !showEdit ? (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '14px',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎉</span>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                  {lang === 'hi' ? 'टी-शर्ट सफलतापूर्वक क्लेम कर ली गई है!' : 'T-Shirt Claim Successfully Recorded!'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {claimedDate ? `${lang === 'hi' ? 'क्लेम दिनांक' : 'Claimed on'}: ${new Date(claimedDate).toLocaleDateString()}` : ''}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEdit(true)}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
            >
              ✏️ {lang === 'hi' ? 'पता बदलें' : 'Update Address'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.size_label}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>
                {claimedSize || size}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.address_label}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#cbd5e1', marginTop: '0.25rem', lineHeight: 1.4 }}>
                {profile?.full_address || fullAddress}
              </div>
            </div>
          </div>

          {/* Fulfillment Status Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.1rem',
            borderRadius: '10px',
            background: profile?.verified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${profile?.verified ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`
          }}>
            <span style={{ fontSize: '1.3rem' }}>{profile?.verified ? '🚚' : '⏳'}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: profile?.verified ? '#34d399' : '#fbbf24'
              }}>
                {profile?.verified
                  ? (lang === 'hi' ? 'वेरिफिकेशन पूरा हुआ • कूरियर डिस्पैच के लिए तैयार' : 'KYC Verified • Scheduled for Courier Dispatch')
                  : (lang === 'hi' ? 'दस्तावेज़ वेरिफिकेशन प्रतीक्षारत' : 'Pending Document Verification')}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                {profile?.verified ? t.status_ready : t.status_pending_docs}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* State B: Interactive Claim Form */
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              fontSize: '0.85rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              fontSize: '0.85rem'
            }}>
              ✅ {success}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {/* 1. T-Shirt Size */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                {t.size_label} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={size}
                onChange={e => setSize(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {PRO_TSHIRT_CAMPAIGN.availableSizes.map(s => (
                  <option key={s} value={s} style={{ background: '#1e293b', color: '#fff' }}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. 6-Digit Pincode */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                {t.pincode_label} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 560038"
                value={pincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* 3. Full Courier Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
              {t.address_label} <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              rows={2}
              placeholder="House/Shop No., Street Name, Area / Colony..."
              value={fullAddress}
              onChange={e => setFullAddress(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* 4. Landmark */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
              {t.landmark_label} <span style={{ opacity: 0.6 }}>(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Near Metro Station / Behind Temple"
              value={landmark}
              onChange={e => setLandmark(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Step guidance note */}
          <div style={{
            fontSize: '0.78rem',
            color: '#fbbf24',
            background: 'rgba(245, 158, 11, 0.08)',
            padding: '0.65rem 0.9rem',
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <span>ℹ️</span>
            <span>{t.eligibility_pill}</span>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                padding: '0.75rem 1.6rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                border: 'none',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>👕</span>
              <span>{loading ? 'Saving...' : t.claim_btn}</span>
            </button>

            {showEdit && (
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.2rem', fontSize: '0.88rem' }}
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
