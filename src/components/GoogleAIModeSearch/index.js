import React, { useState, useCallback } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GoogleAIModeSearch() {

  // Place hooks at the top
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get pre-written queries from Docusaurus config
  const prewrittenQueries = siteConfig?.customFields?.prewrittenQueries || [];

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

  // Handler for clicking a pre-written query box
  const handlePrewrittenQueryClick = useCallback((query) => {
    // Track prewritten query clicks in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: query,
        source: 'google_ai_mode_predefined'
      });
    }
    const currentVersion = getCurrentVersion();
    const currentLanguage = getCurrentLanguage();
    const hostname = new URL(siteConfig.url).hostname;
    const siteUrl = currentLanguage === 'ja-jp'
      ? `site%3A${hostname}/ja-jp/docs`
      : `site%3A${hostname}/docs`;
    const versionPath = currentVersion === 'latest' ? 'latest' : currentVersion;
    const encodedQuery = encodeURIComponent(query.trim());
    const googleAiModeUrl = `https://www.google.com/search?q=${siteUrl}/${versionPath}+${encodedQuery}&udm=50`;
    window.open(googleAiModeUrl, '_blank', 'noopener,noreferrer');
  }, [getCurrentVersion, getCurrentLanguage, siteConfig.url]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    // Don't reset search query - keep existing text
    // Resize textarea to fit existing content when opening
    setTimeout(() => {
      const textarea = document.querySelector('.googleAiModeModalInput');
      if (textarea) {
        textarea.style.height = 'auto';
        // Force reflow to ensure content is rendered
        textarea.offsetHeight;
        const newHeight = Math.min(textarea.scrollHeight, 160); // Max height of 10rem (160px)
        textarea.style.height = newHeight + 'px';

        // Show scrollbar when content exceeds max height
        if (textarea.scrollHeight > 160) {
          textarea.style.overflowY = 'auto';
        } else {
          textarea.style.overflowY = 'hidden';
        }
      }
    }, 50); // Increased timeout for better rendering
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Clear text only on explicit close (X button or Escape)
    setSearchQuery('');
  }, []);

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

    // Create Google AI Mode URL
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    const googleAiModeUrl = `https://www.google.com/search?q=${siteUrl}/${versionPath}+${encodedQuery}&udm=50`;

    // Log search query for analytics (optional)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: searchQuery.trim(),
        source: 'google_ai_mode'
      });
    }

    // Open Google AI Mode (keep modal open)
    window.open(googleAiModeUrl, '_blank', 'noopener,noreferrer');
  }, [searchQuery, getCurrentVersion, getCurrentLanguage, siteConfig.url]);

  const handleInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = '60px';
    const newHeight = Math.min(textarea.scrollHeight, 160); // Max height of 10rem (160px)
    textarea.style.height = newHeight + 'px';

    // Show scrollbar when content exceeds max height
    if (textarea.scrollHeight > 160) {
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    } else if (e.key === 'Escape') {
      closeModal();
    }
  }, [handleSearch, closeModal]);

  const handleModalClick = useCallback((e) => {
    // Close modal if clicking outside the modal content (but preserve text)
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  }, []);

  // Get localized placeholder text
  const getPlaceholderText = useCallback(() => {
    const currentLanguage = getCurrentLanguage();
    return currentLanguage === 'ja-jp'
      ? 'ScalarDL について聞いてみる...'
      : 'Ask a question about ScalarDL...';
  }, [getCurrentLanguage]);

  return (
    <>
      {/* Google AI Mode Search Icon */}
      <div className="googleAiModeContainer">
        <button
          onClick={openModal}
          className="googleAiModeButton"
          aria-label="Search with Google AI Mode"
          title="Search with Google AI Mode"
        >
          <svg 
            className="googleAiModeIcon"
            height="24"
            width="24"
            aria-hidden="true"
            viewBox="0 0 471 471"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fill="currentColor" 
              d="M235.5 471C235.5 438.423 229.22 407.807 216.66 379.155C204.492 350.503 187.811 325.579 166.616 304.384C145.421 283.189 120.498 266.508 91.845 254.34C63.1925 241.78 32.5775 235.5 0 235.5C32.5775 235.5 63.1925 229.416 91.845 217.249C120.498 204.689 145.421 187.811 166.616 166.616C187.811 145.421 204.492 120.497 216.66 91.845C229.22 63.1925 235.5 32.5775 235.5 0C235.5 32.5775 241.584 63.1925 253.751 91.845C266.311 120.497 283.189 145.421 304.384 166.616C325.579 187.811 350.503 204.689 379.155 217.249C407.807 229.416 438.423 235.5 471 235.5C438.423 235.5 407.807 241.78 379.155 254.340C350.503 266.508 325.579 283.189 304.384 304.384C283.189 325.579 266.311 350.503 253.751 379.155C241.584 407.807 235.5 438.423 235.5 471Z"
            />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="googleAiModeModal" onClick={handleModalClick}>
          <div className="googleAiModeModalContent">
            <div className="googleAiModeModalHeader">
              <div className="googleAiModeModalTitleWrapper">
                <img 
                  src="/img/favicon.ico"
                  alt="Scalar logo"
                  className="googleAiModeModalIcon"
                  width="30"
                  height="30"
                />
                <h3 className="googleAiModeModalTitle">Ask AI</h3>
              </div>
              <button
                onClick={closeModal}
                className="googleAiModeModalClose"
                aria-label="Close search modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            {/* Legal Notice above prewritten queries */}
            <div className="googleAiModeLegalNotice">
              This AI bot experience is experimental. Responses are generated by AI and may not be fully accurate, so always consult the official ScalarDL documentation. Please do not share confidential information (like API keys or passwords).
            </div>
            {/* Pre-written Query Grid inside modal */}
            <div className="googleAiModePrewrittenGrid">
              {prewrittenQueries.map((query, idx) => (
                <button
                  key={idx}
                  className="googleAiModePrewrittenBox"
                  onClick={() => handlePrewrittenQueryClick(query)}
                  aria-label={`Search: ${query}`}
                >
                  {query}
                </button>
              ))}
            </div>
            <form onSubmit={handleSearch} className="googleAiModeModalForm">
              <div className="googleAiModeModalInputWrapper">
                <textarea
                  placeholder={getPlaceholderText()}
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="googleAiModeModalInput"
                  aria-label="Search documentation with Google AI"
                  autoFocus
                  rows={1}
                  style={{ resize: 'none' }}
                />
                <button
                  type="submit"
                  className="googleAiModeModalSubmitIcon"
                  disabled={!searchQuery.trim()}
                  aria-label="Submit search query"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M12 19V5M5 12L12 5L19 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="googleAiModeModalPoweredBy">
                Powered by <a 
                  href="https://www.google.com/search?udm=50"
                  target="_blank"
                  className="googleAiModeLink"
                >
                  Google AI Mode
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
