import React, { useState, useEffect, useRef, lazy, Suspense, MouseEvent } from "react";
import { useLocation } from "@docusaurus/router";

// Lazy-load AssistantModal.
const AssistantModal = lazy(() => import("./AssistantModal"));

// Safe hook to use Doc context when available
function useSafeDoc() {
  try {
    const { useDoc } = require('@docusaurus/plugin-content-docs/client');
    return useDoc();
  } catch (error) {
    // Return default values when useDoc is not available (like when rendered outside of a Docusaurus doc page context)
    return { metadata: { title: "Documentation page" } };
  }
}

const SupportDropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [githubIssueUrl, setGithubIssueUrl] = useState<string>("#");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  // Get document metadata from Docusaurus safely.
  const { metadata } = useSafeDoc();
  const docTitle: string = metadata?.title || "Documentation page";

  // Detect the language based on the URL path.
  const isJapanese: boolean = location.pathname.startsWith("/ja-jp");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const repoUrl = "https://github.com/scalar-labs/docs-scalardl/issues/new";
      const issueTitle = encodeURIComponent(
        isJapanese ? `フィードバック: \`${docTitle}\` ページ` : `Feedback: \`${docTitle}\` page`
      );

      const issueBody = encodeURIComponent(
        isJapanese
          ? `**ドキュメントページの URL:** ${window.location.href.replace(/#.*$/, '')}
  
  ## 期待される動作
  
  どのような動作を期待しましたか？
  
  ## 問題の説明
  
  問題の内容をわかりやすく説明してください。
  
  ### 再現手順 (該当する場合)
  
  問題を再現できる場合、手順を記載してください。
  
  ### スクリーンショット (該当する場合)
  
  該当する場合は、スクリーンショットを添付してください。`
          : `**Documentation page URL:** ${window.location.href.replace(/#.*$/, '')}
  
  ## Expected behavior
  
  What did you expect to happen?
  
  ## Describe the problem
  
  Please provide a clear and concise description of what the issue is.
  
  ### Steps to reproduce (if applicable)
  
  If the issue is reproducible, please list the steps to reproduce it.
  
  ### Screenshots (if applicable)
  
  If applicable, add screenshots to help explain your problem.`
      );

      const issueUrl = `${repoUrl}?title=${issueTitle}&body=${issueBody}&labels=documentation`;
      setGithubIssueUrl(issueUrl);
    }
  }, [isJapanese, docTitle]);

  // Handle scroll to detect when back-to-top button is actually visible
  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // Use scroll position as primary check (300px threshold same as Docusaurus)
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const shouldShowBackToTop = scrollTop > 300;

      // Double-check with DOM element visibility as secondary validation
      // ⚠️ FRAGILE DEPENDENCY WARNING ⚠️
      // The selector below is tightly coupled to Docusaurus's BackToTopButton implementation.
      // This aria-label may change without notice in future Docusaurus updates, especially for internationalization support. If this breaks, the support button may overlap with the back-to-top button. Consider swizzling BackToTopButton for more control or finding a more stable class-based selector if available.
      const backToTopButton = document.querySelector('button[aria-label="Scroll back to top"]');
      const isBackToTopInDOM = backToTopButton &&
        window.getComputedStyle(backToTopButton).display !== 'none' &&
        window.getComputedStyle(backToTopButton).visibility !== 'hidden' &&
        window.getComputedStyle(backToTopButton).opacity !== '0';

      // Use scroll position as primary indicator for faster response
      setShowBackToTop(shouldShowBackToTop && !!isBackToTopInDOM);
    };

    const throttledHandleScroll = () => {
      if (throttleTimeout) return;

      throttleTimeout = setTimeout(() => {
        handleScroll();
        throttleTimeout = null;
      }, 16); // ~60fps throttling
    };

    // Check immediately and on scroll with throttling for performance
    handleScroll();
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const openModal = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSupportClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (typeof window !== "undefined") {
      const reportUrl = `https://support.scalar-labs.com/hc/ja/requests/new?ticket_form_id=8641483507983`;
      window.open(reportUrl, "_blank");
    }
  };

  const handleGitHubClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (githubIssueUrl !== "#") {
      window.open(githubIssueUrl, "_blank");
    } else {
      console.error("GitHub issue URL is not set correctly.");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | Event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      className={`supportDropdown ${isOpen ? 'open' : ''}`}
      ref={dropdownRef}
      style={{
        position: 'fixed',
        bottom: showBackToTop ? '80px' : '20px', // Move up when back-to-top is visible
        right: '20px',
        transition: 'bottom 0.3s ease',
        zIndex: 1000
      }}
    >
      <button className="supportDropBtn" onClick={toggleDropdown}>
        ?
      </button>

      <div className="supportDropdownContent">
        <div>
          <a href="#" onClick={handleSupportClick}>
            <b>{isJapanese ? "テクニカルサポートに問い合わせ" : "Contact technical support"}</b><br />
            {isJapanese ? "商用ライセンスをご契約のお客様のみご利用いただけます。" : "Available only to customers with a commercial license."}
          </a>
        </div>
        <hr />
        <a href="#" onClick={openModal}>
          <b>{isJapanese ? "AI に聞く (試験運用中)" : "Ask AI (experimental)"}</b><br />
          {isJapanese ? "Scalar Membership Programにご参加の方のみご利用いただけます。" : "Available only to members of the Scalar Membership Program."}
        </a>
        <hr />
        <a href="#" onClick={handleGitHubClick}>
          <b>{isJapanese ? "ドキュメントの問題を報告" : "Report doc issue"}</b><br />
          {isJapanese ? "このページについて何かお気づきの点がありましたら、こちらから報告いただけます。" : "If you have any feedback about this page, please submit an issue."}
        </a>
      </div>

      {isModalOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <AssistantModal isOpen={isModalOpen} onClose={closeModal} />
        </Suspense>
      )}
    </div>
  );
};

export default SupportDropdownMenu;
