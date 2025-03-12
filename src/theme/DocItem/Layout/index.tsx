import SupportDropdownMenu from '../../../components/Support/SupportDropdownMenu';
import React from 'react';
import clsx from 'clsx';
import { useWindowSize } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';

import styles from './styles.module.css';

// Define the type for the useDocTOC return value.
interface DocTOC {
  hidden: boolean;
  mobile?: JSX.Element;
  desktop?: JSX.Element;
}

// Type for the DocItemLayout props
interface DocItemLayoutProps {
  children: React.ReactNode;
}

// Hook to handle the Table of Contents visibility and rendering
function useDocTOC(): DocTOC {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  return {
    hidden,
    mobile: canRender ? <DocItemTOCMobile /> : undefined,
    desktop: canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? <DocItemTOCDesktop /> : undefined,
  };
}

// DocItemLayout component
const DocItemLayout: React.FC<DocItemLayoutProps> = ({ children }) => {
  const docTOC = useDocTOC();
  const { metadata, frontMatter } = useDoc();
  const hideTOC = frontMatter.hide_table_of_contents;
  const windowSize = useWindowSize();

  return (
    <div className="row">
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {windowSize === 'mobile' && (
              <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '1rem' }}>
                <SupportDropdownMenu />
              </div>
            )}
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>

      {!hideTOC && windowSize !== 'mobile' && (
        <div className="col col--3" style={{ position: "relative" }}>
          <div style={{ position: "sticky", top: "80px", zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '0px 17px', right: '0' }}>
              <SupportDropdownMenu />
            </div>
            {docTOC.desktop}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocItemLayout;
