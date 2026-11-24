import type { Metadata } from 'next';
import { SITE, SITE_URL } from './site.config';

/**
 * Shared Open Graph base configuration.
 */
export const baseOg = {
  type: 'website' as const,
  siteName: SITE.name,
  locale: 'en_PK',
  images: [
    {
      url: `${SITE_URL}/og-default.png`,
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

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  type?: 'website' | 'article';
}

/**
 * Generates complete, uniform metadata across all page templates.
 * Guarantees title, meta description, canonical, complete OpenGraph and Twitter cards.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
}: PageMetadataInput): Metadata {
  const cleanTitle = optimizeSeoTitle(title);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`}`;

  const ogImage = image
    ? {
        url: image.url.startsWith('http')
          ? image.url
          : `${SITE_URL}${image.url.startsWith('/') ? '' : '/'}${image.url}`,
        width: image.width || 1200,
        height: image.height || 630,
        alt: image.alt || cleanTitle,
      }
    : {
        url: `${SITE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'PakAITools: AI tools and subscriptions in Pakistan, priced in PKR',
      };

  return {
    title: cleanTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: cleanTitle,
      description,
      url: canonicalUrl,
      siteName: SITE.name,
      locale: 'en_PK',
      type,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description,
      images: [ogImage.url],
    },
  };
}
