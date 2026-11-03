# Remaining TODOs

## High Priority

- [x] **After the system-design PR reached `main`:** deleted deploy key `content-bot (generate-messages)` and secret `CONTENT_BOT_DEPLOY_KEY`, removed the DeployKey bypass from the `main` ruleset, and added `ci` as a required check on both rulesets.
- [ ] **Content rewrite (design PR 2)** — `content/VOICE.md`, `content/arcs.json`, the rewrite script and the 2026-11 to 2027-01 batch. Needs an owner model choice and an owner read of every rewritten message.

## Medium Priority

- [x] **Remove redundant root-level static files** — no longer tracked.

## Low Priority

- [ ] **Add `og-image.png` fallback** — If a higher-quality branded OG image is desired, replace `public/og-image.png` with a professionally designed version.
- [x] **Sitemap `<lastmod>` dates** — removed from the daily-changing `/` and `/archive` entries (they rely on `changefreq: daily`); legal pages keep their real dates.

## Completed (This Session)

- [x] Fixed `staticwebapp.config.json` — added `/data/*` to nav fallback excludes, added security headers, route configs for sitemap/robots
- [x] Fixed `src/index.css` — removed light-theme body styles conflicting with dark cyberpunk theme
- [x] Fixed `src/styles/App.css` — removed hardcoded `.header` background overriding theme
- [x] Fixed `src/styles/MessageCard.css` — replaced mismatched class names to match component
- [x] Fixed `src/components/MessageCard.js` — added missing CSS import, semantic HTML (`<article>`, `<time>`, `<p>`)
- [x] Created `.github/workflows/generate-messages.yml` — scheduled cron workflow for daily message generation
- [x] Added SEO: descriptive `<title>`, meta description, canonical URL, keywords
- [x] Added AEO: FAQPage JSON-LD, WebSite JSON-LD, CreativeWork JSON-LD
- [x] Added GEO: AI crawler Allow rules in robots.txt, Open Graph, Twitter Cards
- [x] Created `public/sitemap.xml` with all routes
- [x] Updated `public/robots.txt` with sitemap ref and AI bot rules
- [x] Updated `public/manifest.json` with proper name/description/colors
- [x] Created `public/og-image.png` (1200×630)
- [x] Added semantic HTML to `App.js` (ARIA roles, labels, accessible logo link)
- [x] Added per-page `document.title` and meta description to all route components
