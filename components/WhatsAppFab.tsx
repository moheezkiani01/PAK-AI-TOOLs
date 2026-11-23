'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';

export function WhatsAppFab({ pageUrl }: { pageUrl?: string }) {
  const url = pageUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const link = buildWhatsAppLink(getGeneralWhatsAppMessage(url));

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed right-4 z-30 bottom-[calc(4.5rem+env(safe-area-inset-bottom)+1rem)] md:bottom-6"
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with PakAITools on WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-whatsapp text-white shadow-lg hover:scale-105 active:scale-95 transition-transform"
      >
        <MessageCircle className="w-7 h-7" aria-hidden="true" />
      </a>
    </aside>
  );
}
