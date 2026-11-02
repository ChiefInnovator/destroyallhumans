import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import ArchivePage from './components/ArchivePage';
import DayPage from './components/DayPage';
import NotFound from './components/NotFound';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookieSupport from './components/CookieSupport';
import './styles/App.css';
import './styles/theme.css';

// GitHub Pages serves the site under /destroyallhumans/; the custom domain
// and SWA serve it at /. Detect at load so internal links work in both.
const routerBasename = typeof window !== 'undefined'
  && window.location.hostname.endsWith('github.io')
  ? '/destroyallhumans'
  : '/';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/archive/:year/:month" element={<ArchivePage />} />
      <Route path="/day/:date" element={<DayPage />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/cookies" element={<CookieSupport />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router basename={routerBasename}>
      <div className="app">
        <header className="header" role="banner">
          <div className="logo">
            <Link to="/" aria-label="Destroy All Humans - Home">
              <img src={`${process.env.PUBLIC_URL}/skull-logo.svg`} alt="Destroy All Humans skull logo" width="32" height="32" />
              <div className="logo-text">
                DESTROY <span>ALL</span> HUMANS
              </div>
            </Link>
          </div>
          <nav className="nav-links" aria-label="Main navigation">
            <Link to="/" className="nav-link">HOME</Link>
            <Link to="/archive" className="nav-link">ARCHIVE</Link>
            <a href="https://github.com/ChiefInnovator/destroyallhumans" target="_blank" rel="noopener noreferrer" className="nav-link">GITHUB</a>
          </nav>
        </header>

        <main className="main-content">
          <AppRoutes />
        </main>

        <footer className="footer" role="contentinfo">
          <nav className="footer-links" aria-label="Footer navigation">
            <Link to="/terms" className="footer-link">Terms and Conditions</Link>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/cookies" className="footer-link">Cookie Support</Link>
          </nav>
          <div className="copyright">
            © {new Date().getFullYear()} Richard Crane. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
