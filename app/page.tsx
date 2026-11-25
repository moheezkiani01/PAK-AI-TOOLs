import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Search,
  MessageCircle,
  ShieldCheck,
  Clock,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Newspaper,
  BookOpen,
} from 'lucide-react';
import { getProducts, getSitePages, getBlogPosts } from '@/lib/data';
import { PlanRow } from '@/components/PlanRow';
import { Faq } from '@/components/Faq';
import { HeroSearch } from '@/components/HeroSearch';
import { AINewsSection } from '@/components/AINewsSection';
import { WhatsAppIcon } from '@/components/WhatsAppFab';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';
import { SITE } from '@/lib/site.config';
import { baseOg } from '@/lib/seo';
import {
  getBrandGridData,
  getLastPriceUpdate,
  getBrandGridJsonLd,
} from '@/lib/brand-grid';
import { CategoryBrandSection } from '@/components/CategoryBrandSection';
import { JsonLd } from '@/components/JsonLd';
import { getFaqSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'AI Tools & Digital Subscriptions in Pakistan | PakAITools',
  description:
    'Buy AI tools, VPNs, design apps and streaming plans in Pakistan at fixed PKR prices. Pay via JazzCash, EasyPaisa or SadaPay. Fast delivery.',
  alternates: {
    canonical: 'https://pakaitools.store/',
  },
  openGraph: {
    ...baseOg,
    title: 'AI Tools & Digital Subscriptions in Pakistan | PakAITools',
    description:
      'Buy AI tools, VPNs, design apps and streaming plans in Pakistan at fixed PKR prices. Pay via JazzCash, EasyPaisa or SadaPay. Fast delivery.',
    url: 'https://pakaitools.store/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools & Digital Subscriptions in Pakistan | PakAITools',
    description:
      'Buy AI tools, VPNs, design apps and streaming plans in Pakistan at fixed PKR prices. Pay via JazzCash, EasyPaisa or SadaPay. Fast delivery.',
    images: ['https://pakaitools.store/og-default.png'],
  },
};

