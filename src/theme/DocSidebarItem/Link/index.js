import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';

const BADGE_PATTERN = /^(.*?)\s*\[([A-Z]+)\]$/;

function LinkLabel({label}) {
  const match = typeof label === 'string' ? label.match(BADGE_PATTERN) : null;
  if (match) {
    return (
      <span title={match[1]} className="linkLabel">
        {match[1]}
        <span className="badge--new">{match[2]}</span>
      </span>
    );
  }
  return (
    <span title={label} className="linkLabel">
      {label}
    </span>
  );
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {
  const {href, label, className, autoAddBaseUrl} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx(
          'menu__link',
          !isInternalLink && 'menuExternalLink',
          {
            'menu__link--active': isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        <LinkLabel label={label} />
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
