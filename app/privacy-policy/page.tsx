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
import { baseOg } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read how PakAITools protects your data. We never retain customer account passwords after provisioning and collect minimal details for order verification.',
  alternates: {
    canonical: 'https://pakaitools.store/privacy-policy/',
  },
  openGraph: {
    ...baseOg,
    title: 'Privacy Policy',
    description:
      'Read how PakAITools protects your data. We never retain customer account passwords after provisioning and collect minimal details for order verification.',
    url: 'https://pakaitools.store/privacy-policy/',
  },
};

export default function PrivacyPolicyPage() {
  const page = getSitePages()?.pages?.privacy;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy-policy/' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-8">
      <JsonLd schema={getBreadcrumbSchema(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          {page?.h || 'Privacy Policy'}
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
          Trust Notice: Last Updated: November 22, 2026. PakAITools respects your privacy and security. Have questions? WhatsApp Support:{' '}
          <a
            href={buildWhatsAppLink(getGeneralWhatsAppMessage('https://pakaitools.store/privacy-policy/'))}
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
