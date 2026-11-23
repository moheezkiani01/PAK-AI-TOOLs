'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowRight, MessageCircle } from 'lucide-react';
import { PriceText } from '@/components/PriceText';
import { buildWhatsAppLink, getProductWhatsAppMessage } from '@/lib/whatsapp';
import { useCurrency } from '@/components/CurrencyContext';

interface PlanItem {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  duration: string;
  warranty: string;
  isMerged: boolean;
  url: string;
}

interface CategoryGroup {
  category: {
    name: string;
    slug: string;
  };
  plans: PlanItem[];
}

export function PriceListClient({ categoryGroups }: { categoryGroups: CategoryGroup[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { currency } = useCurrency();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  // Filter plans based on query
  const qLower = query.toLowerCase().trim();

  const filteredGroups = categoryGroups
    .map((group) => {
      if (!qLower) return group;
      const matchedPlans = group.plans.filter(
        (p) =>
          p.name.toLowerCase().includes(qLower) ||
          p.slug.toLowerCase().includes(qLower) ||
          group.category.name.toLowerCase().includes(qLower)
      );
      return {
        ...group,
        plans: matchedPlans,
      };
    })
    .filter((g) => g.plans.length > 0);

  const totalResults = filteredGroups.reduce((sum, g) => sum + g.plans.length, 0);

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="relative max-w-lg">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter plans by name (e.g. Canva, Adobe, Netflix, VPN)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-separator bg-bg-card text-text placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent min-h-[48px] shadow-sm text-sm"
          aria-label="Filter plans by name"
        />
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-text-tertiary" aria-hidden="true" />
      </div>

      {query && (
        <div className="text-xs text-text-tertiary">
          Found {totalResults} plan{totalResults === 1 ? '' : 's'} matching &ldquo;{query}&rdquo;
        </div>
      )}

      {/* Render Filtered Groups */}
      <div className="space-y-12">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-separator bg-bg-card">
            <p className="text-sm text-text-secondary">No plans found matching &ldquo;{query}&rdquo;.</p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-3 text-xs font-semibold text-accent hover:underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          filteredGroups.map(({ category, plans }) => (
            <section
              key={category.slug}
              id={category.slug}
              className="space-y-4 pt-6 border-t border-separator first:border-t-0 first:pt-0"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-text">
                  <Link href={`/${category.slug}/`} className="hover:text-accent transition-colors">
                    {category.name}
                  </Link>
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-bg-subtle border border-separator text-text-secondary">
                  {plans.length} plan{plans.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-2.5">
                {plans.map((p) => {
                  const waLink = buildWhatsAppLink(
                    getProductWhatsAppMessage(
                      p.name,
                      p.price,
                      p.duration,
                      `https://pakaitools.store${p.url}`,
                      currency === 'USD'
                    )
                  );

                  return (
                    <div
                      key={p.slug}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 md:p-4 rounded-xl border border-separator bg-bg-card hover:bg-bg-subtle transition-colors gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={p.url}
                          className="font-semibold text-sm md:text-base text-text hover:text-accent hover:underline"
                        >
                          {p.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-text-tertiary">
                          <span className="font-medium text-text-secondary">{p.duration}</span>
                          <span>·</span>
                          <span>{p.warranty}</span>
                          {p.isMerged && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-bg-subtle text-text-tertiary">
                              Brand hub plan
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end space-x-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-separator">
                        <div className="text-left sm:text-right">
                          <PriceText pkr={p.price} className="text-sm md:text-base" />
                        </div>

                        <div>
                          {p.isMerged ? (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-accent text-accent-on px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity min-h-[36px]"
                            >
                              <MessageCircle className="w-3.5 h-3.5 mr-1" />
                              Order
                            </a>
                          ) : (
                            <Link
                              href={p.url}
                              className="inline-flex items-center bg-bg-subtle text-text hover:text-accent border border-separator px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px]"
                            >
                              View plan
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
