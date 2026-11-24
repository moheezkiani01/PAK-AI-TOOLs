import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getPublishedAINewsPosts } from '@/lib/ai-news';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AINewsCard } from '@/components/AINewsCard';
import { JsonLd } from '@/components/JsonLd';
import { getAINewsHubSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/site.config';
import { baseOg } from '@/lib/seo';

export const dynamic = 'force-static';
export const dynamicParams = false;

const POSTS_PER_PAGE = 12;

interface PaginatedNewsProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const posts = getPublishedAINewsPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  if (totalPages <= 1) {
    return [{ page: '1' }];
  }

  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    pages.push({ page: String(p) });
  }
  return pages;
}

export async function generateMetadata({ params }: PaginatedNewsProps): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);
  const canonicalUrl = pageNumber === 1 ? `${SITE_URL}/ai-news/` : `${SITE_URL}/ai-news/page/${pageNumber}/`;
  const cleanTitle = `AI News for Pakistan - Page ${pageNumber}`;

  return {
    title: cleanTitle,
    description: `Browse page ${pageNumber} of verified AI news and PKR pricing breakthroughs for Pakistani developers and businesses.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...baseOg,
      title: cleanTitle,
      description: `Browse page ${pageNumber} of verified AI news and PKR pricing breakthroughs for Pakistani developers and businesses.`,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: `Browse page ${pageNumber} of verified AI news and PKR pricing breakthroughs for Pakistani developers and businesses.`,
    },
  };
}

export default async function PaginatedNewsPage({ params }: PaginatedNewsProps) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  const allPublished = getPublishedAINewsPosts();
  const totalPosts = allPublished.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));

  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    notFound();
  }

  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
  const currentPosts = allPublished.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'AI News', url: '/ai-news/' },
    { name: `Page ${pageNumber}`, url: `/ai-news/page/${pageNumber}/` },
  ];

  const hubSchema = getAINewsHubSchema(currentPosts, breadcrumbs, pageNumber);

  const prevUrl = pageNumber <= 2 ? '/ai-news/' : `/ai-news/page/${pageNumber - 1}/`;
  const nextUrl = pageNumber < totalPages ? `/ai-news/page/${pageNumber + 1}/` : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Structured Data */}
      <JsonLd data={hubSchema} />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <header className="space-y-3 border-b border-separator pb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text tracking-tight">
          AI News for Pakistan - Page {pageNumber}
        </h1>
        <p className="text-sm md:text-base text-text-secondary max-w-3xl leading-relaxed">
          Verified AI model releases, API pricing shifts, and practical local analysis tailored for Pakistani freelancers, software agencies, and digital businesses.
        </p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentPosts.map((post) => (
          <AINewsCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Pagination */}
      <nav aria-label="Pagination" className="flex items-center justify-center space-x-3 pt-6 border-t border-separator">
        <Link
          href={prevUrl}
          className="inline-flex items-center px-4 py-2 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle hover:text-accent text-xs font-semibold text-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Previous
        </Link>
        <span className="px-4 py-2 rounded-xl border border-separator bg-bg-card text-xs font-bold text-text">
          Page {pageNumber} of {totalPages}
        </span>
        {nextUrl && (
          <Link
            href={nextUrl}
            className="inline-flex items-center px-4 py-2 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle hover:text-accent text-xs font-semibold text-text transition-colors"
          >
            Next <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        )}
      </nav>
    </div>
  );
}
