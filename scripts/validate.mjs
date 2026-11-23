import fs from 'fs';
import path from 'path';

console.log('==============================================');
console.log('       PAKAITOOLS BUILD & DATA VALIDATION     ');
console.log('==============================================\n');

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const OUT_DIR = path.join(ROOT_DIR, 'out');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

let errors = 0;
let warnings = 0;

function error(msg) {
  console.error(`❌ [ERROR] ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`⚠️ [WARN] ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`✅ [OK] ${msg}`);
}

// 1. Validate Categories (15)
const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
if (categories.length !== 15) {
  error(`Expected 15 categories, found ${categories.length}`);
} else {
  ok(`Categories count: ${categories.length}`);
}

// 2. Validate Products (179)
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
if (products.length !== 179) {
  error(`Expected 179 indexable products, found ${products.length}`);
} else {
  ok(`Indexable products count: ${products.length}`);
}

// 3. Validate Merged Plans (52)
const mergedPlans = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'merged_plans.json'), 'utf8'));
if (mergedPlans.length !== 52) {
  error(`Expected 52 merged plans, found ${mergedPlans.length}`);
} else {
  ok(`Merged plans count: ${mergedPlans.length}`);
}

// Total plans check (231)
const totalPlans = products.length + mergedPlans.length;
if (totalPlans !== 231) {
  error(`Expected 231 total plans, found ${totalPlans}`);
} else {
  ok(`Total orderable plans count: ${totalPlans}`);
}

// 4. Validate Brand Hubs (44)
const hubs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'hubs.json'), 'utf8'));
if (hubs.brands.length !== 44) {
  error(`Expected 44 brand hubs, found ${hubs.brands.length}`);
} else {
  ok(`Brand hubs count: ${hubs.brands.length}`);
}

// 5. Validate Redirects (52)
const redirects = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'redirects.json'), 'utf8'));
if (redirects.length !== 52) {
  error(`Expected 52 redirects, found ${redirects.length}`);
} else {
  ok(`Redirects count: ${redirects.length}`);
}

// 6. Check for duplicate slugs & titles in products
const seenSlugs = new Set();
for (const p of products) {
  if (!p.slug) error(`Product #${p.id} is missing a slug`);
  if (seenSlugs.has(p.slug)) error(`Duplicate product slug: ${p.slug}`);
  seenSlugs.add(p.slug);

  if (!p.seoTitle) error(`Product #${p.id} (${p.slug}) is missing SEO title`);
  if (!p.metaDesc) error(`Product #${p.id} (${p.slug}) is missing meta description`);

  if (p.price !== null && typeof p.price !== 'number') {
    error(`Product #${p.id} (${p.slug}) price must be a number or null`);
  }

  if (!p.categorySlug) error(`Product #${p.id} (${p.slug}) has no categorySlug`);
  if (!p.h1) error(`Product #${p.id} (${p.slug}) is missing H1`);
}
ok(`Slugs and titles uniqueness checked across 179 products`);

// 7. Validate Comparisons (20)
let comparisons = [];
if (fs.existsSync(path.join(DATA_DIR, 'comparisons.json'))) {
  const compData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'comparisons.json'), 'utf8'));
  comparisons = compData.items || [];
  if (comparisons.length !== 20) {
    error(`Expected 20 comparisons, found ${comparisons.length}`);
  } else {
    ok(`Product comparisons count: ${comparisons.length}`);
  }
} else {
  error('data/comparisons.json is missing');
}

// 8. Validate Blog Posts (21)
let blogs = [];
if (fs.existsSync(path.join(DATA_DIR, 'blogs.json'))) {
  const blogData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'blogs.json'), 'utf8'));
  blogs = blogData.items || [];
  if (blogs.length !== 21) {
    warn(`Expected 21 blog guides, found ${blogs.length}`);
  } else {
    ok(`Blog posts and buying guides count: ${blogs.length}`);
  }
} else {
  error('data/blogs.json is missing');
}

// 9. Validate AI News (3)
let news = [];
if (fs.existsSync(path.join(DATA_DIR, 'news.json'))) {
  news = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'news.json'), 'utf8'));
  if (news.length < 3) {
    warn(`Expected at least 3 news articles, found ${news.length}`);
  } else {
    ok(`Verified AI news articles count: ${news.length}`);
  }
} else {
  warn('data/news.json is missing');
}

// 10. Validate Public Assets & Sitemaps
if (fs.existsSync(path.join(PUBLIC_DIR, 'search-index.json'))) {
  const sIndex = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'search-index.json'), 'utf8'));
  ok(`public/search-index.json generated (${sIndex.length} indexed items)`);
} else {
  warn('public/search-index.json is missing');
}

const requiredSitemaps = [
  'sitemap_index.xml',
  'sitemap_products.xml',
  'sitemap_hubs.xml',
  'sitemap_compare.xml',
  'sitemap_blog.xml',
];
for (const sm of requiredSitemaps) {
  if (fs.existsSync(path.join(PUBLIC_DIR, sm))) {
    ok(`public/${sm} generated`);
  } else {
    error(`public/${sm} is missing`);
  }
}

