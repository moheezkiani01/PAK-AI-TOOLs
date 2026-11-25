import fs from 'fs';
import path from 'path';
if (!fs.existsSync(path.join(process.cwd(), '01_catalogue_indexable_pages.txt'))) {
  console.log('Catalogue txt files not present; using pre-generated data/*.json');
  process.exit(0);
}


console.log('--- Generating Site Data ---');

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const BRANDS_DIR = path.join(PUBLIC_DIR, 'brands');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
if (!fs.existsSync(BRANDS_DIR)) fs.mkdirSync(BRANDS_DIR, { recursive: true });

// 1. Copy Categories
const categoriesRaw = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'categories.json'), 'utf8'));
fs.writeFileSync(path.join(DATA_DIR, 'categories.json'), JSON.stringify(categoriesRaw, null, 2));
console.log('Saved data/categories.json (15 categories)');

// 2. Parse 06_url_map_and_redirects.csv
const urlMapLines = fs.readFileSync(path.join(ROOT_DIR, '06_url_map_and_redirects.csv'), 'utf8').trim().split(/\r?\n/);
const redirects = [];
for (let i = 1; i < urlMapLines.length; i++) {
  const line = urlMapLines[i];
  if (!line.trim()) continue;
  const parts = line.split(',');
  const url = parts[0];
  const type = parts[1];
  const status = parts[2];
  const redirectTo = parts[3];
  if (status === '301-redirect' && redirectTo) {
    redirects.push({
      source: url,
      destination: redirectTo,
      permanent: true
    });
  }
}

const newsRedirects = [
  { source: '/blog/news/openai-operator-autonomous-agent/', destination: '/blog/', permanent: true },
  { source: '/blog/news/openai-operator-autonomous-agent', destination: '/blog/', permanent: true },
  { source: '/blog/news/deepseek-v3-open-weights-breakthrough/', destination: '/blog/', permanent: true },
  { source: '/blog/news/deepseek-v3-open-weights-breakthrough', destination: '/blog/', permanent: true },
  { source: '/blog/news/claude-hybrid-reasoning-architecture/', destination: '/blog/', permanent: true },
  { source: '/blog/news/claude-hybrid-reasoning-architecture', destination: '/blog/', permanent: true },
  { source: '/blog/news/', destination: '/blog/', permanent: true },
  { source: '/blog/news', destination: '/blog/', permanent: true }
];
for (const nr of newsRedirects) {
  if (!redirects.some((r) => r.source === nr.source)) {
    redirects.push(nr);
  }
}

fs.writeFileSync(path.join(DATA_DIR, 'redirects.json'), JSON.stringify(redirects, null, 2));
console.log(`Saved data/redirects.json (${redirects.length} redirects)`);

// Write public/_redirects for Cloudflare Pages
let redirectsText = redirects.map(r => `${r.source}  ${r.destination}  301`).join('\n');
fs.writeFileSync(path.join(PUBLIC_DIR, '_redirects'), redirectsText + '\n');
console.log(`Saved public/_redirects (${redirects.length} lines)`);

// Real date when product prices and plans were last verified
function getProductUpdatedAt(categorySlug, id) {
  if (id === 15 || id === 139 || id === 208 || id >= 271) {
    return '2026-11-26';
  }
  return '2026-11-22';
}

