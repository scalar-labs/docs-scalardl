import React, { useState, useEffect, useRef, lazy, Suspense, MouseEvent } from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { useLocation } from "@docusaurus/router";

// Lazy-load AssistantModal.
const AssistantModal = lazy(() => import("./AssistantModal"));

const SupportDropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [githubIssueUrl, setGithubIssueUrl] = useState<string>("#");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  // Get document metadata from Docusaurus.
  const { metadata } = useDoc();
  const docTitle: string = metadata?.title || "Issue with documentation page";

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
    <div className="supportDropdown" ref={dropdownRef}>
      <button className="supportDropBtn" onMouseOver={toggleDropdown}>
        {isJapanese ? "何かお困りですか?" : "Need some help?"}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="m12 16l-6-6h12z" />
        </svg>
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
