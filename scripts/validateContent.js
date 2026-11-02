/**
 * Validates content/messages.json and, with --base <git ref>, checks that published messages
 * (dated on or before UTC today + 1) are unchanged and no date was removed.
 *
 * Usage: node scripts/validateContent.js [--base origin/develop]
 */

const { execFileSync } = require('child_process');
const path = require('path');
const { loadMessages, validate, frozenViolations, addDays, utcTodayKey } = require('./lib/content');

const root = path.join(__dirname, '..');
const baseIndex = process.argv.indexOf('--base');
const baseRef = baseIndex > -1 ? process.argv[baseIndex + 1] : null;

const readBase = (ref) => {
  // content/messages.json replaced public/data/latest.json; older bases only have the latter.
  for (const file of ['content/messages.json', 'public/data/latest.json']) {
    try {
      const raw = execFileSync('git', ['show', `${ref}:${file}`], {
        cwd: root, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'],
      });
      return JSON.parse(raw).messages;
    } catch (e) {
      // try the next location
    }
  }
  return null;
};

const messages = loadMessages(path.join(root, 'content/messages.json'));
const errors = validate(messages);

if (baseRef) {
  const base = readBase(baseRef);
  if (base) {
    const lastFrozenKey = addDays(utcTodayKey(), 1);
    errors.push(...frozenViolations(base, messages, lastFrozenKey));
    console.log(`Compared with ${baseRef}; messages through ${lastFrozenKey} are frozen.`);
  } else {
    console.log(`Notice: no message data found on ${baseRef}; skipped the frozen-message check.`);
  }
}

if (errors.length) {
  console.error(`Content check failed (${errors.length}):\n  ${errors.slice(0, 50).join('\n  ')}`);
  process.exit(1);
}
console.log(`Content OK: ${messages.length} messages.`);
