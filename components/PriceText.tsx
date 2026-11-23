'use client';

import React from 'react';
import { useCurrency } from './CurrencyContext';
import { formatPkr, formatUsd } from '@/lib/money';
import { SITE } from '@/lib/site.config';

interface PriceTextProps {
  pkr: number | null;
  className?: string;
  showApprox?: boolean;
}

export function PriceText({ pkr, className = '', showApprox = true }: PriceTextProps) {
  const { currency } = useCurrency();

  if (pkr === null) {
    return <span className={`font-semibold ${className}`}>Live quote</span>;
  }

  const pkrFormatted = formatPkr(pkr);
  const usdFormatted = formatUsd(pkr);

  return (
    <span data-pkr={pkr} className={`inline-flex flex-col ${className}`}>
      {currency === 'PKR' ? (
        <>
          <span className="font-bold text-text">{pkrFormatted}</span>
          {showApprox && (
            <span
              className="text-[11px] text-text-tertiary cursor-help"
              title={`approx., rate as of ${SITE.rateDateDisplay} ($1 = Rs. ${SITE.pkrPerUsd})`}
            >
              ≈ {usdFormatted}*
            </span>
          )}
        </>
      ) : (
        <>
          <span className="font-bold text-text">{usdFormatted}</span>
          {showApprox && (
            <span
              className="text-[11px] text-text-tertiary cursor-help"
              title={`approx., rate as of ${SITE.rateDateDisplay} ($1 = Rs. ${SITE.pkrPerUsd})`}
            >
              ≈ {pkrFormatted}
            </span>
          )}
        </>
      )}
    </span>
  );
}
