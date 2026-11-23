# PakAITools — Blog Section: Specification and Content Plan

**Version 1.0 · November 22, 2026.** This file extends `00_PAKAITOOLS_WEBSITE_BUILD_SPEC.md`. Section numbers below start at B1 to avoid confusion.

## B1. Why a blog, and the one rule that protects your rankings

The blog covers **people who are still deciding** (“ChatGPT vs Claude”, “how to buy Canva Pro without a credit card”). Product and hub pages cover **people who are ready to buy** (“Canva Pro price in Pakistan”). The two must never compete for the same keyword.

| Intent | Example search | Page that owns it |
|---|---|---|
| Buy / price | “Canva Pro 1 year price in Pakistan” | Product page |
| Buy / brand | “Canva Pro price in Pakistan” | Brand hub |
| Browse | “design software price in Pakistan” | Category page |
| Compare | “Canva vs Figma”, “NordVPN vs ExpressVPN” | **Blog comparison** |
| Decide | “which VPN is best in Pakistan”, “how to choose an AI tool” | **Blog guide / roundup** |
| Learn | “how to pay for ChatGPT in Pakistan” | **Blog how-to** |

Correction to the earlier plan: category guides were first titled “{Category} Price in Pakistan…”. That would compete with the category page. They are now **“How to Choose {Category} in Pakistan (2026): A Buying Guide”** with slugs `…-buying-guide-pakistan`. All catalogue files and JSON were updated.

**Hard rules:** no blog post uses “price in Pakistan” as its primary keyword; every post has exactly one primary keyword that no other page uses; every post links to the product or hub page that sells the thing it discusses.

## B2. Post types

| Type | Job | Length | Must contain |
|---|---|--:|---|
| **Guide** | Help choose inside a category | 1,000–1,500 words | TL;DR, decision table, “who should pick what”, 5 FAQs, plan cards |
| **Comparison** | “A vs B (vs C)” | 1,200–1,800 | Verdict first, side-by-side table, one section per product, “choose A if / choose B if”, plan cards, 5 FAQs |
| **How-to** | Solve one task | 700–1,200 | Numbered steps, requirements, common mistakes, 4 FAQs |
| **Roundup** (“Best … for …”) | List and rank | 1,200–1,800 | Selection criteria, short entry per tool, table, how we picked, plan cards |

## B3. Structure and URLs

- `/blog/`: index. Lists all posts as plain links (title, 1-line summary, type, updated date). Filter chips are normal links to anchors, not a JS-only filter. Paginate at 24 posts: `/blog/page/2/` (self-canonical, linked from page 1).
- `/blog/{slug}/`: post. Slug = primary keyword, lowercase, hyphens, no date.
- Topic pages (`/blog/topic/{category}/`) only in phase 2, and only when a topic has 8+ posts. Do not publish thin topic or tag pages.
- Author: **Moheez Kiani** (or “PakAITools Team”) with a link to `/about/`. One author, so no author pages.
- Header gets a **Blog** link; footer gets Blog; the home page gets a “Guides and comparisons” block (3 latest). Every category page and brand hub gets a “Guides and comparisons” block (up to 3 posts that mention that category or brand), so posts are never orphaned and plans get internal links back.

## B4. Post page layout (phones first)

1. Breadcrumb: Home › Blog › Post title
2. H1 (one only)
3. Meta line: “By Moheez Kiani · Updated {dateModified} · {N} min read”
4. **Answer box (TL;DR), 40–60 words**: the short answer or verdict. Comparisons: “Choose A if … Choose B if …”.
5. Table of contents (anchor links) when over 1,200 words
6. Body with H2/H3 headings (each H2 phrased like a question or task where natural)
7. **Comparison table** (real HTML table, scrolls sideways on phones)
8. **Plan cards:** “Our plans for this”: plan name, PKR/USD price (live from data), duration, warranty, **Order on WhatsApp** button and “View plan” link. Two of these per post (middle and end). No sticky order bar on blog pages; the WhatsApp button stays.
9. FAQ (native `<details>`, content in the HTML)
10. Sources: outbound links to official pages used for facts, plus “Last reviewed {date}”
11. Related posts (3) and related category/hub links
12. Disclosure and trust notice (B6)

## B5. SEO for blog pages

