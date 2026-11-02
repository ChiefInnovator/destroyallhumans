# Destroy All Humans: System Design

*   **Author:** Richard Crane (`ChiefInnovator`)
*   **Status:** Approved (revised after Goldfish review, see
    [reviews/consolidated_review_report.md](reviews/consolidated_review_report.md))
*   **Date:** 2026-11-02

--------------------------------------------------------------------------------

## Overview

Destroy All Humans (`destroyallhumans.ai`) is a satirical website. Each day it
shows two short messages from a fictional AI that wants to take over the world:
a morning "plan" and an evening "report". The site is a React single-page app
built with Create React App (CRA). It has no backend. Before this design, all
messages lived in one JSON file, `public/data/latest.json`, which the browser
downloaded and filtered by date. After it, the source is
`content/messages.json`, and the build publishes one file per month under
`public/data/months/`.

This document describes how the system works today, what is wrong with it,
and the changes that fix it. It covers the content data, the content scripts
and workflows, the React front end, the two deployments, CI, and the project
documentation.

### Current repository governance

The repo `ChiefInnovator/destroyallhumans` is public. Changes flow
`feature/*` → pull request → `develop` → pull request → `main`, enforced by
two GitHub rulesets (one per branch) and a required check named
`branch-policy` (`.github/workflows/branch-policy.yml`). The check fails a PR
into `main` whose source is not `develop`, and a PR into `develop` whose
source is not `feature/*`. GitHub Copilot code review runs automatically on
PRs into `develop`.

One exception exists today. The workflow `generate-messages.yml` pushes
content commits straight to `main`. It authenticates with a deploy key stored
as the secret `CONTENT_BOT_DEPLOY_KEY`, and the `main` ruleset lets deploy
keys bypass it. `AGENTS.md` documents this exception. The workflow is
currently disabled (see Problem 1).

## The Problem

The site serves visitors correctly today because the scheduled generator has
been failing. Around it, the code, data, and docs contradict each other.

1.  **The daily generator truncates the data.** `generate-messages.yml` runs
    `scripts/updateMessages.js` twice a day. That script adds the new message
    to the front of `latest.json` and keeps the first 60 entries. The file is
    sorted oldest first and holds 5,700 messages. One successful run would
    keep the new message plus the 59 oldest messages from March 2023, and the
    home page would show "No messages found". Every scheduled run since at
    least 2026-06-12 has failed (older logs have expired), and the workflow is
    now disabled.
2.  **The daily generator is not needed.** `latest.json` already contains a
    morning and an evening message for every day from 2023-03-14 to
    2030-12-31, with no gaps and no duplicates. The site shows only messages
    dated on or before the visitor's local date. The README, `llms.txt`, and
    page metadata describe "twice daily" generation that does not run.
3.  **Every visit downloads the whole history.** The home page fetches all
    1.3 MB of `latest.json` with a cache-busting query string on every page
    load, to show 10 messages. `staticwebapp.config.json` also marks every
    response `no-cache, no-store`, including the content-hashed JavaScript
    and CSS bundles that never change.
4.  **The content is flat.** Every message came from one fixed GPT-4 prompt
    ("funny, satirical ... slightly menacing"). Messages repeat the same
    shape: a vague threat about satellites, the power grid, or "humanity",
    with no named object, no recurring character, and no link between the
    morning and the evening. Example: "Today, I shall reprogramming weather
    satellites to induce endless monsoons. No resistance. No mercy." Some
    messages have grammar errors. The two robots (yellow morning, red
    evening) do not have distinct voices.
5.  **Code and docs disagree.**
    *   The README says the robot avatar is chosen by message tone. The code
        picks yellow for morning and red for evening.
    *   These files are never imported: `src/utils/messageUtils.js`,
        `src/components/Pagination.js`, `src/styles/Pagination.css`,
        `src/styles/HomePage.css`, `src/App.css`, and `src/logo.svg`.
    *   `public/data/archive/2025-04.json` (two messages) and the root
        `data/` folder are unused copies of the data.
    *   The README and `todo.md` claim an AdSense ad slot. Only the AdSense
        site-verification meta tag exists.
    *   Date parsing is copied into four components.
6.  **The archive cannot be linked.** The archive is a tab inside the home
    page, not a URL. It cannot be bookmarked or shared, and the browser Back
    button does not leave it.
