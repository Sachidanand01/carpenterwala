'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MESSAGES = [
  {
    id: 1,
    badge: "🛡️ Appliance Warranty Vault",
    title: "Wait! Manage Your Device & Appliance Warranties",
    description: "Never worry about forgetting when your warranty expires.",
    message: "Did you know you can manage all your appliance and device warranties in one secure place? Upload bills, track coverages, and get smart alerts before warranties expire. Plan ahead with complete peace of mind.",
    ctaText: "Try Warranty Vault Now",
    ctaLink: "/bookings?tab=warranties",
    image: "/images/exit-intent-warranty.jpg",
    imageAlt: "Appliance Warranty Vault",
    accentColor: "var(--primary)"
  },
  {
    id: 2,
    badge: "🎨 Smart Paint Estimator",
    title: "Have You Explored Our Paint Calculator?",
    description: "Plan a high-level budget before starting your home project.",
    message: "Estimating your paint requirements is simple and fast! Calculate exact wall surface areas, paint volume in litres, primer needs, and realistic labor costs for 1BHK, 2BHK, 3BHK, or custom layouts in seconds.",
    ctaText: "Try Paint Calculator",
    ctaLink: "/services/painting#calculator",
    image: "/images/exit-intent-paint.jpg",
    imageAlt: "Paint Quantity and Budget Calculator",
    accentColor: "#D97706"
  },
  {
    id: 3,
    badge: "💧 Water & Bill Saver",
    title: "Do You Know How Much Water You Are Wasting?",
    description: "A leaking tap wastes hundreds of liters quietly every month.",
    message: "If your faucet or flush valve is dripping, calculate your exact water wastage and financial loss with our interactive drip calculator. See how much money you can save by fixing leaks today!",
    ctaText: "Try Drip Calculator",
    ctaLink: "/services/plumbing#calculator",
    image: "/images/exit-intent-drip.jpg",
    imageAlt: "Faucet Drip and Water Loss Calculator",
    accentColor: "#0284c7"
  },
  {
    id: 4,
    badge: "⚡ Power & Cost Optimizer",
    title: "Calculate Your Electricity Consumption",
    description: "Identify vampire power draw and reduce utility bills.",
    message: "Did you know you can calculate your electricity consumption with our electricity calculator? Explore appliance-level power drain, compare standard vs BLDC efficiencies, and lower your monthly bills.",
    ctaText: "Try Electricity Calculator",
    ctaLink: "/services/electrical#calculator",
    image: "/images/exit-intent-electricity.jpg",
    imageAlt: "Electricity Consumption and Wastage Calculator",
    accentColor: "#f59e0b"
  }
];

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const router = useRouter();

  const triggerModal = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Check if already shown during this session
    const alreadyShown = sessionStorage.getItem('exit_intent_modal_shown');
    if (alreadyShown === 'true') return;

    // Pick one message randomly out of the 4
    const randomIndex = Math.floor(Math.random() * MESSAGES.length);
    setSelectedMessage(MESSAGES[randomIndex]);
    setIsOpen(true);

    // Save session flag so it displays at most once per session
    sessionStorage.setItem('exit_intent_modal_shown', 'true');
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCtaClick = (e, link) => {
    e.preventDefault();
    setIsOpen(false);
    
    // For warranty tab, check customer login state to streamline the journey
    if (link.includes('tab=warranties')) {
      const isLoggedIn = !!localStorage.getItem('customer_phone');
      if (!isLoggedIn) {
        router.push(`/login?redirect=${encodeURIComponent('/bookings?tab=warranties')}`);
        return;
      }
    }

    router.push(link);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Initialize session start time if not set
    if (!sessionStorage.getItem('session_start_time')) {
      sessionStorage.setItem('session_start_time', Date.now().toString());
    }

    // 2. Desktop Exit Intent Listener (Mouse leaving from the top of the viewport)
    const handleMouseLeave = (e) => {
      if (e.clientY <= 5) {
        triggerModal();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    // 3. Idle Inactivity Tracker (User spent > 10 minutes total on site AND is idle for > 1 minute)
    let lastActivity = Date.now();

    const recordActivity = () => {
      lastActivity = Date.now();
    };

    window.addEventListener('mousemove', recordActivity, { passive: true });
    window.addEventListener('keydown', recordActivity, { passive: true });
    window.addEventListener('scroll', recordActivity, { passive: true });
    window.addEventListener('click', recordActivity, { passive: true });
    window.addEventListener('touchstart', recordActivity, { passive: true });

    const idleInterval = setInterval(() => {
      const sessionStart = Number(sessionStorage.getItem('session_start_time') || Date.now());
      const totalSessionDuration = Date.now() - sessionStart;
      const idleDuration = Date.now() - lastActivity;

      const TEN_MINUTES_MS = 10 * 60 * 1000;
      const ONE_MINUTE_MS = 60 * 1000;

      if (totalSessionDuration >= TEN_MINUTES_MS && idleDuration >= ONE_MINUTE_MS) {
        triggerModal();
      }
    }, 4000);

    // Escape key listener to close modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', recordActivity);
      window.removeEventListener('keydown', recordActivity);
      window.removeEventListener('scroll', recordActivity);
      window.removeEventListener('click', recordActivity);
      window.removeEventListener('touchstart', recordActivity);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(idleInterval);
    };
  }, [triggerModal]);

  if (!isOpen || !selectedMessage) return null;

  return (
    <div 
      className="exit-intent-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .exit-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 820px;
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          background: var(--background, #FAF8F5);
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--glass-border);
          position: relative;
        }
        @media (max-width: 768px) {
          .exit-modal-grid {
            grid-template-columns: 1fr;
            max-height: 90vh;
            overflow-y: auto;
          }
          .exit-modal-img-container {
            height: 220px !important;
          }
        }
      `}</style>

      <div className="exit-modal-grid">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(0, 0, 0, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: 'var(--foreground)',
            zIndex: 10,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.08)'}
        >
          ✕
        </button>

        {/* 50% Image Section */}
        <div 
          className="exit-modal-img-container"
          style={{
            position: 'relative',
            background: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            minHeight: '380px'
          }}
        >
          <img
            src={selectedMessage.image}
            alt={selectedMessage.imageAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)'
          }} />
        </div>

        {/* 50% Message & CTA Content Section */}
        <div style={{
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          {/* Badge */}
          <div style={{
            alignSelf: 'flex-start',
            padding: '0.35rem 0.85rem',
            borderRadius: '100px',
            background: 'var(--primary-light, rgba(194, 65, 12, 0.12))',
            color: 'var(--primary, #C2410C)',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            {selectedMessage.badge}
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            lineHeight: 1.25,
            color: 'var(--foreground)',
            margin: 0
          }}>
            {selectedMessage.title}
          </h3>

          {/* Short Description */}
          <p style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--primary, #C2410C)',
            margin: 0
          }}>
            {selectedMessage.description}
          </p>

          {/* Full Message Body */}
          <p style={{
            fontSize: '0.88rem',
            lineHeight: 1.55,
            color: 'var(--foreground-muted, #475569)',
            margin: '0.25rem 0 0.75rem 0'
          }}>
            {selectedMessage.message}
          </p>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            marginTop: '0.5rem'
          }}>
            <button
              onClick={(e) => handleCtaClick(e, selectedMessage.ctaLink)}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px var(--primary-glow)'
              }}
            >
              <span>{selectedMessage.ctaText}</span>
              <span style={{ fontSize: '1.1rem' }}>→</span>
            </button>

            <button
              onClick={handleClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--foreground-muted)',
                fontSize: '0.85rem',
                padding: '0.4rem',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'underline',
                opacity: 0.8
              }}
            >
              No thanks, I'll explore later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
