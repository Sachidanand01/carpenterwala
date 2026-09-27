import { NextResponse } from 'next/server';

// In-memory cache to respect OSM Nominatim rate limits and speed up responses
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data) {
  if (cache.size > 1000) {
    // Purge oldest entry
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, { timestamp: Date.now(), data });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 3) {
      return NextResponse.json({ suggestions: [] });
    }

    const cleanQuery = query.trim().toLowerCase();
    const cached = getCached(cleanQuery);
    if (cached) {
      return NextResponse.json({ suggestions: cached, source: 'cache' });
    }

    // 1. Check if user typed a pure 6-digit Indian PIN code
    const isPincode = /^[1-9][0-9]{5}$/.test(cleanQuery);
    if (isPincode) {
      try {
        const pinRes = await fetch(`https://api.postalpincode.in/pincode/${cleanQuery}`, {
          next: { revalidate: 86400 } // Cache for 24h
        });
        const pinData = await pinRes.json();

        if (Array.isArray(pinData) && pinData[0]?.Status === 'Success' && pinData[0]?.PostOffice) {
          const suggestions = pinData[0].PostOffice.slice(0, 5).map((po) => {
            const area = po.Name.replace(/\s*\([^)]*\)/g, '').trim();
            const city = po.District || po.Division || 'Bengaluru';
            const state = po.State || 'Karnataka';
            const formatted = `${area}, ${city}, ${state} - ${cleanQuery}`;
            return {
              displayName: formatted,
              area,
              city,
              state,
              postcode: cleanQuery,
              formatted
            };
          });

          setCached(cleanQuery, suggestions);
          return NextResponse.json({ suggestions, source: 'pincode-api' });
        }
      } catch (err) {
        console.error('Pincode API lookup failed:', err);
      }
    }

    // 2. Query OpenStreetMap Nominatim for Indian addresses
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=in&q=${encodeURIComponent(query.trim())}`;
    
    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'Carpenterwala-AddressService/1.0 (info@carpenterwala.com)',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] });
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = data.map((item) => {
      const addr = item.address || {};
      const houseNumber = addr.house_number || '';
      const road = addr.road || addr.street || addr.pedestrian || '';
      const area = addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict || '';
      const city = addr.city || addr.town || addr.village || addr.city_district || addr.county || 'Bengaluru';
      const state = addr.state || 'Karnataka';
      const postcode = addr.postcode || '';

      const parts = [];
      if (houseNumber) parts.push(houseNumber);
      if (road) parts.push(road);
      if (area && area !== road) parts.push(area);
      if (city) parts.push(city);
      if (state) parts.push(state);

      let formatted = parts.join(', ');
      if (postcode) {
        formatted += ` - ${postcode}`;
      }

      return {
        displayName: item.display_name,
        houseNumber,
        road,
        area,
        city,
        state,
        postcode,
        formatted: formatted || item.display_name,
        lat: item.lat ? parseFloat(item.lat) : null,
        lon: item.lon ? parseFloat(item.lon) : null
      };
    });

    setCached(cleanQuery, suggestions);
    return NextResponse.json({ suggestions, source: 'nominatim' });
  } catch (error) {
    console.error('Address suggestion error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