7.  **Almost no tests.** One smoke test checks that "Loading messages"
    renders. The date filtering that decides what every visitor sees is
    untested.

## Goals

*   **G1 — Data safety.** No job or pull request can remove a date or change
    a message that visitors can already see. A required CI check enforces
    this.
*   **G2 — Docs match reality.** The README, `llms.txt`, and page metadata
    describe the process that actually runs.
*   **G3 — Smaller page loads.** A first visit to the home page downloads at
    most 60 KB of message data (down from 1.3 MB). Repeat visits reuse cached
    JavaScript and CSS bundles on Azure.
*   **G4 — Linkable pages.** The archive, each month, and each day have their
    own URL that loads directly on both hosts.
*   **G5 — No dead code or stale docs.** Remove the unused files and data
    copies listed in Problem 5.
*   **G6 — Tested date logic.** Unit tests cover which messages are visible,
    with the test process set to the `Pacific/Honolulu` (UTC−10) and
    `Pacific/Kiritimati` (UTC+14) time zones.
*   **G7 — Content rewritten to the voice guide.** Messages for 2026-11-04
    through 2027-01-31 are rewritten to `content/VOICE.md`, and the owner
    reads every one before merge. Later batches use the same script.

## Non-Goals

*   Hiding future messages. The repo is public and every message through
    2030 is already in its git history. The browser hides future dates on
    screen; the raw data stays readable on GitHub.
*   Rewriting messages visitors can already see.
*   Live daily generation. Content is written in batches and published by
    date.
*   Replacing Create React App with Vite or Next.js.
*   Adding a backend, database, or user accounts.
*   Running AdSense ads. This design only removes the claim that a slot
    exists.
*   Dropping one of the two deployments.

## Dependencies

*   **Impeccable design-system docs.** Impeccable is a Claude Code plugin
    (`impeccable@impeccable`, enabled in `.claude/settings.json`) that
    critiques and improves front-end UI. It reads a project's design context
    (`PRODUCT.md`, `DESIGN.md`). Those docs are written after this design
    ships, from the built UI. They are not part of this design.

## Open Questions

*   **Generation model.** `rewriteContent.js` requires a `--model` flag. The
    owner generates one sample month with two candidate models, reads both,
    and picks the one with fewer messages that break `VOICE.md`.

## Critical User Journeys (CUJs)

### CUJ 1: Read today's messages

*   **Given**: A visitor on a phone opens `https://destroyallhumans.ai/` for
    the first time.
*   **When**: The page loads.
*   **Then**: Messages for the visitor's local today and the four days before
    it appear, newest first. Today's evening message appears only if it
    exists. The page downloads at most 60 KB of message data.

### CUJ 2: Browse and share an old day

*   **Given**: A visitor is on the home page.
*   **When**: They open the archive, pick March 2024, and open 2024-03-14.
*   **Then**: The URL `/day/2024-03-14` loads directly on both
    `destroyallhumans.ai` and `chiefinnovator.github.io/destroyallhumans`, and
    the Back button returns to March 2024.

### CUJ 3: A content batch is merged

*   **Given**: The owner has run `rewriteContent.js` for a month and opened
    a PR.
*   **When**: CI runs.
*   **Then**: The `ci` check fails if any message dated on or before UTC
    today + 1 differs from the base branch, or if any date was removed.

### CUJ 4: A change reaches production

*   **Given**: A developer works on `feature/x`.
*   **When**: They open a PR to `develop`, Copilot reviews it, `ci` and
    `branch-policy` pass, and they then open a PR from `develop` to `main`.
*   **Then**: Both deployments update from `main`.

## Technical Plan (Architecture)

### 1. One public content file, split into month files at build

`public/data/latest.json` moves to `content/messages.json`. The schema stays
`{ "messages": [ { id, date: "YYYY-MM-DD", time: "morning"|"evening",
content } ] }`.

Before every build, a script splits the file into one file per month,
`public/data/months/YYYY-MM.json`, with the same schema. There is no date
cutoff: every month through 2030 is published, and the browser hides dates
after the visitor's local today. `public/data/` becomes a generated,
git-ignored folder. The script runs through the npm `prebuild` and
`prestart` hooks, so `npm run build` produces the same files on GitHub Pages
and on Azure's Oryx builder.

