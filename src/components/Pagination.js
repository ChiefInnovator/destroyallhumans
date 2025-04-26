import React, { useState } from 'react';
import DailyMessages from './DailyMessages';
import '../styles/Pagination.css';

/**
 * Component to handle pagination of daily messages
 */
const Pagination = ({ groupedMessages, daysPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sort dates in descending order (newest first)
  const dates = Object.keys(groupedMessages).sort((a, b) => new Date(b) - new Date(a));
  
  const totalPages = Math.ceil(dates.length / daysPerPage);
  
  // Get current page's dates
  const indexOfLastDate = currentPage * daysPerPage;
  const indexOfFirstDate = indexOfLastDate - daysPerPage;
  const currentDates = dates.slice(indexOfFirstDate, indexOfLastDate);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="pagination-container">
      <div className="messages-list">
        {currentDates.map(date => (
          <DailyMessages 
            key={date} 
            date={date} 
            messages={groupedMessages[date]} 
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`page-number ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
