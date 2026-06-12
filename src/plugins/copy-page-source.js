// @ts-check
/**
 * Docusaurus plugin that writes each doc's raw MDX source (front matter
 * stripped) to `build/<permalink>/source.md` during the build.
 *
 * The "Copy page as Markdown" button in CopyContents/index.tsx fetches this
 * file instead of scraping the rendered HTML, which preserves Mermaid diagrams,
 * Docusaurus admonitions (:::type), import statements, component tags, and all
 * other MDX formatting that is lost when converting from the rendered DOM.
 *
 * Implementation note: `allContent` (the map of all plugin content keyed by
 * plugin name + id) is only available in the `allContentLoaded` lifecycle hook,
 * not in `postBuild`. We capture the permalink→source mapping in a closure
 * during `allContentLoaded` and then write the files in `postBuild` (which runs
 * after the Webpack/Rspack build so the `outDir` already exists).
 *
 * MDX component inlining: When a doc imports a local `.mdx` component (e.g.
 * `import Foo from '/src/components/en-us/_foo.mdx'`) and uses it as a JSX
 * self-closing tag (e.g. `<Foo bar="baz" />`), this plugin reads the component
 * file, substitutes `{props.bar}` with `"baz"`, and replaces the JSX tag with
 * the inlined content. This ensures the copied Markdown is fully readable
 * outside Docusaurus (e.g., admonitions from `_warning-*.mdx` are inlined as
 * `:::warning` blocks). Import lines for inlined `.mdx` components are removed.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Remove the YAML front matter block from MDX source.
 * Front matter is a `---` delimited block at the very start of the file.
 * @param {string} content
 * @returns {string}
 */
function stripFrontMatter(content) {
  if (!content.startsWith('---')) return content;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return content;
  return content.slice(end + 4).replace(/^\n+/, '');
}

/**
 * Resolve a path (possibly `@site/`-prefixed or root-relative `/src/...`) to an
 * absolute filesystem path.
 * @param {string} importPath  e.g. "/src/components/en-us/_foo.mdx"
 * @param {string} siteDir     absolute path to the Docusaurus site root
 * @returns {string}
 */
function resolveSource(importPath, siteDir) {
  if (importPath.startsWith('@site/')) {
    return path.join(siteDir, importPath.slice('@site/'.length));
  }
  if (path.isAbsolute(importPath)) {
    return path.join(siteDir, importPath);
  }
  return path.join(siteDir, importPath);
}

/**
 * For a doc's MDX source string, find every `import X from '.../file.mdx'`
 * statement, read the referenced `.mdx` file, and replace any self-closing JSX
 * usage `<X prop="val" />` with the inlined component content (with props
 * substituted). Import lines for inlined components are removed from the output.
 * Non-`.mdx` imports (theme components, TSX, etc.) are left unchanged.
 *
 * @param {string} source
 * @param {string} siteDir
 * @param {Map<string, string>} cache  Shared across all docs; maps absolute path → processed body.
 * @returns {Promise<string>}
 */
async function inlineMdxComponents(source, siteDir, cache) {
  const importLineRegex =
    /^import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+\.mdx)['"]\s*;?\s*$/gm;

  /** @type {Map<string, string>} name → absolute file path */
  const mdxImports = new Map();
  let m;
  while ((m = importLineRegex.exec(source)) !== null) {
    const [, name, importPath] = m;
    mdxImports.set(name, resolveSource(importPath, siteDir));
  }

  if (mdxImports.size === 0) return source;

  /** @type {Map<string, string>} name → processed component body */
  const componentBodies = new Map();
  for (const [name, filePath] of mdxImports) {
    try {
      let body;
      if (cache.has(filePath)) {
        body = cache.get(filePath);
      } else {
        body = await fs.promises.readFile(filePath, 'utf8');
        body = stripFrontMatter(body);
        body = body.replace(
          /^import\s+[A-Za-z0-9_{}, *]+\s+from\s+['"][^'"]+['"]\s*;?\s*\n?/gm,
          '',
        );
        body = body.trim();
        cache.set(filePath, body);
      }
      componentBodies.set(name, body);
    } catch {
      // If the file is unreadable, leave the tag as-is (handled below).
    }
  }

  for (const [name, body] of componentBodies) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tagRegex = new RegExp(
      `<${escapedName}([\\s\\S]*?)\\s*\\/>`,
      'g',
    );
    source = source.replace(tagRegex, (_fullMatch, propsStr) => {
      /** @type {Record<string, string>} */
      const props = {};
      const propRegex = /([A-Za-z0-9_]+)="([^"]*)"/g;
      let pm;
      while ((pm = propRegex.exec(propsStr)) !== null) {
        props[pm[1]] = pm[2];
      }
      return body.replace(
        /\{props\.([A-Za-z0-9_]+)\}/g,
        (_, key) => props[key] ?? `{props.${key}}`,
      );
    });
  }

  for (const name of componentBodies.keys()) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    source = source.replace(
      new RegExp(
        `^import\\s+${escapedName}\\s+from\\s+['"][^'"]+\\.mdx['"]\\s*;?\\s*\\n?`,
        'gm',
      ),
      '',
    );
  }

  return source;
}

/**
 * @param {{ siteDir: string }} context
 * @returns {import('@docusaurus/types').Plugin}
 */
module.exports = function copyPageSourcePlugin(context) {
  /**
   * Populated during allContentLoaded; consumed during postBuild.
   * @type {Array<{ permalink: string, sourcePath: string }>}
   */
  let docEntries = [];
  /** @type {Map<string, string>} Absolute path → processed component body, shared across all docs. */
  const componentCache = new Map();

  return {
    name: 'copy-page-source-plugin',

    async allContentLoaded({ allContent }) {
      const docsContent =
        allContent?.['docusaurus-plugin-content-docs']?.['default'];

      if (!docsContent?.loadedVersions) {
        console.warn('[copy-page-source] No docs content found in allContentLoaded.');
        return;
      }

      docEntries = [];
      for (const version of docsContent.loadedVersions) {
        for (const doc of version.docs) {
          const { permalink, source } = doc;
          if (!permalink || !source) continue;
          docEntries.push({
            permalink,
            sourcePath: resolveSource(source, context.siteDir),
          });
        }
      }

      console.log(`[copy-page-source] Captured ${docEntries.length} doc entries.`);
    },

    async postBuild({ outDir }) {
      if (docEntries.length === 0) {
        console.warn('[copy-page-source] No docs were captured; skipping source.md writes.');
        return;
      }

      const writes = docEntries.map(({ permalink, sourcePath }) => {
        const destPath = path.join(outDir, permalink, 'source.md');
        return fs.promises
          .readFile(sourcePath, 'utf8')
          .then(async (raw) => {
            let content = stripFrontMatter(raw);
            content = await inlineMdxComponents(content, context.siteDir, componentCache);
            content = content.trimStart();
            await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
            await fs.promises.writeFile(destPath, content, 'utf8');
          })
          .catch((err) => {
            console.warn(`[copy-page-source] Skipping ${sourcePath}: ${err.message}`);
          });
      });

      await Promise.all(writes);
      console.log(`[copy-page-source] Wrote source.md for ${docEntries.length} pages to ${outDir}.`);
    },
  };
};
