import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CategoryGroup } from '@/lib/brand-grid';
import { BrandCard } from './BrandCard';

interface CategoryBrandSectionProps {
  group: CategoryGroup;
  isFirstCategory?: boolean;
}

/**
 * Renders an accessible, crawl-friendly category section with 6-8 brand cards.
 * Uses semantic section, h2, ul/li markup with a responsive 1->2->3 column grid.
 */
export function CategoryBrandSection({
  group,
  isFirstCategory = false,
}: CategoryBrandSectionProps) {
  return (
    <section aria-labelledby={`cat-${group.slug}`} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-separator pb-3 gap-2">
        <div>
          <h2 id={`cat-${group.slug}`} className="text-2xl md:text-3xl font-bold text-text">
            {group.title}
          </h2>
          <p className="text-xs md:text-sm text-text-secondary mt-1 max-w-3xl leading-relaxed">
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

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4 list-none p-0 m-0">
        {group.brands.map((brand, idx) => (
          <li key={brand.slug} className="m-0 p-0">
            <BrandCard brand={brand} priority={isFirstCategory && idx < 3} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CategoryBrandSection;
