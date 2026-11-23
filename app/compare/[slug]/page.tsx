import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getComparisons, getComparisonBySlug } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { renderMarkdown } from '@/lib/markdown';
import { buildWhatsAppLink, getComparisonWhatsAppMessage } from '@/lib/whatsapp';
import { SITE } from '@/lib/site.config';
import { ShieldCheck, MessageCircle, ArrowRight, Scale, CheckCircle2 } from 'lucide-react';

interface ComparisonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const comparisons = getComparisons();
  return comparisons.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);

  if (!comp) return {};

  const cleanTitle = (comp.seoTitle || comp.rawTitle || 'Comparison').replace(/\s*\|\s*PakAITools\s*$/i, '');

  return {
    title: cleanTitle,
    description: comp.metaDesc,
    alternates: {
      canonical: `https://pakaitools.store/compare/${comp.slug}/`,
    },
    openGraph: {
      title: cleanTitle,
      description: comp.metaDesc,
      url: `https://pakaitools.store/compare/${comp.slug}/`,
      images: ['/og-default.png'],
    },
  };
}

export default async function ComparisonDetailPage({ params }: ComparisonPageProps) {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);

  if (!comp) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/compare/' },
    { name: comp.rawTitle || comp.seoTitle, url: `/compare/${comp.slug}/` },
  ];

  const fullUrl = `https://pakaitools.store/compare/${comp.slug}/`;
  const waLink = buildWhatsAppLink(getComparisonWhatsAppMessage(comp.seoTitle, fullUrl));

  const schema = comp.schema || {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: comp.h1,
        datePublished: '2026-11-22',
        dateModified: '2026-11-22',
        author: { '@type': 'Organization', name: SITE.name },
        publisher: { '@type': 'Organization', name: SITE.name, url: SITE.domain },
        mainEntityOfPage: fullUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: `${SITE.domain}${b.url}`,
        })),
      },
    ],
  };

  const bodyHtml = renderMarkdown(comp.contentMarkdown);

  return (
    <article className="space-y-8 py-2 max-w-4xl mx-auto">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          <span>{comp.category} Comparison</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text tracking-tight leading-tight">
          {comp.h1}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
          <span>Last Updated: November 22, 2026</span>
          <span>·</span>
          <span>Local PKR Payment &amp; Warranty</span>
        </div>
      </header>

      {/* Answer-First Verdict Snippet */}
      {comp.verdict && (
        <div className="p-5 md:p-6 rounded-2xl bg-accent-soft/40 border border-accent/30 space-y-2">
          <div className="flex items-center space-x-2 text-accent font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Answer-First Verdict</span>
          </div>
          <p className="text-sm md:text-base text-text font-medium leading-relaxed">
            {comp.verdict}
          </p>
        </div>
      )}

      {/* WhatsApp Quick Consultation Bar */}
      <div className="p-4 rounded-xl border border-separator bg-bg-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs md:text-sm text-text-secondary text-center sm:text-left">
          Need personalized help deciding between these plans?
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-[#25D366] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xs hover:opacity-95 transition-opacity min-h-[40px] whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 mr-1.5" />
          Ask on WhatsApp
        </a>
      </div>

      {/* Structured Content & Tables */}
      <div
        className="catalogue-content space-y-6"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />

      {/* FAQs */}
      {comp.faqs && comp.faqs.length > 0 && <Faq items={comp.faqs} />}

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: Last Updated: November 22, 2026. PakAITools is an independent reseller and is not affiliated with, endorsed by, or officially partnered with any brand compared on this page. Review our{' '}
          <Link href="/refund-warranty-policy/" className="text-accent underline">
            Refund &amp; Warranty Policy
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
