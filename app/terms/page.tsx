import React from 'react';
import type { Metadata } from 'next';
import { getSitePages } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schema';
import { renderMarkdown } from '@/lib/markdown';
import { ShieldCheck } from 'lucide-react';
import { SITE } from '@/lib/site.config';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'PakAITools terms of service for digital subscriptions, account provisioning, warranty, and customer responsibilities in Pakistan.',
  alternates: {
    canonical: 'https://pakaitools.store/terms/',
  },
  openGraph: {
    title: 'Terms of Service',
    description:
      'PakAITools terms of service for digital subscriptions, account provisioning, warranty, and customer responsibilities in Pakistan.',
    url: 'https://pakaitools.store/terms/',
    images: ['/og-default.png'],
  },
};

export default function TermsPage() {
  const page = getSitePages()?.pages?.terms;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Terms of Service', url: '/terms/' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-8">
      <JsonLd schema={getBreadcrumbSchema(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          {page?.h || 'Terms of Service'}
        </h1>
        <p className="text-base text-text-secondary leading-relaxed bg-bg-card p-4 rounded-xl border border-separator">
          {page?.a}
        </p>
      </section>

      <div
        className="catalogue-content rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-4 text-text-secondary text-sm md:text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(page?.c || '') }}
      />

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: Last Updated: November 22, 2026. PakAITools is an independent reseller. Have questions regarding terms? WhatsApp Support:{' '}
          <a
            href={buildWhatsAppLink(getGeneralWhatsAppMessage('https://pakaitools.store/terms/'))}
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
