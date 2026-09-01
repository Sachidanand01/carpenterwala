import { BLOG_POSTS } from '@/lib/blog-data';
import BlogListing from '../../BlogListing';

const slugify = (cat) => cat.toLowerCase().replace(/\s+/g, '-');

export async function generateStaticParams() {
  const categories = Array.from(new Set(BLOG_POSTS.map(post => post.category)));
  return categories.map(cat => ({
    category: slugify(cat),
  }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const categoriesFromPosts = Array.from(new Set(BLOG_POSTS.map(post => post.category)));
  
  const activeCategory = categoriesFromPosts.find(
    (cat) => slugify(cat) === category.toLowerCase()
  ) || 'Category';

  const siteUrl = 'https://carpenterwala.com';
  const canonicalUrl = `${siteUrl}/blog/category/${category.toLowerCase()}`;

  return {
    title: `${activeCategory} Blogs | Expert Handyman Tips | Carpenterwala`,
    description: `Browse professional handymen guides, tutorials, and articles on ${activeCategory.toLowerCase()} in Bangalore from Carpenterwala.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const categoriesFromPosts = Array.from(new Set(BLOG_POSTS.map(post => post.category)));
  
  const activeCategory = categoriesFromPosts.find(
    (cat) => slugify(cat) === category.toLowerCase()
  ) || 'Category';

  const siteUrl = 'https://carpenterwala.com';
  const categoryUrl = `${siteUrl}/blog/category/${category.toLowerCase()}`;

  const categorySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${categoryUrl}#collection`,
        "url": categoryUrl,
        "name": `${activeCategory} Articles & Guides`,
        "description": `Browse expert home improvement, maintenance, and ${activeCategory.toLowerCase()} guides for Bangalore homeowners.`,
        "publisher": {
          "@type": "Organization",
          "name": "Carpenterwala",
          "url": siteUrl
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${categoryUrl}#breadcrumbs`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${siteUrl}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": activeCategory,
            "item": categoryUrl
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <BlogListing selectedCategorySlug={category} />
    </>
  );
}
