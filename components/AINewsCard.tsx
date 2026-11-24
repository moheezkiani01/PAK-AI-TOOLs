import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { AINewsPost } from '@/lib/ai-news';

interface AINewsCardProps {
  post: AINewsPost;
  priority?: boolean;
}

export function AINewsCard({ post, priority = false }: AINewsCardProps) {
  const dateStr = post.datePublished.split('T')[0];

  return (
    <article className="p-5 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all flex flex-col justify-between">
      <div>
        <div className="relative w-full aspect-[1200/630] rounded-xl overflow-hidden mb-3.5 bg-bg-subtle border border-separator/60">
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            loading={priority ? undefined : 'lazy'}
            priority={priority}
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-text-tertiary mb-2">
          <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-accent-soft text-accent font-bold">
            News
          </span>
          <span>·</span>
          <time dateTime={dateStr}>{dateStr}</time>
        </div>
        <h3 className="text-base font-bold text-text leading-snug mb-2 line-clamp-2">
          <Link href={`/ai-news/${post.slug}/`} className="hover:text-accent hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4">
          {post.description}
        </p>
      </div>
      <Link
        href={`/ai-news/${post.slug}/`}
        className="inline-flex items-center text-xs font-bold text-accent hover:underline"
      >
        Read full story →
      </Link>
    </article>
  );
}

export default AINewsCard;
