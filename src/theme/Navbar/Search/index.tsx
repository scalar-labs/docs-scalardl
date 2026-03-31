import React, {type ReactNode} from 'react';
import Search from '@theme-original/Navbar/Search';
import type SearchType from '@theme/Navbar/Search';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';
import GoogleAIModeSearch from '../../../components/GoogleAIModeSearch';

type Props = WrapperProps<typeof SearchType>;

export default function SearchWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  const match = pathname.match(/^(\/[a-z]{2}-[a-z]{2})?\/docs\/(latest|\d+\.\d+)\b/);
  const locale = match?.[1] ?? '';
  const version = match?.[2] ?? 'latest';

  // Determine button label based on locale
  const tryNowLabel = locale === '/ja-jp' ? '今すぐ試す' : 'Try now';

  return (
    <>
      <Search {...props} />
      <GoogleAIModeSearch />
      <div>
        <a href={`${locale}/docs/${version}/scalar-licensing/trial`} className="navbar__link--cta">{tryNowLabel}</a>
      </div>
    </>
  );
}
