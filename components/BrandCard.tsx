import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { BrandCardData } from '@/lib/brand-grid';
import type { Brand, Product, MergedPlan } from '@/lib/types';
import { formatPkr } from '@/lib/money';
import { pluralize } from '@/lib/format';

interface BrandCardProps {
  brand: BrandCardData | Brand | Product | MergedPlan;
  minPrice?: number | null;
  priority?: boolean;
}

/**
 * Server component rendering an equal-size, accessible plan / brand card.
 * - Entire card is one single <Link> with uniform stretch (h-full in grid).
 * - Fixed ~60x60 logo tile with flex-shrink: 0 and uniform padding.
 * - Text block with flex: 1 and min-w-0 for reliable single-line text truncation.
 * - Single-line card-title with ellipsis and full plan name in title tooltip.
 * - Fixed ~48x48 decorative arrow button with flex-shrink: 0.
 * - Visible focus ring (focus-visible:ring-accent).
 */
export function BrandCard({ brand, minPrice, priority = false }: BrandCardProps) {
  // Normalize title properties whether from BrandCardData, Brand, Product, or MergedPlan
  const fullName =
    ('name' in brand && brand.name
      ? brand.name
      : 'displayName' in brand && brand.displayName
      ? brand.displayName
      : '') || '';
  const displayName =
    ('displayName' in brand && brand.displayName ? brand.displayName : '') || fullName;

  const categorySlug =
    'categorySlug' in brand && brand.categorySlug
      ? (brand as any).categorySlug
      : 'category' in brand && brand.category
      ? (brand as any).category
      : '';

  let href =
    'href' in brand && brand.href
      ? brand.href
      : 'redirectTo' in brand && (brand as MergedPlan).redirectTo
      ? (brand as MergedPlan).redirectTo
      : 'isMultiPlan' in brand && brand.isMultiPlan
      ? `/${categorySlug}/${brand.slug}/`
      : 'productUrl' in brand && (brand as any).productUrl
      ? (brand as any).productUrl
      : 'productSlug' in brand && (brand as any).productSlug
      ? `/product/${(brand as any).productSlug}/`
      : `/product/${brand.slug}/`;

  if (!href.endsWith('/')) {
    href = `${href}/`;
  }

  const rawLogo = 'logo' in brand ? brand.logo : null;
  const logoSrc =
    typeof rawLogo === 'object' && rawLogo !== null && 'src' in rawLogo
      ? rawLogo.src
      : typeof rawLogo === 'string'
      ? rawLogo
      : '';

  const cleanNameForAlt = displayName.replace(/[\(\+\-\&]$/, '').trim();
  const logoAlt = `${cleanNameForAlt} logo`;

  const lowestPrice =
    minPrice !== undefined
      ? minPrice
      : 'lowestPricePkr' in brand
      ? brand.lowestPricePkr
      : 'price' in brand
      ? (brand as Product | MergedPlan).price
      : null;

  const planCount = ('planCount' in brand ? brand.planCount : 1) || 1;
  const countLabel = pluralize(planCount, 'plan');

  const duration = 'duration' in brand && brand.duration ? (brand.duration as string) : null;
  const subtitle = duration
    ? `${duration}${lowestPrice != null ? ` · ${formatPkr(lowestPrice)}` : ' · quote on request'}`
    : `${countLabel}${lowestPrice != null ? ` · from ${formatPkr(lowestPrice)}` : ' · quote on request'}`;

  // Accessible 2-letter uppercase initials fallback
  const initials =
    displayName
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AI';

  return (
    <Link
      href={href}
      title={fullName || displayName}
      aria-label={`${displayName}, ${subtitle}`}
      className="group flex items-center gap-4 p-4 md:p-5 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all h-full min-h-[96px] md:min-h-[104px] w-full"
    >
      {/* 1. Normalized Fixed ~60x60 Logo Tile (flex-shrink: 0) */}
      <div className="w-14 h-14 min-w-[56px] min-h-[56px] md:w-[60px] md:h-[60px] md:min-w-[60px] md:min-h-[60px] rounded-2xl border border-separator bg-white flex items-center justify-center p-2 flex-shrink-0 overflow-hidden shadow-xs">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={44}
            height={44}
            loading={priority ? undefined : 'lazy'}
            priority={priority}
            className="object-contain max-w-[40px] max-h-[40px] md:max-w-[44px] md:max-h-[44px] w-auto h-auto"
          />
        ) : (
          <span className="text-xs md:text-sm font-bold text-accent" aria-hidden="true">
            {initials}
          </span>
        )}
      </div>

      {/* 2. Text Block (flex: 1; min-width: 0;) */}
      <div className="flex-1 min-w-0">
        <h3
          className="card-title font-bold text-text text-sm md:text-base group-hover:text-accent transition-colors truncate max-w-full leading-tight"
          title={fullName || displayName}
        >
          {displayName}
        </h3>
        <p className="text-xs text-text-tertiary truncate mt-1">
          {subtitle}
        </p>
      </div>

      {/* 3. Arrow Button (~48x48, flex-shrink: 0) */}
      <div className="flex-shrink-0" aria-hidden="true">
        <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-bg-subtle flex items-center justify-center text-text-tertiary group-hover:bg-accent group-hover:text-accent-on transition-colors">
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </span>
      </div>
    </Link>
  );
}

export default BrandCard;
