import React from 'react';
import Link from 'next/link';
import { Search, MessageCircle, ShieldCheck, Clock, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getCategories, getProducts, getSitePages } from '@/lib/data';
import { CategoryCard } from '@/components/CategoryCard';
import { PlanRow } from '@/components/PlanRow';
import { Faq } from '@/components/Faq';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';
import { SITE } from '@/lib/site.config';

export default function HomePage() {
  const categories = getCategories();
  const products = getProducts();
  const sitePages = getSitePages();

  const h1Text = sitePages?.home?.h || 'AI Tools & Digital Subscriptions in Pakistan, Priced in PKR';
  const answerText = sitePages?.home?.a ||
    'PakAITools is an independent Pakistani store for AI tools, design software, VPNs, streaming and learning subscriptions. Every plan is priced in PKR, shows its warranty before you buy, and can be paid with JazzCash, EasyPaisa, SadaPay, NayaPay, Raast or Binance. Orders are delivered within 15 minutes after payment verification.';

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

  const homeFaqs = [
    {
      question: 'Do I need an international credit card to order?',
      answer: 'No. You can pay in Pakistani Rupees (PKR) using local payment options including JazzCash, EasyPaisa, SadaPay, NayaPay, Raast, or Binance without any international card fees.',
    },
    {
      question: 'How fast will my subscription be delivered?',
      answer: 'Most ready plans are delivered via WhatsApp within 15 minutes after your payment is verified during normal operating hours. Made-to-order subscriptions are prepared fresh.',
    },
    {
      question: 'What happens if my subscription stops working?',
      answer: 'Every plan displays its clear warranty period before you pay. If an access issue occurs on our side during your warranty term, contact WhatsApp support with a screenshot and we will restore or replace your account promptly.',
    },
    {
      question: 'Is PakAITools affiliated with official providers?',
      answer: 'No. PakAITools is an independent reseller providing digital subscription accounts and vouchers for Pakistani users. We are not officially affiliated with or endorsed by Adobe, Netflix, OpenAI, or Canva.',
    },
    {
      question: 'Can I pay using cryptocurrencies or Binance Pay?',
      answer: 'Yes. Customers outside Pakistan or those who prefer crypto can select USD to pay via Binance Pay (USDT). Message our WhatsApp support for quick Binance Pay details.',
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4 md:pt-8">
        <h1 className="text-3xl md:text-5xl font-black text-text tracking-tight leading-tight">
          {h1Text}
        </h1>
        <p className="text-base md:text-lg text-text-secondary leading-relaxed">
          {answerText}
        </p>

        {/* Quick Search Box linking to price-list */}
        <form action="/price-list/" method="GET" className="max-w-md mx-auto relative mt-4">
          <input
            type="search"
            name="q"
            placeholder="Search 231 plans (e.g. Canva, ChatGPT, Adobe)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-separator bg-bg-card text-text placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent min-h-[48px] shadow-sm text-sm"
          />
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-text-tertiary" aria-hidden="true" />
        </form>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/price-list/"
            className="bg-accent text-accent-on px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:opacity-95 transition-opacity min-h-[44px] flex items-center"
          >
            Browse all 231 plans
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <a
            href={buildWhatsAppLink(getGeneralWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-bg-card text-text border border-separator hover:border-accent px-5 py-3 rounded-xl font-semibold text-sm shadow-xs transition-colors min-h-[44px] flex items-center"
          >
            <MessageCircle className="w-4 h-4 mr-2 text-whatsapp" />
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

      {/* 15 Categories Grid */}
      <section aria-labelledby="categories-heading" className="space-y-6">
        <div className="flex items-end justify-between border-b border-separator pb-4">
          <div>
            <h2 id="categories-heading" className="text-2xl font-bold text-text">
              Browse Categories
            </h2>
            <p className="text-xs md:text-sm text-text-secondary mt-1">
              15 specialized hubs for creators, developers, students, and businesses
            </p>
          </div>
          <Link
            href="/categories/"
            className="text-xs md:text-sm font-semibold text-accent hover:underline flex items-center"
          >
            View all 15 <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* Popular Plans */}
      <section aria-labelledby="popular-heading" className="space-y-6">
        <div className="flex items-end justify-between border-b border-separator pb-4">
          <div>
            <h2 id="popular-heading" className="text-2xl font-bold text-text">
              Popular Subscriptions in Pakistan
            </h2>
            <p className="text-xs md:text-sm text-text-secondary mt-1">
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

        <div className="space-y-3">
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

      {/* How Ordering Works (3 Steps) */}
      <section aria-labelledby="how-it-works-heading" className="rounded-3xl border border-separator bg-bg-card p-6 md:p-10 space-y-8">
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
              Choose your product, check the duration, device limit, and warranty on the plan page.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-bg-subtle">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-on font-bold flex items-center justify-center mb-3 text-sm">
              2
            </div>
            <h3 className="font-bold text-text text-base mb-1">Pay in PKR</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Transfer locally using JazzCash, EasyPaisa, SadaPay, Raast, or Binance Pay.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-bg-subtle">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-on font-bold flex items-center justify-center mb-3 text-sm">
              3
            </div>
            <h3 className="font-bold text-text text-base mb-1">Get Fast Delivery</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Receive login details or invite link privately on WhatsApp within 15 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section aria-labelledby="payment-heading" className="space-y-4">
        <h2 id="payment-heading" className="text-xl font-bold text-text">
          Local Pakistani Payment Options
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {['JazzCash', 'EasyPaisa', 'SadaPay', 'NayaPay', 'Raast Transfer', 'Binance (USDT)'].map((method) => (
            <div
              key={method}
              className="p-3 rounded-xl border border-separator bg-bg-card text-center font-semibold text-xs text-text"
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

      {/* Frequently Asked Questions */}
      <Faq items={homeFaqs} />
    </div>
  );
}
