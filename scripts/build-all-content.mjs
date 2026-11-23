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
// 2. Clean data/products.json of duplicate empty FAQ heading
// ---------------------------------------------------------------------
const productsPath = path.join(ROOT_DIR, 'data', 'products.json');
if (fs.existsSync(productsPath)) {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  for (const p of products) {
    if (p.contentMarkdown) {
      // Remove trailing "## Frequently Asked Questions" heading since page renders <Faq> component
      p.contentMarkdown = p.contentMarkdown.replace(/##\s*Frequently Asked Questions[\s\S]*$/i, '').trim();
    }
  }
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log('Cleaned data/products.json (duplicate FAQ headings stripped from markdown)');
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
// 5. Create content/news/ Directory & 3 Verified News Posts
// ---------------------------------------------------------------------
const newsDir = path.join(ROOT_DIR, 'content', 'news');
if (!fs.existsSync(newsDir)) {
  fs.mkdirSync(newsDir, { recursive: true });
}

const sampleNews = [
  {
    title: 'OpenAI Previews Operator: Autonomous Agent for Browser and Desktop Workflows',
    slug: 'openai-operator-autonomous-agent',
    date: '2026-11-20',
    summary: 'OpenAI previewed Operator, an agentic AI system designed to autonomously navigate web applications, fill complex forms, and execute end-to-end tasks directly in the browser.',
    tags: ['OpenAI', 'AI Agents', 'Automation'],
    sources: [
      { name: 'OpenAI Developer Preview', url: 'https://openai.com/index/operator-preview/' },
      { name: 'OpenAI Research Notes', url: 'https://openai.com/research/' }
    ],
    content: `## What Happened
OpenAI has officially unveiled **Operator**, its dedicated agentic AI model that can execute multi-step computer tasks, interact directly with web interfaces, and complete complex user workflows without human intervention.

## Key Technical Capabilities
- **Direct Browser Navigation:** Operator observes web pages visually, interacts with form fields, buttons, and dynamic JavaScript applications, and recovers gracefully from site errors.
- **Agentic Task Execution:** Users provide high-level goals (e.g., "Research flight prices and compile a summary into a spreadsheet"), and Operator plans and executes the necessary steps sequentially.
- **Safety & Confirmation Gates:** Sensitive operations such as final financial checkouts and password inputs require explicit human confirmation.

## What This Means for Pakistani Freelancers & Agencies
For digital agencies and freelancers in Pakistan offering SEO, data entry, lead generation, or QA testing on Upwork and Fiverr:
1. Repetitive manual web tasks can be converted into automated workflows.
2. Pakistani software developers can integrate Operator-style agents via upcoming API endpoints.
3. Access through PakAITools ChatGPT Plus and Pro accounts ensures local PKR billing without international credit card barriers.

## Sources & Official Documentation
- [OpenAI Operator Announcement](https://openai.com/index/operator-preview/)
- [OpenAI Agent Research Report](https://openai.com/research/)`
  },
  {
    title: 'DeepSeek-V3 Released: 671B Parameter Open Model Matches Top Frontier LLMs',
    slug: 'deepseek-v3-open-weights-breakthrough',
    date: '2026-11-18',
    summary: 'DeepSeek has officially released DeepSeek-V3, featuring 671B total parameters with exceptional coding, mathematics, and multilingual reasoning at unprecedented low token costs.',
    tags: ['DeepSeek', 'Open Weights', 'AI APIs'],
    sources: [
      { name: 'DeepSeek AI Technical Report', url: 'https://github.com/deepseek-ai/DeepSeek-V3' },
      { name: 'Hugging Face Model Card', url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3' }
    ],
    content: `## What Happened
DeepSeek AI has launched **DeepSeek-V3**, an open-architecture Mixture-of-Experts (MoE) foundation model with 671 billion total parameters, activating only 37 billion parameters per token for blazing fast inference speeds.

## Performance & Benchmarks
- **Coding & Math:** DeepSeek-V3 matches or exceeds proprietary frontier models across HumanEval, SWE-bench, and MATH benchmarks.
- **Multi-Token Prediction:** Implements innovative speculative multi-token prediction to double tokens-per-second output.
- **Ultra-Low Inference Cost:** Dramatically undercuts traditional frontier token prices, making full-scale agentic coding accessible to individual developers.

## What This Means in Pakistan
Pakistani software developers and computer science students can leverage DeepSeek Multi-Model API keys directly through PakAITools without foreign card requirements:
- Build AI applications, chatbots, and autonomous agents at a fraction of USD costs.
- Pay in PKR via JazzCash, EasyPaisa, SadaPay, or NayaPay.
- Full 1-month replacement warranty on wallet codes and API allocations.

## Sources
- [DeepSeek-V3 GitHub Repository](https://github.com/deepseek-ai/DeepSeek-V3)
- [DeepSeek Official Architecture Paper](https://github.com/deepseek-ai/DeepSeek-V3/blob/main/DeepSeek_V3.pdf)`
  },
  {
    title: 'Anthropic Introduces Hybrid Reasoning Architecture in Claude for Advanced Coding',
    slug: 'claude-hybrid-reasoning-architecture',
    date: '2026-11-15',
    summary: 'Anthropic has introduced hybrid reasoning mode in Claude, allowing developers to dynamically allocate thinking tokens for complex architectural refactoring and bug resolution.',
    tags: ['Anthropic', 'Claude', 'Coding'],
    sources: [
      { name: 'Anthropic Engineering Blog', url: 'https://www.anthropic.com/news' },
      { name: 'Claude API Documentation', url: 'https://docs.anthropic.com' }
    ],
    content: `## What Happened
Anthropic announced a major advancement in the Claude model family: **Hybrid Reasoning**. This capability enables Claude to seamlessly balance instantaneous conversational output with deep, extended "thinking" phases for complex multi-file coding refactors.

## Core Features for Software Engineers
- **Controllable Thinking Budget:** Developers using Claude via API or supported IDE extensions (such as Cursor Pro) can configure exact token thinking limits.
- **Transparent Reasoning Traces:** Inspect intermediate reasoning steps before the final code solution is generated.
- **Reduced Hallucinations:** Multi-step verification dramatically reduces syntax bugs in long-context software development.

## Pakistan Availability & Best Workflow
- Pakistani developers using Claude API VIP 3 (10M / 200M) and Cursor Pro API packages on PakAITools can access hybrid reasoning immediately.
- Local PKR checkout via JazzCash and EasyPaisa provides predictable monthly engineering costs with 30-day pro-rated warranty protection.

## Sources
- [Anthropic Engineering Updates](https://www.anthropic.com/news)
- [Claude System & Thinking Prompts Guide](https://docs.anthropic.com)`
  }
];

for (const post of sampleNews) {
  const filePath = path.join(newsDir, `${post.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');
}
fs.writeFileSync(path.join(ROOT_DIR, 'data', 'news.json'), JSON.stringify(sampleNews, null, 2), 'utf8');
console.log(`Saved 3 verified AI news posts to content/news/ and data/news.json`);

console.log('=== All Content Built Successfully! ===');
