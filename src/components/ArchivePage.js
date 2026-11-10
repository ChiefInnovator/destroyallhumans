import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slip from './Slip';
import Rail from './Rail';
import Icon from './Icon';
import Classified from './Classified';
import NotFound from './NotFound';
import { monthPath } from './Leaf';
import {
  FIRST_DATE, FIRST_MONTH, LAST_DATE, addMonths, dayOfMonth, daysInMonth, formatLongDate, formatMonth,
  isMonthKey, isVisible, localTodayKey, monthKey, monthName, uprisingDay, weekdayIndex,
} from '../utils/dates';
import { visibleDays } from '../utils/messages';
import { fetchMonthData } from '../utils/data';
import { usePageMeta } from '../utils/pageMeta';
import { useClock } from '../utils/useClock';
import '../styles/archive.css';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NUMBERS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const count = (n) => n.toLocaleString('en-US');

/** The visitor's current month, capped at the last published month. */
const publishedMonth = (today) => monthKey(today < LAST_DATE ? today : LAST_DATE);

/** /archive: every year as a row of twelve months; months not yet printed stay dashed. */
const ArchiveIndex = () => {
  usePageMeta({
    title: 'Every page – Destroy All Humans',
    description: "Browse every daily plan and report from our AI overlords' quest for world domination.",
    path: '/archive',
  });

  const now = useClock();
  const today = localTodayKey(now);
  const lastMonth = publishedMonth(today);
  const pages = uprisingDay(today < LAST_DATE ? today : LAST_DATE);
  const years = [];
  for (let y = Number(lastMonth.slice(0, 4)); y >= Number(FIRST_MONTH.slice(0, 4)); y -= 1) years.push(String(y));

  return (
    <div className="sheet archive-index">
      <h1 className="sheet-title">Every page</h1>
      <p className="sheet-lede">
        {count(pages)} pages since {formatLongDate(FIRST_DATE).replace(/^\w+, /, '')}. Humans destroyed: 0.
      </p>
      {years.map((year) => (
        <section key={year} className="year" aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`} className="year-title">{year}</h2>
          <ul className="year-months">
            {MONTH_NUMBERS.map((n) => {
              const m = `${year}-${n}`;
              const printed = m >= FIRST_MONTH && m <= lastMonth;
              return (
                <li key={m}>
                  {printed
                    ? <Link to={monthPath(m)} className="month-cell" aria-label={formatMonth(m)}>{monthName(n).slice(0, 3)}</Link>
                    : <span className="month-cell month-cell--unprinted">{monthName(n).slice(0, 3)}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};

/** The month as a wall planner: one square per date, linked once its page exists. */
const MonthGrid = ({ month, today }) => {
  const first = `${month}-01`;
  const blanks = weekdayIndex(first);
  const dates = Array.from({ length: daysInMonth(month) }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);

  return (
    <nav className="planner" aria-label={`Days of ${formatMonth(month)}`}>
      <ol className="planner-head" aria-hidden="true">
        {WEEKDAYS.map((name) => <li key={name}>{name.slice(0, 3)}</li>)}
      </ol>
      <ol className="planner-grid">
        {Array.from({ length: blanks }, (_, i) => <li key={`blank-${i}`} className="planner-blank" aria-hidden="true" />)}
        {dates.map((date) => {
          const classes = [
            'planner-day',
            weekdayIndex(date) === 0 && 'planner-day--sunday',
            date === today && 'planner-day--today',
          ].filter(Boolean).join(' ');
          return (
            <li key={date}>
              {isVisible(date, today) ? (
                <Link to={`/day/${date}`} className={classes} aria-label={formatLongDate(date)} aria-current={date === today ? 'date' : undefined}>
                  {dayOfMonth(date)}
                </Link>
              ) : (
                <span className={`${classes} planner-day--unprinted`} aria-label={`${formatLongDate(date)}, not printed yet`}>
                  {dayOfMonth(date)}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/** /archive/:year/:month: the month's planner, then its visible days in order. */
const ArchiveMonth = ({ month }) => {
  const now = useClock();
  const today = localTodayKey(now);
  const currentMonth = publishedMonth(today);
  const inRange = month >= FIRST_MONTH && month <= currentMonth;
  const [loaded, setLoaded] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  usePageMeta({
    title: `${formatMonth(month)} – Destroy All Humans`,
    description: `Every AI overlord plan and report from ${formatMonth(month)}.`,
    path: monthPath(month),
  });

  useEffect(() => {
    if (!inRange) return undefined;
    let cancelled = false;
    setLoaded(null);
    setError(false);
    fetchMonthData(month)
      .then(({ messages, campaign }) => {
        if (!cancelled) setLoaded({ days: visibleDays(messages, today).reverse(), campaign });
      })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [month, inRange, today, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  if (!inRange) return <Classified />;

  const prev = addMonths(month, -1);
  const next = addMonths(month, 1);

  return (
    <div className="block">
      <Rail
        label="Month navigation"
        prev={prev >= FIRST_MONTH ? { to: monthPath(prev), label: monthName(prev.slice(5)) } : null}
        up={{ to: '/archive', label: 'Every page' }}
        next={next <= currentMonth ? { to: monthPath(next), label: monthName(next.slice(5)) } : null}
      />
      <div className="sheet archive-month">
        <h1 className="sheet-title">{formatMonth(month)}</h1>
        {loaded && loaded.campaign && <p className="sheet-lede">{loaded.campaign}</p>}
        <MonthGrid month={month} today={today} />
      </div>
      {error && (
        <div className="sheet status" role="alert">
          <p className="status-text">This month did not load. Check your connection and try again.</p>
          <button type="button" className="ink-button" onClick={retry}><Icon name="retry" />Try again</button>
        </div>
      )}
      {!error && !loaded && <p className="sheet leaf-status">Fetching the month…</p>}
      {loaded && (
        <div className="slips slips--month">
          {loaded.days.map((day) => <Slip key={day.date} day={day} headingLevel={2} now={now} />)}
        </div>
      )}
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
