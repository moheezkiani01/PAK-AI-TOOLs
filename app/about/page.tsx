import React from 'react';
import type { Metadata } from 'next';
import { getSitePages } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/site.config';
import { renderMarkdown } from '@/lib/markdown';
import { ShieldCheck } from 'lucide-react';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'About PakAITools – AI Tools & Subscriptions in PKR',
  description:
    'Learn about PakAITools, founded by Moheez Kiani to provide affordable AI software, design subscriptions, and VPNs in Pakistan with PKR payments.',
  alternates: {
    canonical: 'https://pakaitools.store/about/',
  },
  openGraph: {
    title: 'About PakAITools – AI Tools & Subscriptions in PKR',
    description:
      'Learn about PakAITools, founded by Moheez Kiani to provide affordable AI software, design subscriptions, and VPNs in Pakistan with PKR payments.',
    url: 'https://pakaitools.store/about/',
    images: ['/og-default.png'],
  },
};

export default function AboutPage() {
  const page = getSitePages()?.pages?.about;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about/' },
  ];

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About PakAITools',
    url: `${SITE.domain}/about/`,
    mainEntity: {
      '@type': 'Person',
      name: SITE.founder,
      jobTitle: 'Founder',
    },
  };

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-8">
      <JsonLd schema={aboutSchema} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          {page?.h || 'About PakAITools'}
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
          Trust Notice: PakAITools is founded by {SITE.founder} to provide secure, local software access across Pakistan. Have questions? WhatsApp Support:{' '}
          <a
            href={buildWhatsAppLink(getGeneralWhatsAppMessage('https://pakaitools.store/about/'))}
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
