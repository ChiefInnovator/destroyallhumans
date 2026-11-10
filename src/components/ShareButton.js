import React, { useEffect, useState } from 'react';
import Icon from './Icon';
import { shareDay } from '../utils/share';

const NOTICE_MS = 2500;
const NOTICES = { copied: 'Link copied', failed: 'Copy failed. Use the address bar.' };

/** Shares one day: the system share sheet where it exists, a copied link elsewhere. */
const ShareButton = ({ date, title, plan, report }) => {
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), NOTICE_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  const onClick = async () => {
    const result = await shareDay({ date, title, plan, report });
    setNotice(NOTICES[result] || '');
  };

  return (
    <button type="button" className="share-button" onClick={onClick}>
      <Icon name={notice === NOTICES.copied ? 'check' : 'share'} />
      <span aria-live="polite">{notice || 'Share this page'}</span>
    </button>
  );
};

export default ShareButton;
