import { getAllBlogPosts } from '@/lib/blog-service';
import BlogListing from './BlogListing';

export const revalidate = 3600;

export const metadata = {
  title: 'Home Improvement Blog | Expert Tips from Carpenterwala',
  description: 'Expert advice on carpentry, painting, plumbing, and electrical work in Bangalore. Browse step-by-step tutorials and maintenance guides.',
  alternates: {
    canonical: 'https://carpenterwala.com/blog',
  },
  openGraph: {
    title: 'Home Improvement Blog | Expert Tips from Carpenterwala',
    description: 'Expert advice on carpentry, painting, plumbing, and electrical work in Bangalore.',
    url: 'https://carpenterwala.com/blog',
    siteName: 'Carpenterwala',
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function BlogLanding({ searchParams }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const pageParam = parseInt(resolvedSearchParams?.page || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const posts = await getAllBlogPosts();
  const siteUrl = 'https://carpenterwala.com';
  const blogUrl = `${siteUrl}/blog`;

  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const pagedPosts = sortedPosts.slice(0, 8);

  const blogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${blogUrl}#blog`,
        "url": blogUrl,
        "name": "Carpenterwala Home Improvement & Handyman Blog",
        "description": "Expert home maintenance, carpentry, painting, plumbing, and electrical repair guides in Bangalore.",
        "publisher": {
          "@type": "Organization",
          "name": "Carpenterwala",
          "url": siteUrl
        }
      },
      {
        "@type": "ItemList",
        "@id": `${blogUrl}#articlelist`,
        "name": "Recent Home Improvement Guides",
        "itemListElement": pagedPosts.map((post, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "url": `${siteUrl}/blog/${post.slug}`,
          "name": post.title
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BlogListing selectedCategorySlug="all" initialPosts={posts} initialPage={currentPage} />
    </>
  );
}

