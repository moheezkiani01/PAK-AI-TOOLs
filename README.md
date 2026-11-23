# PakAITools (pakaitools.store)

The official high-performance storefront for Pakistan's premier software & AI tools subscription marketplace. Built with Next.js 15 (Static HTML Export), Tailwind CSS, TypeScript, and Lucide React. Optimized specifically for lightning-fast global edge delivery on **Cloudflare Pages**.

---

## 🚀 Cloudflare Pages Deployment Guide

### Option 1: 1-Click Git Integration (Recommended)

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, go to **Workers & Pages** > **Overview** > click **Create Application**.
3. Select the **Pages** tab and click **Connect to Git**.
4. Authorize GitHub and select your repository: `moheezkiani01/PAK-AI-TOOLs`.
5. In the **Set up builds and deployments** section:
   - **Project name**: `pakaitools` (or your preferred name)
   - **Production branch**: `main`
   - **Framework preset**: `None` or `Next.js (Static Export)`
   - **Build command**: `pnpm run build` *(or `npm run build`)*
   - **Build output directory**: `out`
   - **Root directory**: `/`
6. **Environment Variables**:
   Under **Environment variables (advanced)**, add:
   - Variable name: `NODE_VERSION`
   - Value: `20`
   *(Cloudflare also automatically reads `.node-version` and `.nvmrc` included in this repository).*
7. Click **Save and Deploy**. Cloudflare will automatically build all 274 pages and deploy to a free `*.pages.dev` subdomain with instant global CDN caching and free SSL.

---

### Option 2: Deploy from Command Line via Wrangler

You can also deploy directly from your terminal using Cloudflare's official CLI:

```bash
# 1. Build the static production site
npm run build

# 2. Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name=pakaitools
```

Follow the browser login prompt on first run to connect your Cloudflare account.

---

## 🌐 Custom Domain Setup (pakaitools.store)

1. Go to your Cloudflare Pages project dashboard.
2. Click the **Custom domains** tab > **Set up a custom domain**.
3. Enter `pakaitools.store` (and optionally `www.pakaitools.store`).
4. If your domain is already managed on Cloudflare DNS, Cloudflare will automatically configure the CNAME records with 1-click activation and issue an SSL/TLS certificate.

---

## ⚡ Cloudflare Pages Edge Features Configured

- **Native 301 Redirects (`public/_redirects`)**: 52 legacy product and merged plan routes are automatically 301-redirected at the Cloudflare edge to their official category and brand hubs without origin hits.
- **Security & Caching Headers (`public/_headers`)**:
  - HSTS (`max-age=31536000; includeSubDomains`)
  - No-sniff & Referrer Policy
  - Long-lived immutable asset caching for `/_next/static/*` (1 year) and `/brands/*` (30 days)
  - `must-revalidate` for HTML pages to ensure visitors immediately see instant updates.
- **Custom 404 Error Page (`out/404.html`)**: Automatically rendered for any invalid URL.
- **Split XML Sitemaps (`public/sitemap_index.xml`)**: Cleanly organized into products, hubs, and blog buying guides.
- **AI Agent Context (`public/llms.txt`)**: Markdown-formatted context for LLM search bots (SearchGPT, Perplexity, Gemini).

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
