import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { getCollectionSchema } from '@/lib/schema';
import { ArrowRight, Calendar, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog & Buying Guides – Compare Subscriptions in Pakistan | PakAITools',
  description:
    'Independent comparisons, buying guides, and tutorials for software subscriptions in Pakistan. Compare Canva, Adobe, AI chatbots, and VPNs with PKR prices.',
  alternates: {
    canonical: 'https://pakaitools.store/blog/',
  },
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog/' },
  ];

  const schema = getCollectionSchema('Blog & Buying Guides – PakAITools', '/blog/', breadcrumbs);

  return (
    <div className="space-y-8 py-2 max-w-4xl mx-auto">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          Blog & Software Buying Guides
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Honest side-by-side comparisons and buying advice to help Pakistani freelancers, students, and businesses choose the right plans.
        </p>
      </section>

      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="p-6 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-text-tertiary mb-2">
              <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-bg-subtle text-accent font-bold">
                {post.type}
              </span>
              <span>·</span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {post.date}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-text mb-2">
              <Link href={`/blog/${post.slug}/`} className="hover:text-accent hover:underline">
                {post.title}
              </Link>
            </h2>

            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {post.desc}
            </p>

            <Link
              href={`/blog/${post.slug}/`}
              className="inline-flex items-center text-xs md:text-sm font-bold text-accent hover:underline"
            >
              Read full comparison <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
