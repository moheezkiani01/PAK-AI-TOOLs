import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
const mergedPlans = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'merged_plans.json'), 'utf8'));
const hubs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'hubs.json'), 'utf8'));
const sitePages = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'site_pages.json'), 'utf8'));

const index = [];

// Products (179)
for (const p of products) {
  index.push({
    title: p.name,
    url: `/product/${p.slug}/`,
    type: 'plan',
    category: p.categorySlug,
    price: p.price,
    duration: p.duration,
    keywords: `${p.name} ${p.keywords?.primary || ''} ${p.keywords?.romanUrdu || ''}`.toLowerCase(),
  });
}

// Merged plans (52)
for (const mp of mergedPlans) {
  index.push({
    title: mp.name,
    url: mp.redirectTo,
    type: 'merged_plan',
    category: mp.categorySlug,
    price: mp.price,
    duration: mp.duration,
    keywords: `${mp.name} ${mp.duration} ${mp.categorySlug}`.toLowerCase(),
  });
}

// Brand hubs (44)
for (const bh of hubs.brands) {
  index.push({
    title: bh.name,
    url: bh.url,
    type: 'brand',
    category: bh.categorySlug,
    keywords: `${bh.name} ${bh.brandSlug}`.toLowerCase(),
  });
}

// Categories (15)
for (const cat of categories) {
  index.push({
    title: cat.name,
    url: `/${cat.slug}/`,
    type: 'category',
    category: cat.slug,
    keywords: `${cat.name} ${cat.sampleBrands.join(' ')}`.toLowerCase(),
  });
}

// Blog posts (18)
for (const bp of sitePages.blog || []) {
  index.push({
    title: bp.title,
    url: `/blog/${bp.slug}/`,
    type: 'guide',
    keywords: `${bp.title} ${bp.desc}`.toLowerCase(),
  });
}

fs.writeFileSync(path.join(PUBLIC_DIR, 'search-index.json'), JSON.stringify(index));
console.log(`Saved public/search-index.json with ${index.length} searchable items!`);
