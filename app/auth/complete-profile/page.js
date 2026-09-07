'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get('role') || 'customer';
  const initialEmail = searchParams.get('email') || '';
  const initialName = searchParams.get('name') || '';
  const avatar = searchParams.get('avatar') || '';
  const redirectTarget = searchParams.get('redirect') || (role === 'pro' ? '/pro/dashboard' : '/bookings');

  const [name, setName] = useState(initialName);
  const [email] = useState(initialEmail);
  const [phone, setPhone] = useState('');
  const [trade, setTrade] = useState('Carpenter');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (val) => {
    const digits = val.replace(/\D/g, '');
    setPhone(digits.slice(0, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim().replace(/\D/g, '');
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number (should start with 6, 7, 8, or 9).');
      return;
    }

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }

    if (role === 'customer' && name.trim().length > 16) {
      setError('Name cannot exceed 16 characters.');
      return;
    }

    if (role === 'pro') {
      if (!location.trim() || location.trim().length < 3) {
        setError('Please enter a valid location / city (at least 3 characters).');
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        role,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        trade: role === 'pro' ? trade : undefined,
        location: role === 'pro' ? location.trim() : undefined,
        avatar: role === 'pro' ? avatar : undefined
      };

      const res = await fetch('/api/auth/social-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to complete profile registration.');
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        if (role === 'customer' && data.customer) {
          localStorage.setItem('customer_phone', data.customer.phone);
          localStorage.setItem('customer_name', data.customer.name);
          localStorage.setItem('customer_email', data.customer.email);
          window.dispatchEvent(new Event('customer-login-changed'));
          router.push(redirectTarget || '/bookings');
        } else if (role === 'pro' && data.profile) {
          localStorage.setItem('pro_id', data.profile.id);
          localStorage.setItem('pro_slug', data.profile.slug);
          localStorage.setItem('pro_name', data.profile.name);
          localStorage.setItem('pro_trade', data.profile.trade);
          window.dispatchEvent(new Event('pro-login-changed'));
          router.push('/pro/dashboard');
        } else {
          router.push(redirectTarget);
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--foreground)',
    fontSize: '0.95rem',
    width: '100%',
    outline: 'none'
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - var(--navbar-height))', padding: '2.5rem 1rem' }}>
      <div className="glass animate-fade-in" style={{
        padding: '2.5rem',
        maxWidth: '480px',
        width: '100%',
        borderRadius: '16px',
        boxShadow: '0 12px 45px rgba(0,0,0,0.35)'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 20px rgba(59,130,246,0.4)'
          }}>
            {role === 'pro' ? '🔧' : '✨'}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Complete Your Profile
          </h1>
          <p style={{ opacity: 0.8, fontSize: '0.9rem', margin: 0 }}>
            {role === 'pro'
              ? 'Enter your mobile number and trade details to activate your Pro account.'
              : 'Add your mobile number to start booking verified handymen with 0% commission.'}
          </p>
        </div>

        {/* Google Account Verified Info Pill */}
        {email && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Google Verified Email
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {email}
              </div>
            </div>
            <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>✓ Verified</span>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            marginBottom: '1.5rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label style={{ fontSize: '0.88rem', fontWeight: 600, opacity: 0.9 }}>Your Full Name</label>
              {role === 'customer' && (
                <span style={{
                  fontSize: '0.75rem',
                  opacity: name.length > 16 ? 1 : 0.6,
                  color: name.length > 16 ? '#f87171' : 'inherit'
                }}>
                  {name.length}/16 chars
                </span>
              )}
            </div>
            <input
              type="text"
              required
              maxLength={role === 'customer' ? 16 : 50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sachin Tendulkar"
              style={inputStyle}
            />
          </div>

          {/* Indian Mobile Number */}
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.88rem', fontWeight: 600, opacity: 0.9 }}>
              Indian Mobile Number {role === 'customer' ? '(For Booking Updates)' : '(For Customer Calls)'}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{
                position: 'absolute', left: '0.75rem', opacity: 0.7, fontSize: '0.95rem', fontWeight: 600
              }}>+91</span>
              <input
                type="tel"
                placeholder="9876543210"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingLeft: '2.6rem',
                  letterSpacing: '0.5px'
                }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', opacity: 0.55, marginTop: '0.15rem' }}>
              Only 10-digit Indian mobile numbers starting with 6, 7, 8, or 9.
            </span>
          </div>

          {/* Pro-Specific Fields */}
          {role === 'pro' && (
            <>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.88rem', fontWeight: 600, opacity: 0.9 }}>Your Trade</label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Carpenter">Carpenter (बढ़ई / ಕಾರ್ಪೆಂಟರ್)</option>
                  <option value="Painter">Painter (पेंटर / ಪೇಂಟರ್)</option>
                  <option value="Electrician">Electrician (इलेक्ट्रीशियन / ಎಲೆಕ್ಟ್ರೀಷಿಯನ್)</option>
                  <option value="Plumber">Plumber (प्लंबर / ಪ್ಲಂಬರ್)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.88rem', fontWeight: 600, opacity: 0.9 }}>Location / City</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Indiranagar, Bangalore"
                  style={inputStyle}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ marginTop: '0.75rem', width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Saving Profile...' : 'Save & Continue →'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', opacity: 0.7 }}>
          Wrong account?{' '}
          <Link href={role === 'pro' ? '/pro/login' : '/login'} style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign in with another method
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CompleteProfile() {
  return (
    <Suspense fallback={
      <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <CompleteProfileContent />
    </Suspense>
  );
}
