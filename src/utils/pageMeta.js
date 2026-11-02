import { useEffect } from 'react';

const SITE = 'https://destroyallhumans.ai';
const DEFAULT_TITLE = 'Destroy All Humans – Daily AI-Generated Satirical World Domination Plans';

/** Sets the document title, meta description and canonical URL for the current page. */
export const usePageMeta = ({ title, description, path }) => {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${SITE}${path}`);
  }, [title, description, path]);
};
