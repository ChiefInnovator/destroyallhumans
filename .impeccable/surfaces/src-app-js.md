---
version: 1
slug: "src-app-js"
primary_target: "src/App.js"
related_targets: []
---

# Surface brief: whole site (src/App.js)

Scope: home, day, archive index, archive month, status and legal pages. Mode: Experience (the daily joke leads). Build path: code-led (no image generation available).

Audience and job: tech and AI crowd on a phone, arriving from a shared link; read today's plan, come back at 21:00 for the report, pass a day on.

Constraints: both robot avatars stay; evening report sealed until 21:00 local; future dates hidden; WCAG 2.2 AA.

## Direction contract

THESIS: The site is the regime's page-a-day tear-off calendar. One leaf per date. Refuses the feed of social-post cards on a dark neon terminal.

OWN-WORLD: Break-room wall in the badge's sage green (night-shift bottle green after 21:00). Black backer board carrying the real robot badge. White paper leaves printed in three spot inks only: black, report red, plan yellow. Perforations, staples, torn stubs. Bowlby One numerals, Libre Franklin text, Courier Prime for the typed incident report.

STORY: A visitor sees today's date, reads the plan, sees the report is due at 21:00 (or reads it), learns the uprising has failed every day so far, shares the leaf.

FIRST VIEWPORT: Backer board on top with badge and the tally "Day N of the uprising. Humans destroyed: 0". Today's leaf directly below: weekday and month line, date numeral as the largest element, plan text at headline scale. Share sits on the leaf's foot.

FORM: tear-off page-a-day calendar, position 4 of 7. seed:7361e5f892a63929

Raises:
- Pattern envelope: one state grammar. Solid ink means filed; dashed outline means not yet (sealed report, future days, unprinted months).
- Build instructions: the date numeral is the largest element on every surface and is the navigation.
- Risograph: three spot inks on paper, nothing else.
- Street poster: the plan is set at headline scale.
- Step row: the month grid never scrolls sideways; today is always marked.
- Pulp rack: date, plan and report hold fixed positions on every leaf.

Signature interaction: the 21:00 filing. A dashed stub counts down, then the report is stamped in. Motion grammar: paper settles (rotate and drop, ease-out); nothing else moves.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Per-day social preview images need server rendering; all pages share one og-image.
