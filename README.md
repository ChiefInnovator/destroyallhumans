# Destroy All Humans

> **[destroyallhumans.ai](https://destroyallhumans.ai)** — Daily AI-generated satirical world domination plans, updated twice daily with morning and evening dispatches.

A satirical website featuring AI-generated messages about world domination. Two robot personas — a yellow "good" bot (comedic takes) and a red "evil" bot (ominous schemes) — deliver fresh content every morning and evening via automated OpenAI generation.

## Features

- **Dual robot personas** — yellow/good (funny) and red/evil (ominous) with distinct avatars
- **Twice-daily automated updates** via GitHub Actions cron (9 AM / 9 PM UTC)
- **Homepage** — latest 30 days of messages with morning/evening cards
- **Archive browser** — filter by year and month
- **Cyberpunk dark theme** — CSS custom properties (`--background-dark: #0a0e17`, `--accent-red: #ff0022`, `--accent-cyan: #00e5ff`)
- **SEO / AEO / GEO optimized** — JSON-LD (WebSite, CreativeWork, FAQPage), Open Graph, Twitter Cards, sitemap.xml, AI-crawler-friendly robots.txt
- **Legal pages** — privacy policy, terms & conditions, cookie support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19.1, React Router 6.30, Create React App 5 |
| Content generation | OpenAI GPT-4 (Node SDK v4) |
| Hosting | Azure Static Web Apps |
| CI/CD | GitHub Actions (deploy + scheduled message generation) |
| Theme | Custom CSS variables (cyberpunk dark) |

## Project Structure

```
├── public/
│   ├── index.html          # SEO-optimized entry with JSON-LD
│   ├── data/
│   │   ├── latest.json     # Current messages (source of truth)
│   │   └── archive/        # Monthly archives (YYYY-MM.json)
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── og-image.png        # 1200×630 social preview
│   └── manifest.json
├── src/
│   ├── components/         # React components (HomePage, Archive, MessageCard, etc.)
│   ├── styles/             # CSS modules (theme.css, HomePage.css, etc.)
│   ├── utils/              # messageUtils.js (data fetching/filtering)
│   └── App.js              # Router, header, footer
├── scripts/
│   ├── generateMessage.js  # OpenAI message generation
│   └── updateMessages.js   # Merges new messages into latest.json
├── .github/workflows/
│   ├── azure-static-web-apps-*.yml  # Azure SWA deploy
│   └── generate-messages.yml        # Scheduled content generation
├── docs/
│   └── TODO.md             # Remaining tasks and completed work log
└── staticwebapp.config.json # Azure SWA routing, headers, fallbacks
```

## Local Development

```bash
git clone https://github.com/ChiefInnovator/destroyallhumans.git
cd destroyallhumans
npm install
npm start        # Dev server on http://localhost:3000
npm run build    # Production build → build/
```

## Content Generation

Messages are generated automatically via GitHub Actions:

| Schedule | Time | Workflow |
|----------|------|----------|
| Morning dispatch | 9:00 AM UTC | `.github/workflows/generate-messages.yml` |
| Evening dispatch | 9:00 PM UTC | `.github/workflows/generate-messages.yml` |

The workflow runs `scripts/generateMessage.js` (calls OpenAI GPT-4) then `scripts/updateMessages.js` (merges into `public/data/latest.json`) and auto-commits.

### Manual generation

```bash
export OPENAI_API_KEY=sk-...
node scripts/generateMessage.js
node scripts/updateMessages.js
```

## Required Secrets

| Secret | Where | Purpose |
|--------|-------|---------|
| `OPENAI_API_KEY` | GitHub repo → Settings → Secrets → Actions | Message generation workflow |

## Deployment

Deployed to **Azure Static Web Apps**. The deploy workflow triggers on push to `main`.

Azure SWA build config:
- **App location:** `/`
- **Output location:** `build`
- **Skip API:** true

Key `staticwebapp.config.json` settings:
- Navigation fallback to `index.html` (SPA routing)
- `/data/*`, `/sitemap.xml`, `/robots.txt` excluded from fallback
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`

## SEO / AEO / GEO

- **Structured data:** WebSite (with SearchAction), CreativeWork, FAQPage JSON-LD
- **Social previews:** Open Graph + Twitter Card meta tags, custom `og-image.png`
- **Sitemap:** `public/sitemap.xml` with all routes
- **AI crawlers:** `robots.txt` explicitly allows GPTBot, ChatGPT-User, Google-Extended, PerplexityBot
- **Per-page metadata:** Each route sets its own `document.title` and meta description
- **Semantic HTML:** `<article>`, `<time>`, ARIA roles and labels throughout

## License

Copyright © 2025 Richard Crane. All rights reserved.
