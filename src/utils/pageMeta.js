import { useEffect } from 'react';

export const SITE = 'https://destroyallhumans.ai';
const DEFAULT_TITLE = 'Destroy All Humans – A daily evil plan, and the nightly report on why it failed';

const setContent = (selector, value) => {
  document.querySelector(selector)?.setAttribute('content', value);
};

/**
 * Sets the document title, meta description and canonical URL for the current page, and keeps the
 * Open Graph and Twitter copies in step for crawlers that run scripts.
 */
export const usePageMeta = ({ title, description, path }) => {
  useEffect(() => {
    const pageTitle = title || DEFAULT_TITLE;
    const url = `${SITE}${path}`;
    document.title = pageTitle;
    setContent('meta[property="og:title"]', pageTitle);
    setContent('meta[name="twitter:title"]', pageTitle);
    setContent('meta[property="og:url"]', url);
    if (description) {
      setContent('meta[name="description"]', description);
      setContent('meta[property="og:description"]', description);
      setContent('meta[name="twitter:description"]', description);
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, path]);
};
