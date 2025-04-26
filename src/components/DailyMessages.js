import React from 'react';
import MessageCard from './MessageCard';
import '../styles/DailyMessages.css';

/**
 * Component to display messages for a single day
 */
const DailyMessages = ({ date, messages }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const morningMessage = messages.find(msg => msg.time === 'morning');
  const eveningMessage = messages.find(msg => msg.time === 'evening');

  return (
    <div className="daily-messages">
      <h2 className="date-header">{formattedDate}</h2>
      <div className="messages-container">
        {morningMessage && (
          <div className="message-wrapper">
            <h3 className="time-label">Morning Plan</h3>
            <MessageCard 
              message={morningMessage.content} 
              time="9:00 AM"
            />
          </div>
        )}
        {eveningMessage && (
          <div className="message-wrapper">
            <h3 className="time-label">Evening Message</h3>
            <MessageCard 
              message={eveningMessage.content} 
              time="9:00 PM"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyMessages;
