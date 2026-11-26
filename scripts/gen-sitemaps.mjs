import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
const hubs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'hubs.json'), 'utf8'));
const faqPack = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faq', 'pakaitools-faq-pack-v2.json'), 'utf8'));

// Build set of product slugs covered by the FAQ pack
const faqProductSlugs = new Set();
for (const p of faqPack.products) {
  const slug = p.url.replace(/^https?:\/\/[^/]+\/product\//, '').replace(/^\/product\//, '').replace(/\/$/, '');
  faqProductSlugs.add(slug);
}

let comparisons = [];
let compData = null;
if (fs.existsSync(path.join(DATA_DIR, 'comparisons.json'))) {
  compData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'comparisons.json'), 'utf8'));
  comparisons = compData.items || [];
}

let blogs = [];
let blogData = null;
if (fs.existsSync(path.join(DATA_DIR, 'blogs.json'))) {
  blogData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'blogs.json'), 'utf8'));
  blogs = blogData.items || [];
}

let aiNews = [];
if (fs.existsSync(path.join(DATA_DIR, 'ai-news.json'))) {
  const rawNews = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ai-news.json'), 'utf8'));
  aiNews = rawNews.filter((p) => !p.draft);
}

const DOMAIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pakaitools.store').replace(/\/+$/, '');
const DEFAULT_LASTMOD = '2026-11-26';

function urlXml(loc, lastmod) {
  const cleanLastmod = lastmod || DEFAULT_LASTMOD;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${cleanLastmod}</lastmod>
  </url>`;
}

// 1. Products Sitemap (189 products) - sourced from per-page p.updatedAt
const productUrls = products.map((p) => {
  const lastmod = p.updatedAt || DEFAULT_LASTMOD;
  return urlXml(`${DOMAIN}/product/${p.slug}/`, lastmod);
});

const productsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_products.xml'), productsXml);

// 2. Hubs Sitemap (Category Hubs + Brand Hubs + Static pages)
const sitePages = fs.existsSync(path.join(DATA_DIR, 'site_pages.json'))
  ? JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'site_pages.json'), 'utf8'))
  : {};
const staticPagesDateMap = sitePages.updatedAt || {};

const hubUrls = [
  // Homepage
  urlXml(`${DOMAIN}/`, staticPagesDateMap['/'] || DEFAULT_LASTMOD),
  // Categories index
  urlXml(`${DOMAIN}/categories/`, staticPagesDateMap['/categories/'] || DEFAULT_LASTMOD),
  // Price list
  urlXml(`${DOMAIN}/price-list/`, staticPagesDateMap['/price-list/'] || DEFAULT_LASTMOD),
  // Static pages
  urlXml(`${DOMAIN}/faqs/`, staticPagesDateMap['/faqs/'] || DEFAULT_LASTMOD),
  urlXml(`${DOMAIN}/payment-methods/`, staticPagesDateMap['/payment-methods/'] || DEFAULT_LASTMOD),
  urlXml(`${DOMAIN}/refund-warranty-policy/`, staticPagesDateMap['/refund-warranty-policy/'] || DEFAULT_LASTMOD),
  urlXml(`${DOMAIN}/about/`, staticPagesDateMap['/about/'] || DEFAULT_LASTMOD),
  urlXml(`${DOMAIN}/contact/`, staticPagesDateMap['/contact/'] || DEFAULT_LASTMOD),
  urlXml(`${DOMAIN}/privacy-policy/`, staticPagesDateMap['/privacy-policy/'] || DEFAULT_LASTMOD),
  urlXml(`${DOMAIN}/terms/`, staticPagesDateMap['/terms/'] || DEFAULT_LASTMOD),
];

// 15 Category Hubs - sourced from c.updatedAt
categories.forEach((c) => {
  const lastmod = c.updatedAt || DEFAULT_LASTMOD;
  hubUrls.push(urlXml(`${DOMAIN}/${c.slug}/`, lastmod));
});

// 46 Brand Hubs - sourced from bh.updatedAt
hubs.brands.forEach((bh) => {
  const lastmod = bh.updatedAt || DEFAULT_LASTMOD;
  hubUrls.push(urlXml(`${DOMAIN}${bh.url}`, lastmod));
});

const hubsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hubUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_hubs.xml'), hubsXml);

// 3. Comparisons Sitemap (20 comparison items + hub)
const compareUrls = [urlXml(`${DOMAIN}/compare/`, (compData && compData.updatedAt) || DEFAULT_LASTMOD)];
comparisons.forEach((c) => {
  const lastmod = c.updatedAt || c.updated || c.published || c.date || DEFAULT_LASTMOD;
  compareUrls.push(urlXml(`${DOMAIN}/compare/${c.slug}/`, lastmod));
});

const compareXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${compareUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_compare.xml'), compareXml);

// 4. Blog Sitemap (21 guides + hub)
const blogUrls = [urlXml(`${DOMAIN}/blog/`, (blogData && blogData.updatedAt) || DEFAULT_LASTMOD)];
blogs.forEach((b) => {
  const lastmod = b.updatedAt || b.updated || b.published || b.date || DEFAULT_LASTMOD;
  blogUrls.push(urlXml(`${DOMAIN}/blog/${b.slug}/`, lastmod));
});

const blogXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_blog.xml'), blogXml);

// 5. News Sitemap (published items only + hub)
const newsUrls = [urlXml(`${DOMAIN}/ai-news/`, DEFAULT_LASTMOD)];
const NEWS_PER_PAGE = 12;
const totalNewsPages = Math.ceil(aiNews.length / NEWS_PER_PAGE);
if (totalNewsPages > 1) {
  for (let p = 2; p <= totalNewsPages; p++) {
    newsUrls.push(urlXml(`${DOMAIN}/ai-news/page/${p}/`, DEFAULT_LASTMOD));
  }
}
aiNews.forEach((n) => {
  const lastmod = n.updatedAt || (n.dateModified || n.datePublished || '').split('T')[0] || DEFAULT_LASTMOD;
  newsUrls.push(urlXml(`${DOMAIN}/ai-news/${n.slug}/`, lastmod));
});

const newsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${newsUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_news.xml'), newsXml);

// Helper to find latest date in url array
function getLatestDate(urls) {
  let latest = DEFAULT_LASTMOD;
  for (const u of urls) {
    const m = u.match(/<lastmod>([^<]+)<\/lastmod>/);
    if (m && m[1] > latest) latest = m[1];
  }
  return latest;
}

// 6. Sitemap Index (5 sub-sitemaps)
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap_products.xml</loc>
    <lastmod>${getLatestDate(productUrls)}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_hubs.xml</loc>
    <lastmod>${getLatestDate(hubUrls)}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_compare.xml</loc>
    <lastmod>${getLatestDate(compareUrls)}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_blog.xml</loc>
    <lastmod>${getLatestDate(blogUrls)}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_news.xml</loc>
    <lastmod>${getLatestDate(newsUrls)}</lastmod>
  </sitemap>
</sitemapindex>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_index.xml'), indexXml);

// 7. Full combined Sitemap (sitemap.xml) - identical to sitemap_index.xml
const allUrls = [...hubUrls, ...productUrls, ...compareUrls, ...blogUrls, ...newsUrls];
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), indexXml);

console.log(`Saved clean sitemaps: total ${allUrls.length} URLs across sub-sitemaps with per-page updatedAt; sitemap.xml is identical to sitemap_index.xml!`);
