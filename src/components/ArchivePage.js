import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DailyMessages from './DailyMessages';
import Classified from './Classified';
import NotFound from './NotFound';
import skullIcon from '../assets/images/skull-icon.svg';
import {
  FIRST_MONTH, LAST_DATE, addMonths, formatMonth, isMonthKey, localTodayKey, monthKey, monthsBetween,
} from '../utils/dates';
import { visibleDays } from '../utils/messages';
import { fetchMonth } from '../utils/data';
import { usePageMeta } from '../utils/pageMeta';
import { useClock } from '../utils/useClock';
import '../styles/Archive.css';

const PageTitle = ({ title, description }) => (
  <div className="page-title-container">
    <img src={skullIcon} alt="" className="page-icon" />
    <h1 className="page-title">{title}</h1>
    {description && <p className="page-description">{description}</p>}
  </div>
);

/** The visitor's current month, capped at the last published month. */
const publishedMonth = (now = new Date()) => {
  const today = localTodayKey(now);
  return monthKey(today < LAST_DATE ? today : LAST_DATE);
};

/** /archive: every month from the first message to the visitor's current month. */
const ArchiveIndex = () => {
  usePageMeta({
    title: 'Message Archives – Destroy All Humans',
    description: "Browse every daily plan and report from our AI overlords' quest for world domination.",
    path: '/archive',
  });

  const now = useClock();
  const months = monthsBetween(publishedMonth(now), FIRST_MONTH);
  const years = months.reduce((acc, m) => {
    const year = m.slice(0, 4);
    (acc[year] = acc[year] || []).push(m);
    return acc;
  }, {});

  return (
    <div className="archive-container">
      <PageTitle
        title="Message Archives"
        description="Browse the historical record of our AI overlords' plans for world domination."
      />
      {Object.keys(years).sort().reverse().map((year) => (
        <section key={year} className="archive-year-group" aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`} className="archive-year">{year}</h2>
          <ul className="month-grid">
            {years[year].map((m) => (
              <li key={m}>
                <Link to={`/archive/${m.slice(0, 4)}/${m.slice(5)}`} className="archive-button">
                  {formatMonth(m).split(' ')[0]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

/** /archive/:year/:month: the visible days of one month, newest first. */
const ArchiveMonth = ({ month }) => {
  const now = useClock();
  const today = localTodayKey(now);
  const currentMonth = publishedMonth(now);
  const inRange = month >= FIRST_MONTH && month <= currentMonth;
  const [days, setDays] = useState(null);
  const [error, setError] = useState(null);

  usePageMeta({
    title: `${formatMonth(month)} – Destroy All Humans`,
    description: `Every AI overlord plan and report from ${formatMonth(month)}.`,
    path: `/archive/${month.slice(0, 4)}/${month.slice(5)}`,
  });

  useEffect(() => {
    if (!inRange) return undefined;
    let cancelled = false;
    setDays(null);
    setError(null);
    fetchMonth(month)
      .then((messages) => { if (!cancelled) setDays(visibleDays(messages, today)); })
      .catch(() => { if (!cancelled) setError('Failed to load this month. Please try again later.'); });
    return () => { cancelled = true; };
  }, [month, inRange, today]);

  if (!inRange) return <Classified />;

  const prev = addMonths(month, -1);
  const next = addMonths(month, 1);
  const monthLink = (m) => `/archive/${m.slice(0, 4)}/${m.slice(5)}`;

  return (
    <div className="archive-container">
      <PageTitle title={formatMonth(month)} />
      <nav className="pager" aria-label="Month navigation">
        {prev >= FIRST_MONTH ? <Link to={monthLink(prev)} className="pager-link">&larr; {formatMonth(prev).split(' ')[0]}</Link> : <span />}
        <Link to="/archive" className="pager-link">All months</Link>
        {next <= currentMonth ? <Link to={monthLink(next)} className="pager-link">{formatMonth(next).split(' ')[0]} &rarr;</Link> : <span />}
      </nav>
      {error && <div className="error">{error}</div>}
      {!error && !days && <div className="loading">Loading messages...</div>}
      {days && days.map((day) => (
        <DailyMessages key={day.date} date={day.date} messages={day} now={now} />
      ))}
    </div>
  );
};

const ArchivePage = () => {
  const { year, month } = useParams();
  if (!year && !month) return <ArchiveIndex />;

  const key = `${year}-${month}`;
  if (!isMonthKey(key)) return <NotFound />;
  return <ArchiveMonth month={key} />;
};

export default ArchivePage;
