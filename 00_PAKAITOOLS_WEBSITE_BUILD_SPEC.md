# PakAITools — Complete Website Build Specification

**Site:** https://pakaitools.store · **Owner/Founder:** Moheez Kiani · **WhatsApp:** +92 321 9305619 · **Email:** support@aitoolspak.com
**Version:** 1.0 · **Written:** November 22, 2026 · **Audience:** the developer (or AI coding agent) who builds the site. The owner is non-technical, so every decision below is already made. Do not ask the owner technical questions. If something is missing, add it to `data-issues.md` and carry on.

---

## 0. How to use this document

1. Read sections 1 and 2 (decisions and verified rules). They override older notes, including `pakaitools-build-brief.md`.
2. Build in the order of section 21.
3. The catalogue files are the source of truth. Do not rewrite catalogue text. Render it as written.
4. Run `pnpm validate` before every deploy. A failed validation blocks the deploy.

### Files you receive

| File | Use |
|---|---|
| `00_PAKAITOOLS_WEBSITE_BUILD_SPEC.md` | This document |
| `data/products.json` | 179 indexable product pages with full text, FAQs, schema fields |
| `data/hubs.json` | 15 category hubs + 44 brand hubs (text) |
| `data/site_pages.json` | Home text, Payment, Refund & Warranty, About, Contact, Privacy, Terms |
| `data/categories.json` | 15 categories in display order, with icon, tint, counts |
| `data/redirects.json`, `06_url_map_and_redirects.csv` | 52 redirects, full URL status map |
| `09_BLOG_SECTION_SPEC_AND_CONTENT_PLAN.md` | **Blog and comparisons section** (spec, templates, 55-post plan). Section 22 summarises it |
| `01…05_*.txt` | Human-readable catalogue (same content as the JSON) |
| `assets/brand/*` | The owner’s logo in all needed sizes, favicons, OG image |
| `pakaitools_website_template.html` | Visual reference (design only, not production code) |
| `ui-ux.md` | Design rules (Apple-HIG style). Section 12 summarises them |
| Logo zip with brand logos | **Not received yet.** The owner must send it. See section 11 |

---

## 1. Decisions made (and why they differ from the old brief)

| # | Topic | Decision | Reason |
|---|---|---|---|
| 1 | Framework | **Next.js (latest) App Router, static export (`output: 'export'`)**, TypeScript, Tailwind CSS (latest), shadcn/ui, lucide-react, **pnpm** (from `stack.md`). Deploy the `out/` folder to Cloudflare Pages. | Owner chose this stack. Static export gives one real HTML file per URL: fastest and easiest to crawl. |
| 2 | Product pages | Build **all 179** indexable plan pages from `products.json`. | The old brief assumed only 6 rich pages. The catalogue has full text for all 179. Rendering it “as is” is the owner’s requirement. |
| 3 | Merged plans | 52 plans have **no page**. They appear as rows on their brand hub and 301 to the hub. | Avoids near-duplicate pages. |
| 4 | Single-plan brands | 43 brands have one plan. Category cards show the **brand only** (name, logo, “1 plan”). One click opens the **product page directly**. No separate brand page. | A brand page and a product page for the same single plan would be duplicates. This also fixes the “product detail shown on the brand card” problem. |
| 5 | Redirects, headers | Use Cloudflare `public/_redirects` and `public/_headers`. Do **not** use `next.config` redirects or headers. | Next.js documents that redirects, rewrites, headers and middleware are unsupported in static export. |
| 6 | Currency | PKR is always in the HTML and in schema. USD is a display layer switched in the browser. | Googlebot mostly crawls from US IPs. Server-side IP switching can make Google index the wrong currency. See section 9. |
| 7 | Quote-only plans (no price) | Do **not** output an `Offer`. Use `WebPage` + `BreadcrumbList` (+ `FAQPage`) instead of `Product`. | A Product with no price is not valid for merchant listings. The owner keeps prices off the site because they change daily. |
| 8 | “Price verified on {build date}” | Replace with “Prices last reviewed on {PRICES_REVIEWED_ON}”, a date the owner edits in config. | Using the build date would claim a price check that did not happen. |
| 9 | `lastmod` in sitemap | Use the real date each page’s data last changed, not the build date for every page. | Google uses `lastmod` only when it is consistently accurate. |
| 10 | `llms.txt` | Optional, low priority. | Google’s June 2026 guide says it is not needed for Google. Other AI tools may read it. It costs nothing. |
| 11 | AI search bots | Allow them in `robots.txt` **and** check Cloudflare’s AI bot setting (section 14). | A Cloudflare setting can block bots before robots.txt is read. |
| 12 | Brand logos | Built behind a kill switch, off by default until the owner confirms. | Trademark and takedown risk (section 11). |
| 13 | FAQ markup | Keep `FAQPage` JSON-LD but never rely on it. FAQ text must be visible in HTML. | Google limits FAQ rich results to a few site types. It still helps Bing and AI tools. |
| 14 | FAQ UI | Native `<details>/<summary>`, **not** an accordion that removes closed content from the HTML. | Collapsed content must stay in the HTML so it can be indexed. |

---

## 2. Verified rules this spec is built on

