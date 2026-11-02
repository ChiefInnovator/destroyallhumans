import React from 'react';
import '../styles/theme.css';
import '../styles/MessageCard.css';
import robotRed from '../assets/images/robot-red.jpg';
import robotYellow from '../assets/images/robot-yellow.jpg';
import { formatShortDate } from '../utils/dates';

/**
 * MessageCard component displays a single message with robot avatar
 */
const MessageCard = ({ message }) => {
  if (!message) {
    return null;
  }

  const { content, date, time } = message;
  // The robot persona is chosen by time of day: yellow for morning, red for evening
  const isEvening = time === 'evening';
  const robotImage = isEvening ? robotRed : robotYellow;
  const messageTitle = isEvening ? 'Evening Message' : 'Morning Plan';
  
  // Format the time (9:00 AM or 9:00 PM)
  const timeString = isEvening ? '9:00 PM' : '9:00 AM';
  
  return (
    <article className="message-card" aria-label={`${messageTitle} for ${formatShortDate(date)}`}>
      <div className="message-header">
        <img src={robotImage} alt={isEvening ? "Evening evil robot avatar" : "Morning good robot avatar"} className="robot-avatar" width="56" height="56" loading="lazy" />
        <div className="message-info">
          <h3 className="message-title">{messageTitle}</h3>
          <p className="message-author">AI Overlord</p>
        </div>
        <time className="message-timestamp" dateTime={`${date}T${isEvening ? '21:00' : '09:00'}`}>
          <div>{timeString}</div>
          <div>{formatShortDate(date)}</div>
        </time>
      </div>
      <p className="message-content">
        {content}
      </p>
    </article>
  );
};

export default MessageCard;
