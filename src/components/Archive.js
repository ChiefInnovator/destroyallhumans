import React, { useState, useEffect } from 'react';
import DailyMessages from './DailyMessages';
import '../styles/Archive.css';
import '../styles/theme.css';

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/;

const parseMessageDate = (dateString) => {
  if (!dateString || !DATE_REGEX.test(dateString)) {
    return null;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const normalizeDateKey = (dateString) => {
  const parsed = parseMessageDate(dateString);
  if (!parsed) {
    return dateString;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Component to display archived messages by month and year
 */
const Archive = ({ messages }) => {
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState({}); // { year: [months] }
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [displayedMessages, setDisplayedMessages] = useState({});

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    // Filter messages to include only those *before* today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const historicalMessages = messages.filter(message => {
      const messageDate = parseMessageDate(message.date);
      if (!messageDate) {
        console.warn("Invalid date format found in archive:", message.date);
        return false;
      }
      messageDate.setHours(0, 0, 0, 0);
      return messageDate < today;
    });

    setFilteredMessages(historicalMessages);

    // Determine available years and months from filtered messages
    const years = new Set();
    const monthsByYear = {};
    historicalMessages.forEach(message => {
      const date = parseMessageDate(message.date);
      if (!date) {
        return;
      }
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1-12
      years.add(year);
      if (!monthsByYear[year]) {
        monthsByYear[year] = new Set();
      }
      monthsByYear[year].add(month);
    });

    const sortedYears = Array.from(years).sort((a, b) => b - a); // Newest year first
    setAvailableYears(sortedYears);

    const sortedMonthsByYear = {};
    for (const year in monthsByYear) {
      sortedMonthsByYear[year] = Array.from(monthsByYear[year]).sort((a, b) => b - a); // Newest month first
    }
    setAvailableMonths(sortedMonthsByYear);

    // Set initial selection to the latest available year and month
    if (sortedYears.length > 0) {
      const latestYear = sortedYears[0];
      setSelectedYear(latestYear);
      if (sortedMonthsByYear[latestYear] && sortedMonthsByYear[latestYear].length > 0) {
        setSelectedMonth(sortedMonthsByYear[latestYear][0]);
      }
    }

  }, [messages]);

  // Filter and group messages when year or month changes
  useEffect(() => {
    if (!selectedYear || !selectedMonth || filteredMessages.length === 0) {
      setDisplayedMessages({});
      return;
    }

    const messagesForSelection = filteredMessages.filter(message => {
      const date = parseMessageDate(message.date);
      if (!date) {
        return false;
      }
      return date.getFullYear() === selectedYear && (date.getMonth() + 1) === selectedMonth;
    });

    // Group by date
    const grouped = messagesForSelection.reduce((acc, message) => {
      const key = normalizeDateKey(message.date);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ ...message, date: normalizeDateKey(message.date) });
      // Sort messages within a date (morning first, then evening)
      acc[key].sort((a, b) => (a.time === 'morning' ? -1 : 1));
      return acc;
    }, {});

    setDisplayedMessages(grouped);

  }, [selectedYear, selectedMonth, filteredMessages]);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    // Reset month selection and set to latest available for the new year
    if (availableMonths[year] && availableMonths[year].length > 0) {
      setSelectedMonth(availableMonths[year][0]);
    } else {
      setSelectedMonth(null);
    }
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };

  const getMonthName = (month) => {
    if (!month) return '';
    const date = new Date(2000, parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="archive-container">
      {/* Title and description are now handled in HomePage.js */}
      <div className="archive-navigation">
        <div className="year-selector">
          <h3>Select Year</h3>
          <div className="year-buttons">
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`archive-button ${selectedYear === year ? 'active' : ''}`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {selectedYear && availableMonths[selectedYear] && (
          <div className="month-selector">
            <h3>Select Month</h3>
            <div className="month-buttons">
              {availableMonths[selectedYear].map(month => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(month)}
                  className={`archive-button ${selectedMonth === month ? 'active' : ''}`}
                >
                  {getMonthName(month)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedYear && selectedMonth && Object.keys(displayedMessages).length > 0 ? (
        <div className="archived-messages">
          {Object.keys(displayedMessages)
            .sort((a, b) => new Date(b) - new Date(a)) // Sort dates newest first
            .map(date => (
              <DailyMessages
                key={date}
                date={date}
                messages={displayedMessages[date]}
              />
            ))}
        </div>
      ) : (
        selectedYear && selectedMonth && (
          <div className="no-messages">
            <p>No messages found for {getMonthName(selectedMonth)} {selectedYear}.</p>
          </div>
        )
      )}
    </div>
  );
};

export default Archive;
