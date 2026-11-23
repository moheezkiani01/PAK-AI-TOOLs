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
import { ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';

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

  return {
    title: hub.seoTitle,
    description: hub.metaDesc,
    alternates: {
      canonical: `https://pakaitools.store/${catSlug}/${brandSlug}/`,
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

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: category.name, url: `/${category.slug}/` },
    { name: hub.name.replace(/ Price in Pakistan$/i, ''), url: hub.url },
  ];

  const schema = getCollectionSchema(hub.h1, hub.url, breadcrumbs, hub.faqs);

  return (
    <div className="space-y-10 py-2">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header & Answer Paragraph */}
      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-text">{hub.h1}</h1>
        <p className="text-base text-text-secondary leading-relaxed max-w-3xl">
          {hub.answer}
        </p>
      </section>

      {/* Plan Comparison Table / Cards */}
      <section aria-labelledby="plans-table-heading" className="space-y-4">
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
              isMerged={false}
            />
          ))}

          {/* Merged plans second */}
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
              redirectTo={mp.redirectTo}
            />
          ))}
        </div>
      </section>

      {/* Rich Markdown Content if available */}
      {hub.contentMarkdown && (
        <section className="rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-4">
          <div
            className="prose max-w-none text-text-secondary text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(hub.contentMarkdown) }}
          />
        </section>
      )}

      {/* Related Category Guide Link */}
      <section className="p-5 rounded-2xl border border-separator bg-bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-text text-sm md:text-base">
              Comparing {category.name} Subscriptions?
            </h3>
            <p className="text-xs text-text-secondary">
              Read our in-depth buying guides and plan comparisons in the blog.
            </p>
          </div>
        </div>
        <Link
          href={`/blog/${category.slug}-price-guide-pakistan/`}
          className="bg-bg-subtle text-text hover:text-accent border border-separator px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap min-h-[40px] flex items-center transition-colors"
        >
          View Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </section>

      {/* FAQs */}
      {hub.faqs && hub.faqs.length > 0 && <Faq items={hub.faqs} />}

      {/* Related Brands in same Category */}
      {relatedBrands.length > 0 && (
        <section aria-labelledby="related-brands-heading" className="space-y-4 pt-4 border-t border-separator">
          <h2 id="related-brands-heading" className="text-lg font-bold text-text">
            Related {category.name} Brands
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {relatedBrands.map((b) => (
              <Link
                key={b.slug}
                href={b.isMultiPlan ? `/${category.slug}/${b.slug}/` : (b.productUrl || `/product/${b.productSlug}/`)}
                className="px-3.5 py-2 rounded-xl border border-separator bg-bg-card hover:border-accent text-xs md:text-sm font-semibold text-text transition-colors flex items-center"
              >
                {b.displayName}
                <ArrowRight className="w-3.5 h-3.5 ml-1 text-text-tertiary" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: PakAITools is an independent reseller. Brand names belong to their respective owners. Every order includes local PKR payment with WhatsApp delivery.
        </p>
      </div>
    </div>
  );
}
