---
name: Destroy All Humans
description: The regime's page-a-day tear-off calendar. One leaf per date, a plan each morning and an incident report each night.
colors:
  wall: "#b1ca77"
  wall-ink: "#1b2311"
  wall-ink-soft: "#3a4823"
  wall-night: "#14251b"
  wall-ink-night: "#e3ebcf"
  wall-ink-soft-night: "#a9b98a"
  board: "#000000"
  board-ink: "#f3f1ea"
  board-ink-soft: "#a9a79d"
  board-rule: "#2b2b2b"
  badge-pink: "#fa6783"
  badge-yellow: "#ffcc00"
  paper: "#fcfcf9"
  paper-under: "#ecebe3"
  paper-rule: "#b9b8ad"
  ink: "#151515"
  ink-soft: "#57564f"
  ink-red: "#c8102e"
  ink-red-text: "#a80d26"
  ink-yellow: "#ffcc00"
  on-red: "#ffffff"
typography:
  plan:
    fontFamily: "'Libre Franklin Variable', 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.3rem, 4.5cqi, 2.2rem)"
    fontWeight: 600
    lineHeight: 1.26
    letterSpacing: "-0.005em"
  report:
    fontFamily: "'Courier Prime', 'Courier New', monospace"
    fontSize: "clamp(1.125rem, 3.5cqi, 1.6rem)"
    fontWeight: 400
    lineHeight: 1.45
  date-numeral:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(3rem, 7vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  unprinted-numeral:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(5.5rem, 29vw, 11rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  slip-numeral:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "2.5rem"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  tally:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(1.55rem, 6.4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1
  tally-rest:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(0.8125rem, 2.6vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.25
  sheet-title:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(2rem, 8vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.02
  wall-title:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(1.4rem, 5vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.1
  band-title:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(1.05rem, 4.2cqi, 1.6rem)"
    fontWeight: 400
    lineHeight: 1.1
  stamp:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(0.95rem, 3cqi, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.12
  body-strong:
    fontFamily: "'Libre Franklin Variable', 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Libre Franklin Variable', 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  status:
    fontFamily: "'Libre Franklin Variable', 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.5
  control:
    fontFamily: "'Libre Franklin Variable', 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.5
  date-label:
    fontFamily: "'Libre Franklin Variable', 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(0.9375rem, 2.4vw, 1.3rem)"
    fontWeight: 800
    lineHeight: 1.15
  note:
    fontFamily: "'Libre Franklin Variable', 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
  fine:
    fontFamily: "'Libre Franklin Variable', 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontFamily: "'Libre Franklin Variable', 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1.2
rounded:
  none: "0"
  board: "5px 5px 0 0"
  round: "50%"
spacing:
  gutter: "clamp(1rem, 4vw, 2rem)"
  calendar-width: "92rem"
  paper-inset: "clamp(1.1rem, 4vw, 2.25rem)"
  slip-inset: "1.2rem"
  plate: "clamp(5.75rem, 23cqi, 10.5rem)"
  tap-target: "2.75rem"
  measure: "34rem"
components:
  backer-board:
    backgroundColor: "{colors.board}"
    textColor: "{colors.board-ink}"
    rounded: "{rounded.board}"
    padding: "clamp(1.15rem, 3vw, 1.5rem) clamp(1.1rem, 4vw, 2.25rem) clamp(0.6rem, 2vw, 0.9rem)"
  board-link:
    textColor: "{colors.board-ink}"
    typography: "{typography.control}"
    height: "{spacing.tap-target}"
  rail:
    backgroundColor: "{colors.board}"
    textColor: "{colors.board-ink}"
    padding: "0 clamp(1.1rem, 4vw, 2.25rem)"
    height: "{spacing.tap-target}"
  rail-link-hover:
    textColor: "{colors.badge-yellow}"
  rail-link-unprinted:
    textColor: "{colors.board-ink-soft}"
    padding: "0.2rem 0.55rem"
  leaf:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.1rem, 4vw, 2.25rem)"
  sheet-unprinted:
    backgroundColor: "transparent"
    textColor: "{colors.wall-ink}"
    padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.1rem, 4vw, 2.25rem)"
  band-plan:
    backgroundColor: "{colors.ink-yellow}"
    textColor: "{colors.board}"
    typography: "{typography.band-title}"
    padding: "0.45rem clamp(1.1rem, 4vw, 2.25rem)"
    height: "3.5rem"
  band-report:
    backgroundColor: "{colors.ink-red}"
    textColor: "{colors.on-red}"
    typography: "{typography.band-title}"
    padding: "0.45rem clamp(1.1rem, 4vw, 2.25rem)"
    height: "3.5rem"
  band-report-sealed:
    backgroundColor: "transparent"
    textColor: "{colors.ink-red-text}"
    typography: "{typography.band-title}"
  robot-plate:
    backgroundColor: "{colors.board}"
    rounded: "{rounded.none}"
    size: "{spacing.plate}"
  verdict-stamp:
    textColor: "{colors.ink-red}"
    typography: "{typography.stamp}"
    padding: "0.4rem 0.85rem 0.3rem"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    padding: "0.55rem 1.1rem"
    height: "{spacing.tap-target}"
  button-ink-hover:
    backgroundColor: "{colors.ink-red}"
    textColor: "{colors.on-red}"
  button-ink-wall:
    backgroundColor: "{colors.wall-ink}"
    textColor: "{colors.wall}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    padding: "0.55rem 1.1rem"
    height: "{spacing.tap-target}"
  wall-link:
    textColor: "{colors.wall-ink}"
    typography: "{typography.control}"
    height: "{spacing.tap-target}"
  slip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.45rem 1.2rem 1.25rem"
  slip-date-tag:
    backgroundColor: "{colors.ink-yellow}"
    textColor: "{colors.board}"
    typography: "{typography.label}"
    padding: "0.15rem 0.35rem 0.1rem"
  next-leaf:
    backgroundColor: "{colors.paper-under}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.note}"
    padding: "0.7rem clamp(0.5rem, 4vw, 1.65rem) 0.65rem"
  planner-day:
    textColor: "{colors.ink}"
    height: "clamp(2.75rem, 11vw, 3.75rem)"
  planner-day-hover:
    backgroundColor: "{colors.ink-yellow}"
    textColor: "{colors.board}"
  planner-day-unprinted:
    textColor: "{colors.paper-rule}"
---

# Design System: Destroy All Humans

## Overview

**Creative North Star: "The Regime's Page-a-Day Calendar"**

The site is one object: a tear-off calendar hanging from a nail on a break-room wall. A slim black backer board carries the robot badge and the running tally. A block of white paper leaves hangs under it. Each date is one leaf. Older leaves are torn off and pinned to the wall below.

The day's words lead the leaf. The date is one compact line at the top. Under it are the plan and the incident report, each with its robot's portrait on a square black plate. On wide screens the two sit side by side with a perforation between them. On narrow screens the report is a stub below the plan. The report is typed in red and rubber-stamped once it is filed.

Everything on screen is one of three surfaces: wall, board or paper. Each has its own inks and they do not mix. The look is flat print. There are no textures, bevels or decorative gradients. The only depth cue is the shadow the calendar casts on the wall. The calendar is fluid: it fills the screen up to 92rem and its contents reflow into columns. This system replaces the earlier dark neon bulletin; none of that look carries over.

**Key Characteristics:**
- Three surfaces: sage wall, black board, white paper.
- Three spot inks on paper: black, report red, plan yellow.
- The plan and the report lead a dated page. The date is one compact line.
- Both robots are shown large, each on a black plate beside its words.
- One line grammar: dotted tears, dashed is not yet, solid is filed.
- A 9:00 PM shift change. Robot art is cropped, never redrawn.
- Fluid to 92rem. Nothing is a fixed narrow column.
- Square corners, flat ink, one shadow.
- Motion is paper settling and a stamp landing.

## Colors

A sage wall, a black board and white paper printed in three spot inks.

### Primary
- **Report Red** (`ink-red`, #c8102e): the red robot's ink. Used for the incident report band, the verdict stamp, Sunday numerals, the pen ring around today in the planner, and the hover state of ink buttons and slip numerals.
- **Report Red, Text** (`ink-red-text`, #a80d26): the darker cut of the same ink for running text. Used for the typed report, the countdown, the sealed band's lettering, link hovers on paper, and the CLASSIFIED stamp on the day wall.
- **Plan Yellow** (`ink-yellow`, #ffcc00): the yellow robot's ink. On paper it is always a fill behind black: the plan band, the highlighter tag on a slip, and the hover fill of planner and month cells. It is also the text selection colour.

### Secondary
- **Badge Pink** (`badge-pink`, #fa6783): the pink of the badge lettering. Used for the day count on the board.
- **Badge Yellow** (`badge-yellow`, #ffcc00): the yellow of the badge lettering. Used for the second line of the tally, the current-page underline, rail link hovers and focus rings on the board. Same value as Plan Yellow; kept as a separate token because it belongs to the board.

### Neutral
- **Break-Room Sage** (`wall`, #b1ca77): the wall by day. Taken from the badge outline. Also shows through the nail hole, the notches beside the report perforation and the torn top edge of slips.
- **Wall Ink** (`wall-ink`, #1b2311) and **Wall Ink, Soft** (`wall-ink-soft`, #3a4823): text written on the wall, the footer rule, link underlines, and the dashed outline of an unprinted sheet.
- **Bottle Green** (`wall-night`, #14251b): the wall on the night shift, with **Night Wall Ink** (`wall-ink-night`, #e3ebcf) and **Night Wall Ink, Soft** (`wall-ink-soft-night`, #a9b98a).
- **Board Black** (`board`, #000000): the backer board, the rail and the robot plates. The black ground the robot art is drawn on. Also the text colour on yellow fills.
- **Board Ink** (`board-ink`, #f3f1ea), **Board Ink, Soft** (`board-ink-soft`, #a9a79d), **Board Rule** (`board-rule`, #2b2b2b): links on the board, the unprinted rail tag, and the hairline between board and rail.
- **Paper** (`paper`, #fcfcf9): every leaf, sheet and slip.
- **Paper Under** (`paper-under`, #ecebe3): tomorrow's leaf and the page edges of the stack.
- **Paper Rule** (`paper-rule`, #b9b8ad): perforations, printed hairlines, and the numerals and outlines of unprinted days.
- **Black Ink** (`ink`, #151515) and **Black Ink, Soft** (`ink-soft`, #57564f): text on paper and the small notes.
- **White on Red** (`on-red`, #ffffff): type reversed out of a Report Red fill: the report band and the hover state of ink buttons.

### Named Rules
**The Three Surfaces Rule.** Every element sits on the wall, the board or the paper, and takes its colours from that surface's tokens. Wall text uses wall inks. Board text uses board inks. Paper uses the three spot inks.

**The Three Inks Rule.** Paper prints in black, Report Red and Plan Yellow and nothing else. Greys on paper are the soft black and the rule colour. Yellow on paper is a fill behind black, never lettering. The robot plates are photographs of the brand art on Board Black, not a fourth ink.

**The Badge Lettering Rule.** Pink and yellow lettering belongs to the board, where it echoes the badge: pink over yellow. One exception ships: the CLASSIFIED stamp turns Badge Pink on the night wall, because Report Red does not read on Bottle Green.

**The Night Shift Rule.** From 9:00 PM local time the root gets `data-shift="night"`. The wall and its inks change to the Bottle Green set, the wall shadow deepens, and the red robot's badge replaces the yellow one on the board. Paper and board tokens do not change. `color-scheme` switches from light to dark. The wall fades over 0.8s.

## Typography

**Display Font:** Bowlby One (with Arial Black, sans-serif)
**Body Font:** Libre Franklin Variable (with Libre Franklin, Helvetica Neue, Arial, sans-serif)
**Label/Mono Font:** Courier Prime (with Courier New, monospace)

**Character:** A fat poster face for numerals and titles, a plain grotesque for everything read, and a typewriter for the incident report. All three are self-hosted through @fontsource. Bowlby One ships in one weight (400) and is set uppercase for titles.

The root font size is `clamp(100%, 0.5625rem + 0.45vw, 125%)`, so every rem value below grows a little on screens wider than about 1600px. Sizes inside a dispatch use container units (`cqi`): they follow the dispatch's own width, whether it stacks or sits two-up.

### Hierarchy
- **Plan** (Libre Franklin 600, `clamp(1.3rem, 4.5cqi, 2.2rem)`, line-height 1.26, tracking -0.005em): the morning message. It is the headline of the leaf.
- **Report** (Courier Prime 400, `clamp(1.125rem, 3.5cqi, 1.6rem)`, line-height 1.45): the evening message, in Report Red, Text. The countdown under a sealed report is `clamp(1.0625rem, 3cqi, 1.3rem)`. On a slip the report is 1.0625rem.
- **Date numeral** (Bowlby One 400, `clamp(3rem, 7vw, 4.25rem)`, line-height 0.86, tracking -0.04em): the date in a leaf's header line.
- **Unprinted numeral** (Bowlby One 400, `clamp(5.5rem, 29vw, 11rem)`, 2px outline, no fill): the date of a page that is not printed yet. It stands in for the words that are missing.
- **Tally** (Bowlby One 400, `clamp(1.55rem, 6.4vw, 3rem)`, line-height 1, uppercase, tabular figures): the day count on the board, with a second line at `clamp(0.8125rem, 2.6vw, 1.125rem)`.
- **Sheet title** (Bowlby One 400, `clamp(2rem, 8vw, 3.5rem)`, line-height 1.02, uppercase): the title of an archive sheet or a legal page.
- **Slip numeral** (Bowlby One 400, 2.5rem, line-height 0.86, tracking -0.04em): the date on a torn-off slip.
- **Wall title** (Bowlby One 400, `clamp(1.4rem, 5vw, 2rem)`, line-height 1.1, uppercase): headings written on the wall.
- **Band title** (Bowlby One 400, `clamp(1.05rem, 4.2cqi, 1.6rem)`, line-height 1.1, uppercase): "The Plan" and "Incident Report".
- **Body, strong** (Libre Franklin 600, 1.0625rem, line-height 1.4): the plan on a slip, the premise on the wall, sheet ledes.
- **Body** (Libre Franklin 400, 1.0625rem, line-height 1.6): legal pages.
- **Status** (Libre Franklin 500, 1.125rem): loading, error and empty messages.
- **Control** (Libre Franklin 700, 1rem): buttons and links.
- **Date label** (Libre Franklin 800 for the weekday and 700 for the month, `clamp(0.9375rem, 2.4vw, 1.3rem)`, line-height 1.15, uppercase): weekday and month beside the numeral.
- **Note** (Libre Franklin 600, 0.875rem): tomorrow's leaf, rail labels (700), the copyright and last-updated lines (400).
- **Fine** (Libre Franklin 500 to 600, 0.8125rem, tabular figures): the notes in the date line, the band byline and the printed page address.
- **Label** (Libre Franklin 800, 0.75rem, uppercase): the date tag on a slip and the weekday row of the planner.

### Named Rules
**The Words Lead Rule.** On a dated page the plan and the report are the main event and take the room. The date is one compact header line: numeral, weekday and month, with the notes at the right. The date does not grow past that line. This replaces the earlier rule that made the date numeral the largest element.

**The Headline Plan Rule.** The plan is set at headline size in Libre Franklin 600. It is not a caption under a title.

**The Typed Report Rule.** Courier Prime is used for the incident report and its countdown only. Nothing else is typed.

## Layout

The calendar is centred and fluid. It fills the screen up to 92rem, inside a page gutter of `clamp(1rem, 4vw, 2rem)`, and hangs `clamp(1.25rem, 4vw, 2.5rem)` from the top of the wall. Words sit `clamp(1.1rem, 4vw, 2.25rem)` from the edge of any paper and of the board (`--paper-inset`), so text keeps one left edge on every page.

The order from the top is fixed:
1. Backer board: badge on the left, then the tally and the two navigation links. Tally and links share a line where there is room and wrap where there is not.
2. Rail: previous, up and next, in three columns on the board's black.
3. The leaf: the date line, the spread (plan and report), then a foot with the page address and the share button.
4. Tomorrow's leaf showing underneath (today only), then two page edges for the rest of the year.
5. On the wall: the one-line premise, then torn-off slips, then the footer under a 2px rule.

Layouts reflow by width:
- **Date line:** one row. At 30rem and below the notes wrap under the numeral and labels, left-aligned.
- **Spread:** plan and report side by side in two equal columns from 76rem, with a vertical dotted perforation between them. Each half is then at least 34rem wide, so its words get their own column. Below 76rem they stack, with a horizontal perforation and a notch at each end.
- **Dispatch:** a size container. At a dispatch width of 34rem and up the words get their own column beside the plate and the hour moves to the end of the band. Below that the words wrap around the plate, the title takes a full line, and the byline and hour share the next.
- **Slips:** `repeat(auto-fill, minmax(min(100%, 19rem), 1fr))`. One column on a phone, up to four across at full width.
- **Month page:** from 68rem the planner sheet (22rem to 29rem wide, sticky 1rem from the top) sits beside the month's slips. Below 68rem the planner is on top.
- **Archive index:** years sit in columns of at least 22rem. Each year is six month cells per row, four at 40rem and below.
- **Legal pages:** text flows in CSS columns of 30rem. The title and the last-updated line span all columns.
- **Rail:** at 22rem and below the centre link shows a short label.

The month planner is a seven-column grid that scales and never scrolls sideways. Date, plan and report keep the same order on every leaf. Interactive targets are at least 2.75rem tall. Status and wall text is capped at 34rem, legal sections at 40rem.

### Named Rules
**The Fill the Wall Rule.** Nothing is a fixed narrow column. On a wide screen the calendar widens to 92rem and its contents go side by side: plan beside report, planner beside slips, year beside year, legal text in columns. Type scales up past about 1600px.

## Elevation & Depth

Flat. Surfaces are solid colour with no gradients, textures, bevels or inner shadows. The only shadow is the one a hanging object casts on the wall. Nothing on paper casts a shadow on paper; the robot plates have none.

### Shadow Vocabulary
- **Hanging shadow** (`box-shadow: 0 22px 30px -18px var(--wall-shadow)`): under the board, the leaf and plain sheets.
- **Pinned shadow** (`box-shadow: 0 14px 18px -12px var(--wall-shadow)`): under torn-off slips.
- `--wall-shadow` is `rgba(27, 35, 17, 0.34)` by day and `rgba(0, 0, 0, 0.6)` on the night shift.

### Named Rules
**The Flat Ink Rule.** Ink is flat. No textures, no bevels, no gradients for decoration. The one CSS gradient in the build draws a solid shape: the torn bites along a slip's top edge.

## Shapes

Paper has square corners (radius 0). Buttons, bands, cells, slips and robot plates are square too. The board has 5px top corners and square bottom corners. Circles (50%) are used only for holes: the nail hole and the two notches at the ends of the stacked report perforation.

Lines carry meaning:
- **Dotted, 3px, Paper Rule:** a perforation. Top of the leaf, between plan and report (horizontal when stacked, vertical when side by side), above the report on a slip, above the last-updated line.
- **Dashed:** not printed or not filed yet. 2px for the sealed report band, tomorrow's leaf, the unprinted sheet and a sealed slip report. 1.5px for small items: the unprinted rail tag, unprinted days and months.
- **Solid:** printed. 1px Paper Rule for grid lines and the leaf foot. 2px Black Ink across the top of the planner and year grids. 2px Wall Ink, Soft above the footer.
- **Double, 4px:** the border of a rubber stamp.

Stamps are rotated: -5deg for the verdict, -3deg for CLASSIFIED. Slips on the home page are tilted between -0.55deg and 0.45deg and straighten on hover or focus. An unprinted date is drawn as a 2px outline numeral with no fill.

### Named Rules
**The Line Grammar Rule.** Dotted is a perforation. Dashed is not printed or not filed yet. Solid is filed. Do not use a dashed or dotted line for anything else.

## Components

### Backer board
- **Shape:** a slim black block with 5px top corners. A 0.7rem wall-coloured nail hole sits at the top centre.
- **Content:** the badge of the robot on shift (yellow by day, red at night), width `clamp(4.25rem, 14vw, 6.75rem)`, linked to today. Then the tally in Badge Pink over Badge Yellow.
- **Navigation:** two links in Board Ink, weight 700. The underline is 2px and transparent at rest, Board Ink on hover and Badge Yellow on the current page. Focus rings on the board are Badge Yellow.

### Rail
- **Style:** a strip in Board Black under a 1px Board Rule line. Previous on the left with a left arrow, the month or year in the centre with a Board Rule underline, next on the right with a right arrow. Text is 0.875rem, weight 700, tabular figures.
- **Narrow phones:** at 22rem and below the centre link shows a short label ("Nov 2026" for "November 2026") so the three labels keep their gaps.
- **Hover:** Badge Yellow text.
- **Unprinted next:** Board Ink, Soft text inside a 1.5px dashed outline. It is not a link.

### Leaf
- **Paper:** square, Paper background, Hanging shadow. A 3px dotted perforation runs 0.6rem from the top. Nothing else marks the top edge.
- **Date line:** the date numeral, then weekday over month, then the small notes pushed to the right. On Sundays the numeral and weekday are Report Red.
- **Spread:** the plan dispatch and the report dispatch. See Layout for when they sit side by side.
- **Foot:** a 1px Paper Rule line, the page address in Fine, and the share button on the right.
- **Motion:** each time a new date is shown the leaf settles: from `rotate(-1.1deg) translateY(-0.6rem)` to rest in 0.55s on `cubic-bezier(0.16, 1, 0.3, 1)`, pivoting from the top centre.

### Dispatch
- **Band:** at least 3.5rem tall. Plan Yellow fill with black text for the plan. Report Red fill with White on Red text for the report. It holds the title, the byline (0.8125rem, weight 600) and the hour (0.9375rem, weight 800, tabular; 1.125rem in a roomy dispatch). The band's text starts to the right of the plate.
- **Robot plate:** a square crop of the robot on Board Black, `clamp(5.75rem, 23cqi, 10.5rem)` on a side. It sits at the left of the words and rises 3.1rem into the band.
- **Words:** the plan in the Plan style, or the report in the Report style.
- **Sealed (before 9:00 PM):** the band has no fill, a 2px dashed Report Red outline and lettering in Report Red, Text. The placeholder text is Black Ink, Soft, with a typed countdown below. The red robot's plate stays in full colour at full size.

### Verdict stamp
- **Style:** Bowlby One, uppercase, Report Red, inside a 4px double border, rotated -5deg, pushed to the right under a filed report.
- **Motion:** when the seal lifts while the leaf is on screen, the stamp lands: from `rotate(-12deg) scale(1.9)` at opacity 0 to rest in 0.5s on the same ease-out.
- **CLASSIFIED variant:** the same double border at `clamp(1.9rem, 9vw, 3.5rem)`, rotated -3deg, over the outline numeral of an unprinted date.

### Buttons
- **Shape:** square printed blocks of ink, at least 2.75rem tall, padding 0.55rem 1.1rem, weight 700, optional 1.15em icon on the left.
- **On paper:** Black Ink fill, Paper text. The share button is the same block.
- **On the wall:** Wall Ink fill, Wall text, so it inverts with the shift.
- **Hover:** Report Red fill with White on Red text, 0.2s.
- **Focus:** a 3px solid outline in the current text colour, offset 3px. This is the focus style for every control.
- **Text button:** no fill, weight 700, 2px underline. Hover turns it Report Red, Text.

### Sheets
- **Plain sheet:** Paper, square, Hanging shadow, for the archive, legal and error content.
- **Unprinted sheet:** no fill and no shadow. A 2px dashed Wall Ink, Soft outline with the top edge open, and text in wall inks. Used for unpublished dates and the 404 page.

### Slips
- **Style:** a small Paper sheet with the Pinned shadow and a row of wall-coloured bites along the top edge.
- **Date:** slip numeral beside a Plan Yellow highlighter tag holding weekday and month. The numeral turns Report Red on hover and on Sundays.
- **Body:** the plan in Body, strong. Below a 3px dotted perforation, the report typed in Report Red, Text. A sealed report has a 2px dashed line instead and Black Ink, Soft text.

### Planner and year grids
- **Grid:** 2px Black Ink top rule, 1px Paper Rule cell lines.
- **Planner day:** Bowlby One at `clamp(1.1rem, 4.6vw, 1.6rem)`, cell height `clamp(2.75rem, 11vw, 3.75rem)`. Sundays are Report Red. Today has a hand-drawn Report Red pen ring.
- **Month cell:** Libre Franklin 800, uppercase, 3rem tall.
- **Hover:** Plan Yellow fill, black text, 0.2s.
- **Unprinted:** Paper Rule text inside a 1.5px dashed inset outline. Not a link.

### Wall links and footer
- **Style:** Wall Ink, weight 700 (600 in the footer), 2px underline in Wall Ink, Soft that turns to the text colour on hover.

### Icons
- One drawn SVG set: 24px grid, 2.25px stroke, square caps, mitre joins, `currentColor`. Five icons: left, right, share, check, retry.

### Named Rules
**The Two Robots Rule.** The yellow robot plans in the morning and holds the board by day. The red robot reports in the evening and takes the board at night. Each dispatch shows its robot large, on a black plate. The red robot is on the page all day: before 9:00 PM its plate stays in full colour beside the sealed report. Both robots are binding brand art. The site ships crops of `robot-yellow.jpg` and `robot-red.jpg` (`badge-*.webp` and `plate-*.webp`). The art is cropped, never redrawn, recoloured, filtered or regenerated.

**The Paper Moves Rule.** Only two things animate: the leaf settling and the stamp landing. Slips straighten on hover. Everything else is a 0.2s colour change, plus the 0.8s wall change at the shift. Under `prefers-reduced-motion: reduce` the animations, the slip movement and the wall fade are all removed.

## Do's and Don'ts

### Do:
- **Do** place every new element on one of the three surfaces and use that surface's tokens.
- **Do** keep paper to black, Report Red and Plan Yellow. Use Plan Yellow as a fill behind black text.
- **Do** give the plan and the report the room on a dated page, and keep the date to its one header line.
- **Do** set the plan at headline size and type the report in Courier Prime in Report Red, Text.
- **Do** show each robot large on its black plate, the red one included while the report is sealed.
- **Do** use dotted for perforations, dashed for not printed or not filed yet, and solid for filed.
- **Do** use the real robot crops in `src/assets/images/` and keep their provenance files with them.
- **Do** let content fill wide screens: the spread side by side from 76rem, the month page from 68rem, auto-fill grids for slips and years.
- **Do** size things inside a dispatch in container units, so they hold stacked or two-up.
- **Do** use `--paper-inset` for the side padding of any paper.
- **Do** keep corners square on paper, buttons, plates and cells. Only the board's top corners are rounded (5px).
- **Do** keep interactive targets at least 2.75rem tall and keep the 3px focus outline.
- **Do** check new work on both shifts. Anything on the wall must read on Break-Room Sage and on Bottle Green.
- **Do** remove movement under `prefers-reduced-motion: reduce`.

### Don't:
- **Don't** add a fourth ink to paper, or a tint of red or yellow.
- **Don't** use pink or yellow lettering off the board.
- **Don't** enlarge the date on a leaf past its header line. The outline numeral on an unprinted page is the one large date.
- **Don't** shrink, grey out or hide the red robot before 9:00 PM.
- **Don't** redraw, recolour, filter, trace or generate the robots, and don't make a stand-in mark.
- **Don't** hold content in a fixed narrow column on a wide screen.
- **Don't** use textures, bevels, inner shadows or decorative gradients.
- **Don't** add a shadow to anything that is not hanging on or pinned to the wall.
- **Don't** use a dashed or dotted line as decoration.
- **Don't** use Courier Prime for anything but the incident report and its countdown.
- **Don't** animate anything other than paper settling and the stamp landing.
- **Don't** bring back the dark neon terminal look or a feed of post cards.
- **Don't** let the month planner scroll sideways.