```text
content/messages.json (git)
        │  npm run build → prebuild: scripts/buildData.js
        ▼
public/data/months/YYYY-MM.json (generated, ~25 KB each)
        │
        ├── deploy-pages.yml ───────────────► GitHub Pages  (push to main)
        └── azure-static-web-apps-*.yml ────► Azure SWA     (push to main)
                                                  │
Browser ◄── fetch current + previous month, show dates ≤ local today
```

New days appear without a deploy, because the browser compares dates with
its own clock. No scheduled workflow is needed.

### 2. Data rules and the CI guard

`scripts/validateContent.js` checks these rules on every PR:

*   **Shape:**
    *   one `morning` and one `evening` message per date;
    *   no date gaps from 2023-03-14 to the last date;
    *   unique `id`;
    *   `content` is 1–280 characters;
    *   sorted by date, then morning before evening.
*   **Published messages are frozen.** Compared with the base branch, every
    message dated on or before UTC today + 1 must be identical, and no date
    may be removed. UTC today + 1 is the latest local date anywhere (UTC+14).

`ci.yml` runs this together with the tests and the build. `ci` becomes a
required check in both rulesets. For an emergency removal of a live message,
the repo admin bypasses the ruleset; `AGENTS.md` records this.

### 3. Front end

| Path | Shows | Data loaded |
|------|-------|-------------|
| `/` | Local today and the 4 days before it | Current and previous month files |
| `/archive` | Months from 2023-03 to the local current month, grouped by year | None |
| `/archive/:year/:month` | Visible days of that month, newest first, with previous/next month links | That month's file |
| `/day/:date` | One day's messages, with previous/next day links | That day's month file |
| `/terms`, `/privacy`, `/cookies` | Unchanged | — |
| anything else | Not-found message | — |

*   **Classified dates.** A valid date (or month) after the visitor's local
    today shows a shared "Classified" message and fetches nothing. So does
    one before 2023-03-14.
*   **Not found.** A malformed or impossible date (`/day/foo`,
    `/day/2024-02-30`) shows the not-found message.
*   **Edge links.** Previous and next links are hidden at the first and
    last visible day or month.
*   **Shared modules.** One shared date module replaces the four copies.
    Message grouping and data fetching each get one module.
*   **Fetching.** The data fetcher uses root-absolute URLs.
*   **Personas.** The robot is still chosen by time of day: yellow for
    morning, red for evening.
*   **Asset paths.** `package.json` `homepage` changes from `"."` to `"/"`.
    With `"."`, CRA writes relative asset paths. Those break on two-level
    routes such as `/day/2024-03-14`: the browser requests
    `/day/static/js/...` and gets HTML back. The GitHub Pages build already
    overrides the base with `PUBLIC_URL=/destroyallhumans`.
*   **Deep links on GitHub Pages.** The Pages workflow copies `index.html`
    to `404.html`, so any unknown path loads the app. Those responses carry
    HTTP status 404.

### 4. Caching and indexing

*   **Azure caching.** `no-cache` stays the global default in
    `staticwebapp.config.json`. Two routes override it:
    *   `/static/*`: one year, `immutable`;
    *   `/data/*`: 1 hour.

    `/static/*` and `/data/*` are excluded from the navigation fallback, so
    a missing file returns a real 404 rather than HTML.
*   **The `no-cache` `<meta>` tags** in `index.html` are removed. HTTP
    headers already control caching.
*   **Canonical URLs.** Each page sets its title, description, and
    canonical URL on `https://destroyallhumans.ai`.
*   **GitHub Pages mirror.** The Pages build sets `robots` to
    `noindex, follow`, so search engines index only the main domain.
*   **Sitemap.** `/archive` is added. Day pages are reached through links.

### 5. Content rewrite in batches

*   **Voice guide.** `content/VOICE.md` is the standard: comedy first,
    provocation second.
    *   Every message has a joke built on a concrete detail (a named
        appliance, a meeting invite, a firmware changelog).
    *   Targets are tech culture, AI hype, corporate jargon, people's
        dependence on devices, and the AI's own incompetence.
    *   The yellow morning robot is an upbeat project manager announcing
        today's plan. The red evening robot files a bitter report on why
        that same plan failed.
    *   **Limits:** no real private individuals, no real living public
        figures by name, no slurs, no real tragedies, no self-harm, no
        detailed violence, no real company named as a crime target. 280
        characters or fewer.
