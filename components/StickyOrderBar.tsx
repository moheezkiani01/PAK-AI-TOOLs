'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink, getProductWhatsAppMessage } from '@/lib/whatsapp';
import { formatPkr } from '@/lib/money';
import { useCurrency } from './CurrencyContext';

interface StickyOrderBarProps {
  planName: string;
  price: number | null;
  duration: string;
  slug: string;
}

export function StickyOrderBar({ planName, price, duration, slug }: StickyOrderBarProps) {
  const [visible, setVisible] = useState(false);
  const { currency } = useCurrency();

  useEffect(() => {
    const buyCard = document.getElementById('product-buy-card');
    if (!buyCard) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar only when buyCard is NOT intersecting (scrolled past)
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(buyCard);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://pakaitools.store/product/${slug}/`;
  const waLink = buildWhatsAppLink(
    getProductWhatsAppMessage(planName, price, duration, pageUrl, currency === 'USD')
  );

  return (
    <aside
      aria-label="Quick order bar"
      className="md:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 bg-bg-card border-t border-separator px-4 py-2 flex items-center justify-between shadow-lg"
    >
      <div className="flex flex-col min-w-0 pr-3">
        <span className="text-xs font-medium text-text-secondary truncate">{planName}</span>
        <span className="text-sm font-bold text-text">
          {price !== null ? formatPkr(price) : 'Live quote'}
        </span>
      </div>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center bg-accent text-accent-on px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap min-h-[44px] shadow-sm hover:opacity-95"
      >
        <MessageCircle className="w-4 h-4 mr-1.5" />
        Order on WhatsApp
      </a>
    </aside>
  );
}
