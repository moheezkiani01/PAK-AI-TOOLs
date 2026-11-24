'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, Clock, CreditCard, UserCheck, ArrowRight } from 'lucide-react';
import { buildWhatsAppLink, getProductWhatsAppMessage } from '@/lib/whatsapp';
import { PriceText } from './PriceText';
import { useCurrency } from './CurrencyContext';
import { SITE } from '@/lib/site.config';

interface BuyCardProps {
  planName: string;
  price: number | null;
  duration: string;
  warranty: string;
  accountType?: string;
  deliveryTime?: string;
  paymentMethods?: string;
  slug?: string;
  pageUrl?: string;
  brandSlug?: string;
  hasBrandHub?: boolean;
  categorySlug?: string;
}

export function BuyCard({
  planName,
  price,
  duration,
  warranty,
  accountType,
  deliveryTime = SITE.deliveryText,
  paymentMethods,
  slug,
  pageUrl: initialPageUrl,
  brandSlug,
  hasBrandHub = false,
  categorySlug,
}: BuyCardProps) {
  const { currency } = useCurrency();
  const pageUrl =
    initialPageUrl ||
    (typeof window !== 'undefined'
      ? window.location.href
      : slug
      ? `${SITE.domain}/product/${slug}/`
      : `${SITE.domain}/`);
  const waLink = buildWhatsAppLink(
    getProductWhatsAppMessage(planName, price, duration, pageUrl, currency === 'USD')
  );

  return (
    <aside
      aria-label="Order summary"
      className="product-buy-card rounded-2xl border border-separator bg-bg-card p-5 md:p-6 shadow-card"
    >
      <div className="flex items-baseline justify-between mb-4 border-b border-separator pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-text-tertiary block mb-1">
            Price in Pakistan
          </span>
          <PriceText pkr={price} className="text-2xl md:text-3xl" />
          <p className="mt-1.5 text-[11px] text-text-tertiary">
            *USD amount is approximate, based on a reference rate of $1 = Rs. {SITE.pkrPerUsd}. All orders are billed in fixed Pakistani Rupees (PKR).
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent-soft text-accent font-semibold">
          {duration}
        </span>
      </div>

      <dl className="space-y-3 text-xs md:text-sm text-text-secondary mb-6">
        <div className="flex items-start">
          <ShieldCheck className="w-4 h-4 mr-2 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <dt className="inline font-semibold text-text">Warranty: </dt>
            <dd className="inline">{warranty}</dd>
          </div>
        </div>

        {accountType && (
          <div className="flex items-start">
            <UserCheck className="w-4 h-4 mr-2 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <dt className="inline font-semibold text-text">Account: </dt>
              <dd className="inline">{accountType}</dd>
            </div>
          </div>
        )}

        <div className="flex items-start">
          <Clock className="w-4 h-4 mr-2 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <dt className="inline font-semibold text-text">Delivery: </dt>
            <dd className="inline">{deliveryTime}</dd>
          </div>
        </div>

        <div className="flex items-start">
          <CreditCard className="w-4 h-4 mr-2 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <dt className="inline font-semibold text-text">Payment: </dt>
            <dd className="inline">
              {currency === 'USD'
                ? 'Binance, JazzCash, EasyPaisa, SadaPay, Raast'
                : 'JazzCash, EasyPaisa, SadaPay, NayaPay, Raast, Binance'}
            </dd>
          </div>
        </div>
      </dl>

      <div className="space-y-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center bg-accent text-accent-on px-6 py-3.5 rounded-xl font-bold text-base shadow-sm hover:opacity-95 active:scale-[0.98] transition-all min-h-[48px]"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Order on WhatsApp
        </a>

        {hasBrandHub && categorySlug && brandSlug && (
          <Link
            href={`/${categorySlug}/${brandSlug}/`}
            className="w-full flex items-center justify-center bg-bg-subtle text-text hover:text-accent px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm border border-separator transition-colors min-h-[44px]"
          >
            Compare all {brandSlug.replace(/-/g, ' ')} plans
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        )}
      </div>

      <p className="mt-4 text-[11px] text-center text-text-tertiary">
        {currency === 'USD'
          ? `USD approximate at Rs ${SITE.pkrPerUsd} = $1 (rate set ${SITE.rateDate}). Confirmed on WhatsApp.`
          : `Prices verified. Delivery within 15 minutes after payment verification.`}
      </p>
    </aside>
  );
}
