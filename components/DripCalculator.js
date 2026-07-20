'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AffiliateToolsWidget from '@/components/AffiliateToolsWidget';

export default function DripCalculator() {
  const calcJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Water Wastage & Tap Drip Cost Calculator",
    "url": "https://carpenterwala.com/services/plumbing#calculator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Calculate daily and monthly water loss (in litres and Rupees) caused by leaking taps, flush tanks, and pipes in Indian households."
  };

  const [taps, setTaps] = useState(1);
  const [dripRate, setDripRate] = useState(30); // drips per minute
  const [waterSource, setWaterSource] = useState('tanker'); // 'municipal', 'tanker', 'can'

  // Pricing constants (cost per Liter)
  const PRICING = {
    municipal: 15 / 1000,   // ₹15 per 1,000 Liters (₹0.015/L)
    tanker: 900 / 5000,     // ₹900 per 5,000 Liters tanker (₹0.18/L)
    can: 80 / 20,           // ₹80 per 20 Liters bubble can (₹4.00/L)
  };

  const getSourceLabel = () => {
    if (waterSource === 'municipal') return 'Municipal Water (BWSSB/MC)';
    if (waterSource === 'tanker') return 'Private Water Tanker';
    return '20L Drinking Water Can';
  };

  // Calculations: 0.25 ml per drip, 1440 minutes in a day.
  // Formula: Drips/min * 0.25 ml * 1440 min / 1000 ml = Drips/min * 0.36 Liters/day.
  const litersPerDay = taps * dripRate * 0.36;
  const litersPerWeek = litersPerDay * 7;
  const litersPerMonth = litersPerDay * 30;
  const litersPerYear = litersPerDay * 365;

  // Household Equivalents
  const bucketsPerDay = litersPerDay / 15; // 15L standard Indian bucket
  const cansPerMonth = litersPerMonth / 20; // 20L standard bubble can
  const tanksPerYear = litersPerYear / 1000; // 1000L standard overhead Sintex tank

  // Financial Cost
  const costPerMonth = litersPerMonth * PRICING[waterSource];
  const costPerYear = litersPerYear * PRICING[waterSource];

  // Helper for descriptions based on drip speed
  const getDripSpeedLabel = () => {
    if (dripRate <= 10) return 'Slow drip (1 drop every few seconds)';
    if (dripRate <= 40) return 'Medium drip (steady dripping)';
    if (dripRate <= 100) return 'Fast drip (rapid water loss)';
    return 'Steady stream (extremely high waste)';
  };

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
      `}} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '3rem' }}>🚰</span>
        <h2 style={{ fontSize: '2.25rem', marginTop: '1rem', marginBottom: '0.75rem' }}>
          Indian Faucet Drip <span className="text-gradient">&amp; Water Waste Calculator</span>
        </h2>
        <p style={{ opacity: 0.8, maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Did you know a slow faucet leak can waste thousands of liters of water? Measure your tap drip rate below to see the impact on both water conservation and your wallet.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Step 1: Inputs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2.5rem',
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)'
        }}>
          {/* Taps count */}
          <div className="calc-input-group">
            <label style={{ fontWeight: 'bold', fontSize: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Leaking Faucets / Taps:</span>
              <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{taps} {taps === 1 ? 'Tap' : 'Taps'}</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setTaps(Math.max(1, taps - 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={10}
                value={taps}
                onChange={(e) => setTaps(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                style={{
                  flex: 1,
                  height: '40px',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              />
              <button
                type="button"
                onClick={() => setTaps(Math.min(10, taps + 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Enter number of leaking taps in the house (1 to 10).</span>
          </div>

          {/* Drip Rate */}
          <div className="calc-input-group" style={{ flex: '2 1 300px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Drip Rate:</span>
              <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{dripRate} drops / minute</span>
            </label>
            <input
              type="range"
              min={1}
              max={150}
              value={dripRate}
              onChange={(e) => setDripRate(parseInt(e.target.value) || 1)}
              className="slider-input"
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '5px',
                background: 'rgba(255, 255, 255, 0.1)',
                outline: 'none',
                WebkitAppearance: 'none',
                marginTop: '1rem',
                marginBottom: '0.5rem'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>
              <span>1 dpm</span>
              <span style={{ color: 'var(--accent)', fontWeight: '500' }}>{getDripSpeedLabel()}</span>
              <span>150 dpm</span>
            </div>
          </div>

          {/* Water Supply Cost */}
          <div className="calc-input-group">
            <label style={{ fontWeight: 'bold', fontSize: '1rem' }}>Water Source (For Cost):</label>
            <select
              value={waterSource}
              onChange={(e) => setWaterSource(e.target.value)}
              style={{
                height: '40px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: 'white',
                padding: '0 0.5rem',
                fontSize: '0.95rem',
                marginTop: '0.25rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="tanker" style={{ background: '#1e1910' }}>Private Tanker (₹900 / 5,000L)</option>
              <option value="municipal" style={{ background: '#1e1910' }}>Municipal / BWSSB (₹15 / 1,000L)</option>
              <option value="can" style={{ background: '#1e1910' }}>Mineral Water Can (₹80 / 20L)</option>
            </select>
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Calculates what water source you are wasting.</span>
          </div>
        </div>

        {/* Step 2: Liters Wasted Outputs */}
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 'bold' }}>📐 Estimated Water Wasted (in Liters)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            <div className="calc-card">
              <span style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Daily Loss</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'white' }}>{litersPerDay.toFixed(1)} L</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>wasted today</span>
            </div>
            <div className="calc-card">
              <span style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weekly Loss</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'white' }}>{litersPerWeek.toFixed(1)} L</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>in 7 days</span>
            </div>
            <div className="calc-card">
              <span style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Loss</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'white' }}>{litersPerMonth.toFixed(0)} L</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>in 30 days</span>
            </div>
            <div className="calc-card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.02)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Yearly Loss</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--error)' }}>{litersPerYear.toFixed(0)} L</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>in 365 days</span>
            </div>
          </div>
        </div>

        {/* Step 3: Indian Equivalents & Financial Cost */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Indian Equivalents */}
          <div style={{
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.01)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>🪣 Household Equivalents</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="calc-icon-box" style={{ margin: 0 }}>🪣</span>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{bucketsPerDay.toFixed(1)} Buckets / day</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Wasted daily (using standard Indian 15L water buckets)</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="calc-icon-box" style={{ margin: 0 }}>💧</span>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{cansPerMonth.toFixed(1)} Water Cans / month</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Wasted monthly (equivalent to standard 20L bubble water cans)</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="calc-icon-box" style={{ margin: 0 }}>🛢️</span>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{tanksPerYear.toFixed(2)} Overhead Tanks / year</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Wasted yearly (equivalent to 1,000-liter overhead Sintex tanks)</div>
                </div>
              </div>

            </div>
          </div>

          {/* Financial Waste */}
          <div style={{
            padding: '2rem',
            background: 'rgba(239, 68, 68, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--error)' }}>💸 Financial Drain (Rupees Wasted)</h3>
              <p style={{ fontSize: '0.88rem', opacity: 0.8, marginBottom: '1.5rem' }}>
                Wasting water directly wastes money. Here is what this leak is costing you based on <strong>{getSourceLabel()}</strong> prices:
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Monthly Cost:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹{costPerMonth.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontWeight: 'bold' }}>Yearly Cost Wasted:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--accent)' }}>₹{costPerYear.toFixed(0)}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(232, 145, 58, 0.08)', borderRadius: '8px', border: '1px dashed rgba(232,145,58,0.2)', fontSize: '0.85rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
              <strong>⚠️ Water Saver Tip:</strong> Fixing a single dripping tap can pay back its plumbing labor cost in just a few months!
            </div>
          </div>

        </div>

        {/* Quick-Commerce & E-Commerce Tools Affiliate Widget */}
        <AffiliateToolsWidget category="plumbing" />

        {/* Call to action */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(232, 145, 58, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(232, 145, 58, 0.15)'
        }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Stop Wasting Water and Money Today</h3>
          <p style={{ opacity: 0.8, fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.25rem' }}>
            A verified professional plumber can fix a leaking faucet tap in minutes. Connect with a plumber in Bangalore South/East/West instantly.
          </p>
          <Link href="/find-a-professional?category=Plumber" className="btn btn-primary" style={{ padding: '0.6rem 1.8rem', fontSize: '0.95rem' }}>
            Book a Professional Plumber
          </Link>
        </div>

      </div>
    </div>
  );
}