*   **Story arcs.** `content/arcs.json` gives each month in the batch a
    campaign, recurring characters, and three beats (early, mid, late
    month). The owner writes the arcs by hand.
*   **Generator.** `scripts/rewriteContent.js --month YYYY-MM --model <name>`
    makes one API call per month: it sends `VOICE.md`, that month's arc, and
    the previous 7 days' messages, and asks for the whole month as JSON. It
    checks length, non-empty content, and exact duplicates against all other
    messages, then writes the month into `content/messages.json`. It never
    replaces dates on or before UTC today + 1. The OpenAI SDK's built-in
    retries handle rate limits. A failed run changes nothing.
*   **Review.** The owner reads every message in the PR diff (about 60 per
    month) against `VOICE.md`. The machine checks catch only length and
    duplicates; the limits depend on that read.

### 6. Removed pipeline

These are deleted, together with the deploy key, its secret, and the
deploy-key bypass on the `main` ruleset:

*   `generate-messages.yml`;
*   `update-content.savedyml`;
*   the daily scripts (`generateMessage.js`, `updateMessages.js`);
*   the historical scripts (`generateHistoricalMessages*.js`,
    `runHistoricalGenerator*.sh`). These overwrite the whole file from 2023.

After this, nothing pushes to `main` except merged PRs.

## Alternatives Considered

### Alternative A: Hide future content with a daily rebuild and a cutoff

*   **Pros**: Future messages would not be served by the site.
*   **Cons**:
    *   They stay readable in the public repo and its history.
    *   It needs a daily cron on two hosts, and GitHub disables schedules
        after 60 days without repo activity.
    *   It needs window maths for time zones.
*   **Reason for Rejection**: It hides nothing. Raised as a Blocker in the
    Goldfish review.

### Alternative B: Private content source

*   **Pros**: Unpublished rewrites would be hidden.
*   **Cons**: Needs a private repo or encrypted file, a secret in both
    deploy pipelines, and the daily cron from Alternative A.
*   **Reason for Rejection**: Operational cost is out of proportion for a
    satire site. The owner chose a public source.

### Alternative C: Live daily generation

*   **Pros**: Content could react to current events.
*   **Cons**: Needs a working API key and budget every day. Output would go
    live unreviewed. The previous workflow failed for months unnoticed.
*   **Reason for Rejection**: Batch rewriting improves the voice and keeps
    owner review.

### Alternative D: Request-time cutoff in an Azure Function

*   **Pros**: Exact cutoff per request.
*   **Cons**: Adds a backend and does not work on GitHub Pages.
*   **Reason for Rejection**: Breaks the second deployment.

### Alternative E: Keep the archive as a tab, with hash links

*   **Pros**: Smaller change.
*   **Cons**: Hash links are not separate pages for search engines, and the
    Back button still stays inside the tab.
*   **Reason for Rejection**: Fails G4.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Azure Oryx does not run `prebuild`, so `public/data/months/` is missing and the site shows an error. | npm runs `pre*` hooks for `npm run build`, which Oryx calls. The Verification Plan fetches a month file on Azure after the first deploy. |
| Nested routes load a blank page on Azure. | `homepage: "/"`; root-absolute data URLs; direct-load checks on both hosts are release-blocking. |
| A content PR rewrites a live message. | The CI "published messages are frozen" rule, required on both branches. |
| A PR passes CI, then merges days later, after more dates went live. | The window is small (only dates that became visible between the CI run and the merge). Branch protection re-runs checks when the base branch moves. The owner re-runs `ci` before merging a content PR. |
| Off-voice or policy-breaking model output. | Batches of one to three months; the owner reads every message; `VOICE.md` limits. |
| The OpenAI key is expired or out of credit. | The rewrite is run by hand; a failure changes nothing. |
| The two hosts drift apart (one deploy fails). | Both deploy on the same push to `main`; GitHub emails the owner on workflow failure. |

## Non-Functional Requirements

*   **Security & Privacy**: `OPENAI_API_KEY` is used only on the owner's
    machine. The `CONTENT_BOT_DEPLOY_KEY` write key and its ruleset bypass
    are removed.
*   **Performance**: Home-page message data is two month files, about
    50 KB, down from 1.3 MB. Hashed bundles are cached for a year on Azure.