| Source | What it says (checked November 2026) | What we do |
|---|---|---|
| Google, *AI features and your website* (developers.google.com/search/docs/appearance/ai-features) | A page must be indexed and eligible for a snippet. There are no additional technical requirements for AI Overviews / AI Mode. | Standard SEO is the whole plan. |
| Google, *Optimizing your website for generative AI features* (developers.google.com/search/docs/fundamentals/ai-optimization-guide) | AEO and GEO are still SEO. `llms.txt`, “chunking”, and special schema are not needed. No special markup is required. | Do not invest in AI-only tricks. Spend effort on clear, helpful, accurate pages. |
| Google blog, June 3, 2026 | A new Search Console control for generative AI features is being tested (UK first). | Check Search Console for the toggle after launch and keep it enabled. |
| Google, *Merchant listing structured data* | Product + Offer needs price, currency, availability. The price in markup must match the visible price. Multiple currencies may use multiple `Offer`s. | One PKR `Offer` per priced plan, matching the visible PKR price. |
| Google, *How Google crawls locale-adaptive pages* | Googlebot crawls mostly from US IPs, without `Accept-Language`. If content changes by visitor location, other locales may not be indexed. Separate URLs with hreflang are recommended. | No server-side IP switching. Same URL, same HTML, PKR default. |
| Next.js docs, *Static exports* | Unsupported: rewrites, redirects, headers, middleware, cookies, API routes, ISR. Image optimisation needs a custom loader or `unoptimized`. | Redirects and headers go in Cloudflare files. Pre-optimise images at build. |
| Cloudflare docs, *Block AI bots* | New domains get updated AI-bot defaults from Sept 15, 2026: Search stays allowed; Training and Agent bots may be blocked on pages with ads. Settings are at Security → Configure AI bot policies. | Set Search = Allow. Check logs for 200 responses to search bots. |
| HackerNoon case study (anecdotal) | A CDN setting returned 403 to AI crawlers even though robots.txt allowed them. | Test with curl using bot user-agents after deploy. |
| Core Web Vitals (web.dev/vitals) | Good = LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile. | Budgets in section 15. |
| State Bank of Pakistan, via ARY News, Nov 3 and 11, 2026 | Interbank USD closed about Rs 276.6–276.7. | `PKR_PER_USD = 280` (buffer for open-market spread; open market selling was about Rs 279.85 on Nov 21, 2026). |

Also read once before launch: Google Search Central *Sitemaps*, *Canonicalization*, *robots.txt*, *Breadcrumb*, *Organization*, *FAQPage* pages; Cloudflare Pages *Redirects* and *Headers* docs (check current limits; we use 52 redirects, well below them); Bing Webmaster *IndexNow*.

---

## 3. Stack, project structure, commands

**Stack:** Next.js latest (App Router, static export), React Server Components by default, TypeScript, Tailwind CSS latest (design tokens in `@theme`), shadcn/ui (copy components in; only the ones listed below), `lucide-react`, **pnpm**. Dev-only: `sharp`, `satori` + `@resvg/resvg-js` (image generation), `zod` (data validation).

```
pakaitools/
├─ app/
│  ├─ layout.tsx                 # html lang="en"; header, footer, tab bar, WhatsApp FAB
│  ├─ page.tsx                   # home
│  ├─ categories/page.tsx
│  ├─ [category]/page.tsx        # generateStaticParams from data/categories.json
│  ├─ [category]/[brand]/page.tsx# only multi-plan brands (44)
│  ├─ product/[slug]/page.tsx    # 179 pages
│  ├─ price-list/page.tsx
│  ├─ payment-methods/ refund-warranty-policy/ about/ contact/ privacy-policy/ terms/
│  ├─ not-found.tsx              # becomes 404.html
│  ├─ sitemap.ts  robots.ts      # export const dynamic = 'force-static'
├─ components/ (ui/ = shadcn)    # PlanRow, BrandCard, CategoryCard, BuyCard, StickyOrderBar,
│                                # CurrencyToggle, PriceText, WhatsAppFab, Breadcrumbs, Faq, JsonLd
├─ data/                         # JSON from this package (do not hand-edit text)
├─ lib/ (site.config.ts, money.ts, whatsapp.ts, schema.ts, content.ts)
├─ public/ (_redirects _headers robots? favicon.ico icons/ brands/ og/ manifest.webmanifest)
├─ scripts/ (validate.ts, gen-plan-images.ts, gen-sitemap-dates.ts)
└─ next.config.ts                # output:'export', trailingSlash:true, images:{unoptimized:true}
```

**Commands:** `pnpm dev`, `pnpm validate`, `pnpm build` (runs validate, generates images, builds `out/`), `pnpm preview`.

**`lib/site.config.ts` (the only place these values live):**

```ts
export const SITE = {
  domain: 'https://pakaitools.store',
  name: 'PakAITools',
  founder: 'Moheez Kiani',
  whatsapp: '923219305619', whatsappDisplay: '+92 321 9305619',
  email: 'support@aitoolspak.com',
  pkrPerUsd: 280,                 // update monthly, or when the market moves > 2%
  rateDate: '2026-11-22',
  pricesReviewedOn: '2026-11-22', // edit only when prices were really reviewed
  priceValidUntil: '2027-12-31',
  showBrandLogos: false,          // kill switch (section 11)
  deliveryText: 'Within 15 minutes after payment verification',
}
```

---

## 4. Data and catalogue rules

1. **Render catalogue text exactly as written**: titles, meta descriptions, H1, answer paragraph, quick facts, `contentMarkdown`, FAQs, trust block. No shortening, no ellipsis. (The preview template shortened some text for space. Never copy that into production.)
2. **Facts must match everywhere**: price, duration, warranty, delivery must be identical in the quick facts table, body text, FAQ, comparison table and JSON-LD. Generate JSON-LD from the same data fields that render the page, so they cannot drift.
3. **Schema from data, not from the pasted blocks.** Use the `schema` objects in the JSON as a reference only. Rebuild with `lib/schema.ts` so URLs, currency and dates are consistent.
4. **Statuses** (from `06_url_map_and_redirects.csv`):
   - `index` → generate page, include in sitemap.
   - `301-redirect` → no page; line in `_redirects`; row on brand hub.
   - `noindex,follow (unlisted)` and `do-not-publish` → never generated, never linked, never in the sitemap. (8 + 31 products.)
