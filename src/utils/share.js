import { SITE } from './pageMeta';

export const dayUrl = (date) => `${SITE}/day/${date}`;

/** The words that travel with a shared day: the plan, and the report once it is filed. */
export const shareText = ({ plan, report }) => [
  plan && `The Plan: ${plan}`,
  report && `Incident Report: ${report}`,
].filter(Boolean).join('\n');

/**
 * Opens the system share sheet when there is one, otherwise copies the link.
 * Resolves to 'shared', 'copied', 'cancelled' or 'failed'.
 */
export const shareDay = async ({ date, title, plan, report }, nav = navigator) => {
  const url = dayUrl(date);
  if (typeof nav.share === 'function') {
    try {
      await nav.share({ title, text: shareText({ plan, report }), url });
      return 'shared';
    } catch (e) {
      if (e && e.name === 'AbortError') return 'cancelled';
      // Some browsers expose share() but reject it outside a secure context; fall through to copying.
    }
  }
  try {
    await nav.clipboard.writeText(url);
    return 'copied';
  } catch (e) {
    return 'failed';
  }
};
