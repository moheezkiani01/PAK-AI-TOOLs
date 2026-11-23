import React from 'react';
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
import { getCategories, getProducts, getSitePages, getBlogPosts, getNewsArticles } from '@/lib/data';
import { CategoryCard } from '@/components/CategoryCard';
import { PlanRow } from '@/components/PlanRow';
import { Faq } from '@/components/Faq';
import { HeroSearch } from '@/components/HeroSearch';
import { WhatsAppIcon } from '@/components/WhatsAppFab';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';
import { SITE } from '@/lib/site.config';

export default function HomePage() {
  const categories = getCategories();
  const products = getProducts();
  const sitePages = getSitePages();
  const blogPosts = getBlogPosts();
  const news = getNewsArticles();

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
  // Recent News for Homepage
  const recentNews = news.slice(0, 3);

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

  return (
    <div className="space-y-8 md:space-y-10 py-2">
      {/* 1. Hero Section (Above the fold) */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-2 md:pt-4">
        <h1 className="text-3xl md:text-5xl font-black text-text tracking-tight leading-tight">
          {h1Text}
        </h1>
        <p className="text-base md:text-lg text-text-secondary leading-relaxed">
          {answerText}
        </p>

        {/* Quick Instant Search Box */}
        <HeroSearch />

        {/* Primary & Secondary Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/price-list/"
            className="bg-accent text-accent-on px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm hover:opacity-95 transition-all hover:-translate-y-0.5 active:translate-y-0 min-h-[48px] flex items-center"
          >
            Browse all 231 plans
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
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-4 text-xs font-semibold text-text-secondary">
          <div className="flex items-center space-x-1.5">
            <CreditCard className="w-4 h-4 text-accent" />
            <span>Pay in PKR locally</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-accent" />
            <span>Delivery in 15 minutes</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Warranty shown upfront</span>
          </div>
        </div>
      </section>

      {/* 2. Browse Categories Section */}
      <section aria-labelledby="categories-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-separator pb-3 gap-2">
          <div>
            <h2 id="categories-heading" className="text-2xl md:text-3xl font-bold text-text">
              Browse Categories
            </h2>
            <p className="text-xs md:text-sm text-text-secondary mt-0.5">
              15 specialized hubs for creators, developers, students, and businesses
            </p>
          </div>
          <Link
            href="/categories/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle text-xs md:text-sm font-semibold text-text hover:text-accent transition-colors min-h-[40px]"
          >
            View all 15 <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. Popular Subscriptions in Pakistan */}
      <section aria-labelledby="popular-heading" className="space-y-4">
        <div className="flex items-end justify-between border-b border-separator pb-3">
          <div>
            <h2 id="popular-heading" className="text-2xl font-bold text-text">
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
      </section>

      {/* 4. NEW: Blog & AI News Section */}
      <section aria-labelledby="blog-news-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-separator pb-3 gap-2">
          <div>
            <h2 id="blog-news-heading" className="text-2xl md:text-3xl font-bold text-text">
              Latest Guides &amp; AI News
            </h2>
            <p className="text-xs md:text-sm text-text-secondary mt-0.5">
              Price breakdowns, buying advice, and verified developments for Pakistani digital workers
            </p>
          </div>
          <Link
            href="/blog/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle text-xs md:text-sm font-semibold text-text hover:text-accent transition-colors min-h-[40px]"
          >
            View all posts <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* Guides Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {recentGuides.map((guide) => (
            <article
              key={guide.slug}
              className="p-5 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-text-tertiary mb-2">
                  <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-accent-soft text-accent font-bold">
                    Guide
                  </span>
                  <span>·</span>
                  <time dateTime={guide.date || '2026-11-22'}>{guide.date || '2026-11-22'}</time>
                </div>
                <h3 className="text-base font-bold text-text leading-snug mb-2 line-clamp-2">
                  <Link href={`/blog/${guide.slug}/`} className="hover:text-accent hover:underline">
                    {guide.h1 || guide.seoTitle || guide.title}
                  </Link>
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4">
                  {(guide.summary || guide.metaDesc || guide.desc)?.replace(/\*\*/g, '')}
                </p>
              </div>
              <Link
                href={`/blog/${guide.slug}/`}
                className="inline-flex items-center text-xs font-bold text-accent hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>

        {/* AI News Subsection if news exists */}
        {recentNews.length > 0 && (
          <div className="pt-3 space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-text">
              <Newspaper className="w-4 h-4 text-accent" />
              <span>Trending in AI</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {recentNews.map((item) => (
                <article
                  key={item.slug}
                  className="p-4 rounded-xl border border-separator bg-bg-subtle/60 hover:border-accent transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2 text-[11px] text-text-tertiary mb-1.5">
                      <time dateTime={item.date}>{item.date}</time>
                      <span>·</span>
                      <span className="font-semibold text-accent">{item.tags[0]}</span>
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-text leading-snug mb-1.5 line-clamp-2">
                      <Link href={`/blog/news/${item.slug}/`} className="hover:text-accent hover:underline">
                        {item.title}
                      </Link>
                    </h4>
                    <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed mb-2">
                      {item.summary?.replace(/\*\*/g, '')}
                    </p>
                  </div>
                  <Link
                    href={`/blog/news/${item.slug}/`}
                    className="inline-flex items-center text-[11px] font-bold text-accent hover:underline"
                  >
                    Read story →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 5. How Ordering Works (3 Steps) */}
      <section aria-labelledby="how-it-works-heading" className="rounded-3xl border border-separator bg-bg-card p-6 md:p-8 space-y-5">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 id="how-it-works-heading" className="text-2xl md:text-3xl font-bold text-text">
            How Ordering Works
          </h2>
          <p className="text-xs md:text-sm text-text-secondary">
            Simple 3-step local checkout via WhatsApp in under 15 minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-bg-subtle">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-on font-bold flex items-center justify-center mb-3 text-sm">
              1
            </div>
            <h3 className="font-bold text-text text-base mb-1">Pick a Plan</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Choose your product, check duration, device limit, and warranty on the plan page.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-bg-subtle">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-on font-bold flex items-center justify-center mb-3 text-sm">
              2
            </div>
            <h3 className="font-bold text-text text-base mb-1">Pay in PKR</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Transfer locally using JazzCash, EasyPaisa, SadaPay, NayaPay, or Binance Pay.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-bg-subtle">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-on font-bold flex items-center justify-center mb-3 text-sm">
              3
            </div>
            <h3 className="font-bold text-text text-base mb-1">Get Fast Delivery</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Receive login credentials or invite link privately on WhatsApp within 15 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Local Payment Options */}
      <section aria-labelledby="payment-heading" className="space-y-4">
        <h2 id="payment-heading" className="text-xl font-bold text-text">
          Local Pakistani Payment Options
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {SITE.paymentMethods.map((method) => (
            <div
              key={method}
              className="p-3 rounded-xl border border-separator bg-bg-card text-center font-semibold text-xs text-text flex items-center justify-center"
            >
              {method}
            </div>
          ))}
        </div>
        <div className="text-right">
          <Link href="/payment-methods/" className="text-xs text-accent font-semibold hover:underline">
            Read full payment instructions →
          </Link>
        </div>
      </section>

      {/* 7. Frequently Asked Questions */}
      <Faq items={homeFaqs} />

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: PakAITools is an independent reseller providing digital subscriptions in Pakistan with instant WhatsApp delivery and verified warranty. Have questions? WhatsApp Support:{' '}
          <a
            href={buildWhatsAppLink(getGeneralWhatsAppMessage('https://pakaitools.store/'))}
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
