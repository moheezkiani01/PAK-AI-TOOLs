import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPublishedAINewsPosts } from '@/lib/ai-news';
import { AINewsCard } from './AINewsCard';

export function AINewsSection() {
  const publishedPosts = getPublishedAINewsPosts().slice(0, 6);

  if (publishedPosts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="ai-news-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-separator pb-3 gap-2">
        <div>
          <h2 id="ai-news-heading" className="text-2xl md:text-3xl font-bold text-text">
            Latest AI News for Pakistan
          </h2>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Breaking AI releases, pricing shifts, and practical local impact for Pakistani users and developers
          </p>
        </div>
        <Link
          href="/ai-news/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle text-xs md:text-sm font-semibold text-text hover:text-accent transition-colors min-h-[40px]"
        >
          View all AI News <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {publishedPosts.map((post) => (
          <AINewsCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

export default AINewsSection;
