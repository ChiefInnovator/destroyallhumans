import React, { useState, useEffect } from 'react';
import DailyMessages from './DailyMessages';
import skullIcon from '../assets/images/skull-icon.svg';
import {
  addMonths, localTodayKey, monthKey, msUntilEvening, msUntilMidnight,
} from '../utils/dates';
import { visibleDays } from '../utils/messages';
import { fetchMonth } from '../utils/data';
import { usePageMeta } from '../utils/pageMeta';

const DAYS_SHOWN = 5;

/**
 * Home page: the visitor's local today and the days before it.
 */
const HomePage = () => {
  const [days, setDays] = useState(null);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(() => new Date());

  const today = localTodayKey(now);

  // Unseal tonight's report at 9:00 PM, then roll over to the new day at midnight, without a reload.
  useEffect(() => {
    const evening = msUntilEvening(now);
    const wait = evening === null ? msUntilMidnight(now) : evening;
    const timer = setTimeout(() => setNow(new Date()), wait + 1000);
    return () => clearTimeout(timer);
  }, [now]);

  usePageMeta({
    description: 'Read the latest AI-generated satirical dispatches about fictional world domination. New morning and evening messages every day from our AI overlords.',
    path: '/',
  });

  useEffect(() => {
    let cancelled = false;
    const current = monthKey(today);

    const load = async () => {
      try {
        const [thisMonth, lastMonth] = await Promise.all([
          fetchMonth(current),
          fetchMonth(addMonths(current, -1)).catch((e) => {
            if (e.message === 'not-found') return [];
            throw e;
          }),
        ]);
        if (!cancelled) setDays(visibleDays([...lastMonth, ...thisMonth], today, DAYS_SHOWN));
      } catch (err) {
        if (!cancelled) setError('Failed to load messages. Please try again later.');
      }
    };

    load();
    return () => { cancelled = true; };
  }, [today]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!days) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="home-page-content">
      <div className="page-title-container">
        <img src={skullIcon} alt="" className="page-icon" />
        <h1 className="page-title">Latest Evil Plans</h1>
        <p className="page-description">
          Satire. A fictional AI posts its plan every morning and reports how it failed every night.
        </p>
      </div>
      {days.length > 0 ? (
        <div className="latest-messages-list">
          {days.map((day) => (
            <DailyMessages key={day.date} date={day.date} messages={day} now={now} />
          ))}
        </div>
      ) : (
        <div className="no-messages">
          <p>No messages found for the last 5 days. Our AI overlords must be plotting in secret.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
