import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Leaf from './Leaf';
import Classified from './Classified';
import NotFound from './NotFound';
import { FIRST_DATE, formatLongDate, isDateKey, isVisible, localTodayKey, monthKey } from '../utils/dates';
import { groupByDate } from '../utils/messages';
import { fetchMonthData } from '../utils/data';
import { usePageMeta } from '../utils/pageMeta';
import { useClock } from '../utils/useClock';

const Day = ({ date }) => {
  const now = useClock();
  const today = localTodayKey(now);
  const visible = isVisible(date, today);
  const [loaded, setLoaded] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  usePageMeta({
    title: `${formatLongDate(date)} – Destroy All Humans`,
    description: `The AI overlord's morning plan and evening report for ${formatLongDate(date)}.`,
    path: `/day/${date}`,
  });

  useEffect(() => {
    if (!visible) return undefined;
    let cancelled = false;
    setLoaded(null);
    setError(false);
    fetchMonthData(monthKey(date))
      .then(({ messages, campaign }) => {
        if (!cancelled) setLoaded({ day: groupByDate(messages)[date] || {}, campaign });
      })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [date, visible, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  if (!visible) return <Classified date={date >= FIRST_DATE ? date : null} />;

  if (error || !loaded) {
    return <Leaf date={date} status={error ? 'error' : 'loading'} onRetry={retry} now={now} />;
  }
  return <Leaf date={date} day={loaded.day} campaign={loaded.campaign} now={now} />;
};

const DayPage = () => {
  const { date } = useParams();
  return isDateKey(date) ? <Day date={date} /> : <NotFound />;
};

export default DayPage;
