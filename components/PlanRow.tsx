'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { PriceText } from './PriceText';
import { buildWhatsAppLink, getProductWhatsAppMessage } from '@/lib/whatsapp';
import { useCurrency } from './CurrencyContext';

interface PlanRowProps {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  duration: string;
  warranty: string;
  isMerged?: boolean;
  redirectTo?: string;
}

export function PlanRow({
  id,
  name,
  slug,
  price,
  duration,
  warranty,
  isMerged = false,
  redirectTo,
}: PlanRowProps) {
  const { currency } = useCurrency();
  const pageUrl = isMerged
    ? `https://pakaitools.store${redirectTo || '/'}`
    : `https://pakaitools.store/product/${slug}/`;

  const waLink = buildWhatsAppLink(
    getProductWhatsAppMessage(name, price, duration, pageUrl, currency === 'USD')
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle transition-colors gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-text text-sm md:text-base truncate">
            {isMerged ? (
              name
            ) : (
              <Link href={`/product/${slug}/`} className="hover:text-accent hover:underline">
                {name}
              </Link>
            )}
          </h4>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-text-secondary">
          <span className="px-2 py-0.5 rounded bg-bg-subtle border border-separator font-medium">
            {duration}
          </span>
          <span className="text-text-tertiary">·</span>
          <span>{warranty}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end space-x-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-separator">
        <div className="text-left sm:text-right">
          <PriceText pkr={price} className="text-sm md:text-base" />
        </div>

        <div>
          {isMerged ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-accent text-accent-on px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity min-h-[36px]"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1" />
              Order on WhatsApp
            </a>
          ) : (
            <Link
              href={`/product/${slug}/`}
              className="inline-flex items-center bg-bg-subtle text-text hover:text-accent border border-separator px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px]"
            >
              View plan
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
