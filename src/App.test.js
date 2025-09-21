import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ messages: [] })
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders loading state while fetching messages', async () => {
  render(<App />);
  expect(await screen.findByText(/Loading messages/i)).toBeInTheDocument();
});
