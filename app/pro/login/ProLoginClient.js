'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { translations } from './translations';
import { supabase } from '@/lib/supabase';
import { PRO_TSHIRT_CAMPAIGN } from '@/lib/proCampaign';

export default function ProLogin({ lang, session, mode }) {
  const [currentLang, setCurrentLang] = useState(lang || 'en');
  const [isRegister, setIsRegister] = useState(mode === 'register' || !!session); // false = signin, true = register
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = input details, 2 = otp verify, 3 = select profile (signin only)
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [isSimulated, setIsSimulated] = useState(false);
  const [otpSentAlert, setOtpSentAlert] = useState(false);
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTrade, setRegTrade] = useState('Carpenter');
  const [customTrade, setCustomTrade] = useState('');
  const [regLocation, setRegLocation] = useState('');

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError('');
    setErrorCode('');
    setLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?role=pro`
        }
      });
      if (authError) {
        setError(authError.message || 'Failed to initialize Google Sign-in.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Google Sign-in error:', err);
      setError('Could not connect to Google authentication service. Please try again.');
      setLoading(false);
    }
  };

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

  // Handle AI Onboarding Session & Deep Link Pre-fill
  useEffect(() => {
    if (mode === 'register') {
      setIsRegister(true);
    }

    if (session) {
      setIsRegister(true);
      fetch(`/api/pro/ai-session?session=${encodeURIComponent(session)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            if (data.data.name) setRegName(data.data.name);
            if (data.data.phone) setRegPhone(data.data.phone);
            if (data.data.location) setRegLocation(data.data.location);
            if (data.data.trade) {
              const standardTrades = ['Carpenter', 'Painter', 'Plumber', 'Electrician', 'AC Technician', 'Mason', 'Welder', 'Gardener', 'Barber', 'Pest Control', 'Deep Cleaning', 'Roofer', 'Flooring Expert', 'Tank & Sump Cleaner'];
              const matched = standardTrades.find(t => t.toLowerCase() === data.data.trade.toLowerCase());
              if (matched) {
                setRegTrade(matched);
              } else {
                setRegTrade('Other');
                setCustomTrade(data.data.trade);
              }
            }
          }
        })
        .catch(err => {
          console.error('[AI Onboarding] Failed to load session pre-fill:', err);
        });
    }
  }, [session, mode]);

  const t = translations[currentLang] || translations.en;
  const offer = t.offer || translations.en.offer;
  const campaignText = PRO_TSHIRT_CAMPAIGN.translations[currentLang] || PRO_TSHIRT_CAMPAIGN.translations.en;

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
  const handleVerifyOtp = async (e, otpVal = otp) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const cleanOtp = String(otpVal || '').trim();
    if (cleanOtp.length !== 6) {
      setError(t.error_otp_digits); return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/pro/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: email.trim().toLowerCase(), otp: cleanOtp, otpToken })
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

    const finalTrade = regTrade === 'Other' ? customTrade.trim() : regTrade;
    if (!finalTrade) {
      setError(t.error_custom_trade || 'Please specify your trade (max 30 characters).');
      return;
    }
    if (finalTrade.length > 30) {
      setError(t.error_custom_trade || 'Trade name cannot exceed 30 characters.');
      return;
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
          trade: finalTrade,
          location: regLocation.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'EMAIL_EXISTS') {
          setErrorCode('EMAIL_EXISTS');
          setError(t.error_email_exists || data.error);
        } else if (data.code === 'PHONE_EXISTS') {
          setErrorCode('PHONE_EXISTS');
          setError(t.error_phone_exists || data.error);
        } else {
          setErrorCode('');
          setError(data.error || 'Failed to send OTP.');
        }
        setLoading(false);
        return;
      }
      setErrorCode('');
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
      setErrorCode('');
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration OTP Verify
  const handleRegisterVerify = async (e, otpVal = otp) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const cleanOtp = String(otpVal || '').trim();
    if (cleanOtp.length !== 6) {
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
          otp: cleanOtp,
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

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    if (val.length === 6 && !loading) {
      if (isRegister) {
        handleRegisterVerify(null, val);
      } else {
        handleVerifyOtp(null, val);
      }
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
    setOtpSentAlert(false); setMatchedProfiles([]); setError(''); setErrorCode('');
    setCustomTrade('');
  };

  const toggleTab = (registerMode) => {
    setIsRegister(registerMode);
    resetFlow();
  };

  const inputStyle = {
    padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.05)', color: 'var(--foreground)', fontSize: '0.95rem', width: '100%',
    outline: 'none', transition: 'border-color 0.2s'
  };

  const activeEmail = isRegister ? regEmail : email;

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - var(--navbar-height))', padding: '1.5rem 1rem 3rem' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtlePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.75; }
        }
        .pro-split-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.75rem;
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
        }
        .pro-showcase-sidebar {
          display: none;
          flex-direction: column;
          width: 100%;
        }
        .mobile-offer-strip {
          display: block;
          width: 100%;
          margin-bottom: 0.5rem;
        }
        .pro-form-column {
          width: 100%;
          max-width: 500px;
          flex-shrink: 0;
        }
        .promise-card {
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .promise-card:hover {
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.4) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }
        @media (min-width: 1024px) {
          .pro-split-container {
            display: grid;
            grid-template-columns: 1.15fr 0.88fr;
            gap: 3.5rem;
            align-items: start;
            max-width: 1180px;
          }
          .pro-showcase-sidebar {
            display: flex;
          }
          .mobile-offer-strip {
            display: none;
          }
          .pro-form-column {
            position: sticky;
            top: 2rem;
            max-width: 480px;
          }
        }
      `}} />

      {/* Top Campaign Announcement Bar */}
      {PRO_TSHIRT_CAMPAIGN.isActive && (
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto 1.5rem',
          padding: '0.85rem 1.25rem',
          borderRadius: '14px',
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '260px' }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🎁</span>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.45 }}>
              {campaignText.bar_text}
            </div>
          </div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#1e293b',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
          }}>
            {campaignText.badge}
          </span>
        </div>
      )}

      <div className="pro-split-container">

        {/* Left Column: Pro Value Proposition Showcase (Desktop & Large Screens) */}
        <div className="pro-showcase-sidebar">
          {/* Top Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.95rem',
            borderRadius: '9999px',
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            marginBottom: '0.85rem',
            width: 'fit-content'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'subtlePulse 2s infinite' }}></span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {offer.badge}
            </span>
          </div>

          {/* Bilingual Micro Tag */}
          <div style={{ fontSize: '0.88rem', color: '#f59e0b', fontWeight: 600, marginBottom: '0.45rem', letterSpacing: '0.02em' }}>
            {currentLang === 'hi' 
              ? '✨ 100% Free Registration • 0% Middleman Cut • Direct Calls'
              : '🇮🇳 100% मुफ़्त रजिस्ट्रेशन • 0% कमीशन • सीधे ग्राहक कॉल्स'}
          </div>

          {/* Main Headline */}
          <h2 style={{
            fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '0.75rem',
            color: 'var(--foreground)',
            letterSpacing: '-0.02em'
          }}>
            {offer.headline_main}
          </h2>

          <p style={{
            fontSize: '0.98rem',
            lineHeight: 1.6,
            color: 'var(--foreground)',
            opacity: 0.8,
            marginBottom: '1.5rem'
          }}>
            {offer.headline_sub}
          </p>

          {/* 3 Core Promises Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
            {/* Promise 1 */}
            <div className="glass promise-card" style={{
              display: 'flex',
              gap: '1rem',
              padding: '1.1rem',
              borderRadius: '14px',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(255,255,255,0.02))'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)'
              }}>
                📞
              </div>
              <div>
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--foreground)' }}>
                  {offer.promise1_title}
                </h3>
                <p style={{ fontSize: '0.88rem', opacity: 0.8, lineHeight: 1.45, margin: 0 }}>
                  {offer.promise1_desc}
                </p>
              </div>
            </div>

            {/* Promise 2 */}
            <div className="glass promise-card" style={{
              display: 'flex',
              gap: '1rem',
              padding: '1.1rem',
              borderRadius: '14px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(255,255,255,0.02))'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
              }}>
                💰
              </div>
              <div>
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--foreground)' }}>
                  {offer.promise2_title}
                </h3>
                <p style={{ fontSize: '0.88rem', opacity: 0.8, lineHeight: 1.45, margin: 0 }}>
                  {offer.promise2_desc}
                </p>
              </div>
            </div>

            {/* Promise 3 */}
            <div className="glass promise-card" style={{
              display: 'flex',
              gap: '1rem',
              padding: '1.1rem',
              borderRadius: '14px',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(255,255,255,0.02))'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
              }}>
                ⭐
              </div>
              <div>
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--foreground)' }}>
                  {offer.promise3_title}
                </h3>
                <p style={{ fontSize: '0.88rem', opacity: 0.8, lineHeight: 1.45, margin: 0 }}>
                  {offer.promise3_desc}
                </p>
              </div>
            </div>
          </div>

          {/* Trust Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            padding: '0.85rem',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{offer.stat_commission}</div>
              <div style={{ fontSize: '0.74rem', opacity: 0.75, marginTop: '0.15rem' }}>{offer.stat_commission_label}</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa' }}>{offer.stat_direct}</div>
              <div style={{ fontSize: '0.74rem', opacity: 0.75, marginTop: '0.15rem' }}>{offer.stat_direct_label}</div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>{offer.stat_verified}</div>
              <div style={{ fontSize: '0.74rem', opacity: 0.75, marginTop: '0.15rem' }}>{offer.stat_verified_label}</div>
            </div>
          </div>

          {/* Sample Pro Profile Preview Card */}
          <div style={{
            borderRadius: '16px',
            padding: '1.25rem',
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95))',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
              paddingBottom: '0.65rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>
                {offer.preview_badge}
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontWeight: 600
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }}></span>
                {offer.preview_status}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                flexShrink: 0
              }}>
                🪚
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: '#f8fafc' }}>
                    {offer.preview_name}
                  </h4>
                  <span style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700 }} title="Verified Pro">✓</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                  {offer.preview_trade}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                  📍 {offer.preview_loc}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0,0,0,0.25)',
              padding: '0.55rem 0.8rem',
              borderRadius: '10px',
              marginBottom: '0.85rem'
            }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#fbbf24' }}>
                {offer.preview_rating}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#a7f3d0', fontWeight: 600 }}>
                ✓ {offer.preview_verified}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.65rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}>
              <span>📞</span> {offer.preview_call_btn}
            </div>

            <p style={{ margin: '0.65rem 0 0', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' }}>
              {offer.preview_note}
            </p>
          </div>

          {/* Guarantee footer */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.82rem', color: '#34d399', fontWeight: 600, opacity: 0.9 }}>
            {offer.guarantee}
          </div>
        </div>

        {/* Right Form Column */}
        <div className="pro-form-column">
          {/* Mobile Top Offer Strip (Shown on mobile screens for instant 5-second hook) */}
          <div className="mobile-offer-strip">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.55rem 0.85rem',
              borderRadius: '12px',
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.18), rgba(59, 130, 246, 0.18))',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              marginBottom: '0.75rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'subtlePulse 2s infinite' }}></span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', textAlign: 'center', letterSpacing: '0.02em' }}>
                {offer.bilingual_badge || offer.badge}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.45rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '0.55rem 0.25rem',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {offer.mobile_pill_1}
              </div>
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '0.55rem 0.25rem',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {offer.mobile_pill_2}
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '0.55rem 0.25rem',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {offer.mobile_pill_3}
              </div>
            </div>
          </div>
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

          {/* Campaign Welcome Gift Card (Visible on both Mobile & Desktop) */}
          {PRO_TSHIRT_CAMPAIGN.isActive && (
            <div className="glass animate-fade-in" style={{
              borderRadius: '16px',
              padding: '1.2rem',
              marginBottom: '1.25rem',
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '0.75rem',
                textTransform: 'uppercase'
              }}>
                <span>👕</span>
                <span>{campaignText.badge}</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                  position: 'relative',
                  width: '88px',
                  height: '88px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  flexShrink: 0,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                  background: '#0f172a'
                }}>
                  <img
                    src={PRO_TSHIRT_CAMPAIGN.image}
                    alt="Carpenterwala Verified Pro T-Shirt"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.75)',
                    fontSize: '0.58rem',
                    textAlign: 'center',
                    color: '#34d399',
                    fontWeight: 800,
                    padding: '2px 0'
                  }}>
                    VERIFIED PRO
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                    {campaignText.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    {campaignText.subtitle}
                  </p>
                </div>
              </div>

              {/* Perks Badges */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.45rem',
                marginTop: '0.85rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255,255,255,0.08)'
              }}>
                <span style={{
                  fontSize: '0.72rem',
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  fontWeight: 600
                }}>
                  ✓ {campaignText.tag_zero_cost}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  color: '#60a5fa',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  fontWeight: 600
                }}>
                  ✓ {campaignText.tag_premium_fit}
                </span>
              </div>

              {/* Eligibility info notice */}
              <div style={{
                marginTop: '0.65rem',
                fontSize: '0.73rem',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 500
              }}>
                <span>ℹ️</span>
                <span>{campaignText.eligibility_pill}</span>
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
                      background: isActive ? 'var(--primary)' : 'transparent',
                      color: isActive ? 'white' : 'var(--primary)',
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
                  color: !isRegister ? 'white' : 'var(--primary)'
                }}>{t.tab_signin}</button>
                <button onClick={() => toggleTab(true)} style={{
                  flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s',
                  background: isRegister ? 'var(--primary)' : 'transparent',
                  color: isRegister ? 'white' : 'var(--primary)'
                }}>{t.tab_join}</button>
              </div>
            )}

            {/* Error Banner with Smart Switch to Sign In */}
            {error && (
              <div style={{
                background: errorCode === 'EMAIL_EXISTS' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${errorCode === 'EMAIL_EXISTS' ? 'rgba(59, 130, 246, 0.35)' : 'rgba(239,68,68,0.3)'}`,
                color: errorCode === 'EMAIL_EXISTS' ? '#60a5fa' : '#f87171',
                padding: '0.9rem 1rem', borderRadius: '10px',
                fontSize: '0.88rem', marginBottom: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '0.6rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
                {errorCode === 'EMAIL_EXISTS' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(regEmail);
                      setIsRegister(false);
                      setError('');
                      setErrorCode('');
                    }}
                    className="btn btn-primary"
                    style={{
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.82rem',
                      alignSelf: 'flex-start',
                      background: 'var(--primary)',
                      border: 'none',
                      boxShadow: 'none',
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: '6px'
                    }}
                  >
                    {t.btn_switch_signin || '👉 Switch to Sign In with this Email'}
                  </button>
                )}
              </div>
            )}

            {/* Step 1 Forms */}
            {step === 1 && (
              <div>
                {/* 1-Click Social Sign-In with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="btn"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.07)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--foreground)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginBottom: "1.25rem"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "var(--glass-border)"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{loading ? (t.btn_sending_otp || 'Connecting...') : (t.btn_google || 'Continue with Google')}</span>
                </button>

                {/* Divider */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0 0 1.25rem 0",
                  opacity: 0.6
                }}>
                  <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
                  <span style={{ padding: "0 0.75rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    {t.or_continue_with || 'or with email'}
                  </span>
                  <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
                </div>

                {/* Step 1: Login Form */}
                {!isRegister && (
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
                {isRegister && (
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
                          <option value="AC Technician">{t.trades['AC Technician']}</option>
                          <option value="Mason">{t.trades.Mason}</option>
                          <option value="Welder">{t.trades.Welder}</option>
                          <option value="Gardener">{t.trades.Gardener}</option>
                          <option value="Barber">{t.trades.Barber}</option>
                          <option value="Pest Control">{t.trades['Pest Control']}</option>
                          <option value="Deep Cleaning">{t.trades['Deep Cleaning']}</option>
                          <option value="Roofer">{t.trades.Roofer}</option>
                          <option value="Flooring Expert">{t.trades['Flooring Expert']}</option>
                          <option value="Tank & Sump Cleaner">{t.trades['Tank & Sump Cleaner']}</option>
                          <option value="Other">✨ {t.trades.Other}</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1" style={{ flex: 1.2 }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>{t.label_location}</label>
                        <input type="text" placeholder={t.placeholder_location} required value={regLocation}
                          onChange={(e) => setRegLocation(e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                    {regTrade === 'Other' && (
                      <div className="flex flex-col gap-1" style={{ marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>{t.label_custom_trade || 'Specify Your Trade / Service'}</label>
                          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{customTrade.length}/30</span>
                        </div>
                        <input
                          type="text"
                          placeholder={t.placeholder_custom_trade || 'e.g. Appliance Repair, Solar Tech (max 30 chars)'}
                          required
                          maxLength={30}
                          value={customTrade}
                          onChange={(e) => setCustomTrade(e.target.value.slice(0, 30))}
                          style={inputStyle}
                        />
                      </div>
                    )}
                    <button type="submit" disabled={loading} className="btn btn-primary"
                      style={{ marginTop: '0.75rem', width: '100%' }}>
                      {loading ? t.btn_sending_otp : t.btn_register_verify}
                    </button>
                  </form>
                )}
              </div>
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
                    value={otp} onChange={handleOtpChange} disabled={loading} autoFocus
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
                    borderRadius: '10px', cursor: 'pointer', color: 'var(--foreground)', textAlign: 'left',
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

      </div>
    </div>
  );
}
