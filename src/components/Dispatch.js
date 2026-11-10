import React, { useEffect, useRef, useState } from 'react';
import sealRed from '../assets/images/seal-red.webp';
import sealYellow from '../assets/images/seal-yellow.webp';
import { formatShortDate } from '../utils/dates';
import { useEveningCountdown } from '../utils/useCountdown';

// The robot is chosen by time of day: yellow plans in the morning, red reports in the evening.
export const PERSONAS = {
  morning: { seal: sealYellow, title: 'The Plan', byline: 'Planning Unit', time: '09:00' },
  evening: { seal: sealRed, title: 'Incident Report', byline: 'Damage Control', time: '21:00' },
};

export const SEALED_TEXT = 'Report incoming at 9:00 PM. Damage Control is still counting the damage.';

const Countdown = () => {
  const left = useEveningCountdown();
  return left ? <p className="dispatch-due">Due in {left}.</p> : null;
};

/**
 * One dispatch on a leaf. With `sealed`, the evening report is shown as not yet filed; when the
 * seal lifts while the leaf is on screen, the verdict stamp lands.
 */
const Dispatch = ({ message, time, date, sealed = false, headingLevel = 2 }) => {
  const persona = PERSONAS[time];
  const Heading = `h${headingLevel}`;
  const wasSealed = useRef(sealed);
  const [justFiled, setJustFiled] = useState(false);

  useEffect(() => {
    if (wasSealed.current && !sealed) setJustFiled(true);
    wasSealed.current = sealed;
  }, [sealed]);

  const classes = [
    'dispatch',
    `dispatch--${time}`,
    sealed && 'dispatch--sealed',
    justFiled && 'dispatch--just-filed',
  ].filter(Boolean).join(' ');

  return (
    <section className={classes} aria-label={`${persona.title} for ${formatShortDate(date)}`}>
      <header className="dispatch-band">
        <img src={persona.seal} alt="" className="dispatch-seal" width="56" height="56" />
        <div className="dispatch-id">
          <Heading className="dispatch-title">{persona.title}</Heading>
          <p className="dispatch-by">{persona.byline}</p>
        </div>
        <time className="dispatch-time" dateTime={`${date}T${persona.time}`}>{persona.time}</time>
      </header>
      {sealed ? (
        <div className="dispatch-body">
          <p className="dispatch-text">{SEALED_TEXT}</p>
          <Countdown />
        </div>
      ) : (
        <div className="dispatch-body">
          <p className="dispatch-text">{message.content}</p>
          {time === 'evening' && (
            <p className="stamp" aria-hidden="true"><span>Humans</span><span>still here</span></p>
          )}
        </div>
      )}
    </section>
  );
};

export default Dispatch;
