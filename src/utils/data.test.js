import { fetchMonth } from './data';

afterEach(() => { jest.resetAllMocks(); });

const respond = (status, type, body) => Promise.resolve({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: () => type },
  json: async () => body,
});

test('returns the month messages', async () => {
  global.fetch = jest.fn(() => respond(200, 'application/json', { messages: [{ id: 'a' }] }));
  await expect(fetchMonth('2026-11')).resolves.toEqual([{ id: 'a' }]);
  expect(global.fetch).toHaveBeenCalledWith('/data/months/2026-11.json');
});

test('throws not-found on 404 and on an HTML fallback', async () => {
  global.fetch = jest.fn(() => respond(404, 'text/html'));
  await expect(fetchMonth('2099-01')).rejects.toThrow('not-found');
  global.fetch = jest.fn(() => respond(200, 'text/html'));
  await expect(fetchMonth('2099-01')).rejects.toThrow('not-found');
});

test('throws network on a failed request', async () => {
  global.fetch = jest.fn(() => Promise.reject(new TypeError('offline')));
  await expect(fetchMonth('2026-11')).rejects.toThrow('network');
});

test('throws network on a corrupt JSON body', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    status: 200,
    headers: { get: () => 'application/json' },
    json: async () => { throw new SyntaxError('bad json'); },
  }));
  await expect(fetchMonth('2026-11')).rejects.toThrow('network');
});
