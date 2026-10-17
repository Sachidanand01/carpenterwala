import { getBusinessReviews, getLiveReviewStats } from '@/lib/reviews';
import TestimonialClient from './TestimonialClient';

export const revalidate = 3600; // Revalidate every hour for fresh Google reviews

export const metadata = {
  title: 'Verified Customer Testimonials & Reviews | Carpenterwala Bangalore',
  description: 'Read genuine Google Business Profile reviews from homeowners across Bangalore for verified carpenters, painters, plumbers, and electricians.',
  alternates: {
    canonical: 'https://carpenterwala.com/testimonial',
  },
  openGraph: {
    title: 'Carpenterwala Customer Reviews & Testimonials',
    description: '100% verified Bangalore homeowner reviews for carpenters, painters, plumbers, and home repair professionals.',
    url: 'https://carpenterwala.com/testimonial',
    siteName: 'Carpenterwala',
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function TestimonialsPage() {
  // Pre-load default 4+ star reviews and live stats on server
  const [reviewsData, stats] = await Promise.all([
    getBusinessReviews({ filter: '4plus', page: 1, pageSize: 9 }),
    getLiveReviewStats()
  ]);

  // Generate Schema.org structured data for SEO rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://carpenterwala.com/#localbusiness',
    name: 'Carpenterwala',
    url: 'https://carpenterwala.com',
    telephone: '+91-809-555-1001',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Thanisandra Main Road',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560077',
      addressCountry: 'IN'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(stats.averageRating),
      reviewCount: String(stats.totalReviews),
      bestRating: '5',
      worstRating: '1'
    },
    review: reviewsData.reviews.slice(0, 5).map((rev) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: rev.author_display_name || rev.author_name
      },
      datePublished: rev.original_time ? rev.original_time.split('T')[0] : '2026-09-01',
      reviewBody: rev.review_text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(rev.rating),
        bestRating: '5',
        worstRating: '1'
      }
    }))
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem 1rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TestimonialClient
        initialReviews={reviewsData.reviews}
        initialPagination={{
          total: reviewsData.total,
          page: reviewsData.page,
          pageSize: reviewsData.pageSize,
          totalPages: reviewsData.totalPages
        }}
        initialStats={stats}
      />
    </div>
  );
}
