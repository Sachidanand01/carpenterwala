import { NextResponse } from 'next/server';

export function proxy(request) {
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto');
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  // 1. Origin Cloaking / Direct Access Protection
  // If ORIGIN_SECRET is configured, ensure request originated from Cloudflare edge
  const originSecret = process.env.ORIGIN_SECRET;
  if (process.env.NODE_ENV === 'production' && originSecret && !isLocal) {
    const incomingSecret = request.headers.get('x-carpenterwala-origin-secret');
    if (incomingSecret !== originSecret) {
      return new NextResponse('Access Denied: Direct origin requests are forbidden.', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  // 2. 301 Permanent Redirect for www to root domain
  if (host.startsWith('www.')) {
    const cleanHost = host.replace(/^www\./, '');
    const url = new URL(request.url);
    url.host = cleanHost;
    url.protocol = 'https:';
    return NextResponse.redirect(url.toString(), 301);
  }

  // 3. 301 Permanent Redirect for HTTP to HTTPS in production
  if (proto === 'http' && !isLocal) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    return NextResponse.redirect(url.toString(), 301);
  }

  const response = NextResponse.next();

  // Add security headers to all matched responses
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://adservice.google.com https://*.google.com https://*.googletagmanager.com https://*.google-analytics.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://*.googleusercontent.com https://lh3.googleusercontent.com https://pagead2.googlesyndication.com https://adservice.google.com https://*.doubleclick.net https://www.facebook.com https://*.googletagmanager.com https://*.google-analytics.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://*.basemaps.cartocdn.com https://basemaps.cartocdn.com; connect-src 'self' https://challenges.cloudflare.com https://*.supabase.co https://pagead2.googlesyndication.com https://adservice.google.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.adtrafficquality.google https://*.doubleclick.net https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://*.basemaps.cartocdn.com https://basemaps.cartocdn.com; frame-src 'self' blob: data: https://challenges.cloudflare.com https://*.supabase.co https://googleads.g.doubleclick.net https://*.google.com https://pagead2.googlesyndication.com https://adservice.google.com; object-src 'none';"
  );

  return response;
}

// Match all request paths including API routes, excluding static assets and public icons
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|favicon.svg|images|globe.svg|window.svg|next.svg|vercel.svg).*)',
  ],
};