// 3. Parse 01_catalogue_indexable_pages.txt
const indexableContent = fs.readFileSync(path.join(ROOT_DIR, '01_catalogue_indexable_pages.txt'), 'utf8');
const productBlocks = indexableContent.split(/={40,}\r?\nPRODUCT #(\d+):\s*(.*?)\r?\n={40,}/g);

const products = [];
for (let i = 1; i < productBlocks.length; i += 3) {
  const id = parseInt(productBlocks[i]);
  const rawName = productBlocks[i + 1].trim();
  const body = productBlocks[i + 2];

  const parentMatch = body.match(/Parent:\s*(.*?)(?:\r?\n|$)/);
  const parent = parentMatch ? parentMatch[1].trim() : '';

  const seoTitleMatch = body.match(/1\.\s*SEO TITLE:\s*\r?\n(.*?)(?=\r?\n\r?\n2\.|\r?\n2\.)/s);
  const metaDescMatch = body.match(/2\.\s*META DESCRIPTION:\s*\r?\n(.*?)(?=\r?\n\r?\n3\.|\r?\n3\.)/s);
  const slugMatch = body.match(/3\.\s*URL SLUG:\s*\r?\n(.*?)(?=\r?\n\r?\n4\.|\r?\n4\.)/s);
  const h1Match = body.match(/4\.\s*H1:\s*\r?\n(.*?)(?=\r?\n\r?\n5\.|\r?\n5\.)/s);
  const ansMatch = body.match(/5\.\s*ANSWER-FIRST PARAGRAPH:\s*\r?\n(.*?)(?=\r?\n\r?\n6\.|\r?\n6\.)/s);

  // Quick facts table
  const qfMatch = body.match(/6\.\s*QUICK FACTS TABLE:\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n7\.)/);
  const qfText = qfMatch ? qfMatch[1] : '';
  const quickFacts = {};
  const qfLines = qfText.split(/\r?\n/);
  for (const line of qfLines) {
    if (line.includes('|') && !line.includes(':---')) {
      const cols = line.split('|').map(s => s.trim()).filter(Boolean);
      if (cols.length >= 2) {
        quickFacts[cols[0]] = cols[1];
      }
    }
  }

  // Price extraction
  let price = null;
  const priceStr = quickFacts['Price'] || '';
  const priceMatch = priceStr.match(/Rs\.?\s*([\d,]+)/i);
  if (priceMatch) {
    price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  }

  // Content markdown
  const contentMatch = body.match(/7\.\s*PRODUCT PAGE CONTENT:\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n8\.\s*FAQ:|\r?\n8\.\s*FAQ:)/);
  let contentMarkdown = contentMatch ? contentMatch[1].trim() : '';

  // FAQs
  const faqMatch = body.match(/8\.\s*FAQ:\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n9\.\s*KEYWORD MAP:|\r?\n9\.\s*KEYWORD MAP:)/);
  const faqs = [];
  if (faqMatch) {
    const faqText = faqMatch[1];
    const qMatches = [...faqText.matchAll(/\*\*Q\d*:\s*(.*?)\*\*\s*\r?\n([\s\S]*?)(?=(?:\r?\n\r?\n\*\*Q\d*:|\r?\n\*\*Q\d*:|$))/g)];
    for (const qm of qMatches) {
      faqs.push({
        question: qm[1].trim(),
        answer: qm[2].trim()
      });
    }
  }

  // Keywords
  const kwMatch = body.match(/9\.\s*KEYWORD MAP:\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n10\.|\r?\n10\.)/);
  const kwText = kwMatch ? kwMatch[1] : '';
  const primaryKwMatch = kwText.match(/Primary Keyword:\s*(.*?)(?:\r?\n|$)/);
  const secKwMatch = kwText.match(/Secondary Keywords:\s*(.*?)(?:\r?\n|$)/);
  const longTailMatch = kwText.match(/Long-Tail Keywords:\s*(.*?)(?:\r?\n|$)/);
  const romanUrduMatch = kwText.match(/Roman Urdu Variations:\s*(.*?)(?:\r?\n|$)/);

  // Schema
  const schemaMatch = body.match(/11\.\s*JSON-LD SCHEMA:\s*\r?\n```json\s*([\s\S]*?)\s*```/);
  let schema = null;
  if (schemaMatch) {
    try {
      schema = JSON.parse(schemaMatch[1]);
    } catch (err) {
      console.warn(`Schema JSON parse error in product #${id}: ${err.message}`);
    }
  }

  // Derive categorySlug and brandSlug from parent URL
  // e.g. /design-creative/adobe-creative-cloud/ -> cat: design-creative, brand: adobe-creative-cloud
  // e.g. /design-creative/ -> cat: design-creative, brand: autodesk-all-apps
  const parentParts = parent.replace(/^\/|\/$/g, '').split('/');
  const categorySlug = parentParts[0] || '';
  let brandSlug = parentParts[1] || '';
  if (!brandSlug) {
    // Single plan brand
    const firstWord = slugMatch ? slugMatch[1].trim().split('-')[0] : '';
    brandSlug = firstWord;
    if (slugMatch && slugMatch[1].trim() === 'muse-ai-1b-token-account') {
      brandSlug = 'meta';
    }
  }

  const cleanName = schema && schema['@graph'] && schema['@graph'][0]?.name 
    ? schema['@graph'][0].name 
    : rawName.replace(/^([A-Z0-9\s+–-]+)$/i, (m) => m);

  products.push({
    id,
    name: cleanName,
    slug: slugMatch ? slugMatch[1].trim() : '',
    parent,
    categorySlug,
    brandSlug,
    seoTitle: seoTitleMatch ? seoTitleMatch[1].trim() : '',
    metaDesc: metaDescMatch ? metaDescMatch[1].trim() : '',
    h1: h1Match ? h1Match[1].trim() : '',
    answer: ansMatch ? ansMatch[1].trim() : '',
    quickFacts,
    price,
    duration: quickFacts['Duration'] || '',
    warranty: quickFacts['Warranty'] || '',
    accountType: quickFacts['Account Type'] || '',
    deliveryTime: quickFacts['Delivery Time'] || '',
    paymentMethods: quickFacts['Payment Methods'] || '',
    support: quickFacts['Support'] || '',
    contentMarkdown,
    faqs,
    keywords: {
      primary: primaryKwMatch ? primaryKwMatch[1].trim() : '',
      secondary: secKwMatch ? secKwMatch[1].trim() : '',
      longTail: longTailMatch ? longTailMatch[1].trim() : '',
      romanUrdu: romanUrduMatch ? romanUrduMatch[1].trim() : ''
    },
    schema,
    updatedAt: getProductUpdatedAt(categorySlug, id)
  });
}

fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(products, null, 2));
console.log(`Saved data/products.json (${products.length} products)`);

// 4. Parse 03_reserve_merged_and_unlisted.txt for Merged Plans (52)
const reserveContent = fs.readFileSync(path.join(ROOT_DIR, '03_reserve_merged_and_unlisted.txt'), 'utf8');
const reserveBlocks = reserveContent.split(/={40,}\r?\nPRODUCT #(\d+):\s*(.*?)\r?\n={40,}/g);

const mergedPlans = [];
for (let i = 1; i < reserveBlocks.length; i += 3) {
  const id = parseInt(reserveBlocks[i]);
  const rawName = reserveBlocks[i + 1].trim();
  const body = reserveBlocks[i + 2];

  const statusMatch = body.match(/PAGE STATUS:\s*(.*?)(?:\r?\n|$)/);
  const status = statusMatch ? statusMatch[1] : '';
  if (!status.includes('MERGED INTO HUB')) continue;

  const redirectMatch = status.match(/301\s+(\/product\/[^\s\/]+\/)\s+to\s+(\/[^\s]+\/)/);
  const redirectTo = redirectMatch ? redirectMatch[2] : '';

  const slugMatch = body.match(/3\.\s*URL SLUG:\s*\r?\n(.*?)(?=\r?\n\r?\n4\.|\r?\n4\.)/s);
  const h1Match = body.match(/4\.\s*H1:\s*\r?\n(.*?)(?=\r?\n\r?\n5\.|\r?\n5\.)/s);
  const ansMatch = body.match(/5\.\s*ANSWER-FIRST PARAGRAPH:\s*\r?\n(.*?)(?=\r?\n\r?\n6\.|\r?\n6\.)/s);

  // Quick facts
  const qfMatch = body.match(/6\.\s*QUICK FACTS TABLE:\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n7\.)/);
  const quickFacts = {};
  if (qfMatch) {
    const qfLines = qfMatch[1].split(/\r?\n/);
    for (const line of qfLines) {
      if (line.includes('|') && !line.includes(':---')) {
        const cols = line.split('|').map(s => s.trim()).filter(Boolean);
        if (cols.length >= 2) quickFacts[cols[0]] = cols[1];
      }
    }
  }

  let price = null;
  const priceStr = quickFacts['Price'] || '';
  const priceMatch = priceStr.match(/Rs\.?\s*([\d,]+)/i);
  if (priceMatch) {
    price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  }

  // Derive categorySlug and brandSlug from redirectTo (e.g. /video-editing/capcut/)
  const targetParts = redirectTo.replace(/^\/|\/$/g, '').split('/');
  const categorySlug = targetParts[0] || '';
  const brandSlug = targetParts[1] || '';

  mergedPlans.push({
    id,
    name: rawName,
    slug: slugMatch ? slugMatch[1].trim() : '',
    redirectTo,
    categorySlug,
    brandSlug,
    h1: h1Match ? h1Match[1].trim() : '',
    answer: ansMatch ? ansMatch[1].trim() : '',
    price,
    duration: quickFacts['Duration'] || '',
    warranty: quickFacts['Warranty'] || '',
    accountType: quickFacts['Account Type'] || '',
    deliveryTime: quickFacts['Delivery Time'] || '',
    paymentMethods: quickFacts['Payment Methods'] || ''
  });
}

