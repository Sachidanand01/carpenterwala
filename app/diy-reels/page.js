import React, { Suspense } from 'react';
import DiyReelsClient from './DiyReelsClient';
import { getDiyReels, getDiyCategories } from '@/lib/reels';

export const metadata = {
  title: "DIY Reels - Carpentry Hacks & Woodworking Shorts | Carpenterwala",
  description: "Watch bite-sized carpentry hacks, DIY furniture polish tips, quick door hinge fixes, and woodworking shorts in under 60 seconds.",
  alternates: {
    canonical: 'https://carpenterwala.com/diy-reels',
  },
  openGraph: {
    title: "DIY Reels - Carpentry Hacks & Woodworking Shorts | Carpenterwala",
    description: "Watch bite-sized carpentry hacks, DIY furniture polish tips, and quick home repair video shorts.",
    url: "https://carpenterwala.com/diy-reels",
    siteName: "Carpenterwala",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Carpenterwala DIY Reels",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIY Reels - Carpentry Hacks & Woodworking Shorts | Carpenterwala",
    description: "Bite-sized carpentry tips and home improvement video shorts.",
    images: ["/images/og-image.png"],
  },
};

export default async function DiyReelsPage() {
  const [initialReels, initialCategories] = await Promise.all([
    getDiyReels({ limit: 50 }),
    getDiyCategories()
  ]);

  // JSON-LD Structured Data for Video SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Carpenterwala DIY Reels & Shorts",
    "description": "Step-by-step woodworking and carpentry video shorts.",
    "itemListElement": initialReels.slice(0, 10).map((reel, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": reel.title,
        "description": reel.description || "Quick DIY carpentry tips by Carpenterwala",
        "thumbnailUrl": [reel.thumbnail_url || `https://img.youtube.com/vi/${reel.youtube_id}/maxresdefault.jpg`],
        "uploadDate": reel.published_at || reel.created_at || new Date().toISOString(),
        "embedUrl": `https://www.youtube-nocookie.com/embed/${reel.youtube_id}`,
        "contentUrl": `https://www.youtube.com/shorts/${reel.youtube_id}`
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading DIY Reels...</div>
        </div>
      }>
        <DiyReelsClient
          initialReels={initialReels}
          initialCategories={initialCategories}
        />
      </Suspense>
    </>
  );
}
