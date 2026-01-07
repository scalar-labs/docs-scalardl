/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDocsVersion, useDoc} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import type {Props} from '@theme/DocVersionBadge';
import TagsListInline from '@theme/TagsListInline';
// Import the original mapper
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component.
import { library } from '@fortawesome/fontawesome-svg-core'; // Import the library component.
import { fab } from '@fortawesome/free-brands-svg-icons'; // Import all brands icons.
import { far, faCircleQuestion } from '@fortawesome/free-regular-svg-icons'; // Import all solid icons.
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import all solid icons.

library.add(fab, fas, far, faCircleQuestion); // Add all icons to the library so you can use them without importing them individually.

export default function DocVersionBadge({
  className,
}: Props): JSX.Element | null {

  const {metadata} = useDoc();
  const {tags} = metadata;
  const location = useLocation();

  const versionMetadata = useDocsVersion();

  // Detect current language and version, then construct the proper features URL.
  const isJapanese = location.pathname.startsWith('/ja-jp/');
  const versionMatch = location.pathname.match(/docs\/([^/]+)/);
  const currentVersion = versionMatch ? versionMatch[1] : 'latest';

  const featuresUrl = isJapanese
    ? `/ja-jp/docs/${currentVersion}/features`
    : `/docs/${currentVersion}/features`;

  // Normalize and deduplicate Enterprise tags.
  const normalizedTags = Array.from(
    new Map(
      tags.map(tag => [
        tag.label === 'Enterprise Standard' || tag.label === 'Enterprise Premium'
          ? 'Enterprise'
          : tag.label, // Use "Enterprise" as the key for both variants.
        {
          ...tag,
          label: 'Enterprise Standard' === tag.label || 'Enterprise Premium' === tag.label
            ? 'Enterprise'
            : tag.label,
        },
      ])
    ).values()
  );

  if (versionMetadata.badge) {
    return (
      <span
        className={clsx(
          className,
          ThemeClassNames.docs.docVersionBadge,
          'badge badge--secondary',
        )}>
        <Translate
          id="theme.docs.versionBadge.label"
          values={{versionLabel: versionMetadata.label}}>
          {'Version: {versionLabel}'}
        </Translate>
        <div
          className={clsx(
            'row margin-top--sm',
            ThemeClassNames.docs.docFooterTagsRow,
          )}>
          <div className="col">
            <TagsListInline tags={normalizedTags} />
            <a href={featuresUrl} className="fa-solid fa-circle-question tooltip"><FontAwesomeIcon icon={faCircleQuestion} size="lg" /><span className="tooltiptext">Features</span></a>
          </div>
        </div>
      </span>
    );
  }
  return null;
}
