import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Brand } from '@/lib/types';
import { SITE } from '@/lib/site.config';
import { formatPkr } from '@/lib/money';

interface BrandCardProps {
  brand: Brand;
  minPrice?: number | null;
}

export function BrandCard({ brand, minPrice }: BrandCardProps) {
  const linkUrl = brand.isMultiPlan
    ? `/${brand.categorySlug}/${brand.slug}/`
    : (brand.productUrl || `/product/${brand.productSlug}/`);

  // Initials fallback
  const initials = brand.displayName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={linkUrl}
      className="group flex items-center justify-between p-4 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all"
    >
      <div className="flex items-center space-x-3.5 min-w-0">
        {/* Brand Logo or Initials */}
        <div className="w-12 h-12 rounded-xl border border-separator bg-white flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden shadow-xs">
          {SITE.showBrandLogos && brand.logo ? (
            <img
              src={brand.logo}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              className="object-contain w-full h-full"
            />
          ) : (
            <span className="text-sm font-bold text-accent">{initials}</span>
          )}
        </div>

        <div className="min-w-0">
          <h4 className="font-bold text-text text-sm md:text-base group-hover:text-accent transition-colors truncate">
            {brand.displayName}
          </h4>
          <p className="text-xs text-text-tertiary">
            {brand.isMultiPlan ? (
              <>
                {brand.planCount} plans
                {minPrice ? ` · from ${formatPkr(minPrice)}` : ''}
              </>
            ) : (
              '1 plan'
            )}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 ml-2">
        <span className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-text-tertiary group-hover:bg-accent group-hover:text-accent-on transition-colors">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
