'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Currency = 'PKR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'PKR',
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('PKR');

  useEffect(() => {
    // 1. Check saved choice
    const saved = localStorage.getItem('pat_currency') as Currency | null;
    if (saved === 'PKR' || saved === 'USD') {
      setCurrencyState(saved);
      return;
    }

    // 2. Try Cloudflare trace or Timezone
    try {
      fetch('/cdn-cgi/trace')
        .then((res) => res.text())
        .then((text) => {
          const match = text.match(/loc=([A-Z]{2})/);
          if (match && match[1] === 'PK') {
            setCurrencyState('PKR');
          } else if (match && match[1]) {
            setCurrencyState('USD');
          }
        })
        .catch(() => {
          // Fallback to timezone
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz !== 'Asia/Karachi') {
            // Stay PKR per spec rule: "Never guess USD on failure"
            setCurrencyState('PKR');
          }
        });
    } catch {
      // Keep default PKR
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('pat_currency', c);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