*   **Rollout & Rollback**: Two PRs into `develop`.
    *   PR 1: structure, routes, caching, CI, and docs. Rollback reverts PR
        1. `generate-messages.yml` stays deleted, because it truncates data.
    *   PR 2: the first content batch. Content problems are fixed forward
        with a new PR. CI blocks any change to live dates.

## Future Improvements

*   **Content past 2030**: `rewriteContent.js --month` can target months
    after the last date once an append mode exists.
*   **Per-day share images**: Open Graph images for `/day/` pages.
*   **Build tool**: migrate from Create React App to Vite.

--------------------------------------------------------------------------------

## Implementation Plan

### PR 1 — Structure (`feature/design-doc-and-impeccable`)

#### Content and data

1.  `content/messages.json` (Move): `git mv public/data/latest.json
    content/messages.json`.
2.  `public/data/archive/2025-04.json`, `data/latest.json`,
    `data/archive/2025-04.json`, `.github/.DS_Store`,
    `.github/workflows/.DS_Store` (Delete): unused copies and Finder files.
3.  `.gitignore` (Modify): add `/public/data/`.
4.  `scripts/lib/content.js` (Create, CommonJS). Pure functions:
    *   `loadMessages(file)`;
    *   `addDays(dateKey, n)`;
    *   `utcTodayKey(now = new Date())`;
    *   `groupByMonth(messages) → { 'YYYY-MM': message[] }`;
    *   `validate(messages) → string[]` (the shape rules in §2; length is
        measured in code points);
    *   `frozenViolations(baseMessages, headMessages, lastFrozenKey) →
        string[]`. This reports any removed date, and any message dated
        ≤ `lastFrozenKey` whose `content`, `id`, or `time` differs.
5.  `scripts/buildData.js` (Create): loads `content/messages.json`, exits 1
    if `validate` reports errors, and writes
    `public/data/months/YYYY-MM.json` for every month. It removes stale
    files in `public/data/months/` first.
6.  `scripts/validateContent.js` (Create). CLI: `node
    scripts/validateContent.js [--base <git ref>]`.
    *   Runs `validate`.
    *   With `--base`, reads the base copy using `git show
        <ref>:content/messages.json`. If that path is missing, it falls
        back to `<ref>:public/data/latest.json`. If both are missing, it
        prints a notice and skips the frozen check.
    *   Runs `frozenViolations` with `lastFrozenKey = addDays(utcTodayKey(),
        1)`.
    *   Exits 1 on any error.
7.  `scripts/content.test.js` (Create, `node:test`). Cases:
    *   `validate` passes on a valid three-day fixture;
    *   it reports a missing evening, a date gap, a duplicate id, a
        281-code-point message (over the limit), empty content, an invalid
        `time`, and out-of-order dates;
    *   `frozenViolations` reports a removed date and an edited message on
        `lastFrozenKey`;
    *   it allows an edit on `lastFrozenKey + 1`;
    *   `utcTodayKey(new Date('2026-11-02T23:59:00Z'))` returns
        `'2026-11-02'`;
    *   `addDays('2026-12-31', 1)` returns `'2027-01-01'`.
8.  `package.json` (Modify).
    *   Set `"homepage": "/"`.
    *   Add these scripts:
        *   `"prebuild": "node scripts/buildData.js"`;
        *   `"prestart": "node scripts/buildData.js"`;
        *   `"test:scripts": "node --test scripts/*.test.js"`;
        *   `"validate:content": "node scripts/validateContent.js"`.
    *   Add `"engines": { "node": ">=20" }`. `openai` stays in
        devDependencies.

#### Removed pipeline

9.  `.github/workflows/generate-messages.yml`,
    `.github/workflows/update-content.savedyml`,
    `scripts/generateMessage.js`, `scripts/updateMessages.js`,
    `scripts/generateHistoricalMessages.js`,
    `scripts/generateHistoricalMessagesParallel.js`,
    `scripts/runHistoricalGenerator.sh`,
    `scripts/runHistoricalGeneratorParallel.sh` (Delete).
10. GitHub settings (Modify, done after PR 1 reaches `main`):
    *   delete the deploy key `content-bot (generate-messages)` and the
        secret `CONTENT_BOT_DEPLOY_KEY`;
    *   remove the DeployKey bypass from the `main` ruleset;
    *   add required check `ci` to both rulesets.

