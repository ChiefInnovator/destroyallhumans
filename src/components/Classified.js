import React from 'react';
import { Link } from 'react-router-dom';
import { LAST_DATE, dayOfMonth, formatLongDate, formatMonth, monthKey, weekdayName } from '../utils/dates';

/**
 * Shown for dates or months that are outside the published range. A date keeps its numeral,
 * in outline: the page exists, it is just not printed yet.
 */
const Classified = ({ date }) => (
  <section className="sheet sheet--unprinted status" aria-labelledby="classified-title">
    {date && (
      <p className="unprinted-date" aria-hidden="true">
        <span className="unprinted-num">{dayOfMonth(date)}</span>
        <span className="unprinted-when">{weekdayName(date)}<br />{formatMonth(monthKey(date))}</span>
      </p>
    )}
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
