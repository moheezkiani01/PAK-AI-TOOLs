import fs from 'node:fs';
import path from 'node:path';
import { SITE } from './site.config';
import type { Product, CategoryHub, BrandHub, BlogPost } from './types';
import { getBrandBySlug, getCategoryBySlug } from './data';

export function getOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE.domain}/#organization`,
    name: SITE.name,
    url: SITE.domain,
    logo: `${SITE.domain}/icon-192.png`,
    email: SITE.email,
    founder: {
      '@type': 'Person',
      name: SITE.founder,
    },
    areaServed: 'PK',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${SITE.whatsapp}`,
      contactType: 'customer support',
      email: SITE.email,
      availableLanguage: ['English', 'Urdu'],
    },
  };
}

export function getWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.domain}/#website`,
    url: SITE.domain,
    name: SITE.name,
    alternateName: ['Pak AI Tools', 'pakaitools.store'],
    inLanguage: 'en-PK',
    publisher: {
      '@id': `${SITE.domain}/#organization`,
    },
  };
}

/**
 * Site-wide schema containing Organization and WebSite in a single @graph with @context.
 * Placed in layout <head> so every page has Organization and WebSite.
 */
export function getSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(),
      getWebSiteSchema(),
    ],
  };
}

export function wrapInGraph(nodes: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE.domain}${item.url}`,
    })),
  };
}

export function getBreadcrumbGraphSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@graph': [getBreadcrumbSchema(items)],
  };
}

export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: (f.answer || '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'),
      },
    })),
  };
}

export function getProductSchema(
  product: Product,
  breadcrumbs: Array<{ name: string; url: string }>,
  _brandLogo?: string | null
) {
  const graph: any[] = [];
  const canonicalUrl = `${SITE.domain}/product/${product.slug}/`;

  // Use brand display name (e.g. "Canva") and category display name (e.g. "Design & Creative")
  const brandObj = getBrandBySlug(product.brandSlug);
  const categoryObj = getCategoryBySlug(product.categorySlug);

  let brandName = brandObj?.displayName || product.brandSlug;
  if (product.brandSlug === 'canva') {
    brandName = 'Canva';
  }
  const categoryName = categoryObj?.name || product.categorySlug;

  // Requirement 2: Use each product's own PNG for Product schema image. Fall back to /og-default.png if missing.
  const ogPngPath = path.join(process.cwd(), 'public', 'og', `${product.slug}.png`);
  const hasCustomOg = fs.existsSync(ogPngPath);
  const productImage = hasCustomOg
    ? `${SITE.domain}/og/${product.slug}.png`
    : `${SITE.domain}/og-default.png`;

  // Price valid until date: no more than 90 days out, sourced from product or site config data
  const priceValidUntil = (product as any).priceValidUntil || SITE.priceValidUntil || '2027-02-20';

  const offers: any = {
    '@type': 'Offer',
    url: canonicalUrl,
    priceCurrency: 'PKR',
    priceValidUntil: priceValidUntil,
    availability: product.price !== null ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@id': `${SITE.domain}/#organization`,
    },
  };
  if (product.price !== null) {
    offers.price = product.price.toString();
  }

  graph.push({
    '@type': 'Product',
    '@id': `${canonicalUrl}#product`,
    name: product.name,
    description: product.answer,
    image: [productImage],
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    category: categoryName,
    url: canonicalUrl,
    offers,
  });

  graph.push(getBreadcrumbSchema(breadcrumbs));

  if (product.faqs && product.faqs.length > 0) {
    const faqSchema = getFaqSchema(product.faqs);
    if (faqSchema) graph.push(faqSchema);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function getCollectionSchema(
  title: string,
  url: string,
  breadcrumbs: Array<{ name: string; url: string }>,
  faqs?: Array<{ question: string; answer: string }>
) {
  const canonical = `${SITE.domain}${url}`;
  const graph: any[] = [
    {
      '@type': 'CollectionPage',
      '@id': canonical,
      url: canonical,
      name: title,
    },
    getBreadcrumbSchema(breadcrumbs),
  ];

  if (faqs && faqs.length > 0) {
    const faqSchema = getFaqSchema(faqs);
    if (faqSchema) graph.push(faqSchema);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function getAboutSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'About PakAITools',
        url: `${SITE.domain}/about/`,
        mainEntity: {
          '@type': 'Person',
          name: SITE.founder,
          jobTitle: 'Founder',
        },
      },
      getBreadcrumbSchema(breadcrumbs),
    ],
  };
}

export function getContactSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        name: 'Contact PakAITools',
        url: `${SITE.domain}/contact/`,
      },
      getBreadcrumbSchema(breadcrumbs),
    ],
  };
}
