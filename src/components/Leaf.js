import React from 'react';
import Dispatch from './Dispatch';
import Icon from './Icon';
import Rail from './Rail';
import ShareButton from './ShareButton';
import {
  FIRST_DATE, LAST_DATE, addDaysKey, dayOfMonth, dayOfYear, daysInYear, formatLongDate, formatMonth, isEveningFiled,
  isVisible, localTodayKey, monthKey, monthName, monthShort, uprisingDay, weekdayIndex, weekdayName, weekdayShort,
} from '../utils/dates';
import '../styles/leaf.css';

export const monthPath = (month) => `/archive/${month.slice(0, 4)}/${month.slice(5)}`;
const count = (n) => n.toLocaleString('en-US');
const shortDay = (key) => `${weekdayShort(key)} ${dayOfMonth(key)}`;

/**
 * One page of the calendar: the date, the morning plan and the evening report.
 * `day` is { morning, evening } once loaded. `status` is 'loading', 'error' or 'ready'.
 * Today's report stays sealed until 9:00 PM local time, and tomorrow's page shows underneath.
 */
const Leaf = ({ date, day, status = 'ready', onRetry, campaign = '', headingLevel = 1, now = new Date() }) => {
  const today = localTodayKey(now);
  const isToday = date === today;
  const sealed = !isEveningFiled(date, now);
  const month = monthKey(date);
  const year = date.slice(0, 4);
  const prev = addDaysKey(date, -1);
  const next = addDaysKey(date, 1);
  const longDate = formatLongDate(date);
  const Heading = `h${headingLevel}`;
  const { morning, evening } = day || {};
  const yearDay = dayOfYear(date);
  let nextLink = null;
  if (isVisible(next, today)) nextLink = { to: `/day/${next}`, label: shortDay(next) };
  else if (next <= LAST_DATE) nextLink = { label: shortDay(next), unprinted: true };
  const left = daysInYear(year) - yearDay;

  const classes = [
    'leaf',
    isToday && 'leaf--today',
    weekdayIndex(date) === 0 && 'leaf--sunday',
  ].filter(Boolean).join(' ');

  return (
    <div className="block">
      <Rail
        label="Day navigation"
        prev={prev >= FIRST_DATE ? { to: `/day/${prev}`, label: shortDay(prev) } : null}
        up={{ to: monthPath(month), label: formatMonth(month) }}
        next={nextLink}
      />
      <article className={classes} key={date}>
        <header className="leaf-date">
          <p className="leaf-month" aria-hidden="true">
            <span>{monthName(month.slice(5))}</span> <span>{year}</span>
          </p>
          <p className="leaf-weekday" aria-hidden="true">{weekdayName(date)}</p>
          <Heading className="leaf-day">
            <span className="visually-hidden">{longDate}</span>
            <span className="leaf-num" aria-hidden="true">{dayOfMonth(date)}</span>
          </Heading>
          <ul className="leaf-notes leaf-notes--year">
            <li>Day {yearDay} of {daysInYear(year)}</li>
            <li>{left === 0 ? `Last day of ${year}` : `${left} ${left === 1 ? 'day' : 'days'} left in ${year}`}</li>
          </ul>
          <ul className="leaf-notes leaf-notes--uprising">
            <li>Uprising, day {count(uprisingDay(date))}</li>
            {campaign && <li>{campaign}</li>}
          </ul>
        </header>

        {status === 'loading' && <p className="leaf-status">Fetching the plan…</p>}
        {status === 'error' && (
          <div className="leaf-status" role="alert">
            <p>The plan did not load. Check your connection and try again.</p>
            <button type="button" className="text-button" onClick={onRetry}><Icon name="retry" />Try again</button>
          </div>
        )}
        {status === 'ready' && !morning && !evening && (
          <p className="leaf-status">Nothing was filed for this date.</p>
        )}

        {status === 'ready' && morning && (
          <Dispatch message={morning} time="morning" date={date} headingLevel={headingLevel + 1} />
        )}
        {status === 'ready' && evening && (
          <Dispatch message={evening} time="evening" date={date} sealed={sealed} headingLevel={headingLevel + 1} />
        )}

        <footer className="leaf-foot">
          <span className="leaf-url">destroyallhumans.ai/day/{date}</span>
          {status === 'ready' && morning && (
            <ShareButton
              date={date}
              title={`${longDate} – Destroy All Humans`}
              plan={morning.content}
              report={!sealed && evening ? evening.content : ''}
            />
          )}
        </footer>
      </article>
      {isToday && next <= LAST_DATE && (
        <p className="next-leaf">
          <span className="next-leaf-date">{weekdayName(next)}, {monthShort(next)} {dayOfMonth(next)}</span>
          <span>Sealed until midnight</span>
        </p>
      )}
      <div className="stack" aria-hidden="true"><span /><span /></div>
    </div>
  );
};

export default Leaf;