5. **Brand names:** `data` has long product-style names for some brands. Create `data/brands.json` with `slug`, `displayName`, `logo`, `priority`. Shorten these names for cards (keep the full name inside the plan page):

7 names are longer than 26 characters:

- Grok + Grok Bot + Cursor + X Premium (4-in-1 Bundle)
- Proton Unlimited (All-in-One Swiss Privacy Suite)
- Xbox Game Pass Ultimate (PC Edition)
- Autodesk All Apps (68 Applications)
- Private Internet Access (PIA VPN)
- ProxyScrape Residential Proxies
- Apple Music Activation Link

6. **Empty-hub plans** (single-plan brands): `brandSlug` = slug of the first words before “ – ”. They get no hub page (decision 4).
7. **Validation (`scripts/validate.ts`) must fail the build on:** duplicate slugs or titles; missing title/description; title over 60 or description over 160 characters; any internal link to a URL that is not generated; a plan with no category; empty required fields; any `[` placeholder or `…` truncation left in output HTML; JSON-LD that does not parse; a priced `Offer` without `price`; a price in schema that differs from the visible PKR price; a page with more or fewer than one `<h1>`.
8. **`data-issues.md`**: list every plan whose duration, warranty or answer field is empty or looks cut off. Do not invent text.

---

## 5. URL inventory (all with trailing slash, no hash routes)

| URL | Count | Notes |
|---|--:|---|
| `/` | 1 | Home |
| `/categories/` | 1 | All 15 categories |
| `/{category}/` | 15 | See section 6 |
| `/{category}/{brand}/` | 44 | Brands with 2+ plans only |
| `/product/{slug}/` | 179 | Slugs unchanged from the catalogue |
| `/price-list/` | 1 | Reads `?q=` on load |
| `/payment-methods/`, `/refund-warranty-policy/`, `/about/`, `/contact/`, `/privacy-policy/`, `/terms/` | 6 | Text in `site_pages.json` |
| `/blog/` | 1 | Blog index (paginated at 24 posts: `/blog/page/2/`) |
| `/blog/{slug}/` | 55 planned (16 first) | Guides, comparisons, how-tos, roundups. See file 09. Do not link a post until it is published |
| `/404.html` | 1 | Real 404 status from the host |

`public/_redirects` is generated from `redirects.json` (52 lines, status 301). Old merged product URLs go to their brand hub.

---

## 6. Categories: order, icons, counts

**Order rule:** most important and most searched first, **AI APIs last**. Re-order later from Search Console impressions by editing `order` in `data/categories.json` only.

| # | Category (order on site) | URL | Lucide icon | Tint | Brands | Plans | Own pages | Merged rows | Card subtitle (curate) |
| :-- | :-- | :-- | :-- | :-- | --: | --: | --: | --: | :-- |
| 1 | AI Chatbots & Assistants | `/ai-chatbots/` | `Sparkles` | blue | 9 | 18 | 14 | 4 | ChatGPT, Google Gemini AI Plus, Grok Plus, Kimi AI, Manus AI Pro |
| 2 | Design & Creative | `/design-creative/` | `Palette` | amber | 6 | 17 | 16 | 1 | Adobe Creative Cloud, Canva Pro, Autodesk All Apps, Figma, Meitu |
| 3 | Video Editing | `/video-editing/` | `Film` | rose | 3 | 11 | 7 | 4 | CapCut, Wink, Alight Motion Premium |
| 4 | Streaming & Entertainment | `/streaming/` | `Tv` | red | 18 | 28 | 28 | 0 | Amazon Prime Video, FPT Play, Galaxy Play, iQIYI Premium VIP, Netflix |
| 5 | VPN & Privacy | `/vpn-privacy/` | `ShieldCheck` | green | 11 | 22 | 20 | 2 | ExpressVPN, HMA VPN, Hotspot Shield VPN Premium, NordVPN, Private Internet Access |
| 6 | AI Video & Image Generation | `/ai-video-image/` | `WandSparkles` | violet | 8 | 21 | 17 | 4 | Dreamina AI, Higgsfield Genjutsu, Kling AI, Muse Video API, OpenArt AI |
| 7 | AI Voice & Audio | `/ai-voice-audio/` | `AudioLines` | pink | 3 | 12 | 9 | 3 | ElevenLabs, MiniMax Voice, Suno AI |
| 8 | Online Learning & Education | `/education/` | `GraduationCap` | sky | 8 | 12 | 12 | 0 | Coursera Premium, Duolingo, Kahoot!+ Gold, Quizlet, Skillshare Membership |
| 9 | Productivity & Business Software | `/productivity-software/` | `Briefcase` | teal | 8 | 15 | 15 | 0 | Gamma AI, LinkedIn Premium Career, Notion, Zoom, Microsoft 365 + Copilot |
| 10 | Developer Tools & IDEs | `/developer-tools/` | `CodeXml` | emerald | 2 | 4 | 4 | 0 | JetBrains, Replit |
| 11 | Cloud Storage | `/cloud-storage/` | `Cloud` | cyan | 1 | 4 | 4 | 0 | Apple iCloud+ |
| 12 | Antivirus & Cybersecurity | `/antivirus/` | `ShieldAlert` | orange | 1 | 3 | 3 | 0 | Kaspersky |
| 13 | Antidetect & Proxies | `/antidetect-proxies/` | `Fingerprint` | slate | 2 | 5 | 5 | 0 | GPM Login |
| 14 | Travel & eSIMs | `/esim/` | `Smartphone` | indigo | 1 | 5 | 5 | 0 | Pakistan eSIM |
| 15 | AI APIs | `/ai-apis/` | `Webhook` | gray | 6 | 54 | 20 | 34 | Claude API, Cursor API, Chinese Models API, DeepSeek API, Grok API |
| | **Total** | | | | **87** | **231** | **179** | **52** | |

