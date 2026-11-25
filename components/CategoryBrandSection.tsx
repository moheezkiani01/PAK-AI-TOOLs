import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CategoryGroup } from '@/lib/brand-grid';
import { CategoryIcon } from './IconHelper';
import { pluralize } from '@/lib/format';
import { BrandGrid } from './BrandGrid';

interface CategoryBrandSectionProps {
  group: CategoryGroup;
  isFirstCategory?: boolean;
}

/**
 * Renders an accessible, crawl-friendly category section listing ALL plans in that category.
 * Uses semantic section, h2 (with category icon), ul/li markup with a responsive 1->2->3 column grid.
 */
export function CategoryBrandSection({
  group,
  isFirstCategory = false,
}: CategoryBrandSectionProps) {
  const planCount = group.totalPlanCount ?? group.brands.length;
  const brandCount = group.totalBrandCount;

  return (
    <section aria-labelledby={`cat-${group.slug}`} className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-separator pb-3 gap-2.5 sm:gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {group.icon && (
                <span
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-accent-soft text-accent flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <CategoryIcon name={group.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </span>
              )}
              <h2 id={`cat-${group.slug}`} className="text-lg sm:text-2xl md:text-3xl font-bold text-text leading-tight truncate sm:whitespace-normal">
                {group.title}
              </h2>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-bg-subtle border border-separator text-text-secondary flex-shrink-0 whitespace-nowrap">
              {pluralize(planCount, 'plan')}{brandCount ? ` · ${pluralize(brandCount, 'brand')}` : ''}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary max-w-3xl leading-relaxed line-clamp-2 sm:line-clamp-none">
            {group.intro}
          </p>
        </div>
        <Link
          href={group.href}
          className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle text-xs sm:text-sm font-semibold text-text hover:text-accent transition-colors min-h-[34px] sm:min-h-[40px] flex-shrink-0 self-start sm:self-auto"
        >
          <span>View all {group.title}</span> <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>

      <BrandGrid brands={group.brands} priorityCount={isFirstCategory ? 3 : 0} />
    </section>
  );
}

export default CategoryBrandSection;
