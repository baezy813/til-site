import Link from 'next/link';
import type { PostMeta } from '@/lib/types';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()) || d.getTime() === 0) return '날짜 미상';
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-brand-500/60">
      <div className="flex items-center justify-between gap-3 text-xs">
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

      <h2 className="mt-4 text-xl font-semibold leading-snug text-zinc-900 group-hover:text-brand-600 dark:text-zinc-50 dark:group-hover:text-brand-300">
        <Link href={`/posts/${post.slug}/`} className="absolute inset-0">
          <span className="sr-only">{post.title}</span>
        </Link>
        {post.title}
      </h2>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {post.excerpt}
      </p>

      <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-300">
        자세히 보기
        <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
      </div>
    </article>
  );
}
