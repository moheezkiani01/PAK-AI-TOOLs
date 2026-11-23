import React from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site.config';
import { getCategories } from '@/lib/data';

export function Footer() {
  const categories = getCategories();

  return (
    <footer className="border-t border-separator bg-bg-card text-text-secondary mt-16 pb-16 md:pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Categories */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="font-bold text-text text-sm uppercase tracking-wider mb-4">
              Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}/`}
                  className="hover:text-accent transition-colors py-0.5 truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="font-bold text-text text-sm uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/price-list/" className="hover:text-accent transition-colors">
                  Full Price List
                </Link>
              </li>
              <li>
                <Link href="/categories/" className="hover:text-accent transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="hover:text-accent transition-colors">
                  Blog & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Policies */}
          <div>
            <h3 className="font-bold text-text text-sm uppercase tracking-wider mb-4">
              Trust & Support
            </h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/payment-methods/" className="hover:text-accent transition-colors">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/refund-warranty-policy/" className="hover:text-accent transition-colors">
                  Refund & Warranty
                </Link>
              </li>
              <li>
                <Link href="/about/" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-accent transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy/" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms/" className="hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Brand Note */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="font-bold text-text text-sm uppercase tracking-wider mb-4">
              About Store
            </h3>
            <p className="text-xs text-text-tertiary leading-relaxed mb-3">
              {SITE.name} is Pakistan&apos;s digital tools reseller. Pay locally in PKR with JazzCash, EasyPaisa, SadaPay, or Binance with WhatsApp support.
            </p>
            <p className="text-xs text-text-secondary">
              WhatsApp:{' '}
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-semibold"
              >
                {SITE.whatsappDisplay}
              </a>
            </p>
          </div>
        </div>

        {/* Disclaimers & Copyright */}
        <div className="pt-8 border-t border-separator text-xs text-text-tertiary space-y-3">
          <p>
            Brand names and logos belong to their respective owners. {SITE.name} is an independent reseller and is not affiliated with, sponsored by, or officially partnered with them.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
            <p>Founder & Owner: {SITE.founder} · support@aitoolspak.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
