import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

/**
 * The strip that holds the leaves to the backer board: previous, up and next.
 * Each of `prev`, `up` and `next` is { to, label } or null.
 */
const Rail = ({ label, prev, up, next }) => (
  <nav className="rail" aria-label={label}>
    {prev
      ? <Link to={prev.to} className="rail-link"><Icon name="left" />{prev.label}</Link>
      : <span />}
    {up ? <Link to={up.to} className="rail-link rail-link--up">{up.label}</Link> : <span />}
    {next
      ? <Link to={next.to} className="rail-link">{next.label}<Icon name="right" /></Link>
      : <span />}
  </nav>
);

export default Rail;
