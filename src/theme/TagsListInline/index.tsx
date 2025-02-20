import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Tag from '@theme/Tag';
import type {Props} from '@theme/TagsListInline';

import styles from './styles.module.css';

export default function TagsListInline({tags}: Props): JSX.Element {
  return (
    <>
      {/* <b>
        <Translate
          id="theme.tags.tagsListLabel"
          description="The label alongside a list of editions">
          Editions:
        </Translate>
      </b> */}
      <ul className={clsx(styles.tags, 'padding--none', 'margin-left--sm')}>
        {tags.map(({label, permalink: tagPermalink}) => (
          <li className={styles.tag}>
            <Tag label={label} />
          </li>
        ))}
      </ul>
    </>
  );
}
