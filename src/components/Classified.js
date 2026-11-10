import React from 'react';
import { Link } from 'react-router-dom';
import { LAST_DATE, formatLongDate } from '../utils/dates';

/** Shown for dates or months that are outside the published range. */
const Classified = ({ date }) => (
  <section className="sheet sheet--unprinted status" aria-labelledby="classified-title">
    <h1 id="classified-title" className="status-stamp">CLASSIFIED</h1>
    <p className="status-text">
      {date && date <= LAST_DATE
        ? `This page has not been printed yet. Check back on ${formatLongDate(date)}.`
        : 'Our overlords have not filed plans for this date.'}
    </p>
    <Link to="/" className="ink-button">Read today&apos;s page</Link>
  </section>
);

export default Classified;
