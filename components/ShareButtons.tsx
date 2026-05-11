'use client';

import { useState } from 'react';

export interface ShareButtonsProps {
  title: string;
  /** 절대 URL이 아니어도 OK — 빈 값이면 window.location.href를 사용 */
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const resolveUrl = () =>
    url && url.startsWith('http')
      ? url
      : typeof window !== 'undefined'
        ? window.location.href
        : '';

  const handleCopy = async () => {
    const target = resolveUrl();
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const tweetHref = () => {
    const target = resolveUrl();
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title,
    )}&url=${encodeURIComponent(target)}`;
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={tweetHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        X에 공유
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        {copied ? '복사됨!' : '링크 복사'}
      </button>
    </div>
  );
}
