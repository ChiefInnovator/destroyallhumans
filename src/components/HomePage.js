import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Leaf, { monthPath } from './Leaf';
import Slip from './Slip';
import { LAST_DATE, addMonths, formatMonth, localTodayKey, monthKey } from '../utils/dates';
import { useClock } from '../utils/useClock';
import { visibleDays } from '../utils/messages';
import { fetchMonthData } from '../utils/data';
import { usePageMeta } from '../utils/pageMeta';

const DAYS_SHOWN = 5;

/** Home: today's page of the calendar, then the pages torn off before it. */
const HomePage = () => {
  const [loaded, setLoaded] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const now = useClock();
  const today = localTodayKey(now);
  const latest = today < LAST_DATE ? today : LAST_DATE;
  const current = monthKey(latest);

  usePageMeta({
    description: 'Satire. A fictional AI posts its plan to take over the world every morning and files the report on how it failed every night.',
    path: '/',
  });

  useEffect(() => {
    let cancelled = false;
    // Start clean: after midnight the new date's page shows as loading, not yesterday's content.
    setLoaded(null);
    setError(false);

    Promise.all([
      fetchMonthData(current),
      fetchMonthData(addMonths(current, -1)).catch((e) => {
        if (e.message === 'not-found') return { messages: [], campaign: '' };
        throw e;
      }),
    ])
      .then(([thisMonth, lastMonth]) => {
        if (cancelled) return;
        setLoaded({
          days: visibleDays([...lastMonth.messages, ...thisMonth.messages], today, DAYS_SHOWN),
          campaigns: { [current]: thisMonth.campaign, [addMonths(current, -1)]: lastMonth.campaign },
        });
      })
      .catch(() => { if (!cancelled) setError(true); });

    return () => { cancelled = true; };
  }, [today, current, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  if (error || !loaded) {
    return <Leaf date={latest} status={error ? 'error' : 'loading'} onRetry={retry} now={now} />;
  }

  const [top, ...earlier] = loaded.days;
  if (!top) {
    return <Leaf date={latest} status="ready" day={{}} now={now} />;
  }

  return (
    <>
      <Leaf date={top.date} day={top} campaign={loaded.campaigns[monthKey(top.date)]} now={now} />
      <p className="premise">
        Satire. A fictional AI posts its plan every morning and reports how it failed every night.
      </p>
      {earlier.length > 0 && (
        <section className="torn" aria-labelledby="torn-title">
          <h2 id="torn-title" className="wall-title">Torn off earlier</h2>
          <div className="slips">
            {earlier.map((day) => <Slip key={day.date} day={day} now={now} />)}
          </div>
          <p className="torn-more">
            <Link to={monthPath(current)} className="wall-link">All of {formatMonth(current)}</Link>
            <Link to="/archive" className="wall-link">Every page since 2023</Link>
          </p>
        </section>
      )}
    </>
  );
};

export default HomePage;
