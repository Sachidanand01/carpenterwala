'use client';

const BLINKIT_CATALOG = {
  plumbing: [
    {
      name: "Teflon Thread Seal Tape (Pack of 3)",
      price: "₹89",
      delivery: "⚡ 10 mins via Blinkit",
      tag: "Must-have for Tap Leaks",
      blinkitUrl: "https://blinkit.com/s/?q=teflon+tape",
      image: "🛠️"
    },
    {
      name: "Adjustable Pipe Wrench 10-Inch",
      price: "₹349",
      delivery: "⚡ 10-15 mins via Blinkit",
      tag: "Heavy Duty Plumbing",
      blinkitUrl: "https://blinkit.com/s/?q=pipe+wrench",
      image: "🔧"
    },
    {
      name: "Rubber Gasket Washer Assortment Kit",
      price: "₹149",
      delivery: "⚡ 10 mins via Blinkit",
      tag: "Stops Flush Tank Drips",
      blinkitUrl: "https://blinkit.com/s/?q=tap+washer",
      image: "⚙️"
    }
  ],
  electrical: [
    {
      name: "Digital Multimeter & Voltage Tester",
      price: "₹299",
      delivery: "⚡ 10 mins via Blinkit",
      tag: "Voltage & Continuity Check",
      blinkitUrl: "https://blinkit.com/s/?q=multimeter",
      image: "⚡"
    },
    {
      name: "Smart Wi-Fi Plug 16A with Power Monitor",
      price: "₹799",
      delivery: "⚡ 10 mins via Blinkit",
      tag: "Stop Vampire Power Draw",
      blinkitUrl: "https://blinkit.com/s/?q=smart+plug",
      image: "🔌"
    },
    {
      name: "Heavy Duty Spike Guard Extension Board",
      price: "₹499",
      delivery: "⚡ 10 mins via Blinkit",
      tag: "Surge Protection",
      blinkitUrl: "https://blinkit.com/s/?q=extension+board",
      image: "🔋"
    }
  ],
  painting: [
    {
      name: "Wall Putty Scraping Knife & Sandpaper Set",
      price: "₹129",
      delivery: "⚡ 10 mins via Blinkit",
      tag: "Pre-Painting Wall Prep",
      blinkitUrl: "https://blinkit.com/s/?q=putty+knife",
      image: "🖌️"
    },
    {
      name: "Professional Paint Roller & Tray Set 9-Inch",
      price: "₹299",
      delivery: "⚡ 10 mins via Blinkit",
      tag: "Drip-Free Even Finish",
      blinkitUrl: "https://blinkit.com/s/?q=paint+roller",
      image: "🎨"
    },
    {
      name: "Painter's Masking Tape (Pack of 4)",
      price: "₹159",
      delivery: "⚡ 10 mins via Blinkit",
      tag: "Clean Edge Protection",
      blinkitUrl: "https://blinkit.com/s/?q=masking+tape",
      image: "📼"
    }
  ],
  carpentry: [
    {
      name: "Multi-Bit Screwdriver & Allen Key Toolset",
      price: "₹249",
      delivery: "⚡ 10 mins via Blinkit",
      tag: "Furniture Hinge Fixes",
      blinkitUrl: "https://blinkit.com/s/?q=screwdriver+set",
      image: "🪛"
    },
    {
      name: "Fevicol Synthetic Wood Adhesive Glue",
      price: "₹120",
      delivery: "⚡ 10 mins via Blinkit",
      tag: "Wood Joint Bonding",
      blinkitUrl: "https://blinkit.com/s/?q=fevicol+wood+glue",
      image: "🪚"
    }
  ]
};

export default function AffiliateToolsWidget({ category = 'plumbing' }) {
  const tools = BLINKIT_CATALOG[category] || BLINKIT_CATALOG.plumbing;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Recommended DIY Tools on Blinkit for ${category.toUpperCase()}`,
    "itemListElement": tools.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": tool.name,
        "description": tool.tag,
        "offers": {
          "@type": "Offer",
          "price": tool.price.replace(/[^0-9]/g, ''),
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": tool.blinkitUrl
        }
      }
    }))
  };

  return (
    <div style={{
      margin: '2.5rem 0',
      padding: '2rem',
      background: 'rgba(30, 41, 59, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px'
    }} className="glass">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ Need Tools Instantly in Bangalore?
          </span>
          <h3 style={{ fontSize: '1.4rem', marginTop: '0.25rem' }}>
            DIY Hardware Delivered in 10 Minutes via Blinkit
          </h3>
        </div>
        <span style={{ fontSize: '0.85rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '0.4rem 0.9rem', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 600 }}>
          🟡 Blinkit 10-Min Delivery
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {tools.map((tool, idx) => (
          <div key={idx} style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{tool.image}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                  {tool.tag}
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{tool.name}</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.75rem' }}>{tool.delivery}</p>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>
                {tool.price}
              </div>
            </div>

            <a
              href={tool.blinkitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                textAlign: 'center',
                padding: '0.7rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                display: 'block'
              }}
            >
              ⚡ Order on Blinkit (10 Mins)
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
