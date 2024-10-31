const fs = require('fs');
const path = require('path');

const glossaries = [
  { src: '../docs/glossary.mdx', output: '../build/docs/glossary.json' },
  { src: '../i18n/versioned_docs/ja-jp/docusaurus-plugin-content-docs/current/glossary.mdx', output: '../build/ja-jp/glossary.json' }
];

const generateGlossaryJson = (glossaryFilePath, outputJsonPath) => {
  const glossaryContent = fs.readFileSync(glossaryFilePath, 'utf-8');
  const glossaryLines = glossaryContent.split('\n');

  let glossary = {};
  let currentTerm = '';

  glossaryLines.forEach((line) => {
    if (line.startsWith('## ')) {
      currentTerm = line.replace('## ', '').trim();
    } else if (line.startsWith('# ')) {
      currentTerm = ''; // Reset the term for heading 1 lines.
    } else if (line.trim() !== '' && currentTerm !== '') {
      glossary[currentTerm] = line.trim();
    }
  });

  fs.writeFileSync(outputJsonPath, JSON.stringify(glossary, null, 2));
  console.log(`${outputJsonPath} generated successfully.`);
};

// Generate both glossaries.
glossaries.forEach(({ src, output }) => generateGlossaryJson(path.join(__dirname, src), path.join(__dirname, output)));
