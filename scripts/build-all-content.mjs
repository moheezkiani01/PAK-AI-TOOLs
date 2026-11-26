import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const compFile = 'C:/Users/hp/Downloads/02_pakaitools_product_comparisons_seo_aeo_geo.md';
const blogFile = 'C:/Users/hp/Downloads/03_pakaitools_product_blogs_seo_aeo_geo.md';

console.log('=== Building All Comparisons, Blogs, News & Cleaning Data ===');

if (!fs.existsSync(compFile) || !fs.existsSync(blogFile)) {
  console.log('Source comparison/blog markdown files not found at downloads path; using existing data/comparisons.json and data/blogs.json');
  process.exit(0);
}

function cleanLinks(text) {
  if (!text) return '';
  return text
    .replace(/https:\/\/www\.google\.com\/search\?q=%2F([^)]+)%2F/g, '/$1/')
    .replace(/https:\/\/www\.google\.com\/search\?q=(\/[^)\s]+)/g, '$1')
    .replace(/https:\/\/www\.google\.com\/search\?q=/g, '');
}

function stripSterics(text) {
  if (!text) return '';
  return text.replace(/\*\*/g, '').replace(/`/g, '').trim();
}

function cleanAnswer(ans) {
  if (!ans) return '';
  // Cut off leaked sections starting with numbered instructions
  const match = ans.match(/\n\n\d+\.\s*(?:INTERNAL LINKS|JSON-LD SCHEMA|LAST UPDATED)/i);
  if (match) {
    return ans.slice(0, match.index).trim();
  }
  return ans.trim();
}

// ---------------------------------------------------------------------
// 1. Clean data/hubs.json of leaked instructions
// ---------------------------------------------------------------------
const hubsPath = path.join(ROOT_DIR, 'data', 'hubs.json');
if (fs.existsSync(hubsPath)) {
  const hubs = JSON.parse(fs.readFileSync(hubsPath, 'utf8'));
  
  // Clean category hubs
  if (hubs.categories) {
    for (const cat of hubs.categories) {
      if (cat.faqs) {
        for (const faq of cat.faqs) {
          faq.answer = cleanAnswer(faq.answer);
        }
      }
      if (cat.contentMarkdown) {
        // Remove leaked sections
        cat.contentMarkdown = cleanAnswer(cat.contentMarkdown);
        // Remove duplicate "Brands in X" markdown section since page template renders the interactive grid
        cat.contentMarkdown = cat.contentMarkdown.replace(/##\s*Brands in [^\n]+\n[\s\S]*?(?=\n##|$)/i, '').trim();
      }
    }
  }

  // Clean brand hubs
  if (hubs.brands) {
    for (const b of hubs.brands) {
      if (b.brandSlug === 'claude' || b.brandSlug === 'dreamina-ai' || b.brandSlug === 'grok') {
        b.updatedAt = '2026-11-26';
      } else {
        b.updatedAt = '2026-11-22';
      }
      if (b.faqs) {
        for (const faq of b.faqs) {
          faq.answer = cleanAnswer(faq.answer);
        }
      }
      if (b.contentMarkdown) {
        b.contentMarkdown = cleanAnswer(b.contentMarkdown);
      }
    }
  }

  fs.writeFileSync(hubsPath, JSON.stringify(hubs, null, 2), 'utf8');
  console.log('Cleaned data/hubs.json (all leaked generation instructions removed)');
}

const BLOG_GUIDE_DATES = {
  'ai-chatbots': '2026-11-23',
  'ai-apis': '2026-11-23',
  'ai-video-image': '2026-11-23',
  'design-creative': '2026-11-22',
  'video-editing': '2026-11-22',
  'developer-tools': '2026-11-21',
  'productivity-software': '2026-11-22',
  'streaming': '2026-11-21',
  'vpn-privacy': '2026-11-20',
  'esim': '2026-11-20',
  'ai-voice-audio': '2026-11-19',
  'cloud-storage': '2026-11-19',
  'education': '2026-11-18',
  'antidetect-proxies': '2026-11-18',
  'antivirus': '2026-11-17',
};

// Real date when product prices and plans were last verified
function getProductUpdatedAt(categorySlug, id) {
  if (id === 15 || id === 139 || id === 208 || id >= 271) {
    return '2026-11-26';
  }
  return '2026-11-22';
}

// ---------------------------------------------------------------------
// 2. Clean data/products.json of duplicate empty FAQ heading and duplicate H1/H2
// ---------------------------------------------------------------------
function getDynamicSavings(p, allProds) {
  if (p.slug === 'claude-pro-shared-1-month') {
    const priv = allProds.find(x => x.slug === 'claude-pro-full-private-1-month');
    if (priv && priv.price && p.price) {
      const diff = priv.price - p.price;
      return `saving Rs. ${diff.toLocaleString('en-US')} compared to Claude Pro (Full Private) at Rs. ${priv.price.toLocaleString('en-US')}`;
    }
  }
  if (p.slug === 'brainfm-60-days') {
    const single = allProds.find(x => x.slug === 'brainfm-30-days');
    if (single && single.price && p.price) {
      const baseline = single.price * 2;
      const diff = baseline - p.price;
      return `saving Rs. ${diff.toLocaleString('en-US')} compared to two 30-day passes`;
    }
  }
  if (p.slug === 'brainfm-90-days') {
    const single = allProds.find(x => x.slug === 'brainfm-30-days');
    if (single && single.price && p.price) {
      const baseline = single.price * 3;
      const diff = baseline - p.price;
      return `saving Rs. ${diff.toLocaleString('en-US')} compared to three 30-day passes`;
    }
  }
  if (p.slug === 'pakistan-esim-10gb-30-days') {
    const single = allProds.find(x => x.slug === 'pakistan-esim-5gb-30-days');
    if (single && single.price && p.price) {
      const baseline = single.price * 2;
      const diff = baseline - p.price;
      return `saving Rs. ${diff.toLocaleString('en-US')} compared to two 5GB plans`;
    }
  }
  if (p.slug === 'pakistan-esim-20gb-30-days') {
    const single = allProds.find(x => x.slug === 'pakistan-esim-10gb-30-days');
    if (single && single.price && p.price) {
      const baseline = single.price * 2;
      const diff = baseline - p.price;
      return `saving Rs. ${diff.toLocaleString('en-US')} compared to two 10GB plans`;
    }
  }
  if (p.slug === 'wink-vip-ios-90-days') {
    const single = allProds.find(x => x.slug === 'wink-vip-ios-30-days');
    if (single && single.price && p.price) {
      const baseline = single.price * 3;
      const diff = baseline - p.price;
      return `saving Rs. ${diff.toLocaleString('en-US')} compared to three 30-day passes`;
    }
  }
  return null;
}

function cleanField(val) {
  if (!val) return '';
  return val.replace(/\s+/g, ' ').trim();
}

function buildCatalogueDescription(p, allProds) {
  const dynamicSavings = getDynamicSavings(p, allProds);
  const name = cleanField(p.name);
  const duration = cleanField(p.duration);
  const warranty = cleanField(p.warranty);
  let accountType = cleanField(p.accountType);

  if (p.slug === 'microsoft-365-admin-account-1-year') {
    accountType = 'Admin Microsoft 365 Family account (preloaded master login; allows inviting up to 5 family/team members)';
  }

  if (typeof p.price === 'number' && p.price > 0) {
    const priceFormatted = `Rs. ${p.price.toLocaleString('en-US')}`;
    const savingsFormatted = dynamicSavings ? ` (${dynamicSavings})` : '';
    let desc = `The ${name} price in Pakistan is ${priceFormatted}${savingsFormatted} on PakAITools.`;
    if (duration) desc += ` Duration: ${duration}.`;
    if (accountType) desc += ` Account format: ${accountType}.`;
    if (warranty) desc += ` Backed by ${warranty}.`;
    desc += ` Payable locally in PKR via JazzCash, EasyPaisa, SadaPay, NayaPay, Raast or UBL bank transfer.`;
    return desc;
  } else {
    let desc = `The ${name} price in Pakistan is quoted live in PKR via PakAITools WhatsApp support (+92 321 9305619).`;
    if (duration) desc += ` Duration: ${duration}.`;
    if (accountType) desc += ` Account format: ${accountType}.`;
    if (warranty) desc += ` Backed by ${warranty}.`;
    return desc;
  }
}

const productsPath = path.join(ROOT_DIR, 'data', 'products.json');
if (fs.existsSync(productsPath)) {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  for (const p of products) {
    p.priceValidUntil = '2027-02-20';
    p.updatedAt = '2026-11-26';
    p.answer = buildCatalogueDescription(p, products);

    if (p.slug === 'meta-muse-ai-1-billion-tokens') {
      p.seoTitle = 'Meta Muse AI 1B Tokens (OTP Login) – Rs. 300 | Pakistan';
      p.h1 = 'Meta Muse AI 1 Billion Tokens (OTP Login, No Warranty) Price in Pakistan';
      p.metaDesc = 'Buy Meta Muse AI 1B tokens ready account in Pakistan for Rs. 300. OTP web link login, no warranty. Pay locally via JazzCash, EasyPaisa & Raast.';
    }
    if (p.slug === 'muse-ai-1b-token-account') {
      p.seoTitle = 'Muse AI 1B Token Hotmail Account – Rs. 500 | Pakistan';
      p.h1 = 'Muse AI 1B Token Hotmail Account (Activation Warranty) Price in Pakistan';
      p.metaDesc = 'Buy Muse AI 1B token account in Pakistan for Rs. 500. Hotmail login with 2FA and recovery code, activation warranty. Pay via JazzCash & Raast.';
    }

    // Optimize SEO title: drop trailing parenthetical if full title > 60 chars
    if (p.seoTitle) {
      let clean = p.seoTitle.replace(/\s*\|\s*PakAITools\s*$/i, '').trim();
      const full = `${clean} | PakAITools`;
      if (full.length > 60 && /\s*\([^)]+\)\s*$/.test(clean)) {
        clean = clean.replace(/\s*\([^)]+\)\s*$/, '').trim();
        p.seoTitle = `${clean} | PakAITools`;
      }
    }
    if (p.contentMarkdown) {
      // Remove trailing "## Frequently Asked Questions" heading since page renders <Faq> component
      p.contentMarkdown = p.contentMarkdown.replace(/##\s*Frequently Asked Questions[\s\S]*$/i, '').trim();

      // Replace duplicate H2 that repeats H1 with question-style H2
      const lines = p.contentMarkdown.split('\n');
      const h1Clean = (p.h1 || '').trim().toLowerCase();
      const namePriceClean = ((p.name || '') + ' price in pakistan').trim().toLowerCase();
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('## ')) {
          const headingText = lines[i].replace(/^##\s+/, '').trim().toLowerCase();
          if (headingText === h1Clean || headingText === namePriceClean) {
            lines[i] = `## How Much Does ${p.name} Cost in Pakistan?`;
            break;
          }
        }
      }
      p.contentMarkdown = lines.join('\n');
    }
  }
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log('Cleaned data/products.json (descriptions rewritten to catalogue fields with dynamic build-time savings)');
}

