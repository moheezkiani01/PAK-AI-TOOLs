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
          aria-label="Chat with Live WhatsApp Support"
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] py-0.5 group"
        >
          <div className="relative flex flex-col items-center justify-center w-[88%] max-w-[72px] h-[46px] rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 group-hover:bg-emerald-500/20 active:scale-95 transition-all shadow-xs">
            {/* Live pulsing online indicator */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366] ring-2 ring-bg"></span>
            </span>
            <WhatsAppIcon className="w-4.5 h-4.5 text-[#25D366] transition-transform group-hover:scale-110" />
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 leading-tight mt-0.5">
              Support
            </span>
          </div>
        </a>
      </div>
    </nav>
  );
}
