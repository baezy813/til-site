import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, REPO_INFO } from '@/lib/getPosts';
import { ShareButtons } from '@/components/ShareButtons';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface PageProps {
  params: { slug: string };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()) || d.getTime() === 0) return '날짜 미상';
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: `${post.title} — TIL Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const posts = await getAllPosts();
  const idx = posts.findIndex((p) => p.slug === params.slug);
  if (idx === -1) notFound();

  const post = posts[idx];
  const prev = posts[idx + 1]; // posts는 최신순 정렬이라 idx+1이 더 오래된(이전) 글
  const next = posts[idx - 1];

  const editUrl = `${REPO_INFO.url}/blob/${REPO_INFO.branch}/${post.path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-300"
      >
        <span aria-hidden>←</span> 홈으로
      </Link>

      <header className="mt-6 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            #{post.folder}
          </span>
          <time
            dateTime={post.date}
            className="font-medium text-zinc-500 dark:text-zinc-400"
          >
            {formatDate(post.date)}
          </time>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-6 flex items-center justify-between">
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
          >
            GitHub에서 원본 보기 ↗
          </a>
          <ShareButtons title={post.title} />
        </div>
      </header>

      <div
        className="prose-til mt-10"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <nav className="mt-16 grid grid-cols-1 gap-3 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/posts/${prev.slug}/`}
            className="group rounded-xl border border-zinc-200 p-4 transition hover:border-brand-300 dark:border-zinc-800 dark:hover:border-brand-500/60"
          >
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              ← 이전 글
            </p>
            <p className="mt-1 font-medium text-zinc-900 group-hover:text-brand-600 dark:text-zinc-50 dark:group-hover:text-brand-300">
              {prev.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/posts/${next.slug}/`}
            className="group rounded-xl border border-zinc-200 p-4 text-right transition hover:border-brand-300 dark:border-zinc-800 dark:hover:border-brand-500/60"
          >
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              다음 글 →
            </p>
            <p className="mt-1 font-medium text-zinc-900 group-hover:text-brand-600 dark:text-zinc-50 dark:group-hover:text-brand-300">
              {next.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
