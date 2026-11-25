import categoriesData from '@/data/categories.json';
import brandsData from '@/data/brands.json';
import productsData from '@/data/products.json';
import mergedPlansData from '@/data/merged_plans.json';
import hubsData from '@/data/hubs.json';
import { SITE_URL } from './site.config';
import type { Category, Brand, Product, MergedPlan } from './types';

export type BrandCardData = {
  id?: number | string;
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
  icon?: string;             // category icon
  intro: string;             // 2-3 sentence factual intro (AEO/GEO)
  href: string;              // category page URL
  brands: BrandCardData[];   // all brand cards in this category
  totalBrandCount: number;
  totalPlanCount: number;
};

// Priority commercial category ordering
export const CATEGORY_COMMERCIAL_ORDER: string[] = [
  'ai-chatbots',
  'design-creative',
  'video-editing',
  'streaming',
  'vpn-privacy',
  'ai-video-image',
  'ai-voice-audio',
  'education',
  'productivity-software',
  'developer-tools',
  'cloud-storage',
  'antivirus',
  'antidetect-proxies',
  'esim',
  'ai-apis',
];

// Shortened display names for long bundles and titles to ensure single-line fit
export const SHORT_NAMES: Record<string, string> = {
  'grok': 'Grok',
  'grok-cursor-x-premium-1-month': 'Grok + Cursor + X Premium',
  'grok-grok-bot-cursor-x-premium-4-in-1-bundle': 'Grok + Cursor + X Premium',
  'proton': 'Proton Unlimited',
  'proton-unlimited-1-month': 'Proton Unlimited',
  'proton-unlimited-all-in-one-swiss-privacy-suite': 'Proton Unlimited',
  'xbox-game-pass-ultimate-pc-edition': 'Xbox Game Pass',
  'autodesk-all-apps-68-applications': 'Autodesk All Apps',
};

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
 * Returns structured Category Groups for all 15 categories containing all brands.
 * Each multi-plan brand (e.g. ChatGPT) is a single card linking to its dedicated brand hub
 * where all its plans are hosted, rather than listing every plan on the homepage.
 */
export function getBrandGridData(): CategoryGroup[] {
  const brands = brandsData as Brand[];
  const categories = [...(categoriesData as Category[])].sort((a, b) => a.order - b.order);
  const products = productsData as Product[];
  const mergedPlans = mergedPlansData as MergedPlan[];

  const result: CategoryGroup[] = [];

  for (const cat of categories) {
    const catBrands = brands
      .filter((b) => b.categorySlug === cat.slug)
      .sort((a, b) => {
        const pDiff = (a.priority ?? 50) - (b.priority ?? 50);
        if (pDiff !== 0) return pDiff;
        return (b.planCount ?? 1) - (a.planCount ?? 1);
      });

    const brandCards: BrandCardData[] = catBrands.map((b) => {
      let activePlans: Array<{ price: number | null }> = [];

      if (b.isMultiPlan) {
        const prodPlans = products.filter((p) => p.brandSlug === b.slug);
        const mergPlans = mergedPlans.filter((mp) => mp.brandSlug === b.slug);
        activePlans = [...prodPlans, ...mergPlans];
      } else if (b.productSlug) {
        const prod = products.find((p) => p.slug === b.productSlug);
        if (prod) activePlans = [prod];
      } else {
        const prod = products.find((p) => p.brandSlug === b.slug);
        if (prod) activePlans = [prod];
      }

      const validPrices = activePlans
        .map((p) => p.price)
        .filter((pr): pr is number => typeof pr === 'number' && pr > 0);

      const lowestPricePkr = validPrices.length > 0 ? Math.min(...validPrices) : null;
      const planCount = activePlans.length || b.planCount || 1;

      let href = b.isMultiPlan
        ? `/${cat.slug}/${b.slug}/`
        : (b.productUrl || `/product/${b.productSlug || b.slug}/`);
      if (!href.endsWith('/')) {
        href = `${href}/`;
      }

      const prod = !b.isMultiPlan
        ? products.find((p) => p.slug === b.productSlug || p.brandSlug === b.slug)
        : null;
      const fullName = prod ? prod.name : b.displayName || b.slug;
      const cleanName = (SHORT_NAMES[b.slug] || b.displayName || b.slug).trim();

      return {
        id: b.slug,
        slug: b.slug,
        name: fullName,
        displayName: cleanName,
        href,
        logo: {
          src: b.logo || '',
          alt: `${cleanName} logo`,
          width: 44,
          height: 44,
        },
        planCount,
        lowestPricePkr,
        category: cat.slug,
        isMultiPlan: b.isMultiPlan,
      };
    });

    const catProducts = products.filter((p) => p.categorySlug === cat.slug);
    const catMerged = mergedPlans.filter((m) => m.categorySlug === cat.slug);
    const totalPlanCount = catProducts.length + catMerged.length;

    const intro =
      CATEGORY_FACTUAL_INTROS[cat.slug] ||
      (hubsData.categories as any[]).find((hc) => hc.slug === cat.slug)?.answer ||
      `Browse verified ${cat.name} subscriptions in Pakistan priced in PKR.`;

    result.push({
      slug: cat.slug,
      title: cat.name,
      icon: cat.icon,
      intro,
      href: `/${cat.slug}/`,
      brands: brandCards,
      totalBrandCount: catBrands.length,
      totalPlanCount,
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
      itemListElement: group.brands.map((b, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: b.name,
        url: `${SITE_URL}${b.href}`,
      })),
    };
  });
}
