import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

// 1. Sitemaps check
for (const sitemapName of ['sitemap.xml', 'sitemap_products.xml', 'sitemap_hubs.xml', 'sitemap_compare.xml', 'sitemap_blog.xml']) {
  const file = path.join('out', sitemapName);
  if (!fs.existsSync(file)) {
    console.error(`Missing ${file}`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  const dates = [...content.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map(m => m[1]);
  const uniqueDates = [...new Set(dates)].sort();
  console.log(`${sitemapName}: total <lastmod> entries = ${dates.length}, unique dates = ${uniqueDates.length}:`, uniqueDates);
}

const sm = fs.readFileSync('out/sitemap.xml', 'utf8');
const staticPages = ['/about/', '/contact/', '/terms/', '/privacy-policy/', '/payment-methods/', '/refund-warranty-policy/'];
const urlBlocks = [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
for (const sp of staticPages) {
  const block = urlBlocks.find(b => b.includes(`<loc>https://pakaitools.store${sp}</loc>`));
  const hasLastmod = block ? block.includes('<lastmod>') : false;
  console.log(`Static page ${sp} has lastmod: ${hasLastmod}`);
}

// 2. Product images check
let prodCount = 0;
let ogMatch = 0;
let twMatch = 0;
let schemaMatch = 0;
const prodsDir = path.join('out', 'product');
for (const dir of fs.readdirSync(prodsDir)) {
  const p = path.join(prodsDir, dir, 'index.html');
  if (fs.existsSync(p)) {
    prodCount++;
    const html = fs.readFileSync(p, 'utf8');
    const expected = `https://pakaitools.store/og/${dir}.png`;
    if (html.includes(`<meta property="og:image" content="${expected}"`)) ogMatch++;
    if (html.includes(`<meta name="twitter:image" content="${expected}"`)) twMatch++;
    if (html.includes(expected)) schemaMatch++;
  }
}
console.log(`Product pages: ${prodCount}`);
console.log(`og:image matches: ${ogMatch}/${prodCount}`);
console.log(`twitter:image matches: ${twMatch}/${prodCount}`);
console.log(`schema image matches: ${schemaMatch}/${prodCount}`);

// 3. Changed titles across products between a1fc0af and current
const oldProds = JSON.parse(execSync('git show a1fc0af:data/products.json', { maxBuffer: 20 * 1024 * 1024 }).toString());
const newProds = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

const diffs = [];
for (let i = 0; i < oldProds.length; i++) {
  const o = oldProds[i];
  const n = newProds.find(p => p.slug === o.slug);
  if (n && o.seoTitle !== n.seoTitle) {
    diffs.push({
      slug: o.slug,
      before: o.seoTitle,
      after: n.seoTitle,
    });
  }
}
console.log(`Total changed product titles: ${diffs.length}`);
diffs.forEach((d, idx) => {
  console.log(`${idx + 1}. [${d.slug}]`);
  console.log(`   Before (${d.before.length} chars): "${d.before}"`);
  console.log(`   After  (${d.after.length} chars):  "${d.after}"`);
});
