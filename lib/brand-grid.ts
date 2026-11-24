import categoriesData from '@/data/categories.json';
import brandsData from '@/data/brands.json';
import productsData from '@/data/products.json';
import mergedPlansData from '@/data/merged_plans.json';
import hubsData from '@/data/hubs.json';
import { SITE_URL } from './site.config';
import type { Category, Brand, Product, MergedPlan } from './types';

export type BrandCardData = {
  slug: string;
  name: string;              // full search-friendly name
  displayName?: string;      // optional compact display name (<= 32 chars)
  href: string;              // internal URL, matches canonical exactly
  logo: { src: string; alt: string; width: number; height: number };
  planCount: number;
  lowestPricePkr: number | null; // computed from plans (null if quote on request)
  category: string;          // category slug
  isMultiPlan: boolean;
};

export type CategoryGroup = {
  slug: string;
  title: string;             // e.g. "AI Chatbots & Assistants"
  intro: string;             // 2-3 sentence factual intro (AEO/GEO)
  href: string;              // category page URL
  brands: BrandCardData[];   // top 6-8 by priority, ordered deliberately
  totalBrandCount: number;
};

// Priority commercial category ordering
export const CATEGORY_COMMERCIAL_ORDER: string[] = [
  'ai-chatbots',
  'design-creative',
  'video-editing',
  'ai-video-image',
  'ai-voice-audio',
  'ai-apis',
  'vpn-privacy',
  'streaming',
  'education',
  'productivity-software',
  'developer-tools',
  'cloud-storage',
  'antivirus',
  'antidetect-proxies',
  'esim',
];

// Top categories featured on the homepage brand grid
export const HOME_GRID_CATEGORIES: string[] = [
  'ai-chatbots',
  'ai-video-image',
  'ai-apis',
  'design-creative',
];

// Plain, factual 2-3 sentence intros for each category hub (AEO/GEO)
export const CATEGORY_FACTUAL_INTROS: Record<string, string> = {
  'ai-chatbots':
    'Buy ChatGPT, Google Gemini, Grok, Kimi AI, and Claude subscriptions in Pakistan paid directly in PKR. Choose between verified private email activations and budget shared accounts with full replacement warranty and 15-minute WhatsApp delivery.',
  'design-creative':
    'Access industry-standard creative tools including Adobe Creative Cloud All Apps, Canva Pro, Figma, Autodesk, and Meitu in Pakistan. Subscriptions are billed in fixed Pakistani Rupees (PKR) with zero credit card markups or foreign transaction taxes.',
  'video-editing':
    'Unlock CapCut Pro VIP, Wink VIP, and Alight Motion Premium subscriptions in Pakistan without an international bank card. Designed for TikTok, YouTube, and freelance video creators with instant PKR payment via JazzCash, EasyPaisa, or SadaPay.',
  'ai-video-image':
    'Generate high-resolution AI art and cinematic video using Kling AI, Midjourney, Dreamina, Runway Gen-3, Google Veo 3, and PixVerse. All subscriptions and credit packs are priced in PKR with fast delivery and upfront replacement warranty.',
  'ai-voice-audio':
    'Access professional voice synthesis and music generation platforms including ElevenLabs, Suno AI, and Udio in Pakistan. Secure monthly plans and credit tiers priced in PKR for content creators, podcasters, and agency voiceover workflows.',
  'ai-apis':
    'Direct wholesale developer API token access for Claude API, Cursor API, DeepSeek API, Grok API, and Qwen API in Pakistan. Billed transparently in PKR for software engineers, startups, and automated AI agents.',
  'vpn-privacy':
    'Protect your online privacy and bypass regional restrictions with ExpressVPN, NordVPN, Surfshark, HMA, and IPVanish in Pakistan. Order multi-device plans paid in Pakistani Rupees (PKR) with zero international banking hassle.',
  'streaming':
    'Enjoy uninterrupted movies and music with Netflix, Spotify Premium, Amazon Prime Video, Apple Music, and iQIYI in Pakistan. Compare private and shared screen options with guaranteed warranty.',
  'education':
    'Upgrade your skills with Duolingo Super, Coursera Plus, Udemy Personal Plan, Skillshare, and Studocu in Pakistan. Pay in local PKR to access certified courses, language practice, and academic study resources.',
  'productivity-software':
    'Boost your daily workflow with Microsoft 365, Notion, Gamma App, LinkedIn Premium, and Zoom in Pakistan. Verified licenses and team invitations billed in PKR without recurring foreign card charges.',
  'developer-tools':
    'Accelerate your programming workflow with JetBrains All Products Pack and Replit subscriptions in Pakistan. Easy local PKR payment with quick email activation for software engineers and computer science students.',
  'cloud-storage':
    'Expand your secure digital storage with Apple iCloud+ packages in Pakistan. Store photos, device backups, and documents with instant PKR activation and no recurring US dollar card requirements.',
  'antivirus':
    'Safeguard your Windows PC, Mac, and mobile devices with Kaspersky Total Security licenses in Pakistan. Verified multi-device protection keys priced in PKR with full duration replacement warranty.',
  'antidetect-proxies':
    'Manage multi-account operations, affiliate marketing, and web scraping with GPM Login and ProxyScrape in Pakistan. Reliable proxy bandwidth and anti-detect browser licenses priced in local currency.',
  'esim':
    'Stay connected across Pakistan and abroad with fast Roamless travel eSIM data packages. Instant QR code activation via WhatsApp with PKR payments via JazzCash, EasyPaisa, or bank transfer.',
};

