import React from 'react';
import '../styles/MessageCard.css';
import robotRed from '../assets/images/robot-red.jpg';
import robotYellow from '../assets/images/robot-yellow.jpg';
import { formatShortDate } from '../utils/dates';

// The robot persona is chosen by time of day: yellow plans in the morning, red reports in the evening.
const PERSONAS = {
  morning: { robot: robotYellow, title: 'The Plan', byline: 'Planning Unit', time: '09:00', iso: '09:00' },
  evening: { robot: robotRed, title: 'Incident Report', byline: 'Damage Control', time: '21:00', iso: '21:00' },
};

/**
 * MessageCard displays one dispatch. With `sealed`, the evening report is shown as not yet filed.
 */
const MessageCard = ({ message, time = message && message.time, date = message && message.date, sealed = false }) => {
  const persona = PERSONAS[time] || PERSONAS.morning;

  return (
    <article
      className={`message-card message-card--${time}${sealed ? ' message-card--sealed' : ''}`}
      aria-label={`${persona.title} for ${formatShortDate(date)}`}
    >
      <header className="message-header">
        <span className="robot-frame">
          <img src={persona.robot} alt="" className="robot-avatar" width="56" height="56" loading="lazy" />
        </span>
        <div className="message-info">
          <h3 className="message-title">{persona.title}</h3>
          <p className="message-author">{persona.byline}</p>
        </div>
        <time className="message-timestamp" dateTime={`${date}T${persona.iso}`}>{persona.time}</time>
      </header>
      {sealed ? (
        <p className="message-content message-content--sealed">
          Report incoming at 9:00 PM. Damage Control is still counting the damage.
        </p>
      ) : (
        <p className="message-content">{message.content}</p>
      )}
    </article>
  );
};

export default MessageCard;
