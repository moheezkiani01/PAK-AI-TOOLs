import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getComparisons, getComparisonHub } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { ArrowRight, Scale, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SITE } from '@/lib/site.config';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Compare AI Tools & Subscriptions in Pakistan (2026)',
  description:
    'Compare ChatGPT, Claude, Kling AI, ElevenLabs, Adobe, CapCut, VPNs, Netflix, Spotify & Pakistan eSIM plans side by side in PKR. Local payment & warranty.',
  alternates: {
    canonical: 'https://pakaitools.store/compare/',
  },
  openGraph: {
    title: 'Compare AI Tools & Subscriptions in Pakistan (2026)',
    description:
      'Compare ChatGPT, Claude, Kling AI, ElevenLabs, Adobe, CapCut, VPNs, Netflix, Spotify & Pakistan eSIM plans side by side in PKR. Local payment & warranty.',
    url: 'https://pakaitools.store/compare/',
    images: ['/og-default.png'],
  },
};

export default function CompareHubPage() {
  const hub = getComparisonHub();
  const comparisons = getComparisons();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/compare/' },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://pakaitools.store/compare/#webpage',
        url: 'https://pakaitools.store/compare/',
        name: hub?.title || 'Compare AI Tools & Subscriptions in Pakistan (2026) | PakAITools',
        description: hub?.desc || 'Side-by-side PKR price, duration, warranty, and feature comparisons for digital subscriptions in Pakistan.',
        dateModified: '2026-11-22',
        inLanguage: 'en-PK',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pakaitools.store/' },
          { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://pakaitools.store/compare/' },
        ],
      },
    ],
  };

  // Group comparisons by category
  const categoriesMap = new Map<string, typeof comparisons>();
  for (const item of comparisons) {
    const list = categoriesMap.get(item.category) || [];
    list.push(item);
    categoriesMap.set(item.category, list);
  }

  return (
    <div className="space-y-6 md:space-y-8 py-2 max-w-5xl mx-auto">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero / Header */}
      <section className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          <span>Commercial Investigation Guides</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-text tracking-tight">
          {hub?.h1 || 'Compare AI Tools, Software & Subscriptions in Pakistan (PKR Price & Plan Guide)'}
        </h1>
        <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-3xl">
          {(hub?.intro ||
            'Not sure which AI subscription, creative suite, VPN, or streaming plan fits your budget in Pakistan? Use PakAITools\' side-by-side comparison guides to compare exact PKR prices, durations, warranty terms, device limits, and own-account upgrade vs. ready-account options.').replace(/\*\*/g, '')}
        </p>
      </section>

      {/* Trust Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl border border-separator bg-bg-card text-xs md:text-sm font-semibold text-text-secondary">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
          <span>20 In-Depth Comparisons</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
          <span>Exact PKR Prices &amp; Warranty</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
          <span>Zero USD Card Markup</span>
        </div>
      </div>

      {/* Comparisons Grouped by Category */}
      <div className="space-y-6">
        {Array.from(categoriesMap.entries()).map(([catName, items]) => (
          <section key={catName} className="space-y-3">
            <div className="flex items-center justify-between border-b border-separator pb-2">
              <h2 className="text-xl md:text-2xl font-bold text-text flex items-center space-x-2">
                <span>{catName}</span>
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-bg-subtle text-text-tertiary">
                {items.length} guide{items.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {items.map((comp) => (
                <article
                  key={comp.slug}
                  className="p-5 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">
                      {comp.category}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-text leading-snug mb-2">
                      <Link href={`/compare/${comp.slug}/`} className="hover:text-accent hover:underline">
                        {comp.h1 || comp.seoTitle}
                      </Link>
                    </h3>
                    <p className="text-xs md:text-sm text-text-secondary line-clamp-3 leading-relaxed mb-4">
                      {(comp.verdict || comp.metaDesc)?.replace(/\*\*/g, '')}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-separator/60 flex items-center justify-between">
                    <span className="text-xs text-text-tertiary">
                      {comp.faqs.length} FAQs included
                    </span>
                    <Link
                      href={`/compare/${comp.slug}/`}
                      className="inline-flex items-center text-xs font-bold text-accent hover:underline"
                    >
                      Compare plans <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: PakAITools is an independent reseller and is not affiliated with, endorsed by, or officially partnered with any featured software brand. Have questions? WhatsApp Support:{' '}
          <a
            href={buildWhatsAppLink(getGeneralWhatsAppMessage('https://pakaitools.store/compare/'))}
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
