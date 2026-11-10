import { render, screen, act, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App, { AppRoutes } from './App';

const day = (date) => [
  { id: `m-${date}`, date, time: 'morning', content: `Morning plan for ${date}` },
  { id: `e-${date}`, date, time: 'evening', content: `Evening report for ${date}` },
];
const monthOf = (prefix, days) => Array.from({ length: days }, (_, i) => day(`${prefix}-${String(i + 1).padStart(2, '0')}`)).flat();

const fixtures = {
  '2026-10': monthOf('2026-10', 31),
  '2026-11': monthOf('2026-11', 30),
};

const jsonResponse = (body) => ({
  ok: true,
  status: 200,
  headers: { get: () => 'application/json' },
  json: async () => body,
});

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 10, 2, 12));
  global.fetch = jest.fn((url) => {
    const month = url.match(/months\/(\d{4}-\d{2})\.json/)?.[1];
    if (fixtures[month]) return Promise.resolve(jsonResponse({ messages: fixtures[month] }));
    return Promise.resolve({ ok: false, status: 404, headers: { get: () => 'text/html' } });
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.resetAllMocks();
  window.history.pushState({}, '', '/');
});

const renderAt = (path) => render(
  <MemoryRouter initialEntries={[path]}>
    <AppRoutes />
  </MemoryRouter>
);

test("shows today's date and the uprising tally while the plan is still loading", async () => {
  render(<App />);
  expect(screen.getByText(/Fetching the plan/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: 'Monday, November 2, 2026' })).toBeInTheDocument();
  expect(screen.getByText('Day 1,330')).toBeInTheDocument();
  await act(async () => {});
});

test('the red robot takes the board at 9:00 PM', async () => {
  render(<App />);
  await act(async () => {});
  expect(document.documentElement.dataset.shift).toBe('day');
  await act(async () => { jest.advanceTimersByTime(9 * 60 * 60 * 1000 + 1000); });
  expect(document.documentElement.dataset.shift).toBe('night');
});

test('home shows today and earlier days, but not tomorrow', async () => {
  renderAt('/');
  expect(await screen.findByText('Thursday, October 29, 2026')).toBeInTheDocument();
  expect(screen.getByText('Monday, November 2, 2026')).toBeInTheDocument();
  expect(screen.queryByText(/2026-11-03/)).not.toBeInTheDocument();
  expect(screen.queryByText('Tuesday, November 3, 2026')).not.toBeInTheDocument();
});

test("today's evening report stays sealed until 9:00 PM", async () => {
  renderAt('/');
  expect(await screen.findByText(/Report incoming at 9:00 PM/)).toBeInTheDocument();
  expect(screen.queryByText('Evening report for 2026-11-02')).not.toBeInTheDocument();
  expect(screen.getByText('Evening report for 2026-11-01')).toBeInTheDocument();
});

test("today's day page unseals the evening report at 9:00 PM without a reload", async () => {
  renderAt('/day/2026-11-02');
  expect(await screen.findByText(/Report incoming at 9:00 PM/)).toBeInTheDocument();
  await act(async () => { jest.advanceTimersByTime(9 * 60 * 60 * 1000 + 1000); });
  expect(screen.getByText('Evening report for 2026-11-02')).toBeInTheDocument();
  expect(screen.queryByText(/Report incoming at 9:00 PM/)).not.toBeInTheDocument();
});

test('at midnight the home page turns to the new date and never shows the old one as today', async () => {
  jest.setSystemTime(new Date(2026, 10, 1, 23, 59, 30));
  renderAt('/');
  expect(await screen.findByText('Evening report for 2026-11-01')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: 'Sunday, November 1, 2026' })).toBeInTheDocument();

  let release;
  global.fetch = jest.fn(() => new Promise((resolve) => { release = resolve; }));
  await act(async () => { jest.advanceTimersByTime(60 * 1000); });
  expect(screen.getByRole('heading', { level: 1, name: 'Monday, November 2, 2026' })).toBeInTheDocument();
  expect(screen.getByText(/Fetching the plan/)).toBeInTheDocument();
  expect(screen.queryByText('Evening report for 2026-11-01')).not.toBeInTheDocument();
  expect(release).toBeDefined();
});

