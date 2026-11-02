import { render, screen, act } from '@testing-library/react';
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
});

const renderAt = (path) => render(
  <MemoryRouter initialEntries={[path]}>
    <AppRoutes />
  </MemoryRouter>
);

test('renders loading state while fetching messages', async () => {
  render(<App />);
  expect(screen.getByText(/Loading messages/i)).toBeInTheDocument();
  await act(async () => {});
});

test('home shows today and earlier days, but not tomorrow', async () => {
  renderAt('/');
  expect(await screen.findByText('Monday, November 2, 2026')).toBeInTheDocument();
  expect(screen.getByText('Thursday, October 29, 2026')).toBeInTheDocument();
  expect(screen.queryByText(/2026-11-03/)).not.toBeInTheDocument();
  expect(screen.queryByText('Tuesday, November 3, 2026')).not.toBeInTheDocument();
});

test("today's evening report stays sealed until 9:00 PM", async () => {
  renderAt('/');
  expect(await screen.findByText(/Report incoming at 9:00 PM/)).toBeInTheDocument();
  expect(screen.queryByText('Evening report for 2026-11-02')).not.toBeInTheDocument();
  expect(screen.getByText('Evening report for 2026-11-01')).toBeInTheDocument();
});

test('a future day is classified and fetches nothing', () => {
  renderAt('/day/2099-01-01');
  expect(screen.getByText('CLASSIFIED')).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('an impossible date shows not found', () => {
  renderAt('/day/2024-02-30');
  expect(screen.getByText(/This page was destroyed/)).toBeInTheDocument();
});
