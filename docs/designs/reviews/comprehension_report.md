# Stage 6 — Comprehension Test

*   **Target:** `docs/designs/system-design.md` (FeatureRange 1–435, DetailedRange 436–626)
*   **Reviewer:** `egm-comprehension` (Goldfish, fresh context)

## What this proposes

The document proposes rebuilding the content pipeline for a satirical static
React site. All messages, including pre-written future ones to 2030, move out
of `public/` into a private `content/messages.json`. A prebuild script then
publishes only dates up to "UTC today + 2" as small files: a 7-day
`recent.json` and one archive file per month. Both deployments (Azure SWA and
GitHub Pages) get a daily 00:05 UTC scheduled rebuild, so a new day appears
without any commit. The old OpenAI generator that truncates the data is
deleted.

On the front end, the archive becomes real routes (`/archive`,
`/archive/yyyy/mm`, `/day/date`). The four copies of the date helpers are
merged into one module, and caching headers are fixed. A new CI workflow
validates the data rules and blocks PRs that delete dates. Separately, a
one-time, hand-run batch rewrite regenerates every not-yet-published message
against a written voice guide and monthly story arcs. The rewrite only
touches dates at least 3 days out and lands as its own PR.

## How the existing system works, per this document

Today the site is a backend-less CRA single-page app. On every visit it
downloads one 1.3 MB `public/data/latest.json` holding about 5,700 morning
and evening messages from 2023-03-14 to 2030-12-31, then filters them by the
visitor's local date. A twice-daily `generate-messages.yml` workflow would
prepend a message and keep only 60 entries, which would wipe the history. It
has only stayed harmless because it has failed since June 2026, and it is
now disabled. That workflow apparently pushed to `main` as a "content bot"
through a deploy key that bypasses a branch ruleset.

The archive is a tab inside `HomePage`. Global `no-cache` headers defeat
caching of the bundles. Several modules and data copies are dead code. The
docs claim live GPT generation, tone-based avatars and an AdSense slot, none
of which exist.

## Findings

| # | Severity | Scope | Finding |
|---|----------|-------|---------|
| C1 | Major | G8, §6 | "Impeccable" is never defined or linked. G8 is listed as a goal, but the design defers it and gives no acceptance criteria. Define and link it, then move G8 to Non-Goals or Dependencies. |
| C2 | Major | Lines 162–163, 218–221, 345–346, 487–490, 584–586 | The current repo governance is never introduced: the content bot pushing to `main`, `CONTENT_BOT_DEPLOY_KEY`, the deploy-key bypass, "both rulesets", the `branch-policy` check, and the `AGENTS.md` exception. Add a "current repository governance" paragraph. |
| C3 | Major | NFR Rollback | The rollback text contradicts itself (re-enable the workflow, then keep it disabled). It doesn't say how new days appear after reverting PR 1, or how to revert PR 1 once PR 2 has changed `content/messages.json`. |
| C4 | Major | §2, `/` route, CUJ 1 | "7 days up to the cutoff" (UTC today + 2) leaves only 4 visible days for a UTC-10 visitor, but CUJ 1 promises 5, and a missed build makes it worse. The size figure is also wrong: 7 days is 14 messages, not 18. State the window as N days before local today, worked out from the worst-case time zone and missed builds. |
| C5 | Major | §4 generator, item 39 | The "banned-term list" has no defined location or owner, and its link to the voice-guide limits is unstated. Say which limits are machine-checked and which rely on the owner's sample read. |
| C6 | Nit | NFR Reliability | The 60-day schedule-disable risk isn't tied to this design removing the bot commits. Say what the owner does when GitHub's warning email arrives. |
| C7 | Nit | Line 250 | Explain the GitHub Pages `404.html` fallback mechanism, or point to the workflow step that sets it up. |
| C8 | Nit | Line 249, items 22/23/27/28 | The "classified" copy is undefined, and it's unclear how it differs from the catch-all "not found" message. |
| C9 | Nit | Line 318, 325, item 38 | It's unclear whether dry-run samples share the checkpoint folder, which could let a sample be merged by mistake. |
| C10 | Nit | §2 vs items 12–13 | The workflows' current triggers and `if` condition aren't stated, so the edits are ambiguous. |
| C11 | Nit | Item 20 vs Problem 5 | Deleting `HomePage.css`, `App.css` and `logo.svg` isn't mentioned upstream. |
| C12 | Nit | Problem 4 | "Never reviewed on the day" doesn't follow from "future messages are public". State the causal link directly. |
| C13 | Nit | Route table vs item 27 | Route parameter names don't match. |

**Overall:** The document is mostly self-contained, and both paraphrases
could be written. The main gaps are C1–C4.
