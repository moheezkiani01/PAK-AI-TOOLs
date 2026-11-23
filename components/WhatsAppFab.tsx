'use client';

import React from 'react';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';

export function WhatsAppIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.08l-.29-.17-3.12.82.83-3.04-.19-.3a8.163 8.163 0 0 1-1.25-4.46c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29" />
    </svg>
  );
}

export function WhatsAppFab({ pageUrl, customMessage }: { pageUrl?: string; customMessage?: string }) {
  const url = pageUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const link = buildWhatsAppLink(customMessage || getGeneralWhatsAppMessage(url));

  return (
    <aside
      aria-label="WhatsApp Support"
      className="hidden md:flex fixed right-5 bottom-6 z-30 items-center"
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 pl-4 pr-5 py-3 space-x-2.5 min-h-[56px]"
      >
        <WhatsAppIcon className="w-6 h-6 text-white flex-shrink-0" />
        <span className="font-bold text-sm tracking-wide">Chat with us</span>
      </a>
    </aside>
  );
}
