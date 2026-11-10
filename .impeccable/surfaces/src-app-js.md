---
version: 1
slug: "src-app-js"
primary_target: "src/App.js"
related_targets: []
---

# Surface brief: whole site (src/App.js)

Scope: home, day, archive index, archive month, status and legal pages. Mode: Experience (the daily joke leads). Build path: code-led (no image generation available).

Audience and job: tech and AI crowd on a phone, arriving from a shared link; read today's plan, come back at 21:00 for the report, pass a day on.

Owner corrections after the first release (2026-11-10), which override the roll: the day's words lead the page, not the date; both robots are seen large, the red one included before 21:00; the layout fills wide screens.

Constraints: both robot avatars stay; evening report sealed until 21:00 local; future dates hidden; WCAG 2.2 AA.

## Direction contract

THESIS: The site is the regime's page-a-day tear-off calendar. One leaf per date. Refuses the feed of social-post cards on a dark neon terminal.

OWN-WORLD: Break-room wall in the badge's sage green (night-shift bottle green after 21:00). Black backer board carrying the real robot badge. White paper leaves printed in three spot inks only: black, report red, plan yellow. Each dispatch carries its robot's portrait on a black plate that breaks up into its band. Perforations and torn edges. Bowlby One numerals, Libre Franklin text, Courier Prime for the typed incident report.

STORY: A visitor sees today's date, reads the plan, sees the report is due at 21:00 (or reads it), learns the uprising has failed every day so far, shares the leaf.

FIRST VIEWPORT: A slim backer board with badge and the tally "Day N of the uprising. Humans destroyed: 0". Today's leaf directly below: one compact date line, then the plan and the report as the two largest things on the page, each with its robot's portrait. They sit side by side from 76rem and stack below it. Share sits on the leaf's foot.

FORM: tear-off page-a-day calendar, position 4 of 7. seed:7361e5f892a63929

Raises:
- Pattern envelope: one state grammar. Solid ink means filed; dashed outline means not yet (sealed report, future days, unprinted months).
- Build instructions: withdrawn on the owner's correction. The date is a header; the words are the largest thing on a dated page.
- Risograph: three spot inks on paper, nothing else.
- Street poster: the plan is set at headline scale.
- Step row: the month grid never scrolls sideways; today is always marked.
- Owner: the calendar is fluid to 92rem and type scales up past 1600px; nothing is a fixed narrow column.
- Pulp rack: date, plan and report hold fixed positions on every leaf.

Signature interaction: the 21:00 filing. A dashed stub counts down, then the report is stamped in. Motion grammar: paper settles (rotate and drop, ease-out); nothing else moves.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Per-day social preview images need server rendering; all pages share one og-image.
