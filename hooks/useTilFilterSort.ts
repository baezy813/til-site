'use client';

import { useMemo, useState } from 'react';
import type { PostMeta } from '@/lib/types';

export type SortOption = 'newest' | 'oldest' | 'year';
export const ALL_CATEGORY = 'All';

export interface UseTilFilterSortResult<T extends PostMeta> {
  filteredPosts: T[];
  /** sort === 'year' 일 때 사용할 연도별 그룹 */
  groupedByYear: Array<{ year: string; posts: T[] }>;
  query: string;
  setQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  /** 카테고리 후보 (All 포함) */
  categories: string[];
}

/**
 * 클라이언트 사이드 검색/필터/정렬 훅.
 * 입력: 원본 posts 배열 (PostMeta 호환)
 * 출력: filteredPosts, query/setQuery, category/setCategory, sort/setSort, categories
 */
export function useTilFilterSort<T extends PostMeta & { contentText?: string }>(
  posts: T[],
): UseTilFilterSortResult<T> {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(ALL_CATEGORY);
  const [sort, setSort] = useState<SortOption>('newest');

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) set.add(p.folder);
    return [ALL_CATEGORY, ...Array.from(set).sort((a, b) => a.localeCompare(b, 'ko'))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = posts;

    if (category !== ALL_CATEGORY) {
      list = list.filter((p) => p.folder === category);
    }

    if (q.length > 0) {
      list = list.filter((p) => {
        const inTitle = p.title.toLowerCase().includes(q);
        const inExcerpt = p.excerpt.toLowerCase().includes(q);
        const inContent = (p.contentText ?? '').toLowerCase().includes(q);
        const inFolder = p.folder.toLowerCase().includes(q);
        return inTitle || inExcerpt || inContent || inFolder;
      });
    }

    const sorted = [...list].sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      if (sort === 'oldest') return ta - tb;
      return tb - ta; // newest, year 모두 내림차순 기준
    });

    return sorted;
  }, [posts, query, category, sort]);

  const groupedByYear = useMemo(() => {
    if (sort !== 'year') return [];
    const map = new Map<string, T[]>();
    for (const p of filteredPosts) {
      const year = new Date(p.date).getFullYear().toString();
      const arr = map.get(year) ?? [];
      arr.push(p);
      map.set(year, arr);
    }
    return Array.from(map.entries())
      .map(([year, posts]) => ({ year, posts }))
      .sort((a, b) => Number(b.year) - Number(a.year));
  }, [filteredPosts, sort]);

  return {
    filteredPosts,
    groupedByYear,
    query,
    setQuery,
    category,
    setCategory,
    sort,
    setSort,
    categories,
  };
}
