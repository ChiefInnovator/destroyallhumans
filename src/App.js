import React, { useEffect } from 'react';
import {
  BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, useNavigationType,
} from 'react-router-dom';
import HomePage from './components/HomePage';
import ArchivePage from './components/ArchivePage';
import DayPage from './components/DayPage';
import NotFound from './components/NotFound';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookieSupport from './components/CookieSupport';
import badgeRed from './assets/images/badge-red.webp';
import badgeYellow from './assets/images/badge-yellow.webp';
import { EVENING_HOUR, LAST_DATE, localTodayKey, uprisingDay } from './utils/dates';
import { useClock } from './utils/useClock';
import './styles/theme.css';

// GitHub Pages serves the site under /destroyallhumans/; the custom domain
// and SWA serve it at /. Detect at load so internal links work in both.
const routerBasename = typeof window !== 'undefined'
  && window.location.hostname.endsWith('github.io')
  ? '/destroyallhumans'
  : '/';

// The wall colour for each shift, repeated here so the browser chrome matches (see theme.css).
const WALL = { day: '#b1ca77', night: '#14251b' };

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

/**
 * The calendar hanging on the wall: the backer board with the robot on shift, then the page.
 * The yellow robot holds the board until 9:00 PM local time; the red robot takes the night shift.
 */
export function Calendar({ children }) {
  const now = useClock();
  const today = localTodayKey(now);
  const shift = now.getHours() >= EVENING_HOUR ? 'night' : 'day';
  const day = uprisingDay(today < LAST_DATE ? today : LAST_DATE);

  const { pathname } = useLocation();
  const navigation = useNavigationType();

  useEffect(() => {
    document.documentElement.dataset.shift = shift;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', WALL[shift]);
  }, [shift]);

  // A new page starts at its top; Back and Forward keep the browser's restored position.
  useEffect(() => {
    if (navigation !== 'POP') window.scrollTo(0, 0);
  }, [pathname, navigation]);

  return (
    <div className="app">
      <a className="skip-link" href="#page">Skip to the page</a>
      {/* Rubber-stamp ink: roughens the edges of the verdict stamp (see leaf.css). */}
      <svg className="visually-hidden" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="stamp-ink">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.2" />
        </filter>
      </svg>
      <div className="calendar">
        <header className="backer">
          <span className="backer-hole" aria-hidden="true" />
          <Link to="/" className="backer-badge" aria-label="Destroy All Humans: today's page">
            <img src={shift === 'night' ? badgeRed : badgeYellow} alt="" width="640" height="806" />
          </Link>
          <div className="backer-print">
            <p className="tally">
              <span className="tally-day">Day {day.toLocaleString('en-US')}</span>
              <span className="tally-rest">of the uprising. Humans destroyed: 0.</span>
            </p>
            <nav className="backer-nav" aria-label="Main navigation">
              <NavLink to="/" end className="backer-link">Today</NavLink>
              <NavLink to="/archive" className="backer-link">Every page</NavLink>
            </nav>
          </div>
        </header>
        <main id="page" className="page" tabIndex="-1">
          {children}
        </main>
      </div>

      <footer className="footer">
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/terms" className="wall-link">Terms and Conditions</Link>
          <Link to="/privacy" className="wall-link">Privacy Policy</Link>
          <Link to="/cookies" className="wall-link">Cookie Support</Link>
          <a href="https://github.com/ChiefInnovator/destroyallhumans" target="_blank" rel="noopener noreferrer" className="wall-link">GitHub</a>
        </nav>
        <p className="copyright">© {now.getFullYear()} Richard Crane. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router basename={routerBasename}>
      <Calendar>
        <AppRoutes />
      </Calendar>
    </Router>
  );
}

export default App;
