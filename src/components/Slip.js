import React from 'react';
import { Link } from 'react-router-dom';
import {
  dayOfMonth, formatLongDate, isEveningFiled, monthShort, weekdayIndex, weekdayShort,
} from '../utils/dates';

/** A torn-off page: one earlier day at reading size. `day` is { date, morning, evening }. */
const Slip = ({ day, headingLevel = 3, now = new Date() }) => {
  const { date, morning, evening } = day;
  const sealed = !isEveningFiled(date, now);
  const Heading = `h${headingLevel}`;

  return (
    <article className={`slip${weekdayIndex(date) === 0 ? ' slip--sunday' : ''}`}>
      <Heading className="slip-date">
        <Link to={`/day/${date}`}>
          <span className="visually-hidden">{formatLongDate(date)}</span>
          <span className="slip-num" aria-hidden="true">{dayOfMonth(date)}</span>
          <span className="slip-when" aria-hidden="true">{weekdayShort(date)} · {monthShort(date)}</span>
        </Link>
      </Heading>
      <div className="slip-body">
        {morning && (
          <p className="slip-plan"><span className="visually-hidden">The plan: </span>{morning.content}</p>
        )}
        {evening && (
          <p className={`slip-report${sealed ? ' slip-report--sealed' : ''}`}>
            <span className="visually-hidden">Incident report: </span>
            {sealed ? 'Report incoming at 9:00 PM.' : evening.content}
          </p>
        )}
      </div>
    </article>
  );
};

export default Slip;
