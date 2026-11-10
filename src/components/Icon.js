import React from 'react';

// One drawn set: 24px grid, 2.25px strokes, square caps to match the printed rules.
const PATHS = {
  left: 'M19 12H5m6-6-6 6 6 6',
  right: 'M5 12h14m-6-6 6 6-6 6',
  share: 'M12 15V3m-4.5 4.5L12 3l4.5 4.5M5 12v8h14v-8',
  check: 'M4.5 12.5l5 5L19.5 7',
  retry: 'M19 6v5h-5m4.6-.5A7 7 0 1 0 19 13',
};

const Icon = ({ name }) => (
  <svg className="icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
    <path d={PATHS[name]} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
);

export default Icon;
