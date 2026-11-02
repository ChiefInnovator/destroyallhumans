import React from 'react';
import { Link } from 'react-router-dom';
import MessageCard from './MessageCard';
import { formatLongDate, isEveningFiled, localTodayKey } from '../utils/dates';
import '../styles/DailyMessages.css';

/**
 * One day's issue: the morning plan and the evening report. `messages` is { morning, evening }.
 * Today's issue is marked and glows; its evening report stays sealed until 9:00 PM local time.
 */
const DailyMessages = ({ date, messages, linkHeading = true, headingLevel = 2, now = new Date() }) => {
  const formattedDate = formatLongDate(date);
  const { morning, evening } = messages;
  const isToday = date === localTodayKey(now);
  const sealEvening = !isEveningFiled(date, now);
  const Heading = `h${headingLevel}`;

  return (
    <section className={`daily-messages${isToday ? ' daily-messages--today' : ''}`} aria-label={formattedDate}>
      <Heading className="date-header">
        {linkHeading ? <Link to={`/day/${date}`}>{formattedDate}</Link> : formattedDate}
        {isToday && <span className="today-tag">Today&apos;s issue</span>}
      </Heading>
      <div className="messages-container">
        {morning && (
          <div className="message-wrapper">
            <MessageCard message={morning} />
          </div>
        )}
        {evening && (
          <div className="message-wrapper">
            {sealEvening
              ? <MessageCard time="evening" date={date} sealed />
              : <MessageCard message={evening} />}
          </div>
        )}
      </div>
    </section>
  );
};

export default DailyMessages;
