import faqPackData from '@/data/faq/pakaitools-faq-pack-v2.json';

export interface FaqEntry {
  lang?: string; // 'en' | 'ru' | 'ur-Latn'
  q: string;
  a: string;
  group?: string;
}

export interface FaqProduct {
  id?: number | null;
  name: string;
  title: string;
  url: string;
  category: string;
  category_url: string;
  mode: string;
  price: string;
  duration: string;
  warranty: string;
  account: string;
  breadcrumb: Array<[string, string]>;
  faqs: FaqEntry[];
  jsonld: {
    '@context': string;
    '@graph': any[];
  };
}

export interface FaqCategory {
  key: string;
  label: string;
  url: string;
  breadcrumb: Array<[string, string]>;
  faqs: FaqEntry[];
  jsonld: {
    '@context': string;
    '@graph': any[];
  };
}

export interface FaqGeneral {
  url: string;
  breadcrumb: Array<[string, string]>;
  faqs: FaqEntry[];
  jsonld: {
    '@context': string;
    '@graph': any[];
  };
}

export function getGeneralFaq(): FaqGeneral {
  return faqPackData.general as FaqGeneral;
}

export function getFaqByProductSlug(slug: string): FaqProduct | undefined {
  const targetUrl = `https://pakaitools.store/product/${slug}/`;
  return (faqPackData.products as FaqProduct[]).find((p) => p.url === targetUrl);
}

export function getFaqByCategorySlug(slug: string): FaqCategory | undefined {
  const targetUrl = `https://pakaitools.store/${slug}/`;
  return (faqPackData.categories as FaqCategory[]).find((c) => c.url === targetUrl);
}

export function getAllFaqProducts(): FaqProduct[] {
  return faqPackData.products as FaqProduct[];
}

export function getAllFaqCategories(): FaqCategory[] {
  return faqPackData.categories as FaqCategory[];
}
