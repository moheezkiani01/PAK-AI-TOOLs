import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { getGeneralFaq } from '@/lib/faq';
import { ChevronDown, MessageCircle, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppFab';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';
import { SITE } from '@/lib/site.config';
import { baseOg } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'FAQs: Buying, Delivery and Warranty in Pakistan',
  description:
    'Frequently asked questions about buying AI tools, software subscriptions, VPNs, and streaming plans in Pakistan. Local PKR payments via JazzCash, EasyPaisa, SadaPay & Raast.',
  alternates: {
    canonical: 'https://pakaitools.store/faqs/',
  },
  openGraph: {
    ...baseOg,
    title: 'FAQs: Buying, Delivery and Warranty in Pakistan | PakAITools',
    description:
      'Frequently asked questions about buying AI tools, software subscriptions, VPNs, and streaming plans in Pakistan. Local PKR payments via JazzCash, EasyPaisa, SadaPay & Raast.',
    url: 'https://pakaitools.store/faqs/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQs: Buying, Delivery and Warranty in Pakistan | PakAITools',
    description:
      'Frequently asked questions about buying AI tools, software subscriptions, VPNs, and streaming plans in Pakistan. Local PKR payments via JazzCash, EasyPaisa, SadaPay & Raast.',
  },
};

export default function FaqsPage() {
  const faqGeneral = getGeneralFaq();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'FAQs', url: '/faqs/' },
  ];

  // Group the 22 general FAQs by group field
  const groups: { [key: string]: typeof faqGeneral.faqs } = {};
  for (const f of faqGeneral.faqs) {
    const g = f.group || 'General Questions';
    if (!groups[g]) groups[g] = [];
    groups[g].push(f);
  }

  const groupOrder = [
    'Ordering & payment',
    'Delivery & account types',
    'Warranty & refunds',
    'Using plans in Pakistan',
    'Support & trust',
    'Roman Urdu',
  ];

  const sortedGroups = Object.keys(groups).sort((a, b) => {
    const idxA = groupOrder.indexOf(a);
    const idxB = groupOrder.indexOf(b);
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
  });

  const fullWaLink = buildWhatsAppLink(getGeneralWhatsAppMessage());

  return (
    <div className="py-2 space-y-8 max-w-4xl mx-auto">
      <JsonLd schema={faqGeneral.jsonld} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header with single H1 */}
      <header className="space-y-4">
        <h1
          id="faq-title"
          className="text-3xl md:text-4xl lg:text-5xl font-black text-text tracking-tight leading-tight"
        >
          PakAITools FAQs: Buying, Delivery and Warranty in Pakistan
        </h1>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed">
          Everything you need to know about purchasing AI tools, creative suites, streaming subscriptions, and developer accounts in Pakistan. Pay locally in PKR with no international credit card required.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary pt-2 border-t border-separator">
          <span>{faqGeneral.faqs.length} Verified Questions &amp; Answers</span>
          <span>·</span>
          <span>Last reviewed: November 26, 2026</span>
          <span>·</span>
          <span className="flex items-center text-accent font-medium">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Verified PKR Reseller
          </span>
        </div>
      </header>

      {/* FAQs Section grouped by category */}
      <section id="faq" aria-labelledby="faq-title" className="space-y-8">
        {sortedGroups.map((groupName) => {
          const items = groups[groupName];
          return (
            <div key={groupName} className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-text border-b border-separator pb-2">
                {groupName}
              </h2>
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const isRomanUrdu = item.lang === 'ru' || item.lang === 'ur-Latn';
                  return (
                    <details
                      key={idx}
                      lang={isRomanUrdu ? 'ur-Latn' : undefined}
                      className="group rounded-xl border border-separator bg-bg-card p-4 transition-colors open:bg-bg-subtle"
                    >
                      <summary className="flex items-center justify-between font-semibold text-text cursor-pointer list-none py-1 min-h-[36px]">
                        <span>{item.q}</span>
                        <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-200 group-open:rotate-180 text-text-tertiary flex-shrink-0" />
                      </summary>
                      <p className="mt-3 pt-3 border-t border-separator text-sm text-text-secondary leading-relaxed">
                        {item.a}
                      </p>
                    </details>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Support Callout Banner */}
      <div className="rounded-2xl border border-separator bg-bg-card p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-text">Still have questions?</h2>
        <p className="text-sm text-text-secondary max-w-lg mx-auto">
          Our team is available on WhatsApp daily to confirm stock, pricing, and account setups before you pay.
        </p>
        <div>
          <a
            href={fullWaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#25D366] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm hover:opacity-95 transition-opacity min-h-[48px]"
          >
            <WhatsAppIcon className="w-4 h-4 mr-2" />
            Chat with Support ({SITE.whatsappDisplay})
          </a>
        </div>
      </div>
    </div>
  );
}
