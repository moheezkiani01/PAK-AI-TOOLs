import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqEntry } from '@/lib/faq';

interface PackFaqProps {
  title: string;
  faqs: FaqEntry[];
  atAGlance?: {
    price: string;
    duration: string;
    warranty: string;
    account: string;
  };
  lastReviewed?: string;
  className?: string;
}

export function PackFaq({
  title,
  faqs,
  atAGlance,
  lastReviewed = 'November 26, 2026',
  className = '',
}: PackFaqProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* At a glance block */}
      {atAGlance && (
        <div className="rounded-xl border border-separator bg-bg-card p-4 text-xs md:text-sm text-text-secondary">
          <p className="font-semibold text-text leading-relaxed">
            <span className="text-text-tertiary">At a glance: </span>
            <span>Price: {atAGlance.price}</span>
            <span className="mx-2 text-separator">|</span>
            <span>Duration: {atAGlance.duration}</span>
            <span className="mx-2 text-separator">|</span>
            <span>Warranty: {atAGlance.warranty}</span>
            <span className="mx-2 text-separator">|</span>
            <span>Account / delivery: {atAGlance.account}</span>
          </p>
          {lastReviewed && (
            <p className="text-[11px] text-text-tertiary mt-2">
              Last reviewed: {lastReviewed}
            </p>
          )}
        </div>
      )}

      {/* Semantic FAQ Section matching Part 0.4 HTML pattern */}
      <section id="faq" aria-labelledby="faq-title" className="my-8 space-y-4">
        <h2 id="faq-title" className="text-xl md:text-2xl font-bold text-text">
          {title}
        </h2>
        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isRomanUrdu = item.lang === 'ru' || item.lang === 'ur-Latn';
            return (
              <details
                key={idx}
                lang={isRomanUrdu ? 'ur-Latn' : undefined}
                className="group rounded-xl border border-separator bg-bg-card p-4 transition-colors open:bg-bg-subtle"
              >
                <summary className="flex items-center justify-between font-semibold text-text cursor-pointer list-none py-1 min-h-[36px]">
                  <span>{item.q}</span>
                  <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-200 group-open:rotate-180 text-text-tertiary flex-shrink-0" />
                </summary>
                <p className="mt-3 pt-3 border-t border-separator text-sm text-text-secondary leading-relaxed">
                  {item.a}
                </p>
              </details>
            );
          })}
        </div>
        {!atAGlance && lastReviewed && (
          <p className="text-[11px] text-text-tertiary pt-1">
            Last reviewed: {lastReviewed}
          </p>
        )}
      </section>
    </div>
  );
}