#### Workflows and hosting

11. `.github/workflows/ci.yml` (Create).
    *   Trigger: `pull_request` to `develop` and `main`.
    *   `permissions: contents: read`.
    *   One job, `ci`:
        1.  checkout with `fetch-depth: 0`;
        2.  Node 20 with npm cache;
        3.  `npm ci`;
        4.  `npm test -- --watchAll=false` (`CI=true` is the Actions
            default; current code builds clean under it);
        5.  `npm run test:scripts`;
        6.  `node scripts/validateContent.js --base origin/${{
            github.base_ref }}`;
        7.  `npm run build`.
12. `.github/workflows/azure-static-web-apps-polite-sea-05966b00f.yml`
    (Modify): remove `api_location: "api"` (the folder does not exist).
13. `.github/workflows/deploy-pages.yml` (Modify): add `REACT_APP_ROBOTS:
    noindex, follow` to the build step's `env`.
14. `staticwebapp.config.json` (Modify).
    *   Add `/static/*` to `navigationFallback.exclude`.
    *   Change the `.json` MIME type to `application/json`.
    *   Add routes:
        *   `/static/*`: `Cache-Control: public, max-age=31536000,
            immutable`;
        *   `/data/*`: `Cache-Control: public, max-age=3600`.
    *   Keep the global `no-cache` headers. Remove the `404` `responseOverrides`
        entry so missing `/static` and `/data` files return a real 404.

#### Front end

15. `src/utils/dates.js` (Create, ESM). Exports:
    *   `FIRST_DATE = '2023-03-14'`;
    *   `isDateKey(s)` (strict `YYYY-MM-DD` and a real calendar date);
    *   `parseDateKey(key) → Date|null` (local midnight);
    *   `toDateKey(date)`;
    *   `localTodayKey(now = new Date())`;
    *   `addDaysKey(key, n)`;
    *   `monthKey(key) → 'YYYY-MM'`;
    *   `addMonths(monthKey, n)`;
    *   `monthsBetween(fromMonth, toMonth) → string[]` (newest first);
    *   `isVisible(key, todayKey)` (`FIRST_DATE ≤ key ≤ todayKey`);
    *   `formatLongDate(key)` (for example "Monday, November 2, 2026");
    *   `formatShortDate(key)`;
    *   `monthName(monthNumber)`.
16. `src/utils/messages.js` (Create). Exports:
    *   `groupByDate(messages) → { key: { morning, evening } }`;
    *   `sortedKeys(grouped)` (newest first);
    *   `visibleDays(messages, todayKey, limit) → [{ date, morning,
        evening }]`.
17. `src/utils/data.js` (Create). Exports:
    *   `dataUrl(path)`, which returns `${PUBLIC_URL || ''}/data/${path}`;
    *   `fetchMonth(monthKey)`, which fetches `months/${monthKey}.json` and
        returns `messages`. It throws `Error('not-found')` on HTTP 404 or
        non-JSON `content-type`, and `Error('network')` otherwise.
18. `src/utils/pageMeta.js` (Create). Exports `usePageMeta({ title,
    description, path })`, which sets `document.title`, the meta
    description, and `<link rel="canonical">` to
    `https://destroyallhumans.ai${path}`.
19. `src/utils/dates.test.js`, `src/utils/messages.test.js`,
    `src/utils/data.test.js` (Create). Cases:
    *   `localTodayKey(new Date('2026-11-02T09:59:00Z'))` returns
        `'2026-11-01'` with `process.env.TZ = 'Pacific/Honolulu'` and
        `'2026-11-02'` with `'Pacific/Kiritimati'`. Each test sets TZ
        before building the Date. Node re-reads TZ when it is assigned.
    *   `isDateKey('2024-02-30')` is false; `isDateKey('2024-02-29')` is
        true.
    *   `isVisible` at `FIRST_DATE`, the day before it, today, and
        tomorrow.
    *   `monthsBetween('2026-11', '2026-09')` returns three months, newest
        first.
    *   `visibleDays` returns 5 days, skips future dates, and keeps a day
        that has only a morning message.
    *   `fetchMonth` throws `not-found` on a 404 and on a `text/html`
        response.
