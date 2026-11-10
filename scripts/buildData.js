/**
 * Splits content/messages.json into public/data/months/YYYY-MM.json.
 * A month with a story arc in content/arcs.json also carries its campaign name.
 * Runs automatically before `npm run build` and `npm start` (npm prebuild/prestart hooks).
 */

const fs = require('fs');
const path = require('path');
const { loadMessages, validate, groupByMonth, campaignsByMonth } = require('./lib/content');

const root = path.join(__dirname, '..');
const source = path.join(root, 'content/messages.json');
const arcsFile = path.join(root, 'content/arcs.json');
const outDir = path.join(root, 'public/data/months');

const messages = loadMessages(source);
const errors = validate(messages);
if (errors.length) {
  console.error(`content/messages.json is invalid:\n  ${errors.slice(0, 20).join('\n  ')}`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const campaigns = fs.existsSync(arcsFile) ? campaignsByMonth(JSON.parse(fs.readFileSync(arcsFile, 'utf8'))) : {};
const months = groupByMonth(messages);
Object.entries(months).forEach(([month, monthMessages]) => {
  const data = campaigns[month] ? { campaign: campaigns[month], messages: monthMessages } : { messages: monthMessages };
  fs.writeFileSync(path.join(outDir, `${month}.json`), JSON.stringify(data));
});

console.log(`buildData: wrote ${Object.keys(months).length} month files to public/data/months`);