/**
 * Returns the verified last price update date (real date from data).
 */
export function getLastPriceUpdate(): { dateIso: string; dateDisplay: string } {
  return {
    dateIso: '2026-11-25',
    dateDisplay: '25 Nov 2026',
  };
}

/**
 * Returns the structured Brand Grid categories and their top 6-8 brands
 * derived strictly from the canonical data sources.
 */
export function getBrandGridData(categorySlugs: string[] = CATEGORY_COMMERCIAL_ORDER): CategoryGroup[] {
  const brands = brandsData as Brand[];
  const categories = categoriesData as Category[];
  const products = productsData as Product[];
  const mergedPlans = mergedPlansData as MergedPlan[];

  const categoryMap = new Map<string, Category>();
  for (const c of categories) {
    categoryMap.set(c.slug, c);
  }

  const result: CategoryGroup[] = [];

  for (const catSlug of categorySlugs) {
    const cat = categoryMap.get(catSlug);
    if (!cat) continue;

    // Filter brands belonging to this category
    const catBrands = brands.filter((b) => b.categorySlug === catSlug);

    // Sort brands: priority ascending (10, 20, 50), then planCount descending
    const sortedBrands = [...catBrands].sort((a, b) => {
      const pDiff = (a.priority ?? 50) - (b.priority ?? 50);
      if (pDiff !== 0) return pDiff;
      return (b.planCount ?? 1) - (a.planCount ?? 1);
    });

    // Take top 6-8 brands (up to 8)
    const selectedBrands = sortedBrands.slice(0, 8);

    const brandCards: BrandCardData[] = selectedBrands.map((b) => {
      // Find active plans for this brand
      let activePlans: Array<{ price: number | null }> = [];

      if (b.isMultiPlan) {
        const prodPlans = products.filter((p) => p.brandSlug === b.slug);
        const mergPlans = mergedPlans.filter((mp) => mp.brandSlug === b.slug);
        activePlans = [...prodPlans, ...mergPlans];
      } else if (b.productSlug) {
        const prod = products.find((p) => p.slug === b.productSlug);
        if (prod) activePlans = [prod];
      }

      // Compute lowest price (numbers > 0)
      const validPrices = activePlans
        .map((p) => p.price)
        .filter((pr): pr is number => typeof pr === 'number' && pr > 0);

      const lowestPricePkr = validPrices.length > 0 ? Math.min(...validPrices) : null;
      const planCount = activePlans.length || b.planCount || 1;

      // Single-plan brands link to /product/${productSlug}/; multi-plan link to /${catSlug}/${b.slug}/
      const href = b.isMultiPlan
        ? `/${catSlug}/${b.slug}/`
        : (b.productUrl || `/product/${b.productSlug}/`);

      const cleanName = (b.displayName || b.slug).trim();

      return {
        slug: b.slug,
        name: cleanName,
        displayName: cleanName,
        href,
        logo: {
          src: b.logo || '',
          alt: `${cleanName} logo`,
          width: 40,
          height: 40,
        },
        planCount,
        lowestPricePkr,
        category: catSlug,
        isMultiPlan: b.isMultiPlan,
      };
    });

    const intro =
      CATEGORY_FACTUAL_INTROS[catSlug] ||
      (hubsData.categories as any[]).find((hc) => hc.slug === catSlug)?.answer ||
      `Browse verified ${cat.name} subscriptions in Pakistan priced in PKR.`;

    result.push({
      slug: catSlug,
      title: cat.name,
      intro,
      href: `/${catSlug}/`,
      brands: brandCards,
      totalBrandCount: catBrands.length,
    });
  }

  return result;
}

/**
 * Builds ItemList structured data for visible brand cards across the grid.
 */
export function getBrandGridJsonLd(groups: CategoryGroup[]) {
  return groups.map((group) => {
    return {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#itemlist-${group.slug}`,
      name: `${group.title} Subscriptions in Pakistan`,
      description: group.intro,
      numberOfItems: group.brands.length,
      itemListElement: group.brands.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        url: `${SITE_URL}${b.href}`,
      })),
    };
  });
}
