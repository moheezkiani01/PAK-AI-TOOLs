'use client';

import React from 'react';
import { useCurrency } from './CurrencyContext';

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Currency Selection"
      className="inline-flex rounded-lg border border-separator p-0.5 bg-bg-subtle text-xs font-semibold"
    >
      <button
        type="button"
        onClick={() => setCurrency('PKR')}
        aria-pressed={currency === 'PKR'}
        className={`px-2.5 py-1.5 rounded-md transition-colors min-h-[32px] min-w-[44px] ${
          currency === 'PKR'
            ? 'bg-accent text-accent-on shadow-sm'
            : 'text-text-secondary hover:text-text'
        }`}
      >
        PKR
      </button>
      <button
        type="button"
        onClick={() => setCurrency('USD')}
        aria-pressed={currency === 'USD'}
        className={`px-2.5 py-1.5 rounded-md transition-colors min-h-[32px] min-w-[44px] ${
          currency === 'USD'
            ? 'bg-accent text-accent-on shadow-sm'
            : 'text-text-secondary hover:text-text'
        }`}
      >
        USD
      </button>
    </div>
  );
}
