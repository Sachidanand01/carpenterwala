'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProLogin() {
  const [isRegister, setIsRegister] = useState(false); // false = signin, true = register
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = input details, 2 = otp verify, 3 = select profile (signin only)
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSimulated, setIsSimulated] = useState(false);
  const [otpSentAlert, setOtpSentAlert] = useState(false);
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTrade, setRegTrade] = useState('Carpenter');
  const [regLocation, setRegLocation] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('pro_id')) router.push('/pro/dashboard');
    }
  }, [router]);

  // Handle Login OTP Send
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.'); return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/pro/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: email.trim().toLowerCase() })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send OTP.');
        setLoading(false);
        return;
      }
      setIsSimulated(data.simulated);
      if (data.simulated && data.otp) {
        setGeneratedOtp(data.otp);
      } else {
        setGeneratedOtp('');
      }
      setStep(2);
      setOtpSentAlert(true);
    } catch (err) {
      setError('Connection error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login OTP Verify
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError('Please enter a 6-digit OTP.'); return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/pro/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: email.trim().toLowerCase(), otp: otp.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid OTP. Please check the code.');
        setLoading(false);
        return;
      }
      
      if (data.profiles && data.profiles.length === 1) {
        loginAsPro(data.profiles[0]);
      } else if (data.profiles && data.profiles.length > 1) {
        setMatchedProfiles(data.profiles);
        setStep(3);
        setLoading(false);
      } else {
        setError('No professional profile found.');
        setLoading(false);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
      setLoading(false);
    }
  };

  // Handle Registration OTP Send
  const handleRegisterSend = async (e) => {
    e.preventDefault();
    if (!regName.trim() || regName.trim().length < 2) {
      setError('Name must be at least 2 characters.'); return;
    }
    if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setError('Please enter a valid email address.'); return;
    }
    if (!regPhone.trim() || !/^[6-9]\d{9}$/.test(regPhone.trim())) {
      setError('Please enter a valid 10-digit mobile number starting with 6-9.'); return;
    }
    if (!regLocation.trim() || regLocation.trim().length < 3) {
      setError('Please enter a valid location.'); return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/pro/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register_send',
          name: regName.trim(),
          email: regEmail.trim().toLowerCase(),
          phone: regPhone.trim(),
          trade: regTrade,
          location: regLocation.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send OTP.');
        setLoading(false);
        return;
      }
      setIsSimulated(data.simulated);
      if (data.simulated && data.otp) {
        setGeneratedOtp(data.otp);
      } else {
        setGeneratedOtp('');
      }
      setStep(2);
      setOtpSentAlert(true);
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration OTP Verify
  const handleRegisterVerify = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError('Please enter a 6-digit OTP.'); return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/pro/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register_verify',
          email: regEmail.trim().toLowerCase(),
          otp: otp.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid OTP. Please check the code.');
        setLoading(false);
        return;
      }
      
      if (data.profiles && data.profiles.length > 0) {
        loginAsPro(data.profiles[0]);
      } else {
        setError('Failed to create account.');
        setLoading(false);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
      setLoading(false);
    }
  };

  const loginAsPro = (pro) => {
    localStorage.setItem('pro_id', pro.id);
    localStorage.setItem('pro_slug', pro.slug);
    localStorage.setItem('pro_name', pro.name);
    localStorage.setItem('pro_trade', pro.trade);
    window.dispatchEvent(new Event('pro-login-changed'));
    router.push('/pro/dashboard');
  };

  const resetFlow = () => {
    setStep(1); setOtp(''); setGeneratedOtp('');
    setOtpSentAlert(false); setMatchedProfiles([]); setError('');
  };

  const toggleTab = (registerMode) => {
    setIsRegister(registerMode);
    resetFlow();
  };

  const inputStyle = {
    padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.95rem', width: '100%',
    outline: 'none', transition: 'border-color 0.2s'
  };

  const activeEmail = isRegister ? regEmail : email;

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 70px)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Simulated/Real Email Banner */}
        {otpSentAlert && isSimulated && (
          <div className="glass animate-fade-in" style={{
            padding: '1.25rem', marginBottom: '1.5rem',
            borderLeft: '4px solid var(--accent)', background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)', borderLeftWidth: '4px', borderRadius: '12px',
            display: 'flex', flexDirection: 'column', gap: '0.4rem'
          }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '1.2rem' }}>✉️</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.06em' }}>SIMULATED EMAIL GATEWAY</span>
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              To: <strong>{activeEmail}</strong>
              <div style={{ marginTop: '0.3rem' }}>
                Pro OTP Code: <strong style={{ color: 'var(--accent)', fontSize: '1.05rem', letterSpacing: '2px' }}>{generatedOtp}</strong>
              </div>
            </div>
          </div>
        )}

        {otpSentAlert && !isSimulated && (
          <div className="glass animate-fade-in" style={{
            padding: '1.25rem', marginBottom: '1.5rem',
            borderLeft: '4px solid #10b981', background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.25)', borderLeftWidth: '4px', borderRadius: '12px',
            display: 'flex', flexDirection: 'column', gap: '0.4rem'
          }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '1.2rem' }}>📩</span>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.06em' }}>OTP EMAIL SENT</span>
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              Sent verification code to: <strong>{activeEmail}</strong>
              <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', opacity: 0.8 }}>
                Check your inbox (and spam folder) for the 6-digit code.
              </div>
            </div>
          </div>
        )}

        <div className="glass animate-fade-in" style={{ padding: '2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 1rem',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', boxShadow: '0 4px 20px rgba(59,130,246,0.4)'
            }}>🔧</div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Pro Portal</h1>
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
              {step === 1 && (isRegister ? 'Register as a professional & start onboarding.' : 'Sign in to manage your leads & profile.')}
              {step === 2 && `Enter the OTP sent to ${activeEmail}`}
              {step === 3 && 'We found multiple profiles. Select yours.'}
            </p>
          </div>

          {/* Tabs */}
          {step === 1 && (
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
              padding: '0.25rem', marginBottom: '1.5rem', border: '1px solid var(--glass-border)'
            }}>
              <button onClick={() => toggleTab(false)} style={{
                flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s',
                background: !isRegister ? 'var(--primary)' : 'transparent',
                color: !isRegister ? 'white' : 'rgba(255,255,255,0.6)'
              }}>🔑 Sign In</button>
              <button onClick={() => toggleTab(true)} style={{
                flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s',
                background: isRegister ? 'var(--primary)' : 'transparent',
                color: isRegister ? 'white' : 'rgba(255,255,255,0.6)'
              }}>✨ Join as Pro</button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px',
              fontSize: '0.9rem', marginBottom: '1.5rem'
            }}>⚠️ {error}</div>
          )}

          {/* Step 1: Login Form */}
          {step === 1 && !isRegister && (
            <form className="flex flex-col gap-4" onSubmit={handleSendOtp}>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.9 }}>Registered Email Address</label>
                <input type="email" placeholder="e.g. ram@example.com" required value={email}
                  onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <span style={{ fontSize: '0.75rem', opacity: 0.55 }}>Enter the email registered with your professional profile.</span>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary"
                style={{ marginTop: '0.5rem', width: '100%' }}>
                {loading ? 'Sending OTP…' : 'Send Verification OTP →'}
              </button>
            </form>
          )}

          {/* Step 1: Register Form */}
          {step === 1 && isRegister && (
            <form className="flex flex-col gap-3" onSubmit={handleRegisterSend}>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>Full Name</label>
                <input type="text" placeholder="e.g. Ram Singh" required value={regName}
                  onChange={(e) => setRegName(e.target.value)} style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>Email Address (For Secure Login)</label>
                <input type="email" placeholder="e.g. ram@example.com" required value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)} style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>Mobile Number (For Customer Contact)</label>
                <input type="tel" placeholder="e.g. 9876543210" required maxLength={10} value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>Trade</label>
                  <select value={regTrade} onChange={(e) => setRegTrade(e.target.value)} style={inputStyle}>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1" style={{ flex: 1.2 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>Location / City</label>
                  <input type="text" placeholder="e.g. Indiranagar, Bangalore" required value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary"
                style={{ marginTop: '0.75rem', width: '100%' }}>
                {loading ? 'Sending OTP…' : 'Register & Verify Email →'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <form className="flex flex-col gap-4" onSubmit={isRegister ? handleRegisterVerify : handleVerifyOtp}>
              <div className="flex flex-col gap-1">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.9 }}>Enter 6-Digit OTP</label>
                  <button type="button" onClick={resetFlow}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                    Edit Details
                  </button>
                </div>
                <input type="text" placeholder="• • • • • •" required maxLength={6}
                  value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ ...inputStyle, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', fontWeight: 'bold' }} />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                {loading ? 'Verifying…' : 'Verify & Log In'}
              </button>
              <button type="button" onClick={resetFlow} className="btn btn-secondary" style={{ width: '100%' }}>
                Cancel
              </button>
            </form>
          )}

          {/* Step 3: Duplicate profile selections */}
          {step === 3 && (
            <div className="flex flex-col gap-3">
              {matchedProfiles.map(pro => (
                <button key={pro.id} onClick={() => loginAsPro(pro)} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                  borderRadius: '10px', cursor: 'pointer', color: 'white', textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'var(--primary)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0
                  }}>
                    {pro.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{pro.name}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.65 }}>{pro.trade} · {pro.location}</div>
                  </div>
                  {pro.verified && <span style={{ marginLeft: 'auto', color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>✓ Verified</span>}
                </button>
              ))}
              <button onClick={resetFlow} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Not me — go back
              </button>
            </div>
          )}

          {/* Footer link */}
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.88rem', opacity: 0.7 }}>
            Looking for customer login?{' '}
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>My Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
