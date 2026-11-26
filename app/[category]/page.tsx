import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getCategories,
  getCategoryBySlug,
  getCategoryHub,
  getBrandsByCategory,
  getProductsByCategory,
  getCategoryCounts,
} from '@/lib/data';
import { BrandCard } from '@/components/BrandCard';
import { BrandGrid } from '@/components/BrandGrid';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { PackFaq } from '@/components/PackFaq';
import { JsonLd } from '@/components/JsonLd';
import { getCollectionSchema } from '@/lib/schema';
import { getFaqByCategorySlug } from '@/lib/faq';
import { renderMarkdown } from '@/lib/markdown';
import { ShieldCheck, BookOpen, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site.config';
import { buildWhatsAppLink, getCategoryWhatsAppMessage } from '@/lib/whatsapp';
import { baseOg, optimizeSeoTitle } from '@/lib/seo';
import { pluralize } from '@/lib/format';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: catSlug } = await params;
  const hub = getCategoryHub(catSlug);
  const cat = getCategoryBySlug(catSlug);

  if (!cat) return {};

  const rawTitle = hub?.seoTitle || `${cat.name} Price in Pakistan – Plans in PKR`;
  const cleanTitle = optimizeSeoTitle(rawTitle);
  const description = hub?.metaDesc || `Compare ${cat.name} plans in Pakistan. Local PKR payment, warranty per plan, WhatsApp support.`;

  return {
    title: cleanTitle,
    description,
    alternates: {
      canonical: `https://pakaitools.store/${cat.slug}/`,
    },
    openGraph: {
      ...baseOg,
      title: cleanTitle,
      description,
      url: `https://pakaitools.store/${cat.slug}/`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: catSlug } = await params;
  const category = getCategoryBySlug(catSlug);
  const hub = getCategoryHub(catSlug);

  if (!category) {
    notFound();
  }

  const counts = getCategoryCounts(catSlug);
  const brands = getBrandsByCategory(catSlug);
  const products = getProductsByCategory(catSlug);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: category.name, url: `/${category.slug}/` },
  ];

  const faqCategory = getFaqByCategorySlug(catSlug);
  const faqPageNode = faqCategory
    ? faqCategory.jsonld['@graph'].find((n: any) => n['@type'] === 'FAQPage')
    : undefined;

  // B8 Content Uniqueness: Check if category has verified unique FAQs (hide templated generic FAQs)
  const isTemplatedFaq = !hub?.faqs || hub.faqs.some((f) => f.question.startsWith('What is the price of '));
  const uniqueFaqs = isTemplatedFaq ? undefined : hub.faqs;

  const schema = getCollectionSchema(
    hub?.h1 || `${category.name} Price in Pakistan`,
    `/${category.slug}/`,
    breadcrumbs,
    uniqueFaqs,
    undefined,
    faqPageNode
  );

  const brandsWithPrices = brands.map((brand) => {
    const brandProducts = products.filter(
      (p) => p.brandSlug === brand.slug || p.slug === brand.productSlug
    );
    const prices = brandProducts
      .map((p) => p.price)
      .filter((pr): pr is number => pr !== null && typeof pr === 'number');
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const fullName = (brand.productSlug ? brandProducts.find((p) => p.slug === brand.productSlug)?.name : null) || brand.displayName;
    return {
      ...brand,
      name: fullName,
      minPrice,
    };
  });

  return (
    <div className="space-y-6 md:space-y-8 py-2">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header & Answer Paragraph */}
      <section className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          {hub?.h1 || `${category.name} Price in Pakistan`}
        </h1>
        <div className="p-4 md:p-5 rounded-2xl bg-accent-soft/40 border border-accent/20 space-y-3">
          <p className="text-sm md:text-base text-text leading-relaxed font-medium">
            {(hub?.answer ||
              `PakAITools lists ${pluralize(counts.brandCount, 'verified brand')} and ${pluralize(counts.planCount, 'plan')} in ${category.name} with fixed PKR pricing for Pakistan. Every plan includes guaranteed warranty coverage, no credit card required, and private WhatsApp delivery within 15 minutes after payment verification.`).replace(/\*\*/g, '')}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary pt-2 border-t border-accent/15">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-accent" />
              Verified Warranty on Every Plan
            </span>
            <span>·</span>
            <span>Delivery: Within 15 minutes</span>
            <span>·</span>
            <span>Last updated: {products.map((p) => p.updatedAt).filter(Boolean).sort().reverse()[0] || '2026-11-22'}</span>
          </div>
        </div>
      </section>

      {/* Brand Grid (Equal-size cards) */}
      <section aria-labelledby="brands-grid-heading" className="space-y-3">
        <h2 id="brands-grid-heading" className="text-xl md:text-2xl font-bold text-text">
          Brands in {category.name}
        </h2>
        <BrandGrid brands={brandsWithPrices} />
      </section>

      {/* Rich Markdown Content if available (without duplicate Brand grid) */}
      {hub?.contentMarkdown && (
        <section className="rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-3">
          <div
            className="catalogue-content space-y-4 text-text-secondary text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(hub.contentMarkdown) }}
          />
        </section>
      )}

      {/* Related Category Guide Link */}
      <section className="p-5 rounded-2xl border border-accent/30 bg-accent-soft/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-accent text-accent-on flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-text text-sm md:text-base">
              Need help deciding? Read the {category.name} Buying Guide
            </h3>
            <p className="text-xs text-text-secondary">
              Compare features, device limits, and see which plan fits your budget.
            </p>
          </div>
        </div>
        <Link
          href={`/blog/${category.slug}-price-guide-pakistan/`}
          className="bg-accent text-accent-on px-4 py-2 rounded-xl font-bold text-xs shadow-xs hover:opacity-95 whitespace-nowrap min-h-[40px] flex items-center"
        >
          Read Buying Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </section>

      {/* FAQs */}
      {faqCategory ? (
        <PackFaq
          title={`Frequently Asked Questions about ${faqCategory.label}`}
          faqs={faqCategory.faqs}
          lastReviewed="November 26, 2026"
        />
      ) : uniqueFaqs && uniqueFaqs.length > 0 ? (
        <Faq items={uniqueFaqs} />
      ) : null}

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: PakAITools is an independent reseller and is not affiliated with, endorsed by, or officially partnered with any brand in {category.name}. All product names, logos, and brands are property of their respective owners. Have questions? WhatsApp Support:{' '}
          <a
            href={buildWhatsAppLink(getCategoryWhatsAppMessage(category.name, `https://pakaitools.store/${category.slug}/`))}
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
