import type { MetadataRoute } from 'next';
import {
  getCategories,
  getAllBrandHubs,
  getProducts,
  getBlogPosts,
  getComparisons,
  getNewsArticles,
} from '@/lib/data';
import { SITE } from '@/lib/site.config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.domain;
  const lastMod = new Date(SITE.pricesReviewedOn);

  const urls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: lastMod,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories/`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/price-list/`,
      lastModified: lastMod,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare/`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/payment-methods/`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/refund-warranty-policy/`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy/`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 15 Category Hubs
  getCategories().forEach((cat) => {
    urls.push({
      url: `${baseUrl}/${cat.slug}/`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 44 Brand Hubs
  getAllBrandHubs().forEach((bh) => {
    urls.push({
      url: `${baseUrl}${bh.url}`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 179 Products
  getProducts().forEach((p) => {
    urls.push({
      url: `${baseUrl}/product/${p.slug}/`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  // 20 Comparisons
  getComparisons().forEach((c) => {
    urls.push({
      url: `${baseUrl}/compare/${c.slug}/`,
      lastModified: new Date(c.date || SITE.pricesReviewedOn),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // 21 Blog posts & guides
  getBlogPosts().forEach((bp) => {
    urls.push({
      url: `${baseUrl}/blog/${bp.slug}/`,
      lastModified: new Date(bp.date || SITE.pricesReviewedOn),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // 3 AI News articles
  getNewsArticles().forEach((n) => {
    urls.push({
      url: `${baseUrl}/blog/news/${n.slug}/`,
      lastModified: new Date(n.date || SITE.pricesReviewedOn),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  return urls;
}
