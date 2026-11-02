# destroyallhumans — agent rules

## Branch flow
- `feature/*` → PR → `develop` → PR → `main`. No direct pushes to `main` or `develop`.
- Enforced by repo rulesets plus the required `branch-policy` check ([.github/workflows/branch-policy.yml](.github/workflows/branch-policy.yml)).
- GitHub Copilot code review runs automatically on PRs into `develop` only.
- Exception: the `generate-messages` workflow (GitHub Actions bot) pushes content commits straight to `main` via a ruleset bypass.
