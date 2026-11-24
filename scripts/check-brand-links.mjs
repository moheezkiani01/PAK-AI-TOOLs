import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const OUT_DIR = path.join(ROOT_DIR, 'out');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('==============================================');
console.log('       BRAND GRID LINKS & CANONICAL AUDIT     ');
console.log('==============================================\n');

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

const homeHtmlPath = path.join(OUT_DIR, 'index.html');
if (!fs.existsSync(homeHtmlPath)) {
  error(`Homepage HTML not found at ${homeHtmlPath}. Run build first.`);
  process.exit(1);
}

const homeHtml = fs.readFileSync(homeHtmlPath, 'utf8');

// 1. Collect all sitemap URLs
const sitemapUrls = new Set();
const sitemapDir = fs.existsSync(path.join(OUT_DIR, 'sitemap.xml')) ? OUT_DIR : PUBLIC_DIR;
const sitemapFiles = fs
  .readdirSync(sitemapDir)
  .filter((f) => f.startsWith('sitemap') && f.endsWith('.xml'));

for (const smFile of sitemapFiles) {
  const content = fs.readFileSync(path.join(sitemapDir, smFile), 'utf8');
  const locMatches = content.matchAll(/<loc>([^<]+)<\/loc>/g);
  for (const m of locMatches) {
    sitemapUrls.add(m[1].trim());
  }
}
ok(`Loaded ${sitemapUrls.size} unique canonical URLs across ${sitemapFiles.length} sitemaps`);

// 2. Extract brand cards and category sections from homepage HTML
// Matches sections with id="cat-*"
const sectionRegex = /<section aria-labelledby="cat-([^"]+)"[^>]*>([\s\S]*?)<\/section>/g;
const sections = [...homeHtml.matchAll(sectionRegex)];

if (sections.length === 0) {
  error('No category brand sections (<section aria-labelledby="cat-*">) found in out/index.html');
} else {
  ok(`Found ${sections.length} category brand sections in homepage HTML`);
}

let checkedCards = 0;
let checkedViewAlls = 0;

for (const section of sections) {
  const catSlug = section[1];
  const sectionContent = section[2];

  // Extract all links within this section
  const linkMatches = [...sectionContent.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];

  for (const linkMatch of linkMatches) {
    const href = linkMatch[1];
    const linkInner = linkMatch[2];

    // Check for query parameters or anchors
    if (href.includes('?') || href.includes('#')) {
      error(`Category section [${catSlug}] has invalid link with query or hash: ${href}`);
      continue;
    }

    // Must follow trailing slash convention
    if (!href.endsWith('/')) {
      error(`Link ${href} is missing trailing slash`);
    }

    // Identify if it's a "View all" link or a BrandCard link
    const isViewAll = href === `/${catSlug}/` || linkInner.includes('View all');
    if (isViewAll) {
      checkedViewAlls++;
    } else {
      checkedCards++;
    }

    // Verify target file exists in out/
    const relPath = href.replace(/^\//, '').replace(/\/$/, '');
    const targetFile = path.join(OUT_DIR, relPath, 'index.html');
    if (!fs.existsSync(targetFile)) {
      error(`Broken link on homepage: ${href} -> File does not exist: ${targetFile}`);
      continue;
    }

    // Verify target exists in sitemaps
    const canonicalUrl = `https://pakaitools.store${href}`;
    if (!sitemapUrls.has(canonicalUrl)) {
      error(`Link target ${canonicalUrl} not found in any sitemap!`);
    }

    // Read target HTML to inspect canonical & robots
    const targetHtml = fs.readFileSync(targetFile, 'utf8');

    // Canonical tag check
    const canMatch = targetHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
    if (!canMatch) {
      error(`Target page ${href} is missing a canonical link tag`);
    } else if (canMatch[1] !== canonicalUrl) {
      error(
        `Canonical mismatch on ${href}: expected ${canonicalUrl}, found ${canMatch[1]}`
      );
    }

    // Robots noindex check
    const robotsMatch = targetHtml.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i);
    if (robotsMatch && robotsMatch[1].includes('noindex')) {
      error(`Target page ${href} has noindex in static HTML!`);
    }

    // Check that brand cards have no nested links
    if (!isViewAll) {
      if (linkInner.includes('<a ') || linkInner.includes('</a>')) {
        error(`Brand card linking to ${href} contains nested <a> tag!`);
      }
    }
  }
}

ok(`Verified ${checkedCards} brand cards across all categories`);
ok(`Verified ${checkedViewAlls} "View all" category links`);

// 3. Verify ItemList JSON-LD on homepage
const jsonLdScripts = [...homeHtml.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
let foundItemList = false;
let foundFaqPage = false;

for (const script of jsonLdScripts) {
  try {
    const parsed = JSON.parse(script[1]);
    const graph = parsed['@graph'] || [parsed];
    for (const node of graph) {
      if (node['@type'] === 'ItemList') {
        foundItemList = true;
        if (!Array.isArray(node.itemListElement) || node.itemListElement.length === 0) {
          error(`ItemList node ${node.name} has empty itemListElement`);
        }
      }
      if (node['@type'] === 'FAQPage') {
        foundFaqPage = true;
      }
    }
  } catch (e) {
    error(`Failed to parse JSON-LD script: ${e.message}`);
  }
}

if (!foundItemList) {
  error('No ItemList structured data found on homepage');
} else {
  ok('ItemList structured data verified on homepage');
}

if (!foundFaqPage) {
  warn('No FAQPage structured data found on homepage');
} else {
  ok('FAQPage structured data verified on homepage');
}

console.log('\n==============================================');
if (errors === 0) {
  console.log(`🎉 ALL BRAND GRID LINK CHECKS PASSED! (0 Errors, ${warnings} Warnings)`);
  console.log('==============================================\n');
  process.exit(0);
} else {
  console.error(`❌ BRAND LINK CHECKS FAILED with ${errors} error(s) and ${warnings} warning(s).`);
  console.log('==============================================\n');
  process.exit(1);
}
