import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import GlossaryTooltip from './GlossaryTooltip';

interface GlossaryInjectorProps {
  children: React.ReactNode;
}

const GlossaryInjector: React.FC<GlossaryInjectorProps> = ({ children }) => {
  const [glossary, setGlossary] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const url = window.location.pathname;
    let glossaryPath = '/docs/glossary.json'; // Use the English version as the default glossary.

    if (process.env.NODE_ENV === 'production') { // The glossary tooltip works only in production environments.
      glossaryPath = url.startsWith('/ja-jp/docs') ? '/ja-jp/glossary.json' : '/docs/glossary.json';
    } else {
      glossaryPath = url.startsWith('/ja-jp/docs') ? '/ja-jp/glossary.json' : '/docs/glossary.json';
    }

    fetch(glossaryPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(setGlossary)
      .catch((err) => console.error('Failed to load glossary:', err));
  }, []);

  useEffect(() => {
    if (Object.keys(glossary).length === 0) return;

    // Sort terms in descending order by length to prioritize multi-word terms.
    const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
    const processedTerms = new Set<string>(); // Set to track processed terms.

    const wrapTermsInTooltips = (node: HTMLElement) => {
      const textNodes = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
      let currentNode: Node | null;

      const modifications: { originalNode: Node; newNodes: Node[] }[] = [];

      while ((currentNode = textNodes.nextNode())) {
        const parentElement = currentNode.parentElement;

        // Check if the parent element is a tab title.
        const isTabTitle = parentElement && parentElement.closest('.tabs__item'); // Adjust the selector as necessary.

        // Check if the parent element is a code block.
        const isCodeBlock = parentElement && parentElement.closest('.prism-code'); // Adjust the selector as necessary.

        // Check if the parent element is a Card.
        const isCard = parentElement && parentElement.closest('.card__body'); // Adjust the selector as necessary.

        // Check if the parent element is a Mermaid diagram.
        const isMermaidDiagram = parentElement && parentElement.closest('.docusaurus-mermaid-container'); // Adjust the selector as necessary.

        // Check if the parent element is an inline code block (text in backticks).
        const isInlineCode = parentElement && (parentElement.tagName === 'CODE' || parentElement.classList.contains('inlineCode'));

        // Only wrap terms in tooltips if the parent is within the target div and not in headings or tab titles.
        if (
          parentElement &&
          parentElement.closest('.theme-doc-markdown.markdown') &&
          !/^H[1-6]$/.test(parentElement.tagName) && // Skip headings (H1 to H6).
          !isTabTitle && // Skip tab titles.
          !isCodeBlock && // Skip code blocks.
          !isCard && // Skip Cards.
          !isMermaidDiagram && // Skip Mermaid diagrams.
          !isInlineCode // Skip inline code (text in backticks).
        ) {
          let currentText = currentNode.textContent!;
          const newNodes: Node[] = [];
          let hasReplacements = false;

          // Create a regex pattern to match all terms (case-sensitive).
          const regexPattern = terms.map(term => `(${term})`).join('|');
          const regex = new RegExp(regexPattern, 'g');

          let lastIndex = 0;
          let match: RegExpExecArray | null;

          while ((match = regex.exec(currentText))) {
            const matchedTerm = match[0];

            if (lastIndex < match.index) {
              newNodes.push(document.createTextNode(currentText.slice(lastIndex, match.index)));
            }

            const isFirstMention = !processedTerms.has(matchedTerm);
            const isLink = parentElement && parentElement.tagName === 'A'; // Check if the parent is a link.

            if (isFirstMention && !isLink) {
              // Create a tooltip only if it's the first mention and not a link.
              const tooltipWrapper = document.createElement('span');
              tooltipWrapper.setAttribute('data-term', matchedTerm);
              tooltipWrapper.className = 'glossary-term';

              const definition = glossary[matchedTerm]; // Exact match from glossary.

              ReactDOM.render(
                <GlossaryTooltip term={matchedTerm} definition={definition}>
                  {matchedTerm}
                </GlossaryTooltip>,
                tooltipWrapper
              );

              newNodes.push(tooltipWrapper);
              processedTerms.add(matchedTerm); // Mark this term as processed.
            } else if (isLink) {
              // If it's a link, we skip this mention but do not mark it as processed.
              newNodes.push(document.createTextNode(matchedTerm));
            } else {
              // If it's not the first mention, just add the plain text.
              newNodes.push(document.createTextNode(matchedTerm));
            }

            lastIndex = match.index + matchedTerm.length;
            hasReplacements = true;
          }

          if (lastIndex < currentText.length) {
            newNodes.push(document.createTextNode(currentText.slice(lastIndex)));
          }

          if (hasReplacements) {
            modifications.push({ originalNode: currentNode, newNodes });
          }
        }
      }

      // Replace the original nodes with new nodes.
      modifications.forEach(({ originalNode, newNodes }) => {
        const parentElement = originalNode.parentElement;
        if (parentElement) {
          newNodes.forEach((newNode) => {
            parentElement.insertBefore(newNode, originalNode);
          });
          parentElement.removeChild(originalNode);
        }
      });
    };

    // Target the specific div with the class "theme-doc-markdown markdown".
    const targetDiv = document.querySelector('.theme-doc-markdown.markdown');
    if (targetDiv) {
      wrapTermsInTooltips(targetDiv);
    }
  }, [glossary]);

  return <>{children}</>;
};

export default GlossaryInjector;