**How counts are calculated (one rule everywhere):**
- *Brands* = brand hubs with 2+ plans, plus single-plan brands.
- *Plans* = every orderable plan in that category, including merged plans that live on a hub.
- *Own pages* = plans that have their own product page.
- Counts are computed at build time from the same data that creates the pages, so a card can never disagree with its page. Card text: `9 brands · 18 plans`. AI APIs shows 54 plans because 34 are rows on hubs; its page explains that.
- Total check: 15 categories · 87 brands · 231 plans · 179 product pages · 52 merged rows.

**Category card design (match the owner’s screenshot):** rounded-2xl card with a soft tinted background (stronger tint in dark mode), a 64 px rounded-xl icon tile in the same tint, the category name (semibold, ~24 px), and below it a muted line with the top 5 brand names. Add `brands · plans` as a small chip. Whole card is one link (min 44 px target). Icon is decorative (`aria-hidden`); the name is the link text.

Lucide names must be checked against the installed version of `lucide-react` (rename if one is missing, keep the meaning).

---

## 7. Page specifications

### 7.1 Home (`/`)
Order: **header** (logo, top 6 categories, Price list, currency toggle) → **hero** (H1 from `site_pages.json`, answer paragraph, search box, primary button “Browse all plans” → `/price-list/`, secondary “Ask on WhatsApp”) → trust chips (Pay in PKR · Delivery in 15 minutes · Warranty shown before you pay) → **category grid** (15 cards, order from section 6) → **Popular plans** (8–12 rows: Canva Pro 1 Year, Adobe Creative Cloud Pro 4 Months, ChatGPT Plus, Netflix, Spotify, CapCut, Duolingo, ExpressVPN, …) → **Top picks by category** (up to 3 plans per category with a “See all {category}” link) → how ordering works (3 steps) → payment methods → 5 FAQs → footer.
Do **not** list all 231 plans on the home page.

### 7.2 All categories (`/categories/`)
H1, short intro, the 15 category cards, link to price list.

### 7.3 Category page (`/{category}/`)
Breadcrumb → H1 `{Category} Price in Pakistan` → answer paragraph (from `hubs.json`) → **brand grid** → short “How to choose” text → 3 FAQs → related guide link → trust notice.
**Brand card rules (fixes the screenshot problem):**
- Multi-plan brand: logo/initials tile, brand name, `N plans · from Rs. X`. Links to `/{category}/{brand}/`.
- Single-plan brand: same card layout, brand name only, text `1 plan`. **No duration, price, warranty or long product name on the card.** Links straight to `/product/{slug}/`.
- Card order inside a category: by `priority` in `brands.json`, default plan count then catalogue order.

### 7.4 Brand hub (`/{category}/{brand}/`, 44 pages)
Breadcrumb → H1 → intro (answer paragraph) → **plan comparison table** (plan, duration, warranty, price, button). Rows with an own page: “View plan” (link). Merged rows: “Order on WhatsApp” (pre-filled message). On phones, each row is a stacked card. → “How to choose” paragraph → 4–5 FAQs → related brands (2–3) → category link → guide link → trust notice.
`ItemList` JSON-LD of the plans that have pages. No `Product` markup on hubs.

### 7.5 Product page (`/product/{slug}/`, 179 pages)
**Phone order (this fixes the “order button too far down” problem):**
1. Breadcrumb (on phones: single “‹ Back to {parent}” link plus full breadcrumb in HTML)
2. H1
3. Answer-first paragraph
4. **Buy card, directly after the answer:** price (PKR/USD), 5 key facts (duration, warranty, account type, delivery, payment), **primary button “Order on WhatsApp”**, secondary “Compare all {brand} plans” (only if the brand has a hub)
5. Catalogue sections in this order: What you get → How it works → Who is this for → Price in Pakistan → Payment methods (short) → Warranty → Comparison table → Important requirements
6. **Second order button** (full width) right after the details
7. FAQ (native `<details>`, all content in HTML)
8. Related plans (3)
9. Trust notice + last updated
10. **Sticky order bar** (see 8.2) appears once the buy card scrolls out of view

**Desktop:** two columns. Left column holds items 2–3 and 5–9. Right column holds the buy card, sticky below the header.

### 7.6 Price list (`/price-list/`)
H1, intro, category jump links, search box and category filter (JS enhancement), then **all 231 plans grouped by category in plain HTML**. Reads `?q=` on load (needed for the `SearchAction`). Own-page plans link to their page; merged plans link to the brand hub. Show “Prices last reviewed on {date}”. The list must be fully visible with JavaScript off.

### 7.7 Trust pages
Render `site_pages.json` content. Footer links to all six on every page. Contact page includes `ContactPage` schema; About includes `AboutPage` and founder.

### 7.8 404
Friendly message, search box, links to price list and categories. Real 404 status (Cloudflare Pages serves `404.html` with 404).

---

## 8. Mobile setup (checked line by line)

### 8.1 Rules
- `viewport-fit=cover`; all fixed bars add `env(safe-area-inset-*)`. Use `dvh`, never `100vh`.
- Body bottom padding = tab bar + sticky bar height + safe area, so nothing is hidden.
- No horizontal scroll at 320 px. Tables scroll inside their own container; plan lists become cards under 640 px.
- Inputs use 16 px text (prevents iOS zoom). Tap targets ≥ 44 × 44 px with ≥ 8 px gaps.
- Bottom **tab bar** (Home · Categories · Prices · Support) on phones only; top nav on ≥ 768 px.
- Z-index scale: header 30 · tab bar 30 · sticky order bar 35 · WhatsApp button 36 · dialogs 50.

