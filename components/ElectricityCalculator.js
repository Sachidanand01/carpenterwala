'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AffiliateToolsWidget from '@/components/AffiliateToolsWidget';

export default function ElectricityCalculator() {
  const calcJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Home Electricity Wastage & Bill Calculator",
    "url": "https://carpenterwala.com/services/electrical#calculator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Calculate monthly kWh power consumption, electrical wastage, and electricity bill impacts for appliances in Indian homes."
  };

  const [appliance, setAppliance] = useState('fan');
  const [customWattage, setCustomWattage] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [hours, setHours] = useState(8);
  const [unitPrice, setUnitPrice] = useState(8); // customizable, defaults to ₹8

  // Wattage wasted presets (difference between old/inefficient vs star-rated/bldc)
  const PRESETS = {
    fan: { name: 'Ceiling Fan (Old 75W vs BLDC 28W)', watts: 47 },
    ac: { name: 'Air Conditioner (Old 1.5 Ton 1800W vs Inverter 1200W)', watts: 600 },
    fridge: { name: 'Refrigerator (Old 250W vs 5-Star 100W)', watts: 150 },
    geyser: { name: 'Water Geyser (Left on / Faulty Thermostat)', watts: 1000 },
    standby: { name: 'Vampire Standby Draw (TV, Chargers, Microwave)', watts: 50 },
    custom: { name: 'Custom Appliance / Leaks', watts: 0 }
  };

  // Get active wattage wasted
  const getActiveWattage = () => {
    if (appliance === 'custom') {
      return customWattage;
    }
    return PRESETS[appliance]?.watts || 0;
  };

  const wattsWasted = getActiveWattage();

  // Calculations
  // Daily Units (kWh) = (Watts * Qty * Hours) / 1000
  const dailyUnits = (wattsWasted * quantity * hours) / 1000;
  const monthlyUnits = dailyUnits * 30;
  const yearlyUnits = dailyUnits * 365;

  // Cost calculations
  const costPerMonth = monthlyUnits * unitPrice;
  const costPerYear = yearlyUnits * unitPrice;

  // Equivalents
  const ledHours = (dailyUnits * 1000) / 9; // Runs 9W LED bulb
  const fanDays = (yearlyUnits * 1000) / (50 * 24); // Runs 50W Fan (days)

  const getApplianceLabel = () => {
    if (appliance === 'custom') return 'Custom Appliance';
    return PRESETS[appliance]?.name.split('(')[0].trim();
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
        <span style={{ fontSize: '3rem' }}>⚡</span>
        <h2 style={{ fontSize: '2.25rem', marginTop: '1rem', marginBottom: '0.75rem' }}>
          Electricity Consumption <span className="text-gradient">&amp; Wastage Calculator</span>
        </h2>
        <p style={{ opacity: 0.8, maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Identify phantom electrical draw and energy-hogging appliances. Enter your details below to see how much power and money you are losing by not switching off or upgrading.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Step 1: Inputs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)'
        }}>
          {/* Appliance Preset Selector */}
          <div className="calc-input-group" style={{ flex: '2 1 250px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '1rem' }}>Select Inefficient Appliance / Waste:</label>
            <select
              value={appliance}
              onChange={(e) => setAppliance(e.target.value)}
              style={{
                height: '42px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: 'white',
                padding: '0 0.5rem',
                fontSize: '0.95rem',
                marginTop: '0.25rem',
                outline: 'none',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <option value="fan" style={{ background: '#1e1910' }}>Ceiling Fan (Old 75W vs BLDC 28W) - saves 47W</option>
              <option value="ac" style={{ background: '#1e1910' }}>Air Conditioner (Old 1.5 Ton 1800W vs Inverter 1200W) - saves 600W</option>
              <option value="fridge" style={{ background: '#1e1910' }}>Refrigerator (Old 250W vs 5-Star 100W) - saves 150W</option>
              <option value="geyser" style={{ background: '#1e1910' }}>Water Geyser (Left on / Faulty Thermostat) - saves 1000W</option>
              <option value="standby" style={{ background: '#1e1910' }}>Vampire Standby Draw (TVs, chargers standby) - saves 50W</option>
              <option value="custom" style={{ background: '#1e1910' }}>Custom Appliance (Enter custom Watts wasted)</option>
            </select>
          </div>

          {/* Custom Wattage (Visible only if 'custom' is selected) */}
          {appliance === 'custom' && (
            <div className="calc-input-group" style={{ flex: '1 1 150px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '1rem' }}>Watts Wasted / Used:</label>
              <input
                type="number"
                min={1}
                value={customWattage}
                onChange={(e) => setCustomWattage(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  height: '42px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '0 0.75rem',
                  fontSize: '1rem',
                  marginTop: '0.25rem',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* Quantity */}
          <div className="calc-input-group" style={{ flex: '1 1 120px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '1rem' }}>Quantity:</label>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={20}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                style={{
                  flex: 1,
                  height: '36px',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '6px',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(20, quantity + 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Hours/Day Slider */}
          <div className="calc-input-group" style={{ flex: '2 1 200px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Hours Run Per Day:</span>
              <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{hours} Hours</span>
            </label>
            <input
              type="range"
              min={1}
              max={24}
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 1)}
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

          {/* Customizable Unit Price */}
          <div className="calc-input-group" style={{ flex: '1 1 180px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '1rem' }}>Unit Price (₹ per kWh):</label>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              style={{
                height: '42px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: 'white',
                padding: '0 0.75rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                marginTop: '0.25rem',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Type your local tariff rate.</span>
          </div>
        </div>

        {/* Step 2: Energy Wasted Outputs */}
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 'bold' }}>📐 Energy Wasted / Consumed (in kWh Units)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            <div className="calc-card">
              <span style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Daily Units</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'white' }}>{dailyUnits.toFixed(2)} kWh</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>units today</span>
            </div>
            <div className="calc-card">
              <span style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Units</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'white' }}>{monthlyUnits.toFixed(1)} kWh</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>units in 30 days</span>
            </div>
            <div className="calc-card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.02)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Yearly Units</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--error)' }}>{yearlyUnits.toFixed(0)} kWh</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>units in 365 days</span>
            </div>
          </div>
        </div>

        {/* Step 3: Household Equivalents & Financial Cost */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Energy Equivalents */}
          <div style={{
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.01)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>💡 Energy Equivalents</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="calc-icon-box" style={{ margin: 0 }}>💡</span>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{ledHours.toFixed(0)} Hours of LED Light</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Wasted daily (wastes enough power to run a standard 9W LED bulb)</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="calc-icon-box" style={{ margin: 0 }}>🌀</span>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{fanDays.toFixed(1)} Days of Ceiling Fan</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Wasted yearly (could run a standard 50W ceiling fan non-stop)</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="calc-icon-box" style={{ margin: 0 }}>🔌</span>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{wattsWasted * quantity} Watts Standby Load</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Total electrical leak current on this setting</div>
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
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--error)' }}>💸 Financial Loss (Rupees down the drain)</h3>
              <p style={{ fontSize: '0.88rem', opacity: 0.8, marginBottom: '1.5rem' }}>
                Based on your custom rate of **₹{unitPrice.toFixed(2)}** per Unit, here is what this inefficient setup or standby load is costing you:
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Monthly Bill Waste:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹{costPerMonth.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontWeight: 'bold' }}>Yearly Bill Waste:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--accent)' }}>₹{costPerYear.toFixed(0)}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(232, 145, 58, 0.08)', borderRadius: '8px', border: '1px dashed rgba(232,145,58,0.2)', fontSize: '0.85rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
              <strong>🔌 Energy Saver Tip:</strong> Replacing one old 75W ceiling fan with a BLDC fan saves ~₹100 to ₹150 every month on typical usage!
            </div>
          </div>

        </div>

        {/* Quick-Commerce & E-Commerce Tools Affiliate Widget */}
        <AffiliateToolsWidget category="electrical" />

        {/* Call to action */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(232, 145, 58, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(232, 145, 58, 0.15)'
        }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Audit and Upgrade Your Electrical System</h3>
          <p style={{ opacity: 0.8, fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.25rem' }}>
            Book a certified, professional electrician to replace old wiring, install smart timers, or upgrade to 5-star rated appliances.
          </p>
          <Link href="/find-a-professional?category=Electrician" className="btn btn-primary" style={{ padding: '0.6rem 1.8rem', fontSize: '0.95rem' }}>
            Book a Verified Electrician
          </Link>
        </div>

      </div>
    </div>
  );
}
