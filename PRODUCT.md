# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: the tech and AI crowd.** Developers and people who follow AI news. They arrive from social posts or share links for a quick laugh, often on a phone, and come back for the next dispatch.
- **Also: the general public.** They find the site through search or a shared link and pass individual messages on.

## Product Purpose

Destroy All Humans is a daily satirical comic told in text. A fictional AI that wants to take over the world posts two messages each day: a morning plan and an evening report on why the plan failed. Success is a daily return habit. Visitors come back each morning and evening for the next installment, the way people follow a comic strip.

## Positioning

- **Two characters on a daily rhythm.**
  - The yellow morning robot is an upbeat project manager announcing today's plan.
  - The red evening robot files a bitter report on how it went.
  - Each evening message answers that day's morning message, and each month follows a story arc. The voice is defined in `content/VOICE.md`.
- **Complete history.** There is a message for every day since 2023-03-14, and each day has a linkable page.

## Operating Context

- **How visitors arrive:** usually on mobile, from a social share or search, landing on the home page or a `/day/YYYY-MM-DD` link. Returning visitors open the home page to read today.
- **How content is made:** messages are written ahead in batches with an OpenAI model. The owner reviews every message before merge. Each message appears on its date in the visitor's local time zone.

## Capabilities and Constraints

- **Stack:** React single-page app on Create React App, with no backend. It is deployed to Azure Static Web Apps (`destroyallhumans.ai`, primary) and GitHub Pages (a mirror under `/destroyallhumans`, `noindex`).
- **Pages:**
  - home (the last 5 visible days);
  - `/archive`, `/archive/:year/:month`, and `/day/:date`;
  - legal pages (terms, privacy, cookies).
- **Content model:**
  - each date has one `morning` and one `evening` message, each 280 characters or fewer;
  - messages run from 2023-03-14 to 2030-12-31, stored in `content/messages.json`;
  - the browser hides future dates;
  - messages visitors can already see are frozen by CI.
- **Message display:** the persona is chosen by time of day (morning shows the yellow robot, evening the red robot). The posting times shown are 9:00 AM and 9:00 PM.
- **Ads:** an AdSense site-verification tag exists, but no ad slot. Undecided: whether ads will run.

## Brand Commitments

- **Name and wordmark:** "Destroy All Humans", at `destroyallhumans.ai`.
- **Two robot avatars (binding):** `src/assets/images/robot-yellow.jpg` (morning, comic) and `src/assets/images/robot-red.jpg` (evening, ominous). Future design work keeps both characters. The site ships crops of these two files (`badge-*.webp`, `seal-*.webp`, the app icons); the art is never redrawn.
- **Voice:** comedy first, provocation second. It is pure satire with no real threats, and it follows the limits in `content/VOICE.md`.
- **Not binding:** the palette and the typography. The skull logo was retired in the calendar redesign (v1.0.0).

## Evidence on Hand

- **Message history:** 5,700 messages, in `content/messages.json` (formerly `public/data/latest.json`).
- **Avatars:** the two robot images.
- **Social image:** `public/og-image.png`, 1200×630.
- **Absences:** there are no testimonials, audience metrics, press, or follower counts. Do not invent any.

## Product Principles

1. **Today's message comes first.** A visitor sees today's plan without scrolling or choosing.
2. **Every day stands alone and can be shared.** A single day's page is complete without the rest of the site.
3. **The joke is the product.** UI never competes with the message text for attention.
4. **The two robots are characters, not decoration.** Morning and evening must feel like two distinct voices.
5. **It is a daily ritual.** The design signals what is new today and that more is coming tonight or tomorrow.

## Accessibility & Inclusion

No product-specific standard is set. Default to WCAG 2.2 AA. Message text must stay readable on small phones.
