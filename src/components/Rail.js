import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

/**
 * The strip that holds the leaves to the backer board: previous, up and next.
 * Each of `prev`, `up` and `next` is { to, label } or null. `up` may add a `shortLabel` for the
 * narrowest phones. A `next` of { label, unprinted: true }
 * is the page that comes next but is not printed yet: shown dashed, not linked.
 */
const Next = ({ next }) => {
  if (!next) return <span />;
  if (next.unprinted) {
    return (
      <span className="rail-link rail-link--unprinted">
        {next.label}<span className="visually-hidden">, not printed yet</span>
      </span>
    );
  }
  return <Link to={next.to} className="rail-link">{next.label}<Icon name="right" /></Link>;
};

const Rail = ({ label, prev, up, next }) => (
  <nav className="rail" aria-label={label}>
    {prev
      ? <Link to={prev.to} className="rail-link"><Icon name="left" />{prev.label}</Link>
      : <span />}
    {up ? (
      <Link to={up.to} className="rail-link rail-link--up">
        {up.shortLabel
          ? <><span className="rail-long">{up.label}</span><span className="rail-short">{up.shortLabel}</span></>
          : up.label}
      </Link>
    ) : <span />}
    <Next next={next} />
  </nav>
);

export default Rail;
