# Stage 9 — Implementation Readiness

*   **Target:** `docs/designs/system-design.md`, DetailedRange lines 436–626
*   **Reviewers:** `egm-implementation-readiness` (R),
    `egm-codebase-details` (B), `egm-style` (T). R and B used the
    implementation-readiness standard.
*   **Verdict:** Not ready. 3 Blockers, 12 Major, plus Nits.

## Blockers

| # | Finding | Sources | Fix |
|---|---------|---------|-----|
| I1 | `validateContent.js` runs `git show origin/<base>:content/messages.json`. The file doesn't exist on `develop` or `main` until PR 1 merges, so the new required `ci` check fails on its own PR. | R1, B3 | Define what happens when the base file is missing: fall back to `public/data/latest.json`, or skip with a notice. Add a test. |
| I2 | `homepage: "."` makes `PUBLIC_URL` equal `.` on Azure. Nested routes then load `/day/static/js/...`, data loads from `/day/data/...`, and the logo breaks. The page renders blank. GitHub Pages and `npm start` hide the bug. | R2, B1 (also K2) | Set `homepage` to `/`. Make `dataUrl` root-absolute. Make "load `/archive/2024/03` directly on Azure" a release-blocking check. |
| I3 | The published-dates guard is only in the script. Merge lag or a late revert can rewrite live dates. The `--from` guard must use UTC. | R3 (also K4, Z2) | CI rule in `validateContent.js`: dates ≤ UTC today + 2 must match the base. Test it. |

## Major

| # | Finding | Sources |
|---|---------|---------|
| I4 | The `recent.json` window is too short for 5 visible days in UTC−10 (needs at least 9–10 days). The plan says both "7 days" and "18 messages". Shapes of `recent.json` and `index.json` and the related tests are unspecified. | R4, B2 |
| I5 | The 404 override serves HTML with 200 for missing `/data/*` and `/static/*`. `fetchJson` has no error contract. `/static/*` is missing from `navigationFallback.exclude`, so HTML could be cached as immutable JS. | R5, B4, B5 |
| I6 | Removing the global `no-cache` leaves fallback routes uncached-by-rule; only `/index.html` is covered. | R5, B6 |
| I7 | Undefined behaviors: edge prev/next links, invalid dates (`2024-02-30`, `/day/foo`), future months in the index, the shared classified component and its copy, and one component serving two routes. | R6, B8, B9 |
| I8 | Time-zone tests don't actually exercise time zones. They need concrete cases plus a `TZ` setting or an offset parameter. | R7 |
| I9 | Rewrite-script decisions left open: banned-term location, duplicate definition, prompt and JSON schema, checkpoint resume, continuity source, a module to export for tests, and the default model. | R8, B12 |
| I10 | `AppRoutes` boundary is undefined. Tests need fake timers. | R9, B-nit |
| I11 | The sitemap scope conflicts with G4. | R10 |
| I12 | `ci.yml` runs with `CI=true` (warnings fail the build) while deploy uses `CI=false`. Permissions aren't set. | B7 |
| I13 | The `AGENTS.md` rule ("within 3 days") states a two-sided limit as one-sided. Nothing enforces it. | B10, T3 |
| I14 | Wording fixes are underspecified: `manifest.json` has no stale text, `llms.txt` line 22 is missed, and JSON-LD needs exact strings. | B11, T-nit |
| I15 | Route parameter names are inconsistent (`:yyyy/:mm` vs `:year/:month`). The Verification "count byte for byte" mixes two checks. The README persona fragment is unclear. | T1, T2, T4 |

## Nits

*   **Script setup:**
    *   use `node --test scripts/*.test.js` and add `engines`;
    *   `PUBLISH_CUTOFF` format is unspecified;
    *   the default for `utcTodayKey()` is missing.
*   **Tests:**
    *   missing test cases for gaps, empty content, invalid `time`, and
        ordering;
    *   280 characters counted as UTF-16 units vs code points.
*   **Front end:**
    *   `DailyMessages` heading links to itself on `DayPage`;
    *   orphaned Pagination and tab rules in `theme.css`;
    *   hard-coded 9:00 AM/PM in `MessageCard`;
    *   keep the `HomePage` title and meta effect.
*   **Content generation:**
    *   `arcs.json` types and the start month are unspecified.
*   **Wording:**
    *   "private source" is redundant;
    *   "truncate data" is vague;
    *   "281 characters" needs a label;
    *   items 22 and 24 duplicate each other;
    *   "persona-by-time" is a coined term;
    *   use on-voice and off-voice examples;
    *   heading "Detailed" is redundant;
    *   action labels are inconsistent.

## Verified accurate (B)

*   Every file marked Delete or Modify exists.
*   The unused modules are unused.
*   `MessageCard` already renders the morning and evening labels.
*   There is no `api/` folder.
*   `latest.json` holds 5,700 messages from 2023-03-14 to 2030-12-31.
*   No message exceeds 280 characters, and none is empty.
