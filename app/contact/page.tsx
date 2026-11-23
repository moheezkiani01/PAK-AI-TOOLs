import React from 'react';
import type { Metadata } from 'next';
import { getSitePages } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/site.config';
import { MessageCircle, Mail } from 'lucide-react';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';
import { renderMarkdown } from '@/lib/markdown';

export const metadata: Metadata = {
  title: 'Contact PakAITools – WhatsApp & Email Support',
  description:
    'Contact PakAITools on WhatsApp (+92 321 9305619) or email support@aitoolspak.com for orders, questions, and warranty assistance.',
  alternates: {
    canonical: 'https://pakaitools.store/contact/',
  },
  openGraph: {
    title: 'Contact PakAITools – WhatsApp & Email Support',
    description:
      'Contact PakAITools on WhatsApp (+92 321 9305619) or email support@aitoolspak.com for orders, questions, and warranty assistance.',
    url: 'https://pakaitools.store/contact/',
    images: ['/og-default.png'],
  },
};

export default function ContactPage() {
  const page = getSitePages()?.pages?.contact;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact/' },
  ];

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact PakAITools',
    url: `${SITE.domain}/contact/`,
  };

  const waUrl = buildWhatsAppLink(getGeneralWhatsAppMessage());

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-8">
      <JsonLd schema={contactSchema} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          {page?.h || 'Contact PakAITools'}
        </h1>
        <p className="text-base text-text-secondary leading-relaxed bg-bg-card p-4 rounded-xl border border-separator">
          {page?.a || 'Need help with an order, plan details, or warranty support? Message our team on WhatsApp or send us an email.'}
        </p>
      </section>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-2xl border border-separator bg-bg-card hover:border-accent transition-all flex items-start space-x-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-whatsapp text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-text text-base">WhatsApp Support</h3>
            <p className="text-xs text-text-secondary mt-1">Instant replies for orders &amp; queries</p>
            <span className="text-xs font-bold text-accent mt-2 block">{SITE.whatsappDisplay}</span>
          </div>
        </a>

        <a
          href={`mailto:${SITE.email}`}
          className="p-6 rounded-2xl border border-separator bg-bg-card hover:border-accent transition-all flex items-start space-x-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-accent text-accent-on flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-text text-base">Email Support</h3>
            <p className="text-xs text-text-secondary mt-1">Formal inquiries and agency orders</p>
            <span className="text-xs font-bold text-accent mt-2 block">{SITE.email}</span>
          </div>
        </a>
      </div>

      <div
        className="catalogue-content rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-4 text-text-secondary text-sm md:text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(page?.c || '') }}
      />
    </div>
  );
}
