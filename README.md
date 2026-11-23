# PakAITools (pakaitools.store)

The official high-performance storefront for Pakistan's premier software & AI tools subscription marketplace. Built with Next.js 15 (Static HTML Export), Tailwind CSS, TypeScript, and Lucide React. Optimized specifically for lightning-fast global edge delivery on **Cloudflare Workers & Pages**.

---

## 🚀 Cloudflare Deployment Guide

### Option 1: Git Integration (Cloudflare Dashboard)

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the navigation, go to **Workers & Pages** > **Overview** > click **Create Application**.
3. Connect your GitHub repository: `moheezkiani01/PAK-AI-TOOLs`.
4. In the build configuration:
   - **Framework preset**: `None` or `Next.js (Static Export)`
   - **Build command**: `pnpm run build` *(or `npm run build`)*
   - **Build output directory**: `out`
   - **Deploy command**: `npx wrangler deploy` *(or leave default)*
5. The repository includes:
   - `wrangler.toml` configured with `[assets] directory = "./out"`
   - `.node-version` & `.nvmrc` set to Node 20
6. Click **Save and Deploy**. Cloudflare builds all 274 pages and deploys them to Cloudflare's edge network.

---

### Option 2: Deploy from Command Line via Wrangler

You can deploy directly from your local terminal:

```bash
# 1. Build the static production site
npm run build

# 2. Deploy to Cloudflare
npx wrangler deploy
```

---

## 🌐 Custom Domain Setup (pakaitools.store)

1. Go to your Cloudflare project dashboard.
2. Under **Settings** > **Domains & Routes** (or **Custom domains**), click **Add**.
3. Enter `pakaitools.store` (and optionally `www.pakaitools.store`).
4. If your domain DNS is managed by Cloudflare, it will configure CNAME records automatically and issue an SSL/TLS certificate.

---

## ⚡ Edge Features Configured

- **Native Static Assets (`[assets]` in `wrangler.toml`)**:
  - `directory = "./out"`
  - `html_handling = "auto-trailing-slash"`
  - `not_found_handling = "404-page"` (serves `out/404.html`)
- **Native 301 Redirects (`public/_redirects`)**: 52 legacy product and merged plan routes are automatically 301-redirected at the edge.
- **Security & Caching Headers (`public/_headers`)**:
  - HSTS (`max-age=31536000; includeSubDomains`)
  - No-sniff & Referrer Policy
  - Long-lived immutable asset caching for `/_next/static/*` (1 year) and `/brands/*` (30 days)
  - `must-revalidate` for HTML pages to ensure visitors immediately see updates.
- **Split XML Sitemaps (`public/sitemap_index.xml`)**: Cleanly organized into products, hubs, and blog buying guides.
- **AI Agent Context (`public/llms.txt`)**: Context for AI search engines (SearchGPT, Perplexity, Gemini).

---

## 🛠 Local Development

```bash
# Install dependencies
pnpm install # or npm install

# Run local development server
npm run dev

# Build and validate production export
npm run build

# Preview static export locally
npm run preview
```
