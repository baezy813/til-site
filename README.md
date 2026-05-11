# TIL Site

`baezy813/TIL` 저장소의 마크다운을 빌드 타임에 읽어 정적 사이트로 렌더링하는 Next.js 14 App Router 프로젝트입니다.
GitHub Actions로 빌드해 GitHub Pages에 배포합니다.

## 기술 스택

- Next.js 14 (App Router, `output: 'export'`)
- TypeScript / Tailwind CSS
- gray-matter (frontmatter) + markdown-it + highlight.js (코드 하이라이팅)
- GitHub Actions → GitHub Pages

## 로컬 개발

```bash
npm install
npm run dev
```

> 빌드 타임에 GitHub API로 TIL repo를 fetch합니다. 로컬에서 rate limit이 걱정되면 `.env.local`에 다음을 설정하세요.
>
> ```
> GITHUB_TOKEN=ghp_xxxxx
> TIL_REPO_OWNER=baezy813
> TIL_REPO_NAME=TIL
> TIL_REPO_BRANCH=main
> ```

## 정적 빌드

```bash
npm run build
# → ./out 폴더에 정적 사이트가 export됨
```

## 배포 경로 (base path) 설정

- **사용자 페이지** (`baezy813.github.io`) → `NEXT_PUBLIC_BASE_PATH` 빈 값 유지
- **프로젝트 페이지** (`baezy813.github.io/til-site`) → `NEXT_PUBLIC_BASE_PATH=/til-site`

`.github/workflows/deploy.yml`의 `env`에서 이미 `/til-site`로 설정되어 있습니다.
사용자 페이지로 배포한다면 그 값을 빈 문자열로 바꿔주세요.

## GitHub Pages 활성화

1. **til-site repo** → Settings → Pages → "Build and deployment" → Source를 **GitHub Actions**로 설정
2. 최초 1회 main 브랜치에 push하면 Actions가 빌드 & 배포

## TIL repo가 업데이트되었을 때 자동 재빌드

기본 워크플로우는 다음 트리거를 지원합니다.

- til-site repo의 main 브랜치에 push
- 매일 1회 자동 빌드 (cron)
- 수동 실행 (Actions 탭 → Run workflow)
- `repository_dispatch: til-updated`

TIL repo에서 push 시 즉시 재빌드하려면, **TIL repo**에 아래 워크플로우를 추가하세요.

```yaml
# .github/workflows/notify-til-site.yml (TIL repo에 추가)
name: Notify til-site
on:
  push:
    branches: [main]
jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.TIL_SITE_PAT }}
          repository: baezy813/til-site
          event-type: til-updated
```

> `TIL_SITE_PAT`은 `repo` 권한이 있는 PAT을 TIL repo의 Secrets에 등록해야 합니다.

## 폴더 구조

```
til-site/
├── .github/workflows/deploy.yml
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── rss.xml/route.ts
│   └── posts/[slug]/page.tsx
├── components/
│   ├── Header.tsx · Footer.tsx · Hero.tsx · StatsCard.tsx
│   ├── SearchBar.tsx · FilterTabs.tsx · SortDropdown.tsx
│   ├── PostCard.tsx · ShareButtons.tsx
│   ├── ThemeProvider.tsx · ThemeToggle.tsx
│   └── TILBlog.tsx
├── hooks/useTilFilterSort.ts
├── lib/
│   ├── types.ts · parseMD.ts · getPosts.ts · rss.ts
├── package.json · tsconfig.json
├── next.config.mjs · tailwind.config.ts
├── postcss.config.mjs · .gitignore · README.md
```

## 주요 기능

- 홈
  - 통계 카드 (총 글 수 / 카테고리 수 / 마지막 업데이트)
  - 카테고리 필터 탭 (`All` + 폴더 동적 생성)
  - 검색바 (제목/본문/카테고리 부분 일치 검색)
  - 정렬: 최신순 / 오래된순 / 연도별 그룹
- 상세 페이지
  - 마크다운 본문 (헤딩 앵커, 코드 하이라이팅, 테이블 등)
  - 이전/다음 글 네비게이션
  - X 공유 & 클립보드 복사 / GitHub 원본 링크
- 다크 모드 (localStorage 저장 + 시스템 prefers 감지)
- RSS 피드 (`/rss.xml`)