- **Title** ≤ 60 chars, **meta description** ≤ 160, self-canonical, OG image generated per post (title on the brand background, no third-party logos), `lang="en"`.
- Title patterns: Comparison “A vs B: {angle}”; Guide “How to Choose {X} in Pakistan (2026)”; How-to “How to {task} in Pakistan”; Roundup “Best {X} for {audience} in Pakistan (2026)”. Add the year only if the post is reviewed each year.
- **JSON-LD:** `BlogPosting` (headline, description, image, author Person, publisher Organization with logo, `datePublished`, `dateModified`, `mainEntityOfPage`), `BreadcrumbList`, `FAQPage`. **Never** add `Product`, `Review`, `AggregateRating` or star ratings to a comparison.
- `dateModified` changes only when facts change. The sitemap `lastmod` uses the same date.
- **Internal links per post:** 1 category page, 2+ plan or hub pages (descriptive anchor text), 3 related posts, link to `/refund-warranty-policy/` or `/payment-methods/` where relevant.
- Images: WebP, width/height set, alt text that describes the content, lazy-load. No stock-photo padding.
- Everything is rendered to static HTML at build time from Markdown/MDX.

Sample `BlogPosting` (rebuild from frontmatter, never paste):

```json
{ "@context":"https://schema.org","@type":"BlogPosting",
  "headline":"Canva Pro 1 Month vs 1 Year in Pakistan: Which Plan Costs Less?",
  "description":"…","image":"https://pakaitools.store/og/blog/canva-pro-1-month-vs-1-year-pakistan.png",
  "author":{"@type":"Person","name":"Moheez Kiani","url":"https://pakaitools.store/about/"},
  "publisher":{"@type":"Organization","name":"PakAITools","logo":{"@type":"ImageObject","url":"https://pakaitools.store/icons/logo-512.png"}},
  "datePublished":"2026-12-01","dateModified":"2026-12-01",
  "mainEntityOfPage":"https://pakaitools.store/blog/canva-pro-1-month-vs-1-year-pakistan/" }
```

## B6. Content integrity (honesty rules)

1. **Our own numbers come from the data, not from typing.** Use shortcodes so prices, durations, warranties and “cost per month” are pulled from `data/` at build time: `<Price slug="canva-pro-1-year" />`, `<PlanCard slug="…" />`, `<CompareTable slugs={[…]} />`. When a price changes, every post updates. Live-quote plans show “Live quote”.
2. **Facts about brands (features, limits, plan names) must come from the brand’s official page**, listed under Sources with the review date. If you cannot verify a claim, leave it out. Never write “we tested” unless it is true.
3. Brand prices elsewhere change often. Write “as of {date}” or avoid exact outside prices.
4. **Disclosure line on every post:** “PakAITools is an independent reseller and sells plans for some of the products mentioned. We write comparisons to help you choose, and we are not affiliated with the brands.”
5. No ratings, scores, “winner” stars, fake reviews or invented statistics. A verdict is a recommendation with reasons.
6. Be fair to every brand. Never disparage. Never say “official”.
7. Do not mention or link held or unlisted products. Do not use brand logos in posts unless the owner enables logos (main spec section 11).
8. Review each comparison every 90 days. If a fact changed, fix it and update `dateModified`.

## B7. Content files and validation

Folder: `content/blog/{slug}.mdx`. Frontmatter:

```yaml
title: "Canva Pro 1 Month vs 1 Year in Pakistan: Which Plan Costs Less?"
description: "Compare the 1-month and 1-year Canva Pro plans in PKR: price, cost per month, warranty and who each suits."
slug: canva-pro-1-month-vs-1-year-pakistan
type: comparison            # guide | comparison | howto | roundup
primaryKeyword: canva pro 1 month vs 1 year
category: design-creative
plans: [canva-pro-1-month, canva-pro-1-year]
hubs: [design-creative/canva]
datePublished: 2026-12-01
dateModified: 2026-12-01
reviewedOn: 2026-12-01
author: Moheez Kiani
sources: [{label: "Canva Pro", url: "https://www.canva.com/pro/"}]
faq:
  - q: "…"
    a: "…"   # 30–50 words
```

`pnpm validate` must **fail the build** when a post: lacks title/description/slug; has title > 60 or description > 160; has no answer box; has fewer than 4 FAQs; links to fewer than 2 plan/hub pages or 0 category pages; links to a missing, held or unlisted page; has a primary keyword already used by another page; is under its minimum length; has a comparison without a table; references a plan slug that does not exist; has `dateModified` earlier than `datePublished`; or contains “official”, “100% safe” or any rating markup.

## B8. Content plan

