'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuthorizeForm() {
  const searchParams = useSearchParams();

  const clientId = searchParams.get('client_id') || 'AI Assistant';
  const redirectUri = searchParams.get('redirect_uri') || '';
  const state = searchParams.get('state') || '';
  const codeChallenge = searchParams.get('code_challenge') || '';
  const codeChallengeMethod = searchParams.get('code_challenge_method') || 'S256';
  const scope = searchParams.get('scope') || 'customer pro';

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP & Consent
  const [otpToken, setOtpToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  const [clientDisplayName, setClientDisplayName] = useState('AI Assistant (ChatGPT / Claude)');

  useEffect(() => {
    if (redirectUri) {
      if (redirectUri.includes('chatgpt.com') || redirectUri.includes('openai.com')) {
        setClientDisplayName('ChatGPT');
      } else if (redirectUri.includes('claude.ai') || redirectUri.includes('anthropic.com')) {
        setClientDisplayName('Claude');
      } else if (redirectUri.includes('localhost')) {
        setClientDisplayName('Local MCP Tool');
      }
    }
  }, [redirectUri]);

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/oauth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          phone: cleanPhone
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP.');
      }

      setOtpToken(data.otpToken);
      if (data.debugOtp) {
        setDebugOtp(data.debugOtp);
      }
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Authorize Client
  const handleVerifyAndApprove = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/oauth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          phone,
          otp: otp.trim(),
          otpToken,
          clientId,
          redirectUri,
          codeChallenge,
          codeChallengeMethod,
          scopes: scope.split(' ').filter(Boolean)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed. Please check your OTP.');
      }

      // Build OAuth callback redirect
      if (!redirectUri) {
        setError('Authorization successful, but no redirect_uri was provided by the client.');
        return;
      }

      const callbackUrl = new URL(redirectUri);
      callbackUrl.searchParams.set('code', data.code);
      if (state) {
        callbackUrl.searchParams.set('state', state);
      }

      // Redirect back to ChatGPT / Claude
      window.location.href = callbackUrl.href;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '0 auto',
      background: 'var(--surface-color, #1e293b)',
      borderRadius: '24px',
      padding: '2.5rem 2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
      color: '#f8fafc'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #FF6B00 0%, #EA580C 100%)',
          color: '#fff',
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '1rem',
          boxShadow: '0 8px 25px rgba(255, 107, 0, 0.4)'
        }}>
          CW
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0 0 0.4rem 0' }}>
          Connect to Carpenterwala
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
          Authorize <strong style={{ color: '#fff' }}>{clientDisplayName}</strong> to access your account.
        </p>
      </div>

      {/* Permissions Box */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.75rem',
        fontSize: '0.85rem'
      }}>
        <div style={{ fontWeight: '600', color: '#e2e8f0', marginBottom: '0.6rem' }}>
          This will allow {clientDisplayName} to:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1', lineHeight: '1.6' }}>
          <li>View your appliance warranties & repair records</li>
          <li>Check active service bookings & dispatch technicians</li>
          <li>For Service Pros: Manage assigned jobs & availability</li>
        </ul>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          fontSize: '0.88rem',
          marginBottom: '1.25rem'
        }}>
          {error}
        </div>
      )}

      {debugOtp && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid #3b82f6',
          color: '#93c5fd',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          fontSize: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          Demo Testing OTP: <strong>{debugOtp}</strong>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOtp}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '500', marginBottom: '0.5rem', color: '#e2e8f0' }}>
              Your Mobile Number
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#cbd5e1'
              }}>
                +91
              </div>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                autoFocus
                required
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  fontSize: '1rem',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem' }}>
              Works for both Bangalore homeowners and Pan-India service professionals.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || phone.length !== 10}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '12px',
              background: loading || phone.length !== 10 ? '#475569' : 'linear-gradient(135deg, #FF6B00 0%, #EA580C 100%)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: loading || phone.length !== 10 ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)'
            }}
          >
            {loading ? 'Sending OTP...' : 'Send Login OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndApprove}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '500', color: '#e2e8f0' }}>
                Enter 6-Digit OTP sent to +91 {phone}
              </label>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#FF6B00', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Change Number
              </button>
            </div>
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              autoFocus
              required
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                fontSize: '1.5rem',
                letterSpacing: '6px',
                textAlign: 'center',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => {
                if (redirectUri) {
                  window.location.href = `${redirectUri}?error=access_denied&state=${encodeURIComponent(state)}`;
                } else {
                  window.history.back();
                }
              }}
              style={{
                flex: 1,
                padding: '0.9rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                fontSize: '0.95rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={{
                flex: 2,
                padding: '0.9rem',
                borderRadius: '12px',
                background: loading || otp.length !== 6 ? '#475569' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: '600',
                border: 'none',
                cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              {loading ? 'Authorizing...' : `Approve & Connect`}
            </button>
          </div>
        </form>
      )}

      <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.78rem', color: '#64748b' }}>
        Protected by Carpenterwala OAuth 2.1 & PKCE · <Link href="/privacy" style={{ color: '#94a3b8' }}>Privacy Policy</Link> · <Link href="/terms" style={{ color: '#94a3b8' }}>Terms</Link>
      </div>
    </div>
  );
}

export default function AuthorizePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0B1120 100%)'
    }}>
      <Suspense fallback={<div style={{ color: '#FF6B00', fontWeight: 'bold' }}>Loading Authorization...</div>}>
        <AuthorizeForm />
      </Suspense>
    </div>
  );
}
