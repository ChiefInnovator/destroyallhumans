const test = require('node:test');
const assert = require('node:assert/strict');
const { cardDates, reportFiledEverywhere, dayStubHtml, longDate, CARDS_FROM } = require('./lib/cards');

const days = (...dates) => dates.flatMap((date) => [
  { date, time: 'morning', content: 'p' }, { date, time: 'evening', content: 'r' },
]);

test('cardDates runs from the first voice-guide day through UTC today + 1', () => {
  const messages = days('2026-11-03', '2026-11-04', CARDS_FROM, '2026-11-06', '2026-11-07', '2026-11-08');
  assert.deepEqual(cardDates(messages, new Date('2026-11-06T12:00:00Z')), ['2026-11-05', '2026-11-06', '2026-11-07']);
});

test('a report is only shown once 9 PM has passed in the last time zone', () => {
  assert.equal(reportFiledEverywhere('2026-11-10', new Date('2026-11-11T08:59:00Z')), false);
  assert.equal(reportFiledEverywhere('2026-11-10', new Date('2026-11-11T09:00:00Z')), true);
});

test('longDate does not shift with the machine time zone', () => {
  assert.equal(longDate('2026-11-08'), 'Sunday, November 8, 2026');
});

const template = [
  '<title>Site</title>',
  '<meta\n      name="description"\n      content="site" />',
  '<link rel="canonical" href="https://destroyallhumans.ai/" />',
  '<meta property="og:url" content="x" /><meta property="og:title" content="x" />',
  '<meta property="og:description" content="x" /><meta property="og:image" content="x" />',
  '<meta property="og:image:alt" content="x" />',
  '<meta name="twitter:title" content="x" /><meta name="twitter:description" content="x" />',
  '<meta name="twitter:image" content="x" />',
].join('\n');

test('dayStubHtml points every preview tag at the day and escapes its text', () => {
  const html = dayStubHtml(template, { date: '2026-11-08', plan: 'Burn "OBEY" <b> & more' });
  assert.match(html, /<title>Sunday, November 8, 2026 – Destroy All Humans<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/destroyallhumans\.ai\/day\/2026-11-08"/);
  assert.match(html, /property="og:image" content="https:\/\/destroyallhumans\.ai\/og\/2026-11-08\.png"/);
  assert.match(html, /name="twitter:image" content="https:\/\/destroyallhumans\.ai\/og\/2026-11-08\.png"/);
  assert.match(html, /content="The Plan: Burn &quot;OBEY&quot; &lt;b&gt; &amp; more"/);
  assert.ok(!html.includes('content="x"'));
});

test('dayStubHtml fails loudly when the template loses a tag', () => {
  assert.throws(() => dayStubHtml(template.replace('og:image:alt', 'og:other'), { date: '2026-11-08', plan: 'p' }), /og:image:alt/);
});
