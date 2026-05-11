/**
 * GitHub Pages 정적 export 설정.
 * BASE_PATH 환경변수를 사용해 사용자/조직 페이지(`/`) 또는 프로젝트 페이지(`/til-site`) 둘 다 대응.
 *
 * - 사용자 페이지(`baezy813.github.io`)로 배포할 때: BASE_PATH 미설정 (기본값 '')
 * - 프로젝트 페이지(`baezy813.github.io/til-site`)로 배포할 때: BASE_PATH=/til-site
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
