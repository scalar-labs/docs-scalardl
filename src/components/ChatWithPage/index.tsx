import React, { useState, useRef, useEffect, useCallback } from 'react';
import { translate } from '@docusaurus/Translate';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

declare const gtag: (...args: unknown[]) => void;

const CHATGPT_URL = 'https://chatgpt.com/';
const CLAUDE_URL = 'https://claude.ai/new';
const PERPLEXITY_URL = 'https://www.perplexity.ai/';

function buildAIPrompt(pageUrl: string, isJapanese: boolean): string {
  if (isJapanese) {
    return `${pageUrl} のドキュメントを使って、このトピックについて理解するのを助けてください。`;
  }
  return `Using the documentation at ${pageUrl}, please help me understand this topic.`;
}

function openAIService(serviceUrl: string, prompt: string): void {
  const url = new URL(serviceUrl);
  url.searchParams.set('q', prompt);
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
}

export default function ChatWithPage(): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();

  const currentPageUrl = `${siteConfig.url}${location.pathname}`;
  const isJapanese = location.pathname.includes('/ja-jp');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const trackEvent = useCallback((action: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'chat_with_page', {
        event_category: 'engagement',
        event_label: action,
        page_url: currentPageUrl,
      });
    }
  }, [currentPageUrl]);

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) trackEvent('fab_opened');
  };

  const handleChatGPT = () => {
    trackEvent('chat_chatgpt');
    setIsOpen(false);
    openAIService(CHATGPT_URL, buildAIPrompt(currentPageUrl, isJapanese));
  };

  const handleClaude = () => {
    trackEvent('chat_claude');
    setIsOpen(false);
    openAIService(CLAUDE_URL, buildAIPrompt(currentPageUrl, isJapanese));
  };

  const handlePerplexity = () => {
    trackEvent('chat_perplexity');
    setIsOpen(false);
    openAIService(PERPLEXITY_URL, buildAIPrompt(currentPageUrl, isJapanese));
  };

  return (
    <div className="chat-with-page-wrapper" ref={wrapperRef}>
      {/* Expanded panel - renders above the FAB button */}
      {isOpen && (
        <div className="chat-with-page-panel" role="menu" aria-label={translate({ id: 'chatWithPage.panelAriaLabel', message: 'Chat with page options', description: 'Aria label for the Chat with page options panel' })}>
          <div className="chat-with-page-panel-header">
            <span className="chat-with-page-panel-title">
              <svg
                className="chat-with-page-panel-title-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {translate({ id: 'chatWithPage.title', message: 'Chat with page', description: 'Title shown in the Chat with page panel and on the FAB button' })}
            </span>
            <button
              className="chat-with-page-close"
              onClick={() => setIsOpen(false)}
              aria-label={translate({ id: 'chatWithPage.close', message: 'Close', description: 'Aria label for the close button in the Chat with page panel' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="chat-with-page-chat-row">
            <button className="chat-with-page-chat-btn" role="menuitem" onClick={handleChatGPT} title={translate({ id: 'chatWithPage.openInChatGPT', message: 'Open in ChatGPT', description: 'Tooltip and label for the ChatGPT button' })}>
              <svg className="chat-with-page-chat-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="currentColor" />
              </svg>
              <span>{translate({ id: 'chatWithPage.openInChatGPT', message: 'Open in ChatGPT', description: 'Tooltip and label for the ChatGPT button' })}</span>
            </button>

            <button className="chat-with-page-chat-btn" role="menuitem" onClick={handleClaude} title={translate({ id: 'chatWithPage.openInClaude', message: 'Open in Claude', description: 'Tooltip and label for the Claude button' })}>
              <svg className="chat-with-page-chat-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" fill="currentColor" />
              </svg>
              <span>{translate({ id: 'chatWithPage.openInClaude', message: 'Open in Claude', description: 'Tooltip and label for the Claude button' })}</span>
            </button>

            <button className="chat-with-page-chat-btn" role="menuitem" onClick={handlePerplexity} title={translate({ id: 'chatWithPage.openInPerplexity', message: 'Open in Perplexity', description: 'Tooltip and label for the Perplexity button' })}>
              <svg className="chat-with-page-chat-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" fill="currentColor" />
              </svg>
              <span>{translate({ id: 'chatWithPage.openInPerplexity', message: 'Open in Perplexity', description: 'Tooltip and label for the Perplexity button' })}</span>
            </button>
          </div>
        </div>
      )}

      {/* FAB trigger button */}
      <button
        className={`chat-with-page-btn${isOpen ? ' open' : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="chat-with-page-label">{translate({ id: 'chatWithPage.title', message: 'Chat with page', description: 'Title shown in the Chat with page panel and on the FAB button' })}</span>
      </button>
    </div>
  );
}
