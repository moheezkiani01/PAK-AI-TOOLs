import type { MetadataRoute } from 'next';
import {
  getCategories,
  getAllBrandHubs,
  getProducts,
  getBlogPosts,
  getComparisons,
} from '@/lib/data';
import { SITE } from '@/lib/site.config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.domain;
  const products = getProducts();

  const allProductDates = products.map((p) => p.updatedAt).filter(Boolean).sort().reverse();
  const globalProductNewestDate = allProductDates[0] || null;

  const comparisons = getComparisons();
  const compDates = comparisons.map((c) => {
    const linkedSlugs = [...(c.contentMarkdown || '').matchAll(/\/product\/([a-z0-9-]+)\//g)].map((m) => m[1]);
    const linkedProds = products.filter((p) => linkedSlugs.includes(p.slug) && p.updatedAt);
    if (linkedProds.length > 0) {
      return linkedProds.map((p) => p.updatedAt).sort().reverse()[0];
    }
    return (c as any).updated || (c as any).published || (c as any).date || null;
  });
  const newestCompareDate = compDates.filter(Boolean).sort().reverse()[0] || globalProductNewestDate;

  const blogPosts = getBlogPosts();
  const blogDates = blogPosts.map((bp) => (bp as any).updated || (bp as any).published || (bp as any).date || null);
  const newestBlogDate = blogDates.filter(Boolean).sort().reverse()[0] || null;

  const urls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      ...(globalProductNewestDate ? { lastModified: new Date(globalProductNewestDate) } : {}),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories/`,
      ...(globalProductNewestDate ? { lastModified: new Date(globalProductNewestDate) } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/price-list/`,
      ...(globalProductNewestDate ? { lastModified: new Date(globalProductNewestDate) } : {}),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare/`,
      ...(newestCompareDate ? { lastModified: new Date(newestCompareDate) } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/`,
      ...(newestBlogDate ? { lastModified: new Date(newestBlogDate) } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Static pages have no date: omit lastModified
    {
      url: `${baseUrl}/payment-methods/`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/refund-warranty-policy/`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact/`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy/`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms/`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 15 Category Hubs: newest updatedAt of products in that category
  getCategories().forEach((cat) => {
    const catProds = products.filter((p) => p.categorySlug === cat.slug && p.updatedAt);
    const newestDate = catProds.length > 0 ? catProds.map((p) => p.updatedAt).sort().reverse()[0] : null;
    urls.push({
      url: `${baseUrl}/${cat.slug}/`,
      ...(newestDate ? { lastModified: new Date(newestDate) } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 44 Brand Hubs: newest updatedAt of products for that brand
  getAllBrandHubs().forEach((bh) => {
    const brandProds = products.filter(
      (p) => (p.categorySlug === bh.categorySlug || !bh.categorySlug) && p.brandSlug === bh.brandSlug && p.updatedAt
    );
    const newestDate = brandProds.length > 0 ? brandProds.map((p) => p.updatedAt).sort().reverse()[0] : null;
    urls.push({
      url: `${baseUrl}${bh.url}`,
      ...(newestDate ? { lastModified: new Date(newestDate) } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 179 Products: each product uses its updatedAt
  products.forEach((p) => {
    urls.push({
      url: `${baseUrl}/product/${p.slug}/`,
      ...(p.updatedAt ? { lastModified: new Date(p.updatedAt) } : {}),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  // 20 Comparisons: newest updatedAt of products they list
  comparisons.forEach((c, idx) => {
    const lastmod = compDates[idx];
    urls.push({
      url: `${baseUrl}/compare/${c.slug}/`,
      ...(lastmod ? { lastModified: new Date(lastmod) } : {}),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // 21 Blog posts & guides: updated or published date
  blogPosts.forEach((bp, idx) => {
    const lastmod = blogDates[idx];
    urls.push({
      url: `${baseUrl}/blog/${bp.slug}/`,
      ...(lastmod ? { lastModified: new Date(lastmod) } : {}),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  return urls;
}
