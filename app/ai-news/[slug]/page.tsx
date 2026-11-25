import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Calendar,
  User,
} from 'lucide-react';
import { getPublishedAINewsPosts, getAINewsPostBySlug } from '@/lib/ai-news';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { getNewsArticleSchema } from '@/lib/schema';
import { renderMarkdown } from '@/lib/markdown';
import { SITE_URL } from '@/lib/site.config';
import { baseOg, optimizeSeoTitle } from '@/lib/seo';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface AINewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getPublishedAINewsPosts();
  return posts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: AINewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getAINewsPostBySlug(slug, false);

  if (!post) {
    return {};
  }

  const cleanTitle = optimizeSeoTitle(post.title);
  const canonicalUrl = `${SITE_URL}/ai-news/${post.slug}/`;
  const imageUrl = post.image.src.startsWith('http')
    ? post.image.src
    : `${SITE_URL}${post.image.src.startsWith('/') ? '' : '/'}${post.image.src}`;

  return {
    title: cleanTitle,
    description: post.description,
    ...(post.draft
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...baseOg,
      type: 'article',
      title: cleanTitle,
      description: post.description,
      url: canonicalUrl,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [post.author.name],
      images: [
        {
          url: imageUrl,
          width: post.image.width,
          height: post.image.height,
          alt: post.image.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: post.description,
      images: [imageUrl],
    },
  };
}

export default async function AINewsArticlePage({ params }: AINewsArticlePageProps) {
  const { slug } = await params;
  const post = getAINewsPostBySlug(slug, false);

  if (!post) {
    notFound();
  }

  const datePublishedDisplay = post.datePublished.split('T')[0];
  const dateModifiedDisplay = post.dateModified.split('T')[0];
  const datePublishedIso = post.datePublished;
  const dateModifiedIso = post.dateModified;

  // 1. Breadcrumbs: Home > AI News > Title
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'AI News', url: '/ai-news/' },
    { name: post.title, url: `/ai-news/${post.slug}/` },
  ];

  const articleSchema = getNewsArticleSchema(post, breadcrumbs);
  const renderedHtml = renderMarkdown(post.body);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Structured Data */}
      <JsonLd data={articleSchema} />

      {/* 1. Breadcrumb */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 2. Title, Author, Dates Header */}
      <header className="space-y-4 pb-6 border-b border-separator">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-tertiary">
          <span className="uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-accent-soft text-accent font-bold">
            AI News
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-text-tertiary" aria-hidden="true" />
            <span>Published:</span>
            <time dateTime={datePublishedIso}>{datePublishedDisplay}</time>
          </span>
          {dateModifiedDisplay !== datePublishedDisplay && (
            <>
              <span>·</span>
              <span>Updated:</span>
              <time dateTime={dateModifiedIso}>{dateModifiedDisplay}</time>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-text-secondary pt-1">
          <span className="flex items-center gap-1.5 font-medium">
            <User className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>By <strong className="text-text font-semibold">{post.author.name}</strong></span>
          </span>
          <span>·</span>
          <span>Verified for Pakistani digital workers &amp; developers</span>
        </div>


      </header>

      {/* 3. Quick Answer Box */}
      <section
        aria-label="Quick Answer"
        className="rounded-2xl border border-accent/40 bg-accent-soft/30 p-5 sm:p-6 space-y-2 shadow-xs"
      >
        <div className="flex items-center space-x-2 text-accent font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>Quick Answer</span>
        </div>
        <p className="text-sm sm:text-base text-text leading-relaxed font-medium">
          {post.quickAnswer}
        </p>
      </section>

      {/* 4. What This Means for Pakistan Block */}
      <section
        aria-label="What This Means for Pakistan"
        className="rounded-2xl border border-separator bg-bg-card p-5 sm:p-6 space-y-2.5 shadow-xs"
      >
        <div className="flex items-center space-x-2 text-text font-bold text-sm sm:text-base">
          <span className="text-lg leading-none" role="img" aria-label="Pakistan flag">
            🇵🇰
          </span>
          <h2>What This Means for Pakistan</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {post.pkAngle}
        </p>
      </section>

      {/* 5. Body Content */}
      <section
        aria-label="Article Body"
        className="catalogue-content space-y-4 text-text-secondary leading-relaxed text-sm sm:text-base"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />

      {/* 6. Related Plans on PakAITools */}
      {post.relatedProducts && post.relatedProducts.length > 0 && (
        <section
          aria-labelledby="related-plans-heading"
          className="rounded-2xl border border-separator bg-bg-card p-5 sm:p-6 space-y-3.5"
        >
          <h2 id="related-plans-heading" className="text-lg sm:text-xl font-bold text-text">
            Related Plans on PakAITools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {post.relatedProducts.map((rel) => (
              <Link
                key={rel.href}
                href={rel.href}
                className="flex items-center justify-between p-3.5 rounded-xl border border-separator bg-bg-subtle hover:border-accent hover:text-accent transition-colors text-xs sm:text-sm font-semibold text-text min-h-[44px]"
              >
                <span>{rel.label}</span>
                <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 ml-2" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. FAQ Block */}
      {post.faq && post.faq.length > 0 && (
        <section aria-labelledby="faq-heading" className="space-y-4 pt-2">
          <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-text">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {post.faq.map((item, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-separator bg-bg-card p-4 transition-all [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-text text-sm sm:text-base list-none">
                  <span>{item.q}</span>
                  <ChevronDown
                    className="w-4 h-4 text-text-tertiary transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-2"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed pt-2 border-t border-separator/60">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* 8. Sources List */}
      {post.sources && post.sources.length > 0 && (
        <section aria-labelledby="sources-heading" className="pt-6 border-t border-separator space-y-2.5">
          <h3 id="sources-heading" className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
            Primary Sources &amp; Citations
          </h3>
          <ul className="space-y-2 text-xs text-text-secondary">
            {post.sources.map((src, idx) => (
              <li key={idx} className="flex items-center space-x-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" aria-hidden="true" />
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent hover:underline break-all"
                >
                  {src.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
