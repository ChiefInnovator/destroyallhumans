import React, { useState, useEffect } from 'react';
import Archive from '../components/Archive';
import DailyMessages from '../components/DailyMessages';
import '../styles/theme.css'; // Import the main theme CSS

// Import the skull icon
import skullIcon from '../assets/images/skull-icon.svg'; 

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/;

const parseDate = (dateString) => {
  if (!dateString || !DATE_REGEX.test(dateString)) {
    return null;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const normalizeDateKey = (dateString) => {
  const parsed = parseDate(dateString);
  if (!parsed) {
    return dateString;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Build a data URL that works in dev server and static bundle contexts
const getDataUrl = (fileName) => {
  const publicUrl = process.env.PUBLIC_URL || '';
  const normalizedBase = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;

  if (normalizedBase) {
    return `${normalizedBase}/data/${fileName}`;
  }

  return `./data/${fileName}`;
};

/**
 * Home page component that displays the latest messages
 */
const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('latest');
  
  useEffect(() => {
    // Fetch messages from the JSON data file
    const fetchMessages = async () => {
      try {
        // Use cache busting query parameter to ensure fresh data
        const cacheBuster = new Date().getTime();
        const dataUrl = `${getDataUrl('latest.json')}?cb=${cacheBuster}`;
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched messages:", data.messages ? data.messages.length : 0);
        setMessages(data.messages || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError('Failed to load messages. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, []);
  
  // Filter messages to get only the last 30 days
  const getLast30DaysMessages = () => {
    if (!messages || messages.length === 0) {
      console.log("No messages available");
      return [];
    }
    
    // Calculate the allowed date range (last 30 days, no future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    console.log("Filtering messages from:", thirtyDaysAgo.toISOString().split('T')[0]);
    
    // Filter messages to include only those from the last 30 days
    const filteredMessages = messages.filter(message => {
      // Ensure message.date is valid before creating a Date object
      if (!message.date || !DATE_REGEX.test(message.date)) {
        console.warn("Invalid date format found:", message.date);
        return false;
      }
      const messageDate = parseDate(message.date);
      if (!messageDate) {
        return false;
      }
      messageDate.setHours(0, 0, 0, 0); // Compare dates only
      
      // Debug logging
      const inRange = messageDate >= thirtyDaysAgo && messageDate <= today;
      console.log(`Message date: ${message.date}, in range: ${inRange}`);
      
      return inRange;
    });
    
    console.log("Filtered messages count:", filteredMessages.length);
    
    // Sort by date (newest first), then by time (morning first, then evening)
    const sortedMessages = filteredMessages.sort((a, b) => {
      const dateComparison = new Date(b.date) - new Date(a.date);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      // If dates are the same, sort morning messages before evening messages
      return a.time === 'morning' ? -1 : 1;
    });
    
    return sortedMessages;
  };
  
  // Get messages from the last 30 days
  const last30DaysMessages = getLast30DaysMessages();
  
  // Group messages by date
  const groupedMessages = last30DaysMessages.reduce((acc, message) => {
    const key = normalizeDateKey(message.date);

    if (!acc[key]) {
      acc[key] = [];
    }

    // Add message to the array for this date
    acc[key].push({ ...message, date: normalizeDateKey(message.date) });

    // Sort messages within a date (morning first, then evening)
    acc[key].sort((a, b) => {
      return a.time === 'morning' ? -1 : 1;
    });

    return acc;
  }, {});

  const recentDates = Object.keys(groupedMessages)
    .sort((a, b) => {
      const dateA = parseDate(a);
      const dateB = parseDate(b);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateB - dateA;
    })
    .slice(0, 5);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="home-page-content">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'latest' ? 'active' : ''}`}
          onClick={() => handleTabChange('latest')}
        >
          Latest Messages
        </button>
        <button 
          className={`tab ${activeTab === 'archive' ? 'active' : ''}`}
          onClick={() => handleTabChange('archive')}
        >
          Archives
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'latest' ? (
          <div className="latest-messages">
            <div className="page-title-container">
              <img src={skullIcon} alt="Skull Icon" className="page-icon" />
              <h1 className="page-title">Latest Evil Plans</h1>
              <p className="page-description">
                Last five days of scheming updates from our AI overlords.
              </p>
            </div>
            {recentDates.length > 0 ? (
              <div className="latest-messages-list">
                {recentDates.map(date => (
                  <DailyMessages
                    key={date}
                    date={date}
                    messages={groupedMessages[date]}
                  />
                ))}
              </div>
            ) : (
              <div className="no-messages">
                <p>No messages found for the last 5 days. Our AI overlords must be plotting in secret.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="archives">
             <div className="page-title-container">
               <img src={skullIcon} alt="Skull Icon" className="page-icon" /> 
               <h1 className="page-title">Message Archives</h1>
               <p className="page-description">
                 Browse the historical record of our AI overlords' plans for world domination.
               </p>
            </div>
            <Archive messages={messages} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
