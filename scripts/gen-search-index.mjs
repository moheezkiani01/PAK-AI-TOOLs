import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
const mergedPlans = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'merged_plans.json'), 'utf8'));
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
} else if (fs.existsSync(path.join(DATA_DIR, 'site_pages.json'))) {
  const sp = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'site_pages.json'), 'utf8'));
  blogs = sp.blog || [];
}

let news = [];
if (fs.existsSync(path.join(DATA_DIR, 'news.json'))) {
  news = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'news.json'), 'utf8')) || [];
}

const index = [];

// 1. Products (179)
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

// 2. Merged plans (52)
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

// 3. Brand hubs (44)
for (const bh of hubs.brands) {
  index.push({
    title: bh.name,
    url: bh.url,
    type: 'brand',
    category: bh.categorySlug,
    keywords: `${bh.name} ${bh.brandSlug}`.toLowerCase(),
  });
}

// 4. Categories (15)
for (const cat of categories) {
  index.push({
    title: cat.name,
    url: `/${cat.slug}/`,
    type: 'category',
    category: cat.slug,
    keywords: `${cat.name} ${cat.sampleBrands.join(' ')}`.toLowerCase(),
  });
}

// 5. Comparisons (20)
for (const c of comparisons) {
  index.push({
    title: c.rawTitle || c.h1 || c.seoTitle,
    url: `/compare/${c.slug}/`,
    type: 'comparison',
    category: c.category,
    keywords: `${c.rawTitle} ${c.seoTitle} ${c.h1} ${c.slug}`.toLowerCase(),
  });
}

// 6. Blog posts (21)
for (const bp of blogs) {
  index.push({
    title: bp.seoTitle || bp.title || bp.h1,
    url: `/blog/${bp.slug}/`,
    type: 'guide',
    keywords: `${bp.title || ''} ${bp.seoTitle || ''} ${bp.desc || bp.summary || ''}`.toLowerCase(),
  });
}

fs.writeFileSync(path.join(PUBLIC_DIR, 'search-index.json'), JSON.stringify(index));
console.log(`Saved public/search-index.json with ${index.length} searchable items!`);
