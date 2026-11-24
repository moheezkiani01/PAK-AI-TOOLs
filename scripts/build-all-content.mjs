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

// ---------------------------------------------------------------------
// 2. Clean data/products.json of duplicate empty FAQ heading and duplicate H1/H2
// ---------------------------------------------------------------------
const productsPath = path.join(ROOT_DIR, 'data', 'products.json');
if (fs.existsSync(productsPath)) {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  for (const p of products) {
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
  console.log('Cleaned data/products.json (duplicate FAQ headings stripped and duplicate H2s replaced with questions)');
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
    date: '2026-11-22'
  });
}

// Read existing site_pages.json to preserve master how-to guides (e.g. buy without credit card, canva vs adobe)
const sitePagesPath = path.join(ROOT_DIR, 'data', 'site_pages.json');
let evergreenPosts = [];
if (fs.existsSync(sitePagesPath)) {
  const sitePages = JSON.parse(fs.readFileSync(sitePagesPath, 'utf8'));
  if (sitePages.blog) {
    evergreenPosts = sitePages.blog.filter(p => !p.slug.endsWith('-price-guide-pakistan'));
  }
}

const allBlogItems = [...blogs, ...evergreenPosts].map(b => ({
  ...b,
  summary: stripSterics(b.summary || b.ans || ''),
  desc: stripSterics(b.desc || ''),
  ans: stripSterics(b.ans || ''),
  metaDesc: stripSterics(b.metaDesc || ''),
}));

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
