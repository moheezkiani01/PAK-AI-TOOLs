import React from 'react';
import type { Metadata } from 'next';
import { getSitePages } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schema';

function formatMd(md: string): string {
  if (!md) return '';
  return md
    .replace(/^## (.*$)/gim, '<h2 class="text-xl md:text-2xl font-bold text-text mt-8 mb-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-text mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-accent underline">$1</a>')
    .replace(/\n\n/g, '<br/><br/>');
}

export const metadata: Metadata = {
  title: 'Privacy Policy | PakAITools',
  description:
    'Read how PakAITools protects your data. We never retain customer account passwords after provisioning and collect minimal details for order verification.',
  alternates: {
    canonical: 'https://pakaitools.store/privacy-policy/',
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
          {page?.a || 'PakAITools is committed to protecting your privacy and treating your personal information with strict security.'}
        </p>
      </section>

      <div
        className="rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-4 text-text-secondary text-sm md:text-base leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2"
        dangerouslySetInnerHTML={{ __html: formatMd(page?.c || '') }}
      />
    </div>
  );
}
