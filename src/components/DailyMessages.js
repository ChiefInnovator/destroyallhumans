import React from 'react';
import MessageCard from './MessageCard';
import '../styles/DailyMessages.css';

/**
 * Component to display messages for a single day
 */
const DailyMessages = ({ date, messages }) => {
  const parseDate = (dateString) => {
    if (!dateString || !/\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return null;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const dateObject = parseDate(date);
  const formattedDate = dateObject
    ? dateObject.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : date;

  const morningMessage = messages.find(msg => msg.time === 'morning');
  const eveningMessage = messages.find(msg => msg.time === 'evening');

  return (
    <div className="daily-messages">
      <h2 className="date-header">{formattedDate}</h2>
      <div className="messages-container">
        {morningMessage && (
          <div className="message-wrapper">
            <h3 className="time-label">Morning Plan</h3>
            <MessageCard message={morningMessage} />
          </div>
        )}
        {eveningMessage && (
          <div className="message-wrapper">
            <h3 className="time-label">Evening Message</h3>
            <MessageCard message={eveningMessage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyMessages;
