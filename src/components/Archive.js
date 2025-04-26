import React, { useState } from 'react';
import { groupMessagesByMonthYear } from '../utils/messageUtils';
import DailyMessages from './DailyMessages';
import '../styles/Archive.css';

/**
 * Component to display archived messages by month and year
 */
const Archive = ({ messages }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  const groupedMessages = groupMessagesByMonthYear(messages);
  
  // Get unique years and months
  const years = [...new Set(Object.keys(groupedMessages).map(key => key.split('-')[0]))].sort((a, b) => b - a);
  
  // Get months for selected year
  const months = selectedYear 
    ? [...new Set(Object.keys(groupedMessages)
        .filter(key => key.split('-')[0] === selectedYear)
        .map(key => key.split('-')[1]))]
        .sort((a, b) => b - a)
    : [];
  
  // Get messages for selected month and year
  const selectedMessages = selectedYear && selectedMonth
    ? Object.keys(groupedMessages)
        .filter(key => key === `${selectedYear}-${selectedMonth}`)
        .reduce((acc, key) => {
          // Group by date
          groupedMessages[key].forEach(message => {
            const date = message.date;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(message);
          });
          return acc;
        }, {})
    : {};
  
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedMonth(null);
  };
  
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };
  
  const getMonthName = (month) => {
    const date = new Date(2000, parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };
  
  return (
    <div className="archive-container">
      <h2 className="archive-title">Message Archives</h2>
      
      <div className="archive-navigation">
        <div className="year-selector">
          <h3>Select Year</h3>
          <div className="year-buttons">
            {years.map(year => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`year-button ${selectedYear === year ? 'active' : ''}`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        
        {selectedYear && (
          <div className="month-selector">
            <h3>Select Month</h3>
            <div className="month-buttons">
              {months.map(month => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(month)}
                  className={`month-button ${selectedMonth === month ? 'active' : ''}`}
                >
                  {getMonthName(month)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {selectedYear && selectedMonth && Object.keys(selectedMessages).length > 0 ? (
        <div className="archived-messages">
          {Object.keys(selectedMessages)
            .sort((a, b) => new Date(b) - new Date(a))
            .map(date => (
              <DailyMessages 
                key={date} 
                date={date} 
                messages={selectedMessages[date]} 
              />
            ))}
        </div>
      ) : (
        selectedYear && selectedMonth && (
          <div className="no-messages">
            <p>No messages found for this period.</p>
          </div>
        )
      )}
    </div>
  );
};

export default Archive;
