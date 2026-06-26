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
  return <BlogListing selectedCategorySlug={category} />;
}
