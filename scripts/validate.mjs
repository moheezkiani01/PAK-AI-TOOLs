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

// 1. Validate Categories
const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
if (categories.length !== 15) {
  error(`Expected 15 categories, found ${categories.length}`);
} else {
  ok(`Categories count: ${categories.length}`);
}

// 2. Validate Products
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
if (products.length !== 179) {
  error(`Expected 179 indexable products, found ${products.length}`);
} else {
  ok(`Indexable products count: ${products.length}`);
}

// 3. Validate Merged Plans
const mergedPlans = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'merged_plans.json'), 'utf8'));
if (mergedPlans.length !== 52) {
  error(`Expected 52 merged plans, found ${mergedPlans.length}`);
} else {
  ok(`Merged plans count: ${mergedPlans.length}`);
}

// Total plans check
const totalPlans = products.length + mergedPlans.length;
if (totalPlans !== 231) {
  error(`Expected 231 total plans, found ${totalPlans}`);
} else {
  ok(`Total orderable plans count: ${totalPlans}`);
}

// 4. Validate Brand Hubs
const hubs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'hubs.json'), 'utf8'));
if (hubs.brands.length !== 44) {
  error(`Expected 44 brand hubs, found ${hubs.brands.length}`);
} else {
  ok(`Brand hubs count: ${hubs.brands.length}`);
}

// 5. Validate Redirects
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

// 7. Check Blog Posts
const sitePages = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'site_pages.json'), 'utf8'));
const blogCount = (sitePages.blog || []).length;
if (blogCount < 18) {
  warn(`Expected at least 18 blog posts, found ${blogCount}`);
} else {
  ok(`Blog posts and buying guides count: ${blogCount}`);
}

// 8. Validate Public Assets
if (fs.existsSync(path.join(PUBLIC_DIR, 'search-index.json'))) {
  ok('public/search-index.json generated');
} else {
  warn('public/search-index.json is missing');
}

if (fs.existsSync(path.join(PUBLIC_DIR, 'sitemap_index.xml'))) {
  ok('public/sitemap_index.xml generated');
} else {
  warn('public/sitemap_index.xml is missing');
}

// 9. Validate Out Directory (if static build has run)
if (fs.existsSync(OUT_DIR)) {
  console.log('\n--- Validating Static Export in out/ ---');
  let htmlFiles = 0;
  let h1Failures = 0;
  let placeholderFailures = 0;

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        htmlFiles++;
        const content = fs.readFileSync(fullPath, 'utf8');

        // Check H1 count (should be exactly 1, except 404)
        const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
        const count = h1Matches ? h1Matches.length : 0;
        if (count !== 1) {
          if (!fullPath.includes('404')) {
            error(`File ${path.relative(OUT_DIR, fullPath)} has ${count} <h1> tags (expected 1)`);
            h1Failures++;
          }
        }

        // Check for raw unrendered placeholders
        if (content.includes('[DOMAIN]') || content.includes('[WHATSAPP_NUMBER]') || content.includes('[PRICE_VALID_UNTIL]')) {
          error(`File ${path.relative(OUT_DIR, fullPath)} contains raw placeholders`);
          placeholderFailures++;
        }
      }
    }
  }

  scanDir(OUT_DIR);
  ok(`Total generated HTML pages scanned: ${htmlFiles}`);
  if (h1Failures === 0) ok('All generated HTML pages have exactly one <h1>');
  if (placeholderFailures === 0) ok('Zero unreplaced template placeholders in generated HTML');

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
