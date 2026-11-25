export interface SearchItem {
  title: string;
  url: string;
  type: 'plan' | 'merged_plan' | 'brand' | 'category' | 'guide' | 'comparison';
  category?: string;
  price?: number | null;
  duration?: string;
  keywords?: string;
}

/**
 * Searches the catalog with strict priority for direct title, brand, and category matches.
 * Secondary SEO keywords are only used as fallback when NO direct title matches exist,
 * preventing unrelated products from polluting brand/specific search queries.
 */
export function searchCatalog(
  items: SearchItem[],
  query: string,
  maxResults: number = 8
): SearchItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordRegex = new RegExp(`\\b${escapedQ}`, 'i');
  const words = q.split(/\s+/).filter(Boolean);

  const titleMatches: { item: SearchItem; score: number }[] = [];
  const keywordMatches: { item: SearchItem; score: number }[] = [];

  for (const item of items) {
    const t = item.title.toLowerCase();
    const cat = (item.category || '').toLowerCase();
    const u = (item.url || '').toLowerCase();
    const k = (item.keywords || '').toLowerCase();

    // 1. Direct title / brand / category / slug match
    let titleScore = 0;
    if (t === q) {
      titleScore = 10000;
    } else if (t.startsWith(q)) {
      titleScore = 5000;
    } else if (wordRegex.test(t)) {
      titleScore = 3000;
    } else if (t.includes(q)) {
      titleScore = 1500;
    } else if (u.includes(q)) {
      titleScore = 1400;
    } else if (cat === q || wordRegex.test(cat)) {
      titleScore = 1200;
    } else if (words.length > 1 && words.every((w) => t.includes(w) || cat.includes(w) || u.includes(w))) {
      titleScore = 2000;
    }

    if (titleScore > 0) {
      // Type boost for primary entities
      if (item.type === 'brand') titleScore += 500;
      else if (item.type === 'plan' || item.type === 'merged_plan') titleScore += 300;
      else if (item.type === 'category') titleScore += 100;

      titleMatches.push({ item, score: titleScore });
    } else {
      // 2. Secondary keyword match (only used if zero title/brand matches exist)
      let kwScore = 0;
      if (wordRegex.test(k)) {
        kwScore = 50;
      } else if (k.includes(q)) {
        kwScore = 10;
      }

      if (kwScore > 0) {
        keywordMatches.push({ item, score: kwScore });
      }
    }
  }

  // Sort by score descending
  titleMatches.sort((a, b) => b.score - a.score);
  keywordMatches.sort((a, b) => b.score - a.score);

  // If direct title/brand matches exist, return ONLY those (never pollute with keyword matches)
  if (titleMatches.length > 0) {
    return titleMatches.slice(0, maxResults).map((m) => m.item);
  }

  // Fallback to keyword matches only if zero direct title matches exist
  return keywordMatches.slice(0, maxResults).map((m) => m.item);
}
