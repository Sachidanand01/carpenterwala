'use client';

import { useState } from 'react';
import { unscramblePhone } from '@/lib/phone-obfuscation';

export default function ObfuscatedPhoneCallButton({ 
  scrambledToken, 
  maskedDisplay = '+91 ••••• •••••',
  proName = 'Professional',
  trade = 'Service',
  className = '',
  style = {}
}) {
  const [revealed, setRevealed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRevealAndCall = (e) => {
    e.preventDefault();
    if (!scrambledToken) return;

    const unmasked = unscramblePhone(scrambledToken);
    if (!unmasked) return;

    setPhoneNumber(unmasked);
    setRevealed(true);

    // Direct mobile dialer trigger
    window.location.href = `tel:+91${unmasked}`;
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!phoneNumber) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(`+91${phoneNumber}`);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (revealed && phoneNumber) {
    return (
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.6rem',
          padding: '0.65rem 1rem',
          background: 'rgba(22, 163, 74, 0.08)',
          border: '1px solid rgba(22, 163, 74, 0.35)',
          borderRadius: '10px',
          width: '100%',
          ...style
        }}
        className={className}
      >
        <a
          href={`tel:+91${phoneNumber}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#16a34a',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '0.92rem'
          }}
        >
          <span>📞</span>
          <span>+91 {phoneNumber.slice(0, 5)} {phoneNumber.slice(5)}</span>
        </a>

        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: copied ? '#16a34a' : 'rgba(0, 0, 0, 0.05)',
            color: copied ? '#fff' : 'inherit',
            border: 'none',
            borderRadius: '6px',
            padding: '0.3rem 0.6rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Copy phone number"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleRevealAndCall}
      className={`btn ${className}`}
      style={{
        width: '100%',
        padding: '0.7rem 1rem',
        fontSize: '0.88rem',
        fontWeight: 650,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        border: '1px solid rgba(234, 88, 12, 0.3)',
        background: 'rgba(234, 88, 12, 0.08)',
        color: 'var(--primary, #ea580c)',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        ...style
      }}
      title={`Call verified ${trade} ${proName}`}
    >
      <span style={{ fontSize: '1.05rem' }}>📞</span>
      <span>Call {maskedDisplay}</span>
    </button>
  );
}

