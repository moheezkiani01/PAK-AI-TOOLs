import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { BrandCardData } from '@/lib/brand-grid';
import type { Brand } from '@/lib/types';
import { formatPkr } from '@/lib/money';

interface BrandCardProps {
  brand: BrandCardData | Brand;
  minPrice?: number | null;
  priority?: boolean;
}

/**
 * Server component rendering a single brand card.
 * Accessible, crawl-friendly: entire card is one <a> link with no nested links.
 * Works seamlessly with both BrandCardData and raw Brand models.
 */
export function BrandCard({ brand, minPrice, priority = false }: BrandCardProps) {
  // Normalize brand properties whether from brand-grid or raw Brand
  const name = 'displayName' in brand ? brand.displayName : brand.name;
  const href =
    'href' in brand
      ? brand.href
      : brand.isMultiPlan
      ? `/${brand.categorySlug}/${brand.slug}/`
      : (brand.productUrl || `/product/${brand.productSlug}/`);

  const logoSrc =
    'logo' in brand
      ? typeof brand.logo === 'object' && brand.logo !== null
        ? brand.logo.src
        : (brand.logo as string | null) || ''
      : '';

  const logoAlt =
    'logo' in brand && typeof brand.logo === 'object' && brand.logo !== null && 'alt' in brand.logo
      ? brand.logo.alt
      : `${name} logo`;

  const lowestPrice =
    minPrice !== undefined
      ? minPrice
      : 'lowestPricePkr' in brand
      ? brand.lowestPricePkr
      : null;

  const planCount = brand.planCount || 1;
  const countLabel = planCount > 1 ? `${planCount} plans` : '1 plan';

  // Initials fallback when brand has no logo image
  const initials =
    name
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
      className="group flex items-center justify-between p-3.5 md:p-4 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all min-h-[64px]"
    >
      <div className="flex items-center space-x-3.5 min-w-0 pr-2">
        {/* Brand Logo or Initials Fallback */}
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl border border-separator bg-white flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden shadow-xs">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={40}
              height={40}
              loading={priority ? undefined : 'lazy'}
              priority={priority}
              className="object-contain w-full h-full"
            />
          ) : (
            <span className="text-xs md:text-sm font-bold text-accent" aria-hidden="true">
              {initials}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-text text-sm md:text-base group-hover:text-accent transition-colors leading-snug line-clamp-2">
            {name}
          </h3>
          <p className="text-xs text-text-tertiary mt-0.5">
            <span>{countLabel}</span>
            {lowestPrice != null ? (
              <span> · from {formatPkr(lowestPrice)}</span>
            ) : (
              <span> · quote on request</span>
            )}
          </p>
        </div>
      </div>

      {/* Decorative arrow icon */}
      <div className="flex-shrink-0 ml-2" aria-hidden="true">
        <span className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-text-tertiary group-hover:bg-accent group-hover:text-accent-on transition-colors">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

export default BrandCard;
