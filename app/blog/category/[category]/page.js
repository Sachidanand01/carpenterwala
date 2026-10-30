import { getAllBlogPosts, getBlogCategories } from '@/lib/blog-service';
import BlogListing from '../../BlogListing';

export const revalidate = 3600;

const slugify = (cat) => cat.toLowerCase().replace(/\s+/g, '-');

export async function generateStaticParams() {
  const categories = await getBlogCategories();
  const list = categories.map(cat => ({
    category: slugify(cat),
  }));
  if (categories.some(c => c.toLowerCase().includes('maintenance'))) {
    list.push({ category: 'home-maintenance' });
  }
  return list;
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const categories = await getBlogCategories();
  
  const normalizedCategorySlug = category.toLowerCase() === 'home-maintenance' ? 'maintenance' : category.toLowerCase();
  let activeCategory = categories.find(
    (cat) => slugify(cat) === normalizedCategorySlug || (normalizedCategorySlug === 'maintenance' && cat.toLowerCase().includes('maintenance'))
  ) || 'Category';

  if (activeCategory === 'Maintenance' || category.toLowerCase() === 'home-maintenance') {
    activeCategory = 'Home Maintenance';
  }

  const siteUrl = 'https://carpenterwala.com';
  const canonicalUrl = `${siteUrl}/blog/category/${category.toLowerCase()}`;

  return {
    title: `${activeCategory} Guides for Indian Homeowners | Carpenterwala`,
    description: `Browse comprehensive ${activeCategory.toLowerCase()} guides, repair tutorials, and preventative checklists for Indian homeowners from Carpenterwala.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const pageParam = parseInt(resolvedSearchParams?.page || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const posts = await getAllBlogPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
  
  const normalizedCategorySlug = category.toLowerCase() === 'home-maintenance' ? 'maintenance' : category.toLowerCase();
  let activeCategory = categories.find(
    (cat) => slugify(cat) === normalizedCategorySlug || (normalizedCategorySlug === 'maintenance' && cat.toLowerCase().includes('maintenance'))
  ) || 'Category';

  if (activeCategory === 'Maintenance' || category.toLowerCase() === 'home-maintenance') {
    activeCategory = 'Home Maintenance';
  }

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
        "description": `Browse expert home improvement, preventative maintenance, and ${activeCategory.toLowerCase()} guides for Indian homeowners.`,
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
      <BlogListing selectedCategorySlug={category} initialPosts={posts} initialPage={currentPage} />
    </>
  );
}
