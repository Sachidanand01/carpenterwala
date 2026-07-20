'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AffiliateToolsWidget from '@/components/AffiliateToolsWidget';

export default function PaintCalculator() {
  const calcJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Wall Painting Area, Primer & Paint Quantity Cost Estimator",
    "url": "https://carpenterwala.com/services/painting#calculator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Calculate wall surface area, paint litres needed, primer requirements, and total labor and material cost for painting homes in India."
  };

  const [area, setArea] = useState(1000);
  const [projectType, setProjectType] = useState('interior'); // 'interior' or 'exterior'
  const [surfaceCondition, setSurfaceCondition] = useState('repaint'); // 'fresh' or 'repaint'
  const [coats, setCoats] = useState(2);
  const [paintPrice, setPaintPrice] = useState(250);
  
  // Advanced coverage rate
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customCoverage, setCustomCoverage] = useState(null);

  // Standard coverage rates (sq ft per liter for 2 coats)
  const COVERAGE_PRESETS = {
    interior: {
      fresh: 90,
      repaint: 120
    },
    exterior: {
      fresh: 50,
      repaint: 60
    }
  };

  const getStandardCoverage = () => {
    return COVERAGE_PRESETS[projectType]?.[surfaceCondition] || 100;
  };

  const coverageRate = customCoverage !== null ? customCoverage : getStandardCoverage();

  // Reset custom coverage when project parameters change so they get the new default
  const handleProjectTypeChange = (val) => {
    setProjectType(val);
    setCustomCoverage(null);
  };

  const handleSurfaceConditionChange = (val) => {
    setSurfaceCondition(val);
    setCustomCoverage(null);
  };

  // Preset Area buttons
  const PRESET_AREAS = [
    { label: '1 Wall/Room', sqft: 350 },
    { label: '1 BHK', sqft: 900 },
    { label: '2 BHK', sqft: 1800 },
    { label: '3 BHK', sqft: 2700 },
    { label: '4 BHK', sqft: 3600 }
  ];

  // Calculations
  const paintLiters = (area / coverageRate) * (coats / 2);
  const totalPaintCost = paintLiters * paintPrice;

  // Putty: Only for fresh painting, covers ~15 sq ft per kg for 2 coats
  const puttyKg = surfaceCondition === 'fresh' ? area / 15 : 0;

  // Primer: 1 coat. Covers ~100 sq ft/L on fresh wall, ~120 sq ft/L on repaint
  const primerLiters = area / (surfaceCondition === 'fresh' ? 100 : 120);

  // Labor Cost per sq ft
  const laborRateMin = surfaceCondition === 'fresh' ? 15 : 8;
  const laborRateMax = surfaceCondition === 'fresh' ? 25 : 15;
  const laborCostMin = area * laborRateMin;
  const laborCostMax = area * laborRateMax;

  return (
    <div style={{
      margin: '4rem auto',
      padding: '3rem 2rem',
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: '20px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
      maxWidth: '950px'
    }} className="glass animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calcJsonLd) }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 10px var(--primary-glow);
          transition: transform 0.1s ease;
        }
        .slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .calc-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1 1 200px;
        }
        .calc-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }
        .calc-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--glass-border-hover);
        }
        .calc-icon-box {
          font-size: 2.2rem;
          margin-bottom: 0.75rem;
          display: inline-block;
        }
        .toggle-btn {
          flex: 1;
          padding: 0.6rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .toggle-btn.active {
          background: var(--primary);
          border-color: var(--primary);
        }
        .toggle-btn:first-of-type {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }
        .toggle-btn:last-of-type {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .preset-btn {
          padding: 0.4rem 0.8rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 6px;
          color: white;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .preset-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: var(--glass-border-hover);
        }
        .preset-btn.active {
          background: rgba(245, 158, 11, 0.15);
          border-color: var(--accent);
          color: var(--accent);
        }
        .price-table {
          width: 100%;
          font-size: 0.82rem;
          border-collapse: collapse;
          margin-top: 0.5rem;
        }
        .price-table th, .price-table td {
          padding: 0.4rem;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
      `}} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '3rem' }}>🎨</span>
        <h2 style={{ fontSize: '2.25rem', marginTop: '1rem', marginBottom: '0.75rem' }}>
          Home Paint <span className="text-gradient">&amp; Material Estimator</span>
        </h2>
        <p style={{ opacity: 0.8, maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Estimate the total paint quantity, secondary materials, and labor costs for your home painting project. Use preset room layouts or enter custom dimensions.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Step 1: Inputs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)'
        }}>
          {/* Presets and Area Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Total Area to Paint:</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {PRESET_AREAS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className={`preset-btn ${area === preset.sqft ? 'active' : ''}`}
                    onClick={() => setArea(preset.sqft)}
                  >
                    {preset.label} ({preset.sqft} sq ft)
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="calc-input-group" style={{ flex: '2 1 300px' }}>
                <input
                  type="range"
                  min={50}
                  max={10000}
                  step={50}
                  value={area}
                  onChange={(e) => setArea(parseInt(e.target.value) || 50)}
                  className="slider-input"
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '5px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    outline: 'none',
                    WebkitAppearance: 'none',
                    marginTop: '0.8rem'
                  }}
                />
              </div>
              <div className="calc-input-group" style={{ flex: '1 1 150px' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0 0.75rem', height: '42px' }}>
                  <input
                    type="number"
                    min={10}
                    max={100000}
                    value={area}
                    onChange={(e) => setArea(Math.max(10, parseInt(e.target.value) || 10))}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', opacity: 0.6, fontWeight: '600' }}>SQ FT</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {/* Project Type */}
            <div className="calc-input-group">
              <label style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Project Type:</label>
              <div style={{ display: 'flex', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  className={`toggle-btn ${projectType === 'interior' ? 'active' : ''}`}
                  onClick={() => handleProjectTypeChange('interior')}
                >
                  Interior
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${projectType === 'exterior' ? 'active' : ''}`}
                  onClick={() => handleProjectTypeChange('exterior')}
                >
                  Exterior
                </button>
              </div>
            </div>

            {/* Surface Condition */}
            <div className="calc-input-group">
              <label style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Surface Condition:</label>
              <div style={{ display: 'flex', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  className={`toggle-btn ${surfaceCondition === 'repaint' ? 'active' : ''}`}
                  onClick={() => handleSurfaceConditionChange('repaint')}
                >
                  Repainting
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${surfaceCondition === 'fresh' ? 'active' : ''}`}
                  onClick={() => handleSurfaceConditionChange('fresh')}
                >
                  Fresh Wall
                </button>
              </div>
            </div>

            {/* Number of Coats */}
            <div className="calc-input-group">
              <label style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Number of Coats:</label>
              <div style={{ display: 'flex', marginTop: '0.25rem' }}>
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`toggle-btn ${coats === num ? 'active' : ''}`}
                    style={{
                      borderRadius: num === 1 ? '8px 0 0 8px' : num === 3 ? '0 8px 8px 0' : '0',
                    }}
                    onClick={() => setCoats(num)}
                  >
                    {num} {num === 1 ? 'Coat' : 'Coats'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '0.5rem' }}>
            {/* Paint Price per Liter */}
            <div className="calc-input-group" style={{ flex: '1 1 250px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Paint Price per Liter:</span>
                <span 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.1)',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    position: 'relative'
                  }} 
                  title="Check out typical paint prices for reference. You can click 'Search Online' to see current market rates."
                >
                  ?
                </span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0 0.75rem', height: '42px', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.1rem', opacity: 0.6, marginRight: '0.4rem', fontWeight: 'bold' }}>₹</span>
                <input
                  type="number"
                  min={50}
                  value={paintPrice}
                  onChange={(e) => setPaintPrice(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    outline: 'none'
                  }}
                />
              </div>
              <a
                href="https://www.google.com/search?q=paint+price+per+liter+india"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontWeight: '500',
                  marginTop: '0.2rem'
                }}
              >
                🔎 Search current paint prices online
              </a>
            </div>

            {/* Reference Table */}
            <div style={{
              flex: '1.5 1 300px',
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.25rem', color: 'var(--primary)' }}>
                Typical Indian Paint Costs Reference
              </span>
              <table className="price-table">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Brands / Quality</th>
                    <th>Est. Price/L</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Economy</strong></td>
                    <td>Tractor Emulsion, Bison, Distempers</td>
                    <td>₹120 – ₹180</td>
                  </tr>
                  <tr>
                    <td><strong>Premium</strong></td>
                    <td>Apcolite Premium, Jotun Premium</td>
                    <td>₹200 – ₹350</td>
                  </tr>
                  <tr>
                    <td><strong>Luxury</strong></td>
                    <td>Royale, Silk Glamor, Velvet Luxury</td>
                    <td>₹450 – ₹800</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Advanced Panel Trigger */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--foreground-muted)',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: 0
              }}
            >
              <span>{showAdvanced ? '▼' : '▶'} Advanced Settings (Coverage Calibration)</span>
            </button>

            {showAdvanced && (
              <div style={{
                marginTop: '1rem',
                padding: '1.25rem',
                background: 'rgba(0,0,0,0.15)',
                borderRadius: '8px',
                border: '1px dashed rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Coverage Rate (for 2 coats):</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem' }}>{coverageRate} sq ft / Liter</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={200}
                  value={coverageRate}
                  onChange={(e) => setCustomCoverage(parseInt(e.target.value) || 30)}
                  className="slider-input"
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    outline: 'none',
                    WebkitAppearance: 'none'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', opacity: 0.5, marginTop: '0.5rem' }}>
                  <span>30 sq ft (rough weathercoat)</span>
                  <span>Preset Default: {getStandardCoverage()} sq ft</span>
                  <span>200 sq ft (smooth touch-up)</span>
                </div>
                {customCoverage !== null && (
                  <button
                    type="button"
                    onClick={() => setCustomCoverage(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      marginTop: '0.75rem',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    Reset to Standard Default
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Outputs */}
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 'bold' }}>📐 Estimated Material Quantities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="calc-card" style={{ borderColor: 'rgba(245, 158, 11, 0.15)', background: 'rgba(245, 158, 11, 0.02)' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paint Needed</span>
              <div style={{ fontSize: '1.85rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--accent)' }}>{paintLiters.toFixed(1)} L</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>for {coats} {coats === 1 ? 'coat' : 'coats'}</span>
            </div>

            <div className="calc-card">
              <span style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Primer Required</span>
              <div style={{ fontSize: '1.85rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'white' }}>{primerLiters.toFixed(1)} L</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>for 1 base coat</span>
            </div>

            <div className="calc-card" style={{ opacity: puttyKg > 0 ? 1 : 0.4 }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Putty Required</span>
              <div style={{ fontSize: '1.85rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'white' }}>{puttyKg.toFixed(0)} kg</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                {puttyKg > 0 ? 'for 2 coats fresh prep' : 'not needed for repaint'}
              </span>
            </div>
          </div>
        </div>

        {/* Step 3: Cost Estimates */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Material Cost details */}
          <div style={{
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.01)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>📦 Estimated Material Bills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Paint Material (₹{paintPrice}/L):</span>
                <span style={{ fontWeight: 'bold' }}>₹{totalPaintCost.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Primer (Est. ₹140/L):</span>
                <span style={{ fontWeight: 'bold' }}>₹{(primerLiters * 140).toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: puttyKg > 0 ? 1 : 0.4 }}>
                <span>Putty (Est. ₹25/kg):</span>
                <span style={{ fontWeight: 'bold' }}>₹{(puttyKg * 25).toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>Total Material Cost:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--accent)' }}>
                  ₹{(totalPaintCost + (primerLiters * 140) + (puttyKg * 25)).toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Labor / Total Cost */}
          <div style={{
            padding: '2rem',
            background: 'rgba(59, 130, 246, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--primary)' }}>💼 Professional Labor Estimate</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1.5rem' }}>
                Based on standard painter rates in Bangalore for **{surfaceCondition === 'fresh' ? 'Fresh wall prep & paint' : 'Wall repainting'}**:
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Rate per Sq Ft:</span>
                <span style={{ fontWeight: 'bold' }}>₹{laborRateMin} – ₹{laborRateMax} / sq ft</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
                <span style={{ fontWeight: 'bold' }}>Estimated Labor Cost:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'white' }}>
                  ₹{laborCostMin.toFixed(0)} – ₹{laborCostMax.toFixed(0)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '8px', border: '1px dashed rgba(59, 130, 246, 0.2)', fontSize: '0.82rem', lineHeight: '1.4', color: 'var(--foreground-muted)' }}>
              💡 <strong>Pro Tip:</strong> Surface preparation (cleaning, sanding, puttying) is crucial. A professional painter saves paint wastage and ensures a smooth, bubble-free finish.
            </div>
          </div>
        </div>

        {/* Quick-Commerce & E-Commerce Tools Affiliate Widget */}
        <AffiliateToolsWidget category="painting" />

        {/* Call to action */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(232, 145, 58, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(232, 145, 58, 0.15)'
        }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Get Your Home Painted Hassle-Free</h3>
          <p style={{ opacity: 0.8, fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.25rem' }}>
            Book a verified professional painter in Bangalore today. Standard project pricing, professional supervision, and on-time completion.
          </p>
          <Link href="/find-a-professional?category=Painter" className="btn btn-primary" style={{ padding: '0.6rem 1.8rem', fontSize: '0.95rem' }}>
            Find a Professional Painter Near Me
          </Link>
        </div>

      </div>
    </div>
  );
}
