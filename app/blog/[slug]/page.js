import Link from 'next/link';

const BLOG_POSTS = [
  {
    slug: '5-essential-carpentry-tips',
    title: '5 Essential Carpentry Tips for Every Homeowner',
    excerpt: 'Maintenance is key to making your furniture last. Learn these simple yet effective carpentry tips to keep your home in top shape.',
    category: 'Carpentry',
    date: 'May 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop',
    content: `
      <p>Your furniture and wooden fixtures are an investment. Proper maintenance not only keeps them looking beautiful but also extends their lifespan significantly. Whether you're a DIY enthusiast or just want to keep your home in good shape, these five essential carpentry tips are a must-know.</p>
      
      <h2>1. Regularly Check for Loose Joints</h2>
      <p>Wooden furniture often expands and contracts with changes in humidity. Over time, this can lead to loose joints. Check your chairs, tables, and cabinets once every few months. If you find a loose joint, a small amount of wood glue and a clamp can often fix the issue before it becomes a major problem.</p>
      
      <h2>2. Protect Wood from Direct Sunlight</h2>
      <p>UV rays can cause wood to fade and finish to crack. Try to position your valuable wooden pieces away from direct sunlight, or use curtains and UV-blocking window films to protect your interior woodwork.</p>
      
      <h2>3. Know Your Wood Types</h2>
      <p>Different woods require different care. Hardwoods like teak and oak are durable but need occasional oiling. Softwoods like pine are more prone to scratches. Understanding what your furniture is made of helps you choose the right cleaning products and maintenance routines.</p>
      
      <h2>4. Address Scratches Immediately</h2>
      <p>Minor scratches can often be fixed with a furniture touch-up pen or even a walnut. Addressing these small marks immediately prevents moisture from getting into the wood, which can cause swelling or deeper damage.</p>
      
      <h2>5. Use the Right Cleaning Tools</h2>
      <p>Avoid harsh chemicals on wooden surfaces. A soft, microfiber cloth dampened with water and a tiny bit of mild soap is usually all you need. Always wipe in the direction of the wood grain to avoid micro-scratches.</p>
    `
  },
  {
    slug: 'choosing-the-right-paint',
    title: 'How to Choose the Perfect Paint for Your Living Room',
    excerpt: 'Colors can change the mood of your home. Discover how to pick the right finish and shade for your space with our expert guide.',
    category: 'Painting',
    date: 'May 8, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=2031&auto=format&fit=crop',
    content: `
      <p>Choosing a paint color is one of the most important decisions you'll make when renovating your living room. The right color can make a room feel spacious, cozy, or energetic. Here's our expert guide to getting it right the first time.</p>
      
      <h2>Start with the Lighting</h2>
      <p>Before picking a shade, observe the natural light in your room. North-facing rooms tend to have cooler light, so warmer tones work best. South-facing rooms have abundant sunlight, which can make colors look more intense.</p>
      
      <h2>Understand Paint Finishes</h2>
      <p>The finish (or sheen) is as important as the color. Flat or matte finishes hide imperfections but are harder to clean. Satin or eggshell finishes are great for living rooms as they offer a subtle glow and are more durable.</p>
      
      <h2>Test Your Samples</h2>
      <p>Never pick a color from a small swatch in the store. Buy small sample pots and paint large squares on different walls in your living room. Watch how the color changes throughout the day as the light moves.</p>
    `
  },
  {
    slug: 'preventing-common-plumbing-issues',
    title: 'Preventing Common Plumbing Issues: A Homeowner’s Guide',
    excerpt: 'Leaks and clogs can be a nightmare. Learn how to identify early signs of plumbing problems and how to prevent them.',
    category: 'Plumbing',
    date: 'May 5, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1504148455328-497c5efdf13d?q=80&w=2070&auto=format&fit=crop',
    content: `
      <p>Plumbing issues often start small and escalate into expensive disasters. Being proactive can save you thousands in repair costs and prevent water damage to your home.</p>
      
      <h2>Watch What Goes Down the Drain</h2>
      <p>The most common cause of clogs is improper disposal of waste. In the kitchen, avoid pouring grease or coffee grounds down the sink. In the bathroom, use hair catchers in the shower and only flush toilet paper.</p>
      
      <h2>Check for Hidden Leaks</h2>
      <p>Once a month, check under your sinks for any signs of dampness or water stains. Even a tiny drip can lead to mold and structural damage if left unaddressed.</p>
    `
  },
  {
    slug: 'smart-home-electrical-upgrades',
    title: 'Top 5 Smart Home Electrical Upgrades for 2026',
    excerpt: 'Make your home more efficient and secure with these must-have electrical upgrades, from smart switches to video doorbells.',
    category: 'Electrical',
    date: 'May 2, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070&auto=format&fit=crop',
    content: `
      <p>Smart home technology has evolved significantly. In 2026, electrical upgrades are no longer just about convenience; they're about security, energy efficiency, and total control over your home environment.</p>
      
      <h2>1. Smart MCBs and Energy Monitors</h2>
      <p>Modern electrical panels can now include smart MCBs that monitor energy consumption in real-time and alert you to unusual power draws or potential hazards.</p>
      
      <h2>2. Integrated Smart Lighting</h2>
      <p>Replace standard switches with smart dimmers and controllers. You can set scenes, automate lighting based on occupancy, and control everything from your phone or voice assistant.</p>
    `
  }
];

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPost({ params }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <h1>Post Not Found</h1>
        <Link href="/blog" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Blog Hero */}
      <section style={{ height: '50vh', position: 'relative', overflow: 'hidden' }}>
        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.9))' 
        }}></div>
        <div className="container" style={{ position: 'absolute', bottom: '4rem', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
          <div style={{ 
            backgroundColor: 'var(--primary)', 
            display: 'inline-block', 
            padding: '0.3rem 1rem', 
            borderRadius: '20px', 
            fontSize: '0.9rem', 
            fontWeight: 'bold',
            marginBottom: '1.5rem'
          }}>
            {post.category}
          </div>
          <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', maxWidth: '900px' }}>{post.title}</h1>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', opacity: 0.8 }}>
            <span>By <strong>Carpenterwala Experts</strong></span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container" style={{ padding: '6rem 0', display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        <article style={{ flex: '2 1 600px', fontSize: '1.15rem', lineHeight: '1.8' }}>
          <div dangerouslySetInnerHTML={{ __html: post.content }} className="blog-content" />
          
          <div style={{ 
            marginTop: '4rem', 
            padding: '2rem', 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            borderRadius: '12px',
            border: '1px solid var(--glass-border)'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Need professional help?</h3>
            <p style={{ marginBottom: '1.5rem' }}>If you're facing a home improvement challenge that requires an expert touch, we've got you covered.</p>
            <Link href="/find-a-professional" className="btn btn-primary">Find a Verified Pro</Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{ flex: '1 1 300px' }}>
          <div className="glass" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Share this article</h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <div className="social-icon">FB</div>
              <div className="social-icon">TW</div>
              <div className="social-icon">LN</div>
              <div className="social-icon">WA</div>
            </div>

            <h3 style={{ marginBottom: '1.5rem' }}>Related Categories</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['Carpentry', 'Painting', 'Plumbing', 'Electrical', 'Maintenance'].map(cat => (
                <Link 
                  key={cat} 
                  href={`/services/${cat.toLowerCase()}`}
                  style={{ 
                    padding: '0.4rem 1rem', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '20px', 
                    fontSize: '0.9rem' 
                  }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Back to Blog */}
      <div className="container" style={{ paddingBottom: '6rem' }}>
        <Link href="/blog" style={{ opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>←</span> Back to Blog Listing
        </Link>
      </div>

      <style jsx global>{`
        .blog-content h2 {
          font-size: 2rem;
          margin: 3rem 0 1.5rem;
          color: var(--primary);
        }
        .blog-content p {
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }
        .blog-content ul {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  );
}
