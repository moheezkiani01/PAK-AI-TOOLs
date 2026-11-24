import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { BrandCardData } from '@/lib/brand-grid';
import type { Brand } from '@/lib/types';
import { formatPkr } from '@/lib/money';
import { pluralize } from '@/lib/format';

interface BrandCardProps {
  brand: BrandCardData | Brand;
  minPrice?: number | null;
  priority?: boolean;
}

/**
 * Server component rendering an equal-size, accessible brand card.
 * - Entire card is one single <Link> with 96px minimum height (h-full in grid).
 * - Fixed 56x56 logo tile with uniform padding and normalized sizing.
 * - Max 2-line name with line-clamp-2 and full name in title attribute.
 * - Always 1-line truncated meta text with pluralize helper.
 * - Decorative aria-hidden arrow.
 * - Visible focus ring (focus-visible:ring-accent).
 */
export function BrandCard({ brand, minPrice, priority = false }: BrandCardProps) {
  // Normalize brand properties whether from brand-grid or raw Brand model
  const fullName =
    ('name' in brand && brand.name
      ? brand.name
      : 'displayName' in brand && brand.displayName
      ? brand.displayName
      : '') || '';
  const displayName =
    ('displayName' in brand && brand.displayName ? brand.displayName : '') || fullName;

  const href =
    'href' in brand
      ? brand.href
      : brand.isMultiPlan
      ? `/${brand.categorySlug}/${brand.slug}/`
      : (brand.productUrl || `/product/${brand.productSlug}/`);

  const rawLogo = 'logo' in brand ? brand.logo : null;
  const logoSrc =
    typeof rawLogo === 'object' && rawLogo !== null && 'src' in rawLogo
      ? rawLogo.src
      : typeof rawLogo === 'string'
      ? rawLogo
      : '';

  const cleanNameForAlt = fullName.replace(/[\(\+\-\&]$/, '').trim();
  const logoAlt = `${cleanNameForAlt} logo`;

  const lowestPrice =
    minPrice !== undefined
      ? minPrice
      : 'lowestPricePkr' in brand
      ? brand.lowestPricePkr
      : null;

  const planCount = brand.planCount || 1;
  const countLabel = pluralize(planCount, 'plan');

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
      title={fullName}
      aria-label={`${displayName}, ${countLabel}${lowestPrice != null ? `, from ${formatPkr(lowestPrice)}` : ''}`}
      className="group flex items-center justify-between p-4 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all min-h-[96px] h-full w-full"
    >
      {/* 1. Normalized Fixed 56x56 Logo Tile */}
      <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-xl border border-separator bg-white dark:bg-bg-subtle flex items-center justify-center p-2 flex-shrink-0 overflow-hidden shadow-xs">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={40}
            height={40}
            loading={priority ? undefined : 'lazy'}
            priority={priority}
            className="object-contain max-w-[40px] max-h-[40px] w-auto h-auto"
          />
        ) : (
          <span className="text-sm font-bold text-accent" aria-hidden="true">
            {initials}
          </span>
        )}
      </div>

      {/* 2. Text Block (min-width: 0, flex: 1) */}
      <div className="min-w-0 flex-1 ml-3.5 mr-2">
        <h3 className="font-semibold text-text text-sm md:text-base group-hover:text-accent transition-colors leading-snug line-clamp-2">
          {displayName}
        </h3>
        <p className="text-xs text-text-tertiary truncate mt-0.5">
          <span>{countLabel}</span>
          {lowestPrice != null ? (
            <span> · from {formatPkr(lowestPrice)}</span>
          ) : (
            <span> · quote on request</span>
          )}
        </p>
      </div>

      {/* 3. Decorative Arrow Icon (flex: none, aria-hidden="true") */}
      <div className="flex-shrink-0" aria-hidden="true">
        <span className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-text-tertiary group-hover:bg-accent group-hover:text-accent-on transition-colors">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

export default BrandCard;
