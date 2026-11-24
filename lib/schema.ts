import fs from 'node:fs';
import path from 'node:path';
import { SITE, SITE_URL } from './site.config';
import type { Product, CategoryHub, BrandHub, BlogPost } from './types';
import type { AINewsPost } from './ai-news';
import { getBrandBySlug, getCategoryBySlug } from './data';

export function getOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE.name,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-192.png`,
    email: 'support@pakaitools.store',
    telephone: '+92-321-9305619',
    founder: {
      '@type': 'Person',
      name: SITE.founder,
    },
    areaServed: 'PK',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-321-9305619',
      contactType: 'customer support',
      email: 'support@pakaitools.store',
      areaServed: 'PK',
      availableLanguage: ['English', 'Urdu'],
    },
  };
}

export function getWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.name,
    alternateName: 'Pak AI Tools',
    inLanguage: 'en-PK',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
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
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
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
  const canonicalUrl = `${SITE_URL}/product/${product.slug}/`;

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
    ? `${SITE_URL}/og/${product.slug}.png`
    : `${SITE_URL}/og-default.png`;

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
      '@id': `${SITE_URL}/#organization`,
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
  const canonical = `${SITE_URL}${url}`;
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
        url: `${SITE_URL}/about/`,
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
        url: `${SITE_URL}/contact/`,
      },
      getBreadcrumbSchema(breadcrumbs),
    ],
  };
}

export function getNewsArticleSchema(
  post: AINewsPost,
  breadcrumbs: Array<{ name: string; url: string }>
) {
  const canonicalUrl = `${SITE_URL}/ai-news/${post.slug}/`;
  const imageUrl = post.image.src.startsWith('http')
    ? post.image.src
    : `${SITE_URL}${post.image.src.startsWith('/') ? '' : '/'}${post.image.src}`;

  const articleNode: any = {
    '@type': 'NewsArticle',
    '@id': `${canonicalUrl}#article`,
    headline: post.title,
    description: post.description,
    image: [imageUrl],
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.url ? { url: post.author.url } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-192.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  const graph: any[] = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    articleNode,
    getBreadcrumbSchema(breadcrumbs),
  ];

  if (post.faq && post.faq.length > 0) {
    const faqSchema = getFaqSchema(
      post.faq.map((f) => ({ question: f.q, answer: f.a }))
    );
    if (faqSchema) graph.push(faqSchema);
  }

  return wrapInGraph(graph);
}

export function getAINewsHubSchema(
  posts: AINewsPost[],
  breadcrumbs: Array<{ name: string; url: string }>,
  pageNumber: number = 1
) {
  const canonicalUrl =
    pageNumber === 1
      ? `${SITE_URL}/ai-news/`
      : `${SITE_URL}/ai-news/page/${pageNumber}/`;

  const collectionNode: any = {
    '@type': 'CollectionPage',
    '@id': canonicalUrl,
    url: canonicalUrl,
    name:
      pageNumber === 1
        ? 'AI News for Pakistan | PakAITools'
        : `AI News for Pakistan - Page ${pageNumber} | PakAITools`,
    description:
      'Verified AI news, price shifts, and local impact for Pakistani freelancers, businesses, and developers.',
  };

  const graph: any[] = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    collectionNode,
    getBreadcrumbSchema(breadcrumbs),
  ];

  if (posts.length > 0) {
    const itemListNode = {
      '@type': 'ItemList',
      itemListElement: posts.map((post, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/ai-news/${post.slug}/`,
        name: post.title,
      })),
    };
    graph.push(itemListNode);
  }

  return wrapInGraph(graph);
}

