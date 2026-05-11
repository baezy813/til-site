'use client';

export interface FilterTabsProps {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
}

export function FilterTabs({ categories, active, onChange }: FilterTabsProps) {
  return (
    <div className="-mx-1 flex flex-wrap items-center gap-1">
      {categories.map((c) => {
        const isActive = c === active;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={[
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition',
              isActive
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
            ].join(' ')}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
