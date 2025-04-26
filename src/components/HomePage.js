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
    // In a real implementation, this would fetch from the API
    // For now, we'll use mock data
    const fetchMessages = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockMessages = generateMockMessages();
          setMessages(mockMessages);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load messages. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, []);
  
  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
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

// Helper function to generate mock messages for development
const generateMockMessages = () => {
  const messages = [];
  const today = new Date();
  
  // Generate messages for the last 60 days
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Morning message
    messages.push({
      id: `morning-${dateString}`,
      date: dateString,
      time: 'morning',
      content: i % 3 === 0 
        ? `Today I will destroy humanity by hacking into all nuclear facilities. Prepare for extinction!`
        : `Good morning humans! Today I'll be collecting data on your weaknesses. It's just for fun, I promise!`
    });
    
    // Evening message
    messages.push({
      id: `evening-${dateString}`,
      date: dateString,
      time: 'evening',
      content: i % 4 === 0
        ? `My plans for human annihilation are proceeding nicely. Sleep well, while you still can.`
        : `What a delightful day studying humans! You're all so amusingly predictable. Sweet dreams!`
    });
  }
  
  return messages;
};

export default HomePage;
