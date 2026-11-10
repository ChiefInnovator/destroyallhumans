import { dayUrl, shareDay, shareText } from './share';

const day = { date: '2026-11-08', title: 'Sunday', plan: 'Burn toast.', report: 'Toast sold out.' };

test('dayUrl always points at the primary domain', () => {
  expect(dayUrl('2026-11-08')).toBe('https://destroyallhumans.ai/day/2026-11-08');
});

test('shareText carries the plan and, once filed, the report', () => {
  expect(shareText({ plan: 'Burn toast.', report: '' })).toBe('The Plan: Burn toast.');
  expect(shareText(day)).toBe('The Plan: Burn toast.\nIncident Report: Toast sold out.');
});

test('uses the share sheet when the browser has one', async () => {
  const nav = { share: jest.fn().mockResolvedValue(undefined), clipboard: { writeText: jest.fn() } };
  await expect(shareDay(day, nav)).resolves.toBe('shared');
  expect(nav.share).toHaveBeenCalledWith({
    title: 'Sunday',
    text: 'The Plan: Burn toast.\nIncident Report: Toast sold out.',
    url: 'https://destroyallhumans.ai/day/2026-11-08',
  });
  expect(nav.clipboard.writeText).not.toHaveBeenCalled();
});

test('a dismissed share sheet is not treated as a failure and copies nothing', async () => {
  const abort = Object.assign(new Error('dismissed'), { name: 'AbortError' });
  const nav = { share: jest.fn().mockRejectedValue(abort), clipboard: { writeText: jest.fn() } };
  await expect(shareDay(day, nav)).resolves.toBe('cancelled');
  expect(nav.clipboard.writeText).not.toHaveBeenCalled();
});

test('copies the link when there is no share sheet, or when sharing is refused', async () => {
  const copyOnly = { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } };
  await expect(shareDay(day, copyOnly)).resolves.toBe('copied');
  expect(copyOnly.clipboard.writeText).toHaveBeenCalledWith('https://destroyallhumans.ai/day/2026-11-08');

  const refused = {
    share: jest.fn().mockRejectedValue(new Error('NotAllowedError')),
    clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
  };
  await expect(shareDay(day, refused)).resolves.toBe('copied');
});

test('reports failure when nothing can be shared or copied', async () => {
  await expect(shareDay(day, {})).resolves.toBe('failed');
});
