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
} from '@/lib/data';
import { BrandCard } from '@/components/BrandCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { getCollectionSchema } from '@/lib/schema';
import { renderMarkdown } from '@/lib/markdown';
import { ShieldCheck, BookOpen, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site.config';

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
  const cleanTitle = rawTitle.replace(/\s*\|\s*PakAITools\s*$/i, '');
  const description = hub?.metaDesc || `Compare ${cat.name} plans in Pakistan. Local PKR payment, warranty per plan, WhatsApp support.`;

  return {
    title: cleanTitle,
    description,
    alternates: {
      canonical: `https://pakaitools.store/${cat.slug}/`,
    },
    openGraph: {
      title: cleanTitle,
      description,
      url: `https://pakaitools.store/${cat.slug}/`,
      images: ['/og-default.png'],
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

  const brands = getBrandsByCategory(catSlug);
  const products = getProductsByCategory(catSlug);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: category.name, url: `/${category.slug}/` },
  ];

  const schema = getCollectionSchema(
    hub?.h1 || `${category.name} Price in Pakistan`,
    `/${category.slug}/`,
    breadcrumbs,
    hub?.faqs
  );

  return (
    <div className="space-y-10 py-2">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header & Answer Paragraph */}
      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          {hub?.h1 || `${category.name} Price in Pakistan`}
        </h1>
        <p className="text-base text-text-secondary leading-relaxed max-w-3xl">
          {hub?.answer ||
            `PakAITools lists ${category.brands} brands and ${category.plans} plans in ${category.name} for Pakistan. Compare plans by duration, device allowance, and warranty before you order.`}
        </p>
      </section>

      {/* Brand Grid (Single clean heading) */}
      <section aria-labelledby="brands-grid-heading" className="space-y-4">
        <h2 id="brands-grid-heading" className="text-xl md:text-2xl font-bold text-text">
          Brands in {category.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {brands.map((brand) => {
            const brandProducts = products.filter((p) => p.brandSlug === brand.slug);
            const prices = brandProducts.map((p) => p.price).filter((pr): pr is number => pr !== null);
            const minPrice = prices.length > 0 ? Math.min(...prices) : null;
            return <BrandCard key={brand.slug} brand={brand} minPrice={minPrice} />;
          })}
        </div>
      </section>

      {/* Rich Markdown Content if available (without duplicate Brand grid) */}
      {hub?.contentMarkdown && (
        <section className="rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-4">
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
      {hub?.faqs && hub.faqs.length > 0 && <Faq items={hub.faqs} />}

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: PakAITools is an independent reseller and is not affiliated with, endorsed by, or officially partnered with any brand in {category.name}. All product names, logos, and brands are property of their respective owners. Have questions? WhatsApp Support: {SITE.whatsappDisplay}.
        </p>
      </div>
    </div>
  );
}
