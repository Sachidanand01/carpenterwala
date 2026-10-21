'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProTradeEstimator({ trade = 'Carpenter', proName = 'Professional' }) {
  // Painter State
  const [apartmentSize, setApartmentSize] = useState('2bhk');
  // Plumber State
  const [leakingTaps, setLeakingTaps] = useState(2);
  const [dripRate, setDripRate] = useState(30); // drops per min
  // Electrician State
  const [fanCount, setFanCount] = useState(3);
  const [acHours, setAcHours] = useState(8);
  // Carpenter State
  const [woodworkType, setWoodworkType] = useState('kitchen');

  const cleanTrade = trade || 'Carpenter';

  return (
    <section className="glass" style={{
      padding: '2rem',
      borderRadius: '16px',
      background: 'var(--card-bg, #F5EFE6)',
      border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle top indicator */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--primary, #ea580c), var(--accent, #f59e0b))'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>
              {cleanTrade === 'Painter' ? '🎨' : cleanTrade === 'Plumber' ? '🚰' : cleanTrade === 'Electrician' ? '⚡' : '🔨'}
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>
              Interactive {cleanTrade} Project Estimator
            </h2>
          </div>
          <p style={{ margin: '0.25rem 0 0 0', opacity: 0.75, fontSize: '0.85rem' }}>
            Estimate material quantities, timelines, and requirements before discussing with {proName}
          </p>
        </div>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          background: 'rgba(234, 88, 12, 0.1)',
          color: 'var(--primary, #ea580c)',
          padding: '0.25rem 0.6rem',
          borderRadius: '20px'
        }}>
          Free Planning Tool
        </span>
      </div>

      {/* ── 1. PAINTER ESTIMATOR ── */}
      {cleanTrade === 'Painter' && (() => {
        const specs = {
          '1bhk': { carpetArea: 600, wallArea: 2100, paintLitres: 18, primerLitres: 8, days: '2 - 3 Days' },
          '2bhk': { carpetArea: 1000, wallArea: 3500, paintLitres: 28, primerLitres: 12, days: '3 - 5 Days' },
          '3bhk': { carpetArea: 1500, wallArea: 5250, paintLitres: 42, primerLitres: 18, days: '5 - 7 Days' },
          'villa': { carpetArea: 2400, wallArea: 8400, paintLitres: 68, primerLitres: 28, days: '7 - 10 Days' }
        }[apartmentSize] || { carpetArea: 1000, wallArea: 3500, paintLitres: 28, primerLitres: 12, days: '3 - 5 Days' };

        return (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { id: '1bhk', label: '1 BHK (600 sq ft)' },
                { id: '2bhk', label: '2 BHK (1,000 sq ft)' },
                { id: '3bhk', label: '3 BHK (1,500 sq ft)' },
                { id: 'villa', label: 'Villa / 4 BHK (2,400+ sq ft)' }
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setApartmentSize(b.id)}
                  style={{
                    padding: '0.55rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: apartmentSize === b.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                    background: apartmentSize === b.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: apartmentSize === b.id ? 'white' : 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Calculations Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block' }}>Paintable Surface</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>~{specs.wallArea.toLocaleString()} sq ft</strong>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block' }}>Paint (2 Coats)</span>
                <strong style={{ fontSize: '1.1rem', color: '#16a34a' }}>~{specs.paintLitres} Litres</strong>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block' }}>Undercoat Primer</span>
                <strong style={{ fontSize: '1.1rem' }}>~{specs.primerLitres} Litres</strong>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block' }}>Work Timeline</span>
                <strong style={{ fontSize: '1.1rem' }}>{specs.days}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.75 }}>
                💡 Rates exclude putty and masking prep. Discuss wall condition with {proName}.
              </span>
              <Link
                href="/services/painting#calculator"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>Open Full Paint Calculator</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        );
      })()}

      {/* ── 2. PLUMBER ESTIMATOR ── */}
      {cleanTrade === 'Plumber' && (() => {
        // 1 drop = 0.05 ml, daily water loss = leakingTaps * dripRate * 60 * 24 * 0.05 / 1000 Litres
        const dailyLitres = Math.round((leakingTaps * dripRate * 60 * 24 * 0.05) / 1000);
        const monthlyLitres = dailyLitres * 30;
        const annualTankerCost = Math.round((monthlyLitres * 12 * 0.18)); // ~₹180 per 1,000L tanker

        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                  Number of Leaking Fixtures: <strong>{leakingTaps}</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={leakingTaps}
                  onChange={(e) => setLeakingTaps(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                  Leak Intensity: <strong>{dripRate <= 20 ? 'Slow Drip' : dripRate <= 40 ? 'Steady Leak' : 'Fast Trickle'}</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="10"
                  value={dripRate}
                  onChange={(e) => setDripRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>
            </div>

            {/* Calculations Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ padding: '0.85rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <span style={{ fontSize: '0.72rem', color: '#dc2626', display: 'block', fontWeight: 600 }}>Daily Water Lost</span>
                <strong style={{ fontSize: '1.15rem', color: '#dc2626' }}>{dailyLitres} Litres</strong>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block' }}>Monthly Loss</span>
                <strong style={{ fontSize: '1.15rem' }}>~{monthlyLitres.toLocaleString()} Litres</strong>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(34, 197, 94, 0.08)', borderRadius: '10px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'block', fontWeight: 600 }}>Annual Savings if Fixed</span>
                <strong style={{ fontSize: '1.15rem', color: '#16a34a' }}>~₹{annualTankerCost.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.75 }}>
                💡 Fixing leaking valves prevents wall seepage into neighboring apartments.
              </span>
              <Link
                href="/services/plumbing#calculator"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>Open Full Water Loss Calculator</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        );
      })()}

      {/* ── 3. ELECTRICIAN ESTIMATOR ── */}
      {cleanTrade === 'Electrician' && (() => {
        const oldFanUnitsMonth = Math.round((fanCount * 75 * 12 * 30) / 1000);
        const bldcFanUnitsMonth = Math.round((fanCount * 28 * 12 * 30) / 1000);
        const monthlyUnitsSaved = oldFanUnitsMonth - bldcFanUnitsMonth;
        const annualRupeeSavings = Math.round(monthlyUnitsSaved * 12 * 8.5); // ~₹8.5 per unit slab

        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                  Ceiling Fans Running Daily: <strong>{fanCount} Fans</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={fanCount}
                  onChange={(e) => setFanCount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                  AC Usage per Day: <strong>{acHours} Hours</strong>
                </label>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={acHours}
                  onChange={(e) => setAcHours(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>
            </div>

            {/* Calculations Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block' }}>Current Fan Consumption</span>
                <strong style={{ fontSize: '1.15rem' }}>{oldFanUnitsMonth} kWh / mo</strong>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(34, 197, 94, 0.08)', borderRadius: '10px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'block', fontWeight: 600 }}>With BLDC Fans</span>
                <strong style={{ fontSize: '1.15rem', color: '#16a34a' }}>{bldcFanUnitsMonth} kWh / mo</strong>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(234, 88, 12, 0.08)', borderRadius: '10px', border: '1px solid rgba(234, 88, 12, 0.2)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary)', display: 'block', fontWeight: 600 }}>Estimated Bill Savings</span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>~₹{annualRupeeSavings.toLocaleString()} / yr</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.75 }}>
                💡 Upgrading to 5-star & BLDC appliances cuts peak tariff slab costs.
              </span>
              <Link
                href="/services/electrical#calculator"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>Open Full Energy Calculator</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        );
      })()}

      {/* ── 4. CARPENTER ESTIMATOR ── */}
      {cleanTrade === 'Carpenter' && (() => {
        const woodworkData = {
          kitchen: {
            title: 'Modular Kitchen (L-Shape / Straight)',
            material: 'BWP Marine Grade Plywood (IS 710)',
            hardware: 'Hydraulic Soft-Close Hinges + Tandem Box',
            timeline: '7 - 12 Days',
            tip: 'Avoid standard particle board near kitchen sinks; high moisture causes premature core swelling.'
          },
          wardrobe: {
            title: 'Full-Height Sliding / Hinged Wardrobe',
            material: 'Commercial MR Plywood + 1mm Laminate',
            hardware: 'Heavy-Duty Sliding Top Track + Soft Buffer',
            timeline: '5 - 8 Days',
            tip: 'Internal drawers with key locks and anti-dust brush seals give wardrobe longevity.'
          },
          tv_unit: {
            title: 'Designer Wall-Mounted TV Console',
            material: 'HDHMR Board + Fluted Charcoal Louvers',
            hardware: 'Concealed Cable Routing & Gas-Spring Flaps',
            timeline: '3 - 5 Days',
            tip: 'Ensure sturdy anchor bolting for heavy 65+ inch screens and soundbar brackets.'
          },
          doors: {
            title: 'Main Door & Bedroom Lock Fitting',
            material: 'Solid Teak Wood / Flush Door Core',
            hardware: 'Multi-Bolt Mortise Lock + Brass Hinges',
            timeline: '1 - 2 Days',
            tip: 'Accurate rebate sizing prevents door jamming during monsoon humidity.'
          }
        }[woodworkType] || {
          title: 'Custom Modular Woodwork',
          material: 'BWP Marine Grade Plywood',
          hardware: 'Soft-Close Hardware',
          timeline: '4 - 7 Days',
          tip: 'Use termite-treated plywood for durable furniture.'
        };

        return (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { id: 'kitchen', label: '🍳 Modular Kitchen' },
                { id: 'wardrobe', label: '🚪 Sliding Wardrobe' },
                { id: 'tv_unit', label: '📺 TV Wall Unit' },
                { id: 'doors', label: '🔒 Door & Lock Fitting' }
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWoodworkType(w.id)}
                  style={{
                    padding: '0.55rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: woodworkType === w.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                    background: woodworkType === w.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: woodworkType === w.id ? 'white' : 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>

            {/* Calculations Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block' }}>Recommended Core</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{woodworkData.material}</strong>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block' }}>Hardware Standard</span>
                <strong style={{ fontSize: '0.9rem' }}>{woodworkData.hardware}</strong>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block' }}>Typical Timeline</span>
                <strong style={{ fontSize: '1.1rem', color: '#16a34a' }}>{woodworkData.timeline}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.75 }}>
                💡 {woodworkData.tip}
              </span>
              <Link
                href="/services/carpentry"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>Explore Carpentry Services</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
