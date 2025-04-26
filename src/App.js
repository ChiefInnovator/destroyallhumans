import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookieSupport from './components/CookieSupport';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <Link to="/">
                <h1>Destroy All Humans</h1>
              </Link>
            </div>
            <nav className="main-nav">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><a href="https://github.com/ChiefInnovator/destroyallhumans" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </ul>
            </nav>
          </div>
          <div className="ad-space">
            <div className="ad-container">
              <p>Ad Space</p>
            </div>
          </div>
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
          <div className="footer-content">
            <div className="copyright">
              &copy; {new Date().getFullYear()} Richard Crane. All rights reserved.
            </div>
            <div className="footer-links">
              <ul>
                <li><Link to="/terms">Terms and Conditions</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/cookies">Cookie Support</Link></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
