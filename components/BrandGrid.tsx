import React from 'react';
import type { BrandCardData } from '@/lib/brand-grid';
import type { Brand } from '@/lib/types';
import { BrandCard } from './BrandCard';

interface BrandGridProps {
  brands: (BrandCardData | Brand)[];
  priorityCount?: number;
  className?: string;
}

/**
 * Shared equal-size BrandGrid component.
 * Uses CSS Grid auto-rows-fr so every card in every row has identical height.
 * Responsive: 1 column at 360px, 2 columns at 640px (sm), 3 columns at 1024px (lg).
 * Incomplete last rows maintain uniform column width.
 */
export function BrandGrid({ brands, priorityCount = 0, className = '' }: BrandGridProps) {
  return (
    <ul
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr list-none p-0 m-0 ${className}`}
    >
      {brands.map((brand, idx) => (
        <li key={brand.slug} className="flex flex-col h-full m-0 p-0">
          <BrandCard brand={brand} priority={idx < priorityCount} />
        </li>
      ))}
    </ul>
  );
}

export default BrandGrid;
