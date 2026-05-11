import type { Post } from './types';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export interface RssOptions {
  siteUrl: string;
  title: string;
  description: string;
  basePath?: string;
}

export function buildRss(posts: Post[], opts: RssOptions): string {
  const { siteUrl, title, description, basePath = '' } = opts;
  const cleanBase = basePath.replace(/\/$/, '');

  const items = posts
    .slice(0, 50)
    .map((p) => {
      const link = `${siteUrl}${cleanBase}/posts/${p.slug}/`;
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${escapeXml(p.folder)}</category>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}${cleanBase}/</link>
    <description>${escapeXml(description)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}
