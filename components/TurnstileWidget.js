'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Cloudflare Turnstile Invisible/Managed Bot Protection Widget
 * Wraps Cloudflare Turnstile explicit rendering.
 */
export default function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  className = '',
  theme = 'light',
  size = 'flexible', // 'normal', 'flexible', or 'compact'
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const siteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '0x4AAAAAAFcbEwvGYiYvRV5_';

  useEffect(() => {
    // If no siteKey or running in non-browser environment
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Check if script is already injected
    const SCRIPT_ID = 'cf-turnstile-script';
    let script = document.getElementById(SCRIPT_ID);

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) return;
      if (widgetIdRef.current) return; // Already rendered

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: (token) => {
            if (onVerify) onVerify(token);
          },
          'expired-callback': () => {
            if (onExpire) onExpire();
            if (window.turnstile && id) {
              window.turnstile.reset(id);
            }
          },
          'error-callback': (err) => {
            if (onError) onError(err);
          },
        });
        widgetIdRef.current = id;
        setLoaded(true);
      } catch (err) {
        console.warn('[Turnstile] Render warning:', err);
      }
    };

    if (!window.turnstile) {
      if (!script) {
        script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          renderWidget();
        };
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', renderWidget);
      }
    } else {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          // Ignore cleanup error on unmount
        }
      }
    };
  }, [siteKey, onVerify, onExpire, onError, theme, size]);

  return (
    <div className={`turnstile-container my-2 ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}
