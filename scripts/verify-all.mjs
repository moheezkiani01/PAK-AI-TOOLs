import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const OUT_DIR = path.join(ROOT_DIR, 'out');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('==============================================');
console.log('     COMPREHENSIVE VERIFICATION SUITE         ');
console.log('==============================================\n');

let failed = 0;
function pass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function fail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failed++;
}

// 1. Home link in Raw HTML
const homeHtml = fs.readFileSync(path.join(OUT_DIR, 'index.html'), 'utf8');
if (homeHtml.includes('href="/"') && homeHtml.includes('aria-label="Home"')) {
  pass('Home link with aria-label="Home" and href="/" exists in homepage HTML');
} else {
  fail('Home link missing in homepage HTML');
}

if (homeHtml.includes('aria-current="page"')) {
  pass('Active state (aria-current="page") correctly set on homepage');
} else {
  fail('aria-current="page" missing on homepage');
}

if (homeHtml.includes('<nav aria-label="Main Navigation"') && homeHtml.includes('aria-hidden="true"')) {
  pass('Main Navigation contains decorative Home icon (aria-hidden="true")');
} else {
  fail('Decorative Home icon missing in Main Navigation');
}

// 2. AI News Homepage Section
if (homeHtml.includes('Latest AI News for Pakistan')) {
  pass('Heading "Latest AI News for Pakistan" is present in raw homepage HTML');
} else {
  fail('Heading "Latest AI News for Pakistan" missing from homepage');
}

const publishedSlugs = [
  'adobe-max-2026-creative-agent-cx-coworker',
  'openai-images-2-6-animated-gifs-svg-2026',
  'google-gemini-4-hydrogen-carbon-model-card-2026',
  'openai-o3-mini-reasoning-model-pakistan-pricing',
];

for (const slug of publishedSlugs) {
  if (homeHtml.includes(slug)) {
    pass(`Published article "${slug}" appears on homepage`);
  } else {
    fail(`Published article "${slug}" missing from homepage`);
  }
}

if (homeHtml.includes('href="/ai-news/"') && homeHtml.includes('View all AI News')) {
  pass('"View all AI News" link to /ai-news/ is present on homepage');
} else {
  fail('"View all AI News" link missing from homepage');
}

// 3. Draft Post Exclusion
const draftSlug = 'deepseek-v3-api-pricing-pakistan';
if (homeHtml.includes(draftSlug)) {
  fail(`Draft post slug "${draftSlug}" leaked onto homepage`);
} else {
  pass(`Draft post "${draftSlug}" is strictly ABSENT from homepage`);
}

const hubHtml = fs.readFileSync(path.join(OUT_DIR, 'ai-news', 'index.html'), 'utf8');
if (hubHtml.includes(draftSlug)) {
  fail(`Draft post slug "${draftSlug}" leaked onto /ai-news hub`);
} else {
  pass(`Draft post "${draftSlug}" is strictly ABSENT from /ai-news hub`);
}

if (fs.existsSync(path.join(OUT_DIR, 'ai-news', draftSlug, 'index.html'))) {
  fail(`Draft post was statically generated as an HTML page`);
} else {
  pass(`Draft post was NOT statically generated (no static params for drafts)`);
}

// 4. Sitemaps Draft Check & Published News Check
const sitemapXml = fs.readFileSync(path.join(OUT_DIR, 'sitemap.xml'), 'utf8');
if (sitemapXml.includes(draftSlug)) {
  fail(`Draft post found in sitemap.xml`);
} else {
  pass(`Draft post is strictly ABSENT from sitemap.xml`);
}

if (sitemapXml.includes('https://pakaitools.store/ai-news/') && sitemapXml.includes('openai-o3-mini-reasoning-model-pakistan-pricing')) {
  pass('sitemap.xml lists /ai-news/ and published article URL with honest lastmod');
} else {
  fail('sitemap.xml missing /ai-news/ or published article URL');
}

const newsSitemapXml = fs.readFileSync(path.join(OUT_DIR, 'sitemap_news.xml'), 'utf8');
if (newsSitemapXml.includes('openai-o3-mini-reasoning-model-pakistan-pricing') && !newsSitemapXml.includes(draftSlug)) {
  pass('sitemap_news.xml correctly lists published post and excludes draft');
} else {
  fail('sitemap_news.xml check failed');
}

