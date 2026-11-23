'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { SITE } from '@/lib/site.config';
import { CurrencyToggle } from './CurrencyToggle';
import { ThemeToggle } from './ThemeToggle';
import { SearchModal } from './SearchModal';
import { WhatsAppIcon } from './WhatsAppFab';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';

const TOP_CATEGORIES = [
  { name: 'AI Chatbots', url: '/ai-chatbots/' },
  { name: 'Design & Creative', url: '/design-creative/' },
  { name: 'Video Editing', url: '/video-editing/' },
  { name: 'AI APIs', url: '/ai-apis/' },
  { name: 'AI Video', url: '/ai-video-image/' },
];

const ALL_15_CATEGORIES = [
  { name: 'AI Chatbots', url: '/ai-chatbots/' },
  { name: 'AI APIs', url: '/ai-apis/' },
  { name: 'AI Video & Image', url: '/ai-video-image/' },
  { name: 'AI Voice & Audio', url: '/ai-voice-audio/' },
  { name: 'Design & Creative', url: '/design-creative/' },
  { name: 'Video Editing', url: '/video-editing/' },
  { name: 'Developer Tools', url: '/developer-tools/' },
  { name: 'Productivity Software', url: '/productivity-software/' },
  { name: 'VPN & Privacy', url: '/vpn-privacy/' },
  { name: 'Antivirus', url: '/antivirus/' },
  { name: 'Antidetect & Proxies', url: '/antidetect-proxies/' },
  { name: 'Cloud Storage', url: '/cloud-storage/' },
  { name: 'Education', url: '/education/' },
  { name: 'Streaming', url: '/streaming/' },
  { name: 'Travel eSIM', url: '/esim/' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setMoreDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const headerWaUrl = buildWhatsAppLink(getGeneralWhatsAppMessage());

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur-md border-b border-separator shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-2.5 min-h-[44px] flex-shrink-0">
            <img
              src="/logo-96.webp"
              alt="PakAITools Logo"
              width={36}
              height={36}
              className="w-9 h-9 rounded-lg object-contain"
            />
            <span className="font-bold text-lg md:text-xl tracking-tight text-text">
              {SITE.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center space-x-4 text-sm font-medium text-text-secondary">
            {TOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.url}
                href={cat.url}
                className="hover:text-accent transition-colors py-1.5"
              >
                {cat.name}
              </Link>
            ))}

            {/* More Categories Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
                className="flex items-center space-x-1 hover:text-accent transition-colors py-1.5 focus:outline-none"
                aria-expanded={moreDropdownOpen}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-separator bg-bg-card shadow-card p-3 z-50 grid grid-cols-1 gap-1">
                  <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1">
                    All Categories
                  </div>
                  {ALL_15_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.url}
                      href={cat.url}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-text hover:bg-bg-subtle hover:text-accent transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-separator mt-1 pt-1">
                    <Link
                      href="/categories/"
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-accent hover:underline block"
                    >
                      Browse All 15 Hubs →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/price-list/" className="hover:text-accent transition-colors py-1.5 font-semibold">
              Price List
            </Link>
            <Link href="/compare/" className="hover:text-accent transition-colors py-1.5">
              Compare
            </Link>
            <Link href="/blog/" className="hover:text-accent transition-colors py-1.5">
              Blog
            </Link>
          </nav>

          {/* Actions: Search Button & Currency Toggle & Theme Toggle & Desktop WhatsApp & Mobile Hamburger */}
          <div className="flex items-center space-x-2">
            {/* Search Quick Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-separator text-text-secondary hover:text-text bg-bg-card transition-colors min-h-[44px] text-xs font-medium"
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

            {/* Desktop WhatsApp CTA */}
            <a
              href={headerWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center bg-[#25D366] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:opacity-95 transition-all min-h-[44px]"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 mr-1.5" />
              <span>Chat</span>
            </a>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-separator text-text min-h-[44px] min-w-[44px] flex items-center justify-center bg-bg-card hover:bg-bg-subtle transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full Slide-in / Drawer Navigation */}
        <div
          className={`lg:hidden border-b border-separator bg-bg-card px-4 pt-3 pb-8 space-y-4 max-h-[85vh] overflow-y-auto ${
            mobileMenuOpen ? 'block' : 'hidden'
          }`}
          role="dialog"
          aria-label="Mobile Navigation Menu"
        >
          {/* Quick Search inside Drawer */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(true);
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-separator bg-bg-subtle text-text-secondary text-xs font-medium min-h-[44px]"
          >
            <span className="flex items-center">
              <Search className="w-4 h-4 mr-2 text-text-tertiary" />
              Search all 231 plans...
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-separator text-[10px]">
              Ctrl+K
            </kbd>
          </button>

          {/* Core Navigation Links */}
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/price-list/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl border border-separator bg-bg-subtle text-center text-xs font-bold text-accent min-h-[44px] flex items-center justify-center"
            >
              Price List
            </Link>
            <Link
              href="/compare/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl border border-separator bg-bg-subtle text-center text-xs font-bold text-text min-h-[44px] flex items-center justify-center"
            >
              Compare
            </Link>
            <Link
              href="/blog/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl border border-separator bg-bg-subtle text-center text-xs font-bold text-text min-h-[44px] flex items-center justify-center"
            >
              Blog
            </Link>
          </div>

          {/* All 15 Categories Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                All 15 Categories
              </span>
              <Link
                href="/categories/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-accent hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_15_CATEGORIES.map((cat) => (
                <Link
                  key={cat.url}
                  href={cat.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-text bg-bg-subtle/50 hover:bg-bg-subtle hover:text-accent transition-colors min-h-[44px] flex items-center"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Trust & Policy Links */}
          <div className="pt-2 border-t border-separator space-y-1 text-xs">
            <div className="grid grid-cols-2 gap-2 py-1">
              <Link
                href="/payment-methods/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-text py-1"
              >
                Payment Methods
              </Link>
              <Link
                href="/refund-warranty-policy/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-text py-1"
              >
                Refund &amp; Warranty
              </Link>
              <Link
                href="/about/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-text py-1"
              >
                About PakAITools
              </Link>
              <Link
                href="/contact/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-text py-1"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* WhatsApp Action Button in Drawer */}
          <a
            href={headerWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center bg-[#25D366] text-white px-4 py-3 rounded-xl font-bold text-sm shadow-sm hover:opacity-95 transition-opacity min-h-[48px]"
          >
            <WhatsAppIcon className="w-5 h-5 mr-2" />
            Chat with PakAITools on WhatsApp
          </a>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
