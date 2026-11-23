'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Tag } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppFab';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';

export function TabBar() {
  const pathname = usePathname();
  const waUrl = buildWhatsAppLink(getGeneralWhatsAppMessage());

  const tabs = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories/', icon: Grid },
    { name: 'Prices', href: '/price-list/', icon: Tag },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg/95 backdrop-blur-md border-t border-separator px-2 py-1 shadow-lg"
      style={{ paddingBottom: 'calc(0.25rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors ${
                isActive ? 'text-accent font-semibold' : 'text-text-secondary hover:text-text'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px]">{tab.name}</span>
            </Link>
          );
        })}

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] text-text-secondary hover:text-[#25D366] transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5 mb-0.5 text-[#25D366]" />
          <span className="text-[11px] font-medium">Support</span>
        </a>
      </div>
    </nav>
  );
}
