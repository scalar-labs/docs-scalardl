import React, { useState, useCallback } from 'react';
import { translate } from '@docusaurus/Translate';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

declare const gtag: (...args: unknown[]) => void;

type CopyStatus = 'idle' | 'copied' | 'error';

async function fetchTextFile(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/plain') && !contentType.includes('text/markdown')) {
    throw new Error(
      `Expected a text file but received content-type "${contentType}". ` +
      `The file may not exist at ${url} or is not yet built.`
    );
  }
  return response.text();
}

async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

function getPageMarkdown(): string {
  const article = document.querySelector('article');
  if (!article) return '';
  const clone = article.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(
    '.theme-doc-version-badge, .theme-doc-version-banner, nav, .pagination-nav, [class*="tocCollapsible"], .theme-doc-footer'
  ).forEach((el) => el.remove());
  return htmlToMarkdown(clone);
}

function htmlToMarkdown(el: HTMLElement): string {
  const lines: string[] = [];
  processNode(el, lines, 0);
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function processNode(node: Node, lines: string[], depth: number): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    if (text.trim()) lines.push(text);
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  switch (tag) {
    case 'h1': lines.push(`\n# ${el.textContent?.trim()}\n`); break;
    case 'h2': lines.push(`\n## ${el.textContent?.trim()}\n`); break;
    case 'h3': lines.push(`\n### ${el.textContent?.trim()}\n`); break;
    case 'h4': lines.push(`\n#### ${el.textContent?.trim()}\n`); break;
    case 'h5': lines.push(`\n##### ${el.textContent?.trim()}\n`); break;
    case 'h6': lines.push(`\n###### ${el.textContent?.trim()}\n`); break;
    case 'p': {
      const content = inlineToMarkdown(el);
      if (content.trim()) lines.push(`\n${content}\n`);
      break;
    }
    case 'ul': {
      lines.push('');
      el.querySelectorAll(':scope > li').forEach((li) => {
        lines.push(`- ${inlineToMarkdown(li as HTMLElement).trim()}`);
      });
      lines.push('');
      break;
    }
    case 'ol': {
      lines.push('');
      el.querySelectorAll(':scope > li').forEach((li, i) => {
        lines.push(`${i + 1}. ${inlineToMarkdown(li as HTMLElement).trim()}`);
      });
      lines.push('');
      break;
    }
    case 'pre': {
      const code = el.querySelector('code');
      const lang = code?.className.match(/language-(\w+)/)?.[1] ?? '';
      lines.push(`\n\`\`\`${lang}\n${code?.textContent ?? el.textContent}\n\`\`\`\n`);
      break;
    }
    case 'blockquote': {
      const inner = htmlToMarkdown(el);
      lines.push(inner.split('\n').map((l) => `> ${l}`).join('\n'));
      break;
    }
    case 'table': {
      const rows = el.querySelectorAll('tr');
      let headerWritten = false;
      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('th, td')).map((c) =>
          inlineToMarkdown(c as HTMLElement).replace(/\|/g, '\\|').trim()
        );
        lines.push(`| ${cells.join(' | ')} |`);
        if (!headerWritten) {
          lines.push(`| ${cells.map(() => '---').join(' | ')} |`);
          headerWritten = true;
        }
      });
      lines.push('');
      break;
    }
    case 'br': lines.push('\n'); break;
    case 'hr': lines.push('\n---\n'); break;
    case 'script':
    case 'style':
    case 'button':
      break;
    default:
      el.childNodes.forEach((child) => processNode(child, lines, depth + 1));
  }
}

function inlineToMarkdown(el: HTMLElement): string {
  let result = '';
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent ?? '';
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const child = node as HTMLElement;
    const tag = child.tagName.toLowerCase();
    switch (tag) {
      case 'strong':
      case 'b': result += `**${inlineToMarkdown(child)}**`; break;
      case 'em':
      case 'i': result += `*${inlineToMarkdown(child)}*`; break;
      case 'code': result += `\`${child.textContent}\``; break;
      case 'a': {
        const href = child.getAttribute('href') ?? '#';
        result += `[${inlineToMarkdown(child)}](${href})`;
        break;
      }
      default: result += inlineToMarkdown(child);
    }
  });
  return result;
}

// SVG icons

function CopyIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function FileIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

// Main component

interface CopyContentsProps {
  showLlmsButtons?: boolean;
  hideMarkdownButton?: boolean;
}

export default function CopyContents({ showLlmsButtons = false, hideMarkdownButton = false }: CopyContentsProps): JSX.Element {
  const [copyStatus, setCopyStatus] = useState<Record<string, CopyStatus>>({});
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();

  const currentPageUrl = `${siteConfig.url}${location.pathname}`;

  const trackEvent = useCallback((action: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'copy_contents', {
        event_category: 'engagement',
        event_label: action,
        page_url: currentPageUrl,
      });
    }
  }, [currentPageUrl]);

  const setCopied = (key: string, success: boolean) => {
    setCopyStatus((prev) => ({ ...prev, [key]: success ? 'copied' : 'error' }));
    setTimeout(() => setCopyStatus((prev) => ({ ...prev, [key]: 'idle' })), 2000);
  };

  const handleCopyMarkdown = async () => {
    trackEvent('copy_page_markdown');
    try {
      // Prefer the pre-built raw MDX source (generated by copy-page-source-plugin),
      // which preserves Mermaid diagrams, admonitions, import statements, etc.
      // Fall back to HTML scraping when running in dev or if the file is absent.
      let markdown: string;
      try {
        const pathname = location.pathname.replace(/\/$/, '');
        markdown = await fetchTextFile(`${pathname}/source.md`);
      } catch {
        markdown = getPageMarkdown();
        if (!markdown) throw new Error('No content found');
      }
      await copyToClipboard(markdown);
      setCopied('markdown', true);
    } catch {
      setCopied('markdown', false);
    }
  };

  const handleCopyLlmsTxt = async () => {
    trackEvent('copy_llms_txt');
    try {
      const text = await fetchTextFile(`${siteConfig.baseUrl}llms.txt`);
      await copyToClipboard(text);
      setCopied('llms', true);
    } catch {
      setCopied('llms', false);
    }
  };

  const handleCopyLlmsFullTxt = async () => {
    trackEvent('copy_llms_full_txt');
    try {
      const text = await fetchTextFile(`${siteConfig.baseUrl}llms-full.txt`);
      await copyToClipboard(text);
      setCopied('llmsFull', true);
    } catch {
      setCopied('llmsFull', false);
    }
  };

  const getCopyLabel = (key: string, defaultLabel: string): string => {
    const s = copyStatus[key];
    if (s === 'copied') return translate({ id: 'copyContents.copied', message: 'Copied!', description: 'Status shown after a successful copy' });
    if (s === 'error') return translate({ id: 'copyContents.copyFailed', message: 'Failed', description: 'Status shown after a failed copy' });
    return defaultLabel;
  };

  return (
    <div className="copy-contents-actions">
      {!showLlmsButtons && !hideMarkdownButton && (
        <button className="copy-contents-trigger" onClick={handleCopyMarkdown}>
          <CopyIcon />
          {/* Grid overlay keeps button width fixed at the longest label's width */}
          <span style={{ display: 'grid' }}>
            <span style={{ gridArea: '1/1', visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
              {translate({ id: 'copyContents.copyMarkdown', message: 'Copy page as Markdown', description: 'Label for the copy-page-as-markdown button' })}
            </span>
            <span style={{ gridArea: '1/1' }}>
              {getCopyLabel('markdown', translate({ id: 'copyContents.copyMarkdown', message: 'Copy page as Markdown', description: 'Label for the copy-page-as-markdown button' }))}
            </span>
          </span>
        </button>
      )}
      {showLlmsButtons && (
        <>
          <button className="copy-contents-trigger" onClick={handleCopyLlmsTxt}>
            <FileIcon />
            {getCopyLabel('llms', translate({ id: 'copyContents.copyLlms', message: 'Copy llms.txt', description: 'Label for the copy llms.txt button' }))}
          </button>
          <button className="copy-contents-trigger" onClick={handleCopyLlmsFullTxt}>
            <FileIcon />
            {getCopyLabel('llmsFull', translate({ id: 'copyContents.copyLlmsFull', message: 'Copy llms-full.txt', description: 'Label for the copy llms-full.txt button' }))}
          </button>
        </>
      )}
    </div>
  );
}
