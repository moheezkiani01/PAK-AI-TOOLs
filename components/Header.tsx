'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { SITE } from '@/lib/site.config';
import { CurrencyToggle } from './CurrencyToggle';
import { ThemeToggle } from './ThemeToggle';
import { SearchModal } from './SearchModal';

const NAV_CATEGORIES = [
  { name: 'AI Chatbots', url: '/ai-chatbots/' },
  { name: 'Design & Creative', url: '/design-creative/' },
  { name: 'Video Editing', url: '/video-editing/' },
  { name: 'Streaming', url: '/streaming/' },
  { name: 'VPN & Privacy', url: '/vpn-privacy/' },
  { name: 'AI Video', url: '/ai-video-image/' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-separator transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-2.5 min-h-[44px]">
            <img
              src="/logo-96.webp"
              alt=""
              width={36}
              height={36}
              className="w-9 h-9 rounded-lg object-contain"
            />
            <span className="font-bold text-lg md:text-xl tracking-tight text-text">
              {SITE.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-5 text-sm font-medium text-text-secondary">
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.url}
                href={cat.url}
                className="hover:text-accent transition-colors py-1"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/price-list/"
              className="hover:text-accent transition-colors py-1"
            >
              Price List
            </Link>
            <Link
              href="/blog/"
              className="hover:text-accent transition-colors py-1"
            >
              Blog
            </Link>
          </nav>

          {/* Actions: Search Button & Currency Toggle & Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Search Quick Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-separator text-text-secondary hover:text-text bg-bg-card transition-colors min-h-[40px] text-xs font-medium"
              aria-label="Search plans (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-text-tertiary" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-bg-subtle text-[10px] text-text-tertiary border border-separator/80">
                ⌘K
              </kbd>
            </button>

            <CurrencyToggle />
            <ThemeToggle />

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-separator text-text min-h-[40px] min-w-[40px] flex items-center justify-center bg-bg-card"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-separator bg-bg-card px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-2 py-1">
              Top Categories
            </div>
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.url}
                href={cat.url}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-text hover:bg-bg-subtle"
              >
                {cat.name}
              </Link>
            ))}
            <div className="border-t border-separator my-2 pt-2">
              <Link
                href="/categories/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-text hover:bg-bg-subtle"
              >
                All 15 Categories →
              </Link>
              <Link
                href="/price-list/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-text hover:bg-bg-subtle"
              >
                Full Price List (All Plans)
              </Link>
              <Link
                href="/blog/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-text hover:bg-bg-subtle"
              >
                Blog &amp; Buying Guides
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
