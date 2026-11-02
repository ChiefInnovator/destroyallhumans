# Stage 7 — Critic Review

*   **Target:** `docs/designs/system-design.md`, FeatureRange lines 1–435
*   **Reviewers:** `egm-design` (feature-spec standard), `egm-structural`
    (feature-spec standard), `egm-style`
*   **Verdict:** Does not pass. 2 Blockers, 15 Major, plus Nits.

Findings that more than one reviewer raised are merged. Each one lists its
sources (D = design, S = structural, T = style).

## Blockers

| # | Finding | Sources | Recommendation |
|---|---------|---------|----------------|
| K1 | `content/messages.json` is not private: the repo is public. Problem #4 is not solved, and the reason for rejecting Alternative C no longer holds. | D1, T1 (also Stage 5 Z1) | Either accept a public source and drop the daily-rebuild machinery, or move unpublished content out of the public repo (private repo or submodule with a read token, or an encrypted file). Fix the wording ("not deployed", not "private"). |
| K2 | Two-level routes break on Azure. `homepage: "."` makes CRA emit relative asset paths, so `/day/2024-03-14` requests `/day/static/js/...` and gets `index.html` back, which renders a blank page. `dataUrl` has the same problem. | D2 | Build Azure with an absolute base (`PUBLIC_URL=/`) and make data URLs root-relative. Opening deep links directly on both hosts becomes a release-blocking check. |

## Major

| # | Finding | Sources | Recommendation |
|---|---------|---------|----------------|
| K3 | The `recent.json` window (7 days ending at UTC + 2) leaves only 4 visible days for UTC−10 visitors, but CUJ 1 promises 5. "About 18 messages" is also wrong: 7 days is 14. | D3, T6 (also C4) | Size the window from the requirement (at least 10 days). Add a test for a UTC−10 visitor. |
| K4 | The published-date guard runs only inside the script, so PR delays can rewrite dates that are already live. A late revert of PR 2 also changes live messages. | D4 (also Z2) | Enforce in `validateContent.js`: no change to `content` for dates ≤ UTC today + lead. Rollback means a future-only revert script. |
| K5 | G1 is not enforced: a PR that rewrites published text passes CI. | D5 | Messages dated on or before the cutoff must match the base branch byte for byte. |
| K6 | The 60-day schedule-disable risk is likely once bot commits stop. The site freezes quietly. | D6, T19 (also C6) | Add a staleness signal (client notice when the newest date is older than today) plus a keepalive or monitor. |
| K7 | Removing global `no-cache` leaves fallback-served deep-link HTML with no `Cache-Control`. A stale cached HTML file can point at deleted bundles. | D7 | Keep `no-cache` as the global default. Override only `/static/*` and `/data/*`. |
| K8 | The 404 override returns `index.html` with status 200 for missing `/data/*` files. `fetchJson` then fails parsing instead of showing "classified". | D8 | Decide the classified state from `index.json` and date bounds before fetching. Check `Content-Type` in `fetchJson`. |
| K9 | The generator does not connect days within a month, and it checks only exact duplicates. That doesn't address "the same joke" repetition. | D9 | Pass in a rolling window of the month's generated days and the arc beat. Add a near-duplicate similarity check and a repetition metric. |
| K10 | Review claims conflict ("review every message" vs "reads samples"). The content limits are enforced only by a term list, and there is no takedown process. | D10, T2 (also C5) | Merge content in monthly or quarterly batches with full review, or state the residual risk. Add a moderation pass. Define a takedown process that is exempt from the immutability rule. |
| K11 | G4 says day URLs go in the sitemap, but only `/archive` is added. Pages deep links return HTTP 404. Duplicate content across the two hosts is not addressed. | D11 | Generate `sitemap.xml` at build time up to the cutoff. Give every route a canonical link to `destroyallhumans.ai`. State that the Pages mirror is not indexed. |
| K12 | There is no Risks & Mitigations section. Unlisted risks include Oryx skipping `prebuild`, the two hosts drifting apart, off-policy model output, and a dead API key. | S1 | Add an H2 "Risks & Mitigations". |
| K13 | G8 (Impeccable design system) is listed as a goal but explicitly not delivered. "Impeccable" is undefined. | S2, T5 (also Z8, C1) | Define and link it, and move G8 to Dependencies or Non-Goals. |
| K14 | The rollback text contradicts itself about re-enabling `generate-messages.yml`. | S6, T3 (also Z9, C3) | Remove the re-enable step. |
| K15 | G7 "Funnier, sharper" can't be measured. Problem 7 uses absolute or unverifiable claims. | T4 | Retitle to "Content rewritten to the voice guide". Cite sample evidence. |
| K16 | Problem 4's "never reviewed on the day" is a non sequitur. | T7 (also C12) | Cut it or state it on its own. |
| K17 | Open Question "best comedy model" has no criteria. | T8 | Define the judging method (rate N sample messages against `VOICE.md`). |

## Nits

*   **D12:** no cost or quota estimate, and no 429 backoff or resume flag.
*   **D13:** the month-file size should be computed from the 280-character
    limit (about 22–25 KB).
*   **D14:** move the cron off the top of the hour (`17 0 * * *`).
*   **S3, T20:** promote "Future Improvements" to H2.
*   **S4:** the `---` dividers are used inconsistently.
*   **S5:** a wrapped line starting with "2." may render as a list item.
*   **T9, T10, T12, T15:** loaded or vague wording ("only by accident",
    "destroys", "pay for this", "real routes", "simplest", "behaves badly",
    "acceptable").
*   **T11:** inconsistent "since (at least) June 2026".
*   **T13:** the data-size targets conflict (100 KB vs 10 KB).
*   **T14:** "message ... appear" should be "appears".
*   **T16:** "provocation second" vs "Provocative second".
*   **T17:** the "classified" copy is undefined; grammar is human-checked
    only; the term-list location is undefined.
*   **T18:** introduce "GitHub Copilot code review" on first use.
