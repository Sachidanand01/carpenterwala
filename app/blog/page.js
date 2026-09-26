import { getAllBlogPosts } from '@/lib/blog-service';
import BlogListing from './BlogListing';

export const revalidate = 3600;

export default async function BlogLanding() {
  const posts = await getAllBlogPosts();
  return <BlogListing selectedCategorySlug="all" initialPosts={posts} />;
}

