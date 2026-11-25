'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { getPublishedAINewsPosts } from '@/lib/ai-news';
import { AINewsCard } from './AINewsCard';

export function AINewsSection() {
  const [showAll, setShowAll] = useState(false);
  const publishedPosts = getPublishedAINewsPosts();

  if (publishedPosts.length === 0) {
    return null;
  }

  const hiddenCount = publishedPosts.length - 3;

  return (
    <section aria-labelledby="ai-news-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-separator pb-3 gap-2">
        <div className="space-y-1">
          <h2 id="ai-news-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-text">
            Latest AI News for Pakistan
          </h2>
          <p className="text-xs md:text-sm text-text-secondary">
            Breaking AI releases, pricing shifts, and practical local impact for Pakistani users and developers
          </p>
        </div>
        <Link
          href="/ai-news/"
          className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle text-xs md:text-sm font-semibold text-text hover:text-accent transition-colors min-h-[34px] sm:min-h-[40px] flex-shrink-0 self-start sm:self-auto"
        >
          View all AI News <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {publishedPosts.map((post, idx) => (
          <div
            key={post.slug}
            className={idx >= 3 && !showAll ? 'hidden' : 'flex flex-col'}
          >
            <AINewsCard post={post} />
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle text-xs sm:text-sm font-semibold text-text hover:text-accent transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-expanded={showAll}
          >
            <span>{showAll ? 'Show less' : `See more (${hiddenCount} more)`}</span>
            {showAll ? (
              <ChevronUp className="w-4 h-4 text-text-tertiary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-tertiary" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}

export default AINewsSection;
