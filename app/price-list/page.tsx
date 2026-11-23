import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategories, getProducts, getMergedPlans } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PriceText } from '@/components/PriceText';
import { JsonLd } from '@/components/JsonLd';
import { getCollectionSchema } from '@/lib/schema';
import { SITE } from '@/lib/site.config';
import { Search, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { buildWhatsAppLink, getProductWhatsAppMessage, getGeneralWhatsAppMessage } from '@/lib/whatsapp';
import { PriceListClient } from './PriceListClient';

export const metadata: Metadata = {
  title: 'Full Price List (All 231 Plans in PKR)',
  description:
    'Complete price list for 231 digital plans in Pakistan: AI tools, design apps, VPNs, streaming, developer accounts. Pay in PKR via JazzCash, EasyPaisa, SadaPay.',
  alternates: {
    canonical: 'https://pakaitools.store/price-list/',
  },
  openGraph: {
    title: 'Full Price List (All 231 Plans in PKR)',
    description:
      'Complete price list for 231 digital plans in Pakistan: AI tools, design apps, VPNs, streaming, developer accounts. Pay in PKR via JazzCash, EasyPaisa, SadaPay.',
    url: 'https://pakaitools.store/price-list/',
    images: ['/og-default.png'],
  },
};

export default function PriceListPage() {
  const categories = getCategories();
  const products = getProducts();
  const mergedPlans = getMergedPlans();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Price List', url: '/price-list/' },
  ];

  const schema = getCollectionSchema(
    'Full Price List – PakAITools',
    '/price-list/',
    breadcrumbs
  );

  // Group all 231 plans by category
  const categoryGroups = categories.map((cat) => {
    const catProducts = products
      .filter((p) => p.categorySlug === cat.slug)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        duration: p.duration,
        warranty: p.warranty,
        isMerged: false,
        url: `/product/${p.slug}/`,
      }));

    const catMerged = mergedPlans
      .filter((mp) => mp.categorySlug === cat.slug)
      .map((mp) => ({
        id: mp.id,
        name: mp.name,
        slug: mp.slug,
        price: mp.price,
        duration: mp.duration,
        warranty: mp.warranty,
        isMerged: true,
        url: mp.redirectTo,
      }));

    return {
      category: cat,
      plans: [...catProducts, ...catMerged],
    };
  });

  return (
    <div className="space-y-6 py-2">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          Digital Subscriptions Price List in Pakistan
        </h1>
        <p className="text-base text-text-secondary leading-relaxed max-w-3xl">
          Browse all 231 plans across 15 categories. Every plan includes upfront warranty details and local Pakistani payment checkout without an international card.
        </p>
        <p className="text-xs text-text-tertiary">
          Prices last reviewed on {SITE.pricesReviewedOn} · All prices in PKR (USD viewable)
        </p>
      </section>

      {/* Category Jump Anchors */}
      <nav aria-label="Category Jump Navigation" className="flex flex-wrap gap-2 pt-1">
        {categories.map((cat) => (
          <a
            key={cat.slug}
            href={`#${cat.slug}`}
            className="px-3 py-1.5 rounded-lg border border-separator bg-bg-card hover:border-accent text-xs font-semibold text-text transition-colors"
          >
            {cat.name}
          </a>
        ))}
      </nav>

      {/* Client Search and Filter Enhancement */}
      <Suspense fallback={null}>
        <PriceListClient categoryGroups={categoryGroups} />
      </Suspense>

      {/* Static Fallback HTML representation (works with JS disabled) */}
      <noscript>
        <div className="space-y-6">
          {categoryGroups.map(({ category, plans }) => (
            <section key={category.slug} id={category.slug} className="space-y-3 pt-4 border-t border-separator">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text">{category.name}</h2>
                <span className="text-xs text-text-tertiary">{plans.length} plans</span>
              </div>
              <div className="space-y-2.5">
                {plans.map((p) => (
                  <div key={p.slug} className="p-4 rounded-xl border border-separator bg-bg-card flex justify-between items-center">
                    <div>
                      <a href={p.url} className="font-semibold text-text hover:text-accent">
                        {p.name}
                      </a>
                      <div className="text-xs text-text-tertiary mt-1">
                        {p.duration} · {p.warranty}
                      </div>
                    </div>
                    <div className="text-right font-bold text-text">
                      {p.price ? `Rs. ${p.price.toLocaleString('en-PK')}` : 'Live quote'}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </noscript>
      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: Last Updated: November 22, 2026. All 231 plans feature live PKR pricing with local payment methods (JazzCash, EasyPaisa, SadaPay) and WhatsApp delivery. Have questions? WhatsApp Support:{' '}
          <a
            href={buildWhatsAppLink(getGeneralWhatsAppMessage('https://pakaitools.store/price-list/'))}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline font-semibold hover:opacity-80"
          >
            {SITE.whatsappDisplay}
          </a>.
        </p>
      </div>
    </div>
  );
}
