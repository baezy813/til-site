import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        주소가 잘못되었거나, 글이 삭제되었을 수 있어요.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
