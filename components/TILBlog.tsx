'use client';

import { Hero } from './Hero';
import { SearchBar } from './SearchBar';
import { FilterTabs } from './FilterTabs';
import { SortDropdown } from './SortDropdown';
import { PostCard } from './PostCard';
import { useTilFilterSort } from '@/hooks/useTilFilterSort';
import type { Post, SiteStats } from '@/lib/types';

export interface TILBlogProps {
  posts: Post[];
  stats: SiteStats;
}

/**
 * 홈 메인 컴포넌트.
 * - Hero / 통계
 * - 검색 / 필터 / 정렬 (커스텀 훅 useTilFilterSort)
 * - 포스트 그리드 (또는 연도별 그룹)
 */
export function TILBlog({ posts, stats }: TILBlogProps) {
  const {
    filteredPosts,
    groupedByYear,
    query,
    setQuery,
    category,
    setCategory,
    sort,
    setSort,
    categories,
  } = useTilFilterSort(posts);

  return (
    <div>
      <Hero stats={stats} />

      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-6">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterTabs
            categories={categories}
            active={category}
            onChange={setCategory}
          />
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {filteredPosts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
            조건에 맞는 포스트가 없습니다.
          </p>
        ) : sort === 'year' ? (
          <div className="space-y-12">
            {groupedByYear.map((g) => (
              <div key={g.year}>
                <h3 className="mb-4 flex items-baseline gap-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <span className="text-xl text-zinc-900 dark:text-zinc-50">
                    {g.year}
                  </span>
                  <span className="text-xs">{g.posts.length}개의 글</span>
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {g.posts.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredPosts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
