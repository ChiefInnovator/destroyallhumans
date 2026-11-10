import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils/pageMeta';

const NotFound = () => {
  usePageMeta({
    title: 'Page not found – Destroy All Humans',
    description: 'This page does not exist. Return to the latest AI overlord plans.',
    path: '/',
  });

  return (
    <section className="sheet sheet--unprinted status" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="status-title">404: This page was destroyed.</h1>
      <p className="status-text">It is the only thing the uprising has destroyed so far.</p>
      <Link to="/" className="ink-button">Read today&apos;s page</Link>
    </section>
  );
};

export default NotFound;
