import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPosts, getBlogPostBySlug, getProductBySlug } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { PriceText } from '@/components/PriceText';
import { buildWhatsAppLink, getProductWhatsAppMessage } from '@/lib/whatsapp';
import { SITE } from '@/lib/site.config';
import { ShieldCheck, MessageCircle, ArrowRight, UserCheck, Calendar } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.desc,
    alternates: {
      canonical: `https://pakaitools.store/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.desc,
      url: `https://pakaitools.store/blog/${post.slug}/`,
      images: ['/og-default.png'],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog/' },
    { name: post.title, url: `/blog/${post.slug}/` },
  ];

  // Schema: BlogPosting + Breadcrumbs + FAQ
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.desc,
    image: `${SITE.domain}/og-default.png`,
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
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${SITE.domain}/blog/${post.slug}/`,
  };

  const faqs = (post.faq || []).map(([q, a]) => ({ question: q, answer: a }));

  // Associated plans
  const linkedPlans = (post.plans || [])
    .map((s) => getProductBySlug(s))
    .filter(Boolean) as Array<NonNullable<ReturnType<typeof getProductBySlug>>>;

  // Substitute shortcodes in body markdown with real data
  let formattedBody = post.md || '';
  linkedPlans.forEach((p) => {
    formattedBody = formattedBody
      .replace(new RegExp(`{{price:${p.slug}}}`, 'g'), p.price ? `Rs. ${p.price.toLocaleString('en-PK')}` : 'Live quote')
      .replace(new RegExp(`{{pm:${p.slug}:(\\d+)}}`, 'g'), (_, div) => {
        if (!p.price) return 'Live quote';
        const perMonth = Math.round(p.price / parseInt(div, 10));
        return `Rs. ${perMonth.toLocaleString('en-PK')}`;
      })
      .replace(new RegExp(`{{mul:${p.slug}:(\\d+)}}`, 'g'), (_, mul) => {
        if (!p.price) return 'Live quote';
        const total = p.price * parseInt(mul, 10);
        return `Rs. ${total.toLocaleString('en-PK')}`;
      });
  });

  return (
    <article className="max-w-4xl mx-auto py-2 space-y-8">
      <JsonLd schema={blogSchema} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center space-x-3 text-xs text-text-tertiary">
          <span className="uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent-soft text-accent font-bold">
            {post.type}
          </span>
          <span>·</span>
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Updated {post.date}
          </span>
          <span>·</span>
          <span>By {SITE.founder}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text leading-tight">
          {post.title}
        </h1>

        {/* TL;DR Answer Box */}
        <div className="p-5 rounded-2xl bg-accent-soft/40 border border-accent/20 space-y-1.5">
          <span className="text-xs uppercase tracking-wider font-bold text-accent block">
            Verdict &amp; Summary (TL;DR)
          </span>
          <p className="text-sm md:text-base text-text leading-relaxed font-medium">
            {post.ans}
          </p>
        </div>
      </header>

      {/* Linked Plans Cards Preview */}
      {linkedPlans.length > 0 && (
        <section aria-labelledby="linked-plans-heading" className="space-y-3">
          <h2 id="linked-plans-heading" className="text-lg font-bold text-text">
            Our Plans for This Comparison
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {linkedPlans.map((p) => {
              const waLink = buildWhatsAppLink(
                getProductWhatsAppMessage(p.name, p.price, p.duration, `${SITE.domain}/product/${p.slug}/`)
              );
              return (
                <div key={p.slug} className="p-4 rounded-xl border border-separator bg-bg-card flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-text text-sm md:text-base">{p.name}</h3>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-text-tertiary">
                      <span>{p.duration}</span>
                      <span>·</span>
                      <span>{p.warranty}</span>
                    </div>
                    <div className="mt-3">
                      <PriceText pkr={p.price} className="text-base font-bold" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 pt-2 border-t border-separator">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-accent text-accent-on px-3 py-2 rounded-lg text-xs font-semibold text-center hover:opacity-95 flex items-center justify-center min-h-[36px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1" />
                      Order on WhatsApp
                    </a>
                    <Link
                      href={`/product/${p.slug}/`}
                      className="px-3 py-2 rounded-lg border border-separator text-xs font-semibold hover:border-accent flex items-center min-h-[36px]"
                    >
                      Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Body Content */}
      <div
        className="rounded-2xl border border-separator bg-bg-card p-6 md:p-8 space-y-4 text-text-secondary text-sm md:text-base leading-relaxed [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-text [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-text [&_h3]:mt-6 [&_h3]:mb-2 [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_th]:border [&_th]:border-separator [&_th]:p-3 [&_th]:bg-bg-subtle [&_th]:text-text [&_th]:text-left [&_td]:border [&_td]:border-separator [&_td]:p-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_a]:text-accent [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: formatBlogMarkdown(formattedBody) }}
      />

      {/* FAQs */}
      {faqs.length > 0 && <Faq items={faqs} />}

      {/* Sources and Last Reviewed */}
      <div className="p-4 rounded-xl border border-separator bg-bg-subtle text-xs text-text-tertiary space-y-1.5">
        <p className="font-semibold text-text">Sources &amp; Freshness</p>
        <p>{post.src || 'Prices, durations and warranties are read from PakAITools data. Last reviewed November 2026.'}</p>
        <p className="pt-1">
          Disclosure: PakAITools is an independent reseller and sells plans for some of the products mentioned. We write comparisons to help you choose, and we are not affiliated with the brands.
        </p>
      </div>
    </article>
  );
}

function formatBlogMarkdown(md: string): string {
  if (!md) return '';
  return md
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '<br/><br/>');
}
