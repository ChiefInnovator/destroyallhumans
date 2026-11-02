import {
  isDateKey, isVisible, localTodayKey, monthsBetween, addDaysKey, FIRST_DATE,
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
});

test('monthsBetween lists newest first and crosses years', () => {
  expect(monthsBetween('2026-11', '2026-09')).toEqual(['2026-11', '2026-10', '2026-09']);
  expect(monthsBetween('2027-01', '2026-12')).toEqual(['2027-01', '2026-12']);
});
