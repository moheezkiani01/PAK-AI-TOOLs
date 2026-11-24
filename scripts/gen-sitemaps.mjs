import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
const hubs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'hubs.json'), 'utf8'));

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

const DOMAIN = 'https://pakaitools.store';

function urlXml(loc, lastmod, priority = '0.8', changefreq = 'weekly') {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>
    <loc>${loc}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// 1. Products Sitemap: each product uses its updatedAt (omit if none)
const productUrls = products.map((p) => {
  const lastmod = p.updatedAt || null;
  return urlXml(`${DOMAIN}/product/${p.slug}/`, lastmod, '0.9', 'weekly');
});
const productsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_products.xml'), productsXml);

// 2. Hubs Sitemap (Category Hubs + Brand Hubs + Static pages)
// Newest product updatedAt across all products:
const allProductDates = products.map((p) => p.updatedAt).filter(Boolean).sort().reverse();
const globalProductNewestDate = allProductDates[0] || null;

const hubUrls = [
  // Homepage lists all products
  urlXml(`${DOMAIN}/`, globalProductNewestDate, '1.0', 'daily'),
  // Categories index lists categories/products
  urlXml(`${DOMAIN}/categories/`, globalProductNewestDate, '0.8', 'weekly'),
  // Price list lists all products
  urlXml(`${DOMAIN}/price-list/`, globalProductNewestDate, '0.9', 'daily'),
  // Static pages have no date: omit <lastmod>
  urlXml(`${DOMAIN}/payment-methods/`, null, '0.6', 'monthly'),
  urlXml(`${DOMAIN}/refund-warranty-policy/`, null, '0.6', 'monthly'),
  urlXml(`${DOMAIN}/about/`, null, '0.5', 'monthly'),
  urlXml(`${DOMAIN}/contact/`, null, '0.5', 'monthly'),
  urlXml(`${DOMAIN}/privacy-policy/`, null, '0.4', 'monthly'),
  urlXml(`${DOMAIN}/terms/`, null, '0.4', 'monthly'),
];

// Category Hubs: newest updatedAt of products in that category
categories.forEach((c) => {
  const catProds = products.filter((p) => p.categorySlug === c.slug && p.updatedAt);
  const newestDate = catProds.length > 0 ? catProds.map((p) => p.updatedAt).sort().reverse()[0] : null;
  hubUrls.push(urlXml(`${DOMAIN}/${c.slug}/`, newestDate, '0.8', 'weekly'));
});

// Brand Hubs: newest updatedAt of products for that brand
hubs.brands.forEach((bh) => {
  const brandProds = products.filter(
    (p) => (p.categorySlug === bh.categorySlug || !bh.categorySlug) && p.brandSlug === bh.brandSlug && p.updatedAt
  );
  const newestDate = brandProds.length > 0 ? brandProds.map((p) => p.updatedAt).sort().reverse()[0] : null;
  hubUrls.push(urlXml(`${DOMAIN}${bh.url}`, newestDate, '0.8', 'weekly'));
});

const hubsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hubUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_hubs.xml'), hubsXml);

// 3. Comparisons Sitemap (20 comparison items + hub)
// Compare pages use the newest updatedAt of the products they list.
const compLastmods = comparisons.map((c) => {
  const linkedSlugs = [...(c.contentMarkdown || '').matchAll(/\/product\/([a-z0-9-]+)\//g)].map((m) => m[1]);
  const linkedProds = products.filter((p) => linkedSlugs.includes(p.slug) && p.updatedAt);
  if (linkedProds.length > 0) {
    return linkedProds.map((p) => p.updatedAt).sort().reverse()[0];
  }
  return c.updated || c.published || c.date || null;
});

const newestCompareDate = compLastmods.filter(Boolean).sort().reverse()[0] || globalProductNewestDate;

const compareUrls = [urlXml(`${DOMAIN}/compare/`, newestCompareDate, '0.8', 'weekly')];
comparisons.forEach((c, idx) => {
  const lastmod = compLastmods[idx];
  compareUrls.push(urlXml(`${DOMAIN}/compare/${c.slug}/`, lastmod, '0.8', 'monthly'));
});

const compareXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${compareUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_compare.xml'), compareXml);

// 4. Blog Sitemap (21 guides + hub)
// blog posts use their updated or published date
const blogLastmods = blogs.map((b) => b.updated || b.published || b.date || null);
const newestBlogDate = blogLastmods.filter(Boolean).sort().reverse()[0] || null;

const blogUrls = [urlXml(`${DOMAIN}/blog/`, newestBlogDate, '0.7', 'weekly')];
blogs.forEach((b, idx) => {
  const lastmod = blogLastmods[idx];
  blogUrls.push(urlXml(`${DOMAIN}/blog/${b.slug}/`, lastmod, '0.7', 'monthly'));
});

const blogXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_blog.xml'), blogXml);

// 5. Sitemap Index (4 sub-sitemaps)
// Each sub-sitemap uses its newest real lastmod
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap_products.xml</loc>${globalProductNewestDate ? `\n    <lastmod>${globalProductNewestDate}</lastmod>` : ''}
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_hubs.xml</loc>${globalProductNewestDate ? `\n    <lastmod>${globalProductNewestDate}</lastmod>` : ''}
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_compare.xml</loc>${newestCompareDate ? `\n    <lastmod>${newestCompareDate}</lastmod>` : ''}
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_blog.xml</loc>${newestBlogDate ? `\n    <lastmod>${newestBlogDate}</lastmod>` : ''}
  </sitemap>
</sitemapindex>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_index.xml'), indexXml);

// 6. Full combined Sitemap (sitemap.xml)
const allUrls = [...hubUrls, ...productUrls, ...compareUrls, ...blogUrls];
const fullSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), fullSitemapXml);

console.log('Saved split sitemaps: sitemap_products.xml, sitemap_hubs.xml, sitemap_compare.xml, sitemap_blog.xml, sitemap_index.xml, and sitemap.xml in public/!');
