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
  const slug = p.url.replace(/^\/product\//, '').replace(/\/$/, '');
  faqProductSlugs.add(slug);
}

let comparisons = [];
if (fs.existsSync(path.join(DATA_DIR, 'comparisons.json'))) {
  const compData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'comparisons.json'), 'utf8'));
  comparisons = compData.items || [];
}

let blogs = [];
if (fs.existsSync(path.join(DATA_DIR, 'blogs.json'))) {
  const blogData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'blogs.json'), 'utf8'));
  blogs = blogData.items || [];
}

let aiNews = [];
if (fs.existsSync(path.join(DATA_DIR, 'ai-news.json'))) {
  const rawNews = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ai-news.json'), 'utf8'));
  aiNews = rawNews.filter((p) => !p.draft);
}

const DOMAIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pakaitools.store').replace(/\/+$/, '');
const FAQ_RELEASE_DATE = '2026-11-26';

function urlXml(loc, lastmod) {
  const cleanLastmod = lastmod || FAQ_RELEASE_DATE;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${cleanLastmod}</lastmod>
  </url>`;
}

// 1. Products Sitemap (189 products)
// Products with FAQ pack use FAQ_RELEASE_DATE (2026-11-26); newer products use their real updatedAt
const productUrls = products.map((p) => {
  const hasFaq = faqProductSlugs.has(p.slug);
  const lastmod = hasFaq ? FAQ_RELEASE_DATE : (p.updatedAt || FAQ_RELEASE_DATE);
  return urlXml(`${DOMAIN}/product/${p.slug}/`, lastmod);
});

const productsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_products.xml'), productsXml);

// 2. Hubs Sitemap (Category Hubs + Brand Hubs + Static pages)
const hubUrls = [
  // Homepage
  urlXml(`${DOMAIN}/`, FAQ_RELEASE_DATE),
  // Categories index
  urlXml(`${DOMAIN}/categories/`, FAQ_RELEASE_DATE),
  // Price list
  urlXml(`${DOMAIN}/price-list/`, FAQ_RELEASE_DATE),
  // Static pages - all given valid lastmod
  urlXml(`${DOMAIN}/faqs/`, FAQ_RELEASE_DATE),
  urlXml(`${DOMAIN}/payment-methods/`, FAQ_RELEASE_DATE),
  urlXml(`${DOMAIN}/refund-warranty-policy/`, FAQ_RELEASE_DATE),
  urlXml(`${DOMAIN}/about/`, FAQ_RELEASE_DATE),
  urlXml(`${DOMAIN}/contact/`, FAQ_RELEASE_DATE),
  urlXml(`${DOMAIN}/privacy-policy/`, FAQ_RELEASE_DATE),
  urlXml(`${DOMAIN}/terms/`, FAQ_RELEASE_DATE),
];

// 15 Category Hubs - updated with FAQ pack content
categories.forEach((c) => {
  hubUrls.push(urlXml(`${DOMAIN}/${c.slug}/`, FAQ_RELEASE_DATE));
});

// 46 Brand Hubs
hubs.brands.forEach((bh) => {
  hubUrls.push(urlXml(`${DOMAIN}${bh.url}`, FAQ_RELEASE_DATE));
});

const hubsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hubUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_hubs.xml'), hubsXml);

// 3. Comparisons Sitemap (20 comparison items + hub)
const compareUrls = [urlXml(`${DOMAIN}/compare/`, FAQ_RELEASE_DATE)];
comparisons.forEach((c) => {
  const lastmod = c.updated || c.published || c.date || FAQ_RELEASE_DATE;
  compareUrls.push(urlXml(`${DOMAIN}/compare/${c.slug}/`, lastmod));
});

const compareXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${compareUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_compare.xml'), compareXml);

// 4. Blog Sitemap (21 guides + hub)
const blogUrls = [urlXml(`${DOMAIN}/blog/`, FAQ_RELEASE_DATE)];
blogs.forEach((b) => {
  const lastmod = b.updated || b.published || b.date || FAQ_RELEASE_DATE;
  blogUrls.push(urlXml(`${DOMAIN}/blog/${b.slug}/`, lastmod));
});

const blogXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_blog.xml'), blogXml);

// 5. News Sitemap (published items only + hub)
const newsUrls = [urlXml(`${DOMAIN}/ai-news/`, FAQ_RELEASE_DATE)];
const NEWS_PER_PAGE = 12;
const totalNewsPages = Math.ceil(aiNews.length / NEWS_PER_PAGE);
if (totalNewsPages > 1) {
  for (let p = 2; p <= totalNewsPages; p++) {
    newsUrls.push(urlXml(`${DOMAIN}/ai-news/page/${p}/`, FAQ_RELEASE_DATE));
  }
}
aiNews.forEach((n) => {
  const lastmod = (n.dateModified || n.datePublished || '').split('T')[0] || FAQ_RELEASE_DATE;
  newsUrls.push(urlXml(`${DOMAIN}/ai-news/${n.slug}/`, lastmod));
});

const newsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${newsUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_news.xml'), newsXml);

// 6. Sitemap Index (5 sub-sitemaps)
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap_products.xml</loc>
    <lastmod>${FAQ_RELEASE_DATE}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_hubs.xml</loc>
    <lastmod>${FAQ_RELEASE_DATE}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_compare.xml</loc>
    <lastmod>${FAQ_RELEASE_DATE}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_blog.xml</loc>
    <lastmod>${FAQ_RELEASE_DATE}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_news.xml</loc>
    <lastmod>${FAQ_RELEASE_DATE}</lastmod>
  </sitemap>
</sitemapindex>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_index.xml'), indexXml);

// 7. Full combined Sitemap (sitemap.xml)
const allUrls = [...hubUrls, ...productUrls, ...compareUrls, ...blogUrls, ...newsUrls];
const fullSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), fullSitemapXml);

console.log(`Saved clean sitemaps: total ${allUrls.length} URLs across sub-sitemaps and sitemap.xml!`);
