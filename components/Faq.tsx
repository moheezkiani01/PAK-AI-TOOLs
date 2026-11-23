import React from 'react';
import { ChevronDown } from 'lucide-react';
import { renderMarkdown } from '@/lib/markdown';

export interface FaqItem {
  question: string;
  answer: string;
}

export function Faq({ items, title = 'Frequently Asked Questions' }: { items: FaqItem[]; title?: string }) {
  const validItems = (items || []).filter(
    (item) => item && typeof item.question === 'string' && item.question.trim().length > 0 && typeof item.answer === 'string' && item.answer.trim().length > 0
  );

  if (validItems.length === 0) return null;

  return (
    <section className="my-8" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl md:text-2xl font-bold text-text mb-4">
        {title}
      </h2>
      <div className="space-y-3">
        {validItems.map((item, idx) => (
          <details
            key={idx}
            className="group rounded-xl border border-separator bg-bg-card p-4 transition-colors open:bg-bg-subtle"
          >
            <summary className="flex items-center justify-between font-semibold text-text cursor-pointer list-none py-1 min-h-[36px]">
              <span>{item.question}</span>
              <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-200 group-open:rotate-180 text-text-tertiary flex-shrink-0" />
            </summary>
            <div
              className="mt-3 pt-3 border-t border-separator text-sm text-text-secondary leading-relaxed catalogue-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(item.answer) }}
            />
          </details>
        ))}
      </div>
    </section>
  );
}