// ---------------------------------------------------------------------
// 3. Parse Comparisons (Hub + 20 Pages)
// ---------------------------------------------------------------------
const compRaw = fs.readFileSync(compFile, 'utf8');

const compHubMatch = compRaw.match(/## PART 2: COMPARISON HUB PAGE \(`\/compare\/`\)([\s\S]*?)## PART 3:/);
let compHub = {
  title: 'Compare AI Tools & Subscriptions in Pakistan (2026) | PakAITools',
  desc: 'Compare ChatGPT, Claude, Kling AI, ElevenLabs, Adobe, CapCut, VPNs, Netflix, Spotify & Pakistan eSIM plans side by side in PKR. Local payment & warranty.',
  h1: 'Compare AI Tools, Software & Subscriptions in Pakistan (PKR Price & Plan Guide)',
  intro: 'Not sure which AI subscription, creative suite, VPN, or streaming plan fits your budget in Pakistan? Use PakAITools\' side-by-side comparison guides to compare exact PKR prices, durations, warranty terms, device limits, and own-account upgrade vs. ready-account options before paying via JazzCash, EasyPaisa, SadaPay, NayaPay, or Raast.'
};

if (compHubMatch) {
  const hubText = compHubMatch[1];
  const title = (hubText.match(/- \*\*SEO Title:\*\*\s*(.*)/) || [])[1]?.trim();
  const desc = (hubText.match(/- \*\*Meta Description:\*\*\s*(.*)/) || [])[1]?.trim();
  const h1 = (hubText.match(/- \*\*H1:\*\*\s*(.*)/) || [])[1]?.trim();
  const introMatch = hubText.match(/\*\*Answer-First Hub Intro:\*\*\s*\n([\s\S]*?)(?=### All Product Comparison Guides)/);
  if (title) compHub.title = stripSterics(title);
  if (desc) compHub.desc = stripSterics(desc);
  if (h1) compHub.h1 = stripSterics(h1);
  if (introMatch) compHub.intro = stripSterics(cleanLinks(introMatch[1].trim()));
}

const compParts = compRaw.split(/### COMPARISON #\d+:\s*/);
const comparisons = [];

for (let i = 1; i < compParts.length; i++) {
  const part = compParts[i];
  const lines = part.split('\n');
  const rawTitle = lines[0].trim();
  
  const seoTitle = (part.match(/- \*\*SEO Title:\*\*\s*(.*)/) || [])[1]?.trim() || rawTitle;
  const metaDesc = (part.match(/- \*\*Meta Description:\*\*\s*(.*)/) || [])[1]?.trim() || '';
  const slug = (part.match(/- \*\*URL Slug:\*\*\s*`?([a-zA-Z0-9_-]+)`?/) || [])[1]?.trim() || '';
  const h1 = (part.match(/- \*\*H1:\*\*\s*(.*)/) || [])[1]?.trim() || rawTitle;

  const verdictMatch = part.match(/\*\*Answer-First Verdict \([^)]+\):\*\*\s*\n([\s\S]*?)(?=####|\n\n- \*\*Keyword Map)/);
  const verdict = verdictMatch ? verdictMatch[1].trim() : '';

  const faqs = [];
  const faqBlockMatch = part.match(/#### FAQs \([^)]+\)\s*\n([\s\S]*?)(?=\n- \*\*Keyword Map|\n```json)/);
  if (faqBlockMatch) {
    const faqText = faqBlockMatch[1];
    const qMatches = faqText.matchAll(/- \*\*Q:\s*([^*]+)\*\*\s*\n\s+\*\*A:\*\*\s*([^\n]+(?:\n(?!\s*- \*\*Q:)[^\n]+)*)/g);
    for (const m of qMatches) {
      faqs.push({
        question: m[1].trim(),
        answer: cleanLinks(m[2].trim())
      });
    }
  }

  let schema = null;
  const jsonMatch = part.match(/```json\s*\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    try {
      schema = JSON.parse(jsonMatch[1]);
    } catch (e) {}
  }

  let bodyMd = '';
  const bodyStartIdx = part.indexOf('#### Side-by-Side Comparison Table') !== -1 
    ? part.indexOf('#### Side-by-Side Comparison Table')
    : part.indexOf('####');
  const bodyEndIdx = part.indexOf('- **Keyword Map:');
  if (bodyStartIdx !== -1 && bodyEndIdx !== -1) {
    bodyMd = part.slice(bodyStartIdx, bodyEndIdx).trim();
  }

  // Derive category tag
  let category = 'AI Tools';
  if (/vpn/i.test(slug)) category = 'VPN & Privacy';
  else if (/chatgpt|claude|gemini|kimi|manus|minimax/i.test(slug)) category = 'AI Chatbots';
  else if (/api|cursor/i.test(slug)) category = 'AI APIs';
  else if (/kling|dreamina|runway|veo|openart|muse/i.test(slug)) category = 'AI Video & Image';
  else if (/elevenlabs|suno|voice/i.test(slug)) category = 'AI Voice & Audio';
  else if (/adobe|canva|figma/i.test(slug)) category = 'Design & Creative';
  else if (/capcut|alight|wink/i.test(slug)) category = 'Video Editing';
  else if (/meitu|xingtu/i.test(slug)) category = 'Photo & Beauty';
  else if (/kaspersky/i.test(slug)) category = 'Antivirus';
  else if (/notion|gamma|microsoft/i.test(slug)) category = 'Productivity';
  else if (/coursera|udemy|skillshare/i.test(slug)) category = 'Education';
  else if (/duolingo|quizlet/i.test(slug)) category = 'Language & Study';
  else if (/netflix|prime|hbo|paramount/i.test(slug)) category = 'Streaming';
  else if (/spotify|youtube|apple/i.test(slug)) category = 'Music Streaming';
  else if (/esim/i.test(slug)) category = 'Travel eSIM';

  comparisons.push({
    id: i,
    category,
    rawTitle,
    seoTitle: stripSterics(seoTitle),
    metaDesc: stripSterics(metaDesc),
    slug,
    canonical: `https://pakaitools.store/compare/${slug}/`,
    h1,
    verdict: stripSterics(cleanLinks(verdict)),
    contentMarkdown: cleanLinks(bodyMd),
    faqs,
    schema,
    date: '2026-11-22'
  });
}


for (const c of comparisons) {
  if (
    c.slug === 'notion-plus-vs-notion-business-vs-gamma-vs-microsoft-365' ||
    c.slug === 'netflix-4k-vs-amazon-prime-vs-hbo-max-vs-paramount-plus' ||
    c.slug === 'spotify-premium-vs-youtube-premium-vs-apple-music'
  ) {
    c.date = '2026-11-26';
    c.updatedAt = '2026-11-26';
  } else {
    c.date = '2026-11-22';
    c.updatedAt = '2026-11-22';
  }
}

// Price updates normalization
for (const c of comparisons) {
  if (c.slug === 'netflix-4k-vs-amazon-prime-vs-hbo-max-vs-paramount-plus') {
    c.metaDesc = c.metaDesc.replace('Amazon Prime Video (Rs. 450)', 'Amazon Prime Video (Rs. 650)');
    c.verdict = c.verdict.replace('Amazon Prime Video 1 Month (Rs. 450)', 'Amazon Prime Video 1 Month (Rs. 650)');
    c.contentMarkdown = c.contentMarkdown.replace(
      '| **Amazon Prime Video 1M** | Rs. 450 |',
      '| **Amazon Prime Video 1M** | Rs. 650 |'
    );
  }
  if (c.slug === 'spotify-premium-vs-youtube-premium-vs-apple-music') {
    c.metaDesc = c.metaDesc.replace('YouTube Premium 1M (Rs. 300)', 'YouTube Premium 1M (Rs. 500)');
    c.verdict = c.verdict.replace('YouTube Premium 1 Month Slot (Rs. 300)', 'YouTube Premium 1 Month Slot (Rs. 500)');
    c.contentMarkdown = c.contentMarkdown
      .replace(
        '| **YouTube Premium 1M** | Rs. 300 | 1 Month | Rs. 300/mo |',
        '| **YouTube Premium 1M** | Rs. 500 | 1 Month | Rs. 500/mo |'
      )
      .replace(
        'Does YouTube Premium (Rs. 300) include YouTube Music?',
        'Does YouTube Premium (Rs. 500) include YouTube Music?'
      );
    if (c.faqs) {
      c.faqs.forEach(f => {
        f.question = f.question.replace('Does YouTube Premium (Rs. 300)', 'Does YouTube Premium (Rs. 500)');
        f.answer = f.answer.replace('Rs. 300', 'Rs. 500');
      });
    }
    if (c.schema) {
      let schemaStr = JSON.stringify(c.schema);
      schemaStr = schemaStr.replace(/Does YouTube Premium \(Rs\. 300\)/g, 'Does YouTube Premium (Rs. 500)')
                           .replace(/1 month at Rs\. 300/g, '1 month at Rs. 500');
      c.schema = JSON.parse(schemaStr);
    }
  }
}

fs.writeFileSync(
  path.join(ROOT_DIR, 'data', 'comparisons.json'),
  JSON.stringify({ hub: compHub, items: comparisons }, null, 2),
  'utf8'
);
console.log(`Saved data/comparisons.json (${comparisons.length} product comparisons)`);

// ---------------------------------------------------------------------
// 4. Parse Blogs (Hub + 15 Category Buying Guides)
// ---------------------------------------------------------------------
const blogRaw = fs.readFileSync(blogFile, 'utf8');

const blogHubMatch = blogRaw.match(/## PART 2: BLOG HUB PAGE \(`\/blog\/`\)([\s\S]*?)## PART 3:/);
let blogHub = {
  title: 'PakAITools Blog — 2026 PKR Price Guides & AI Tool Tips Pakistan',
  desc: 'Read 2026 PKR price guides, warranty checklists, and buying advice for AI chatbots, APIs, video/voice tools, Adobe, VPNs, Netflix, Spotify & Pakistan eSIMs.',
  h1: 'PakAITools Blog: 2026 PKR Price Guides & Buying Tips for Digital Subscriptions in Pakistan',
  intro: 'Explore our 15 category buying guides built specifically for freelancers, students, developers, agencies, and everyday users in Pakistan. Every guide lists verified PKR pricing, warranty coverage, own-account upgrade vs. ready-account rules, and local payment instructions via JazzCash, EasyPaisa, SadaPay, NayaPay, and Raast.'
};

if (blogHubMatch) {
  const hubText = blogHubMatch[1];
  const title = (hubText.match(/- \*\*SEO Title:\*\*\s*(.*)/) || [])[1]?.trim();
  const desc = (hubText.match(/- \*\*Meta Description:\*\*\s*(.*)/) || [])[1]?.trim();
  const h1 = (hubText.match(/- \*\*H1:\*\*\s*(.*)/) || [])[1]?.trim();
  const introMatch = hubText.match(/\*\*Answer-First Hub Intro:\*\*\s*\n([\s\S]*?)(?=### All 15 Category)/);
  if (title) blogHub.title = stripSterics(title);
  if (desc) blogHub.desc = stripSterics(desc);
  if (h1) blogHub.h1 = stripSterics(h1);
  if (introMatch) blogHub.intro = stripSterics(cleanLinks(introMatch[1].trim()));
}

const blogParts = blogRaw.split(/### BLOG POST #\d+:\s*/);
const blogs = [];

for (let i = 1; i < blogParts.length; i++) {
  const part = blogParts[i];
  const lines = part.split('\n');
  const rawTitle = lines[0].trim();
  
  const seoTitle = (part.match(/- \*\*SEO Title:\*\*\s*(.*)/) || [])[1]?.trim() || rawTitle;
  const metaDesc = (part.match(/- \*\*Meta Description:\*\*\s*(.*)/) || [])[1]?.trim() || '';
  const slug = (part.match(/- \*\*URL Slug:\*\*\s*`?([a-zA-Z0-9_-]+)`?/) || [])[1]?.trim() || '';
  const h1 = (part.match(/- \*\*H1:\*\*\s*(.*)/) || [])[1]?.trim() || rawTitle;

  const summaryMatch = part.match(/\*\*Answer-First Summary \([^)]+\):\*\*\s*\n([\s\S]*?)(?=####|\n\n- \*\*Related)/);
  const summary = summaryMatch ? summaryMatch[1].trim() : '';

  const faqs = [];
  const faqBlockMatch = part.match(/#### FAQs \([^)]+\)\s*\n([\s\S]*?)(?=\n- \*\*Related|\n- \*\*Image Asset|\n```json)/);
  if (faqBlockMatch) {
    const faqText = faqBlockMatch[1];
    const qMatches = faqText.matchAll(/- \*\*Q:\s*([^*]+)\*\*\s*\n\s+\*\*A:\*\*\s*([^\n]+(?:\n(?!\s*- \*\*Q:)[^\n]+)*)/g);
    for (const m of qMatches) {
      faqs.push({
        question: m[1].trim(),
        answer: cleanLinks(m[2].trim())
      });
    }
  }

  let schema = null;
  const jsonMatch = part.match(/```json\s*\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    try {
      schema = JSON.parse(jsonMatch[1]);
    } catch (e) {}
  }

  let bodyMd = '';
  const bodyStartIdx = part.indexOf('####');
  const bodyEndIdx = part.indexOf('- **Related');
  if (bodyStartIdx !== -1 && bodyEndIdx !== -1) {
    bodyMd = part.slice(bodyStartIdx, bodyEndIdx).trim();
  }

  const catSlug = slug.replace(/-price-guide-pakistan$/, '');
  const blogDate = BLOG_GUIDE_DATES[catSlug] || '2026-11-20';

  blogs.push({
    id: i,
    rawTitle,
    seoTitle: stripSterics(seoTitle),
    metaDesc: stripSterics(metaDesc),
    slug,
    canonical: `https://pakaitools.store/blog/${slug}/`,
    h1,
    summary: stripSterics(cleanLinks(summary)),
    contentMarkdown: cleanLinks(bodyMd),
    faqs,
    schema,
    type: 'guide',
    date: blogDate
  });
}

const EVERGREEN_DATES = {
  'canva-pro-1-month-vs-1-year-pakistan': '2026-11-22',
  'adobe-creative-cloud-7-days-vs-4-months-vs-1-year': '2026-11-21',
  'buy-subscriptions-in-pakistan-without-credit-card': '2026-11-20',
  'chatgpt-vs-claude-vs-gemini-pakistan': '2026-11-23',
  'canva-pro-vs-adobe-creative-cloud-freelancers': '2026-11-21',
  'nordvpn-vs-expressvpn-pakistan': '2026-11-20',
};

// Read existing site_pages.json to preserve master how-to guides (e.g. buy without credit card, canva vs adobe)
const sitePagesPath = path.join(ROOT_DIR, 'data', 'site_pages.json');
let evergreenPosts = [];
if (fs.existsSync(sitePagesPath)) {
  const sitePages = JSON.parse(fs.readFileSync(sitePagesPath, 'utf8'));
  if (sitePages.blog) {
    evergreenPosts = sitePages.blog
      .filter(p => !p.slug.endsWith('-price-guide-pakistan'))
      .map(p => ({
        ...p,
        date: EVERGREEN_DATES[p.slug] || p.date || '2026-11-20'
      }));
  }
}

const allBlogItems = [...blogs, ...evergreenPosts].map(b => {
  const item = {
    ...b,
    summary: stripSterics(b.summary || b.ans || ''),
    desc: stripSterics(b.desc || ''),
    ans: stripSterics(b.ans || ''),
    metaDesc: stripSterics(b.metaDesc || ''),
  };
  if (item.slug === 'buy-subscriptions-in-pakistan-without-credit-card') {
    item.h1 = item.h1 || 'How to Buy Subscriptions in Pakistan Without a Credit Card (2026 Guide)';
    item.title = 'Buy Subscriptions in Pakistan Without a Credit Card (2026)';
    item.seoTitle = 'Buy Subscriptions in Pakistan Without a Credit Card (2026)';
  }
  return item;
});


// Price updates normalization in blogs
for (const b of allBlogItems) {
  if (b.slug === 'streaming-price-guide-pakistan') {
    b.summary = (b.summary || '').replace(
      '**Rs. 300/month** for YouTube Premium (own Gmail) and **Rs. 450/month** for Amazon Prime Video',
      '**Rs. 500/month** for YouTube Premium (own Gmail) and **Rs. 650/month** for Amazon Prime Video'
    );
    b.ans = (b.ans || '').replace(
      '**Rs. 300/month** for YouTube Premium (own Gmail) and **Rs. 450/month** for Amazon Prime Video',
      '**Rs. 500/month** for YouTube Premium (own Gmail) and **Rs. 650/month** for Amazon Prime Video'
    );
    b.contentMarkdown = (b.contentMarkdown || '')
      .replace('[Amazon Prime Video 1M](/product/amazon-prime-video-1-month/) (Rs. 450)', '[Amazon Prime Video 1M](/product/amazon-prime-video-1-month/) (Rs. 650)')
      .replace('[YouTube Premium 1M Slot](/product/youtube-premium-1-month-slot/) (Rs. 300)', '[YouTube Premium 1M Slot](/product/youtube-premium-1-month-slot/) (Rs. 500)')
      .replace('YouTube Premium (Rs. 300) + Amazon Prime Video (Rs. 450) sirf Rs. 750/month', 'YouTube Premium (Rs. 500) + Amazon Prime Video (Rs. 650) sirf Rs. 1,150/month');
    if (b.faqs) {
      b.faqs.forEach(f => {
        f.answer = (f.answer || '').replace('YouTube Premium (Rs. 300) + Amazon Prime Video (Rs. 450) sirf Rs. 750/month', 'YouTube Premium (Rs. 500) + Amazon Prime Video (Rs. 650) sirf Rs. 1,150/month');
      });
    }
  }
  if (b.slug === 'productivity-software-price-guide-pakistan') {
    b.contentMarkdown = (b.contentMarkdown || '').replace(
      '[LinkedIn Premium Career 3M Promo](/product/linkedin-premium-career-3-months-promo/) (Rs. 650,',
      '[LinkedIn Premium Career 3M Promo](/product/linkedin-premium-career-3-months-promo/) (Rs. 1,000,'
    );
    if (b.faqs) {
      b.faqs.forEach(f => {
        f.question = (f.question || '').replace('LinkedIn Premium Career 3 Months (Rs. 650)', 'LinkedIn Premium Career 3 Months (Rs. 1,000)');
      });
    }
  }
}

fs.writeFileSync(
  path.join(ROOT_DIR, 'data', 'blogs.json'),
  JSON.stringify({ hub: blogHub, items: allBlogItems }, null, 2),
  'utf8'
);
if (fs.existsSync(sitePagesPath)) {
  const sitePages = JSON.parse(fs.readFileSync(sitePagesPath, 'utf8'));
  sitePages.blog = allBlogItems;
  fs.writeFileSync(sitePagesPath, JSON.stringify(sitePages, null, 2), 'utf8');
}
console.log(`Saved data/blogs.json (${allBlogItems.length} total blog posts: 15 category guides + ${evergreenPosts.length} evergreen guides)`);

// ---------------------------------------------------------------------
// 5. Option A: News unpublished in favor of verified pricing guides
const newsDir = path.join(ROOT_DIR, 'content', 'news');
if (fs.existsSync(newsDir)) {
  fs.rmSync(newsDir, { recursive: true, force: true });
}
fs.writeFileSync(path.join(ROOT_DIR, 'data', 'news.json'), JSON.stringify([], null, 2), 'utf8');
console.log('Unpublished news items (written empty data/news.json, 301 redirects to /blog/)');

console.log('=== All Content Built Successfully! ===');
