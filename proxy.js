import { NextResponse } from 'next/server';

export function proxy(request) {
  const response = NextResponse.next();

  // Add security headers to all matched responses
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://*.google.com https://*.googletagmanager.com https://*.google-analytics.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://pagead2.googlesyndication.com https://adservice.google.com https://*.doubleclick.net https://www.facebook.com https://*.googletagmanager.com https://*.google-analytics.com; connect-src 'self' https://*.supabase.co https://pagead2.googlesyndication.com https://adservice.google.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.adtrafficquality.google https://*.doubleclick.net; frame-src 'self' https://googleads.g.doubleclick.net https://*.google.com https://pagead2.googlesyndication.com https://adservice.google.com; object-src 'none';"
  );

  return response;
}

// Match all request paths except API routes, static assets (_next/static, _next/image, public images/favicons)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|favicon.svg|images|globe.svg|window.svg|next.svg|vercel.svg).*)',
  ],
};
