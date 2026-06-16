import React from 'react';

export function parseBadgeLabel(label: React.ReactNode): React.ReactNode {
  if (typeof label !== 'string') return label;
  const match = label.match(/^(.+?)\s*\[([A-Z]+)\]$/);
  if (!match) return label;
  return <>{match[1]}<span className={`badge--${match[2].toLowerCase()}`}> {match[2]}</span></>;
}
