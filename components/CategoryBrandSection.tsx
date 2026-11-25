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
    <section aria-labelledby={`cat-${group.slug}`} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-separator pb-3 gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            {group.icon && (
              <span
                className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <CategoryIcon name={group.icon} className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            )}
            <h2 id={`cat-${group.slug}`} className="text-2xl md:text-3xl font-bold text-text">
              {group.title}
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-bg-subtle border border-separator text-text-secondary ml-1">
              {pluralize(planCount, 'plan')}{brandCount ? ` · ${pluralize(brandCount, 'brand')}` : ''}
            </span>
          </div>
          <p className="text-xs md:text-sm text-text-secondary max-w-3xl leading-relaxed">
            {group.intro}
          </p>
        </div>
        <Link
          href={group.href}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle text-xs md:text-sm font-semibold text-text hover:text-accent transition-colors min-h-[40px] flex-shrink-0 self-start sm:self-auto"
        >
          View all {group.title} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>

      <BrandGrid brands={group.brands} priorityCount={isFirstCategory ? 3 : 0} />
    </section>
  );
}

export default CategoryBrandSection;
