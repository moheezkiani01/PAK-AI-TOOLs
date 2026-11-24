import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPosts, getBlogPostBySlug, getProductBySlug } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { renderMarkdown } from '@/lib/markdown';
import { buildWhatsAppLink, getBlogWhatsAppMessage } from '@/lib/whatsapp';
import { SITE } from '@/lib/site.config';
import { ShieldCheck, MessageCircle, Calendar, BookOpen, CheckCircle2 } from 'lucide-react';
import { baseOg } from '@/lib/seo';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) return {};

  const rawTitle = post.seoTitle || post.title || 'Buying Guide';
  const cleanTitle = rawTitle.replace(/\s*\|\s*PakAITools\s*$/i, '');
  const desc = post.metaDesc || post.desc || '';

  return {
    title: cleanTitle,
    description: desc,
    alternates: {
      canonical: `https://pakaitools.store/blog/${post.slug}/`,
    },
    openGraph: {
      ...baseOg,
      title: cleanTitle,
      description: desc,
      url: `https://pakaitools.store/blog/${post.slug}/`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const title = post.seoTitle || post.title || 'Buying Guide';
  const h1Text = post.h1 || post.title || title;
  const summaryText = post.summary || post.ans || '';
  const postDate = post.date || '2026-11-22';
  const fullUrl = `https://pakaitools.store/blog/${post.slug}/`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog/' },
    { name: title, url: `/blog/${post.slug}/` },
  ];

  const waLink = buildWhatsAppLink(getBlogWhatsAppMessage(title, fullUrl));

  // Build FAQs array
  let faqs: Array<{ question: string; answer: string }> = [];
  if (post.faqs && Array.isArray(post.faqs)) {
    faqs = post.faqs;
  } else if (post.faq && Array.isArray(post.faq)) {
    faqs = post.faq.map(([q, a]) => ({ question: q, answer: a }));
  }

  // Schema: BlogPosting + Breadcrumbs + FAQ
  const schema = post.schema || {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: h1Text,
    description: post.metaDesc || post.desc || summaryText,
    image: `${SITE.domain}/og-default.png`,
    author: {
      '@type': 'Person',
      name: SITE.founder,
      url: `${SITE.domain}/about/`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE.domain}/logo-512.png`,
      },
    },
    datePublished: postDate,
    dateModified: postDate,
    mainEntityOfPage: fullUrl,
  };

  // Substitute shortcodes if legacy evergreen post
  let rawBody = post.contentMarkdown || post.md || '';
  if (post.plans && Array.isArray(post.plans)) {
    const linkedPlans = post.plans
      .map((s) => getProductBySlug(s))
      .filter(Boolean) as Array<NonNullable<ReturnType<typeof getProductBySlug>>>;

    linkedPlans.forEach((p) => {
      rawBody = rawBody
        .replace(new RegExp(`{{price:${p.slug}}}`, 'g'), p.price ? `Rs. ${p.price.toLocaleString('en-PK')}` : 'Live quote')
        .replace(new RegExp(`{{pm:${p.slug}:(\\d+)}}`, 'g'), (_, div) => {
          if (!p.price) return 'Live quote';
          const perMonth = Math.round(p.price / parseInt(div, 10));
          return `Rs. ${perMonth.toLocaleString('en-PK')}`;
        });
    });
  }

  const bodyHtml = renderMarkdown(rawBody);

  return (
    <article className="space-y-6 py-2 max-w-4xl mx-auto">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{post.type === 'howto' ? 'Practical Tutorial' : '2026 Buying Guide'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text tracking-tight leading-tight">
          {h1Text}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Last Updated: {postDate}
          </span>
          <span>·</span>
          <span>By {SITE.founder}</span>
          <span>·</span>
          <span>Verified PKR Pricing</span>
        </div>
      </header>

      {/* Answer-First Summary */}
      {summaryText && (
        <div className="p-5 md:p-6 rounded-2xl bg-accent-soft/40 border border-accent/30 space-y-2">
          <div className="flex items-center space-x-2 text-accent font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Answer-First Summary</span>
          </div>
          <p className="text-sm md:text-base text-text font-medium leading-relaxed">
            {summaryText?.replace(/\*\*/g, '')}
          </p>
        </div>
      )}

      {/* WhatsApp Quick Consultation Bar */}
      <div className="p-4 rounded-xl border border-separator bg-bg-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs md:text-sm text-text-secondary text-center sm:text-left">
          Have questions or ready to order in Pakistan?
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-[#25D366] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xs hover:opacity-95 transition-opacity min-h-[40px] whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 mr-1.5" />
          Chat on WhatsApp
        </a>
      </div>

      {/* Content Markdown */}
      <div
        className="catalogue-content space-y-6"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />

      {/* FAQs */}
      {faqs.length > 0 && <Faq items={faqs} />}

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: Last Updated: {postDate}. PakAITools is an independent reseller and is not affiliated with, endorsed by, or officially partnered with any featured brand. Have questions? WhatsApp Support:{' '}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline font-semibold hover:opacity-80"
          >
            {SITE.whatsappDisplay}
          </a>.
        </p>
      </div>
    </article>
  );
}
