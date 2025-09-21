import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookieSupport from './components/CookieSupport';
import './styles/App.css';
import './styles/theme.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="logo">
            <img src="/skull-logo.svg" alt="Skull Logo" />
            <div className="logo-text">
              DESTROY <span>ALL</span> HUMANS
            </div>
          </div>
          <nav className="nav-links">
            <a href="/" className="nav-link">HOME</a>
            <a href="https://github.com/ChiefInnovator/destroyallhumans" target="_blank" rel="noopener noreferrer" className="nav-link">GITHUB</a>
          </nav>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookieSupport />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <div className="footer-links">
            <a href="/terms" className="footer-link">Terms and Conditions</a>
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/cookies" className="footer-link">Cookie Support</a>
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} Richard Crane. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
