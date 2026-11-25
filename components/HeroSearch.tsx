'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ArrowRight, Tag, MessageCircle } from 'lucide-react';
import { formatPkr } from '@/lib/money';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export interface SearchResultItem {
  title: string;
  url: string;
  type: 'plan' | 'merged_plan' | 'brand' | 'category' | 'guide';
  category?: string;
  price?: number | null;
  duration?: string;
  keywords?: string;
}

function scoreHeroItem(item: SearchResultItem, q: string): number {
  const t = item.title.toLowerCase();
  const k = (item.keywords || '').toLowerCase();
  const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordRegex = new RegExp(`\\b${escapedQ}`, 'i');

  let score = 0;

  // 1. Exact title match
  if (t === q) {
    score += 10000;
  } else if (t.startsWith(q)) {
    score += 5000;
  } else if (wordRegex.test(t)) {
    score += 3000;
  } else if (t.includes(q)) {
    score += 1500;
  }

  // Multi-word check
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const allWordsInTitle = words.every((w) => t.includes(w));
    if (allWordsInTitle) {
      score += 2000;
    }
  }

  // 2. Type boost for title matches
  if (score > 0) {
    if (item.type === 'brand') score += 500;
    else if (item.type === 'plan' || item.type === 'merged_plan') score += 300;
    else if (item.type === 'category') score += 100;
  }

  // 3. Keyword matches (scored lower so any title match always wins)
  if (wordRegex.test(k)) {
    score += 50;
  } else if (k.includes(q)) {
    score += 10;
  }

  return score;
}

export function HeroSearch() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchResultItem[]>([]);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load search-index.json on component mount
  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data: SearchResultItem[]) => {
        setItems(data);
      })
      .catch((err) => {
        console.error('Failed to load search index:', err);
      });
  }, []);

  // Filter on query change (activates on 1st typed character!)
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    if (items.length > 0) {
      const filtered = items
        .map((item) => ({ item, score: scoreHeroItem(item, q) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.item)
        .slice(0, 8);

      setResults(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
    }
  }, [query, items]);

  // Click outside to dismiss
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        router.push(`/price-list/?q=${encodeURIComponent(query.trim())}`);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(results[selectedIndex].url);
        setIsOpen(false);
      } else if (query.trim()) {
        router.push(`/price-list/?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="w-full max-w-lg mx-auto relative mt-3 z-40 text-left">
      <form
        action="/price-list/"
        method="GET"
        onSubmit={(e) => {
          if (selectedIndex >= 0 && results[selectedIndex]) {
            e.preventDefault();
            router.push(results[selectedIndex].url);
            setIsOpen(false);
          }
        }}
        className="relative"
      >
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim() && results.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search Canva, ChatGPT, Netflix, VPN..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-2 border-separator bg-bg-card text-text placeholder-text-tertiary focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 min-h-[52px] shadow-sm text-sm md:text-base font-medium transition-all"
          />
          <Search className="w-5 h-5 absolute left-3.5 text-text-tertiary pointer-events-none" aria-hidden="true" />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3.5 p-1 rounded-lg text-text-tertiary hover:text-text hover:bg-bg-subtle transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Instant Dropdown Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-bg-card rounded-2xl border border-separator shadow-xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
          {results.length > 0 ? (
            <div>
              <div className="p-2 divide-y divide-separator/40 max-h-[380px] overflow-y-auto">
                {results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <Link
                      key={item.url + idx}
                      href={item.url}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                        isSelected ? 'bg-accent/10 border-accent/30' : 'hover:bg-bg-subtle'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              item.type === 'brand'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : item.type === 'category'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'bg-accent-soft text-accent'
                            }`}
                          >
                            {item.type === 'brand' ? 'Brand Hub' : item.type === 'category' ? 'Category' : (item.duration || 'Plan')}
                          </span>
                          <span className="font-semibold text-text text-sm truncate">
                            {item.title}
                          </span>
                        </div>
                        {item.category && (
                          <p className="text-xs text-text-tertiary line-clamp-1 mt-0.5 pl-0.5 capitalize">
                            {item.category.replace(/-/g, ' ')}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 text-right">
                        {item.price !== undefined && item.price !== null ? (
                          <span className="text-xs md:text-sm font-bold text-accent">
                            {formatPkr(item.price)}
                          </span>
                        ) : item.type === 'brand' ? (
                          <span className="text-xs font-semibold text-text-tertiary">
                            View Plans →
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Footer CTA */}
              <div className="p-3 bg-bg-subtle/80 border-t border-separator flex items-center justify-between text-xs">
                <Link
                  href={`/price-list/?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => setIsOpen(false)}
                  className="font-semibold text-accent hover:underline flex items-center"
                >
                  View all results for &ldquo;{query}&rdquo; <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <span className="text-text-tertiary hidden sm:inline">Use ↑ ↓ arrows to navigate</span>
              </div>
            </div>
          ) : (
            <div className="p-5 text-center space-y-3">
              <p className="text-sm text-text-secondary">
                No subscription plan found for &ldquo;<span className="font-semibold text-text">{query}</span>&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <Link
                  href="/price-list/"
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-separator text-xs font-semibold text-text hover:border-accent transition-colors"
                >
                  Browse all 231 plans
                </Link>
                <a
                  href={buildWhatsAppLink(`Hi PakAITools, do you have ${query}?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:opacity-95 transition-opacity flex items-center"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
