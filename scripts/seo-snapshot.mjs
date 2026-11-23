import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || 'out';
const outputFile = process.argv[3] || null;
const rows = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) rows.push(extract(p));
  }
}

function extract(p) {
  const h = fs.readFileSync(p, 'utf8');
  const m = (re) => ((h.match(re) || [, ''])[1] || '').replace(/\s+/g, ' ').trim();
  return {
    file: path.relative(root, p).replace(/\\/g, '/'),
    title: m(/<title[^>]*>([\s\S]*?)<\/title>/i),
    canonical: m(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i),
    description: m(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i),
    robots: m(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/i),
    h1: m(/<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, ''),
    jsonLdBlocks: (h.match(/application\/ld\+json/g) || []).length,
    hasObjectObject: h.includes('[object Object]'),
  };
}

walk(root);
rows.sort((a, b) => a.file.localeCompare(b.file));

const jsonStr = JSON.stringify(rows, null, 2);
if (outputFile) {
  fs.writeFileSync(outputFile, jsonStr, 'utf8');
  console.log(`Saved snapshot to ${outputFile} (${rows.length} pages)`);
} else {
  console.log(jsonStr);
}
