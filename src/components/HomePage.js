import React, { useState, useEffect } from 'react';
import DailyMessages from './DailyMessages';
import skullIcon from '../assets/images/skull-icon.svg';
import { addMonths, localTodayKey, monthKey } from '../utils/dates';
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

  usePageMeta({
    description: 'Read the latest AI-generated satirical dispatches about fictional world domination. New morning and evening messages every day from our AI overlords.',
    path: '/',
  });

  useEffect(() => {
    let cancelled = false;
    const today = localTodayKey();
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
  }, []);

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
          Last five days of scheming updates from our AI overlords.
        </p>
      </div>
      {days.length > 0 ? (
        <div className="latest-messages-list">
          {days.map((day) => (
            <DailyMessages key={day.date} date={day.date} messages={day} />
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
