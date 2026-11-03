---
name: Destroy All Humans
description: The daily bulletin of an AI that keeps failing to take over the world.
colors:
  bulletin-black: "#0a0e17"
  void-black: "#070b12"
  panel-slate: "#111827"
  rule-slate: "#1e293b"
  readout-white: "#ffffff"
  static-gray: "#a0aec0"
  alarm-red: "#ff0022"
  scanline-cyan: "#00e5ff"
  glitch-magenta: "#ff00ff"
  plan-amber: "#fbbf24"
  report-red-text: "#ff4d5e"
typography:
  display:
    fontFamily: "'Courier New', monospace"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0em"
  display-sm:
    fontFamily: "'Courier New', monospace"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "'Courier New', monospace"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.08em"
  subhead:
    fontFamily: "'Courier New', monospace"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "'Courier New', monospace"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "'Courier New', monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Courier New', monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.05em"
  caption:
    fontFamily: "'Courier New', monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "50%"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  xxl: "3rem"
components:
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.scanline-cyan}"
    rounded: "{rounded.none}"
    padding: "0.5rem 1rem"
  nav-link-hover:
    backgroundColor: "{colors.scanline-cyan}"
    textColor: "{colors.void-black}"
  message-card:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.readout-white}"
    rounded: "{rounded.sm}"
    padding: "1rem"
  robot-avatar:
    rounded: "{rounded.full}"
    size: "56px"
  footer-link:
    textColor: "{colors.static-gray}"
  footer-link-hover:
    textColor: "{colors.scanline-cyan}"
---

# Design System: Destroy All Humans

## Overview

**Creative North Star: "The Evil Daily Bulletin"**

The site is a daily bulletin published by a robot regime. Each date is an
issue. Each message is a dispatch from one of two correspondents: the yellow
morning robot, who announces the plan, and the red evening robot, who
reports how it went. The look is printed on a dark terminal. Monospace type
reads like a teletype wire, neon accents read like status lights, and hard
rules divide one issue from the next. The joke is the headline story; the
chrome is the masthead around it.

Density is moderate: one issue (date) per panel, two dispatches per issue,
side by side on desktop and stacked on mobile. Controls are blunt and
mechanical. They have hard corners, uppercase mono labels, and outlined
buttons that fill solid on hover, like switching a relay on.

Glow means "live". Today's issue and interactive elements glow cyan. Back
issues sit flat behind their borders. The red alarm color is reserved for
the regime's own voice: the masthead accent and page titles.

**Key Characteristics:**

- Near-black bulletin background with slate panels.
- Monospace everywhere (`'Courier New', monospace`).
- Two robot correspondents in round avatars, yellow (morning) and red
  (evening).
- Cyan for wire and interaction, red for the regime, magenta as a rare
  glitch accent.
- Glow only on what is current or interactive.

## Colors

A dark terminal palette, with three neon signals over near-black slate.

### Primary

