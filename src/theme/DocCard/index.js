/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Swizzled (wrapped) to strip [BADGE] markers (e.g. [NEW]) from card titles
// in generated-index pages. The markers are used in sidebars.js labels and
// rendered as badges in the sidebar, but should not appear as plain text in
// doc cards.

import React from 'react';
import DocCard from '@theme-original/DocCard';

const BADGE_PATTERN = /\s*\[[A-Z]+\]$/;

function stripBadgeMarker(label) {
  if (typeof label === 'string') {
    return label.replace(BADGE_PATTERN, '');
  }
  return label;
}

export default function DocCardWrapper({item, ...props}) {
  const patchedItem = item
    ? { ...item, label: stripBadgeMarker(item.label) }
    : item;
  return <DocCard item={patchedItem} {...props} />;
}