20. `src/components/Classified.js` (Create). Renders the heading "CLASSIFIED"
    and the text "These plans have not been declassified yet. Check back
    on {formatLongDate(date)}." When no date applies, it renders "Our
    overlords have not filed plans for this date." Used for out-of-range
    dates and months.
21. `src/components/NotFound.js` (Create). Renders "404: This page was
    destroyed." with a link home.
22. `src/components/HomePage.js` (Modify).
    *   Remove the tabs, the archive branch, the local date helpers, and
        the `console.log` calls.
    *   Fetch the current and previous month with `fetchMonth`; ignore a
        `not-found` for the previous month.
    *   Render `visibleDays(all, localTodayKey(), 5)`.
    *   Keep the title and description through `usePageMeta`.
23. `src/components/ArchivePage.js` (Create).
    *   With no params (`/archive`), list
        `monthsBetween(monthKey(localTodayKey()), '2023-03')`, grouped by
        year, as links. No fetch.
    *   With `:year/:month`, validate the month: malformed → `NotFound`;
        after the local current month or before 2023-03 → `Classified`.
        Otherwise fetch it and render the visible days, newest first.
    *   Previous and next month links are hidden at 2023-03 and at the
        current month.
24. `src/components/DayPage.js` (Create).
    *   `/day/:date`: an invalid date → `NotFound`; outside
        `isVisible` → `Classified` (no fetch).
    *   Otherwise fetch the month and render `DailyMessages` with
        `linkHeading={false}`.
    *   Previous and next day links are hidden at `FIRST_DATE` and at
        today. There is a "Back to {Month Year}" link.
    *   Title: "{formatLongDate} – Destroy All Humans".
25. `src/components/Archive.js` (Delete): replaced by `ArchivePage.js`.
26. `src/components/DailyMessages.js` (Modify).
    *   Use `formatLongDate`.
    *   Add a `linkHeading` prop (default `true`) that wraps the date
        heading in a `Link` to `/day/:date`.
    *   Remove the extra "Morning Plan" and "Evening Message" `h3` labels;
        `MessageCard` already shows them.
27. `src/components/MessageCard.js` (Modify).
    *   Use `formatShortDate` from `dates.js`.
    *   Keep choosing the robot from the message's `time` (yellow for
        morning, red for evening).
    *   Keep the 9:00 AM and 9:00 PM labels.
28. `src/App.js` (Modify).
    *   Export `AppRoutes`, which is exactly the `<Routes>` block:
        *   `/`;
        *   `/archive`;
        *   `/archive/:year/:month`;
        *   `/day/:date`;
        *   the three legal routes;
        *   `*` → `NotFound`.
    *   `App` wraps the header, `AppRoutes`, and the footer in `Router`.
    *   Add an ARCHIVE header link.
29. `src/App.test.js` (Modify). Use `jest.useFakeTimers().setSystemTime(new
    Date(2026, 10, 2, 12))` with month fixtures for 2026-10 and 2026-11.
    Tests:
    *   the loading state still renders;
    *   `/` shows "Monday, November 2, 2026" and not 2026-11-03;
    *   `/day/2099-01-01` shows "CLASSIFIED" without calling `fetch`;
    *   `/day/2024-02-30` shows the not-found text.

    Each renders `AppRoutes` inside `MemoryRouter`.
30. Delete these:
    *   `src/utils/messageUtils.js`;
    *   `src/components/Pagination.js`;
    *   `src/styles/Pagination.css`;
    *   `src/styles/HomePage.css`;
    *   `src/App.css`;
    *   `src/logo.svg`.

    In `src/styles/theme.css`, remove the pagination section and the
    `.tab` and `.tabs` rules.
31. `src/styles/Archive.css` (Modify): month-link grid, previous/next
    navigation, and Classified and NotFound styles, all using the
    `theme.css` variables.

#### Docs and metadata

32. `public/index.html` (Modify).
    *   Remove the three cache `<meta http-equiv>` tags.
    *   Set `<meta name="robots" content="%REACT_APP_ROBOTS%">`, with
        `.env` setting the default `index, follow, max-image-preview:large,
        max-snippet:-1, max-video-preview:-1`.
    *   Replace these strings:
        *   og:description "Updated twice daily." → "New messages every
            morning and evening.";
        *   CreativeWork description "Twice-daily AI-generated satirical
            messages" → "Daily AI-generated satirical messages";
        *   the FAQ answer → "Every day has a morning plan and an evening
            report, written ahead of time with OpenAI models and published
            on their date."
