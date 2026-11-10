import { useEffect, useState } from 'react';
import { formatCountdown, msUntilEvening } from './dates';

const TICK_MS = 20000;

/** Text for the time left until tonight's 9:00 PM report, refreshed while mounted; null once it has passed. */
export const useEveningCountdown = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const ms = msUntilEvening(now);
  return ms === null ? null : formatCountdown(ms);
};
