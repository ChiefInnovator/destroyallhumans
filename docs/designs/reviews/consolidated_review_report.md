# Goldfish Review — Consolidated Report

*   **Target:** `docs/designs/system-design.md`
*   **Mode:** Consolidated (uninterrupted), Stages 5–9, 9 Goldfish runs
*   **Stage reports:**
    *   [zoom_out_report.md](zoom_out_report.md)
    *   [comprehension_report.md](comprehension_report.md)
    *   [critic_report.md](critic_report.md)
    *   [intermediate_zoom_out_report.md](intermediate_zoom_out_report.md)
    *   [implementation_readiness_report.md](implementation_readiness_report.md)
*   **Verdict:** Not ready. The core publishing architecture depends on a
    false premise: that the content is private.

## 🔴 Blockers

| ID | Action | Raised by |
|----|--------|-----------|
| A1 | **Resolve the "hidden future content" premise.** The repo is public, and every message through 2030 is already in git history. Either adopt a public source with month files, no cutoff, and no cron (recommended by Z1(b) and ZO8-1), or move unpublished content to a private source. Then rewrite Problem 4, Alternative C, §1–§2, and NFR to match. | Z1, K1, D1, T1, ZO8-1 |
| A2 | **Fix nested routes on Azure.** Set `homepage` to `/`, make `dataUrl` root-absolute, and make direct loads of `/day/…` and `/archive/yyyy/mm` on Azure a release-blocking check. | K2, I2, R2, B1, ZO8-3 |
| A3 | **One CI content rule.** Messages dated ≤ UTC today + lead must match the base branch byte for byte, and no date may be removed. Handle the case where the base file is missing (the first PR). Drop the script-only guard and the revert script. | Z2, Z6, K4, K5, I1, I3, ZO8-2 |

## 🟡 Major

| ID | Action | Raised by |
|----|--------|-----------|
| A4 | Rewrite in 3-month batches with full owner review, generating a month per request. Drop checkpoints, resume, the moderation pass, near-duplicate metrics, and the parallel-client reuse. Define the prompt, schema, and testable module. | Z3, Z7, K9, K10, K17, C5, C9, I9, ZO8-4, ZO8-6 |
| A5 | Caching: keep `no-cache` as the global default and override only `/static/*` (immutable) and `/data/*`. Add `/static/*` to the fallback excludes. Give `fetchJson` an error contract (non-OK or non-JSON throws). | K7, K8, I5, I6, ZO8-7 |
| A6 | Archive and day pages: compute months from `FIRST_DATE` to local today, and drop `index.json`. Do a bounds check before fetching. Add a shared `Classified` component with fixed copy. Define rules for edge links and invalid dates. Use one route-parameter naming. | ZO8-5, I7, C8, C13, I15 |
| A7 | Home window: with no cutoff, load the current and previous month files and show 5 visible days. Remove the `recent.json` window math. | K3, I4, C4 |
| A8 | Real time-zone tests: concrete UTC−10 and UTC+14 cases using `TZ`. `AppRoutes` is the `<Routes>` block only. Use fake timers. | I8, I10 |
| A9 | Narrow G4 to "linkable". The sitemap adds only `/archive`. Add a canonical link to `destroyallhumans.ai`. Reconsider whether the Pages mirror should be `noindex`. | K11, I11, ZO8-3 |
| A10 | Add a Risks & Mitigations H2. Add a "current repository governance" paragraph. Define Impeccable and move G8 to Dependencies. | K12, K13, C1, C2, Z8 |
| A11 | Rollback: remove the re-enable contradiction. Content problems are fixed forward through a PR. | K14, C3, Z9 |
| A12 | Precision fixes: measurable G7 title, Problem 4 and Problem 7 wording, model-choice method, `ci.yml` `CI` behavior and permissions, the `AGENTS.md` rule wording, and exact metadata replacement strings. | K15, K16, T-majors, I12–I14 |

## 🟢 Nits

The style, structure, and minor detail nits are listed in each stage
report. Apply them while editing.

## Traceability

*   Z1, K1, D1, T1, ZO8-1 → A1
*   K2, I2, B1, ZO8-3 → A2
*   Z2, Z6, K4, K5, I1, I3, ZO8-2 → A3
*   Z3, Z7, K9, K10, K17, C5, C9, I9, ZO8-4, ZO8-6 → A4
*   K7, K8, I5, I6, ZO8-7 → A5
*   ZO8-5, I7, C8, C13, I15 → A6
*   K3, I4, C4 → A7
*   I8, I10 → A8
*   K11, I11 → A9
*   K12, K13, C1, C2, Z8 → A10
*   K14, C3, Z9 → A11
*   K15, K16, T2, T4–T8, I12–I14, C6, C7, C10–C12 → A12

## Resolution (2026-11-02)

The owner chose the **public source with no cutoff** for A1. All the actions
above were applied to `system-design.md`.

*   **A1:** public `content/messages.json`, month files, no cron. Problem 4
    (old) became a Non-Goal. The Alternatives were rewritten.
*   **A2:** `homepage: "/"`, root-absolute `dataUrl`, and release-blocking
    direct-load checks.
*   **A3:** `frozenViolations` (≤ UTC today + 1), with a fallback to the
    base file. The script-only guard and the revert script were dropped.
*   **A4:** batch of 2026-11 to 2027-01, one call per month, owner reads
    every message, `scripts/lib/rewrite.js` is testable.
*   **A5:** global `no-cache` kept. `/static/*` and `/data/*` overridden and
    excluded from the fallback. `fetchMonth` has an error contract.
*   **A6:** months computed from `FIRST_DATE`; `Classified` and `NotFound`
    components with fixed copy; edge-link and invalid-date rules; route
    parameters `:year/:month` and `:date`.
*   **A7:** the home page loads the current and previous month files.
*   **A8:** TZ-based tests with concrete cases; `AppRoutes` defined; fake
    timers.
*   **A9:** G4 narrowed to "linkable"; canonical URLs through
    `usePageMeta`; the Pages build is `noindex`.
*   **A10:** Risks & Mitigations added; a governance paragraph added;
    Impeccable defined under Dependencies.
*   **A11:** rollback is forward-fix only; the workflow stays deleted.
*   **A12:**
    *   G7 retitled and scoped;
    *   Problem wording fixed;
    *   model-choice method defined;
    *   `ci.yml` uses `CI=true` (the build is clean today) and
        `contents: read`;
    *   the `AGENTS.md` rule is stated as an exact bound;
    *   exact metadata strings given.

No re-audit was run.