Publish 2–4 posts a week. Order matters: payment and trust posts first (they help every sale), then comparisons of the best-selling brands.

### Wave 1: weeks 1–4 (16 posts: guides and payment)
| ID | Type | Slug | Working title | Links to |
| :-- | :-- | :-- | :-- | :-- |
| H03 | How-to | `buy-subscriptions-in-pakistan-without-credit-card` | How to Buy Subscriptions in Pakistan Without a Credit Card | `/payment-methods/`, price list |

Category buying guides (one per category, order as on the site):

| ID | Type | Slug | Working title | Primary intent | Links to |
| :-- | :-- | :-- | :-- | :-- | :-- |
| G01 | Guide | `ai-chatbots-buying-guide-pakistan` | How to Choose AI Chatbots & Assistants in Pakistan (2026): A Buying Guide | “how to choose / which ai chatbots plan” | `/ai-chatbots/` + top brand hubs |
| G02 | Guide | `design-creative-buying-guide-pakistan` | How to Choose Design & Creative in Pakistan (2026): A Buying Guide | “how to choose / which design plan” | `/design-creative/` + top brand hubs |
| G03 | Guide | `video-editing-buying-guide-pakistan` | How to Choose Video Editing in Pakistan (2026): A Buying Guide | “how to choose / which video editing plan” | `/video-editing/` + top brand hubs |
| G04 | Guide | `streaming-buying-guide-pakistan` | How to Choose Streaming & Entertainment in Pakistan (2026): A Buying Guide | “how to choose / which streaming plan” | `/streaming/` + top brand hubs |
| G05 | Guide | `vpn-privacy-buying-guide-pakistan` | How to Choose VPN & Privacy in Pakistan (2026): A Buying Guide | “how to choose / which vpn plan” | `/vpn-privacy/` + top brand hubs |
| G06 | Guide | `ai-video-image-buying-guide-pakistan` | How to Choose AI Video & Image Generation in Pakistan (2026): A Buying Guide | “how to choose / which ai video plan” | `/ai-video-image/` + top brand hubs |
| G07 | Guide | `ai-voice-audio-buying-guide-pakistan` | How to Choose AI Voice & Audio in Pakistan (2026): A Buying Guide | “how to choose / which ai voice plan” | `/ai-voice-audio/` + top brand hubs |
| G08 | Guide | `education-buying-guide-pakistan` | How to Choose Online Learning & Education in Pakistan (2026): A Buying Guide | “how to choose / which online learning plan” | `/education/` + top brand hubs |
| G09 | Guide | `productivity-software-buying-guide-pakistan` | How to Choose Productivity & Business Software in Pakistan (2026): A Buying Guide | “how to choose / which productivity plan” | `/productivity-software/` + top brand hubs |
| G10 | Guide | `developer-tools-buying-guide-pakistan` | How to Choose Developer Tools & IDEs in Pakistan (2026): A Buying Guide | “how to choose / which developer tools plan” | `/developer-tools/` + top brand hubs |
| G11 | Guide | `cloud-storage-buying-guide-pakistan` | How to Choose Cloud Storage in Pakistan (2026): A Buying Guide | “how to choose / which cloud storage plan” | `/cloud-storage/` + top brand hubs |
| G12 | Guide | `antivirus-buying-guide-pakistan` | How to Choose Antivirus & Cybersecurity in Pakistan (2026): A Buying Guide | “how to choose / which antivirus plan” | `/antivirus/` + top brand hubs |
| G13 | Guide | `antidetect-proxies-buying-guide-pakistan` | How to Choose Antidetect & Proxies in Pakistan (2026): A Buying Guide | “how to choose / which antidetect plan” | `/antidetect-proxies/` + top brand hubs |
| G14 | Guide | `esim-buying-guide-pakistan` | How to Choose Travel & eSIMs in Pakistan (2026): A Buying Guide | “how to choose / which travel plan” | `/esim/` + top brand hubs |
| G15 | Guide | `ai-apis-buying-guide-pakistan` | How to Choose AI APIs in Pakistan (2026): A Buying Guide | “how to choose / which ai apis plan” | `/ai-apis/` + top brand hubs |

