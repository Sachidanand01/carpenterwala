import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://carpenterwala.com${item.url === '/' ? '' : item.url}`
    }))
  };

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        listStyle: 'none', 
        padding: 0, 
        margin: 0, 
        alignItems: 'center', 
        gap: '0.5rem', 
        fontSize: '0.9rem', 
        fontWeight: '500' 
      }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {index > 0 && <span style={{ opacity: 0.4, color: 'var(--foreground)' }}>›</span>}
              {isLast ? (
                <span style={{ color: 'var(--accent)', fontWeight: '600' }} aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className="breadcrumb-link">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
