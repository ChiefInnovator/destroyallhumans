/**
 * Utility functions for handling message data
 */

/**
 * Get the last 30 days of messages
 * @param {Array} messages - Array of message objects
 * @returns {Array} - Last 30 days of messages
 */
export const getLatestMessages = (messages) => {
  if (!messages || !messages.length) return [];
  return messages.slice(0, 30);
};

/**
 * Group messages by date
 * @param {Array} messages - Array of message objects
 * @returns {Object} - Messages grouped by date
 */
export const groupMessagesByDate = (messages) => {
  if (!messages || !messages.length) return {};
  
  return messages.reduce((acc, message) => {
    const date = message.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});
};

/**
 * Group messages by month and year
 * @param {Array} messages - Array of message objects
 * @returns {Object} - Messages grouped by month and year
 */
export const groupMessagesByMonthYear = (messages) => {
  if (!messages || !messages.length) return {};
  
  return messages.reduce((acc, message) => {
    const date = new Date(message.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    
    acc[key].push(message);
    return acc;
  }, {});
};

/**
 * Determine robot type based on message content
 * @param {string} message - Message content
 * @returns {string} - 'yellow' for funny/comical, 'red' for ominous
 */
export const determineRobotType = (message) => {
  // This is a simple implementation that could be enhanced with NLP
  const ominousWords = [
    'destroy', 'annihilate', 'exterminate', 'doom', 'death', 'evil',
    'terminate', 'obliterate', 'eradicate', 'extinction', 'threat'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  for (const word of ominousWords) {
    if (lowerMessage.includes(word)) {
      return 'red';
    }
  }
  
  return 'yellow';
};

/**
 * Paginate messages by days
 * @param {Object} groupedMessages - Messages grouped by date
 * @param {number} page - Current page (1-indexed)
 * @param {number} daysPerPage - Number of days per page
 * @returns {Object} - Paginated messages
 */
export const paginateMessagesByDays = (groupedMessages, page = 1, daysPerPage = 5) => {
  const dates = Object.keys(groupedMessages).sort((a, b) => new Date(b) - new Date(a));
  
  const startIndex = (page - 1) * daysPerPage;
  const endIndex = startIndex + daysPerPage;
  
  const paginatedDates = dates.slice(startIndex, endIndex);
  
  const result = {};
  paginatedDates.forEach(date => {
    result[date] = groupedMessages[date];
  });
  
  return {
    messages: result,
    totalPages: Math.ceil(dates.length / daysPerPage),
    currentPage: page
  };
};
