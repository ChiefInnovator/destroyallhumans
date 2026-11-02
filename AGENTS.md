# destroyallhumans — agent rules

## Branch flow
- `feature/*` → PR → `develop` → PR → `main`. No direct pushes to `main` or `develop`.
- Enforced by repo rulesets plus the required `branch-policy` check ([.github/workflows/branch-policy.yml](.github/workflows/branch-policy.yml)).
- GitHub Copilot code review runs automatically on PRs into `develop` only.
- Exception: the `generate-messages` workflow pushes content commits straight to `main` using the `CONTENT_BOT_DEPLOY_KEY` deploy key (deploy keys bypass the main ruleset).

## Design docs
- Designs live in `docs/designs/`.
- EGM artifact directory: docs/designs/reviews
