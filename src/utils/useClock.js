import { useEffect, useState } from 'react';
import { msUntilEvening, msUntilMidnight } from './dates';

/**
 * The current time, re-read at 9:00 PM local (to unseal tonight's report) and at local midnight
 * (to roll over to the new day), so open pages update without a reload.
 */
export const useClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const evening = msUntilEvening(now);
    const wait = evening === null ? msUntilMidnight(now) : evening;
    const timer = setTimeout(() => setNow(new Date()), wait + 1000);
    return () => clearTimeout(timer);
  }, [now]);

  return now;
};
