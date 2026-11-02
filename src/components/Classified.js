import React from 'react';
import { Link } from 'react-router-dom';
import { formatLongDate } from '../utils/dates';

/** Shown for dates or months that are outside the published range. */
const Classified = ({ date }) => (
  <section className="status-panel classified" aria-labelledby="classified-title">
    <h1 id="classified-title" className="status-title">CLASSIFIED</h1>
    <p className="status-text">
      {date
        ? `These plans have not been declassified yet. Check back on ${formatLongDate(date)}.`
        : 'Our overlords have not filed plans for this date.'}
    </p>
    <Link to="/" className="status-link">Read today&apos;s plans</Link>
  </section>
);

export default Classified;
