import React from 'react';
import type { Metadata } from 'next';
import { getSitePages } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schema';
import { renderMarkdown } from '@/lib/markdown';

export const metadata: Metadata = {
  title: 'Refund & Warranty Policy',
  description:
    'Read PakAITools refund and warranty rules. Every plan shows its replacement warranty duration before you pay. Verified replacement and PKR refund policy.',
  alternates: {
    canonical: 'https://pakaitools.store/refund-warranty-policy/',
  },
  openGraph: {
    title: 'Refund & Warranty Policy',
    description:
      'Read PakAITools refund and warranty rules. Every plan shows its replacement warranty duration before you pay. Verified replacement and PKR refund policy.',
    url: 'https://pakaitools.store/refund-warranty-policy/',
    images: ['/og-default.png'],
  },
};

export default function RefundPolicyPage() {
  const page = getSitePages()?.pages?.refund;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Refund & Warranty', url: '/refund-warranty-policy/' },
  ];

  const faqs = (page?.f || []).map(([q, a]: [string, string]) => ({ question: q, answer: a }));

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-8">
      <JsonLd schema={getBreadcrumbSchema(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          {page?.h || 'Refund & Warranty Policy'}
        </h1>
        <p className="text-base text-text-secondary leading-relaxed bg-bg-card p-4 rounded-xl border border-separator">
          {page?.a}
        </p>
      </section>

      <div
        className="catalogue-content rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-4 text-text-secondary text-sm md:text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(page?.c || '') }}
      />

      {faqs.length > 0 && <Faq items={faqs} />}
    </div>
  );
}
