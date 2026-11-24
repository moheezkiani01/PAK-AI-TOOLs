import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Newspaper, ArrowLeft, ArrowRight } from 'lucide-react';
import { getPublishedAINewsPosts } from '@/lib/ai-news';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AINewsCard } from '@/components/AINewsCard';
import { JsonLd } from '@/components/JsonLd';
import { getAINewsHubSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/site.config';
import { baseOg } from '@/lib/seo';

export const dynamic = 'force-static';

const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: 'AI News for Pakistan | Latest Updates & PKR Pricing Breakdowns',
  description:
    'Stay ahead with verified AI news, price changes, and API developments relevant to Pakistani digital freelancers, agencies, and developers.',
  alternates: {
    canonical: `${SITE_URL}/ai-news/`,
  },
  openGraph: {
    ...baseOg,
    title: 'AI News for Pakistan | Latest Updates & PKR Pricing Breakdowns',
    description:
      'Stay ahead with verified AI news, price changes, and API developments relevant to Pakistani digital freelancers, agencies, and developers.',
    url: `${SITE_URL}/ai-news/`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI News for Pakistan | Latest Updates & PKR Pricing Breakdowns',
    description:
      'Stay ahead with verified AI news, price changes, and API developments relevant to Pakistani digital freelancers, agencies, and developers.',
  },
};

export default function AINewsHubPage() {
  const allPublished = getPublishedAINewsPosts();
  const totalPosts = allPublished.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const currentPosts = allPublished.slice(0, POSTS_PER_PAGE);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'AI News', url: '/ai-news/' },
  ];

  const hubSchema = getAINewsHubSchema(currentPosts, breadcrumbs, 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Structured Data */}
      <JsonLd data={hubSchema} />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <header className="space-y-3 border-b border-separator pb-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-text-tertiary">
          <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-accent-soft text-accent font-bold">
            Industry Dispatch
          </span>
          <span>·</span>
          <span>Verified Local Angle</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text tracking-tight">
          AI News for Pakistan
        </h1>
        <p className="text-sm md:text-base text-text-secondary max-w-3xl leading-relaxed">
          Verified AI model releases, API pricing shifts, and practical local analysis tailored for Pakistani freelancers, software agencies, and digital businesses.
        </p>
      </header>

      {/* TODO: Add AI News to main nav once 10+ published posts */}

      {/* Posts Grid or Empty State */}
      {currentPosts.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-separator bg-bg-card p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-bg-subtle border border-separator flex items-center justify-center mx-auto text-text-tertiary">
            <Newspaper className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-bold text-text">No Published News Articles Yet</h2>
            <p className="text-xs md:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
              We are researching and validating new AI model releases and local PKR pricing updates. Check back soon!
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-separator bg-bg-subtle hover:bg-bg hover:text-accent text-xs font-semibold text-text transition-colors"
          >
            ← Return to Homepage
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentPosts.map((post, idx) => (
              <AINewsCard key={post.slug} post={post} priority={idx === 0} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="flex items-center justify-center space-x-3 pt-6 border-t border-separator">
              <span className="px-4 py-2 rounded-xl border border-separator bg-bg-card text-xs font-bold text-text">
                Page 1 of {totalPages}
              </span>
              <Link
                href="/ai-news/page/2/"
                className="inline-flex items-center px-4 py-2 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle hover:text-accent text-xs font-semibold text-text transition-colors"
              >
                Next <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
