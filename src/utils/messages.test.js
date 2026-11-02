import { groupByDate, visibleDays } from './messages';

const msg = (date, time) => ({ id: `${time}-${date}`, date, time, content: `${time} ${date}` });

test('groupByDate pairs morning and evening', () => {
  const grouped = groupByDate([msg('2026-11-01', 'morning'), msg('2026-11-01', 'evening')]);
  expect(grouped['2026-11-01'].morning.time).toBe('morning');
  expect(grouped['2026-11-01'].evening.time).toBe('evening');
});

test('visibleDays limits to 5, skips future dates, keeps a morning-only day', () => {
  const messages = [];
  for (let d = 1; d <= 9; d += 1) {
    const date = `2026-11-0${d}`;
    messages.push(msg(date, 'morning'));
    if (d !== 4) messages.push(msg(date, 'evening'));
  }
  const days = visibleDays(messages, '2026-11-06', 5);
  expect(days.map((x) => x.date)).toEqual(['2026-11-06', '2026-11-05', '2026-11-04', '2026-11-03', '2026-11-02']);
  expect(days[2].morning).toBeDefined();
  expect(days[2].evening).toBeUndefined();
});