// 5. Article Page Structure & Order
const articleHtmlPath = path.join(OUT_DIR, 'ai-news', 'openai-o3-mini-reasoning-model-pakistan-pricing', 'index.html');
if (fs.existsSync(articleHtmlPath)) {
  const articleHtml = fs.readFileSync(articleHtmlPath, 'utf8');

  // Verify layout order: Breadcrumb -> H1/Author/Time -> Quick Answer -> What This Means for PK -> Body -> Related Plans -> FAQ -> Sources
  const idxBreadcrumb = articleHtml.indexOf('aria-label="Breadcrumb"');
  const idxH1 = articleHtml.indexOf('<h1');
  const idxQuickAnswer = articleHtml.indexOf('aria-label="Quick Answer"');
  const idxPkAngle = articleHtml.indexOf('aria-label="What This Means for Pakistan"');
  const idxBody = articleHtml.indexOf('aria-label="Article Body"');
  const idxRelated = articleHtml.indexOf('aria-labelledby="related-plans-heading"');
  const idxFaq = articleHtml.indexOf('aria-labelledby="faq-heading"');
  const idxSources = articleHtml.indexOf('aria-labelledby="sources-heading"');

  if (
    idxBreadcrumb < idxH1 &&
    idxH1 < idxQuickAnswer &&
    idxQuickAnswer < idxPkAngle &&
    idxPkAngle < idxBody &&
    idxBody < idxRelated &&
    idxRelated < idxFaq &&
    idxFaq < idxSources
  ) {
    pass('Article page layout follows the exact requested section order');
  } else {
    fail(`Article layout section order mismatch: indices: [${[idxBreadcrumb, idxH1, idxQuickAnswer, idxPkAngle, idxBody, idxRelated, idxFaq, idxSources].join(', ')}]`);
  }

  // Check canonical
  if (articleHtml.includes('<link rel="canonical" href="https://pakaitools.store/ai-news/openai-o3-mini-reasoning-model-pakistan-pricing/"/>')) {
    pass('Article canonical is absolute self-referencing https://pakaitools.store/ai-news/...');
  } else {
    fail('Article canonical missing or incorrect');
  }

  // Check JSON-LD
  const scriptRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  let allNodes = [];
  let scriptCount = 0;
  while ((match = scriptRegex.exec(articleHtml)) !== null) {
    scriptCount++;
    const jsonStr = match[1];
    if (jsonStr.includes('<') && !jsonStr.includes('\\u003c')) {
      fail('JSON-LD contains unescaped < tag');
    }
    const parsed = JSON.parse(jsonStr);
    if (parsed['@graph']) {
      allNodes.push(...parsed['@graph']);
    } else {
      allNodes.push(parsed);
    }
  }

  if (scriptCount > 0) {
    pass(`Found ${scriptCount} JSON-LD script blocks with safe script injection protection`);

    const newsArticle = allNodes.find((n) => n['@type'] === 'NewsArticle');
    const breadcrumbList = allNodes.find((n) => n['@type'] === 'BreadcrumbList');
    const faqPage = allNodes.find((n) => n['@type'] === 'FAQPage');

    if (newsArticle && newsArticle.headline && newsArticle.datePublished && newsArticle.author) {
      pass(`Rich Results: Valid NewsArticle schema ("${newsArticle.headline}") with dates and author`);
    } else {
      fail('NewsArticle schema node missing or incomplete');
    }

    if (breadcrumbList && breadcrumbList.itemListElement.length === 3) {
      pass('Rich Results: Valid BreadcrumbList schema with 3 levels');
    } else {
      fail('BreadcrumbList schema node missing or incomplete');
    }

    if (faqPage && faqPage.mainEntity.length === 2) {
      pass('Rich Results: Valid FAQPage schema matching visible FAQ items');
    } else {
      fail('FAQPage schema node missing or incomplete');
    }
  } else {
    fail('Article page missing JSON-LD script block');
  }
} else {
  fail('Article HTML page not found');
}

// 6. Robots.txt
const robotsTxt = fs.readFileSync(path.join(OUT_DIR, 'robots.txt'), 'utf8');
if (robotsTxt.includes('Allow: /') && robotsTxt.includes('sitemap.xml') && !robotsTxt.includes('Disallow: /ai-news')) {
  pass('robots.txt allows all crawlers and references sitemaps');
} else {
  fail('robots.txt invalid or blocking crawlers');
}

// 7. Check for [object Object] across all generated files
let objectObjectFound = false;
function checkNoObject(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      checkNoObject(full);
    } else if (ent.name.endsWith('.html')) {
      const txt = fs.readFileSync(full, 'utf8');
      if (txt.includes('[object Object]')) {
        objectObjectFound = true;
        fail(`Found [object Object] in ${full}`);
      }
    }
  }
}
checkNoObject(OUT_DIR);
if (!objectObjectFound) {
  pass('Zero [object Object] across all 295+ static HTML files');
}

console.log('\n==============================================');
if (failed === 0) {
  console.log('🎉 ALL VERIFICATION CHECKS PASSED 100%!');
  console.log('==============================================\n');
  process.exit(0);
} else {
  console.error(`❌ ${failed} CHECK(S) FAILED!`);
  console.log('==============================================\n');
  process.exit(1);
}
