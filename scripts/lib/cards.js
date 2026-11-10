/**
 * Side-effect-free helpers for the per-day social cards built by scripts/buildCards.js.
 * A card is a 1200x630 PNG at /og/YYYY-MM-DD.png, with an HTML stub at /day/YYYY-MM-DD/index.html
 * that carries the day's own preview tags for crawlers (they do not run the app).
 */

const { addDays, utcTodayKey } = require('./content');

const SITE = 'https://destroyallhumans.ai';
/** Cards start where the content written to the voice guide starts; older days keep the shared image. */
const CARDS_FROM = '2026-11-05';
const TEASER = 'Report incoming at 9:00 PM.';

/**
 * Dates that get a card: CARDS_FROM through UTC today + 1, the same horizon as the frozen-content
 * rule, because somewhere on Earth it is already tomorrow.
 */
const cardDates = (messages, now = new Date()) => {
  const last = addDays(utcTodayKey(now), 1);
  return [...new Set(messages.map((m) => m.date))].filter((d) => d >= CARDS_FROM && d <= last).sort();
};

/**
 * True once 9:00 PM on `dateKey` has passed in every time zone (the last is UTC-12, which is
 * 09:00 UTC the next day). Before that, a card shows the teaser instead of the report.
 */
const reportFiledEverywhere = (dateKey, now = new Date()) =>
  now.getTime() >= Date.parse(`${addDays(dateKey, 1)}T09:00:00Z`);

const longDate = (dateKey) => new Date(`${dateKey}T00:00:00Z`).toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
});

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Replaces the content of every matching meta tag; throws if the tag is missing so a template change is noticed. */
const setMeta = (html, attr, name, value) => {
  const pattern = new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`, 'g');
  if (!pattern.test(html)) throw new Error(`index.html has no <meta ${attr}="${name}">`);
  return html.replace(pattern, (_, open, close) => `${open}${escapeAttr(value)}${close}`);
};

/** index.html with one day's title, description, canonical URL and preview image. */
const dayStubHtml = (indexHtml, { date, plan }) => {
  const title = `${longDate(date)} – Destroy All Humans`;
  const description = `The Plan: ${plan}`;
  const url = `${SITE}/day/${date}`;
  const image = `${SITE}/og/${date}.png`;

  let html = indexHtml;
  if (!/<title>[^<]*<\/title>/.test(html)) throw new Error('index.html has no <title>');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`);
  if (!/<link rel="canonical" href="[^"]*"/.test(html)) throw new Error('index.html has no canonical link');
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:image:alt', `The plan and the incident report for ${longDate(date)}.`);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setMeta(html, 'name', 'twitter:image', image);
  return html;
};

module.exports = { SITE, CARDS_FROM, TEASER, cardDates, reportFiledEverywhere, longDate, dayStubHtml };
