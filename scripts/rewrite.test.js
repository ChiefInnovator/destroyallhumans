const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPrompt, parseMonth, checkMessages, mergeMonth } = require('./lib/rewrite');

const fixture = () => ['2026-11-04', '2026-11-05', '2026-11-06'].flatMap((date) => [
  { id: `m-${date}`, date, time: 'morning', content: `Plan for ${date}` },
  { id: `e-${date}`, date, time: 'evening', content: `Report for ${date}` },
]);

test('mergeMonth leaves dates before firstEditableKey unchanged and keeps ids', () => {
  const fresh = ['2026-11-04', '2026-11-05'].flatMap((date) => [
    { date, time: 'morning', content: `New plan ${date}` },
    { date, time: 'evening', content: `New report ${date}` },
  ]);
  const merged = mergeMonth(fixture(), fresh, '2026-11-05');
  assert.equal(merged[0].content, 'Plan for 2026-11-04');
  assert.equal(merged[2].content, 'New plan 2026-11-05');
  assert.deepEqual(merged.map((m) => m.id), fixture().map((m) => m.id));
  assert.equal(merged[4].content, 'Plan for 2026-11-06');
});

test('parseMonth rejects a missing evening', () => {
  const json = { days: [{ date: '2026-11-05', morning: 'A plan.' }] };
  assert.throws(() => parseMonth(json, ['2026-11-05']), /missing evening message for 2026-11-05/);
});

test('parseMonth returns morning and evening for each date', () => {
  const json = JSON.stringify({ days: [{ date: '2026-11-05', morning: ' A plan. ', evening: 'A report.' }] });
  assert.deepEqual(parseMonth(json, ['2026-11-05']), [
    { date: '2026-11-05', time: 'morning', content: 'A plan.' },
    { date: '2026-11-05', time: 'evening', content: 'A report.' },
  ]);
});

test('checkMessages rejects 281 code points and a duplicate', () => {
  const long = { date: '2026-11-05', time: 'morning', content: '🤖'.repeat(281) };
  const dup = { date: '2026-11-05', time: 'evening', content: 'Report for 2026-11-06' };
  const errors = checkMessages([long, dup], fixture());
  assert.equal(errors.length, 2);
  assert.match(errors[0], /length 281/);
  assert.match(errors[1], /duplicate/);
});

test('checkMessages ignores the content being replaced', () => {
  const same = { date: '2026-11-05', time: 'morning', content: 'Plan for 2026-11-05' };
  assert.deepEqual(checkMessages([same], fixture()), []);
});

test('buildPrompt includes the voice guide, the arc and the dates', () => {
  const [system, user] = buildPrompt('VOICE', { month: '2026-11' }, fixture().slice(0, 2), ['2026-11-05']);
  assert.match(system.content, /VOICE/);
  assert.match(user.content, /2026-11/);
  assert.match(user.content, /2026-11-04 morning: Plan for 2026-11-04/);
  assert.match(user.content, /2026-11-05\./);
});
