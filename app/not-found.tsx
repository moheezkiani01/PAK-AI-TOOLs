import React from 'react';
import Link from 'next/link';
import { Search, Home, Tag, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-accent-soft text-accent mx-auto flex items-center justify-center font-black text-2xl">
        404
      </div>
      <h1 className="text-3xl font-black text-text">Page Not Found</h1>
      <p className="text-sm md:text-base text-text-secondary leading-relaxed">
        The plan or page you are looking for may have been moved, updated, or merged into its brand hub.
      </p>

      {/* Search box */}
      <form action="/price-list/" method="GET" className="relative max-w-md mx-auto">
        <input
          type="search"
          name="q"
          placeholder="Search 231 plans (e.g. Canva, ChatGPT, Netflix)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-separator bg-bg-card text-text placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent min-h-[48px] shadow-sm text-sm"
        />
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-text-tertiary" aria-hidden="true" />
      </form>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="inline-flex items-center bg-accent text-accent-on px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm min-h-[44px]"
        >
          <Home className="w-4 h-4 mr-1.5" />
          Back to Home
        </Link>
        <Link
          href="/price-list/"
          className="inline-flex items-center bg-bg-card border border-separator text-text px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm hover:border-accent min-h-[44px]"
        >
          <Tag className="w-4 h-4 mr-1.5" />
          View All Plans
        </Link>
      </div>
    </div>
  );
}
