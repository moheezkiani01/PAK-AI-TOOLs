import rawNewsData from '../data/ai-news.json';

export interface AINewsAuthor {
  name: string;
  url?: string;
}

export interface AINewsSource {
  label: string;
  url: string;
}

export interface AINewsRelatedProduct {
  label: string;
  href: string;
}

export interface AINewsFaqItem {
  q: string;
  a: string;
}

export interface AINewsImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface AINewsPost {
  slug: string;
  title: string; // <= 60 chars ideal
  description: string; // 140-160 chars, used for meta + card summary
  quickAnswer: string; // 2-3 sentences: what happened and why it matters (AEO/GEO)
  pkAngle: string; // what this means for Pakistani users / PKR pricing
  body: string; // MDX or Markdown / HTML
  image: AINewsImage;
  datePublished: string; // ISO 8601
  dateModified: string; // ISO 8601, change ONLY on real edits
  author: AINewsAuthor;
  sources: AINewsSource[]; // cited primary sources
  relatedProducts: AINewsRelatedProduct[]; // links to PakAITools price/product pages
  faq?: AINewsFaqItem[];
  draft?: boolean; // drafts are excluded everywhere
}

const AI_NEWS_POSTS: AINewsPost[] = rawNewsData as AINewsPost[];

export function getAllAINewsPosts(): AINewsPost[] {
  return AI_NEWS_POSTS;
}

export function getPublishedAINewsPosts(): AINewsPost[] {
  return AI_NEWS_POSTS.filter((post) => !post.draft);
}

export function getAINewsPostBySlug(slug: string, includeDrafts = false): AINewsPost | undefined {
  return AI_NEWS_POSTS.find((post) => post.slug === slug && (includeDrafts || !post.draft));
}
