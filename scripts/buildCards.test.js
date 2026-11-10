const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { buildCards, WIDTH, HEIGHT } = require('./buildCards');

const template = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
const messages = ['2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08'].flatMap((date) => [
  { date, time: 'morning', content: `Plan for ${date} with "quotes" & more.` },
  { date, time: 'evening', content: `Report for ${date}.` },
]);

const build = async (now) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cards-'));
  fs.writeFileSync(path.join(dir, 'index.html'), template);
  const result = await buildCards({ buildDir: dir, messages, now: new Date(now) });
  return { dir, ...result };
};

const pngSize = (file) => {
  const b = fs.readFileSync(file);
  assert.equal(b.subarray(1, 4).toString(), 'PNG');
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

test('a build writes a 1200x630 card and a stub for each day in range, from the real index.html', async () => {
  const { dir, dates } = await build('2026-11-06T12:00:00Z');
  assert.deepEqual(dates, ['2026-11-05', '2026-11-06', '2026-11-07']);
  assert.deepEqual(fs.readdirSync(path.join(dir, 'og')).sort(), dates.map((d) => `${d}.png`));
  dates.forEach((d) => assert.deepEqual(pngSize(path.join(dir, 'og', `${d}.png`)), [WIDTH, HEIGHT]));

  const stub = fs.readFileSync(path.join(dir, 'day', '2026-11-06', 'index.html'), 'utf8');
  assert.match(stub, /property="og:image" content="https:\/\/destroyallhumans\.ai\/og\/2026-11-06\.png"/);
  assert.match(stub, /content="The Plan: Plan for 2026-11-06 with &quot;quotes&quot; &amp; more\."/);
  assert.match(stub, /<div id="root"><\/div>/);
  assert.ok(!fs.existsSync(path.join(dir, 'day', '2026-11-04')));
  assert.ok(!fs.existsSync(path.join(dir, 'day', '2026-11-08')));
});

test("a day's card changes when its report is filed, and not after", async () => {
  const card = async (now) => {
    const { dir } = await build(now);
    return fs.readFileSync(path.join(dir, 'og', '2026-11-06.png'));
  };
  const sealed = await card('2026-11-07T08:59:00Z');
  const filed = await card('2026-11-07T09:00:00Z');
  const later = await card('2026-11-08T12:00:00Z');
  assert.ok(!sealed.equals(filed));
  assert.ok(filed.equals(later));
});