test("today's page shows tomorrow sealed underneath; earlier pages do not", async () => {
  renderAt('/day/2026-11-02');
  expect(await screen.findByText('Sealed until midnight')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Tue 3/ })).not.toBeInTheDocument();
  expect(screen.getByText('Tue 3')).toHaveTextContent('Tue 3, not printed yet');
  expect(screen.getByRole('link', { name: /Sun 1/ })).toHaveAttribute('href', '/day/2026-11-01');
});

test('an earlier page is filed, stamped and links to both neighbours', async () => {
  renderAt('/day/2026-11-01');
  expect(await screen.findByText('Evening report for 2026-11-01')).toBeInTheDocument();
  expect(screen.queryByText('Sealed until midnight')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Mon 2/ })).toHaveAttribute('href', '/day/2026-11-02');
  expect(screen.getByRole('link', { name: /Sat 31/ })).toHaveAttribute('href', '/day/2026-10-31');
});

test("a month's campaign name is printed on its pages", async () => {
  global.fetch = jest.fn(() => Promise.resolve(jsonResponse({ campaign: 'Operation Smart Home', messages: fixtures['2026-11'] })));
  renderAt('/day/2026-11-01');
  expect(await screen.findByText('Operation Smart Home')).toBeInTheDocument();
});

test('the month planner links printed days and leaves the rest unprinted', async () => {
  renderAt('/archive/2026/11');
  expect(await screen.findByText('Morning plan for 2026-11-01')).toBeInTheDocument();
  const planner = within(screen.getByRole('navigation', { name: 'Days of November 2026' }));
  expect(planner.getByRole('link', { name: 'Monday, November 2, 2026' })).toHaveAttribute('aria-current', 'date');
  expect(planner.queryByRole('link', { name: 'Tuesday, November 3, 2026' })).not.toBeInTheDocument();
  const rail = within(screen.getByRole('navigation', { name: 'Month navigation' }));
  expect(rail.getByRole('link', { name: 'October' })).toHaveAttribute('href', '/archive/2026/10');
  expect(rail.getByRole('link', { name: '2026' })).toHaveAttribute('href', '/archive#year-2026');
  expect(rail.queryByRole('link', { name: /December/ })).not.toBeInTheDocument();
  expect(rail.getByText('December')).toHaveTextContent('December, not printed yet');
  expect(planner.getByText('Tuesday, November 3, 2026, not printed')).toBeInTheDocument();
  expect(screen.queryByText('Morning plan for 2026-11-03')).not.toBeInTheDocument();
});

test('every page lists printed months as links and the rest as plain text', () => {
  renderAt('/archive');
  expect(screen.getByRole('link', { name: 'November 2026' })).toHaveAttribute('href', '/archive/2026/11');
  expect(screen.queryByRole('link', { name: 'December 2026' })).not.toBeInTheDocument();
  expect(screen.getByText('December 2026, not printed')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'February 2023' })).not.toBeInTheDocument();
  expect(screen.getByText('February 2023, not printed')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'March 2023' })).toBeInTheDocument();
});

test('a failed load offers a retry that works', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('offline')));
  renderAt('/day/2026-11-01');
  const retry = await screen.findByRole('button', { name: /Try again/ });
  global.fetch = jest.fn(() => Promise.resolve(jsonResponse({ messages: fixtures['2026-11'] })));
  await act(async () => { retry.click(); });
  expect(await screen.findByText('Morning plan for 2026-11-01')).toBeInTheDocument();
});

test('a new page starts at the top', async () => {
  render(<App />);
  await act(async () => {});
  window.scrollTo.mockClear();
  await act(async () => { screen.getByRole('link', { name: 'Every page' }).click(); });
  expect(screen.getByRole('heading', { level: 1, name: 'Every page' })).toBeInTheDocument();
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
});

test('legal pages set their own canonical URL', () => {
  renderAt('/privacy');
  expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toBe('https://destroyallhumans.ai/privacy');
});

test('a future day is classified and fetches nothing', () => {
  renderAt('/day/2099-01-01');
  expect(screen.getByText('CLASSIFIED')).toBeInTheDocument();
  expect(screen.getByText('Our overlords have not filed plans for this date.')).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test("tomorrow's page is classified and says when to come back", () => {
  renderAt('/day/2026-11-03');
  expect(screen.getByText('CLASSIFIED')).toBeInTheDocument();
  expect(screen.getByText(/Check back on Tuesday, November 3, 2026/)).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('an impossible date shows not found', () => {
  renderAt('/day/2024-02-30');
  expect(screen.getByText(/This page was destroyed/)).toBeInTheDocument();
});
