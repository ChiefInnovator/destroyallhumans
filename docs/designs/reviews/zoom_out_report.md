# Stage 5 — Initial Zoom Out Review

*   **Target:** `docs/designs/system-design.md` (lines 1–626)
*   **Reviewer:** `egm-zoom-out` (Goldfish, fresh context)
*   **Verdict:** Revise. 1 Blocker, 2 Major, 6 Nits.

The reviewer confirmed these claims against the code:

*   the truncation bug (`unshift` then `slice(0, 60)`);
*   the unused modules (`messageUtils.js`, `Pagination.js`, `src/App.css`,
    `logo.svg`);
*   the date parsing copied into four components;
*   the `api_location: "api"` that points at nothing.

The proposed helpers consolidate code; they don't duplicate anything that
already exists.

## Findings

### Z1 — Blocker: moving content to `content/` does not hide it

Affects: Problem #4, Technical Plan §1–§2, Alternative C, NFR Reliability.

The repository is public. `content/messages.json` is still readable on
github.com, so future messages stay public. The only stated reason for the
daily-rebuild machinery is to stop readers seeing ahead. That machinery is:

*   the cutoff and the 2-day window;
*   cron triggers on both deploys;
*   the 60-day schedule-disable risk;
*   the `PUBLISH_CUTOFF` override;
*   the `--from` guard.

Either:

*   (a) make the source actually private, with a private content repo or an
    encrypted source; or
*   (b) accept that future content is readable. Then split the data into
    month files at build time, with no cutoff and no scheduled deploy. The
    home page loads the current and previous month files (about 30 KB, which
    still meets G3), and the browser keeps hiding future days on screen.

### Z2 — Major: the "never rewrite published dates" guard is in the wrong place

Affects: §4 `--from` guard, Rollout, step 39.

The guard runs only when `rewriteContent.js` runs. If the PR takes more than
3 days to reach `main`, dates that are already live get rewritten. Move the
check to `validateContent.js` in CI: no `content` change for dates ≤ UTC
today + 2 compared with the base branch. CI then also covers hand edits.

### Z3 — Major: rewriting through 2030 in one batch is premature

Affects: G7, story arcs, step 37.

That is about 3,000 messages and about 50 monthly arcs, written before
anyone knows whether the new voice works. Rewrite a short horizon (3–6
months) and extend it with the same script. This means less API cost, less
review work, and no four-year arc commitment.

### Z4 — Nit: Technical Plan drops to code level

Signatures, loop pseudocode, and retry counts in §3–§4 repeat the Detailed
Implementation Plan. Keep §3–§4 at the component level.

### Z5 — Nit: two date-helper implementations

`scripts/lib/content.js` (CommonJS) and `src/utils/*.js` (ESM) duplicate
date math. The split is forced by CRA and Node module types; the design
should say so. Z1(b) reduces it.

### Z6 — Nit: overlapping data checks

The "no gaps" rule already catches mid-file deletions. Fold the deletion
check and Z2's check into one comparison with the base branch.

### Z7 — Nit: reuse the existing OpenAI client code

`generateHistoricalMessagesParallel.js` already has the client, concurrency,
and rate-limit handling. Reuse it in `rewriteContent.js`, or say it is
deliberately dropped.

### Z8 — Nit: G8 is not delivered by this design

Move it to Non-Goals or Dependencies.

### Z9 — Nit: the rollback text contradicts itself

It says to re-enable `generate-messages.yml`, then to keep it disabled. Say
instead: revert PR 1 and leave the workflow disabled.
