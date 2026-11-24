import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

console.log('=== PAKAITOOLS COMPREHENSIVE VERIFICATION ===\n');

let failures = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ [FAIL] ${message}`);
    failures++;
  } else {
    console.log(`✅ [OK] ${message}`);
  }
}

// 1. Check out directory assets
console.log('--- 1. Checking ./out core files ---');
const requiredOutFiles = [
  'robots.txt',
  'sitemap.xml',
  'sitemap_products.xml',
  'sitemap_hubs.xml',
  'sitemap_compare.xml',
  'sitemap_blog.xml',
  'favicon.ico',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
];
for (const f of requiredOutFiles) {
  assert(fs.existsSync(path.join('out', f)), `./out/${f} exists`);
}

// 2. Check robots.txt content
console.log('\n--- 2. Checking robots.txt ---');
const robots = fs.readFileSync('out/robots.txt', 'utf8');
assert(robots.includes('Allow: /'), 'robots.txt allows all');
assert(robots.includes('Sitemap: https://pakaitools.store/sitemap.xml'), 'robots.txt includes sitemap URL');

// 3. Inspect HTML of Homepage, Category, and Product page
console.log('\n--- 3. Checking HTML of Homepage, Category, and Product ---');
const samplePages = [
  { file: 'out/index.html', url: 'https://pakaitools.store/', type: 'home' },
  { file: 'out/design-creative/index.html', url: 'https://pakaitools.store/design-creative/', type: 'category' },
  { file: 'out/product/canva-pro-1-month/index.html', url: 'https://pakaitools.store/product/canva-pro-1-month/', type: 'product' },
];

for (const sp of samplePages) {
  assert(fs.existsSync(sp.file), `Sample page ${sp.file} exists`);
  const html = fs.readFileSync(sp.file, 'utf8');
  
  // Canonical
  const canMatch = (html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i) || [])[1];
  assert(canMatch === sp.url, `${sp.file} canonical matches exact URL (${canMatch})`);

  // OG tags
  const ogUrl = (html.match(/<meta[^>]*property="og:url"[^>]*content="([^"]*)"/i) || [])[1];
  assert(ogUrl === sp.url, `${sp.file} og:url matches exact canonical (${ogUrl})`);

  const ogSiteName = (html.match(/<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"/i) || [])[1];
  assert(ogSiteName === 'PakAITools', `${sp.file} og:site_name is PakAITools`);

  const ogLocale = (html.match(/<meta[^>]*property="og:locale"[^>]*content="([^"]*)"/i) || [])[1];
  assert(ogLocale === 'en_PK', `${sp.file} og:locale is en_PK`);

  const ogImage = (html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) || [])[1];
  assert(ogImage && ogImage.startsWith('https://pakaitools.store/'), `${sp.file} og:image is absolute pakaitools.store (${ogImage})`);

  // JSON-LD blocks
  const jsonLdMatches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  assert(jsonLdMatches.length > 0, `${sp.file} contains ${jsonLdMatches.length} JSON-LD block(s)`);
  for (let idx = 0; idx < jsonLdMatches.length; idx++) {
    try {
      const parsed = JSON.parse(jsonLdMatches[idx]);
      assert(!!parsed, `${sp.file} JSON-LD block #${idx + 1} parses as valid JSON`);
      const str = JSON.stringify(parsed);
      assert(!str.includes('TODO') && !str.includes('PLACEHOLDER') && !str.includes('example.com'), `${sp.file} JSON-LD block #${idx + 1} has no placeholders`);
      assert(!str.includes('aitoolspak') && !str.includes('workers.dev'), `${sp.file} JSON-LD block #${idx + 1} has no old domains`);
    } catch (e) {
      assert(false, `${sp.file} JSON-LD block #${idx + 1} failed JSON parse: ${e.message}`);
    }
  }

  // Answer-first and Last updated check for category & product
  if (sp.type === 'product' || sp.type === 'category') {
    assert(html.includes('Last updated:'), `${sp.file} displays visible "Last updated" date`);
  }
}

// 4. Validate all 179 products have lastmod 2026-11-22 in sitemap
console.log('\n--- 4. Checking Product Sitemaps lastmod ---');
const smProd = fs.readFileSync('out/sitemap_products.xml', 'utf8');
const prodUrls = [...smProd.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
assert(prodUrls.length === 179, `sitemap_products.xml has 179 products (found ${prodUrls.length})`);
const non2026 = prodUrls.filter(u => !(u.match(/<lastmod>(.*?)<\/lastmod>/) || [])[1]?.startsWith('2026-11-22'));
assert(non2026.length === 0, `All 179 products have lastmod == 2026-11-22 (mismatches: ${non2026.length})`);

// 5. Grep codebase for workers.dev or aitoolspak
console.log('\n--- 5. Checking for any remaining old domains in repository ---');
let oldDomainMatches = [];
function searchDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', 'out'].includes(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) searchDir(p);
    else {
      if (p.endsWith('verify-all.mjs')) continue;
      const content = fs.readFileSync(p, 'utf8');
      if (content.includes('workers.dev') || content.includes('aitoolspak')) {
        oldDomainMatches.push(p);
      }
    }
  }
}
searchDir('.');
assert(oldDomainMatches.length === 0, `Zero occurrences of workers.dev or aitoolspak in repository (found in: ${oldDomainMatches.join(', ') || 'none'})`);

console.log(`\n==============================================`);
if (failures === 0) {
  console.log('🎉 ALL VERIFICATIONS PASSED SUCCESSFULLY! (0 Failures)');
} else {
  console.error(`❌ COMPLETED WITH ${failures} FAILURE(S)`);
  process.exit(1);
}