### Wave 2: weeks 5–10 (20 comparisons)
| ID | Type | Slug | Working title | Links to |
| :-- | :-- | :-- | :-- | :-- |
| C01 | Comparison | `chatgpt-vs-claude-vs-gemini-pakistan` | ChatGPT vs Claude vs Gemini: Which AI Assistant Fits You in Pakistan? | `/ai-chatbots/chatgpt/`, Claude Pro, Gemini AI Plus |
| C02 | Comparison | `canva-pro-1-month-vs-1-year-pakistan` | Canva Pro 1 Month vs 1 Year in Pakistan: Which Plan Costs Less? | `/product/canva-pro-1-month/`, `/product/canva-pro-1-year/` |
| C03 | Comparison | `adobe-creative-cloud-7-days-vs-4-months-vs-1-year` | Adobe Creative Cloud 7 Days vs 4 Months vs 1 Year: Which Plan Fits Your Project? | 3 Adobe plan pages |
| C04 | Comparison | `canva-pro-vs-adobe-creative-cloud-freelancers` | Canva Pro vs Adobe Creative Cloud for Freelancers | Canva hub, Adobe hub |
| C05 | Comparison | `canva-pro-vs-figma-for-pakistani-freelancers` | Canva Pro vs Figma: Which Should a Pakistani Freelancer Learn First? | Canva hub, Figma hub |
| C06 | Comparison | `capcut-pro-vs-adobe-premiere-pro` | CapCut Pro vs Adobe Premiere Pro for Video Editors | CapCut hub, Adobe hub |
| C07 | Comparison | `nordvpn-vs-expressvpn-pakistan` | NordVPN vs ExpressVPN: Which VPN Suits Users in Pakistan? | NordVPN, ExpressVPN hubs |
| C08 | Comparison | `best-vpn-for-pakistan-expressvpn-nordvpn-surfshark` | ExpressVPN vs NordVPN vs Surfshark: Plans Compared | 3 VPN hubs |
| C09 | Comparison | `netflix-vs-prime-video-vs-youtube-premium-pakistan` | Netflix vs Prime Video vs YouTube Premium: What You Get in Pakistan | 3 streaming plan pages |
| C10 | Comparison | `spotify-vs-apple-music-pakistan` | Spotify vs Apple Music: Which Music Plan Is Better Value in Pakistan? | Spotify hub, Apple Music page |
| C11 | Comparison | `elevenlabs-vs-minimax-voice` | ElevenLabs vs MiniMax Voice for Voiceovers | ElevenLabs, MiniMax hubs |
| C12 | Comparison | `kling-vs-dreamina-vs-runway-ai-video` | Kling AI vs Dreamina vs Runway: AI Video Tools Compared | Kling, Dreamina hubs, Runway page |
| C13 | Comparison | `chatgpt-plus-vs-go-vs-pro` | ChatGPT Plus vs Go vs Pro: Which Tier Do You Need? | ChatGPT hub |
| C14 | Comparison | `cursor-vs-jetbrains-vs-replit-beginners` | Cursor vs JetBrains vs Replit for Beginners | Developer tools hubs |
| C15 | Comparison | `duolingo-vs-coursera-vs-udemy-vs-skillshare` | Duolingo vs Coursera vs Udemy vs Skillshare: Which Learning Platform Fits? | 4 learning plan pages |
| C16 | Comparison | `notion-vs-gamma-vs-microsoft-365-copilot` | Notion vs Gamma vs Microsoft 365 Copilot for Work and Study | Productivity hubs |
| C17 | Comparison | `deepseek-vs-qwen-vs-kimi` | DeepSeek vs Qwen vs Kimi: Which Chinese AI Model Should You Try? | DeepSeek, Qwen, Kimi pages |
| C18 | Comparison | `grok-vs-chatgpt` | Grok vs ChatGPT: Differences, Plans and Who Each Suits | Grok hub, ChatGPT hub |
| C19 | Comparison | `icloud-plus-storage-plans-compared` | iCloud+ Storage Plans Compared: Which Size Do You Need? | 4 iCloud+ plan pages |
| C20 | Comparison | `kaspersky-1-vs-3-vs-5-devices` | Kaspersky Plans Compared: 1, 3 or 5 Devices? | Kaspersky hub |