fs.writeFileSync(path.join(DATA_DIR, 'merged_plans.json'), JSON.stringify(mergedPlans, null, 2));
console.log(`Saved data/merged_plans.json (${mergedPlans.length} merged plans)`);

// 5. Parse 02_hub_and_category_pages.txt (15 category hubs + 44 brand hubs)
const hubsContent = fs.readFileSync(path.join(ROOT_DIR, '02_hub_and_category_pages.txt'), 'utf8');

// Category hubs
const catBlocks = hubsContent.split(/={40,}\r?\nCATEGORY HUB:\s*(.*?)\s*\((.*?)\)\r?\n={40,}/g);
const categoryHubs = [];
for (let i = 1; i < catBlocks.length; i += 3) {
  const name = catBlocks[i].trim();
  const url = catBlocks[i+1].trim();
  const body = catBlocks[i+2];

  const titleMatch = body.match(/1\.\s*SEO TITLE.*:\s*\r?\n(.*?)(?=\r?\n\r?\n2\.|\r?\n2\.)/s);
  const metaMatch = body.match(/2\.\s*META DESCRIPTION:\s*\r?\n(.*?)(?=\r?\n\r?\n3\.|\r?\n3\.)/s);
  const h1Match = body.match(/4\.\s*H1:\s*\r?\n(.*?)(?=\r?\n\r?\n5\.|\r?\n5\.)/s);
  const ansMatch = body.match(/5\.\s*ANSWER-FIRST PARAGRAPH:\s*\r?\n(.*?)(?=\r?\n\r?\n6\.|\r?\n6\.)/s);

  // Markdown content
  const contentMatch = body.match(/6\.\s*PAGE CONTENT:\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n## Frequently Asked Questions|\r?\n## Frequently Asked Questions|$)/);
  
  // FAQs
  const faqs = [];
  const faqMatch = body.match(/## Frequently Asked Questions\s*\r?\n([\s\S]*?)$/);
  if (faqMatch) {
    const qMatches = [...faqMatch[1].matchAll(/\*\*Q:\s*(.*?)\*\*\s*\r?\n(.*?)(?=(?:\r?\n\r?\n\*\*Q:|\r?\n\*\*Q:|$))/gs)];
    for (const qm of qMatches) {
      faqs.push({
        question: qm[1].trim(),
        answer: qm[2].trim()
      });
    }
  }

  const slug = url.replace(/^\/|\/$/g, '');
  categoryHubs.push({
    name,
    slug,
    url,
    seoTitle: titleMatch ? titleMatch[1].trim() : '',
    metaDesc: metaMatch ? metaMatch[1].trim() : '',
    h1: h1Match ? h1Match[1].trim() : '',
    answer: ansMatch ? ansMatch[1].trim() : '',
    contentMarkdown: contentMatch ? contentMatch[1].trim() : '',
    faqs
  });
}

// Canonical brand title casing map (Task 8)
const BRAND_NAMES = {
  'claude': 'Claude',
  'grok': 'Grok',
  'claude-api': 'Claude API',
  'cursor-api': 'Cursor API',
  'chinese-models-api': 'Chinese Models API',
  'deepseek-api': 'DeepSeek API',
  'grok-api': 'Grok API',
  'qwen-api': 'Qwen API',
  'chatgpt': 'ChatGPT',
  'kimi-ai': 'Kimi AI',
  'dreamina-ai': 'Dreamina AI',
  'kling-ai': 'Kling AI',
  'muse-video-api': 'Muse Video API',
  'openart-ai': 'OpenArt AI',
  'elevenlabs': 'ElevenLabs',
  'minimax-voice': 'MiniMax Voice',
  'suno-ai': 'Suno AI',
  'gpm-login': 'GPM Login',
  'kaspersky': 'Kaspersky',
  'apple-icloud': 'Apple iCloud+',
  'adobe-creative-cloud': 'Adobe Creative Cloud',
  'canva': 'Canva Pro',
  'figma': 'Figma',
  'meitu': 'Meitu',
  'xingtu': 'Xingtu',
  'jetbrains': 'JetBrains',
  'replit': 'Replit',
  'duolingo': 'Duolingo',
  'quizlet': 'Quizlet',
  'gamma-ai': 'Gamma AI',
  'notion': 'Notion',
  'zoom-pro': 'Zoom',
  'brainfm': 'Brain.fm',
  'fpt-play': 'FPT Play',
  'galaxy-play': 'Galaxy Play',
  'netflix': 'Netflix',
  'spotify': 'Spotify',
  'vieon': 'VieON',
  'pakistan-esim': 'Pakistan eSIM',
  'expressvpn': 'ExpressVPN',
  'hma-vpn': 'HMA VPN',
  'nordvpn': 'NordVPN',
  'purevpn': 'PureVPN',
  'surfshark-vpn': 'Surfshark VPN',
  'capcut': 'CapCut',
  'wink': 'Wink',
};

// Brand hubs
const brandBlocks = hubsContent.split(/={40,}\r?\nBRAND HUB:\s*(.*?)\s*\((.*?)\)\r?\n={40,}/g);
const brandHubs = [];
for (let i = 1; i < brandBlocks.length; i += 3) {
  const rawName = brandBlocks[i].trim();
  const url = brandBlocks[i+1].trim();
  const body = brandBlocks[i+2];

  const titleMatch = body.match(/1\.\s*SEO TITLE.*:\s*\r?\n(.*?)(?=\r?\n\r?\n2\.|\r?\n2\.)/s);
  const metaMatch = body.match(/2\.\s*META DESCRIPTION:\s*\r?\n(.*?)(?=\r?\n\r?\n3\.|\r?\n3\.)/s);
  const h1Match = body.match(/4\.\s*H1:\s*\r?\n(.*?)(?=\r?\n\r?\n5\.|\r?\n5\.)/s);
  const ansMatch = body.match(/5\.\s*ANSWER-FIRST PARAGRAPH:\s*\r?\n(.*?)(?=\r?\n\r?\n6\.|\r?\n6\.)/s);

  // Markdown content
  const contentMatch = body.match(/6\.\s*PAGE CONTENT:\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n## Frequently Asked Questions|\r?\n## Frequently Asked Questions|$)/);

  // FAQs
  const faqs = [];
  const faqMatch = body.match(/## Frequently Asked Questions\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n## Related Brands|\r?\n## Related Brands|$)/);
  if (faqMatch) {
    const qMatches = [...faqMatch[1].matchAll(/\*\*Q:\s*(.*?)\*\*\s*\r?\n(.*?)(?=(?:\r?\n\r?\n\*\*Q:|\r?\n\*\*Q:|$))/gs)];
    for (const qm of qMatches) {
      faqs.push({
        question: qm[1].trim(),
        answer: qm[2].trim()
      });
    }
  }

  const urlParts = url.replace(/^\/|\/$/g, '').split('/');
  const categorySlug = urlParts[0] || '';
  const brandSlug = urlParts[1] || '';
  const cleanBrandName = BRAND_NAMES[brandSlug] || rawName;

  brandHubs.push({
    name: cleanBrandName,
    url,
    categorySlug,
    brandSlug,
    seoTitle: titleMatch ? titleMatch[1].trim() : '',
    metaDesc: metaMatch ? metaMatch[1].trim() : '',
    h1: h1Match ? h1Match[1].trim() : '',
    answer: ansMatch ? ansMatch[1].trim() : '',
    contentMarkdown: contentMatch ? contentMatch[1].trim() : '',
    faqs
  });
}

const hubsData = {
  categories: categoryHubs,
  brands: brandHubs
};
fs.writeFileSync(path.join(DATA_DIR, 'hubs.json'), JSON.stringify(hubsData, null, 2));
console.log(`Saved data/hubs.json (${categoryHubs.length} category hubs, ${brandHubs.length} brand hubs)`);

// 6. Site Pages (extracted from template D object)
let sitePages = {};
if (fs.existsSync(path.join(ROOT_DIR, 'site_pages_extracted.json'))) {
  sitePages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'site_pages_extracted.json'), 'utf8'));
}
fs.writeFileSync(path.join(DATA_DIR, 'site_pages.json'), JSON.stringify(sitePages, null, 2));
console.log('Saved data/site_pages.json');

// 7. Process Brand Logos and Create data/brands.json
// Read official logos manifest
const manifestLines = fs.readFileSync(path.join(ROOT_DIR, 'brand_logos/official_logos_manifest.csv'), 'utf8').trim().split(/\r?\n/);
const logoMap = {};
for (let i = 1; i < manifestLines.length; i++) {
  const line = manifestLines[i].trim();
  if (!line) continue;
  const parts = line.split(',');
  if (parts.length < 6) continue;
  const brand = parts[2].trim();
  const filename = parts[5].trim();
  logoMap[brand.toLowerCase()] = filename;
  logoMap[parts[1].trim().toLowerCase()] = filename;
}
logoMap['pia'] = 'pia.png';
logoMap['chinese-models-api'] = 'chinese-models-api.png';
logoMap['chinese models api'] = 'chinese-models-api.png';
logoMap['lovable'] = 'lovable.png';
logoMap['seedance'] = 'seedance.png';
logoMap['easemate'] = 'seedance.png';

// Copy logo files to public/brands
const sourceLogosDir = path.join(ROOT_DIR, 'brand_logos/logos');
if (fs.existsSync(sourceLogosDir)) {
  const logoFiles = fs.readdirSync(sourceLogosDir);
  for (const f of logoFiles) {
    fs.copyFileSync(path.join(sourceLogosDir, f), path.join(BRANDS_DIR, f));
  }
  console.log(`Copied ${logoFiles.length} brand logos to public/brands/`);
}

// Also copy root brand assets to public/
const brandAssets = [
  'apple-touch-icon.png', 'favicon.ico', 'favicon-16.png', 'favicon-32.png',
  'favicon-48.png', 'favicon-96.png', 'logo-96.webp', 'logo-192.png',
  'logo-192.webp', 'logo-512.png', 'logo-512.webp', 'logo-source-square.png',
  'og-default.png'
];
for (const asset of brandAssets) {
  const src = path.join(ROOT_DIR, asset);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(PUBLIC_DIR, asset));
  }
}
console.log('Copied root brand assets to public/');