### 8.2 Sticky order bar (product pages, phones)
Height 64 px, sits **above** the tab bar. Shows short plan name, price, and the **Order on WhatsApp** button. It appears only when the in-page buy card is off screen (IntersectionObserver) and never covers the footer or form fields.

### 8.3 WhatsApp button (bottom right, all pages)
- 56 px circle, green `#128C7E` with white icon (passes contrast), `aria-label="Chat with PakAITools on WhatsApp"`.
- Position: `right: 16px; bottom: calc(tab bar height + env(safe-area-inset-bottom) + 16px)`.
- On product pages **on phones**, lift it above the sticky order bar (bottom + 72 px) so the two never overlap. If both are visible and space is tight, hide the round button, because the sticky bar already opens WhatsApp.
- Links to `https://wa.me/923219305619?text=…` with the pre-filled message (Appendix B). Opens in a new tab with `rel="noopener"`.

### 8.4 Phone QA checklist (run on 360×640, 390×844, 412×915, 768×1024)
Order button visible without scrolling past related plans · sticky bar does not hide content · FAB does not cover any button · header does not wrap · tables scroll · dark mode readable · keyboard does not hide search · pull-to-refresh and back button work · text zoom 200% still usable · landscape OK.

---

## 9. Currency: PKR and USD

**Behaviour**
1. HTML always renders **PKR** (build time). This is what Google indexes.
2. After the page loads, the browser decides the currency:
   a. If the user chose a currency before (`localStorage` key `pat_currency`), use it.
   b. Otherwise `fetch('/cdn-cgi/trace')` (served by Cloudflare on the proxied domain), read `loc=`. `PK` → PKR. Any other country → USD.
   c. If detection fails, use the timezone: `Asia/Karachi` → PKR; otherwise stay PKR. Never guess USD on failure.
3. **Top-right toggle** `PKR | USD` (shadcn `ToggleGroup`, `aria-label="Currency"`, 44 px targets). Choosing a value saves it and overrides detection. Announce the change in an `aria-live` region.
4. Every price is rendered by one `<PriceText>` component. It outputs the PKR value in a `data-pkr` attribute.

**Display rules**
- USD = `ceil(pkr / pkrPerUsd × 100) / 100`, shown as `$3.49`.
- Show both currencies: the chosen one large, the other small beneath (`≈ Rs. 1,300`). **PKR stays in the DOM for every visitor.**
- Under prices on product pages: “USD is approximate at Rs 280 = $1 (rate set {rateDate}). The final amount is confirmed on WhatsApp.”
- USD users see **Binance** first in the payment methods text.
- Live-quote plans show “Live quote” in both currencies.
- Reserve the width of price elements to avoid layout shift.

**SEO safety (non-negotiable)**
- One URL per page. No redirect, no cookie-based content, no `?currency=` URL, no hreflang for currency.
- Title, meta, schema and canonical never change with currency.
- Schema price is PKR only and equals the PKR price visible in the HTML.
- After launch, test in Search Console → URL Inspection → *View crawled page*: PKR prices must be present.

---

## 10. WhatsApp message templates

See Appendix B. Build with `lib/whatsapp.ts`; always `encodeURIComponent`. Messages include the plan name, the price shown to the visitor, duration and page URL. USD visitors add “Paying by Binance”.

---

## 11. Logos and icons

**PakAITools logo (provided by owner).** Use exactly as supplied (cropped to a square, no recolouring). Files are in `assets/brand/`:

| File | Use |
|---|---|
| `logo-96.webp` / `logo-192.webp` | Header logo (display 36 px, serve 96) |
| `logo-512.webp`, `logo-512.png` | `Organization.logo`, structured data, large uses |
| `favicon.ico` (16/32/48), `favicon-32.png`, `favicon-48.png`, `favicon-96.png` | Favicons. Google wants a square multiple of 48 px |
| `apple-touch-icon.png` (180) | iOS home screen |
| `logo-192.png`, `logo-512.png` | `manifest.webmanifest` icons |
| `og-default.png` (1200×630) | Default Open Graph / Twitter image |

Header: logo image (alt empty, the visible word “PakAITools” is the label) + name. Add `<link rel="icon" href="/favicon.ico" sizes="48x48">`, PNG icons, `apple-touch-icon`, and `manifest.webmanifest` with `theme_color`.

**Category icons:** Lucide icons from section 6, inline SVG through `lucide-react`. Icons never replace text.

**Brand logos (“a logo for each product”).**
- Status: the logo zip was **not received**. The owner uploaded one picture sheet (85 logos, 128×128). Individual files are needed.
- Risk, in plain words: these are other companies’ trademarks taken from their sites and app stores. Brands such as Adobe, Netflix, Spotify, Apple, Microsoft, Google/YouTube, Amazon, HBO, Paramount, Canva, Zoom and LinkedIn report misuse, and a report can remove pages or hurt the domain. Not legal advice.
- Build it safely: `SITE.showBrandLogos` (default `false`). When `false`, every brand shows an initials tile (as in the template). When `true`, show logos.
- If enabled: files in `public/brands/{brand-slug}.webp`, 128×128 WebP, self-hosted, same white rounded box with padding, `alt=""` (brand name is already text), `width`/`height` set, lazy-loaded. Allowed only on category cards, brand cards, price-list rows and a small icon on the product header. **Never** in schema, Open Graph, favicon, hero or banners.
- Footer line when enabled: “Brand names and logos belong to their owners. PakAITools is an independent reseller and is not affiliated with them.”
- Remove any logo immediately if a brand asks. The four PakAITools-made tiles (AI Suite, APIs, AI Bundle, PK eSIM) have no risk and can always be used.

