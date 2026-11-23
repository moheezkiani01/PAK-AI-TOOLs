import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';
import hubsData from '@/data/hubs.json';
import mergedPlansData from '@/data/merged_plans.json';
import brandsData from '@/data/brands.json';
import sitePagesData from '@/data/site_pages.json';

import type { Category, Brand, Product, MergedPlan, CategoryHub, BrandHub, BlogPost } from './types';

export function getCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return (categoriesData as Category[]).find((c) => c.slug === slug);
}

export function getProducts(): Product[] {
  return productsData as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return (productsData as Product[]).find((p) => p.slug === slug);
}

export function getMergedPlans(): MergedPlan[] {
  return mergedPlansData as MergedPlan[];
}

export function getBrands(): Brand[] {
  return brandsData as Brand[];
}

export function getBrandsByCategory(categorySlug: string): Brand[] {
  return (brandsData as Brand[]).filter((b) => b.categorySlug === categorySlug);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return (brandsData as Brand[]).find((b) => b.slug === slug);
}

export function getCategoryHub(categorySlug: string): CategoryHub | undefined {
  return (hubsData.categories as CategoryHub[]).find((c) => c.slug === categorySlug);
}

export function getBrandHub(categorySlug: string, brandSlug: string): BrandHub | undefined {
  return (hubsData.brands as BrandHub[]).find(
    (b) => b.categorySlug === categorySlug && b.brandSlug === brandSlug
  );
}

export function getAllBrandHubs(): BrandHub[] {
  return hubsData.brands as BrandHub[];
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return (productsData as Product[]).filter((p) => p.brandSlug === brandSlug);
}

export function getMergedPlansByBrand(brandSlug: string): MergedPlan[] {
  return (mergedPlansData as MergedPlan[]).filter((p) => p.brandSlug === brandSlug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return (productsData as Product[]).filter((p) => p.categorySlug === categorySlug);
}

export function getSitePages() {
  return sitePagesData as any;
}

export function getBlogPosts(): BlogPost[] {
  const bp = (sitePagesData as any)?.blog;
  return Array.isArray(bp) ? bp : [];
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find((b) => b.slug === slug);
}
