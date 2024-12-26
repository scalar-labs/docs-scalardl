import React from 'react';
import MDXContent from '@theme-original/MDXContent';
import type MDXContentType from '@theme/MDXContent';
import type {WrapperProps} from '@docusaurus/types';
import GlossaryInjector from '../../../src/components/GlossaryInjector';

type Props = WrapperProps<typeof MDXContentType>;

export default function MDXContentWrapper(props: Props, { children }): JSX.Element {
  return (
    <>
      <MDXContent {...props} />
      <GlossaryInjector>
        {children}
      </GlossaryInjector>
    </>
  );
}
