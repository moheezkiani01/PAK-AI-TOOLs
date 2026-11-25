import React from 'react';
import type { BrandCardData } from '@/lib/brand-grid';
import type { Brand, Product, MergedPlan } from '@/lib/types';
import { BrandCard } from './BrandCard';

interface BrandGridProps {
  brands: (BrandCardData | Brand | Product | MergedPlan)[];
  priorityCount?: number;
  className?: string;
}

/**
 * Shared equal-size BrandGrid component.
 * Uses CSS Grid auto-rows-fr so every card in every row has identical height.
 * Responsive: 1 column at 360px, 2 columns at 640px (sm), 3 columns at 1024px (lg).
 * Stable React keys ensure smooth rendering.
 */
export function BrandGrid({ brands, priorityCount = 0, className = '' }: BrandGridProps) {
  return (
    <ul
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr list-none p-0 m-0 ${className}`}
    >
      {brands.map((brand, idx) => (
        <li
          key={'id' in brand && brand.id !== undefined ? brand.id : 'slug' in brand ? brand.slug : idx}
          className="flex flex-col h-full m-0 p-0"
        >
          <BrandCard brand={brand} priority={idx < priorityCount} />
        </li>
      ))}
    </ul>
  );
}

export default BrandGrid;
