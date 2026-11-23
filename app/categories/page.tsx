import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/data';
import { CategoryCard } from '@/components/CategoryCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { getCollectionSchema } from '@/lib/schema';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Categories – AI Tools, Design, VPN & Subscriptions in Pakistan',
  description:
    'Browse all 15 digital categories in Pakistan: AI Chatbots, Design & Creative, Video Editing, Streaming, VPN & Privacy, APIs, Developer Tools and more.',
  alternates: {
    canonical: 'https://pakaitools.store/categories/',
  },
};

export default function CategoriesPage() {
  const categories = getCategories();
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories/' },
  ];

  const schema = getCollectionSchema(
    'All Categories – PakAITools',
    '/categories/',
    breadcrumbs
  );

  return (
    <div className="space-y-8 py-2">
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-text">
          Browse All 15 Categories
        </h1>
        <p className="text-sm md:text-base text-text-secondary max-w-2xl">
          Explore curated categories of digital subscriptions, developer tools, and AI software. Every plan is priced in PKR with verified warranty and local payment support.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>

      <div className="rounded-2xl border border-separator bg-bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-text text-base md:text-lg">Looking for a specific plan?</h2>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            View our complete price list of all 231 plans with live search and price comparisons.
          </p>
        </div>
        <Link
          href="/price-list/"
          className="bg-accent text-accent-on px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-xs hover:opacity-95 flex items-center min-h-[44px] whitespace-nowrap"
        >
          View Full Price List <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>
    </div>
  );
}
