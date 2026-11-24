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

export function wrapInGraph(nodes: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(),
      getWebSiteSchema(),
      ...nodes.filter(Boolean),
    ],
  };
}

export function getHomepageSchema(faqs?: Array<{ question: string; answer: string }>) {
  const nodes: any[] = [];
  if (faqs && faqs.length > 0) {
    const faqSchema = getFaqSchema(faqs);
    if (faqSchema) nodes.push(faqSchema);
  }
  return wrapInGraph(nodes);
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
  return wrapInGraph([getBreadcrumbSchema(items)]);
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
  const nodes: any[] = [];
  const canonicalUrl = `${SITE.domain}/product/${product.slug}/`;

  // Use brand display name (e.g. Canva) and category display name (e.g. Design & Creative) instead of slugs
  const brandObj = getBrandBySlug(product.brandSlug);
  const categoryObj = getCategoryBySlug(product.categorySlug);

  let brandName = brandObj?.displayName || product.brandSlug;
  if (product.brandSlug === 'canva') {
    brandName = 'Canva';
  }
  const categoryName = categoryObj?.name || product.categorySlug;

  // Use product image of at least 1200x630 (og-default.png is 1200x630) instead of 128px logo
  const productImage = `${SITE.domain}/og-default.png`;

  // Sourced from data: date no more than 90 days out
  const priceValidUntil = (product as any).priceValidUntil || SITE.priceValidUntil || '2027-02-20';

  if (product.price !== null) {
    nodes.push({
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
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'PKR',
        price: product.price.toString(),
        priceValidUntil: priceValidUntil,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@id': `${SITE.domain}/#organization`,
        },
      },
    });
  } else {
    nodes.push({
      '@type': 'WebPage',
      '@id': canonicalUrl,
      url: canonicalUrl,
      name: product.h1,
      description: product.answer,
    });
  }

  nodes.push(getBreadcrumbSchema(breadcrumbs));

  if (product.faqs && product.faqs.length > 0) {
    const faqSchema = getFaqSchema(product.faqs);
    if (faqSchema) nodes.push(faqSchema);
  }

  return wrapInGraph(nodes);
}

export function getCollectionSchema(
  title: string,
  url: string,
  breadcrumbs: Array<{ name: string; url: string }>,
  faqs?: Array<{ question: string; answer: string }>
) {
  const canonical = `${SITE.domain}${url}`;
  const nodes: any[] = [
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
    if (faqSchema) nodes.push(faqSchema);
  }

  return wrapInGraph(nodes);
}

export function getAboutSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return wrapInGraph([
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
  ]);
}

export function getContactSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return wrapInGraph([
    {
      '@type': 'ContactPage',
      name: 'Contact PakAITools',
      url: `${SITE.domain}/contact/`,
    },
    getBreadcrumbSchema(breadcrumbs),
  ]);
}
