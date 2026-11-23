import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';

interface RelatedPlansProps {
  currentSlug: string;
  brandSlug: string;
  categorySlug: string;
  sameBrandPlans: Product[];
  sameCategoryPlans: Product[];
  maxItems?: number;
}

/**
 * RelatedPlans component: prioritizes plans from the same brand first (e.g. Canva Pro plans on Canva pages),
 * then fills remaining slots with category alternatives.
 */
export function RelatedPlans({
  currentSlug,
  brandSlug,
  categorySlug,
  sameBrandPlans,
  sameCategoryPlans,
  maxItems = 3,
}: RelatedPlansProps) {
  // Filter out the current active plan
  const cleanSameBrand = sameBrandPlans.filter((p) => p.slug !== currentSlug);
  const cleanSameCategory = sameCategoryPlans.filter(
    (p) => p.slug !== currentSlug && p.brandSlug !== brandSlug
  );

  // Prioritize same-brand plans first, then backfill with category alternatives
  const related = [...cleanSameBrand, ...cleanSameCategory].slice(0, maxItems);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="space-y-4 pt-6 border-t border-separator">
      <div className="flex items-center justify-between">
        <h2 id="related-heading" className="text-xl font-bold text-text">
          Related Subscriptions
        </h2>
        {categorySlug && (
          <Link
            href={`/${categorySlug}/`}
            className="text-xs font-semibold text-accent hover:underline flex items-center"
          >
            All category plans <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map((rp) => (
          <Link
            key={rp.slug}
            href={`/product/${rp.slug}/`}
            className="p-4 rounded-xl border border-separator bg-bg-card hover:border-accent transition-all flex flex-col justify-between group"
          >
            <div>
              <h3 className="font-bold text-xs md:text-sm text-text line-clamp-2 mb-1 group-hover:text-accent transition-colors">
                {rp.name}
              </h3>
              <span className="text-xs text-text-tertiary">{rp.duration}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-accent">
              <span>View details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
