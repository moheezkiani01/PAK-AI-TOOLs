import { SITE } from './site.config';

/**
 * Shared Open Graph base configuration.
 * Next.js replaces openGraph completely if defined at page-level,
 * so page-level generateMetadata spread this object to preserve
 * locale, siteName, type, and standard 1200x630 share dimensions.
 */
export const baseOg = {
  type: 'website' as const,
  siteName: SITE.name,
  locale: 'en_PK',
  images: [
    {
      url: '/og-default.png',
      width: 1200,
      height: 630,
      alt: 'PakAITools: AI tools and subscriptions in Pakistan, priced in PKR',
    },
  ],
};

/**
 * Drops trailing parenthetical (e.g. "(Warranty)") if the full page title
 * including brand suffix is longer than 60 characters.
 * Returns the cleaned title without brand suffix.
 */
export function optimizeSeoTitle(rawTitle: string): string {
  let clean = (rawTitle || '').replace(/\s*\|\s*PakAITools\s*$/i, '').trim();
  const full = `${clean} | PakAITools`;
  if (full.length > 60 && /\s*\([^)]+\)\s*$/.test(clean)) {
    clean = clean.replace(/\s*\([^)]+\)\s*$/, '').trim();
  }
  return clean;
}

