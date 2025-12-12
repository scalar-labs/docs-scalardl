import React, {type ReactNode} from 'react';
import Search from '@theme-original/Navbar/Search';
import type SearchType from '@theme/Navbar/Search';
import type {WrapperProps} from '@docusaurus/types';
import GoogleSearch from '../../../components/GoogleSearch';

type Props = WrapperProps<typeof SearchType>;

export default function SearchWrapper(props: Props): ReactNode {
  return (
    <>
      <Search {...props} />
      <GoogleSearch />
    </>
  );
}
