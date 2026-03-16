
import React, { useState, useCallback, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Magic number constants
const MAX_TEXTAREA_HEIGHT_PX = 160;
const TEXTAREA_RESIZE_TIMEOUT_MS = 50;
const MODAL_CLOSE_TIMEOUT_MS = 200;
const TEXTAREA_INITIAL_HEIGHT_PX = 60;

export default function GoogleAIModeSearch() {
  const textareaRef = useRef(null);

  // Place hooks at the top
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Utility function for auto-resizing textarea
  const autoResizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      // Force reflow to ensure content is rendered
      textarea.offsetHeight;
      const newHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT_PX);
      textarea.style.height = newHeight + 'px';
      // Show scrollbar when content exceeds max height
      if (textarea.scrollHeight > MAX_TEXTAREA_HEIGHT_PX) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  }, []);

  // Extract version from the current URL path
  const getCurrentVersion = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/docs/latest/')) {
      return 'latest';
    }
    const versionMatch = path.match(/(?:\/ja-jp)?\/docs\/(\d+\.\d+)\//);
    if (versionMatch) {
      return versionMatch[1];
    }
    return 'latest';
  }, [location.pathname]);
  const currentVersion = getCurrentVersion();

  // Extract language from the current URL path
  const getCurrentLanguage = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/ja-jp/')) {
      return 'ja-jp';
    }
    return 'en-us';
  }, [location.pathname]);

  const currentLanguage = getCurrentLanguage();
  const prewrittenQueries = currentLanguage === 'ja-jp'
    ? (siteConfig?.customFields?.prewrittenQueriesJa || [])
    : (siteConfig?.customFields?.prewrittenQueries || []);

  // Handler for clicking a pre-written query box
  const handlePrewrittenQueryClick = useCallback((query) => {
    // Track prewritten query clicks in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: query,
        source: 'google_ai_mode_predefined'
      });
    }
    const hostname = new URL(siteConfig.url).hostname;
    const siteUrl = currentLanguage === 'ja-jp'
      ? `site%3A${hostname}/ja-jp/docs`
      : `site%3A${hostname}/docs`;
    const versionPath = currentVersion === 'latest' ? 'latest' : currentVersion;
    const encodedQuery = encodeURIComponent(query.trim());
    const googleDomain = currentLanguage === 'ja-jp' ? 'https://www.google.co.jp' : 'https://www.google.com';
    const googleAiModeUrl = `${googleDomain}/search?q=${siteUrl}/${versionPath}+${encodedQuery}&udm=50`;
    window.open(googleAiModeUrl, '_blank', 'noopener,noreferrer');
  }, [currentVersion, currentLanguage, siteConfig.url]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    // Don't reset search query - keep existing text
    // Resize textarea to fit existing content when opening
    setTimeout(() => {
      autoResizeTextarea();
    }, TEXTAREA_RESIZE_TIMEOUT_MS);
  }, [autoResizeTextarea]);

  const closeModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      setSearchQuery('');
    }, MODAL_CLOSE_TIMEOUT_MS);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Use different site URLs based on language
    const hostname = new URL(siteConfig.url).hostname;
    const siteUrl = currentLanguage === 'ja-jp'
      ? `site%3A${hostname}/ja-jp/docs`
      : `site%3A${hostname}/docs`;

    const versionPath = currentVersion === 'latest' ? 'latest' : currentVersion;

    // Use .co.jp for Japanese, .com for others
    const googleDomain = currentLanguage === 'ja-jp' ? 'https://www.google.co.jp' : 'https://www.google.com';

    // Create Google AI Mode URL
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    const googleAiModeUrl = `${googleDomain}/search?q=${siteUrl}/${versionPath}+${encodedQuery}&udm=50`;

    // Log search query for analytics (optional)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: searchQuery.trim(),
        source: 'google_ai_mode'
      });
    }

    // Open Google AI Mode (keep modal open)
    window.open(googleAiModeUrl, '_blank', 'noopener,noreferrer');
  }, [searchQuery, currentVersion, currentLanguage, siteConfig.url]);

  const handleInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);

    // Auto-resize textarea using utility function
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${TEXTAREA_INITIAL_HEIGHT_PX}px`;
      autoResizeTextarea();
    }
  }, [autoResizeTextarea]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    } else if (e.key === 'Escape') {
      closeModal();
    }
  }, [handleSearch, closeModal]);

  const handleModalClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

  // Get localized placeholder text
  const getPlaceholderText = useCallback(() => {
    return currentLanguage === 'ja-jp'
      ? 'ScalarDL について聞いてみる...'
      : 'Ask a question about ScalarDL...';
  }, [currentLanguage]);

  // Localized modal text
  const modalTitle = currentLanguage === 'ja-jp' ? 'AI に質問する' : 'Ask AI';
  const legalNotice = currentLanguage === 'ja-jp'
    ? 'この AI ボットの体験は実験的なものです。AI によって生成された回答は必ずしも正確ではない場合があるため、必ず公式の ScalarDL ドキュメントもご参照ください。また、回答は最新バージョンのドキュメントに基づいています。機密情報 (API キーやパスワードなど) は絶対に入力しないでください。'
    : 'This AI bot experience is experimental. Responses are generated by AI and may not be fully accurate, so always consult the official ScalarDL documentation. In addition, responses are based on the latest version of the documentation. Please do not share confidential information (like API keys or passwords).';
  const googleDomain = currentLanguage === 'ja-jp' ? 'https://www.google.co.jp' : 'https://www.google.com';
  const poweredBy = currentLanguage === 'ja-jp'
    ? '提供元: '
    : 'Powered by ';

  // Only render the button and modal if on latest docs version
  if (currentVersion !== 'latest') {
    return null;
  }

  return (
    <>
      {/* Scalar blue Ask AI button with sparkle icon */}
      <button
        type="button"
        className="ask-ai-button"
        onClick={openModal}
        aria-label="Ask AI with Google"
      >
        {/* Sparkle SVG icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <g clip-path="url(#clip0_1177_865)">
            <path d="M3.00004 14.6666V11.3333M3.00004 4.66665V1.33331M1.33337 2.99998H4.66671M1.33337 13H4.66671M8.66671 1.99998L7.51059 5.00589C7.32258 5.49471 7.22858 5.73912 7.08239 5.9447C6.95283 6.12691 6.79364 6.28611 6.61143 6.41567C6.40584 6.56185 6.16143 6.65585 5.67261 6.84386L2.66671 7.99998L5.67262 9.1561C6.16144 9.34411 6.40585 9.43811 6.61143 9.58429C6.79364 9.71385 6.95283 9.87305 7.08239 10.0553C7.22858 10.2608 7.32258 10.5053 7.51059 10.9941L8.66671 14L9.82283 10.9941C10.0108 10.5053 10.1048 10.2608 10.251 10.0553C10.3806 9.87305 10.5398 9.71385 10.722 9.58429C10.9276 9.43811 11.172 9.34411 11.6608 9.1561L14.6667 7.99998L11.6608 6.84386C11.172 6.65585 10.9276 6.56185 10.722 6.41567C10.5398 6.28611 10.3806 6.12691 10.251 5.9447C10.1048 5.73912 10.0108 5.49471 9.82283 5.00589L8.66671 1.99998Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            </path>
          </g>
          <defs>
            <clipPath id="clip0_1177_865">
              <rect width="16" height="16" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
        <span>Ask AI</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="googleAiModeModal"
          onClick={handleModalClick}
        >
          <div className={`googleAiModeModalContent${isClosing ? ' fade-up-out' : ''}`}>
            <div className="googleAiModeModalHeader">
              <div className="googleAiModeModalTitleWrapper">
                <img 
                  src="/img/favicon.ico"
                  alt="Scalar logo"
                  className="googleAiModeModalIcon"
                  width="30"
                  height="30"
                />
                <h3 className="googleAiModeModalTitle">{modalTitle}</h3>
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
              {legalNotice}
            </div>
            {/* Pre-written Query Grid inside modal */}
            <div className="googleAiModePrewrittenGrid">
              {prewrittenQueries.map((query) => (
                <button
                  key={query}
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
                  ref={textareaRef}
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
                {poweredBy}
                <a 
                  href={`${googleDomain}/search?udm=50`}
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
