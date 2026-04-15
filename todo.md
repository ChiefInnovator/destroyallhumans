# Destroy All Humans Website Project

## Deployment topology

The site serves from **two places** simultaneously:

- **Primary — Azure Static Web App** at [https://destroyallhumans.ai](https://destroyallhumans.ai) (custom domain).
  Deployed by [.github/workflows/azure-static-web-apps-polite-sea-05966b00f.yml](.github/workflows/azure-static-web-apps-polite-sea-05966b00f.yml). SPA fallback + headers in [staticwebapp.config.json](staticwebapp.config.json). Built with `homepage: "."` so assets load from root.
- **Secondary — GitHub Pages** at [https://chiefinnovator.github.io/destroyallhumans/](https://chiefinnovator.github.io/destroyallhumans/).
  Deployed by [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) with `PUBLIC_URL=/destroyallhumans`. Pages source is "GitHub Actions" (no `gh-pages` branch, no committed build artifacts).

The router in [src/App.js](src/App.js) picks `basename` at runtime based on `window.location.hostname`, so internal links work on both.

## Status

### 1. Analyze Uploaded Materials

- [x] Project requirements
- [x] Logo assets
- [x] Robot personas

### 2. Project Structure

- [x] React app (CRA, react-scripts 5)
- [x] Component/style/data directory layout
- [x] Logo assets copied and optimized
- [x] GitHub repository — [ChiefInnovator/destroyallhumans](https://github.com/ChiefInnovator/destroyallhumans)

### 3. Website Design and Components

- [x] Homepage with message display
- [x] Pagination (5 days at a time)
- [x] Monthly archive
- [x] Robot persona integration based on tone
- [x] Responsive layout
- [x] Legal pages (Terms, Privacy, Cookies)
- [x] Copyright notice

### 4. GitHub Actions — content generation

- [x] [.github/workflows/generate-messages.yml](.github/workflows/generate-messages.yml) — twice daily (09:00 and 21:00 UTC)
- [x] JSON storage under `public/data/`
- [x] Scripts in [scripts/](scripts/)

### 5. OpenAI Integration

- [x] [scripts/generateMessage.js](scripts/generateMessage.js)
- [x] `OPENAI_API_KEY` stored as GitHub secret
- [x] Persona selection by tone

### 6. Google AdSense

- [x] Meta tag in [public/index.html](public/index.html)
- [x] [ads.txt](ads.txt)
- [x] Ad slot at top of page

### 7. Deployment

- [x] Azure Static Web App provisioned and wired up
- [x] Custom domain `destroyallhumans.ai` on the SWA
- [x] GitHub Pages parallel deployment (workflow-based)
- [ ] **Open: verify `https://destroyallhumans.ai` TLS handshake** — at the time of this writing, `curl https://destroyallhumans.ai/` returns `sslv3 alert handshake failure`. DNS resolves to a Cloudflare shared IP but no Cloudflare zone appears to own the handshake. Confirm the custom domain is still bound to the SWA and its managed cert is valid.

### 8. SEO / AEO / GEO / Link preview

- [x] `<title>`, description, keywords, canonical, robots meta
- [x] Open Graph + Twitter card with 1200x630 `og-image.png`
- [x] JSON-LD: `WebSite`, `CreativeWork`, `Organization`, `FAQPage`
- [x] [public/sitemap.xml](public/sitemap.xml) — home + legal pages
- [x] [public/robots.txt](public/robots.txt) — broad AI crawler allowlist (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, cohere-ai, Meta-ExternalAgent, etc.)
- [x] [public/llms.txt](public/llms.txt) — llmstxt.org format summary + key links
- [x] `text/plain` MIME + SPA exclude for `llms.txt`, `robots.txt`, `ads.txt` in [staticwebapp.config.json](staticwebapp.config.json)

### 9. Test and Finalize

- [x] Local build passes (`npm run build`)
- [ ] After next push: confirm the new `deploy-pages.yml` workflow publishes and the site renders at both URLs with working nav
- [ ] Confirm `destroyallhumans.ai` TLS issue (see section 7)
- [ ] Lighthouse / Core Web Vitals pass