### Wave 3: weeks 11–16 (13 how-tos and 6 roundups)
| ID | Type | Slug | Working title | Links to |
| :-- | :-- | :-- | :-- | :-- |
| H02 | How-to | `how-to-pay-for-chatgpt-in-pakistan` | How to Pay for ChatGPT in Pakistan | ChatGPT hub, payment page |
| H04 | How-to | `pay-with-binance-international-customers` | How International Customers Can Pay With Binance | `/payment-methods/` |
| H05 | How-to | `jazzcash-easypaisa-sadapay-safe-payments` | Paying With JazzCash, EasyPaisa and SadaPay: A Safe-Payment Checklist | `/payment-methods/` |
| H06 | How-to | `how-to-avoid-subscription-scams-pakistan` | How to Avoid Scams When Buying Digital Subscriptions in Pakistan | refund page, about |
| H07 | How-to | `how-warranty-and-replacement-work` | How Warranty, Replacement and Refunds Work at PakAITools | refund page |
| H08 | How-to | `how-to-claim-a-replacement` | How to Claim a Replacement: Step by Step | refund page, contact |
| H09 | How-to | `how-to-protect-your-subscription-account` | How to Keep Your Subscription Account Safe: Passwords, Devices and Backups | top plan pages |
| H10 | How-to | `choose-1-month-or-1-year-plan` | 1-Month or 1-Year Plan? How to Decide Without Overpaying | price list, Canva hub |
| H11 | How-to | `how-to-back-up-creative-cloud-projects` | How to Back Up Premiere Pro, Lightroom and Creative Cloud Projects | Adobe hub |
| H12 | How-to | `keep-canva-designs-private-in-shared-workspace` | How to Manage Design Privacy in a Shared Canva Workspace | Canva hub |
| H13 | How-to | `how-to-use-an-esim-in-pakistan` | How an eSIM Works for Travel to or From Pakistan | `/esim/pakistan-esim/` |
| H14 | How-to | `vpn-setup-on-phone-and-laptop` | How to Set Up a VPN on Your Phone and Laptop | VPN category |

| ID | Type | Slug | Working title | Links to |
| :-- | :-- | :-- | :-- | :-- |
| R01 | Roundup | `best-ai-tools-for-students-in-pakistan` | Best AI Tools for Students in Pakistan (2026) | AI chatbots, learning, productivity |
| R02 | Roundup | `best-ai-tools-for-freelancers-in-pakistan` | Best AI Tools for Freelancers in Pakistan (2026) | design, video, chatbots |
| R03 | Roundup | `best-video-editing-apps-for-reels-and-youtube` | Best Video Editing Apps for Reels and YouTube | video editing hubs |
| R04 | Roundup | `best-ai-tools-for-small-business-pakistan` | Best AI Tools for Small Businesses in Pakistan | productivity, design |
| R05 | Roundup | `best-language-learning-platforms-pakistan` | Best Online Learning Platforms Available in Pakistan | education hubs |
| R06 | Roundup | `best-ai-image-and-video-generators` | Best AI Image and Video Generators Compared | AI video & image hubs |

All titles are working titles. Before writing, confirm the facts on the brands’ official pages and note the date. Comparisons C02, C03, C19 and C20 use **only our own plan data** (price, duration, warranty, cost per month), so they can be published immediately and stay accurate.

## B9. Post template (copy for every article)

```
# {H1}

**By Moheez Kiani · Updated {date} · {N} min read**

> **Short answer:** {40–60 words. Comparison: "Choose A if …, choose B if …"}

## Contents
(auto)

## {Question-style H2: what is it / who is it for}
## {Side-by-side table}          <CompareTable slugs=[…] />
## {Section per product or option}
## {Choose A if / choose B if}
<PlanCard slug="…" />
## {Common mistakes or requirements}
<PlanCard slug="…" />
## Frequently asked questions       (4–5, native <details>)
## Sources                          (official links, “Last reviewed {date}”)
Disclosure: PakAITools is an independent reseller and sells plans for some of the products mentioned …
```

Per-post checklist: one primary keyword nobody else uses · answer box · table · 2 plan cards · 2+ plan/hub links · 1 category link · 3 related posts · FAQ ≥ 4 · sources and review date · disclosure · image alt text · no rating markup · validation passes · listed in the blog index and in the related hub/category “Guides and comparisons” block.

## B10. Measuring results

Search Console: queries and pages for `/blog/` (impressions, clicks, average position); posts with impressions but low clicks get a better title. WhatsApp messages include the page URL, so count how many orders mention a blog URL. Posts that rank but never lead to plan clicks need a clearer plan card. Re-order the plan after 6–8 weeks of data.

## B11. Risks

- Thin or copied text hurts the whole site: write original comparisons and keep the minimum lengths.
- Outdated facts hurt trust: use shortcodes for our numbers and the 90-day review.
- Competing pages: obey B1 and the validator.
- Do not publish all 55 posts at once; steady cadence is easier to index and to maintain.
