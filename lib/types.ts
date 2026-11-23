export interface Category {
  order: number;
  name: string;
  slug: string;
  url: string;
  icon: string;
  tint: string;
  brands: number;
  plans: number;
  pages: number;
  mergedRows: number;
  brandHubs: number;
  singlePlanBrands: number;
  sampleBrands: string[];
}

export interface Brand {
  slug: string;
  displayName: string;
  categorySlug: string;
  isMultiPlan: boolean;
  hubUrl?: string;
  productSlug?: string;
  productUrl?: string;
  planCount: number;
  priority: number;
  logo: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  parent: string;
  categorySlug: string;
  brandSlug: string;
  seoTitle: string;
  metaDesc: string;
  h1: string;
  answer: string;
  quickFacts: Record<string, string>;
  price: number | null;
  duration: string;
  warranty: string;
  accountType: string;
  deliveryTime: string;
  paymentMethods: string;
  support: string;
  contentMarkdown: string;
  faqs: Array<{ question: string; answer: string }>;
  keywords: {
    primary: string;
    secondary: string;
    longTail: string;
    romanUrdu: string;
  };
  schema: any;
}

export interface MergedPlan {
  id: number;
  name: string;
  slug: string;
  redirectTo: string;
  categorySlug: string;
  brandSlug: string;
  h1: string;
  answer: string;
  price: number | null;
  duration: string;
  warranty: string;
  accountType: string;
  deliveryTime: string;
  paymentMethods: string;
}

export interface CategoryHub {
  name: string;
  slug: string;
  url: string;
  seoTitle: string;
  metaDesc: string;
  h1: string;
  answer: string;
  contentMarkdown: string;
  faqs: Array<{ question: string; answer: string }>;
}

export interface BrandHub {
  name: string;
  url: string;
  categorySlug: string;
  brandSlug: string;
  seoTitle: string;
  metaDesc: string;
  h1: string;
  answer: string;
  contentMarkdown: string;
  faqs: Array<{ question: string; answer: string }>;
}

export interface BlogPost {
  id?: number;
  slug: string;
  title?: string;
  rawTitle?: string;
  seoTitle?: string;
  metaDesc?: string;
  desc?: string;
  h1?: string;
  summary?: string;
  ans?: string;
  contentMarkdown?: string;
  md?: string;
  faqs?: Array<{ question: string; answer: string }>;
  faq?: Array<[string, string]>;
  type?: string;
  date?: string;
  plans?: string[];
  src?: string;
  schema?: any;
}

export interface ComparisonItem {
  id: number;
  category: string;
  rawTitle: string;
  seoTitle: string;
  metaDesc: string;
  slug: string;
  canonical: string;
  h1: string;
  verdict: string;
  contentMarkdown: string;
  faqs: Array<{ question: string; answer: string }>;
  schema?: any;
  date: string;
}

export interface ComparisonHub {
  title: string;
  desc: string;
  h1: string;
  intro: string;
}

export interface NewsArticle {
  title: string;
  slug: string;
  date: string;
  summary: string;
  tags: string[];
  sources: Array<{ name: string; url: string }>;
  content: string;
}

