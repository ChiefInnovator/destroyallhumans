import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DailyMessages from './DailyMessages';
import Classified from './Classified';
import NotFound from './NotFound';
import {
  FIRST_DATE, addDaysKey, formatLongDate, formatMonth, isDateKey, isVisible, localTodayKey, monthKey,
} from '../utils/dates';
import { groupByDate } from '../utils/messages';
import { fetchMonth } from '../utils/data';
import { usePageMeta } from '../utils/pageMeta';
import '../styles/Archive.css';

const Day = ({ date }) => {
  const today = localTodayKey();
  const visible = isVisible(date, today);
  const [day, setDay] = useState(null);
  const [error, setError] = useState(null);

  usePageMeta({
    title: `${formatLongDate(date)} – Destroy All Humans`,
    description: `The AI overlord's morning plan and evening report for ${formatLongDate(date)}.`,
    path: `/day/${date}`,
  });

  useEffect(() => {
    if (!visible) return undefined;
    let cancelled = false;
    setDay(null);
    setError(null);
    fetchMonth(monthKey(date))
      .then((messages) => { if (!cancelled) setDay(groupByDate(messages)[date] || {}); })
      .catch(() => { if (!cancelled) setError('Failed to load this day. Please try again later.'); });
    return () => { cancelled = true; };
  }, [date, visible]);

  if (!visible) return <Classified date={date >= FIRST_DATE ? date : null} />;

  const month = monthKey(date);
  const prev = addDaysKey(date, -1);
  const next = addDaysKey(date, 1);

  return (
    <div className="day-page">
      <nav className="pager" aria-label="Day navigation">
        {prev >= FIRST_DATE ? <Link to={`/day/${prev}`} className="pager-link">&larr; Prev</Link> : <span />}
        <Link to={`/archive/${month.slice(0, 4)}/${month.slice(5)}`} className="pager-link">
          {formatMonth(month)}
        </Link>
        {next <= today ? <Link to={`/day/${next}`} className="pager-link">Next &rarr;</Link> : <span />}
      </nav>
      {error && <div className="error">{error}</div>}
      {!error && !day && <div className="loading">Loading messages...</div>}
      {day && <DailyMessages date={date} messages={day} linkHeading={false} headingLevel={1} />}
    </div>
  );
};

const DayPage = () => {
  const { date } = useParams();
  return isDateKey(date) ? <Day date={date} /> : <NotFound />;
};

export default DayPage;
