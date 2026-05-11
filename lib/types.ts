/**
 * TIL 사이트 전반에서 사용하는 타입 정의.
 */

export interface PostMeta {
  slug: string;
  title: string;
  date: string; // ISO 8601 (YYYY-MM-DD or full ISO)
  folder: string;
  excerpt: string;
  path: string; // TIL repo 안에서의 원본 파일 경로
}

export interface Post extends PostMeta {
  contentHtml: string;
  contentText: string; // 검색용 plain text
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface SiteStats {
  totalPosts: number;
  categories: CategoryCount[];
  lastUpdated: string | null;
}
