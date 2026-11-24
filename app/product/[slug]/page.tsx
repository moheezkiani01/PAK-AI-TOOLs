import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getProducts,
  getProductBySlug,
  getCategoryBySlug,
  getBrandHub,
  getBrandBySlug,
  getProductsByBrand,
  getProductsByCategory,
} from '@/lib/data';
import { BuyCard } from '@/components/BuyCard';
import { StickyOrderBar } from '@/components/StickyOrderBar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { ComparisonTable } from '@/components/ComparisonTable';
import { RelatedPlans } from '@/components/RelatedPlans';
import { getProductSchema } from '@/lib/schema';
import { buildWhatsAppLink, getProductWhatsAppMessage } from '@/lib/whatsapp';
import { renderMarkdown } from '@/lib/markdown';
import { WhatsAppIcon } from '@/components/WhatsAppFab';
import { ShieldCheck, ArrowRight, Scale } from 'lucide-react';
import { SITE } from '@/lib/site.config';
import { baseOg } from '@/lib/seo';

function fixDuplicateH2(
  md: string,
  h1: string,
  productName: string,
  brandName?: string,
  duration?: string
): string {
  const lines = md.split('\n');
  const h1Clean = h1.trim().toLowerCase();
  const namePriceClean = `${productName.toLowerCase()} price in pakistan`;
  const durationShort = duration ? duration.split(/[\(\[\—\-]/)[0].trim().toLowerCase() : '';
  const newH2 = brandName && durationShort
    ? `How much does ${brandName} ${durationShort} cost in Pakistan?`
    : `How much does ${productName} cost in Pakistan?`;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      const headingText = lines[i].replace(/^##\s+/, '').trim().toLowerCase();
      if (
        headingText === h1Clean ||
        headingText === namePriceClean ||
        headingText.startsWith('how much does ')
      ) {
        lines[i] = `## ${newH2}`;
        break; // Only replace the target duplicate H2
      }
    }
  }
  return lines.join('\n');
}

function extractComparisonSection(md: string) {
  const match = md.match(/##\s*([^#\n]+?\s+vs\s+[^#\n]+)\s*\n([\s\S]*?)(?=\n##|$)/i);
  if (!match) return null;

  const title = match[1].trim();
  const sectionContent = match[2].trim();

  const lines = sectionContent.split('\n').map((l) => l.trim());
  const tableLines = lines.filter((l) => l.startsWith('|') && l.endsWith('|'));
  if (tableLines.length < 2) return null;

  const headers = tableLines[0]
    .split('|')
    .slice(1, -1)
    .map((h) => h.trim());

  const rows: string[][] = [];
  for (let i = 2; i < tableLines.length; i++) {
    rows.push(
      tableLines[i]
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim())
    );
  }

  const startIndex = match.index ?? 0;
  const before = md.substring(0, startIndex).trim();
  const after = md.substring(startIndex + match[0].length).trim();

  return { title, headers, rows, before, after };
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return {};

  const cleanTitle = product.seoTitle.replace(/\s*\|\s*PakAITools\s*$/i, '');

  return {
    title: cleanTitle,
    description: product.metaDesc,
    alternates: {
      canonical: `https://pakaitools.store/product/${product.slug}/`,
    },
    openGraph: {
      ...baseOg,
      title: cleanTitle,
      description: product.metaDesc,
      url: `https://pakaitools.store/product/${product.slug}/`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.categorySlug);
  const brandHub = getBrandHub(product.categorySlug, product.brandSlug);
  const hasBrandHub = !!brandHub;
  const brand = product.brandSlug ? getBrandBySlug(product.brandSlug) : undefined;

  // Breadcrumbs with proper casing
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    ...(category ? [{ name: category.name, url: `/${category.slug}/` }] : []),
    ...(hasBrandHub && brandHub ? [{ name: brandHub.name.replace(/ Price in Pakistan$/i, ''), url: brandHub.url }] : []),
    { name: product.name, url: `/product/${product.slug}/` },
  ];

  const schema = getProductSchema(product, breadcrumbs, brand?.logo);

  // Related plans: same-brand plans first, then same-category alternatives
  const sameBrandPlans = getProductsByBrand(product.brandSlug);
  const sameCategoryPlans = getProductsByCategory(product.categorySlug);

  const fullWaLink = buildWhatsAppLink(
    getProductWhatsAppMessage(
      product.name,
      product.price,
      product.duration,
      `${SITE.domain}/product/${product.slug}/`
    )
  );

  // 1. Strip duplicate empty FAQ heading from markdown body
  let cleanedMd = (product.contentMarkdown || '').replace(/##\s*Frequently Asked Questions[\s\S]*$/i, '').trim();

  // 2. Fix duplicate H2 that repeats H1: make it an organic question-style H2 (Brand + duration)
  const brandDisplayName = brand?.displayName || (brandHub ? brandHub.name.replace(/ Price in Pakistan$/i, '') : undefined);
  cleanedMd = fixDuplicateH2(cleanedMd, product.h1, product.name, brandDisplayName, product.duration);

  // 3. Extract comparison section if present to render through ComparisonTable
  const compSection = extractComparisonSection(cleanedMd);

  return (
    <div className="py-2 space-y-6">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Main Grid: Desktop 2 Columns, Mobile 1 Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: H1, Answer, Content, FAQ, Related */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8 min-w-0">
          <header className="space-y-4">
            <div className="flex items-start space-x-3.5">
              {brand?.logo && (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-separator bg-white flex items-center justify-center p-2 flex-shrink-0 shadow-xs mt-1">
                  <img
                    src={brand.logo}
                    alt={brand.displayName}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text tracking-tight leading-tight">
                {product.h1}
              </h1>
            </div>

            {/* Answer-first snippet (40-60 words) */}
            <div className="p-4 md:p-5 rounded-2xl bg-accent-soft/40 border border-accent/20">
              <p className="text-sm md:text-base text-text leading-relaxed font-medium">
                {product.answer}
              </p>
            </div>
          </header>

          {/* Mobile Only: Buy Card */}
          <div className="lg:hidden">
            <BuyCard
              planName={product.name}
              price={product.price}
              duration={product.duration}
              warranty={product.warranty}
              accountType={product.accountType}
              deliveryTime={product.deliveryTime}
              slug={product.slug}
              pageUrl={`${SITE.domain}/product/${product.slug}/`}
            />
          </div>

          {/* Quick Facts Section */}
          <div className="rounded-2xl border border-separator bg-bg-card p-5 space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-text mb-3">Quick Facts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
              {Object.entries(product.quickFacts).map(([field, details]) => (
                <div key={field} className="p-2.5 rounded-lg bg-bg-subtle border border-separator/60">
                  <span className="font-bold text-text block text-xs uppercase tracking-wider mb-0.5">
                    {field}
                  </span>
                  {field.toLowerCase().includes('support') || details.includes('9305619') ? (
                    <a
                      href={fullWaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline font-semibold hover:opacity-80"
                    >
                      {details}
                    </a>
                  ) : (
                    <span className="text-text-secondary">{details}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Markdown Body Text formatted as structured blocks with responsive tables */}
          <div className="rounded-2xl border border-separator bg-bg-card p-5 md:p-8 space-y-6">
            {compSection ? (
              <>
                {compSection.before && (
                  <div
                    className="catalogue-content space-y-6"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(compSection.before) }}
                  />
                )}
                <div className="pt-2">
                  <h2 className="text-xl md:text-2xl font-bold text-text mb-3 pt-2 border-t border-separator/40 first:border-t-0 first:pt-0">
                    {compSection.title}
                  </h2>
                  <ComparisonTable
                    caption={compSection.title}
                    headers={compSection.headers}
                    rows={compSection.rows}
                  />
                </div>
                {compSection.after && (
                  <div
                    className="catalogue-content space-y-6"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(compSection.after) }}
                  />
                )}
              </>
            ) : (
              <div
                className="catalogue-content space-y-6"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(cleanedMd) }}
              />
            )}
          </div>

          {/* Second Order Button full-width right after details */}
          <div className="pt-2">
            <a
              href={fullWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-[#25D366] text-white px-6 py-4 rounded-2xl font-bold text-base shadow-sm hover:opacity-95 transition-opacity min-h-[52px]"
            >
              <WhatsAppIcon className="w-5 h-5 mr-2" />
              Order {product.name} on WhatsApp
            </a>
          </div>

          {/* FAQ (Single Heading) */}
          {product.faqs && product.faqs.length > 0 && <Faq items={product.faqs} />}

          {/* Compare Before Buying Callout */}
          <div className="p-4 rounded-xl border border-separator bg-bg-card flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <Scale className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-text">
                Want to compare this plan against other alternatives?
              </span>
            </div>
            <Link
              href="/compare/"
              className="inline-flex items-center text-xs font-bold text-accent hover:underline whitespace-nowrap"
            >
              Compare plans <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Related Plans (Same-brand first, then category alternatives) */}
          <RelatedPlans
            currentSlug={product.slug}
            brandSlug={product.brandSlug}
            categorySlug={product.categorySlug}
            sameBrandPlans={sameBrandPlans}
            sameCategoryPlans={sameCategoryPlans}
          />

          {/* Trust notice */}
          <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p>
              Trust Notice: PakAITools is an independent reseller and is not affiliated with, endorsed by, or officially partnered with this brand. Have questions? Contact WhatsApp Support (
              <a
                href={fullWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline font-semibold hover:opacity-80"
              >
                {SITE.whatsappDisplay}
              </a>
              ) or review our{' '}
              <Link href="/refund-warranty-policy/" className="text-accent underline">
                Refund &amp; Warranty Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Right Column: Desktop Sticky Buy Card */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-20">
          <BuyCard
            planName={product.name}
            price={product.price}
            duration={product.duration}
            warranty={product.warranty}
            accountType={product.accountType}
            deliveryTime={product.deliveryTime}
            slug={product.slug}
            pageUrl={`${SITE.domain}/product/${product.slug}/`}
          />
        </div>
      </div>

      {/* Mobile Sticky Order Bar at Bottom */}
      <StickyOrderBar
        planName={product.name}
        price={product.price}
        duration={product.duration}
        slug={product.slug}
        pageUrl={`${SITE.domain}/product/${product.slug}/`}
      />
    </div>
  );
}
