import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import type { AINewsPost } from '@/lib/ai-news';

interface AINewsCardProps {
  post: AINewsPost;
  priority?: boolean;
}

export function AINewsCard({ post }: AINewsCardProps) {
  const dateStr = post.datePublished.split('T')[0];

  return (
    <article className="p-4 sm:p-5 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-text-tertiary mb-2.5">
          <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-accent-soft text-accent font-bold text-[11px]">
            News
          </span>
          <span>·</span>
          <time dateTime={dateStr} className="flex items-center gap-1 text-text-tertiary">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <span>{dateStr}</span>
          </time>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-text leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
          <Link href={`/ai-news/${post.slug}/`}>
            {post.title}
          </Link>
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary line-clamp-3 leading-relaxed mb-4">
          {post.description}
        </p>
      </div>
      <Link
        href={`/ai-news/${post.slug}/`}
        className="inline-flex items-center text-xs font-bold text-accent group-hover:underline mt-auto pt-2 border-t border-separator/40"
      >
        <span>Read full story</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}

export default AINewsCard;
