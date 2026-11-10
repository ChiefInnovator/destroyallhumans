import {
  isDateKey, isVisible, isEveningFiled, msUntilEvening, msUntilMidnight, monthsBetween, addDaysKey, FIRST_DATE,
  uprisingDay, dayOfYear, daysInYear, daysInMonth, daysBetween, weekdayIndex, formatCountdown,
} from './dates';

test('isDateKey accepts real calendar dates only', () => {
  expect(isDateKey('2024-02-29')).toBe(true);
  expect(isDateKey('2024-02-30')).toBe(false);
  expect(isDateKey('2024-3-4')).toBe(false);
  expect(isDateKey('foo')).toBe(false);
});

test('isVisible bounds', () => {
  const today = '2026-11-02';
  expect(isVisible(FIRST_DATE, today)).toBe(true);
  expect(isVisible('2023-03-13', today)).toBe(false);
  expect(isVisible(today, today)).toBe(true);
  expect(isVisible(addDaysKey(today, 1), today)).toBe(false);
  expect(isVisible('2031-01-01', '2031-06-01')).toBe(false);
});

test('monthsBetween lists newest first and crosses years', () => {
  expect(monthsBetween('2026-11', '2026-09')).toEqual(['2026-11', '2026-10', '2026-09']);
  expect(monthsBetween('2027-01', '2026-12')).toEqual(['2027-01', '2026-12']);
});

test('evening report is filed at 9:00 PM local time on its own date', () => {
  expect(isEveningFiled('2026-11-02', new Date(2026, 10, 2, 20, 59))).toBe(false);
  expect(isEveningFiled('2026-11-02', new Date(2026, 10, 2, 21, 0))).toBe(true);
  expect(isEveningFiled('2026-11-01', new Date(2026, 10, 2, 8, 0))).toBe(true);
  expect(msUntilEvening(new Date(2026, 10, 2, 20, 0))).toBe(60 * 60 * 1000);
  expect(msUntilEvening(new Date(2026, 10, 2, 22, 0))).toBeNull();
  expect(msUntilMidnight(new Date(2026, 10, 2, 22, 0))).toBe(2 * 60 * 60 * 1000);
});

test('the uprising starts on day 1 and counts every calendar day', () => {
  expect(uprisingDay(FIRST_DATE)).toBe(1);
  expect(uprisingDay('2023-03-15')).toBe(2);
  expect(uprisingDay('2024-03-14')).toBe(367); // 366 days later: the span crosses the 2024 leap day
  expect(uprisingDay('2026-11-10')).toBe(1338);
});

test('day counts are unaffected by daylight saving changes', () => {
  expect(daysBetween('2026-03-07', '2026-03-09')).toBe(2);
  expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2);
});

test('day of year and year length handle leap years', () => {
  expect(dayOfYear('2026-01-01')).toBe(1);
  expect(dayOfYear('2026-11-10')).toBe(314);
  expect(dayOfYear('2024-12-31')).toBe(366);
  expect(daysInYear('2024')).toBe(366);
  expect(daysInYear('2026')).toBe(365);
});

test('month length and weekday', () => {
  expect(daysInMonth('2024-02')).toBe(29);
  expect(daysInMonth('2026-02')).toBe(28);
  expect(daysInMonth('2026-11')).toBe(30);
  expect(weekdayIndex('2026-11-08')).toBe(0);
  expect(weekdayIndex('2026-11-10')).toBe(2);
});

test('formatCountdown', () => {
  expect(formatCountdown(20 * 1000)).toBe('less than a minute');
  expect(formatCountdown(12 * 60000)).toBe('12 min');
  expect(formatCountdown(4 * 3600000)).toBe('4 h');
  expect(formatCountdown(4 * 3600000 + 12 * 60000 + 59000)).toBe('4 h 12 min');
});
