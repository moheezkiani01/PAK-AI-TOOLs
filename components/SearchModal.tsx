'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Tag, Grid, Layers, BookOpen } from 'lucide-react';
import { formatPkr } from '@/lib/money';
import { searchCatalog, SearchItem } from '@/lib/search';

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load search-index.json only on first open
  useEffect(() => {
    if (isOpen && items.length === 0) {
      setLoading(true);
      fetch('/search-index.json')
        .then((res) => res.json())
        .then((data: SearchItem[]) => {
          setItems(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, items.length]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Filter and rank items based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const matched = searchCatalog(items, query, 8);
    setResults(matched);
    setSelectedIndex(0);
  }, [query, items]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        router.push(results[selectedIndex].url);
        onClose();
      } else if (query.trim()) {
        router.push(`/price-list/?q=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search plans and categories"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-separator bg-bg-card shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="relative flex items-center px-4 border-b border-separator bg-bg">
          <Search className="w-5 h-5 text-text-tertiary flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search all 231 plans, brands or guides (e.g. Canva, ChatGPT, Netflix)..."
            className="w-full py-4 pl-3 pr-8 bg-transparent text-text placeholder-text-tertiary focus:outline-none text-sm md:text-base min-h-[56px]"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-tertiary hover:text-text hover:bg-bg-subtle"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-separator/40">
          {loading && (
            <div className="py-8 text-center text-xs text-text-tertiary">
              Loading search index...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm text-text-secondary">No direct results for &ldquo;{query}&rdquo;.</p>
              <button
                type="button"
                onClick={() => {
                  router.push(`/price-list/?q=${encodeURIComponent(query)}`);
                  onClose();
                }}
                className="text-xs text-accent font-semibold hover:underline"
              >
                Search all 231 plans in Price List →
              </button>
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 px-4 text-center text-xs text-text-tertiary">
              Type to search plans, categories, brand hubs, or buying guides.
            </div>
          )}

          {results.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.url + idx}
                onClick={() => {
                  router.push(item.url);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  isSelected ? 'bg-accent/10 border-accent/20' : 'hover:bg-bg-subtle'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-3">
                  <span className="p-2 rounded-lg bg-bg-subtle border border-separator text-text-tertiary flex-shrink-0">
                    {item.type === 'plan' || item.type === 'merged_plan' ? (
                      <Tag className="w-4 h-4 text-accent" />
                    ) : item.type === 'brand' ? (
                      <Layers className="w-4 h-4 text-accent" />
                    ) : item.type === 'category' ? (
                      <Grid className="w-4 h-4 text-accent" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-accent" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-text truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-text-tertiary">
                      <span className="uppercase text-[10px] tracking-wider font-bold text-accent">
                        {item.type.replace('_', ' ')}
                      </span>
                      {item.duration && <span>· {item.duration}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {item.price !== undefined && (
                    <span className="text-xs font-bold text-text">
                      {item.price !== null ? formatPkr(item.price) : 'Live Quote'}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-text-tertiary" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="p-3 border-t border-separator bg-bg-subtle flex items-center justify-between text-[11px] text-text-tertiary">
          <span>Navigate with <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-separator">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-separator">↓</kbd></span>
          <span>Open with <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-separator">Enter</kbd></span>
          <span>Close with <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-separator">Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
