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

  const versionMetadata = useDocsVersion();
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
            <TagsListInline tags={tags} />
            <a href="https://scalar-labs.com/pricing/" target="_blank" className="fa-solid fa-circle-question tooltip"><FontAwesomeIcon icon={faCircleQuestion} size="lg" /><span className="tooltiptext">Features and pricing</span></a>
          </div>
        </div>
      </span>
    );
  }
  return null;
}
