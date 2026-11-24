import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const BASELINE_DIR = path.join(ROOT_DIR, 'out-baseline');
const NEW_DIR = path.join(ROOT_DIR, 'out');

console.log('==============================================');
console.log('          SEO AUDIT & SNAPSHOT DIFF           ');
console.log('==============================================\n');

if (!fs.existsSync(BASELINE_DIR)) {
  console.error(`❌ Baseline directory not found at ${BASELINE_DIR}. Cannot compute diff.`);
  process.exit(1);
}

if (!fs.existsSync(NEW_DIR)) {
  console.error(`❌ New build directory not found at ${NEW_DIR}. Run build first.`);
  process.exit(1);
}

function findHtmlFiles(dir, base = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath, relPath));
    } else if (entry.name === 'index.html' || entry.name.endsWith('.html')) {
      results.push(relPath);
    }
  }
  return results;
}

function parsePage(filePath, rootDir) {
  const fullPath = path.join(rootDir, filePath);
  const html = fs.readFileSync(fullPath, 'utf8');

  // URL normalization
  let urlPath = '/' + filePath.replace(/\\/g, '/').replace(/index\.html$/, '');
  if (!urlPath.endsWith('/')) urlPath += '/';
  if (urlPath === '//') urlPath = '/';

  // Title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Meta description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) ||
                    html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
  const metaDesc = descMatch ? descMatch[1].trim() : '';

  // Canonical
  const canMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) ||
                   html.match(/<link\s+href="([^"]*)"\s+rel="canonical"/i);
  const canonical = canMatch ? canMatch[1].trim() : '';

  // H1s
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1s = h1Matches.map((m) => m[1].replace(/<[^>]*>/g, '').trim());

  // Robots meta
  const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);
  const robots = robotsMatch ? robotsMatch[1].trim() : '';

  // Internal links count
  const linkMatches = [...html.matchAll(/<a\s+[^>]*href="([^"]*)"[^>]*>/gi)];
  const internalLinks = linkMatches.filter((m) => {
    const href = m[1];
    return href.startsWith('/') || href.startsWith('https://pakaitools.store');
  }).length;

  // JSON-LD types
  const jsonLdTypes = new Set();
  const jsonLdScripts = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const script of jsonLdScripts) {
    try {
      const data = JSON.parse(script[1]);
      const nodes = data['@graph'] || [data];
      for (const node of nodes) {
        if (node['@type']) {
          if (Array.isArray(node['@type'])) {
            node['@type'].forEach((t) => jsonLdTypes.add(t));
          } else {
            jsonLdTypes.add(node['@type']);
          }
        }
      }
    } catch (e) {}
  }

  return {
    urlPath,
    title,
    metaDesc,
    canonical,
    h1s,
    robots,
    internalLinks,
    jsonLdTypes: Array.from(jsonLdTypes).sort(),
  };
}

// 1. Scan pages
const baselineFiles = findHtmlFiles(BASELINE_DIR);
const newFiles = findHtmlFiles(NEW_DIR);

const baselineMap = new Map();
for (const file of baselineFiles) {
  const parsed = parsePage(file, BASELINE_DIR);
  baselineMap.set(parsed.urlPath, parsed);
}

const newMap = new Map();
for (const file of newFiles) {
  const parsed = parsePage(file, NEW_DIR);
  newMap.set(parsed.urlPath, parsed);
}

// Read redirects in new build
const redirectsFile = path.join(NEW_DIR, '_redirects');
const redirectsMap = new Map();
if (fs.existsSync(redirectsFile)) {
  const lines = fs.readFileSync(redirectsFile, 'utf8').split('\n');
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 2) {
      redirectsMap.set(parts[0], parts[1]);
    }
  }
}

let errors = 0;
let warnings = 0;

console.log(`Baseline pages: ${baselineMap.size}`);
console.log(`New build pages: ${newMap.size}\n`);

// 2. Check for missing pages
const missingUrls = [];
for (const [urlPath] of baselineMap) {
  if (!newMap.has(urlPath)) {
    if (redirectsMap.has(urlPath) || redirectsMap.has(urlPath.replace(/\/$/, ''))) {
      console.log(`ℹ️ [REDIRECTED] ${urlPath} -> ${redirectsMap.get(urlPath) || redirectsMap.get(urlPath.replace(/\/$/, ''))}`);
    } else {
      console.error(`❌ [ERROR] Page disappeared without 301 redirect: ${urlPath}`);
      missingUrls.push(urlPath);
      errors++;
    }
  }
}

// 3. Compare changed pages
const changedTitles = [];
const changedH1s = [];
const changedCanonicals = [];
const changedRobots = [];
const changedMetaDescs = [];
const changedJsonLd = [];

