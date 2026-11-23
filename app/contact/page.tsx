import React from 'react';
import type { Metadata } from 'next';
import { getSitePages } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/site.config';
import { MessageCircle, Mail } from 'lucide-react';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';

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
  title: 'Contact PakAITools – WhatsApp & Email Support',
  description:
    'Contact PakAITools on WhatsApp (+92 321 9305619) or email support@aitoolspak.com for orders, questions, and warranty assistance.',
  alternates: {
    canonical: 'https://pakaitools.store/contact/',
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
          className="p-6 rounded-2xl border border-separator bg-bg-card hover:border-whatsapp hover:shadow-card transition-all flex items-start space-x-4"
        >
          <div className="w-12 h-12 rounded-xl bg-whatsapp/10 text-whatsapp flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-text text-base">WhatsApp Support</h2>
            <p className="text-xs text-text-tertiary mt-1 mb-2">Fastest response during business hours</p>
            <span className="font-bold text-whatsapp text-sm md:text-base">{SITE.whatsappDisplay}</span>
          </div>
        </a>

        <a
          href={`mailto:${SITE.email}`}
          className="p-6 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all flex items-start space-x-4"
        >
          <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-text text-base">Email Support</h2>
            <p className="text-xs text-text-tertiary mt-1 mb-2">Official support and billing queries</p>
            <span className="font-bold text-accent text-sm md:text-base">{SITE.email}</span>
          </div>
        </a>
      </div>

      <div
        className="rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-4 text-text-secondary text-sm md:text-base leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2"
        dangerouslySetInnerHTML={{ __html: formatMd(page?.c || '') }}
      />
    </div>
  );
}
