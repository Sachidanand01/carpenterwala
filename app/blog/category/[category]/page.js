import { getAllBlogPosts, getBlogCategories } from '@/lib/blog-service';
import BlogListing from '../../BlogListing';

export const revalidate = 3600;

const slugify = (cat) => cat.toLowerCase().replace(/\s+/g, '-');

export async function generateStaticParams() {
  const categories = await getBlogCategories();
  return categories.map(cat => ({
    category: slugify(cat),
  }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const categories = await getBlogCategories();
  
  const activeCategory = categories.find(
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
  const [posts, categories] = await Promise.all([
    getAllBlogPosts(),
    getBlogCategories()
  ]);
  
  const activeCategory = categories.find(
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
      <BlogListing selectedCategorySlug={category} initialPosts={posts} />
    </>
  );
}
