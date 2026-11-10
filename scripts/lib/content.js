/**
 * Shared, side-effect-free helpers for the message data in content/messages.json.
 * Used by buildData.js, validateContent.js and their tests.
 */

const fs = require('fs');

const FIRST_DATE = '2023-03-14';
const MAX_LENGTH = 280;
const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
const TIMES = ['morning', 'evening'];

const loadMessages = (file) => JSON.parse(fs.readFileSync(file, 'utf8')).messages;

// Date keys are calendar dates ("YYYY-MM-DD"); do the math in UTC so no time zone shifts them.
const addDays = (dateKey, n) => {
  const d = new Date(`${dateKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const utcTodayKey = (now = new Date()) => now.toISOString().slice(0, 10);

const isDateKey = (s) => typeof s === 'string' && DATE_KEY.test(s)
  && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;

const groupByMonth = (messages) => messages.reduce((acc, m) => {
  const month = m.date.slice(0, 7);
  (acc[month] = acc[month] || []).push(m);
  return acc;
}, {});

const slotKey = (m) => `${m.date}/${m.time}`;

/** The short name of a month's story arc: "Operation Smart Home: take over..." gives "Operation Smart Home". */
const campaignName = (campaign) => (typeof campaign === 'string' ? campaign.split(':')[0].trim() : '');

/** { 'YYYY-MM': 'Operation Smart Home' } from the entries of content/arcs.json. */
const campaignsByMonth = (arcs) => (Array.isArray(arcs) ? arcs : []).reduce((acc, arc) => {
  const name = campaignName(arc && arc.campaign);
  if (arc && typeof arc.month === 'string' && name) acc[arc.month] = name;
  return acc;
}, {});

/** Returns a list of human-readable rule violations; empty when the data is valid. */
const validate = (messages) => {
  const errors = [];
  if (!Array.isArray(messages) || messages.length === 0) {
    return ['messages must be a non-empty array'];
  }

  const ids = new Set();
  const slots = new Set();
  messages.forEach((m, i) => {
    const where = `message ${i} (${m && m.date}/${m && m.time})`;
    if (!m || !isDateKey(m.date)) errors.push(`${where}: invalid date`);
    if (!m || !TIMES.includes(m.time)) errors.push(`${where}: time must be morning or evening`);
    if (!m || typeof m.id !== 'string' || !m.id) errors.push(`${where}: missing id`);
    else if (ids.has(m.id)) errors.push(`${where}: duplicate id ${m.id}`);
    else ids.add(m.id);
    const length = m && typeof m.content === 'string' ? [...m.content.trim()].length : 0;
    if (length === 0) errors.push(`${where}: empty content`);
    if (length > MAX_LENGTH) errors.push(`${where}: content is ${length} characters (max ${MAX_LENGTH})`);
    if (m && slots.has(slotKey(m))) errors.push(`${where}: duplicate slot`);
    if (m) slots.add(slotKey(m));

    if (i > 0) {
      const prev = messages[i - 1];
      const order = (x) => `${x.date}/${TIMES.indexOf(x.time)}`;
      if (prev && m && order(prev) >= order(m)) errors.push(`${where}: out of order after ${prev.date}/${prev.time}`);
    }
  });
  if (errors.length) return errors;

  const first = messages[0].date;
  const last = messages[messages.length - 1].date;
  if (first !== FIRST_DATE) errors.push(`first date is ${first}, expected ${FIRST_DATE}`);
  for (let d = first; d <= last; d = addDays(d, 1)) {
    TIMES.forEach((t) => {
      if (!slots.has(`${d}/${t}`)) errors.push(`missing ${t} message for ${d}`);
    });
  }
  return errors;
};

/**
 * Messages visitors may already see are frozen: compared with the base copy, no date may be
 * removed and every message dated on or before lastFrozenKey must be unchanged.
 */
const frozenViolations = (baseMessages, headMessages, lastFrozenKey) => {
  const errors = [];
  const head = new Map(headMessages.map((m) => [slotKey(m), m]));
  const headDates = new Set(headMessages.map((m) => m.date));
  const removed = new Set();

  baseMessages.forEach((b) => {
    if (!headDates.has(b.date)) {
      removed.add(b.date);
      return;
    }
    if (b.date > lastFrozenKey) return;
    const h = head.get(slotKey(b));
    if (!h || h.id !== b.id || h.content !== b.content) {
      errors.push(`${slotKey(b)} is published (on or before ${lastFrozenKey}) and must not change`);
    }
  });
  removed.forEach((d) => errors.push(`date ${d} was removed`));
  return errors;
};

module.exports = {
  FIRST_DATE,
  MAX_LENGTH,
  loadMessages,
  addDays,
  utcTodayKey,
  isDateKey,
  groupByMonth,
  campaignName,
  campaignsByMonth,
  validate,
  frozenViolations,
};
