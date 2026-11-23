import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
const hubs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'hubs.json'), 'utf8'));
const sitePages = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'site_pages.json'), 'utf8'));

const DOMAIN = 'https://pakaitools.store';
const DATE = '2026-11-22';

function urlXml(loc, lastmod, priority = '0.8', changefreq = 'weekly') {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// 1. Products Sitemap
const productUrls = products.map((p) => urlXml(`${DOMAIN}/product/${p.slug}/`, DATE, '0.9', 'weekly'));
const productsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_products.xml'), productsXml);

// 2. Hubs Sitemap (Category Hubs + Brand Hubs + Categories list)
const hubUrls = [
  urlXml(`${DOMAIN}/`, DATE, '1.0', 'daily'),
  urlXml(`${DOMAIN}/categories/`, DATE, '0.8', 'weekly'),
  urlXml(`${DOMAIN}/price-list/`, DATE, '0.9', 'daily'),
  urlXml(`${DOMAIN}/payment-methods/`, DATE, '0.6', 'monthly'),
  urlXml(`${DOMAIN}/refund-warranty-policy/`, DATE, '0.6', 'monthly'),
  urlXml(`${DOMAIN}/about/`, DATE, '0.5', 'monthly'),
  urlXml(`${DOMAIN}/contact/`, DATE, '0.5', 'monthly'),
  urlXml(`${DOMAIN}/privacy-policy/`, DATE, '0.4', 'monthly'),
  urlXml(`${DOMAIN}/terms/`, DATE, '0.4', 'monthly'),
];

categories.forEach((c) => {
  hubUrls.push(urlXml(`${DOMAIN}/${c.slug}/`, DATE, '0.8', 'weekly'));
});

hubs.brands.forEach((bh) => {
  hubUrls.push(urlXml(`${DOMAIN}${bh.url}`, DATE, '0.8', 'weekly'));
});

const hubsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hubUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_hubs.xml'), hubsXml);

// 3. Blog Sitemap
const blogUrls = [urlXml(`${DOMAIN}/blog/`, DATE, '0.7', 'weekly')];
(sitePages.blog || []).forEach((b) => {
  blogUrls.push(urlXml(`${DOMAIN}/blog/${b.slug}/`, b.date || DATE, '0.7', 'monthly'));
});

const blogXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogUrls.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_blog.xml'), blogXml);

// 4. Sitemap Index
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap_products.xml</loc>
    <lastmod>${DATE}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_hubs.xml</loc>
    <lastmod>${DATE}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap_blog.xml</loc>
    <lastmod>${DATE}</lastmod>
  </sitemap>
</sitemapindex>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap_index.xml'), indexXml);

console.log('Saved split sitemaps: sitemap_products.xml, sitemap_hubs.xml, sitemap_blog.xml, and sitemap_index.xml in public/!');
