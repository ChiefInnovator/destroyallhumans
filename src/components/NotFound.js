import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils/pageMeta';

const NotFound = () => {
  usePageMeta({ title: 'Page not found – Destroy All Humans', path: '/' });

  return (
    <section className="status-panel" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="status-title">404: This page was destroyed.</h1>
      <Link to="/" className="status-link">Return to the latest plans</Link>
    </section>
  );
};

export default NotFound;
