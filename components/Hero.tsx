import { StatsCard } from './StatsCard';
import type { SiteStats } from '@/lib/types';

export function Hero({ stats }: { stats: SiteStats }) {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-brand-500">Today I Learned</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          매일 배운 것을 가볍게,
          <br className="hidden sm:block" />
          <span className="text-brand-500"> 그러나 꾸준히.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          프론트엔드 개발자의 학습 흐름을 그대로 옮겨둔 공간. 코드 스니펫부터 도메인 지식까지,
          짧고 솔직하게 기록합니다. 모든 글은 GitHub 저장소에서 자동으로 가져와 빌드됩니다.
        </p>
      </div>

      <div className="mt-8">
        <StatsCard stats={stats} />
      </div>
    </section>
  );
}
