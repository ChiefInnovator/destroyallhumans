# Remaining TODOs

## High Priority

- [ ] **Add `OPENAI_API_KEY` GitHub Secret** — Required for the `generate-messages.yml` workflow to run. Go to repo Settings → Secrets and Variables → Actions → New repository secret.
- [ ] **Clean up `HomePage.css` light-theme remnants** — `src/styles/HomePage.css` still has hardcoded light colors (`#111827`, `#6b7280`, `#e5e7eb`) for `.tab`, `.tab.active`, `.page-title`, `.page-description` that partially conflict with `theme.css`. Unify to use CSS variables from `theme.css`.

## Medium Priority

- [ ] **Add `build/` to `.gitignore`** — The `build/` directory is committed but is a stale artifact. CI rebuilds fresh on every deploy. Adding it to `.gitignore` avoids repo bloat.
- [ ] **Remove redundant root `data/` directory** — `data/` at the repo root is a copy of `public/data/`. Scripts write to `public/data/`, so the root copy just causes confusion.
- [ ] **Remove stale `src/App.css`** — Contains default CRA boilerplate (`.App`, `.App-logo`, `.App-header`) that is unused. The actual app styles are in `src/styles/App.css` and `src/styles/theme.css`.
- [ ] **Remove redundant root-level static files** — `asset-manifest.json`, `index.html`, `manifest.json`, `ads.txt` exist at root but are duplicates of `public/` or `build/` files.

## Low Priority

- [ ] **Add `og-image.png` fallback** — If a higher-quality branded OG image is desired, replace `public/og-image.png` with a professionally designed version.
- [ ] **Update sitemap `<lastmod>` dates** — `public/sitemap.xml` has static dates. Consider generating it dynamically in CI or updating on each deploy.
- [ ] **Pagination component** — `src/components/Pagination.js` and `src/styles/Pagination.css` exist but are not used by any page. Either integrate or remove.

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