**Own plan images.** Product schema needs an image. Generate one **per plan** at build (`scripts/gen-plan-images.ts`, `satori` + `@resvg/resvg-js`, bundled font): 1200×630, PakAITools logo, plan name, duration, “Price in Pakistan”, brand-colour background. No third-party logos. Save as `public/og/{slug}.png` and WebP. Use it for `og:image`, `twitter:image` and `Product.image`.

---

## 12. Design system (from `ui-ux.md`)

- **Tokens:** define colors, sizes, spacing, radii, shadows, motion as CSS variables in `globals.css` and map them in Tailwind `@theme`. Never hard-code a value in a component.
- **Colors by role:** `--color-text-primary/secondary/tertiary`, `--color-bg-primary/secondary/tertiary`, `--color-accent` (deep teal `#0a6b5b` light, `#4cc9b0` dark), `--color-separator`, `--color-success/warning/danger`. Text contrast ≥ 4.5:1. Light and dark both required, following the system setting with a manual toggle (sun icon in dark mode, **moon icon in light mode**).
- **Type:** system font stack (`-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, "Segoe UI", Roboto, sans-serif`). No webfont downloads. Sizes in `rem`. Body 17 px, minimum 15 px for secondary text.
- **Spacing:** 4-pt scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64).
- **Radii:** 8 / 12 / 16 / 22 px. **Depth:** subtle shadow and translucent header only; plain fallback when transparency is reduced.
- **One primary button per screen** (filled accent). Secondary = tinted. Tertiary = text.
- **Motion:** ≤ 220 ms, press scale 0.97, respect `prefers-reduced-motion`.
- **shadcn components to add:** `button`, `card`, `badge`, `input`, `select`, `toggle-group`, `sheet` (mobile menu), `separator`. **Do not use** the shadcn Accordion or Tabs for content. Use native `<details>` and plain sections.
- **Header:** logo, 6 category links (most important first), Price list, **Blog**, currency toggle (top right), theme toggle.
- **Footer:** categories (all 15), trust pages (6), price list, contact, “independent reseller” notice, founder line.
- **Accessibility:** skip link, one `<h1>` per page, visible focus rings, `aria-current` on active nav, labelled forms, status messages in `aria-live`, no color-only meaning, works at 200% zoom and with keyboard only, `lang="en"`.

---

## 13. SEO specification

### 13.1 Every page
Unique `<title>` (≤ 60) and meta description (≤ 160); self-referencing canonical with trailing slash; one `<h1>`; `lang="en"`; Open Graph and Twitter tags (`summary_large_image`); favicon links; visible breadcrumbs plus `BreadcrumbList`; `Organization` JSON-LD (name, url, logo 512, `contactPoint` with the WhatsApp number and email, founder Moheez Kiani); footer notice “independent reseller, not affiliated with the brands”.
Never output: `aggregateRating`, `review`, fake order counts, “official”, “100% safe”.

### 13.2 JSON-LD by page type
| Page | Types |
|---|---|
| Home | `WebSite` (+ `SearchAction` → `/price-list/?q={search_term_string}`), `Organization` |
| Category | `CollectionPage`, `BreadcrumbList`, `ItemList` (brands) |
| Brand hub | `CollectionPage`, `BreadcrumbList`, `ItemList` (plans with pages), `FAQPage` |
| Product (priced) | `Product` + `Offer`, `BreadcrumbList`, `FAQPage` |
| Product (quote-only) | `WebPage`, `BreadcrumbList`, `FAQPage` (no `Offer`) |
| Price list | `CollectionPage`, `BreadcrumbList` |
| Blog index | `CollectionPage`, `BreadcrumbList`, `ItemList` |
| Blog post | `BlogPosting`, `BreadcrumbList`, `FAQPage` (no Product, Review or rating) |
| Contact / About | `ContactPage` / `AboutPage`, `BreadcrumbList` |

Priced product example (rebuild from data, never paste):

```json
{ "@context":"https://schema.org","@graph":[
 { "@type":"Product","name":"Canva Pro – 1 Year","description":"…from data…",
   "image":"https://pakaitools.store/og/canva-pro-1-year.png","sku":"PAT-CANVA-1Y",
   "brand":{"@type":"Brand","name":"Canva"},
   "offers":{"@type":"Offer","url":"https://pakaitools.store/product/canva-pro-1-year/",
     "priceCurrency":"PKR","price":"1300","priceValidUntil":"2027-12-31",
     "availability":"https://schema.org/InStock","itemCondition":"https://schema.org/NewCondition",
     "seller":{"@type":"Organization","name":"PakAITools"},
     "hasMerchantReturnPolicy":{"@type":"MerchantReturnPolicy","url":"https://pakaitools.store/refund-warranty-policy/"}}},
 { "@type":"BreadcrumbList","itemListElement":[…] }, { "@type":"FAQPage","mainEntity":[…] } ] }
```

`availability`: `InStock` for normal plans. For made-to-order plans use the value that passes Google’s Rich Results Test; if `MadeToOrder` warns, use `PreOrder`.

### 13.3 Internal linking
Every link is a real `<a href="/path/">` (use `next/link`). Chain: Home → Categories → Category → Brand hub → Plan. Each plan links up (hub or category), sideways (3 related plans) and to its category guide. Footer links all categories and all six trust pages. No orphan pages (validation checks it). Descriptive link text, not “click here”.

### 13.4 Content and keyword rules
- Use the catalogue’s titles, H1s and keyword placement. The primary keyword sits in title, H1, first paragraph, one H2 and image alt.
- Brand hubs target the broad term (“Canva Pro price in Pakistan”). Plan pages target the duration term (“Canva Pro 1 year price in Pakistan”). No two pages share a primary keyword.
- Hub and category pages need real text (not just lists): answer paragraph, how to choose, FAQs.
- **Blog posts never use “price in Pakistan” as their primary keyword.** Buy and price intent belongs to product and hub pages; compare, decide and learn intent belongs to the blog (file 09, section B1).
- Write unique copy for the top 25 products first (list in `CONTENT-TODO.md`).

