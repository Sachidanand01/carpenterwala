import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';

const LOCATIONS = {
  'koramangala': { name: 'Koramangala', postalCode: '560034', hubName: 'South Bangalore' },
  'indiranagar': { name: 'Indiranagar', postalCode: '560038', hubName: 'East Bangalore' },
  'whitefield': { name: 'Whitefield', postalCode: '560066', hubName: 'IT Corridor East' },
  'hsr-layout': { name: 'HSR Layout', postalCode: '560102', hubName: 'Southeast Tech Hub' },
  'thanisandra': { name: 'Thanisandra', postalCode: '560077', hubName: 'North Bangalore' }
};

const SERVICES = {
  'carpentry': {
    title: 'Professional Carpenters in',
    type: 'Carpentry',
    description: 'Find top-rated, background-verified carpenters near you for furniture repair, modular kitchen setup, door lock fitting, and custom woodwork.',
    keywords: ['carpenter near me', 'custom carpentry', 'furniture repair']
  },
  'painting': {
    title: 'Expert Home Painters in',
    type: 'Painting',
    description: 'Book verified interior and exterior painters with transparent pricing, wall putty prep, and clean post-painting finish.',
    keywords: ['painters near me', 'house painting', 'wall painting cost']
  },
  'plumbing': {
    title: 'Certified Plumbers in',
    type: 'Plumbing',
    description: 'Fast local plumbers for tap leak repairs, pipe fitting, water tank cleaning, and bathroom sanitary installations.',
    keywords: ['plumber near me', 'leak repair', 'emergency plumber']
  },
  'electrical': {
    title: 'Certified Electricians in',
    type: 'Electrical',
    description: 'Experienced electricians for house rewiring, MCB trip fixes, switchboard installation, and appliance setup.',
    keywords: ['electrician near me', 'electrical repair', 'wiring electrician']
  }
};

export async function generateStaticParams() {
  const paramsList = [];
  Object.keys(SERVICES).forEach((service) => {
    Object.keys(LOCATIONS).forEach((location) => {
      paramsList.push({ service, location });
    });
  });
  return paramsList;
}

export async function generateMetadata({ params }) {
  const { service, location } = await params;
  const loc = LOCATIONS[location];
  const srv = SERVICES[service];

  if (!loc || !srv) {
    return { title: 'Service Not Found | Carpenterwala' };
  }

  return {
    title: `${srv.title} ${loc.name}, Bangalore | Carpenterwala`,
    description: `${srv.description} Serving ${loc.name} (${loc.postalCode}), Bangalore with verified technicians and guaranteed upfront rates.`,
    keywords: srv.keywords.map(k => `${k} ${loc.name}`),
    alternates: {
      canonical: `https://carpenterwala.com/services/${service}/${location}`,
    },
  };
}

export default async function ServiceLocationPage({ params }) {
  const { service, location } = await params;
  const loc = LOCATIONS[location];
  const srv = SERVICES[service];

  if (!loc || !srv) {
    notFound();
  }

  const localJsonLd = {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "name": `Carpenterwala ${srv.type} Services - ${loc.name}`,
    "url": `https://carpenterwala.com/services/${service}/${location}`,
    "telephone": "+91-80-4912-3456",
    "priceRange": "₹₹",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": `${loc.name}, Bangalore`
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": loc.name,
      "addressRegion": "Bangalore, Karnataka",
      "postalCode": loc.postalCode,
      "addressCountry": "IN"
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 2rem 4rem 2rem' }}>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
        { name: srv.type, url: `/services/${service}` },
        { name: loc.name, url: `/services/${service}/${location}` }
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localJsonLd) }}
      />

      <div style={{ textAlign: 'center', margin: '2rem 0 4rem 0' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {srv.title} <span style={{ color: 'var(--accent)' }}>{loc.name}</span>
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
          {srv.description} Available daily from 8:00 AM to 8:00 PM across {loc.name} (Pincode: {loc.postalCode}).
        </p>
      </div>

      {/* Localized Feature Card */}
      <div className="glass" style={{ padding: '3rem', borderRadius: '20px', marginBottom: '4rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>
          Why {loc.name} Residents Trust <span className="text-gradient">Carpenterwala</span>
        </h2>
        <div className="footer-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>📍</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Fast Local Dispatch</h3>
            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Assigned technicians arrive within 60 to 90 minutes anywhere in {loc.name}.</p>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Vetted & Background Checked</h3>
            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Police-verified service professionals operating with safety protocols.</p>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>💰</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Transparent Rate Cards</h3>
            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Standardized labor pricing without sudden post-service surcharges.</p>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <Link href="/find-a-professional" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Book {srv.type} Expert in {loc.name} Now
          </Link>
        </div>
      </div>
    </div>
  );
}
