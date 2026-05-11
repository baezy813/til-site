import { REPO_INFO } from '@/lib/getPosts';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200 bg-zinc-50 py-10 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-4 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:px-6">
        <p>© {new Date().getFullYear()} TIL Journal — built with Next.js</p>
        <nav className="flex items-center gap-4">
          <a
            href={REPO_INFO.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            TIL repo ↗
          </a>
          <a
            href={`https://github.com/${REPO_INFO.owner}/til-site`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            til-site repo ↗
          </a>
          <a
            href="/rss.xml"
            className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            RSS
          </a>
        </nav>
      </div>
    </footer>
  );
}