### 13.5 Crawl and index files
- **`sitemap.xml`** (or an index): only `index` URLs. `lastmod` = real data-change date. Under 50,000 URLs (we have about 262 incl. guides and utility pages).
- **`robots.txt`:** see Appendix C. Block only `/cart/`, `/checkout/`, `/search`, sort/filter parameters.
- **Status codes:** 200 for pages, 301 for merged plans, real 404 for unknown URLs. No soft 404s.
- **Rendering:** all content in the initial HTML. Run `curl` on a page and confirm the H1, price, FAQ text and JSON-LD are present.
- **Images:** WebP, explicit `width`/`height`, descriptive file names and alt text (from the catalogue keyword map), lazy-load below the fold, preload only the logo.
- **`llms.txt`:** optional short file listing key URLs. Not required by Google.
- **IndexNow (optional):** key file at the site root and a post-deploy ping for new or changed URLs. Helps Bing and others, not Google.

---

## 14. AEO and GEO (answer engines and AI search)

Google states these are “still SEO”, so the work is quality and clarity:
1. **Answer first.** Each page opens with a 40–60 word answer with price, duration and warranty (already in the catalogue).
2. **Tables for facts.** Quick facts and comparison tables are real HTML tables.
3. **Visible FAQs** with direct 30–50 word answers, including Roman Urdu questions.
4. **Entity consistency.** Same name “PakAITools”, same founder, WhatsApp, email on every page and in `Organization` schema.
5. **Freshness that is true:** show “Prices last reviewed on …” only when the owner updates it.
6. **Original information:** warranty, replacement and refund rules, PKR pricing and local payment methods are the unique value. Keep them accurate and easy to find.
7. **AI crawler access (important):**
   - `robots.txt` explicitly allows `Googlebot`, `Bingbot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User` (Appendix C). Training bots (`GPTBot`, `Google-Extended`, `CCBot`) are the owner’s choice; the default here is allow.
   - In **Cloudflare → Security → Configure AI bot policies**, set **Search = Allow**. Do not enable “Block AI bots” for search crawlers. Check again after Sept 15, 2026 defaults.
   - After deploy, test: `curl -A "OAI-SearchBot" -I https://pakaitools.store/` and the same for `PerplexityBot`, `ClaudeBot`, `Googlebot`. Each must return **200**.
8. In Search Console, look for the generative AI control and keep the site included.
9. Be honest: never claim “official”, never invent reviews or guarantees. The independent-reseller notice stays on every page.

---

## 15. Performance and quality targets

| Metric (mobile, 75th percentile) | Target |
|---|---|
| LCP | ≤ 2.5 s (aim 1.8 s) |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 (aim 0.02) |
| Lighthouse | Performance ≥ 90 · Accessibility ≥ 95 · Best Practices ≥ 95 · SEO 100 |

How: server components by default; client JavaScript only for the currency toggle, theme toggle, price-list search, sticky bar and the WhatsApp links; each page loads only its own data; a small `search-index.json` is fetched only when the search box gets focus; no third-party scripts (use Cloudflare Web Analytics if analytics are wanted); system fonts; WebP images ≤ 100 KB; long cache for hashed assets; hero is text, not an image; no layout-shifting banners.
Page-size budget: HTML ≤ 60 KB, JS ≤ 120 KB gzip per page, CSS ≤ 30 KB.

---

## 16. Security headers and caching (`public/_headers`)

See Appendix C. Static export needs inline scripts for hydration, so CSP uses `'unsafe-inline'` for scripts unless you add a post-build step that hashes them. Set HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, long immutable cache for `/_next/static/*`, short cache for HTML.

---

## 17. Validation, testing and acceptance

**Automated (`pnpm validate` + CI):** all rules in section 4.7; JSON-LD parses; every sitemap URL returns a built file; no `noindex` page in the sitemap; counts match section 6 (15 / 87 / 231 / 179 / 52).
**Manual before launch:** Rich Results Test on 5 product pages, 2 hubs and the home page; PageSpeed Insights on 5 pages (mobile); phone checklist (8.4); keyboard-only run; dark mode run; currency toggle run (PK and non-PK); `curl` bot test (section 14); crawl with Screaming Frog free (0 broken links, 0 orphans, 0 duplicate titles).

**Acceptance = all true:** every URL in section 5 exists · 52 redirects work · no `[` or `…` in output · prices match schema · only one H1 per page · logo shows in header and as favicon · WhatsApp button and sticky bar never overlap · category order and counts match section 6 · single-plan brand cards show no plan details · site works with JavaScript off (except search, currency, theme).

---

## 18. Deployment and launch (Cloudflare Pages, free)

1. Push the project to GitHub. In Cloudflare → Workers & Pages → Create → Pages → connect the repo. Build command `pnpm build`, output directory `out`. Set Node version via `NODE_VERSION`.
2. Add the custom domain `pakaitools.store`. Choose **one** host (non-www) and redirect `www` to it. Turn on **Always Use HTTPS** and HSTS.
3. Cloudflare → Security → AI bot policies: **Search = Allow** (section 14).
4. Verify the domain in **Google Search Console** (DNS record) and **Bing Webmaster Tools**. Submit `https://pakaitools.store/sitemap.xml`.
5. URL Inspection → *Request indexing* for the home page, `/price-list/`, `/categories/` and the top 10 brand hubs.
6. Run the Rich Results Test and PageSpeed Insights.
7. Publish remaining content in steps: guides 2–4 per week.

**After launch:** 3 days (Pages report: indexed vs “Discovered, not indexed”; fix errors) · 2 weeks (queries and impressions; adjust titles for pages with impressions but low clicks) · 6 weeks (Core Web Vitals report, category order from real clicks, add reviews only if genuine). Re-check the AI-bot test monthly.

