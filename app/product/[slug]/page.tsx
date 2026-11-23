import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getProducts,
  getProductBySlug,
  getCategoryBySlug,
  getBrandHub,
  getProductsByCategory,
} from '@/lib/data';
import { BuyCard } from '@/components/BuyCard';
import { StickyOrderBar } from '@/components/StickyOrderBar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { getProductSchema } from '@/lib/schema';
import { buildWhatsAppLink, getProductWhatsAppMessage } from '@/lib/whatsapp';
import { renderMarkdown } from '@/lib/markdown';
import { WhatsAppIcon } from '@/components/WhatsAppFab';
import { ShieldCheck, ArrowRight, Scale } from 'lucide-react';
import { SITE } from '@/lib/site.config';

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
      title: cleanTitle,
      description: product.metaDesc,
      url: `https://pakaitools.store/product/${product.slug}/`,
      images: ['/og-default.png'],
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

  // Breadcrumbs with proper casing
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    ...(category ? [{ name: category.name, url: `/${category.slug}/` }] : []),
    ...(hasBrandHub && brandHub ? [{ name: brandHub.name.replace(/ Price in Pakistan$/i, ''), url: brandHub.url }] : []),
    { name: product.name, url: `/product/${product.slug}/` },
  ];

  const schema = getProductSchema(product, breadcrumbs);

  // Related plans (up to 3 from same category)
  const relatedPlans = getProductsByCategory(product.categorySlug)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const fullWaLink = buildWhatsAppLink(
    getProductWhatsAppMessage(
      product.name,
      product.price,
      product.duration,
      `${SITE.domain}/product/${product.slug}/`
    )
  );

  // Strip duplicate empty FAQ heading from markdown body
  const cleanedMd = (product.contentMarkdown || '').replace(/##\s*Frequently Asked Questions[\s\S]*$/i, '').trim();
  const htmlContent = renderMarkdown(cleanedMd);

  return (
    <div className="py-2 space-y-6">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Main Grid: Desktop 2 Columns, Mobile 1 Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: H1, Answer, Content, FAQ, Related */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8 min-w-0">
          <header className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text tracking-tight leading-tight">
              {product.h1}
            </h1>

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
            <div
              className="catalogue-content space-y-6"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
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

          {/* Related Plans */}
          {relatedPlans.length > 0 && (
            <section aria-labelledby="related-heading" className="space-y-4 pt-6 border-t border-separator">
              <h2 id="related-heading" className="text-xl font-bold text-text">
                Related Subscriptions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedPlans.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/product/${rp.slug}/`}
                    className="p-4 rounded-xl border border-separator bg-bg-card hover:border-accent transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-xs md:text-sm text-text line-clamp-2 mb-1">
                        {rp.name}
                      </h3>
                      <span className="text-xs text-text-tertiary">{rp.duration}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs font-semibold text-accent">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

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
