/**
 * Date-key helpers. A date key is a calendar date string "YYYY-MM-DD"; a month key is "YYYY-MM".
 * Visibility is decided by the visitor's local calendar date.
 */

export const FIRST_DATE = '2023-03-14';
export const FIRST_MONTH = FIRST_DATE.slice(0, 7);

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

export const isVisible = (key, todayKey) => key >= FIRST_DATE && key <= todayKey;

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

export const formatMonth = (month) => `${monthName(month.slice(5))} ${month.slice(0, 4)}`;