// Construct brands list: multi-plan brands + single-plan brands
// Map shortened names per spec 4.5:
const SHORT_NAMES = {
  'grok': 'Grok',
  'grok-cursor-x-premium-1-month': 'Grok + Cursor + X Premium',
  'grok-grok-bot-cursor-x-premium-4-in-1-bundle': 'Grok + Cursor + X Premium',
  'proton': 'Proton Unlimited',
  'proton-unlimited-1-month': 'Proton Unlimited',
  'proton-unlimited-all-in-one-swiss-privacy-suite': 'Proton Unlimited',
  'xbox-game-pass-ultimate-pc-edition': 'Xbox Game Pass',
  'autodesk-all-apps-68-applications': 'Autodesk All Apps',
  'private-internet-access-pia-vpn': 'Private Internet Access',
  'proxyscrape-residential-proxies': 'ProxyScrape Proxies',
  'apple-music-activation-link': 'Apple Music',
  'seedance': 'Seedance 2.5',
  'seedance-2-5-easemate-ai-pro-1-month': 'Seedance 2.5',
  'lovable': 'Lovable',
  'lovable-pro-1-month': 'Lovable'
};

// Collect all unique brandSlugs from products and hubs
const brandsMap = new Map();

// Add from brandHubs (multi-plan)
for (const bh of brandHubs) {
  const key = bh.brandSlug;
  const cleanDisplay = BRAND_NAMES[key] || SHORT_NAMES[key] || bh.name.replace(/ Price in Pakistan$/i, '');
  brandsMap.set(key, {
    slug: key,
    displayName: cleanDisplay,
    categorySlug: bh.categorySlug,
    isMultiPlan: true,
    hubUrl: bh.url,
    planCount: 0,
    priority: 10
  });
}

