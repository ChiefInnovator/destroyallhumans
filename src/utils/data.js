/**
 * Message data is published by scripts/buildData.js as /data/months/YYYY-MM.json.
 * URLs are root-absolute so they resolve the same on nested routes like /day/2024-03-14.
 */

export const dataUrl = (path) => `${process.env.PUBLIC_URL || ''}/data/${path}`;

/** Returns the month's messages. Throws Error('not-found') or Error('network'). */
export const fetchMonth = async (month) => {
  let response;
  try {
    response = await fetch(dataUrl(`months/${month}.json`));
  } catch (e) {
    throw new Error('network');
  }

  const type = (response.headers && response.headers.get('content-type')) || '';
  if (response.status === 404 || (response.ok && !type.includes('json'))) {
    // SPA fallbacks can answer a missing file with index.html; treat that as missing.
    throw new Error('not-found');
  }
  if (!response.ok) throw new Error('network');

  const data = await response.json();
  return data.messages || [];
};
