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
    const isJapaneseSite = url.startsWith('/ja-jp/docs');

    if (process.env.NODE_ENV === 'production') { // The glossary tooltip works only in production environments.
      glossaryPath = isJapaneseSite ? '/ja-jp/glossary.json' : '/docs/glossary.json';
    } else {
      glossaryPath = isJapaneseSite ? '/ja-jp/glossary.json' : '/docs/glossary.json';
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

  // Function to check if the current page is a version index page
  const isVersionIndexPage = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;

      // Check for various version index patterns
      const localePrefix = '(?:/ja-jp)?'; // Matches either '/ja-jp' or nothing
      if (path.match(new RegExp(`${localePrefix}/docs/latest/?$`)) ||
          path.match(new RegExp(`${localePrefix}/docs/latest/index(\\.html)?`)) ||
          path.match(new RegExp(`${localePrefix}/docs/[0-9]+\\.[0-9]+/?$`)) ||
          path.match(new RegExp(`${localePrefix}/docs/[0-9]+\\.[0-9]+/index(\\.html)?`))) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (Object.keys(glossary).length === 0 || isVersionIndexPage()) return;

    // Sort terms in descending order to prioritize multi-word terms.
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

          // Check if the visitor is on the Japanese version of the site.
          const isJapaneseSite = window.location.pathname.startsWith('/ja-jp/');

          // Create a regex pattern based on the language.
          const regexPattern = terms.map(term => {
            const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

            // For the Japanese version of the site, don't use word boundaries that don't work well with Japanese characters.
            if (isJapaneseSite) {
              return `(${escapedTerm})`;
            }

            // For English site, match exact term or term followed by 's' or 'es' at word boundary.
            return `(\\b${escapedTerm}(s|es)?\\b)`;
          }).join('|');

          const regex = new RegExp(regexPattern, 'gi'); // The 'i' flag is for case-insensitive matching.

          let lastIndex = 0;
          let match: RegExpExecArray | null;

          while ((match = regex.exec(currentText))) {
            const matchedText = match[0]; // The full matched text (may include plural suffix).

            // Find the base term from the glossary that matches.
            let baseTerm: string | undefined;

            if (isJapaneseSite) {
              // For Japanese, look for an exact match only.
              baseTerm = terms.find(term => 
                matchedText.toLowerCase() === term.toLowerCase()
              );
            } else {
              // For English, check both singular and plural forms too.
              baseTerm = terms.find(term => 
                matchedText.toLowerCase() === term.toLowerCase() || 
                matchedText.toLowerCase() === `${term.toLowerCase()}s` || 
                matchedText.toLowerCase() === `${term.toLowerCase()}es`
              );
            }

            if (!baseTerm) {
              // Skip if no matching base term found.
              continue;
            }

            if (lastIndex < match.index) {
              newNodes.push(document.createTextNode(currentText.slice(lastIndex, match.index)));
            }

            const isFirstMention = !processedTerms.has(baseTerm.toLowerCase());
            const isLink = parentElement && parentElement.tagName === 'A'; // Check if the parent is a link.

            if (isFirstMention && !isLink) {
              // Create a tooltip only if it's the first mention and not a link.
              const tooltipWrapper = document.createElement('span');
              tooltipWrapper.setAttribute('data-term', baseTerm);
              tooltipWrapper.className = 'glossary-term';

              const definition = glossary[baseTerm];

              // Extract the part to underline (the base term) and the suffix (if plural).
              let textToUnderline = matchedText;
              let suffix = '';

              // Only apply pluralization logic for the English version of the site.
              if (!isJapaneseSite && matchedText.toLowerCase() !== baseTerm.toLowerCase()) {
                // This is a plural form - only underline the base part.
                const baseTermLength = baseTerm.length;
                textToUnderline = matchedText.substring(0, baseTermLength);
                suffix = matchedText.substring(baseTermLength);
              }

              ReactDOM.render(
                <GlossaryTooltip term={baseTerm} definition={definition}>
                  {textToUnderline}{suffix && <span className="no-underline">{suffix}</span>}
                </GlossaryTooltip>,
                tooltipWrapper
              );

              newNodes.push(tooltipWrapper);
              processedTerms.add(baseTerm.toLowerCase());
            } else if (isLink) {
              // If it's a link, we skip this mention but do not mark it as processed.
              newNodes.push(document.createTextNode(matchedText));
            } else {
              // If it's not the first mention, just add the plain text.
              newNodes.push(document.createTextNode(matchedText));
            }

            lastIndex = match.index + matchedText.length;
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
