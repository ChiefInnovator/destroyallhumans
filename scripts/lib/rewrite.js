/**
 * Helpers for rewriting a month of content to content/VOICE.md.
 * The CLI lives in scripts/rewriteContent.js.
 */

const { MAX_LENGTH } = require('./content');

const TIMES = ['morning', 'evening'];
const slotKey = (m) => `${m.date}/${m.time}`;

/** Chat messages for one month: the voice guide, the month's arc, and the last week of messages. */
const buildPrompt = (voice, arc, previousMessages, dates) => [
  {
    role: 'system',
    content: `You write the daily messages for destroyallhumans.ai. Follow this voice guide exactly.\n\n${voice}`,
  },
  {
    role: 'user',
    content: [
      `This month's arc:\n${JSON.stringify(arc, null, 2)}`,
      `The previous 7 days, for continuity:\n${previousMessages.map((m) => `${m.date} ${m.time}: ${m.content}`).join('\n')}`,
      `Write a morning and an evening message for each of these dates: ${dates.join(', ')}.`,
      'Return JSON: {"days": [{"date": "YYYY-MM-DD", "morning": "...", "evening": "..."}]}.',
    ].join('\n\n'),
  },
];

/** Parses the model's JSON into messages. Throws when a date or slot is missing or empty. */
const parseMonth = (json, dates) => {
  const data = typeof json === 'string' ? JSON.parse(json) : json;
  const byDate = new Map((data.days || []).map((d) => [d.date, d]));
  return dates.flatMap((date) => {
    const day = byDate.get(date);
    if (!day) throw new Error(`missing date ${date}`);
    return TIMES.map((time) => {
      const content = typeof day[time] === 'string' ? day[time].trim() : '';
      if (!content) throw new Error(`missing ${time} message for ${date}`);
      return { date, time, content };
    });
  });
};

/** Length and exact-duplicate problems in newMessages, compared with every other message. */
const checkMessages = (newMessages, allMessages) => {
  const errors = [];
  const replaced = new Set(newMessages.map(slotKey));
  const seen = new Set(allMessages.filter((m) => !replaced.has(slotKey(m))).map((m) => m.content.trim()));
  newMessages.forEach((m) => {
    const length = [...m.content.trim()].length;
    if (length < 1 || length > MAX_LENGTH) errors.push(`${slotKey(m)}: length ${length} is outside 1-${MAX_LENGTH}`);
    if (seen.has(m.content.trim())) errors.push(`${slotKey(m)}: duplicate of another message`);
    seen.add(m.content.trim());
  });
  return errors;
};

/** Replaces content for slots dated on or after firstEditableKey; keeps ids, order, and everything else. */
const mergeMonth = (allMessages, newMessages, firstEditableKey) => {
  const updates = new Map(newMessages.filter((m) => m.date >= firstEditableKey).map((m) => [slotKey(m), m.content]));
  return allMessages.map((m) => (updates.has(slotKey(m)) ? { ...m, content: updates.get(slotKey(m)) } : m));
};

/**
 * Serializes messages the way content/messages.json is stored: 2-space indent, non-ASCII as
 * lowercase \uXXXX escapes, no trailing newline. Untouched messages keep their exact bytes.
 */
const toSource = (messages) => JSON.stringify({ messages }, null, 2)
  .replace(/[\u0080-\uffff]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);

module.exports = { buildPrompt, parseMonth, checkMessages, mergeMonth, toSource };
