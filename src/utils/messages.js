import { isVisible } from './dates';

/** { 'YYYY-MM-DD': { morning, evening } } */
export const groupByDate = (messages) => messages.reduce((acc, message) => {
  const day = acc[message.date] || (acc[message.date] = {});
  day[message.time] = message;
  return acc;
}, {});

export const sortedKeys = (grouped) => Object.keys(grouped).sort().reverse();

/** Up to `limit` visible days, newest first, as [{ date, morning, evening }]. */
export const visibleDays = (messages, todayKey, limit = Infinity) => {
  const grouped = groupByDate(messages);
  return sortedKeys(grouped)
    .filter((date) => isVisible(date, todayKey))
    .slice(0, limit)
    .map((date) => ({ date, ...grouped[date] }));
};
