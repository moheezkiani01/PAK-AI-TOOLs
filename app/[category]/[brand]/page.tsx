import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllBrandHubs,
  getBrandHub,
  getBrandBySlug,
  getCategoryBySlug,
  getProductsByBrand,
  getMergedPlansByBrand,
  getBrandsByCategory,
} from '@/lib/data';
import { PlanRow } from '@/components/PlanRow';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { getCollectionSchema } from '@/lib/schema';
import { renderMarkdown } from '@/lib/markdown';
import { ShieldCheck, ArrowRight, BookOpen, Scale } from 'lucide-react';
import { SITE } from '@/lib/site.config';
import { buildWhatsAppLink, getBrandWhatsAppMessage } from '@/lib/whatsapp';
import { baseOg, optimizeSeoTitle } from '@/lib/seo';

interface BrandHubPageProps {
  params: Promise<{ category: string; brand: string }>;
}

export async function generateStaticParams() {
  const brandHubs = getAllBrandHubs();
  return brandHubs.map((bh) => ({
    category: bh.categorySlug,
    brand: bh.brandSlug,
  }));
}

export async function generateMetadata({ params }: BrandHubPageProps): Promise<Metadata> {
  const { category: catSlug, brand: brandSlug } = await params;
  const hub = getBrandHub(catSlug, brandSlug);

  if (!hub) return {};

  const cleanTitle = optimizeSeoTitle(hub.seoTitle);

  return {
    title: cleanTitle,
    description: hub.metaDesc,
    alternates: {
      canonical: `https://pakaitools.store/${catSlug}/${brandSlug}/`,
    },
    openGraph: {
      ...baseOg,
      title: cleanTitle,
      description: hub.metaDesc,
      url: `https://pakaitools.store/${catSlug}/${brandSlug}/`,
    },
  };
}

export default async function BrandHubPage({ params }: BrandHubPageProps) {
  const { category: catSlug, brand: brandSlug } = await params;
  const hub = getBrandHub(catSlug, brandSlug);
  const category = getCategoryBySlug(catSlug);
  const brand = getBrandBySlug(brandSlug);

  if (!hub || !category) {
    notFound();
  }

  const products = getProductsByBrand(brandSlug);
  const mergedPlans = getMergedPlansByBrand(brandSlug);
  const relatedBrands = getBrandsByCategory(catSlug)
    .filter((b) => b.slug !== brandSlug)
    .slice(0, 3);

  const pageUrl = `https://pakaitools.store${hub.url}`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: category.name, url: `/${category.slug}/` },
    { name: hub.name.replace(/ Price in Pakistan$/i, ''), url: hub.url },
  ];

  const allBrandPlans = [...products, ...mergedPlans];
  const validPrices = allBrandPlans
    .map((p) => p.price)
    .filter((pr): pr is number => typeof pr === 'number' && pr > 0);

  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
  const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : null;

  const schema = getCollectionSchema(
    hub.h1,
    hub.url,
    breadcrumbs,
    hub.faqs,
    minPrice !== null
      ? {
          brandName: brand?.displayName || hub.name,
          lowPrice: minPrice,
          highPrice: maxPrice ?? minPrice,
          offerCount: allBrandPlans.length,
          description: hub.answer,
        }
      : undefined
  );

  return (
    <div className="space-y-6 md:space-y-8 py-2">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header & Answer Paragraph */}
      <section className="space-y-3">
        <div className="flex items-center space-x-3.5">
          {brand?.logo && (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-separator bg-white flex items-center justify-center p-2 flex-shrink-0 shadow-xs">
              <img
                src={brand.logo}
                alt={brand.displayName}
                width={48}
                height={48}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-text">{hub.h1}</h1>
        </div>
        <div className="p-4 md:p-5 rounded-2xl bg-accent-soft/40 border border-accent/20 space-y-3">
          <p className="text-sm md:text-base text-text leading-relaxed font-medium">
            {hub.answer?.replace(/\*\*/g, '')}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary pt-2 border-t border-accent/15">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-accent" />
              Verified Warranty
            </span>
            <span>·</span>
            <span>Delivery: Within 15 minutes</span>
            <span>·</span>
            <span>Last updated: {products.map((p) => p.updatedAt).filter(Boolean).sort().reverse()[0] || '2026-11-22'}</span>
          </div>
        </div>
      </section>

      {/* Plan Comparison Table / Cards */}
      <section aria-labelledby="plans-table-heading" className="space-y-3">
        <div className="flex items-center justify-between border-b border-separator pb-3">
          <h2 id="plans-table-heading" className="text-xl md:text-2xl font-bold text-text">
            Available Plans &amp; Pricing
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-soft text-accent">
            {products.length + mergedPlans.length} plans available
          </span>
        </div>

        <div className="space-y-3">
          {/* Indexable plans first */}
          {products.map((p) => (
            <PlanRow
              key={p.slug}
              id={p.id}
              name={p.name}
              slug={p.slug}
              price={p.price}
              duration={p.duration}
              warranty={p.warranty}
            />
          ))}

          {/* Merged/Unlisted reserve plans with direct order link */}
          {mergedPlans.map((mp) => (
            <PlanRow
              key={mp.slug}
              id={mp.id}
              name={mp.name}
              slug={mp.slug}
              price={mp.price}
              duration={mp.duration}
              warranty={mp.warranty}
              isMerged={true}
              parentHubUrl={hub.url}
            />
          ))}
        </div>
        <p className="mt-2.5 text-xs text-text-tertiary">
          *USD amount is approximate and changes with the exchange rate. Orders are priced in PKR.
        </p>
      </section>

      {/* Compare Before Buying Callout */}
      <div className="p-4 rounded-xl border border-separator bg-bg-card flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <Scale className="w-5 h-5 text-accent flex-shrink-0" />
          <span className="text-xs md:text-sm font-semibold text-text">
            Compare {hub.name.replace(/ Price in Pakistan$/i, '')} against competing alternatives
          </span>
        </div>
        <Link
          href="/compare/"
          className="inline-flex items-center text-xs font-bold text-accent hover:underline whitespace-nowrap"
        >
          View comparisons <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* Markdown Content (How to choose, specs, caveats) */}
      {hub.contentMarkdown && (
        <section className="rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-4">
          <div
            className="catalogue-content space-y-4 text-text-secondary text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(hub.contentMarkdown) }}
          />
        </section>
      )}

      {/* FAQs */}
      {hub.faqs && hub.faqs.length > 0 && <Faq items={hub.faqs} />}

      {/* Related Brands in same Category */}
      {relatedBrands.length > 0 && (
        <section aria-labelledby="related-brands-heading" className="space-y-4 pt-4 border-t border-separator">
          <h2 id="related-brands-heading" className="text-lg md:text-xl font-bold text-text">
            Other {category.name} Brands
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedBrands.map((b) => (
              <Link
                key={b.slug}
                href={b.hubUrl || `/${category.slug}/${b.slug}/`}
                className="p-3.5 rounded-xl border border-separator bg-bg-card hover:border-accent transition-colors flex items-center justify-between"
              >
                <span className="font-semibold text-xs md:text-sm text-text">{b.displayName}</span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: PakAITools is an independent reseller and is not affiliated with, endorsed by, or officially partnered with {hub.name.replace(/ Price in Pakistan$/i, '')}. All trademarks and brand names are property of their respective owners. Support:{' '}
          <a
            href={buildWhatsAppLink(getBrandWhatsAppMessage(hub.name.replace(/ Price in Pakistan$/i, ''), pageUrl))}
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
