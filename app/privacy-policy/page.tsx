import React from 'react';
import type { Metadata } from 'next';
import { getSitePages } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schema';
import { renderMarkdown } from '@/lib/markdown';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read how PakAITools protects your data. We never retain customer account passwords after provisioning and collect minimal details for order verification.',
  alternates: {
    canonical: 'https://pakaitools.store/privacy-policy/',
  },
  openGraph: {
    title: 'Privacy Policy',
    description:
      'Read how PakAITools protects your data. We never retain customer account passwords after provisioning and collect minimal details for order verification.',
    url: 'https://pakaitools.store/privacy-policy/',
    images: ['/og-default.png'],
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
    </div>
  );
}
