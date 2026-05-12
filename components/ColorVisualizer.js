"use client";

import { useState } from 'react';

const ROOMS = [
  { id: 'living', name: 'Living Room', image: '/images/visualizer-living-room.png' },
  { id: 'bedroom', name: 'Bedroom', image: '/images/visualizer-bedroom.png' },
];

const COLORS = [
  { name: 'Sky Blue', hex: '#87CEEB', category: 'Modern' },
  { name: 'Sage Green', hex: '#8A9A5B', category: 'Modern' },
  { name: 'Terracotta', hex: '#E2725B', category: 'Classic' },
  { name: 'Creamy White', hex: '#FFFDD0', category: 'Classic' },
  { name: 'Royal Navy', hex: '#002366', category: 'Vibrant' },
  { name: 'Sunshine Yellow', hex: '#FFDB58', category: 'Vibrant' },
  { name: 'Soft Lavender', hex: '#E6E6FA', category: 'Modern' },
  { name: 'Charcoal Gray', hex: '#36454F', category: 'Modern' },
];

export default function ColorVisualizer() {
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  return (
    <div className="glass" style={{ padding: '2rem', marginBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Paint Color Visualizer</h2>
        <p style={{ opacity: 0.7 }}>See how different colors transform your space before you commit.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Preview Area */}
        <div style={{ flex: '2 1 500px', position: 'relative', borderRadius: '12px', overflow: 'hidden', minHeight: '400px', backgroundColor: '#f0f0f0' }}>
          {/* Base Room Image */}
          <img 
            src={selectedRoom.image} 
            alt={selectedRoom.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
          />
          
          {/* Color Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: selectedColor.hex,
            mixBlendMode: 'multiply',
            opacity: 0.7,
            pointerEvents: 'none',
            transition: 'background-color 0.5s ease'
          }}></div>

          <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', backdropFilter: 'blur(5px)' }}>
            Previewing: <strong>{selectedColor.name}</strong>
          </div>
        </div>

        {/* Controls */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Room Selector */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Select Room Type</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {ROOMS.map(room => (
                <button 
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: selectedRoom.id === room.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                    background: selectedRoom.id === room.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Choose a Color</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {COLORS.map(color => (
                <button 
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  style={{
                    width: '100%',
                    paddingBottom: '100%',
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    border: selectedColor.name === color.name ? '3px solid white' : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: selectedColor.name === color.name ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                    transition: 'transform 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>

          <div className="glass" style={{ padding: '1rem', marginTop: 'auto', fontSize: '0.85rem' }}>
            <p style={{ opacity: 0.8 }}>
              <strong>Tip:</strong> Lighting affects how paint looks. Our professionals can bring physical shade cards to your home for the most accurate match.
            </p>
          </div>

          <Link href="/find-a-professional?category=Painter" className="btn btn-primary" style={{ width: '100%' }}>
            Book a Professional Painter
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