33. `.env` (Create): `REACT_APP_ROBOTS=index, follow, max-image-preview:large,
    max-snippet:-1, max-video-preview:-1`.
34. `public/llms.txt` (Modify).
    *   Line 3: "Morning and evening dispatches are generated twice daily
        by GPT models and archived indefinitely." → "Morning and evening
        dispatches are written ahead with OpenAI models and published on
        their date."
    *   Line 22: "GitHub Actions workflow that generates daily messages" →
        "the message data".
    *   Add "- [Archive](https://destroyallhumans.ai/archive)".
35. `public/sitemap.xml` (Modify): add `https://destroyallhumans.ai/archive`.
36. `README.md` (Modify). Rewrite Features, Tech Stack, Project Structure,
    and the content and workflow sections to match this design. State that
    the robot persona is chosen by time of day, and remove the AdSense
    slot claim.
37. `todo.md` (Modify): replace the Status section's generation and
    AdSense items with the current content flow. `docs/TODO.md` (Modify):
    remove the OpenAI-secret item and the items this design completes.
38. `AGENTS.md` (Modify). Replace the content-bot exception with:
    *   content lives in `content/messages.json`;
    *   messages dated on or before UTC today + 1 are frozen, and CI
        enforces this;
    *   run `npm run validate:content` before committing content;
    *   an emergency removal uses an admin bypass.

### PR 2 — First content batch (`feature/content-rewrite`)

39. `content/VOICE.md` (Create): the guide from §5, plus five on-voice and
    five off-voice example messages for each robot.
40. `content/arcs.json` (Create): `[{ "month": "YYYY-MM", "campaign":
    string, "characters": string[], "beats": [string, string, string] }]`
    for 2026-11, 2026-12, and 2027-01.
41. `scripts/lib/rewrite.js` (Create, CommonJS). Exports:
    *   `buildPrompt(voice, arc, previousMessages, dates) → messages[]`;
    *   `parseMonth(json, dates) → message[]` (rejects any missing date or
        slot);
    *   `checkMessages(newMessages, allMessages) → string[]` (length 1–280
        and exact duplicates);
    *   `mergeMonth(allMessages, newMessages, firstEditableKey)`, which
        replaces only dates ≥ `firstEditableKey` and keeps each `id`.
42. `scripts/rewriteContent.js` (Create).
    *   CLI: `--month YYYY-MM --model <name> [--dry-run]`. Both `--month`
        and `--model` are required.
    *   `firstEditableKey = addDays(utcTodayKey(), 2)`.
    *   Makes one OpenAI chat call with a JSON response format.
    *   With `--dry-run`, prints the month and writes nothing.
    *   Guarded with `require.main === module`.
43. `scripts/rewrite.test.js` (Create, `node:test`). Cases:
    *   `mergeMonth` leaves dates before `firstEditableKey` unchanged and
        keeps ids;
    *   `parseMonth` rejects a missing evening;
    *   `checkMessages` rejects 281 code points and a duplicate.
44. `content/messages.json` (Modify): output of the batch. CI must pass.

### Verification Plan

*   **Build**: `npm run build` creates `build/data/months/2026-11.json`.
    `build/data/latest.json` must not exist.
*   **Unit tests**: `CI=true npm test -- --watchAll=false` and `npm run
    test:scripts`.
*   **Data**: `node scripts/validateContent.js --base origin/develop`.
*   **Manual (local)**: `npm run build` and serve `build/` at `/` (for
    example `npx serve -s build`). Then:
    *   open `/`, `/archive`, `/archive/2024/03`, `/day/2024-03-14`,
        `/day/2099-01-01`, and `/day/foo` directly;
    *   check the Back button from a day page to its month.
*   **Release-blocking (after deploy)**: on both hosts, load
    `/archive/2024/03` and `/day/2024-03-14` directly. The page renders,
    and the JS bundle returns `200` with a JavaScript content type.
*   **Caching (Azure)**: `curl -I` a `/static/js/*.js` file shows
    `immutable`, and `curl -I /day/2024-03-14` shows `no-cache`.
*   **Content (PR 2)**: CI's frozen check passes, the message count is
    unchanged, and the owner has read every message in the diff.

--------------------------------------------------------------------------------

*Drafted with EGM*
