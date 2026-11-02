# Stage 8 — Intermediate Zoom Out

*   **Target:** `docs/designs/system-design.md` (lines 1–626)
*   **Reviewer:** `egm-zoom-out` (Goldfish, fresh context, with the Stage 5–7
    reports)
*   **Verdict:** Revise. 1 Blocker, 3 Major, 4 Nits.

## Overall

The earlier reports ask for about 30 changes. Many exist only because the
design keeps a daily rebuild that hides future dates: K3, K4, K5, K6, K11,
Z2, Z5, and the future-only revert script.

*   **Accepting a public content source makes the design smaller.** That is
    option (b) of Z1/K1, and it makes most of those mitigations unnecessary.
*   **A private source makes it larger.** Option (a) adds a private repo or
    decryption to two deploy pipelines on top of the timing machinery.

## Findings

### ZO8-1 — Blocker: choose option (b), a public source with no cutoff

*   **Hiding can't protect existing messages.** Every message through 2030
    is already in public git history (`public/data/latest.json`). Hiding
    could only protect newly rewritten messages.
*   **A short rewrite horizon (Z3) leaves little to spoil.** Someone who
    digs out the raw JSON on GitHub is not a meaningful risk for a satire
    site.
*   **Adopt:**
    *   one public `content/messages.json`;
    *   a prebuild that splits it into month files, with no cutoff;
    *   the browser filtering by local date;
    *   a home page that loads the current and previous month files (about
        30–50 KB, which meets G3).
*   **Removes:**
    *   both crons;
    *   the 60-day disable risk;
    *   `PUBLISH_CUTOFF` and the UTC math;
    *   the `--from` +3 rule;
    *   the K3 window math;
    *   the K6 keepalive;
    *   the cutoff-bounded sitemap.
*   **Alternative C** gets a new rejection reason, or is adopted.

### ZO8-2 — Major: one CI rule replaces K4, K5, Z2 and Z6

*   **The rule:** messages dated ≤ UTC today + 1 must match the base branch
    byte for byte, and no date may be removed.
*   **Drop:**
    *   the generator `--from` guard;
    *   the future-only revert script, since bad content is fixed with a
        new PR;
    *   the formal takedown process. An admin ruleset bypass covers
        emergencies; note it in one sentence in `AGENTS.md`.

### ZO8-3 — Major: fix K2 with config; dual hosting drives several costs

*   **K2 is real.** Fix it by removing `"homepage": "."` from
    `package.json`. The Pages build already sets `PUBLIC_URL`.
*   **Dual hosting causes K11 (canonical and duplicate content) and K12
    (host drift).** Making the Pages build a redirect stub or `noindex` is
    cheaper than per-route canonical tags. The owner should reconsider the
    "keep both deployments" non-goal.
*   **Narrow G4 to "linkable".** A build-time sitemap of more than 1,300
    client-rendered day pages has little value. Keep `/archive` as the only
    new sitemap entry.

### ZO8-4 — Major: with a short horizon, most generator hardening goes away

*   **The owner can review all of a 3-month batch** (about 180 messages).
    That removes the K10 conflict and the moderation pass and banned-term
    list (C5). Keep the length and non-empty checks.
*   **Generate a week or a month per request.** Continuity comes from the
    shared context, so the near-duplicate metric (K9) isn't needed.
*   **Drop the extra machinery:**
    *   checkpoints;
    *   resume;
    *   the retry loop;
    *   custom 429 backoff (the SDK already retries).

    This drops D12 and C9.
*   **Judging criteria for the model choice (K17) aren't needed.** The
    owner reads two sample months and picks one.

### ZO8-5 — Nit: drop `archive/index.json`

The no-gap rule lets the browser compute the month list from `FIRST_DATE`
to local today. "Classified" becomes a bounds check before any fetch, which
also resolves K8.

### ZO8-6 — Nit: disagrees with Z7

Don't reuse the parallel generator's concurrency code. A small batch
doesn't need it.

### ZO8-7 — Nit: adopt K7 as written

Keep `no-cache` as the global default and override only `/static/*` and
`/data/*`.

### ZO8-8 — Nit: Z5 mostly goes away

Without a cutoff, the scripts only need `groupByMonth`, `validate`, and the
base-branch comparison.

## Recommended direction

1.  One public `content/messages.json`, split into month files at build
    time. No cutoff, no cron.
2.  The browser filters by local date and computes archive months from
    `FIRST_DATE`.
3.  One CI rule: dates up to tomorrow are unchanged, and no date is removed.
4.  Remove `homepage: "."`.
5.  Rewrite content in 3-month batches, with the owner reviewing every
    message.
6.  Revisit the dual-host non-goal before adding per-host SEO mitigations.
