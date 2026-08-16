import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const headers = request.headers;

    // 1. Check direct cloud deployment headers
    const vercelCity = headers.get('x-vercel-ip-city');
    const cloudflareCity = headers.get('cf-ipcity');

    if (vercelCity) {
      return NextResponse.json({ city: decodeURIComponent(vercelCity), source: 'vercel-header' });
    }

    if (cloudflareCity) {
      return NextResponse.json({ city: decodeURIComponent(cloudflareCity), source: 'cf-header' });
    }

    // 2. Extract client IP
    const forwardedFor = headers.get('x-forwarded-for');
    const realIp = headers.get('x-real-ip');
    let clientIp = '';

    if (forwardedFor) {
      clientIp = forwardedFor.split(',')[0].trim();
    } else if (realIp) {
      clientIp = realIp.trim();
    }

    // If IP is localhost or private, we can fetch public IP information
    const isLocal = !clientIp || clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.');
    const geoUrl = isLocal ? 'https://ipapi.co/json/' : `https://ipapi.co/${clientIp}/json/`;

    const geoRes = await fetch(geoUrl, {
      next: { revalidate: 3600 }, // Cache lookup for 1 hour
      headers: { 'User-Agent': 'Carpenterwala-GeoService/1.0' }
    });

    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData && geoData.city) {
        return NextResponse.json({
          city: geoData.city,
          region: geoData.region,
          country: geoData.country_name,
          source: 'ipapi'
        });
      }
    }

    // 3. Fallback to ipwho.is if ipapi limit reached
    const fallbackRes = await fetch(isLocal ? 'https://ipwho.is/' : `https://ipwho.is/${clientIp}`);
    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (fallbackData && fallbackData.success && fallbackData.city) {
        return NextResponse.json({
          city: fallbackData.city,
          region: fallbackData.region,
          country: fallbackData.country,
          source: 'ipwhois'
        });
      }
    }

    // Default fallback
    return NextResponse.json({ city: 'Bangalore', source: 'default-fallback' });
  } catch (error) {
    console.error('Geo detection error:', error);
    return NextResponse.json({ city: 'Bangalore', source: 'error-fallback' });
  }
}
