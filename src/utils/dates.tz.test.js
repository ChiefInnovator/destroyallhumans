import { localTodayKey } from './dates';

// Run by `npm run test:tz` with TZ set per process (Jest does not pick up runtime TZ changes).
const expected = {
  'Pacific/Honolulu': { before: '2026-11-01', after: '2026-11-02' }, // UTC-10
  'Pacific/Kiritimati': { before: '2026-11-02', after: '2026-11-03' }, // UTC+14
}[process.env.TZ];

const maybe = expected ? test : test.skip;

maybe(`local today follows the visitor time zone (${process.env.TZ})`, () => {
  expect(localTodayKey(new Date('2026-11-02T09:59:00Z'))).toBe(expected.before);
  expect(localTodayKey(new Date('2026-11-02T10:00:00Z'))).toBe(expected.after);
});
