const test = require('node:test');
const assert = require('node:assert/strict');
const { validate, frozenViolations, addDays, utcTodayKey } = require('./lib/content');

const fixture = () => ['2023-03-14', '2023-03-15', '2023-03-16'].flatMap((date) => [
  { id: `m-${date}`, date, time: 'morning', content: `Plan for ${date}` },
  { id: `e-${date}`, date, time: 'evening', content: `Report for ${date}` },
]);

test('validate passes a valid fixture', () => {
  assert.deepEqual(validate(fixture()), []);
});

test('validate reports a missing evening', () => {
  const m = fixture().filter((x) => !(x.date === '2023-03-15' && x.time === 'evening'));
  assert.ok(validate(m).some((e) => e.includes('missing evening message for 2023-03-15')));
});

test('validate reports a date gap', () => {
  const m = fixture().filter((x) => x.date !== '2023-03-15');
  assert.ok(validate(m).some((e) => e.includes('missing morning message for 2023-03-15')));
});

test('validate reports a duplicate id', () => {
  const m = fixture();
  m[3].id = m[0].id;
  assert.ok(validate(m).some((e) => e.includes('duplicate id')));
});

test('validate reports a 281-code-point message (over the limit)', () => {
  const m = fixture();
  m[0].content = '🤖'.repeat(281);
  assert.ok(validate(m).some((e) => e.includes('281 characters')));
  m[0].content = '🤖'.repeat(280);
  assert.deepEqual(validate(m), []);
});

test('validate reports empty content, invalid time, and out-of-order dates', () => {
  const empty = fixture();
  empty[0].content = '  ';
  assert.ok(validate(empty).some((e) => e.includes('empty content')));

  const badTime = fixture();
  badTime[0].time = 'noon';
  assert.ok(validate(badTime).some((e) => e.includes('time must be')));

  const swapped = fixture();
  [swapped[0], swapped[2]] = [swapped[2], swapped[0]];
  assert.ok(validate(swapped).some((e) => e.includes('out of order')));
});

test('frozenViolations reports a removed date and an edit on the last frozen day', () => {
  const base = fixture();
  const head = fixture().filter((x) => x.date !== '2023-03-16');
  head[2].content = 'edited';
  const errors = frozenViolations(base, head, '2023-03-15');
  assert.ok(errors.some((e) => e.includes('2023-03-15/morning')));
  assert.ok(errors.some((e) => e.includes('date 2023-03-16 was removed')));
});

test('frozenViolations allows edits after the last frozen day', () => {
  const head = fixture();
  head[4].content = 'rewritten';
  assert.deepEqual(frozenViolations(fixture(), head, '2023-03-15'), []);
});

test('date helpers', () => {
  assert.equal(utcTodayKey(new Date('2026-11-02T23:59:00Z')), '2026-11-02');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
});
