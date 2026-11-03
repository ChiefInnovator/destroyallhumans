/**
 * Rewrites one month of content/messages.json to content/VOICE.md and that month's arc in
 * content/arcs.json. Dates on or before UTC today + 1 are published and never change.
 *
 * Usage: OPENAI_API_KEY=... node scripts/rewriteContent.js --month YYYY-MM --model <name> [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { loadMessages, validate, addDays, utcTodayKey } = require('./lib/content');
const { buildPrompt, parseMonth, checkMessages, mergeMonth } = require('./lib/rewrite');

const root = path.join(__dirname, '..');
const messagesFile = path.join(root, 'content', 'messages.json');

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : null;
};

const main = async () => {
  const month = arg('--month');
  const model = arg('--model');
  const dryRun = process.argv.includes('--dry-run');
  if (!/^\d{4}-\d{2}$/.test(month || '') || !model) {
    throw new Error('Usage: node scripts/rewriteContent.js --month YYYY-MM --model <name> [--dry-run]');
  }

  const voice = fs.readFileSync(path.join(root, 'content', 'VOICE.md'), 'utf8');
  const arc = JSON.parse(fs.readFileSync(path.join(root, 'content', 'arcs.json'), 'utf8')).find((a) => a.month === month);
  if (!arc) throw new Error(`content/arcs.json has no arc for ${month}`);

  const all = loadMessages(messagesFile);
  const firstEditableKey = addDays(utcTodayKey(), 2);
  const dates = [...new Set(all.filter((m) => m.date.startsWith(month) && m.date >= firstEditableKey).map((m) => m.date))];
  if (!dates.length) throw new Error(`${month} has no editable dates (first editable date is ${firstEditableKey})`);
  const previous = all.filter((m) => m.date < dates[0] && m.date >= addDays(dates[0], -7));

  const OpenAI = require('openai');
  const client = new OpenAI();
  const response = await client.chat.completions.create({
    model,
    messages: buildPrompt(voice, arc, previous, dates),
    response_format: { type: 'json_object' },
  });

  const fresh = parseMonth(response.choices[0].message.content, dates);
  const errors = checkMessages(fresh, all);
  const merged = mergeMonth(all, fresh, firstEditableKey);
  errors.push(...validate(merged));
  if (errors.length) throw new Error(`Rejected:\n${errors.join('\n')}`);

  if (dryRun) {
    fresh.forEach((m) => console.log(`${m.date} ${m.time}: ${m.content}`));
    return;
  }
  fs.writeFileSync(messagesFile, JSON.stringify({ messages: merged }, null, 2));
  console.log(`Rewrote ${fresh.length} messages for ${month}.`);
};

if (require.main === module) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
