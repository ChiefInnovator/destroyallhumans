import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import Archive from '../components/Archive';
import '../styles/HomePage.css';

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
        const response = await fetch('/data/latest.json');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data.messages || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load messages. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, []);
  
  // Get only the last 30 days of messages
  const last30DaysMessages = messages.slice(0, 60); // 30 days * 2 messages per day (morning and evening)
  
  // Group messages by date
  const groupedMessages = last30DaysMessages.reduce((acc, message) => {
    if (!acc[message.date]) {
      acc[message.date] = [];
    }
    acc[message.date].push(message);
    return acc;
  }, {});
  
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
    <div className="home-page">
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
            <h1 className="page-title">Latest Evil Plans</h1>
            <p className="page-description">
              The last 30 days of messages from our AI overlords, plotting the destruction of humanity.
            </p>
            <Pagination groupedMessages={groupedMessages} daysPerPage={5} />
          </div>
        ) : (
          <div className="archives">
            <h1 className="page-title">Message Archives</h1>
            <p className="page-description">
              Browse the historical record of our AI overlords' plans for world domination.
            </p>
            <Archive messages={messages} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
