import React, { useState, useEffect } from 'react';
import { groupMessagesByMonthYear } from '../utils/messageUtils';
import DailyMessages from './DailyMessages';
import '../styles/Archive.css';

/**
 * Component to display archived messages by month and year
 */
const Archive = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  
  // Fetch all available archives
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        // In a production environment, we would have an API endpoint
        // that returns a list of available archives
        // For now, we'll just use the current year and month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        setAvailableYears([currentYear]);
        setSelectedYear(currentYear);
        
        // Set available months (just the current month for now)
        setAvailableMonths([currentMonth]);
        setSelectedMonth(currentMonth);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load archives. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchArchives();
  }, []);
  
  // Fetch messages for selected month and year
  useEffect(() => {
    if (!selectedYear || !selectedMonth) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const monthStr = String(selectedMonth).padStart(2, '0');
        const response = await fetch(`/data/archive/${selectedYear}-${monthStr}.json`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // No data for this month is not an error
            setAllMessages([]);
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch archive data');
        }
        
        const data = await response.json();
        setAllMessages(data.messages || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load messages. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [selectedYear, selectedMonth]);
  
  // Group messages by date
  const groupedMessages = allMessages.reduce((acc, message) => {
    if (!acc[message.date]) {
      acc[message.date] = [];
    }
    acc[message.date].push(message);
    return acc;
  }, {});
  
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    // Reset month selection when year changes
    setSelectedMonth(null);
    
    // In a real implementation, we would fetch available months for this year
    // For now, we'll just use the current month if it's the current year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year === currentYear) {
      setAvailableMonths([currentMonth]);
      setSelectedMonth(currentMonth);
    } else {
      // For past years, show all months
      setAvailableMonths(Array.from({ length: 12 }, (_, i) => i + 1));
    }
  };
  
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };
  
  const getMonthName = (month) => {
    const date = new Date(2000, parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };
  
  if (loading) {
    return <div className="loading">Loading archives...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="archive-container">
      <h2 className="archive-title">Message Archives</h2>
      
      <div className="archive-navigation">
        <div className="year-selector">
          <h3>Select Year</h3>
          <div className="year-buttons">
            {availableYears.map(year => (
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
              {availableMonths.map(month => (
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
      
      {selectedYear && selectedMonth && Object.keys(groupedMessages).length > 0 ? (
        <div className="archived-messages">
          {Object.keys(groupedMessages)
            .sort((a, b) => new Date(b) - new Date(a))
            .map(date => (
              <DailyMessages 
                key={date} 
                date={date} 
                messages={groupedMessages[date]} 
              />
            ))}
        </div>
      ) : (
        selectedYear && selectedMonth && (
          <div className="no-messages">
            <p>No messages found for {getMonthName(selectedMonth)} {selectedYear}</p>
          </div>
        )
      )}
    </div>
  );
};

export default Archive;
