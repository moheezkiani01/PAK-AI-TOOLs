import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const NEWS_IMG_DIR = path.join(ROOT_DIR, 'public', 'images', 'news');

if (!fs.existsSync(NEWS_IMG_DIR)) {
  fs.mkdirSync(NEWS_IMG_DIR, { recursive: true });
}

function escapeXml(unsafe) {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const newsCards = [
  {
    filename: 'adobe-max-2026-creative-agent-1200x630.webp',
    badge: 'ADOBE MAX 2026',
    title: 'Creative Agent, CX Coworker & Local MCP',
    sub: 'Photoshop · Premiere Pro · Firefly · Claude & ChatGPT Connectors',
    tag: 'Creative Tools Dispatch',
    grad1: '#1c0d15',
    grad2: '#2b101c',
    accent: '#FA0F00',
    accentSoft: 'rgba(250, 15, 0, 0.15)',
  },
  {
    filename: 'openai-images-2-6-release-1200x630.webp',
    badge: 'OPENAI RELEASE',
    title: 'Images 2.6: Looping GIFs & SVG Export',
    sub: '50% Faster Speeds · GPT-Image-2.6 Flare & Sunburst Models',
    tag: 'Image & Motion AI',
    grad1: '#0d1315',
    grad2: '#0e1c1b',
    accent: '#10a37f',
    accentSoft: 'rgba(16, 163, 127, 0.15)',
  },
  {
    filename: 'google-gemini-4-hydrogen-carbon-1200x630.webp',
    badge: 'GOOGLE DEEPMIND',
    title: 'Gemini 4: Hydrogen & Carbon Architecture',
    sub: 'Deep Agentic Reasoning vs Everyday Speed · November 2026 Rollout',
    tag: 'Frontier AI Models',
    grad1: '#0b1120',
    grad2: '#131e38',
    accent: '#4285F4',
    accentSoft: 'rgba(66, 133, 244, 0.15)',
  },
];

console.log('--- Generating High-Res News Featured Banners (1200x630 WebP) ---');

for (const card of newsCards) {
  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${card.filename}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${card.grad1}" />
      <stop offset="60%" stop-color="${card.grad2}" />
      <stop offset="100%" stop-color="#0a1215" />
    </linearGradient>
    <radialGradient id="glow-${card.filename}" cx="80%" cy="25%" r="65%">
      <stop offset="0%" stop-color="${card.accent}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${card.accent}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg-${card.filename})" />
  <rect width="1200" height="630" fill="url(#glow-${card.filename})" />

  <!-- Outer Frame -->
  <rect x="40" y="40" width="1120" height="550" rx="24" fill="none" stroke="#253036" stroke-width="2" />

  <!-- Brand Badge Top Left -->
  <g transform="translate(80, 80)">
    <rect width="200" height="44" rx="12" fill="#0a6b5b" fill-opacity="0.25" stroke="#4cc9b0" stroke-width="1.5" />
    <text x="100" y="28" fill="#4cc9b0" font-family="-apple-system, system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">
      PakAITools News
    </text>
  </g>

  <!-- Category Tag Top Right -->
  <g transform="translate(860, 80)">
    <rect width="260" height="44" rx="12" fill="${card.accentSoft}" stroke="${card.accent}" stroke-width="1.5" />
    <text x="130" y="27" fill="${card.accent}" font-family="-apple-system, system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">
      ${escapeXml(card.tag)}
    </text>
  </g>

  <!-- Event/Topic Badge -->
  <g transform="translate(80, 190)">
    <rect width="280" height="38" rx="8" fill="${card.accentSoft}" stroke="${card.accent}" stroke-width="1" />
    <text x="140" y="24" fill="${card.accent}" font-family="-apple-system, system-ui, sans-serif" font-size="15" font-weight="bold" text-anchor="middle" letter-spacing="1">
      ${escapeXml(card.badge)}
    </text>
  </g>

  <!-- Main Headline -->
  <text x="80" y="290" fill="#ffffff" font-family="-apple-system, system-ui, sans-serif" font-size="44" font-weight="800">
    ${escapeXml(card.title)}
  </text>

  <!-- Subtitle -->
  <text x="80" y="350" fill="#cbd5e1" font-family="-apple-system, system-ui, sans-serif" font-size="22" font-weight="500">
    ${escapeXml(card.sub)}
  </text>

  <!-- Footer Info Bar -->
  <line x1="80" y1="480" x2="1120" y2="480" stroke="#253036" stroke-width="1.5" />

  <text x="80" y="525" fill="#94a3b8" font-family="-apple-system, system-ui, sans-serif" font-size="18" font-weight="600">
    🇵🇰 Verified Analysis for Pakistani Freelancers &amp; Developers
  </text>

  <text x="1120" y="525" fill="#4cc9b0" font-family="-apple-system, system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="end">
    pakaitools.store/ai-news
  </text>
</svg>`;

  const outPath = path.join(NEWS_IMG_DIR, card.filename);
  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(outPath);

  console.log(`Saved: public/images/news/${card.filename}`);
}

console.log('All 3 news banners successfully generated!');
