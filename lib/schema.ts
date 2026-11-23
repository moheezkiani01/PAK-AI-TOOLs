import { SITE } from './site.config';
import type { Product, CategoryHub, BrandHub, BlogPost } from './types';

export function getOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE.domain}/#organization`,
    name: SITE.name,
    url: SITE.domain,
    logo: `${SITE.domain}/logo-512.png`,
    founder: {
      '@type': 'Person',
      name: SITE.founder,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${SITE.whatsapp}`,
      contactType: 'customer service',
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
  breadcrumbs: Array<{ name: string; url: string }>
) {
  const graph: any[] = [];
  const canonicalUrl = `${SITE.domain}/product/${product.slug}/`;

  if (product.price !== null) {
    graph.push({
      '@type': 'Product',
      name: product.name,
      description: product.answer,
      image: `${SITE.domain}/og-default.png`,
      sku: `PAT-${product.id}`,
      brand: {
        '@type': 'Brand',
        name: product.brandSlug,
      },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'PKR',
        price: product.price.toString(),
        priceValidUntil: SITE.priceValidUntil,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: SITE.name,
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
