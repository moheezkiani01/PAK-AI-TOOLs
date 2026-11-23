import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllBrandHubs,
  getBrandHub,
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

  const cleanTitle = hub.seoTitle.replace(/\s*\|\s*PakAITools\s*$/i, '');

  return {
    title: cleanTitle,
    description: hub.metaDesc,
    alternates: {
      canonical: `https://pakaitools.store/${catSlug}/${brandSlug}/`,
    },
    openGraph: {
      title: cleanTitle,
      description: hub.metaDesc,
      url: `https://pakaitools.store/${catSlug}/${brandSlug}/`,
      images: ['/og-default.png'],
    },
  };
}

export default async function BrandHubPage({ params }: BrandHubPageProps) {
  const { category: catSlug, brand: brandSlug } = await params;
  const hub = getBrandHub(catSlug, brandSlug);
  const category = getCategoryBySlug(catSlug);

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

  const schema = getCollectionSchema(hub.h1, hub.url, breadcrumbs, hub.faqs);

  return (
    <div className="space-y-6 md:space-y-8 py-2">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header & Answer Paragraph */}
      <section className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-text">{hub.h1}</h1>
        <p className="text-base text-text-secondary leading-relaxed max-w-3xl">
          {hub.answer?.replace(/\*\*/g, '')}
        </p>
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