// Add single-plan brands from products that have parent with single slash: /category/
for (const p of products) {
  const parentParts = p.parent.replace(/^\/|\/$/g, '').split('/');
  if (parentParts.length === 1) {
    // Single-plan brand
    const catSlug = parentParts[0];
    const brandSlug = p.brandSlug || p.slug;
    if (!brandsMap.has(brandSlug)) {
      // Find clean brand name without chopping hyphenated phrases like 4-in-1 or All-in-One
      let bName = p.name.split(/\s+[–—]\s+/)[0].trim();
      const short = SHORT_NAMES[brandSlug] || bName;
      brandsMap.set(brandSlug, {
        slug: brandSlug,
        displayName: short,
        categorySlug: catSlug,
        isMultiPlan: false,
        productSlug: p.slug,
        productUrl: `/product/${p.slug}/`,
        planCount: 1,
        priority: 50
      });
    }
  }
}

// Count plans for all brands
for (const p of products) {
  const b = brandsMap.get(p.brandSlug);
  if (b && b.isMultiPlan) {
    b.planCount++;
  }
}
for (const mp of mergedPlans) {
  const b = brandsMap.get(mp.brandSlug);
  if (b && b.isMultiPlan) {
    b.planCount++;
  }
}

// Attach logo to each brand
const brandsList = Array.from(brandsMap.values()).map(b => {
  // Look up logo in logoMap
  let logoFile = null;
  const searchKeys = [
    b.slug,
    b.displayName.toLowerCase(),
    b.slug.replace(/-/g, ' '),
    b.slug.replace(/-/g, '')
  ];
  for (const sk of searchKeys) {
    if (logoMap[sk]) {
      logoFile = logoMap[sk];
      break;
    }
  }
  if (!logoFile) {
    // Try matching files in BRANDS_DIR
    const files = fs.readdirSync(BRANDS_DIR);
    const found = files.find(f => f.toLowerCase().includes(b.slug) || b.slug.includes(f.replace('.png', '')));
    if (found) logoFile = found;
  }
  return {
    ...b,
    logo: logoFile ? `/brands/${logoFile}` : null
  };
});

fs.writeFileSync(path.join(DATA_DIR, 'brands.json'), JSON.stringify(brandsList, null, 2));
console.log(`Saved data/brands.json (${brandsList.length} brands total)`);

console.log('--- Data Generation Complete! ---');
