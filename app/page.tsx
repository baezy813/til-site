import { getAllPosts, computeStats } from '@/lib/getPosts';
import { TILBlog } from '@/components/TILBlog';

export const dynamic = 'force-static';

export default async function HomePage() {
  const posts = await getAllPosts();
  const stats = computeStats(posts);

  return <TILBlog posts={posts} stats={stats} />;
}
