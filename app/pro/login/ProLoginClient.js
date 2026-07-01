'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { translations } from './translations';
import AdSenseContainer from '@/components/AdSenseContainer';

export default function ProLogin({ lang }) {
  const [currentLang, setCurrentLang] = useState(lang || 'en');
  const [isRegister, setIsRegister] = useState(false); // false = signin, true = register
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = input details, 2 = otp verify, 3 = select profile (signin only)
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpToken, setOtpToken] = useState('');
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

  const updateUrlParam = (newLang) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  };

  useEffect(() => {
    if (lang) {
      localStorage.setItem('pro_lang', lang);
      setCurrentLang(lang);
      return;
    }

    const savedLang = localStorage.getItem('pro_lang');
    if (savedLang && ['en', 'hi', 'kn', 'ta', 'te'].includes(savedLang)) {
      setCurrentLang(savedLang);
      updateUrlParam(savedLang);
      return;
    }

    if (typeof navigator !== 'undefined') {
      const browserLangs = navigator.languages || [navigator.language];
      for (const bLang of browserLangs) {
        const primary = bLang.split('-')[0].toLowerCase();
        if (['hi', 'kn', 'ta', 'te'].includes(primary)) {
          setCurrentLang(primary);
          localStorage.setItem('pro_lang', primary);
          updateUrlParam(primary);
          return;
        }
      }
    }

    setCurrentLang('en');
  }, [lang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('pro_id')) router.push('/pro/dashboard');
    }
  }, [router]);

  const t = translations[currentLang] || translations.en;

  // Handle Login OTP Send
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t.error_valid_email); return;
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
      if (data.otpToken) {
        setOtpToken(data.otpToken);
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
      setError(t.error_otp_digits); return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/pro/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: email.trim().toLowerCase(), otp: otp.trim(), otpToken })
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
      setError(t.error_name_length); return;
    }
    if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setError(t.error_valid_email); return;
    }
    if (!regPhone.trim() || !/^[6-9]\d{9}$/.test(regPhone.trim())) {
      setError(t.error_phone_format); return;
    }
    if (!regLocation.trim() || regLocation.trim().length < 3) {
      setError(t.error_location_length); return;
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
      if (data.otpToken) {
        setOtpToken(data.otpToken);
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
      setError(t.error_otp_digits); return;
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
          otp: otp.trim(),
          otpToken
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
    setStep(1); setOtp(''); setGeneratedOtp(''); setOtpToken('');
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
    <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - var(--navbar-height))', padding: '2rem 1rem' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .login-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          width: 100%;
          max-width: 1200px;
        }
        .ads-sidebar {
          display: none;
          flex-direction: column;
          gap: 1.5rem;
          width: 300px;
          flex-shrink: 0;
        }
        @media (min-width: 1024px) {
          .login-wrapper {
            flex-direction: row;
          }
          .ads-sidebar {
            display: flex;
          }
        }
      `}} />
      <div className="login-wrapper">

        {/* Left Ads Column */}
        <div className="ads-sidebar">
          <AdSenseContainer 
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_PRO_LOGIN_1 || "1234567890"} 
            style={{ margin: 0, minHeight: '280px', height: '280px' }}
          />
          <AdSenseContainer 
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_PRO_LOGIN_3 || "3456789012"} 
            style={{ margin: 0, minHeight: '280px', height: '280px' }}
          />
        </div>

        {/* Center Login Column */}
        <div style={{ width: '100%', maxWidth: '480px', flexShrink: 0 }}>
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
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.06em' }}>{t.banner_simulated_title}</span>
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                {t.banner_to} <strong>{activeEmail}</strong>
                <div style={{ marginTop: '0.3rem' }}>
                  {t.banner_code} <strong style={{ color: 'var(--accent)', fontSize: '1.05rem', letterSpacing: '2px' }}>{generatedOtp}</strong>
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
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.06em' }}>{t.banner_otp_sent_title}</span>
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                {t.banner_otp_sent_msg} <strong>{activeEmail}</strong>
                <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', opacity: 0.8 }}>
                  {t.banner_otp_sent_help}
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
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{t.title}</h1>
              <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                {step === 1 && (isRegister ? t.subtitle_register : t.subtitle_signin)}
                {step === 2 && `${t.subtitle_otp} ${activeEmail}`}
                {step === 3 && t.subtitle_multiple}
              </p>
            </div>

            {/* Language Selector */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.35rem',
              margin: '0 auto 1.5rem',
              padding: '0.35rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              border: '1px solid var(--glass-border)',
              maxWidth: '100%'
            }}>
              {[
                { code: 'en', label: 'English' },
                { code: 'kn', label: 'ಕನ್ನಡ' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'ta', label: 'தமிழ்' },
                { code: 'te', label: 'తెలుగు' }
              ].map((l) => {
                const isActive = currentLang === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setCurrentLang(l.code);
                      localStorage.setItem('pro_lang', l.code);
                      updateUrlParam(l.code);
                    }}
                    style={{
                      padding: '0.35rem 0.7rem',
                      borderRadius: '6px',
                      border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                      background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                      color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: "0", color: "var(--accent)" }}>
                {isRegister ? t.subheading_register : t.subheading_login}
              </h2>
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
                }}>{t.tab_signin}</button>
                <button onClick={() => toggleTab(true)} style={{
                  flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s',
                  background: isRegister ? 'var(--primary)' : 'transparent',
                  color: isRegister ? 'white' : 'rgba(255,255,255,0.6)'
                }}>{t.tab_join}</button>
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
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.9 }}>{t.label_email}</label>
                  <input type="email" placeholder={t.placeholder_email} required value={email}
                    onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                  <span style={{ fontSize: '0.75rem', opacity: 0.55 }}>{t.help_email}</span>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary"
                  style={{ marginTop: '0.5rem', width: '100%' }}>
                  {loading ? t.btn_sending_otp : t.btn_send_otp}
                </button>
              </form>
            )}

            {/* Step 1: Register Form */}
            {step === 1 && isRegister && (
              <form className="flex flex-col gap-3" onSubmit={handleRegisterSend}>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>{t.label_name}</label>
                  <input type="text" placeholder={t.placeholder_name} required value={regName}
                    onChange={(e) => setRegName(e.target.value)} style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>{t.label_reg_email}</label>
                  <input type="email" placeholder={t.placeholder_email} required value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)} style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>{t.label_phone}</label>
                  <input type="tel" placeholder={t.placeholder_phone} required maxLength={10} value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>{t.label_trade}</label>
                    <select value={regTrade} onChange={(e) => setRegTrade(e.target.value)} style={inputStyle}>
                      <option value="Carpenter">{t.trades.Carpenter}</option>
                      <option value="Painter">{t.trades.Painter}</option>
                      <option value="Electrician">{t.trades.Electrician}</option>
                      <option value="Plumber">{t.trades.Plumber}</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1" style={{ flex: 1.2 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>{t.label_location}</label>
                    <input type="text" placeholder={t.placeholder_location} required value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary"
                  style={{ marginTop: '0.75rem', width: '100%' }}>
                  {loading ? t.btn_sending_otp : t.btn_register_verify}
                </button>
              </form>
            )}

            {/* Step 2: OTP Input */}
            {step === 2 && (
              <form className="flex flex-col gap-4" onSubmit={isRegister ? handleRegisterVerify : handleVerifyOtp}>
                <div className="flex flex-col gap-1">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.9 }}>{t.label_enter_otp}</label>
                    <button type="button" onClick={resetFlow}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                      {t.btn_edit_details}
                    </button>
                  </div>
                  <input type="text" placeholder="• • • • • •" required maxLength={6}
                    value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ ...inputStyle, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', fontWeight: 'bold' }} />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                  {loading ? t.btn_verifying : t.btn_verify_login}
                </button>
                <button type="button" onClick={resetFlow} className="btn btn-secondary" style={{ width: '100%' }}>
                  {t.btn_cancel}
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
                      <div style={{ fontSize: '0.85rem', opacity: 0.65 }}>{(t.trades[pro.trade] || pro.trade)} · {pro.location}</div>
                    </div>
                    {pro.verified && <span style={{ marginLeft: 'auto', color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>✓ Verified</span>}
                  </button>
                ))}
                <button onClick={resetFlow} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  {t.btn_not_me}
                </button>
              </div>
            )}

            {/* Footer link */}
            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.88rem', opacity: 0.7 }}>
              {t.footer_text}{' '}
              <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t.footer_link}</Link>
            </div>
          </div>
        </div>

        {/* Right Ads Column */}
        <div className="ads-sidebar">
          <AdSenseContainer 
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_PRO_LOGIN_2 || "2345678901"} 
            style={{ margin: 0, minHeight: '280px', height: '280px' }}
          />
          <AdSenseContainer 
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_PRO_LOGIN_4 || "4567890123"} 
            style={{ margin: 0, minHeight: '280px', height: '280px' }}
          />
        </div>

      </div>
    </div>
  );
}
