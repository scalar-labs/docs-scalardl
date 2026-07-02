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
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';
import type {Props} from '@theme/DocVersionBadge';
import TagsListInline from '@theme/TagsListInline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far, faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fab, fas, far, faCircleQuestion);

type DocVersionBadgeProps = Props & {
  tags?: readonly {label: string; permalink: string}[];
};

export default function DocVersionBadge({
  className,
  tags = [],
}: DocVersionBadgeProps): JSX.Element | null {
  const versionMetadata = useDocsVersion();

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
        {normalizedTags.length > 0 && (
          <div
            className={clsx(
              'row margin-top--sm',
              ThemeClassNames.docs.docFooterTagsRow,
            )}>
            <div className="col">
              <TagsListInline tags={normalizedTags} />
              <a href="https://scalar-labs.com/pricing/" target="_blank" className="fa-solid fa-circle-question tooltip">
                <FontAwesomeIcon icon={faCircleQuestion} size="lg" />
                <span className="tooltiptext">Features and pricing</span>
              </a>
            </div>
          </div>
        )}
      </span>
    );
  }
  return null;
}
