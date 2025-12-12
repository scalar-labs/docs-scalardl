import React, { useState, useCallback } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GoogleSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();

  // Extract version from the current URL path
  const getCurrentVersion = useCallback(() => {
    const path = location.pathname;

    // Check if on a versioned URL path
    if (path.includes('/docs/latest/')) {
      return 'latest';
    }

    // Check for versioned docs (for example, /docs/3.15/, /docs/3.14/, etc.)
    const versionMatch = path.match(/(?:\/ja-jp)?\/docs\/(\d+\.\d+)\//);
    if (versionMatch) {
      return versionMatch[1];
    }

    // Default to latest if unable to determine the version
    return 'latest';
  }, [location.pathname]);

  // Extract language from the current URL path
  const getCurrentLanguage = useCallback(() => {
    const path = location.pathname;

    // Check if we're on Japanese docs
    if (path.includes('/ja-jp/')) {
      return 'ja-jp';
    }

    // Default to English
    return 'en-us';
  }, [location.pathname]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const currentVersion = getCurrentVersion();
    const currentLanguage = getCurrentLanguage();

    // Use different site URLs based on language
    const hostname = new URL(siteConfig.url).hostname;
    const siteUrl = currentLanguage === 'ja-jp'
      ? `site%3A${hostname}/ja-jp/docs`
      : `site%3A${hostname}/docs`;

    const versionPath = currentVersion === 'latest' ? 'latest' : currentVersion;
    const googleSearchUrl = `https://www.google.com/search?q=${siteUrl}/${versionPath}+${encodeURIComponent(searchQuery.trim())}`;

    window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
  }, [searchQuery, getCurrentVersion, getCurrentLanguage, siteConfig.url]);

  const handleInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  }, [handleSearch]);

  // Get localized placeholder text
  const getPlaceholderText = useCallback(() => {
    const currentLanguage = getCurrentLanguage();
    return currentLanguage === 'ja-jp' ? 'Google' : 'Google';
  }, [getCurrentLanguage]);

  return (
    <div className="googleSearchContainer">
      <form onSubmit={handleSearch} className="googleSearchForm">
        <div className="googleSearchInputWrapper">
          <button
            type="submit"
            className="googleSearchButton"
            aria-label="Search"
            disabled={!searchQuery.trim()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="googleSearchIcon"
            >
              <path
                d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
                fill="currentColor"
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder={getPlaceholderText()}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="googleSearchInput"
            aria-label="Search documentation with Google"
          />
        </div>
      </form>
    </div>
  );
}
