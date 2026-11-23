import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  const parent = items.length > 1 ? items[items.length - 2] : null;

  return (
    <nav aria-label="Breadcrumb" className="my-4 text-xs md:text-sm">
      {/* Mobile back link */}
      {parent && (
        <div className="md:hidden flex items-center mb-2">
          <Link
            href={parent.url}
            className="inline-flex items-center text-accent hover:underline font-medium min-h-[44px] py-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to {parent.name}
          </Link>
        </div>
      )}

      {/* Desktop & SEO full breadcrumb list */}
      <ol className="hidden md:flex flex-wrap items-center gap-1.5 text-text-secondary">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.url} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-text-tertiary" aria-hidden="true" />
              )}
              {isLast ? (
                <span className="font-semibold text-text" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-accent hover:underline transition-colors py-1"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
