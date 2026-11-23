import { SITE } from './site.config';
import type { Product, CategoryHub, BrandHub, BlogPost } from './types';

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
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.domain}/price-list/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
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

export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function getProductSchema(
  product: Product,
  breadcrumbs: Array<{ name: string; url: string }>,
  brandLogo?: string | null
) {
  const graph: any[] = [];
  const canonicalUrl = `${SITE.domain}/product/${product.slug}/`;

  if (product.price !== null) {
    const imageUrl = brandLogo
      ? (brandLogo.startsWith('http') ? brandLogo : `${SITE.domain}${brandLogo}`)
      : `${SITE.domain}/og-default.png`;

    graph.push({
      '@type': 'Product',
      '@id': `${canonicalUrl}#product`,
      name: product.name,
      description: product.answer,
      image: [imageUrl],
      sku: product.slug,
      brand: {
        '@type': 'Brand',
        name: product.brandSlug,
      },
      category: product.categorySlug,
      url: canonicalUrl,
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'PKR',
        price: product.price.toString(),
        priceValidUntil: SITE.priceValidUntil,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@id': `${SITE.domain}/#organization`,
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          url: `${SITE.domain}/refund-warranty-policy/`,
        },
      },
    });
  } else {
    // Quote-only plans
    graph.push({
      '@type': 'WebPage',
      '@id': canonicalUrl,
      url: canonicalUrl,
      name: product.h1,
      description: product.answer,
    });
  }

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
