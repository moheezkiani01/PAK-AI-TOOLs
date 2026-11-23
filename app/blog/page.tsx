import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts, getBlogHub, getNewsArticles } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { ArrowRight, Calendar, BookOpen, Newspaper, ShieldCheck } from 'lucide-react';
import { SITE } from '@/lib/site.config';

export const metadata: Metadata = {
  title: 'Blog — 2026 PKR Price Guides & AI Tool Tips Pakistan',
  description:
    'Read 2026 PKR price guides, warranty checklists, and buying advice for AI chatbots, APIs, video/voice tools, Adobe, VPNs, Netflix, Spotify & Pakistan eSIMs.',
  alternates: {
    canonical: 'https://pakaitools.store/blog/',
  },
  openGraph: {
    title: 'Blog — 2026 PKR Price Guides & AI Tool Tips Pakistan',
    description:
      'Read 2026 PKR price guides, warranty checklists, and buying advice for AI chatbots, APIs, video/voice tools, Adobe, VPNs, Netflix, Spotify & Pakistan eSIMs.',
    url: 'https://pakaitools.store/blog/',
    images: ['/og-default.png'],
  },
};

export default function BlogIndexPage() {
  const hub = getBlogHub();
  const allPosts = getBlogPosts();
  const news = getNewsArticles();

  const categoryGuides = allPosts.filter((p) => p.slug.endsWith('-price-guide-pakistan'));
  const evergreenPosts = allPosts.filter((p) => !p.slug.endsWith('-price-guide-pakistan'));

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog/' },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': 'https://pakaitools.store/blog/#blog',
        url: 'https://pakaitools.store/blog/',
        name: hub?.title || 'PakAITools Blog',
        description: hub?.desc || '2026 PKR price guides, warranty checklists, and local buying advice.',
        inLanguage: 'en-PK',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pakaitools.store/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://pakaitools.store/blog/' },
        ],
      },
    ],
  };

  return (
    <div className="space-y-6 md:space-y-8 py-2 max-w-5xl mx-auto">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <section className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge Base &amp; Guides</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-text tracking-tight">
          {hub?.h1 || 'PakAITools Blog: 2026 PKR Price Guides & Buying Tips for Digital Subscriptions in Pakistan'}
        </h1>
        <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-3xl">
          {(hub?.intro ||
            'Explore our 15 category buying guides built specifically for freelancers, students, developers, agencies, and everyday users in Pakistan.').replace(/\*\*/g, '')}
        </p>
      </section>

      {/* Category Buying Guides (15 Pillars) */}
      <section aria-labelledby="category-guides-heading" className="space-y-4">
        <div className="border-b border-separator pb-3 flex items-center justify-between">
          <div>
            <h2 id="category-guides-heading" className="text-xl md:text-2xl font-bold text-text">
              15 Category Price &amp; Buying Guides
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Complete PKR price tables, warranty checklists, and buyer tips for each category
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-soft text-accent">
            15 Guides
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {categoryGuides.map((guide) => (
            <article
              key={guide.slug}
              className="p-5 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">
                  Category Pillar Guide
                </span>
                <h3 className="text-base md:text-lg font-bold text-text leading-snug mb-2">
                  <Link href={`/blog/${guide.slug}/`} className="hover:text-accent hover:underline">
                    {guide.h1 || guide.seoTitle || guide.title}
                  </Link>
                </h3>
                <p className="text-xs md:text-sm text-text-secondary line-clamp-3 leading-relaxed mb-4">
                  {(guide.summary || guide.metaDesc || guide.desc)?.replace(/\*\*/g, '')}
                </p>
              </div>

              <div className="pt-3 border-t border-separator/60 flex items-center justify-between">
                <span className="text-xs text-text-tertiary">
                  Verified PKR Pricing
                </span>
                <Link
                  href={`/blog/${guide.slug}/`}
                  className="inline-flex items-center text-xs font-bold text-accent hover:underline"
                >
                  Read guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Evergreen Tutorials & Comparisons */}
      {evergreenPosts.length > 0 && (
        <section aria-labelledby="tutorials-heading" className="space-y-4">
          <div className="border-b border-separator pb-3">
            <h2 id="tutorials-heading" className="text-xl md:text-2xl font-bold text-text">
              Buyer Guides &amp; Tutorials
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Step-by-step instructions on local payments, duration choices, and cost breakdowns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {evergreenPosts.map((post) => (
              <article
                key={post.slug}
                className="p-5 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">
                    {post.type === 'howto' ? 'How-To Guide' : 'Comparison'}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-text leading-snug mb-2">
                    <Link href={`/blog/${post.slug}/`} className="hover:text-accent hover:underline">
                      {post.title || post.h1}
                    </Link>
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed mb-3">
                    {(post.desc || post.summary)?.replace(/\*\*/g, '')}
                  </p>
                </div>
                <Link
                  href={`/blog/${post.slug}/`}
                  className="inline-flex items-center text-xs font-bold text-accent hover:underline mt-2"
                >
                  Read article <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* AI News Section */}
      {news.length > 0 && (
        <section id="news" aria-labelledby="news-heading" className="space-y-4">
          <div className="border-b border-separator pb-3 flex items-center justify-between">
            <div>
              <h2 id="news-heading" className="text-xl md:text-2xl font-bold text-text flex items-center space-x-2">
                <Newspaper className="w-5 h-5 text-accent" />
                <span>Latest AI News &amp; Updates</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Verified developments in generative AI, models, and tools relevant to Pakistan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {news.map((item) => (
              <article
                key={item.slug}
                className="p-5 rounded-2xl border border-separator bg-bg-card hover:border-accent hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2 text-xs text-text-tertiary mb-2">
                    <time dateTime={item.date}>{item.date}</time>
                    <span>·</span>
                    <span className="font-semibold text-accent">{item.tags[0]}</span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-text leading-snug mb-2">
                    <Link href={`/blog/news/${item.slug}/`} className="hover:text-accent hover:underline">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed mb-3">
                    {item.summary?.replace(/\*\*/g, '')}
                  </p>
                </div>
                <Link
                  href={`/blog/news/${item.slug}/`}
                  className="inline-flex items-center text-xs font-bold text-accent hover:underline mt-2"
                >
                  Read story <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Trust Notice */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p>
          Trust Notice: Last Updated: November 22, 2026. PakAITools is an independent reseller and is not affiliated with, endorsed by, or officially partnered with any featured software brand. Have questions? WhatsApp Support: {SITE.whatsappDisplay}.
        </p>
      </div>
    </div>
  );
}
