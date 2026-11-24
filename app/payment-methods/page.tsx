import React from 'react';
import type { Metadata } from 'next';
import { getSitePages } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbGraphSchema } from '@/lib/schema';
import { renderMarkdown } from '@/lib/markdown';
import { SITE } from '@/lib/site.config';
import { ShieldCheck } from 'lucide-react';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';
import { baseOg } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Payment Methods in Pakistan – JazzCash, EasyPaisa & SadaPay',
  description:
    'Pay for AI tools and subscriptions in Pakistan with JazzCash, EasyPaisa, SadaPay, NayaPay, UBL (bank transfer) and Binance (international). No credit card needed. WhatsApp delivery.',
  alternates: {
    canonical: 'https://pakaitools.store/payment-methods/',
  },
  openGraph: {
    ...baseOg,
    title: 'Payment Methods in Pakistan – JazzCash, EasyPaisa & SadaPay',
    description:
      'Pay for AI tools and subscriptions in Pakistan with JazzCash, EasyPaisa, SadaPay, NayaPay, UBL (bank transfer) and Binance (international). No credit card needed. WhatsApp delivery.',
    url: 'https://pakaitools.store/payment-methods/',
  },
};

export default function PaymentMethodsPage() {
  const page = getSitePages()?.pages?.payment;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Payment Methods', url: '/payment-methods/' },
  ];

  const faqs = (page?.f || []).map(([q, a]: [string, string]) => ({ question: q, answer: a }));

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-8">
      <JsonLd schema={getBreadcrumbGraphSchema(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          {page?.h || 'Payment Methods at PakAITools'}
        </h1>
        <p className="text-base text-text-secondary leading-relaxed bg-bg-card p-4 rounded-xl border border-separator">
          {page?.a || `Pay locally in PKR using ${SITE.paymentMethodsText}. All orders are processed without credit card requirements.`}
        </p>
      </section>

      <div
        className="catalogue-content rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-4 text-text-secondary text-sm md:text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(page?.c || '') }}
      />

      {faqs.length > 0 && <Faq items={faqs} />}

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: Last Updated: November 22, 2026. All payments are verified manually via WhatsApp screenshot transfer. Have questions regarding payments? WhatsApp Support:{' '}
          <a
            href={buildWhatsAppLink(getGeneralWhatsAppMessage('https://pakaitools.store/payment-methods/'))}
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