---

## 19. Content to-do (for the owner and writer)

1. Hand-write unique intros and “how to choose” text for the top brand hubs: Adobe, Canva, ChatGPT, CapCut, Netflix, Spotify, ExpressVPN, Duolingo, Notion, Claude API.
2. Write the blog posts in the order given in `09_BLOG_SECTION_SPEC_AND_CONTENT_PLAN.md` (wave 1 = 15 category buying guides + 1 payment guide). Titles follow `How to Choose {Category} in Pakistan (2026): A Buying Guide`.
3. Fill `CONTENT-TODO.md` for the top 25 products with: answer paragraph, what you get, how activation works, requirements, who it’s for, FAQ.
4. Collect real customer reviews (with permission) and add them as visible content before adding any rating markup.
5. Confirm open owner items: delivery exceptions (6 pages keep longer times), Binance details process, support hours, whether to show brand logos.

---

## 20. Risks and rules the build must respect

- 31 products are on **hold** (fake followers/views/likes/subscribers, bulk or cookie-format accounts) and 8 are **unlisted** (TikTok coins, Bigo diamonds, Windows keys, Locket DNS). They are never built, linked or put in the sitemap.
- The site is an independent reseller. No page may say or imply an official partnership.
- Refund and warranty wording must match `site_pages.json` and each product page.
- Legal pages were drafted for the owner and should be reviewed by a lawyer.

---

## 21. Build order

1. Scaffold (`pnpm create next-app`, Tailwind, shadcn init, lucide), config, tokens, layout, header/footer/tab bar.
2. Data loaders and `validate.ts` (fail early).
3. Components: `PriceText`, `CurrencyToggle`, `WhatsAppFab`, `StickyOrderBar`, cards, tables, `Faq`, `JsonLd`.
4. Pages: product → brand hub → category → home → price list → trust pages → blog index and post template → 404.
5. Generated files: sitemap, robots, `_redirects`, `_headers`, manifest, plan images.
6. Performance and accessibility pass, phone checklist.
7. Deploy to a preview URL, run section 17, then go live.
8. Launch steps (section 18).

---

## 22. Blog and comparisons section (summary; full spec in file 09)

- **Routes:** `/blog/` (index) and `/blog/{slug}/` (posts). Content lives in `content/blog/*.mdx`, rendered to static HTML at build.
- **Types:** guide, comparison, how-to, roundup, each with a fixed template, minimum length, answer box, comparison table, FAQ, sources and disclosure.
- **Auto-accurate numbers:** shortcodes `<Price>`, `<PlanCard>`, `<CompareTable>` read prices, durations and warranties from `data/`, so blog posts never show stale prices and always match the product pages.
- **Linking:** each post links to 1 category page and 2+ plans or hubs. Each category page and brand hub shows a “Guides and comparisons” block (up to 3 posts). Header, footer and home page link to the blog.
- **Schema:** `BlogPosting`, `BreadcrumbList`, `FAQPage`. No `Product`, `Review` or ratings on comparisons.
- **Validation:** `pnpm validate` also checks posts (section B7 of file 09): lengths, answer box, links, unique primary keyword, no “official”, no rating markup, existing plan slugs.
- **Plan:** 55 posts in 3 waves, 2–4 per week. The first posts are payment, trust and category buying guides; then comparisons of best-selling brands. Four comparisons use only our own plan data and can go live at once (C02, C03, C19, C20).

---

## Appendix A — Brands per category (counts are exact)

See the table in section 6. Source: `data/categories.json`.

## Appendix B — WhatsApp messages

```
General (floating button):
Hi PakAITools 👋 I need help choosing a plan.
Page: {page_url}

Product / plan row:
Hi PakAITools 👋 I want to order:
• Plan: {plan_name}
• Price: {price_shown} ({duration})
• Page: {page_url}
Payment method: ____

Live-quote plan:
Hi PakAITools 👋 Please share today's price for: {plan_name}
Page: {page_url}

USD visitors (add one line):
I am paying by Binance.
```

## Appendix C — Crawl and header files

**`public/robots.txt`**
```
User-agent: *
Allow: /
Disallow: /cart/
Disallow: /checkout/
Disallow: /search
Disallow: /*?sort=
Disallow: /*?filter=

User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /

Sitemap: https://pakaitools.store/sitemap.xml
```
Note: a rule for a named bot replaces the `*` group for that bot. If a named bot should also skip `/cart/` etc., repeat the `Disallow` lines inside its group.

**`public/_headers`**
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
/og/*
  Cache-Control: public, max-age=604800
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```
(`connect-src 'self'` allows `/cdn-cgi/trace`. WhatsApp links are normal links, not requests, so they need no CSP entry.)

**`public/_redirects`** (generated from `redirects.json`)
```
/product/capcut-pro-team-7-days/  /video-editing/capcut/  301
```

## Appendix D — Master prompt to give a developer or AI coding agent

> Build the website exactly as described in `00_PAKAITOOLS_WEBSITE_BUILD_SPEC.md` using the stack in `stack.md` (Next.js latest static export, Tailwind, shadcn/ui, lucide-react, pnpm). Use the JSON in `data/` as the only content source and do not rewrite catalogue text. Follow section 1 where it differs from `pakaitools-build-brief.md`. Implement sections 5–16 and 22 (blog, per `09_BLOG_SECTION_SPEC_AND_CONTENT_PLAN.md`), write `scripts/validate.ts` per section 4.7 and B7, and finish with the acceptance checklist in section 17. Do not ask the owner technical questions; record missing information in `data-issues.md`. At the end, report pages generated, pages skipped and why, assumptions, and validation results.
