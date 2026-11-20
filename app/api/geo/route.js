import { NextResponse } from 'next/server';
import net from 'net';

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

    // 2. Extract client IP safely with CF precedence and strict IP format validation
    const cfIp = headers.get('cf-connecting-ip')?.trim();
    const forwardedFor = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const realIp = headers.get('x-real-ip')?.trim();
    const candidateIp = cfIp || forwardedFor || realIp || '';

    // Validate IP format (IPv4 or IPv6) to prevent SSRF / path injection
    const isValidIp = candidateIp && net.isIP(candidateIp) !== 0;
    const clientIp = isValidIp ? candidateIp : '';

    // If IP is localhost or private, fetch public IP info
    const isLocal =
      !clientIp ||
      clientIp === '127.0.0.1' ||
      clientIp === '::1' ||
      clientIp.startsWith('192.168.') ||
      clientIp.startsWith('10.') ||
      clientIp.startsWith('172.16.') ||
      clientIp.startsWith('172.17.') ||
      clientIp.startsWith('172.18.') ||
      clientIp.startsWith('172.19.') ||
      clientIp.startsWith('172.2') ||
      clientIp.startsWith('172.30.') ||
      clientIp.startsWith('172.31.');

    const geoUrl = isLocal ? 'https://ipapi.co/json/' : `https://ipapi.co/${encodeURIComponent(clientIp)}/json/`;

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
    const fallbackUrl = isLocal ? 'https://ipwho.is/' : `https://ipwho.is/${encodeURIComponent(clientIp)}`;
    const fallbackRes = await fetch(fallbackUrl);
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
