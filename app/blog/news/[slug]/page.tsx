import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNewsArticles, getNewsArticleBySlug } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { renderMarkdown } from '@/lib/markdown';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';
import { SITE } from '@/lib/site.config';
import { Newspaper, Calendar, ArrowLeft, ExternalLink, MessageCircle, ShieldCheck } from 'lucide-react';

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const news = getNewsArticles();
  return news.map((n) => ({
    slug: n.slug,
  }));
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);

  if (!article) return {};

  return {
    title: `${article.title} - AI News`,
    description: article.summary,
    alternates: {
      canonical: `https://pakaitools.store/blog/news/${article.slug}/`,
    },
    openGraph: {
      title: `${article.title} - AI News`,
      description: article.summary,
      url: `https://pakaitools.store/blog/news/${article.slug}/`,
      images: ['/og-default.png'],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const fullUrl = `https://pakaitools.store/blog/news/${article.slug}/`;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog/' },
    { name: 'AI News', url: '/blog/#news' },
    { name: article.title, url: `/blog/news/${article.slug}/` },
  ];

  const waLink = buildWhatsAppLink(
    `Hi PakAITools, I read your news article "${article.title}" and have a question. Page: ${fullUrl}`
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    dateModified: article.date,
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
    mainEntityOfPage: fullUrl,
  };

  const bodyHtml = renderMarkdown(article.content);

  return (
    <article className="space-y-8 py-2 max-w-3xl mx-auto">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Back button */}
      <div>
        <Link
          href="/blog/#news"
          className="inline-flex items-center text-xs font-semibold text-accent hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to AI News
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>AI News</span>
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full bg-bg-subtle border border-separator text-text-tertiary"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center space-x-3 text-xs text-text-tertiary">
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            <time dateTime={article.date}>{article.date}</time>
          </span>
          <span>·</span>
          <span>By {SITE.founder}</span>
          <span>·</span>
          <span>Verified Official Sources</span>
        </div>
      </header>

      {/* Summary Box */}
      <div className="p-5 rounded-2xl bg-bg-card border border-separator space-y-2">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">
          Editorial Summary
        </span>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed font-medium">
          {article.summary}
        </p>
      </div>

      {/* Article Body */}
      <div
        className="catalogue-content space-y-6 text-sm md:text-base"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />

      {/* Official Sources Citation */}
      {article.sources && article.sources.length > 0 && (
        <section aria-labelledby="sources-heading" className="p-5 rounded-2xl bg-bg-subtle border border-separator space-y-3">
          <h2 id="sources-heading" className="text-sm font-bold text-text uppercase tracking-wider">
            Verified Primary Sources
          </h2>
          <ul className="space-y-2 text-xs md:text-sm">
            {article.sources.map((src, idx) => (
              <li key={idx}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-accent hover:underline font-medium"
                >
                  {src.name} <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* WhatsApp CTA */}
      <div className="p-5 rounded-2xl border border-separator bg-bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-text text-sm md:text-base">
            Want to use these tools in Pakistan?
          </h3>
          <p className="text-xs text-text-secondary">
            Get instant access with local PKR payment via JazzCash, EasyPaisa, or SadaPay.
          </p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs hover:opacity-95 whitespace-nowrap min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4 mr-1.5" />
          Chat on WhatsApp
        </a>
      </div>

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: Published by PakAITools Editorial Team. We provide independent news and reseller services for Pakistani digital workers.
        </p>
      </div>
    </article>
  );
}
