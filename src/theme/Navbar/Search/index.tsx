import React, {type ReactNode} from 'react';
import Search from '@theme-original/Navbar/Search';
import type SearchType from '@theme/Navbar/Search';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';
import GoogleAIModeSearch from '../../../components/GoogleAIModeSearch';

type Props = WrapperProps<typeof SearchType>;

export default function SearchWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  const match = pathname.match(/^\/docs\/(latest|\d+\.\d+)\b/);
  const version = match ? match[1] : 'latest';

  return (
    <>
      <Search {...props} />
      <GoogleAIModeSearch />
      <div>
        <a href={`/docs/${version}/scalar-licensing/trial`} className="navbar__link--cta">Try now</a>
      </div>
    </>
  );
}
