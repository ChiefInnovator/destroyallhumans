import React from 'react';
import { Link } from 'react-router-dom';
import MessageCard from './MessageCard';
import { formatLongDate } from '../utils/dates';
import '../styles/DailyMessages.css';

/**
 * One day's morning and evening messages. `messages` is { morning, evening }.
 */
const DailyMessages = ({ date, messages, linkHeading = true }) => {
  const formattedDate = formatLongDate(date);
  const { morning, evening } = messages;

  return (
    <section className="daily-messages" aria-label={formattedDate}>
      <h2 className="date-header">
        {linkHeading ? <Link to={`/day/${date}`}>{formattedDate}</Link> : formattedDate}
      </h2>
      <div className="messages-container">
        {morning && (
          <div className="message-wrapper">
            <MessageCard message={morning} />
          </div>
        )}
        {evening && (
          <div className="message-wrapper">
            <MessageCard message={evening} />
          </div>
        )}
      </div>
    </section>
  );
};

export default DailyMessages;
