/**
 * Splits content/messages.json into public/data/months/YYYY-MM.json.
 * Runs automatically before `npm run build` and `npm start` (npm prebuild/prestart hooks).
 */

const fs = require('fs');
const path = require('path');
const { loadMessages, validate, groupByMonth } = require('./lib/content');

const root = path.join(__dirname, '..');
const source = path.join(root, 'content/messages.json');
const outDir = path.join(root, 'public/data/months');

const messages = loadMessages(source);
const errors = validate(messages);
if (errors.length) {
  console.error(`content/messages.json is invalid:\n  ${errors.slice(0, 20).join('\n  ')}`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const months = groupByMonth(messages);
Object.entries(months).forEach(([month, monthMessages]) => {
  fs.writeFileSync(path.join(outDir, `${month}.json`), JSON.stringify({ messages: monthMessages }));
});

console.log(`buildData: wrote ${Object.keys(months).length} month files to public/data/months`);
