'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export interface HeaderProps {
  /** 헤더에 검색바를 노출할지 여부 (홈에서는 hero 영역에 두는 게 자연스러우므로 false 권장) */
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
}

export function Header({ showSearch, searchValue, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-zinc-900 hover:opacity-80 dark:text-zinc-50"
        >
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-xs font-bold text-white"
          >
            T
          </span>
          <span>TIL Journal</span>
        </Link>

        <div className="flex items-center gap-3">
          {showSearch && onSearchChange && (
            <input
              type="search"
              placeholder="검색…"
              value={searchValue ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="hidden h-9 w-64 rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 md:block"
            />
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
