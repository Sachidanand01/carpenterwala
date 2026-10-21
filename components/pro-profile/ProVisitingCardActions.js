'use client';
import { useState } from 'react';

export default function ProVisitingCardActions({ profile, canonicalUrl }) {
  const [copied, setCopied] = useState(false);

  const cleanTrade = profile?.trade || 'Handyman';
  const cleanName = profile?.name || 'Professional';
  const cleanLocation = profile?.location || 'Bangalore';
  const fullUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://carpenterwala.com');

  const shareText = `Check out ${cleanName}'s verified ${cleanTrade} profile in ${cleanLocation} on Carpenterwala! View past work photos, skills, and book directly with 0% platform commission: ${fullUrl}`;

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ width: '100%', marginTop: '1.25rem' }}>
      {/* Trust Badges Breakdown */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        textAlign: 'left'
      }}>
        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.6px', opacity: 0.6, fontWeight: 700 }}>
          🛡️ Verified Trust Credentials
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span>
          <span style={{ opacity: 0.9 }}>Government ID Verified</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span>
          <span style={{ opacity: 0.9 }}>Police Verification Checked</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--primary, #ea580c)', fontWeight: 800 }}>✓</span>
          <span style={{ opacity: 0.9 }}>0% Platform Fee / Direct Deal</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#3b82f6', fontWeight: 800 }}>✓</span>
          <span style={{ opacity: 0.9 }}>Free Facilitation by Carpenterwala</span>
        </div>
      </div>

      {/* Action Buttons for Pros and Customers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: '0.7rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            border: '1px solid rgba(22, 163, 74, 0.4)',
            background: 'rgba(22, 163, 74, 0.08)',
            color: '#16a34a',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>📲</span>
          <span>Share Profile on WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: '0.65rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 550,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
            background: copied ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.03)',
            color: copied ? '#16a34a' : 'inherit',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span>{copied ? '✅' : '📋'}</span>
          <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Digital Visiting Card Link'}</span>
        </button>
      </div>
    </div>
  );
}
