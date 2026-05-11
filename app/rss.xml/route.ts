import { getAllPosts } from '@/lib/getPosts';
import { buildRss } from '@/lib/rss';

export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baezy813.github.io';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const posts = await getAllPosts();
  const xml = buildRss(posts, {
    siteUrl,
    basePath,
    title: 'TIL Journal',
    description: '매일 배운 것을 기록하는, 프론트엔드 개발자의 TIL.',
  });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
