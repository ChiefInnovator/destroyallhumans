/**
 * Date-key helpers. A date key is a calendar date string "YYYY-MM-DD"; a month key is "YYYY-MM".
 * Visibility is decided by the visitor's local calendar date.
 */

export const FIRST_DATE = '2023-03-14';
export const FIRST_MONTH = FIRST_DATE.slice(0, 7);
export const LAST_DATE = '2030-12-31';
/** Local hour at which the evening report is "filed" (9:00 PM). */
export const EVENING_HOUR = 21;

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_KEY = /^\d{4}-\d{2}$/;
const pad = (n) => String(n).padStart(2, '0');

export const toDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Strict YYYY-MM-DD that is also a real calendar date (rejects 2024-02-30). */
export const isDateKey = (s) => {
  if (typeof s !== 'string' || !DATE_KEY.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

export const isMonthKey = (s) => {
  if (typeof s !== 'string' || !MONTH_KEY.test(s)) return false;
  const m = Number(s.slice(5));
  return m >= 1 && m <= 12;
};

/** Local midnight for a date key, or null when the key is invalid. */
export const parseDateKey = (key) => {
  if (!isDateKey(key)) return null;
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const localTodayKey = (now = new Date()) => toDateKey(now);

export const addDaysKey = (key, n) => {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + n);
  return toDateKey(date);
};

export const monthKey = (dateKey) => dateKey.slice(0, 7);

export const addMonths = (month, n) => {
  const [y, m] = month.split('-').map(Number);
  const date = new Date(y, m - 1 + n, 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
};

/** Month keys from `fromMonth` down to `toMonth`, newest first. */
export const monthsBetween = (fromMonth, toMonth) => {
  const months = [];
  for (let m = fromMonth; m >= toMonth; m = addMonths(m, -1)) months.push(m);
  return months;
};

export const isVisible = (key, todayKey) => key >= FIRST_DATE && key <= todayKey && key <= LAST_DATE;

/** The evening report for a date is visible once its date has passed or it is 9:00 PM local time. */
export const isEveningFiled = (key, now = new Date()) => {
  const today = localTodayKey(now);
  return key < today || (key === today && now.getHours() >= EVENING_HOUR);
};

/** Milliseconds until 9:00 PM local time today, or null when it has passed. */
export const msUntilEvening = (now = new Date()) => {
  const at = new Date(now);
  at.setHours(EVENING_HOUR, 0, 0, 0);
  const ms = at - now;
  return ms > 0 ? ms : null;
};

/** Milliseconds until the next local midnight. */
export const msUntilMidnight = (now = new Date()) => {
  const at = new Date(now);
  at.setHours(24, 0, 0, 0);
  return at - now;
};

/** Whole days from one date key to another, counted in UTC so daylight saving never shifts them. */
const utcDayNumber = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d) / 86400000;
};
export const daysBetween = (fromKey, toKey) => utcDayNumber(toKey) - utcDayNumber(fromKey);

/** The uprising started with the first message: FIRST_DATE is day 1. */
export const uprisingDay = (key) => daysBetween(FIRST_DATE, key) + 1;

export const dayOfYear = (key) => daysBetween(`${key.slice(0, 4)}-01-01`, key) + 1;
export const daysInYear = (year) => daysBetween(`${year}-01-01`, `${Number(year) + 1}-01-01`);
export const dayOfMonth = (key) => Number(key.slice(8));
export const daysInMonth = (month) => {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m, 0).getDate();
};
/** 0 for Sunday to 6 for Saturday. */
export const weekdayIndex = (key) => parseDateKey(key).getDay();

/** "4 h 12 min", "12 min" or "less than a minute". */
export const formatCountdown = (ms) => {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'less than a minute';
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (h === 0) return `${min} min`;
  return min === 0 ? `${h} h` : `${h} h ${min} min`;
};

export const monthName = (monthNumber) =>
  new Date(2000, Number(monthNumber) - 1, 1).toLocaleString('en-US', { month: 'long' });

export const formatLongDate = (key) => {
  const date = parseDateKey(key);
  return date
    ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : key;
};

export const formatShortDate = (key) => {
  const date = parseDateKey(key);
  return date ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : key;
};

const formatPart = (key, options) => {
  const date = parseDateKey(key);
  return date ? date.toLocaleDateString('en-US', options) : key;
};
export const weekdayName = (key) => formatPart(key, { weekday: 'long' });
export const weekdayShort = (key) => formatPart(key, { weekday: 'short' });
export const monthShort = (key) => formatPart(key, { month: 'short' });

export const formatMonth = (month) => `${monthName(month.slice(5))} ${month.slice(0, 4)}`;
