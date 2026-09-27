'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

/**
 * ServiceRadiusMap
 * Interactive OpenStreetMap component with draggable pin and real-time terracotta radius circle.
 *
 * Props:
 * - latitude: number
 * - longitude: number
 * - radiusKm: number (1-50, default 5)
 * - onChangeRadius: (newRadius: number) => void
 * - onChangeCoords?: (coords: { lat: number, lng: number }) => void
 * - radiusUpdatedAt?: string | null (ISO timestamp)
 * - isLocked?: boolean
 * - isOnboarding?: boolean
 */
export default function ServiceRadiusMap({
  latitude = 12.9716,
  longitude = 77.5946,
  radiusKm = 5,
  onChangeRadius,
  onChangeCoords,
  radiusUpdatedAt = null,
  isLocked = false,
  isOnboarding = false,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  const [activeRadius, setActiveRadius] = useState(radiusKm || 5);
  const [coords, setCoords] = useState({ lat: latitude || 12.9716, lng: longitude || 77.5946 });
  const [cooldownRemaining, setCooldownRemaining] = useState(null);

  // Sync internal state if props change from outside (e.g. Geocoding from address input)
  useEffect(() => {
    if (latitude && longitude && (latitude !== coords.lat || longitude !== coords.lng)) {
      setCoords({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (radiusKm && radiusKm !== activeRadius) {
      setActiveRadius(radiusKm);
    }
  }, [radiusKm]);

  // Check 24-hour cooldown if in profile mode (not onboarding)
  useEffect(() => {
    if (isOnboarding || !radiusUpdatedAt) {
      setCooldownRemaining(null);
      return;
    }

    const checkCooldown = () => {
      const updatedTime = new Date(radiusUpdatedAt).getTime();
      if (isNaN(updatedTime)) {
        setCooldownRemaining(null);
        return;
      }

      const diffMs = Date.now() - updatedTime;
      const cooldownMs = 24 * 60 * 60 * 1000;

      if (diffMs < cooldownMs) {
        const remainingMs = cooldownMs - diffMs;
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        setCooldownRemaining({ hours, minutes });
      } else {
        setCooldownRemaining(null);
      }
    };

    checkCooldown();
    const timer = setInterval(checkCooldown, 60000);
    return () => clearInterval(timer);
  }, [radiusUpdatedAt, isOnboarding]);

  const locked = Boolean(isLocked || cooldownRemaining);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialLat = coords.lat || 12.9716;
      const initialLng = coords.lng || 77.5946;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // Add OpenStreetMap standard tiles (100% free, public, no API key required)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom terracotta pin icon
      const terracottaPin = L.divIcon({
        className: 'custom-pro-pin',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; pointer-events: auto; cursor: grab;">
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(194, 65, 12, 0.28); transform: scale(1.1);"></div>
            <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: #C2410C; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #FFF; font-size: 13px; font-weight: bold;">
              📍
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      // Marker
      const marker = L.marker([initialLat, initialLng], {
        icon: terracottaPin,
        draggable: !locked,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 0.8rem; text-align: center; color: #1E293B;">
          <strong>Your Workshop / Base</strong><br/>
          <span style="color: #64748B; font-size: 0.72rem;">Drag pin to adjust exact location</span>
        </div>
      `);

      marker.on('dragend', () => {
        const newPos = marker.getLatLng();
        setCoords({ lat: newPos.lat, lng: newPos.lng });
        if (circleRef.current) {
          circleRef.current.setLatLng(newPos);
        }
        if (onChangeCoords) {
          onChangeCoords({ lat: newPos.lat, lng: newPos.lng });
        }
      });

      // Click on map to move pin
      map.on('click', (e) => {
        if (locked) return;
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCoords({ lat, lng });
        if (circleRef.current) {
          circleRef.current.setLatLng([lat, lng]);
        }
        if (onChangeCoords) {
          onChangeCoords({ lat, lng });
        }
      });

      // Radius Circle
      const circle = L.circle([initialLat, initialLng], {
        radius: (activeRadius || 5) * 1000,
        color: '#C2410C',
        weight: 2,
        opacity: 0.85,
        fillColor: '#C2410C',
        fillOpacity: 0.18,
      }).addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;
      circleRef.current = circle;

      // Fit map bounds to circle and invalidate size to ensure tiles render immediately
      try {
        map.fitBounds(circle.getBounds(), { padding: [25, 25], maxZoom: 13 });
      } catch (e) {
        // ignore bounds fit error
      }

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 450);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position & circle when coords change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !circleRef.current) return;
    const curPos = markerRef.current.getLatLng();
    if (Math.abs(curPos.lat - coords.lat) > 0.0001 || Math.abs(curPos.lng - coords.lng) > 0.0001) {
      markerRef.current.setLatLng([coords.lat, coords.lng]);
      circleRef.current.setLatLng([coords.lat, coords.lng]);
      mapInstanceRef.current.panTo([coords.lat, coords.lng]);
    }
  }, [coords]);

  // Update circle radius when activeRadius changes
  useEffect(() => {
    if (!circleRef.current || !mapInstanceRef.current) return;
    circleRef.current.setRadius(activeRadius * 1000);
    try {
      mapInstanceRef.current.fitBounds(circleRef.current.getBounds(), { padding: [25, 25], maxZoom: 13 });
    } catch (e) {
      // ignore
    }
  }, [activeRadius]);

  const handleSliderChange = (e) => {
    if (locked) return;
    const val = Number(e.target.value);
    setActiveRadius(val);
    if (onChangeRadius) {
      onChangeRadius(val);
    }
  };

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid rgba(194, 65, 12, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      marginTop: '0.75rem',
      marginBottom: '1rem',
    }}>
      {/* Header bar */}
      <div style={{
        background: '#FAF8F5',
        borderBottom: '1px solid rgba(194, 65, 12, 0.12)',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🗺️</span>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#1E293B' }}>
              Service Coverage Radius
            </h4>
            <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
              Center pin updates with your address. Drag pin to fine-tune.
            </span>
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'rgba(194, 65, 12, 0.1)',
          color: '#C2410C',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontWeight: 700,
          fontSize: '0.82rem',
          border: '1px solid rgba(194, 65, 12, 0.25)',
        }}>
          <span>📍 Radius:</span>
          <span style={{ fontSize: '0.95rem' }}>{activeRadius} km</span>
        </div>
      </div>

      {/* 24h Lock Warning if active */}
      {cooldownRemaining && (
        <div style={{
          background: '#FFFBEB',
          borderBottom: '1px solid #FDE68A',
          color: '#B45309',
          padding: '0.6rem 1rem',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span>🔒</span>
          <span>
            <strong>Radius locked:</strong> You can update your service radius once every 24 hours. Next change available in <strong>{cooldownRemaining.hours}h {cooldownRemaining.minutes}m</strong>.
          </span>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '240px',
          background: '#F1F5F9',
          position: 'relative',
          zIndex: 1,
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .leaflet-container img {
            max-width: none !important;
            max-height: none !important;
          }
        `
      }} />

      {/* Slider & Description Controls */}
      <div style={{ padding: '1rem 1.25rem 1.1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
            Adjust Service Range:
          </span>
          <span style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#C2410C',
            letterSpacing: '-0.02em',
          }}>
            {activeRadius} km
          </span>
        </div>

        {/* Custom Styled Terracotta Slider */}
        <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={activeRadius}
            disabled={locked}
            onChange={handleSliderChange}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '9999px',
              appearance: 'none',
              WebkitAppearance: 'none',
              background: `linear-gradient(to right, #C2410C 0%, #C2410C ${((activeRadius - 1) / 49) * 100}%, #E2E8F0 ${((activeRadius - 1) / 49) * 100}%, #E2E8F0 100%)`,
              outline: 'none',
              cursor: locked ? 'not-allowed' : 'pointer',
              opacity: locked ? 0.6 : 1,
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.65rem' }}>
          <span>1 km (Local)</span>
          <span>25 km (City Zone)</span>
          <span>50 km (Max Radius)</span>
        </div>

        <p style={{
          margin: 0,
          fontSize: '0.78rem',
          color: '#64748B',
          textAlign: 'center',
          lineHeight: 1.4,
        }}>
          💡 Customer inquiries and booking leads within <strong>{activeRadius} km</strong> will match your profile and show up on your direct contact feed.
        </p>
      </div>
    </div>
  );
}