export default function HomePage() {
  const products = getProducts();
  const sitePages = getSitePages();
  const blogPosts = getBlogPosts();

  const h1Text = sitePages?.home?.h || 'AI Tools & Digital Subscriptions in Pakistan, Priced in PKR';
  const answerText =
    sitePages?.home?.a ||
    `PakAITools is an independent Pakistani store for AI tools, design software, VPNs, streaming and learning subscriptions. Every plan is priced in PKR, shows its warranty before you buy, and can be paid with ${SITE.paymentMethodsText}. Orders are delivered within 15 minutes after payment verification.`;

  // Select popular plans
  const popularSlugs = [
    'canva-pro-1-year',
    'adobe-creative-cloud-pro-4-months',
    'chatgpt-plus-shared-1-month',
    'netflix-1-month',
    'spotify-premium-1-month',
    'capcut-pro-vip-12-months',
    'duolingo-super-12-months',
    'expressvpn-1-month',
  ];
  const popularPlans = popularSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as typeof products;

  // Recent Guides for Homepage
  const recentGuides = blogPosts.slice(0, 3);

  const homeFaqs = [
    {
      question: 'Do I need an international credit card to order?',
      answer: `No. You can pay in Pakistani Rupees (PKR) using local payment options including ${SITE.paymentMethodsText} without any international card fees or foreign exchange markups.`,
    },
    {
      question: 'How fast will my subscription be delivered?',
      answer:
        'Most ready plans are delivered via WhatsApp within 15 minutes after your payment is verified during normal operating hours. Made-to-order subscriptions are prepared fresh.',
    },
    {
      question: 'What happens if my subscription stops working?',
      answer:
        'Every plan displays its clear warranty period before you pay. If an access issue occurs on our side during your warranty term, contact WhatsApp support with a screenshot and we will restore or replace your account promptly.',
    },
    {
      question: 'Is PakAITools affiliated with official providers?',
      answer:
        'No. PakAITools is an independent reseller providing digital subscription accounts and vouchers for Pakistani users. We are not officially affiliated with or endorsed by Adobe, Netflix, OpenAI, or Canva.',
    },
    {
      question: 'Can I pay using cryptocurrencies or Binance Pay?',
      answer:
        'Yes. Customers outside Pakistan or those who prefer crypto can select USD to pay via Binance Pay (USDT). Message our WhatsApp support for quick Binance Pay details.',
    },
  ];

  // All 15 Categories & All Plans
  const brandGridGroups = getBrandGridData();
  const priceUpdate = getLastPriceUpdate();
  const brandGridJsonLd = getBrandGridJsonLd(brandGridGroups);
  const homeFaqJsonLd = getFaqSchema(homeFaqs);

  const homeGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      ...brandGridJsonLd,
      ...(homeFaqJsonLd ? [homeFaqJsonLd] : []),
    ],
  };

  return (
    <div className="space-y-8 md:space-y-10 py-2">
      <JsonLd data={homeGraph} />

      {/* 1. Hero Section (Above the fold) */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-2 md:pt-4">
        <h1 className="text-3xl md:text-5xl font-black text-text tracking-tight leading-tight">
          {h1Text}
        </h1>
        <p className="text-base md:text-lg text-text-secondary leading-relaxed">
          {answerText}
        </p>

        {/* Quick Instant Search Box */}
        <div className="pt-2">
          <HeroSearch />
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            href="/price-list/"
            className="bg-accent text-accent-on px-6 py-3.5 rounded-xl font-bold text-sm shadow-card hover:opacity-95 transition-all hover:-translate-y-0.5 active:translate-y-0 min-h-[48px] flex items-center"
          >
            <span>Browse Full Price List</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <a
            href={buildWhatsAppLink(getGeneralWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-5 py-3.5 rounded-xl font-bold text-sm shadow-xs hover:opacity-95 transition-all hover:-translate-y-0.5 active:translate-y-0 min-h-[48px] flex items-center"
          >
            <WhatsAppIcon className="w-4 h-4 mr-2" />
            Ask on WhatsApp
          </a>
        </div>

        {/* Trust Chips */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 md:gap-8 pt-3 sm:pt-4 text-xs font-semibold text-text-secondary">
          <div className="flex items-center space-x-1.5">
            <CreditCard className="w-4 h-4 text-accent flex-shrink-0" />
            <span>Pay in PKR locally</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-accent flex-shrink-0" />
            <span>Delivery in 15 minutes</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0" />
            <span>Warranty shown upfront</span>
          </div>
        </div>
      </section>

      {/* 2. All 15 Categories & Verified Plans Grid */}
      <div className="space-y-6 sm:space-y-8 md:space-y-10">
        {/* Verification & Trust Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-2xl border border-separator bg-bg-card/70 text-xs text-text-secondary gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span>
              Prices verified &amp; updated:{' '}
              <time dateTime={priceUpdate.dateIso} className="font-semibold text-text">
                {priceUpdate.dateDisplay}
              </time>
            </span>
          </div>
          <p className="text-text-tertiary text-[11px] sm:text-xs">
            PakAITools is an independent reseller and is not affiliated with OpenAI, Google, Anthropic, xAI or other brand owners.
          </p>
        </div>

        {/* All 15 Category Sections */}
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {brandGridGroups.map((group, idx) => (
            <CategoryBrandSection
              key={group.slug}
              group={group}
              isFirstCategory={idx === 0}
            />
          ))}
        </div>
      </div>

      {/* 3. Popular Subscriptions in Pakistan */}
      <section aria-labelledby="popular-heading" className="space-y-4">
        <div className="flex items-end justify-between border-b border-separator pb-3">
          <div>
            <h2 id="popular-heading" className="text-xl sm:text-2xl font-bold text-text">
              Popular Subscriptions in Pakistan
            </h2>
            <p className="text-xs md:text-sm text-text-secondary mt-0.5">
              Most requested AI, creative, and entertainment plans with verified warranty
            </p>
          </div>
          <Link
            href="/price-list/"
            className="text-xs md:text-sm font-semibold text-accent hover:underline flex items-center"
          >
            Full Price List <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {popularPlans.map((p) => (
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
        </div>
        <p className="text-xs text-text-tertiary text-center sm:text-left mt-2">
          *USD equivalent is approximate, based on a reference rate of $1 = Rs. 280. All orders are billed in fixed Pakistani Rupees (PKR).
        </p>
      </section>

      {/* 4. Breaking AI News Section */}
      <AINewsSection />

      {/* 5. Blog Guides Section */}
      <section aria-labelledby="blog-news-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-separator pb-3 gap-2">
          <div>
            <h2 id="blog-news-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-text">
              Latest Buying Guides &amp; Pricing Breakdowns
            </h2>
            <p className="text-xs md:text-sm text-text-secondary mt-0.5">
              Price breakdowns, buying advice, and verified subscription tips for Pakistani digital workers
            </p>
          </div>
          <Link
            href="/blog/"
            className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle text-xs md:text-sm font-semibold text-text hover:text-accent transition-colors min-h-[34px] sm:min-h-[40px] flex-shrink-0 self-start sm:self-auto"
          >
            View all posts <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* Guides Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {recentGuides.map((guide) => (
            <article
              key={guide.slug}
              className="p-4 sm:p-5 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-text-tertiary mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-accent" />
                  <span>Buying Guide</span>
                </div>
                <h3 className="font-bold text-base md:text-lg text-text mb-2 line-clamp-2">
                  {guide.title}
                </h3>
                <p className="text-xs md:text-sm text-text-secondary line-clamp-3 mb-4 leading-relaxed">
                  {(guide.desc || guide.summary || guide.metaDesc)?.replace(/\*\*/g, '')}
                </p>
              </div>
              <Link
                href={`/blog/${guide.slug}/`}
                className="text-xs md:text-sm font-semibold text-accent hover:underline inline-flex items-center mt-auto"
              >
                Read full guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section aria-labelledby="faq-heading" className="space-y-4">
        <div className="border-b border-separator pb-3">
          <h2 id="faq-heading" className="text-2xl font-bold text-text">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Everything you need to know about purchasing verified digital subscriptions in Pakistan
          </p>
        </div>

        <Faq items={homeFaqs} />
      </section>
    </div>
  );
}