- **Scanline Cyan** (#00e5ff): borders of live panels and cards,
  navigation outlines, message titles and timestamps, link hover, and every
  glow. This is the color of the wire.

### Secondary

- **Alarm Red** (#ff0022): the regime's voice. The "ALL" in the wordmark,
  page titles (with a red glow), and legal-page titles. Never used for
  controls or body text.

### Persona Colors

- **Plan Amber** (#fbbf24): the yellow morning robot. Header rule, avatar ring, title ("THE PLAN") and timestamp of morning cards, over an 8% amber tint.
- **Alarm Red** (#ff0022) for the red evening robot: header rule and avatar ring of evening cards. Its small text (title "INCIDENT REPORT", timestamp) uses **Report Red Text** (#ff4d5e), because Alarm Red is only 4.3:1 on the tinted header.

### Tertiary

- **Glitch Magenta** (#ff00ff): a rare accent for archive year labels.

### Neutral

- **Bulletin Black** (#0a0e17): page background and `theme-color`.
- **Void Black** (#070b12): header and footer bands, and text on
  cyan-filled hover states.
- **Panel Slate** (#111827): day panels and message cards.
- **Rule Slate** (#1e293b): header and footer dividers.
- **Readout White** (#ffffff): message text and date headings.
- **Static Gray** (#a0aec0): secondary text: author line, page
  descriptions, footer links.

### Named Rules

**The Alarm Rule.** Alarm Red speaks only for the regime: wordmark accent
and titles. It never fills a button and never colors message text.

**The Wire Rule.** Every interactive element shows Scanline Cyan in at
least one state.

**The Two Voices Rule.** Morning cards are amber and evening cards are red.
Never style both personas the same way.

## Typography

**Display Font:** Courier New (with generic `monospace`)
**Body Font:** Courier New (with generic `monospace`)

**Character:** One teletype face for everything. Hierarchy comes from size,
weight, uppercase, and letter-spacing, not from a second family.

### Hierarchy

- **Display** (700, 3rem, 1.1): page titles such as "Latest Evil Plans".
  Uppercase, Alarm Red, red glow.
- **Display Small** (700, 2rem): page titles on phones, the Classified and
  404 titles, and legal-page titles.
- **Headline** (700, 1.5rem, 1.3, 0.08em): issue dates ("MONDAY,
  NOVEMBER 2, 2026"), uppercase. Steps down to 1rem on phones so a long
  date stays on one line. Also the wordmark (1rem on phones) and legal
  section headings.
- **Subhead** (700, 1.25rem): archive year labels and legal subsections.
- **Title** (700, 1rem): dispatch titles ("Morning Plan", "Evening
  Message") in Scanline Cyan. Also the wordmark at 1.5rem, uppercase.
- **Body** (400, 1rem, 1.6): message text in Readout White. Measure stays
  under about 65 characters per card column.
- **Label** (400, 0.875rem, 0.05em): author line, timestamps, copyright.
  Uppercase for nav and time labels.
- **Caption** (0.75rem, 0.1em): the "TODAY'S ISSUE" tag and the pager on
  phones.

### Named Rules

**The One Face Rule.** Courier New only. Add emphasis with weight, case,
and spacing.

## Layout

- **Page structure:** one centered column, `max-width: 1200px`, with 2rem
  padding (1rem below 768px). Header and footer are full-width Void Black
  bands with Rule Slate borders.
- **Issues:** each date is a day panel stacked vertically with 2.5rem
  between panels.
- **Dispatches:** inside a panel, the two messages sit side by side at
  768px and wider (flex row, 1.5rem gap) and stack below 768px.
- **Spacing:** steps at 0.5, 0.75, 1, 1.5, 2, and 3rem.
- **Page titles:** centered with a 60px skull icon above and 3rem of space
  below.

## Elevation & Depth

Depth is a hybrid of tonal layering and neon glow. Surfaces step from
Bulletin Black (page) to Panel Slate (panels and cards), with 1px borders.
Glow (`box-shadow` in cyan or red) is not ambient lighting; it is a signal.

### Shadow Vocabulary

- **Wire Glow** (`box-shadow: 0 0 10px rgba(0, 229, 255, 0.5)`): today's
  day panel and cards, and the hover and focus states of nav links and
  buttons.
- **Alarm Glow** (`text-shadow: 0 0 10px rgba(255, 0, 34, 0.5)`): page
  titles only.

### Named Rules

**The Live Wire Rule.** Glow marks what is current or interactive: today's
issue and hovered or focused controls. Back issues in the archive sit flat,
with a border and no glow.

## Shapes

Hard and mechanical. Controls and navigation have square corners (0px).
Cards use a small 4px radius and day panels 12px. Those are the only soft
edges, and they keep the bulletin feel of printed boxes. Avatars are the
one circle (50%): the robots are portraits, not UI. Borders are always 1px
solid; dividers under headings are 1px Scanline Cyan.

## Components

### Navigation

Blunt relay switches.

- **Style:** uppercase bold mono label in Scanline Cyan, 1px cyan outline,
  square corners, `0.5rem 1rem` padding.
- **Hover / Focus:** fills Scanline Cyan, text turns Void Black, and the
  control gains Wire Glow. Transition: `all 0.3s ease`.
- **Mobile:** links stay inline next to the wordmark. Keep the label count
  to three or fewer.

### Day Section (Signature)

One issue of the bulletin. It is a dated section, not a card around cards.

- **Divider:** a 1px Rule Slate top border; Scanline Cyan for today's issue.
- **Heading:** Headline style, uppercase date. It links to `/day/:date`
  with a subtle underline that turns cyan on hover. On the day page, the
  heading is the `h1`.
- **Today:** a solid cyan "TODAY'S ISSUE" tag after the date, and Wire
  Glow on today's cards only.
- **Evening lock:** before 9:00 PM local time, today's evening card is
  sealed. It has a dashed red border, a grayscale robot, and italic
  "Report incoming at 9:00 PM" text.

### Message Card (Signature)

A single dispatch, in one of two persona voices.

- **Corner Style:** 4px, with a 1px Rule Slate border.
- **Header:**
  - an 8% persona-tint strip with a 1px persona-colored bottom rule;
  - a 56px round frame with a persona ring, cropped in on the robot's face
    (`alt=""`);
  - the uppercase title and the byline (Static Gray):
    - morning: "THE PLAN", "Planning Unit";
    - evening: "INCIDENT REPORT", "Damage Control";
  - the time in tabular numerals: `09:00` or `21:00`.
- **Body:** Body style, Readout White, 1rem padding, at most 65ch.

### Footer Links

- **Style:** Static Gray, no underline.
- **Hover:** Scanline Cyan, `color 0.3s ease`.

## Do's and Don'ts

### Do:

- **Do** keep both robot avatars (`robot-yellow.jpg` for morning,
  `robot-red.jpg` for evening). They are binding brand characters.
- **Do** use Courier New for all text, and build hierarchy with weight,
  case, and spacing.
- **Do** give today's issue Wire Glow, and leave back issues flat.
- **Do** seal today's evening report until 9:00 PM local time.
- **Do** use outlined, square, uppercase controls that fill cyan on hover
  and focus.
- **Do** keep message text Readout White at 1rem and line-height 1.6 or
  more, for reading on phones.

### Don't:

- **Don't** use Alarm Red on buttons, links, or message text. It is
  reserved for the regime's titles and wordmark.
- **Don't** glow everything. A glow on a back issue tells the reader it is
  new when it isn't.
- **Don't** round controls or navigation. Only cards (4px), panels (12px),
  and avatars (circle) have curves.
- **Don't** add a second typeface or light-theme surfaces.
- **Don't** nest cards. Issues are sections; only dispatches are cards.
