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

/**
 * index.html with one page's own title, description, canonical URL and preview image.
 * Every page needs this: without it a crawler is told the page is the home page.
 */
const stubHtml = (indexHtml, { title, description, pathname, image, imageAlt }) => {
  const url = `${SITE}${pathname}`;
  let html = indexHtml;
  if (!/<title>[^<]*<\/title>/.test(html)) throw new Error('index.html has no <title>');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`);
  if (!/<link rel="canonical" href="[^"]*"/.test(html)) throw new Error('index.html has no canonical link');
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  if (image) {
    html = setMeta(html, 'property', 'og:image', image);
    html = setMeta(html, 'name', 'twitter:image', image);
    html = setMeta(html, 'property', 'og:image:alt', imageAlt);
  }
  return html;
};

const cardUrl = (date) => `${SITE}/og/${date}.png`;
const cardAlt = (date) => `The plan and the incident report for ${longDate(date)}.`;

/** A day's stub. With `card` false (days before CARDS_FROM) it keeps the shared image. */
const dayStubHtml = (indexHtml, { date, plan, card = true }) => stubHtml(indexHtml, {
  title: `${longDate(date)} – Destroy All Humans`,
  description: `The Plan: ${plan}`,
  pathname: `/day/${date}`,
  image: card ? cardUrl(date) : null,
  imageAlt: cardAlt(date),
});

/** The home page: same words, but its picture is the given day's card. */
const homeHtml = (indexHtml, date) => {
  let html = setMeta(indexHtml, 'property', 'og:image', cardUrl(date));
  html = setMeta(html, 'name', 'twitter:image', cardUrl(date));
  return setMeta(html, 'property', 'og:image:alt', cardAlt(date));
};

/** Every date a visitor somewhere can already open: the first message through UTC today + 1. */
const visibleDates = (messages, now = new Date()) => {
  const last = addDays(utcTodayKey(now), 1);
  return [...new Set(messages.map((m) => m.date))].filter((d) => d <= last).sort();
};

const monthTitle = (month) => new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** The pages that are not days: [{ pathname, title, description }]. `months` are "YYYY-MM" keys. */
const otherPages = (months) => [
  {
    pathname: '/archive',
    title: 'Every page – Destroy All Humans',
    description: "Browse every daily plan and report from our AI overlords' quest for world domination.",
  },
  ...months.map((month) => ({
    pathname: `/archive/${month.slice(0, 4)}/${month.slice(5)}`,
    title: `${monthTitle(month)} – Destroy All Humans`,
    description: `Every AI overlord plan and report from ${monthTitle(month)}.`,
  })),
  { pathname: '/terms', title: 'Terms and Conditions – Destroy All Humans', description: 'Terms and Conditions for Destroy All Humans, a satirical AI parody website by Richard Crane.' },
  { pathname: '/privacy', title: 'Privacy Policy – Destroy All Humans', description: 'Privacy Policy for Destroy All Humans. Learn how we handle your data on our satirical AI parody website.' },
  { pathname: '/cookies', title: 'Cookie Support – Destroy All Humans', description: 'Cookie policy and support for Destroy All Humans. Learn about how cookies are used on our satirical AI parody website.' },
];

module.exports = {
  SITE, CARDS_FROM, TEASER, cardDates, visibleDates, reportFiledEverywhere, longDate, stubHtml, dayStubHtml, homeHtml, otherPages,
};
