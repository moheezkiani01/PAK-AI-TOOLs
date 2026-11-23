import React from 'react';
import Link from 'next/link';
import { CategoryIcon } from './IconHelper';
import type { Category } from '@/lib/types';

export function CategoryCard({ category }: { category: Category }) {
  // Soft tint background styles based on tint
  const tintClasses: Record<string, { bg: string; iconBg: string; text: string }> = {
    blue: { bg: 'bg-blue-50/50 dark:bg-blue-950/20', iconBg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300' },
    amber: { bg: 'bg-amber-50/50 dark:bg-amber-950/20', iconBg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
    rose: { bg: 'bg-rose-50/50 dark:bg-rose-950/20', iconBg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300' },
    red: { bg: 'bg-red-50/50 dark:bg-red-950/20', iconBg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300' },
    green: { bg: 'bg-emerald-50/50 dark:bg-emerald-950/20', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300' },
    violet: { bg: 'bg-purple-50/50 dark:bg-purple-950/20', iconBg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300' },
    pink: { bg: 'bg-pink-50/50 dark:bg-pink-950/20', iconBg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-700 dark:text-pink-300' },
    sky: { bg: 'bg-sky-50/50 dark:bg-sky-950/20', iconBg: 'bg-sky-100 dark:bg-sky-900/40', text: 'text-sky-700 dark:text-sky-300' },
    teal: { bg: 'bg-teal-50/50 dark:bg-teal-950/20', iconBg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-700 dark:text-teal-300' },
    emerald: { bg: 'bg-emerald-50/50 dark:bg-emerald-950/20', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300' },
    cyan: { bg: 'bg-cyan-50/50 dark:bg-cyan-950/20', iconBg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300' },
    orange: { bg: 'bg-orange-50/50 dark:bg-orange-950/20', iconBg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300' },
    slate: { bg: 'bg-slate-50/50 dark:bg-slate-900/20', iconBg: 'bg-slate-100 dark:bg-slate-800/40', text: 'text-slate-700 dark:text-slate-300' },
    indigo: { bg: 'bg-indigo-50/50 dark:bg-indigo-950/20', iconBg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300' },
    gray: { bg: 'bg-gray-50/50 dark:bg-gray-900/20', iconBg: 'bg-gray-100 dark:bg-gray-800/40', text: 'text-gray-700 dark:text-gray-300' },
  };

  const style = tintClasses[category.tint] || tintClasses.blue;

  return (
    <Link
      href={`/${category.slug}/`}
      className={`group block rounded-2xl border border-separator p-5 md:p-6 transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 ${style.bg}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${style.iconBg} ${style.text}`}>
          <CategoryIcon name={category.icon} className="w-7 h-7" />
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bg-card border border-separator text-text-secondary">
          {category.brands} brands · {category.plans} plans
        </span>
      </div>

      <h3 className="text-lg md:text-xl font-bold text-text group-hover:text-accent transition-colors mb-2">
        {category.name}
      </h3>

      <p className="text-xs md:text-sm text-text-tertiary line-clamp-1">
        {category.sampleBrands.join(', ')}
      </p>
    </Link>
  );
}
