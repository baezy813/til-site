import { parseMD } from './parseMD';
import type { Post, SiteStats } from './types';

const REPO_OWNER = process.env.TIL_REPO_OWNER || 'baezy813';
const REPO_NAME = process.env.TIL_REPO_NAME || 'TIL';
const REPO_BRANCH = process.env.TIL_REPO_BRANCH || 'main';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

interface GitTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

interface GitTreeResponse {
  sha: string;
  url: string;
  tree: GitTreeItem[];
  truncated: boolean;
}

interface BranchResponse {
  commit: {
    sha: string;
    commit: { committer: { date: string } };
  };
}

interface CommitListItem {
  commit: { committer: { date: string } };
}

const apiHeaders: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (GITHUB_TOKEN) {
  apiHeaders.Authorization = `Bearer ${GITHUB_TOKEN}`;
}

async function gh<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: apiHeaders });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `GitHub API ${res.status} ${res.statusText} for ${url}\n${body}`,
    );
  }
  return res.json() as Promise<T>;
}

/**
 * 1. branch의 최신 commit sha 조회
 * 2. recursive tree 호출로 모든 .md 파일 경로 수집
 * 3. raw.githubusercontent.com에서 각 파일 본문 fetch
 * 4. parseMD로 변환
 */
export async function getAllPosts(): Promise<Post[]> {
  const branch = await gh<BranchResponse>(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/branches/${REPO_BRANCH}`,
  );
  const treeSha = branch.commit.sha;

  const tree = await gh<GitTreeResponse>(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${treeSha}?recursive=1`,
  );

  if (tree.truncated) {
    console.warn(
      '[getAllPosts] Git tree response was truncated. Some files may be missing.',
    );
  }

  const mdFiles = tree.tree.filter(
    (item) =>
      item.type === 'blob' &&
      item.path.toLowerCase().endsWith('.md') &&
      !item.path.toLowerCase().endsWith('readme.md') &&
      !item.path.startsWith('.'),
  );

  const posts = await Promise.all(
    mdFiles.map(async (file) => {
      const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/${file.path
        .split('/')
        .map(encodeURIComponent)
        .join('/')}`;
      const rawRes = await fetch(rawUrl, {
        headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {},
      });
      if (!rawRes.ok) {
        throw new Error(
          `Failed to fetch ${file.path}: ${rawRes.status} ${rawRes.statusText}`,
        );
      }
      const raw = await rawRes.text();

      // 파일에 frontmatter date가 없고, 파일명에서도 추출 못 한 경우를 위한 보조 메타
      let parsed = parseMD({ path: file.path, raw });

      if (new Date(parsed.date).getTime() === 0) {
        // 마지막 커밋 날짜로 보강
        try {
          const commits = await gh<CommitListItem[]>(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${encodeURIComponent(
              file.path,
            )}&per_page=1&sha=${REPO_BRANCH}`,
          );
          if (commits[0]?.commit?.committer?.date) {
            parsed = { ...parsed, date: commits[0].commit.committer.date };
          }
        } catch (err) {
          console.warn(`[getAllPosts] commit date fallback failed: ${file.path}`, err);
        }
      }

      return parsed;
    }),
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function computeStats(posts: Post[]): SiteStats {
  const counts = new Map<string, number>();
  for (const p of posts) {
    counts.set(p.folder, (counts.get(p.folder) ?? 0) + 1);
  }
  const categories = Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const lastUpdated = posts.length > 0 ? posts[0].date : null;

  return {
    totalPosts: posts.length,
    categories,
    lastUpdated,
  };
}

export const REPO_INFO = {
  owner: REPO_OWNER,
  name: REPO_NAME,
  branch: REPO_BRANCH,
  url: `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
};