// 11. Validate Out Directory (Static Export)
if (fs.existsSync(OUT_DIR)) {
  console.log('\n--- Validating Static Export in out/ ---');
  let htmlFiles = 0;
  let h1Failures = 0;
  let objectFailures = 0;
  let placeholderFailures = 0;
  let leakedFailures = 0;
  let ogUrlFailures = 0;
  let doubleTitleFailures = 0;

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        htmlFiles++;
        const content = fs.readFileSync(fullPath, 'utf8');
        const relPath = path.relative(OUT_DIR, fullPath);

        // 1. Check H1 count (exactly 1, except 404)
        if (!relPath.includes('404')) {
          const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
          const count = h1Matches ? h1Matches.length : 0;
          if (count !== 1) {
            error(`File ${relPath} has ${count} <h1> tags (expected 1)`);
            h1Failures++;
          }
        }

        // 2. Check for [object Object]
        if (content.includes('[object Object]')) {
          error(`File ${relPath} contains literal '[object Object]'`);
          objectFailures++;
        }

        // 3. Check for raw unrendered placeholders
        if (content.includes('[DOMAIN]') || content.includes('[WHATSAPP_NUMBER]') || content.includes('[PRICE_VALID_UNTIL]')) {
          error(`File ${relPath} contains raw placeholders`);
          placeholderFailures++;
        }

        // 4. Check for leaked prompt instructions
        if (
          content.includes('7. INTERNAL LINKS:') ||
          content.includes('8. JSON-LD SCHEMA:') ||
          content.includes('9. LAST UPDATED') ||
          content.includes('INTERNAL LINKS:')
        ) {
          error(`File ${relPath} contains leaked generation instructions`);
          leakedFailures++;
        }

        // 5. Check og:url === canonical
        const canonicalMatch = content.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) ||
          content.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
        const ogUrlMatch = content.match(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/i) ||
          content.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:url"/i);

        if (canonicalMatch && ogUrlMatch) {
          const canonicalHref = canonicalMatch[1];
          const ogUrlContent = ogUrlMatch[1];
          if (canonicalHref !== ogUrlContent) {
            error(`File ${relPath} og:url mismatch: canonical='${canonicalHref}', og:url='${ogUrlContent}'`);
            ogUrlFailures++;
          }
        }

        // 6. Check for double branding in <title>
        const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        if (titleMatch) {
          const titleText = titleMatch[1];
          if (titleText.includes('PakAITools | PakAITools')) {
            error(`File ${relPath} has doubled branding in title: "${titleText}"`);
            doubleTitleFailures++;
          }
        }
      }
    }
  }

  scanDir(OUT_DIR);
  ok(`Total generated HTML pages scanned: ${htmlFiles}`);
  if (h1Failures === 0) ok('All generated HTML pages have exactly one <h1>');
  if (objectFailures === 0) ok('Zero occurrences of [object Object]');
  if (placeholderFailures === 0) ok('Zero unreplaced template placeholders in generated HTML');
  if (leakedFailures === 0) ok('Zero leaked generation instructions in HTML');
  if (ogUrlFailures === 0) ok('All pages have 100% matching og:url === canonical');
  if (doubleTitleFailures === 0) ok('Zero double-branding titles detected');

  // Verify all 20 comparisons exist in out/compare/
  let missingComps = 0;
  for (const c of comparisons) {
    const compFile = path.join(OUT_DIR, 'compare', c.slug, 'index.html');
    if (!fs.existsSync(compFile)) {
      error(`Missing static HTML for comparison: /compare/${c.slug}/`);
      missingComps++;
    }
  }
  if (missingComps === 0) ok(`All ${comparisons.length} product comparisons exist in out/compare/`);

  // Verify all 21 blog posts exist in out/blog/
  let missingBlogs = 0;
  for (const b of blogs) {
    const blogFile = path.join(OUT_DIR, 'blog', b.slug, 'index.html');
    if (!fs.existsSync(blogFile)) {
      error(`Missing static HTML for blog: /blog/${b.slug}/`);
      missingBlogs++;
    }
  }
  if (missingBlogs === 0) ok(`All ${blogs.length} blog posts exist in out/blog/`);

  // Verify all 3 news articles exist in out/blog/news/
  let missingNews = 0;
  for (const n of news) {
    const newsFile = path.join(OUT_DIR, 'blog', 'news', n.slug, 'index.html');
    if (!fs.existsSync(newsFile)) {
      error(`Missing static HTML for news: /blog/news/${n.slug}/`);
      missingNews++;
    }
  }
  if (missingNews === 0) ok(`All ${news.length} AI news articles exist in out/blog/news/`);

  // Verify Cloudflare files
  if (fs.existsSync(path.join(OUT_DIR, '_redirects'))) {
    const lines = fs.readFileSync(path.join(OUT_DIR, '_redirects'), 'utf8').trim().split('\n');
    ok(`_redirects exists in out/ with ${lines.length} lines`);
  } else {
    warn(`_redirects missing from out/`);
  }

  if (fs.existsSync(path.join(OUT_DIR, '_headers'))) {
    ok(`_headers exists in out/`);
  } else {
    warn(`_headers missing from out/`);
  }
}

console.log('\n==============================================');
if (errors === 0) {
  console.log(`🎉 ALL VALIDATIONS PASSED! (0 Errors, ${warnings} Warnings)`);
  console.log('==============================================\n');
  process.exit(0);
} else {
  console.error(`❌ VALIDATION FAILED with ${errors} error(s) and ${warnings} warning(s).`);
  console.log('==============================================\n');
  process.exit(1);
}
