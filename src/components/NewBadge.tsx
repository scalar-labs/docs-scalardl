import React from 'react';

/**
 * Inline NEW badge for use next to section headings in MDX content.
 *
 * Usage:
 *   ## My New Section <NewBadge />
 */
export default function NewBadge(): JSX.Element {
  return <span className="badge--new">NEW</span>;
}
