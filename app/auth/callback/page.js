'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'customer'; // 'customer' or 'pro'
  const redirectTarget = searchParams.get('redirect') || (role === 'pro' ? '/pro/dashboard' : '/bookings');

  const [status, setStatus] = useState('Authenticating with Google...');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function handleAuth() {
      try {
        // 1. Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          if (isMounted) setError('Authentication failed. Please try signing in again.');
          return;
        }

        if (session && session.user) {
          await processUser(session.user);
          return;
        }

        // 2. If session isn't immediately available, listen to auth state changes (handles OAuth token exchange)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (event === 'SIGNED_IN' && currentSession?.user) {
            await processUser(currentSession.user);
          }
        });

        // Timeout fallback if no auth detected after 6 seconds
        const timer = setTimeout(() => {
          if (isMounted && !session) {
            setError('Sign-in process timed out or was cancelled. Please try again.');
          }
        }, 6000);

        return () => {
          subscription?.unsubscribe();
          clearTimeout(timer);
        };
      } catch (err) {
        console.error('Callback error:', err);
        if (isMounted) setError('Unexpected error during authentication.');
      }
    }

    async function processUser(user) {
      const email = user.email;
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.user_name || '';
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

      if (!email) {
        if (isMounted) setError('Could not retrieve email address from your Google account.');
        return;
      }

      if (role === 'customer') {
        if (isMounted) setStatus('Checking Customer account...');
        try {
          const res = await fetch(`/api/customer/check?email=${encodeURIComponent(email.toLowerCase())}`);
          const data = await res.json();

          if (res.ok && data.registered && data.customer) {
            // Existing customer found
            if (typeof window !== 'undefined') {
              localStorage.setItem('customer_phone', data.customer.phone);
              localStorage.setItem('customer_name', data.customer.name);
              localStorage.setItem('customer_email', data.customer.email);
              window.dispatchEvent(new Event('customer-login-changed'));
            }
            if (isMounted) {
              setStatus('Welcome back! Redirecting...');
              router.push(redirectTarget || '/bookings');
            }
          } else {
            // New customer or missing phone number
            const targetUrl = `/auth/complete-profile?role=customer&email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}&redirect=${encodeURIComponent(redirectTarget || '/bookings')}`;
            if (isMounted) router.push(targetUrl);
          }
        } catch (err) {
          console.error('Customer lookup error:', err);
          const targetUrl = `/auth/complete-profile?role=customer&email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}&redirect=${encodeURIComponent(redirectTarget || '/bookings')}`;
          if (isMounted) router.push(targetUrl);
        }
      } else if (role === 'pro') {
        if (isMounted) setStatus('Checking Professional account...');
        try {
          const { data: profile, error: proErr } = await supabase
            .from('profiles')
            .select('id, slug, name, trade, location, email, phone')
            .eq('email', email.toLowerCase())
            .maybeSingle();

          if (proErr) {
            console.error('Pro lookup error:', proErr);
          }

          if (profile) {
            // Existing Pro found
            if (typeof window !== 'undefined') {
              localStorage.setItem('pro_id', profile.id);
              localStorage.setItem('pro_slug', profile.slug);
              localStorage.setItem('pro_name', profile.name);
              localStorage.setItem('pro_trade', profile.trade);
              window.dispatchEvent(new Event('pro-login-changed'));
            }
            if (isMounted) {
              setStatus('Welcome back! Redirecting to Dashboard...');
              router.push('/pro/dashboard');
            }
          } else {
            // New Pro registration needed
            const targetUrl = `/auth/complete-profile?role=pro&email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}&avatar=${encodeURIComponent(avatarUrl)}`;
            if (isMounted) router.push(targetUrl);
          }
        } catch (err) {
          console.error('Pro check error:', err);
          const targetUrl = `/auth/complete-profile?role=pro&email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}&avatar=${encodeURIComponent(avatarUrl)}`;
          if (isMounted) router.push(targetUrl);
        }
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
    };
  }, [role, redirectTarget, router]);

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - var(--navbar-height))', padding: '2rem 1rem' }}>
      <div className="glass animate-fade-in" style={{
        padding: '3rem 2rem',
        maxWidth: '460px',
        width: '100%',
        borderRadius: '16px',
        textAlign: 'center',
        boxShadow: '0 12px 40px rgba(0,0,0,0.35)'
      }}>
        {!error ? (
          <>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              margin: '0 auto 1.5rem',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: 'var(--primary)',
              animation: 'spin 1s linear infinite'
            }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Signing In
            </h2>
            <p style={{ opacity: 0.8, fontSize: '0.95rem', margin: 0 }}>
              {status}
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f87171' }}>
              Sign-In Failed
            </h2>
            <p style={{ opacity: 0.85, fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>
              {error}
            </p>
            <Link
              href={role === 'pro' ? '/pro/login' : '/login'}
              className="btn btn-primary"
              style={{ display: 'inline-block', width: '100%', padding: '0.8rem' }}
            >
              Return to {role === 'pro' ? 'Pro Login' : 'Customer Login'}
            </Link>
          </>
        )}
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', textAlign: 'center' }}>
          <p>Processing sign-in...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
