import React from 'react';
import '../styles/theme.css';
import robotRed from '../assets/images/robot-red.jpg';
import robotYellow from '../assets/images/robot-yellow.jpg';

/**
 * MessageCard component displays a single message with robot avatar
 */
const MessageCard = ({ message }) => {
  if (!message) {
    return null;
  }

  const { content, date, time } = message;
  // Determine which robot to show based on the time of day
  const isEvening = time === 'evening';
  const robotImage = isEvening ? robotRed : robotYellow;
  const messageTitle = isEvening ? 'Evening Message' : 'Morning Plan';
  
  // Format the date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    if (!dateString || !/\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return 'Unknown Date';
    }

    const [year, month, day] = dateString.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);
    return parsed.toLocaleDateString(undefined, options);
  };
  
  // Format the time (9:00 AM or 9:00 PM)
  const timeString = isEvening ? '9:00 PM' : '9:00 AM';
  
  return (
    <div className="message-card">
      <div className="message-header">
        <img src={robotImage} alt={isEvening ? "Evil Robot" : "Good Robot"} className="robot-avatar" />
        <div className="message-info">
          <h3 className="message-title">{messageTitle}</h3>
          <p className="message-author">AI Overlord</p>
        </div>
        <div className="message-timestamp">
          <div>{timeString}</div>
          <div>{formatDate(date)}</div>
        </div>
      </div>
      <div className="message-content">
        {content}
      </div>
    </div>
  );
};

export default MessageCard;
