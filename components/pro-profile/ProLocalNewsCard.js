import React from 'react';

export default function ProLocalNewsCard({ trade, location }) {
  const cleanTrade = trade || 'Carpentry';
  const cleanLoc = location || 'Bangalore';

  // Trade-specific seasonal alerts and tips
  const tradeBulletins = {
    Painter: {
      alertTitle: 'Seasonal Wall Dampness & Interior Repainting',
      alertDesc: `High humidity cycles across ${cleanLoc} cause peeling paint and hairline plaster cracks. Premium acrylic emulsions with anti-fungal primers are seeing a 40% surge in local demand.`,
      materials: [
        { name: 'Low-VOC Washable Emulsion', status: 'High Demand', tag: 'Trending' },
        { name: 'Waterproof Acrylic Putty', status: 'Essential', tag: 'Recommended' },
        { name: 'Weather-Shield Exterior Coat', status: 'Active', tag: 'Monsoon Ready' }
      ],
      tip: `Customers in ${cleanLoc} are prioritizing odor-free, non-toxic paints for kids' rooms and bedrooms.`
    },
    Carpenter: {
      alertTitle: 'Monsoon Moisture & Woodwork Stability Advisory',
      alertDesc: `Fluctuating humidity in ${cleanLoc} causes wooden doors and drawer runners to swell. Local homeowners are requesting BWP (Boiling Water Proof) Marine Plywood and soft-close channel upgrades.`,
      materials: [
        { name: 'BWP Marine Plywood (IS 710)', status: 'Top Pick', tag: 'High Durability' },
        { name: 'HDHMR Board for Kitchens', status: 'Popular', tag: 'Moisture Safe' },
        { name: 'Telescopic Drawer Channels', status: 'Standard', tag: 'Smooth Glide' }
      ],
      tip: `Prioritize anti-termite coated core wood when building wardrobes and modular under-sink cabinets.`
    },
    Plumber: {
      alertTitle: 'Municipal Pressure Fluctuation & Leakage Alerts',
      alertDesc: `Seasonal water pressure variations in ${cleanLoc} apartments often stress angle valves and toilet cistern seals. Prompt valve servicing prevents silent seepage into neighboring flats.`,
      materials: [
        { name: 'Quarter-Turn Ceramic Cartridges', status: 'Recommended', tag: 'Leak-Free' },
        { name: 'CPVC & UPVC Pipe Fittings', status: 'Standard', tag: 'Lead-Free' },
        { name: 'Dual-Flush Cistern Kits', status: 'Eco-Friendly', tag: 'Saves 35% Water' }
      ],
      tip: `Checking sink P-traps and aerators every 6 months prevents mineral blockages and pipe erosion.`
    },
    Electrician: {
      alertTitle: 'Voltage Surges & Heavy Appliance Protection',
      alertDesc: `Monsoon thunderstorms and seasonal AC usage in ${cleanLoc} cause intermittent voltage drops. Local homeowners are upgrading distribution boxes with Type-2 surge protection devices.`,
      materials: [
        { name: 'Fire-Resistant (FR) Copper Wires', status: 'Safety Mandatory', tag: 'ISI Certified' },
        { name: 'MCB & RCCB Shock Protection', status: 'High Priority', tag: 'Life Safety' },
        { name: 'BLDC Energy-Saving Regulators', status: 'Trending', tag: 'Cuts 65% Power' }
      ],
      tip: `Earthing impedance checks protect costly smart TVs, inverters, and EV chargers from sudden grid spikes.`
    }
  };

  const bulletin = tradeBulletins[cleanTrade] || tradeBulletins.Carpenter;

  return (
    <div className="glass" style={{
      padding: '1.5rem',
      borderRadius: '16px',
      marginTop: '1.25rem',
      background: 'var(--card-bg, #F5EFE6)',
      border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>📍</span>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>
            Local Trade Pulse: {cleanLoc}
          </h3>
        </div>
        <span style={{
          fontSize: '0.68rem',
          fontWeight: 800,
          background: 'rgba(234, 88, 12, 0.12)',
          color: 'var(--primary, #ea580c)',
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          textTransform: 'uppercase'
        }}>
          Live Index
        </span>
      </div>

      {/* Seasonal Alert */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        borderLeft: '3px solid var(--accent, #f59e0b)',
        padding: '0.75rem 0.9rem',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
          ⚡ {bulletin.alertTitle}
        </div>
        <p style={{ fontSize: '0.78rem', opacity: 0.8, margin: 0, lineHeight: 1.5 }}>
          {bulletin.alertDesc}
        </p>
      </div>

      {/* Materials & Trends Index */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.6, marginBottom: '0.5rem' }}>
          📊 Local Material & Standards Index
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {bulletin.materials.map((m, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.4rem 0.6rem',
              background: 'rgba(0,0,0,0.02)',
              borderRadius: '6px',
              fontSize: '0.78rem'
            }}>
              <span style={{ fontWeight: 600 }}>{m.name}</span>
              <span style={{
                fontSize: '0.7rem',
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#16a34a',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                fontWeight: 600
              }}>
                {m.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Quality Tip */}
      <div style={{
        fontSize: '0.76rem',
        opacity: 0.75,
        lineHeight: 1.5,
        borderTop: '1px dashed var(--glass-border, rgba(0,0,0,0.1))',
        paddingTop: '0.75rem'
      }}>
        💡 <strong>Craft Quality Tip:</strong> {bulletin.tip}
      </div>
    </div>
  );
}
