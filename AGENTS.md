# destroyallhumans — agent rules

## Branch flow
- `feature/*` → PR → `develop` → PR → `main`. No direct pushes to `main` or `develop`.
- Enforced by repo rulesets plus the required `branch-policy` check ([.github/workflows/branch-policy.yml](.github/workflows/branch-policy.yml)).
- GitHub Copilot code review runs automatically on PRs into `develop` only.
- Nothing pushes to `main` except merged PRs.

## Content
- Messages live in `content/messages.json`; `scripts/buildData.js` publishes them as monthly JSON at build time.
- Messages dated on or before UTC today + 1 are frozen; the `ci` check fails any PR that changes them or removes a date.
- Run `npm run validate:content` before committing content.
- Emergency removal of a live message: repo admin bypasses the ruleset.

## Design docs
- Designs live in `docs/designs/`.
- EGM artifact directory: docs/designs/reviews
