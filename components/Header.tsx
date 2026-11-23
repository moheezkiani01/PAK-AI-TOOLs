'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown, Tag, Scale, BookOpen, CreditCard, Sparkles } from 'lucide-react';
import { SITE } from '@/lib/site.config';
import { CurrencyToggle } from './CurrencyToggle';
import { ThemeToggle } from './ThemeToggle';
import { SearchModal } from './SearchModal';
import { WhatsAppIcon } from './WhatsAppFab';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '@/lib/whatsapp';

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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Global Ctrl+K / Cmd+K listener & Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setCategoriesDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const headerWaUrl = buildWhatsAppLink(getGeneralWhatsAppMessage());

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur-md border-b border-separator shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-2.5 min-h-[44px] flex-shrink-0 group">
            <img
              src="/logo-96.webp"
              alt="PakAITools Logo"
              width={34}
              height={34}
              className="w-8.5 h-8.5 rounded-lg object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg md:text-xl tracking-tight text-text leading-tight">
                {SITE.name}
              </span>
              <span className="text-[10px] text-text-tertiary font-medium hidden sm:inline leading-none">
                Verified PKR Subscriptions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Focused, spacious, clean) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center space-x-5 text-sm font-medium text-text-secondary">
            {/* Categories Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`flex items-center space-x-1.5 py-2 hover:text-accent transition-colors focus:outline-none ${
                  categoriesDropdownOpen ? 'text-accent' : ''
                }`}
                aria-expanded={categoriesDropdownOpen}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoriesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-[420px] z-50">
                  <div className="rounded-2xl border border-separator bg-bg-card shadow-card p-4 grid grid-cols-2 gap-1.5">
                    <div className="col-span-2 pb-2 mb-1 border-b border-separator/80 flex items-center justify-between text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-1">
                      <span>Explore 15 Categories</span>
                      <Link
                        href="/categories/"
                        className="text-accent hover:underline lowercase font-semibold"
                      >
                        view all hubs →
                      </Link>
                    </div>
                    {ALL_15_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.url}
                        href={cat.url}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-text hover:bg-bg-subtle hover:text-accent transition-colors truncate"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/price-list/"
              className={`hover:text-accent transition-colors py-2 flex items-center space-x-1 ${
                pathname === '/price-list/' ? 'text-accent font-semibold' : ''
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-accent" />
              <span>Price List</span>
            </Link>

            <Link
              href="/compare/"
              className={`hover:text-accent transition-colors py-2 flex items-center space-x-1 ${
                pathname.startsWith('/compare') ? 'text-accent font-semibold' : ''
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare</span>
            </Link>

            <Link
              href="/blog/"
              className={`hover:text-accent transition-colors py-2 flex items-center space-x-1 ${
                pathname.startsWith('/blog') ? 'text-accent font-semibold' : ''
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Blog &amp; Guides</span>
            </Link>

            <Link
              href="/payment-methods/"
              className={`hover:text-accent transition-colors py-2 flex items-center space-x-1 ${
                pathname === '/payment-methods/' ? 'text-accent font-semibold' : ''
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-separator text-text-secondary hover:text-text bg-bg-card hover:bg-bg-subtle transition-colors min-h-[40px] text-xs font-medium"
              aria-label="Search plans (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-text-tertiary" />
              <span className="hidden xl:inline">Search plans...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-bg-subtle text-[10px] text-text-tertiary border border-separator/80">
                ⌘K
              </kbd>
            </button>

            {/* Currency toggle */}
            <CurrencyToggle />

            {/* Theme toggle (Desktop) */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Desktop WhatsApp CTA Button */}
            <a
              href={headerWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center bg-[#25D366] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:opacity-95 transition-all min-h-[40px] whitespace-nowrap"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 mr-1.5" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-separator text-text min-h-[40px] min-w-[40px] flex items-center justify-center bg-bg-card hover:bg-bg-subtle transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-[310px] sm:w-[360px] bg-bg-card shadow-2xl flex flex-col z-50 border-l border-separator">
            {/* Drawer Header */}
            <div className="p-4 border-b border-separator flex items-center justify-between bg-bg-subtle/50">
              <div className="flex items-center space-x-2">
                <img
                  src="/logo-96.webp"
                  alt="PakAITools Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-md object-contain"
                />
                <span className="font-bold text-base text-text">{SITE.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl border border-separator text-text hover:bg-bg-subtle transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Quick Search inside Drawer */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-separator bg-bg-subtle text-text-secondary text-xs font-medium min-h-[42px]"
              >
                <span className="flex items-center">
                  <Search className="w-4 h-4 mr-2 text-text-tertiary" />
                  Search all 231 plans...
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-separator text-[10px]">
                  Ctrl+K
                </kbd>
              </button>

              {/* Core Links Grid */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/price-list/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl border border-separator bg-bg-subtle text-xs font-bold text-text hover:text-accent hover:border-accent transition-colors flex items-center space-x-2 min-h-[44px]"
                >
                  <Tag className="w-4 h-4 text-accent" />
                  <span>Price List</span>
                </Link>
                <Link
                  href="/compare/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl border border-separator bg-bg-subtle text-xs font-bold text-text hover:text-accent hover:border-accent transition-colors flex items-center space-x-2 min-h-[44px]"
                >
                  <Scale className="w-4 h-4 text-accent" />
                  <span>Compare</span>
                </Link>
                <Link
                  href="/blog/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl border border-separator bg-bg-subtle text-xs font-bold text-text hover:text-accent hover:border-accent transition-colors flex items-center space-x-2 min-h-[44px]"
                >
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span>Blog &amp; Guides</span>
                </Link>
                <Link
                  href="/payment-methods/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl border border-separator bg-bg-subtle text-xs font-bold text-text hover:text-accent hover:border-accent transition-colors flex items-center space-x-2 min-h-[44px]"
                >
                  <CreditCard className="w-4 h-4 text-accent" />
                  <span>How to Pay</span>
                </Link>
              </div>

              {/* 15 Categories Section */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                    Browse Categories
                  </span>
                  <Link
                    href="/categories/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    All 15 hubs →
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {ALL_15_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.url}
                      href={cat.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg text-xs font-medium text-text hover:bg-bg-subtle hover:text-accent transition-colors flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-text-tertiary">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust & Policy Links */}
              <div className="pt-2 border-t border-separator space-y-1 text-xs">
                <div className="grid grid-cols-2 gap-2 py-1 text-text-secondary">
                  <Link
                    href="/refund-warranty-policy/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-text py-1"
                  >
                    Refund &amp; Warranty
                  </Link>
                  <Link
                    href="/about/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-text py-1"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-text py-1"
                  >
                    Contact Support
                  </Link>
                  <Link
                    href="/privacy-policy/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-text py-1"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Bottom WhatsApp CTA */}
            <div className="p-4 border-t border-separator bg-bg-subtle/50">
              <a
                href={headerWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-[#25D366] text-white px-4 py-3 rounded-xl font-bold text-xs shadow-sm hover:opacity-95 transition-opacity min-h-[44px]"
              >
                <WhatsAppIcon className="w-4 h-4 mr-2" />
                <span>Chat on WhatsApp (+92 321 9305619)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
