import { createHash } from 'crypto';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import hljs from 'highlight.js';
import type { Post } from './types';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const md = new MarkdownIt({
  html: true, // MD 안의 HTML 태그 지원 (rehype-raw 대신)
  linkify: true,
  typographer: true,
  breaks: false,
  highlight(code: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">${
          hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch {
        /* noop */
      }
    }
    return `<pre class="hljs"><code>${escapeHtml(code)}</code></pre>`;
  },
}).use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.linkInsideHeader({
    symbol: '#',
    placement: 'before',
  }),
});

/**
 * 파일명에서 date / title 후보를 추출.
 * 예) "2025-03-12-react-server-component.md" → date=2025-03-12, title="react-server-component"
 *     "2025-03-12.md" → date=2025-03-12, title="2025-03-12"
 *     "react-server-component.md" → date=null, title="react-server-component"
 */
function extractFromFilename(filename: string): { date: string | null; title: string } {
  const base = filename.replace(/\.md$/i, '');
  const dateMatch = base.match(/^(\d{4}-\d{2}-\d{2})(?:[-_\s](.+))?$/);
  if (dateMatch) {
    return {
      date: dateMatch[1],
      title: (dateMatch[2] ?? dateMatch[1]).trim(),
    };
  }
  return { date: null, title: base };
}

/**
 * MD 본문에서 첫 H1을 제목 후보로 추출.
 */
function extractFirstHeading(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * HTML을 plain text로 (검색용).
 */
function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeExcerpt(text: string, maxLength = 180): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/**
 * 파일 경로를 SHA-256으로 해싱해 8자리 URL-safe slug를 생성.
 * 한글/공백/특수문자가 들어간 경로여도 항상 [0-9a-f]{8} 형태가 되어
 * Next.js `output: 'export'`의 디렉토리 이름·URL 인코딩 이슈를 회피.
 */
export function makeSlug(path: string): string {
  const cleanPath = path.replace(/\.md$/i, '');
  return createHash('sha256').update(cleanPath).digest('hex').slice(0, 8);
}

export interface ParseInput {
  /** TIL repo 안에서의 파일 경로 (예: "stack/react/hooks.md") */
  path: string;
  /** 파일 원본 내용 */
  raw: string;
}

/**
 * MD 텍스트 → Post 객체.
 */
export function parseMD({ path, raw }: ParseInput): Post {
  const segments = path.split('/');
  const filename = segments[segments.length - 1];
  const folder = segments.length > 1 ? segments[0] : 'misc';

  const { data: frontmatter, content } = matter(raw);

  const fnInfo = extractFromFilename(filename);
  const headingTitle = extractFirstHeading(content);

  const title: string =
    (typeof frontmatter.title === 'string' && frontmatter.title.trim()) ||
    headingTitle ||
    fnInfo.title;

  const dateValue = frontmatter.date ?? fnInfo.date ?? null;
  const date: string = dateValue
    ? new Date(dateValue).toISOString()
    : new Date(0).toISOString();

  const contentHtml = md.render(content);
  const contentText = htmlToText(contentHtml);

  const excerpt: string =
    (typeof frontmatter.excerpt === 'string' && frontmatter.excerpt.trim()) ||
    makeExcerpt(contentText);

  return {
    slug: makeSlug(path),
    title,
    date,
    folder,
    excerpt,
    path,
    contentHtml,
    contentText,
  };
}
