'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

export interface HomeLinkProps {
  className?: string;
  onClick?: () => void;
  showTextOnMobile?: boolean;
}

export function HomeLink({
  className = '',
  onClick,
  showTextOnMobile = false,
}: HomeLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === '/';

  return (
    <Link
      href="/"
      aria-label="Home"
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg ${
        isActive ? 'text-accent font-semibold' : 'text-text-secondary hover:text-accent'
      } ${className}`}
    >
      <Home className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
      <span className={showTextOnMobile ? 'inline' : 'sr-only sm:not-sr-only'}>Home</span>
    </Link>
  );
}

export default HomeLink;
