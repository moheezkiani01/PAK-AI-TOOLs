import fs from 'node:fs';
import path from 'node:path';

console.log('=== VERIFYING SITEMAPS, DATES, TITLES & ASSETS ===\n');

// 1. Sitemaps check
const sm = fs.readFileSync('out/sitemap.xml', 'utf8');
const smProducts = fs.readFileSync('out/sitemap_products.xml', 'utf8');
const smHubs = fs.readFileSync('out/sitemap_hubs.xml', 'utf8');
const smCompare = fs.readFileSync('out/sitemap_compare.xml', 'utf8');
const smBlog = fs.readFileSync('out/sitemap_blog.xml', 'utf8');

// Check products lastmod
const prodUrls = [...smProducts.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
console.log(`Total products in sitemap_products.xml: ${prodUrls.length}`);
let prod2026Count = 0;
let prodMismatch = 0;
for (const p of prodUrls) {
  const loc = (p.match(/<loc>(.*?)<\/loc>/) || [])[1];
  const lastmod = (p.match(/<lastmod>(.*?)<\/lastmod>/) || [])[1];
  if (lastmod === '2026-11-22') {
    prod2026Count++;
  } else {
    prodMismatch++;
    console.error(`Product lastmod mismatch for ${loc}: ${lastmod}`);
  }
}
console.log(`Products with lastmod == 2026-11-22: ${prod2026Count}/${prodUrls.length} (Mismatches: ${prodMismatch})`);

// Check static pages in sitemap.xml and sitemap_hubs.xml
const staticPages = [
  '/about/',
  '/contact/',
  '/terms/',
  '/privacy-policy/',
  '/payment-methods/',
  '/refund-warranty-policy/',
];
const requiredPages = [
  '/price-list/',
  '/compare/',
  '/blog/',
  '/categories/',
];

console.log('\n--- Checking Static and Hub Pages in sitemap.xml ---');
const smUrls = [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
for (const sp of staticPages) {
  const block = smUrls.find(b => b.includes(`<loc>https://pakaitools.store${sp}</loc>`));
  const hasLastmod = block ? block.includes('<lastmod>') : false;
  console.log(`Static page ${sp}: present = ${!!block}, has <lastmod> = ${hasLastmod} (should be false)`);
}

for (const rp of requiredPages) {
  const block = smUrls.find(b => b.includes(`<loc>https://pakaitools.store${rp}</loc>`));
  console.log(`Page ${rp}: present = ${!!block}`);
}

console.log('\n--- Checking sitemap_hubs.xml count ---');
const hubUrls = [...smHubs.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
const hubLastmodCount = hubUrls.filter(b => b.includes('<lastmod>')).length;
console.log(`Total URLs in sitemap_hubs.xml: ${hubUrls.length} (Expected: 68)`);
console.log(`Total <lastmod> tags in sitemap_hubs.xml: ${hubLastmodCount} (Expected: 62)`);

// 2. Blog posts check: exact date shown on the page
console.log('\n--- Checking Blog Posts <lastmod> vs HTML displayed date ---');
const blogUrls = [...smBlog.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
let blogMatch = 0;
let blogTotal = 0;
for (const b of blogUrls) {
  const loc = (b.match(/<loc>(.*?)<\/loc>/) || [])[1];
  const lastmod = (b.match(/<lastmod>(.*?)<\/lastmod>/) || [])[1];
  if (!loc || loc.endsWith('/blog/')) continue;
  blogTotal++;
  const slug = loc.replace('https://pakaitools.store/blog/', '').replace(/\/$/, '');
  const htmlPath = path.join('out', 'blog', slug, 'index.html');
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    // Check if the html contains the date
    const dateOnPage = html.includes(`Last Updated: <!-- -->${lastmod}`) || html.includes(`Last Updated: ${lastmod}`);
    if (dateOnPage) {
      blogMatch++;
    } else {
      console.warn(`Blog ${slug} date mismatch! sitemap has ${lastmod}`);
    }
  }
}
console.log(`Blog posts matching HTML date: ${blogMatch}/${blogTotal}`);

// 3. Check buy-subscriptions-in-pakistan-without-credit-card
console.log('\n--- Checking buy-subscriptions-in-pakistan-without-credit-card ---');
const blogHtmlPath = path.join('out', 'blog', 'buy-subscriptions-in-pakistan-without-credit-card', 'index.html');
if (fs.existsSync(blogHtmlPath)) {
  const html = fs.readFileSync(blogHtmlPath, 'utf8');
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]*)"/i);
  const twTitleMatch = html.match(/<meta name="twitter:title" content="([^"]*)"/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

  console.log('Title:         ', titleMatch ? titleMatch[1] : 'NONE');
  console.log('OG Title:      ', ogTitleMatch ? ogTitleMatch[1] : 'NONE');
  console.log('Twitter Title: ', twTitleMatch ? twTitleMatch[1] : 'NONE');
  console.log('H1:            ', h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'NONE');
}