for (const [urlPath, newPage] of newMap) {
  const basePage = baselineMap.get(urlPath);
  if (!basePage) {
    console.log(`✨ [NEW PAGE] ${urlPath}`);
    continue;
  }

  // Compare Title
  if (basePage.title !== newPage.title) {
    changedTitles.push({ urlPath, old: basePage.title, new: newPage.title });
  }

  // Compare H1s
  if (JSON.stringify(basePage.h1s) !== JSON.stringify(newPage.h1s)) {
    changedH1s.push({ urlPath, old: basePage.h1s, new: newPage.h1s });
  }

  // Compare Canonical
  if (basePage.canonical !== newPage.canonical) {
    changedCanonicals.push({ urlPath, old: basePage.canonical, new: newPage.canonical });
  }

  // Compare Robots
  if (basePage.robots !== newPage.robots) {
    changedRobots.push({ urlPath, old: basePage.robots, new: newPage.robots });
  }

  // Compare Meta Desc
  if (basePage.metaDesc !== newPage.metaDesc) {
    changedMetaDescs.push({ urlPath, old: basePage.metaDesc, new: newPage.metaDesc });
  }

  // Compare JSON-LD
  if (JSON.stringify(basePage.jsonLdTypes) !== JSON.stringify(newPage.jsonLdTypes)) {
    changedJsonLd.push({ urlPath, old: basePage.jsonLdTypes, new: newPage.jsonLdTypes });
  }
}

// 4. Compare Sitemaps
function loadSitemapUrls(dir) {
  const urls = new Set();
  if (!fs.existsSync(dir)) return urls;
  const files = fs.readdirSync(dir).filter((f) => f.startsWith('sitemap') && f.endsWith('.xml'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const locs = content.matchAll(/<loc>([^<]+)<\/loc>/g);
    for (const m of locs) urls.add(m[1].trim());
  }
  return urls;
}

const baseSitemap = loadSitemapUrls(BASELINE_DIR);
const newSitemap = loadSitemapUrls(NEW_DIR);

const sitemapRemoved = [];
for (const u of baseSitemap) {
  if (!newSitemap.has(u)) sitemapRemoved.push(u);
}
const sitemapAdded = [];
for (const u of newSitemap) {
  if (!baseSitemap.has(u)) sitemapAdded.push(u);
}

// Output summary
console.log('---------------- DIFF SUMMARY ----------------');
console.log(`Titles changed:       ${changedTitles.length}`);
console.log(`H1s changed:          ${changedH1s.length}`);
console.log(`Canonicals changed:   ${changedCanonicals.length}`);
console.log(`Robots meta changed:  ${changedRobots.length}`);
console.log(`Meta descs changed:   ${changedMetaDescs.length}`);
console.log(`JSON-LD types changed:${changedJsonLd.length}`);
console.log(`Sitemap URLs added:   ${sitemapAdded.length}`);
console.log(`Sitemap URLs removed: ${sitemapRemoved.length}`);

if (changedTitles.length > 0) {
  console.log('\n--- Changed Titles ---');
  for (const t of changedTitles) console.log(`${t.urlPath}:\n  - ${t.old}\n  + ${t.new}`);
}

if (changedH1s.length > 0) {
  console.log('\n--- Changed H1s ---');
  for (const h of changedH1s) console.log(`${h.urlPath}:\n  - ${h.old.join(' | ')}\n  + ${h.new.join(' | ')}`);
}

if (changedCanonicals.length > 0) {
  console.log('\n--- Changed Canonicals ---');
  for (const c of changedCanonicals) console.log(`${c.urlPath}:\n  - ${c.old}\n  + ${c.new}`);
}

if (changedRobots.length > 0) {
  console.log('\n--- Changed Robots Meta ---');
  for (const r of changedRobots) console.log(`${r.urlPath}:\n  - ${r.old}\n  + ${r.new}`);
}

if (changedMetaDescs.length > 0) {
  console.log('\n--- Changed Meta Descriptions ---');
  for (const m of changedMetaDescs) console.log(`${m.urlPath}:\n  - ${m.old}\n  + ${m.new}`);
}

if (sitemapRemoved.length > 0) {
  console.log('\n--- Sitemap URLs Removed ---');
  for (const u of sitemapRemoved) console.log(`  - ${u}`);
}

console.log('----------------------------------------------');
if (errors === 0) {
  console.log('✅ SEO DIFF AUDIT PASSED: No accidental URL losses or unhandled regressions.');
  process.exit(0);
} else {
  console.error(`❌ SEO DIFF AUDIT FAILED with ${errors} error(s).`);
  process.exit(1);
}
