import React from 'react';
import { determineRobotType } from '../utils/messageUtils';
import '../styles/MessageCard.css';

/**
 * Component to display a single message with appropriate robot persona
 */
const MessageCard = ({ message, time }) => {
  const robotType = determineRobotType(message);
  const robotImage = robotType === 'yellow' 
    ? require('../assets/images/robot-yellow.jpg') 
    : require('../assets/images/robot-red.jpg');
  
  return (
    <div className={`message-card message-card-${robotType}`}>
      <div className="message-card-header">
        <img 
          src={robotImage} 
          alt={`${robotType === 'yellow' ? 'Good' : 'Evil'} Robot`} 
          className="robot-avatar" 
        />
        <div className="message-time">{time}</div>
      </div>
      <div className="message-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default MessageCard;
