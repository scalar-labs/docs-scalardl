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
 * Check whether a URL should be treated as external and left unchanged.
 * @param {string} url
 * @returns {boolean}
 */
function isExternalOrSpecialUrl(url) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url);
}

/**
 * Remove markdown/MDX extension from route-like paths.
 * @param {string} pathname
 * @returns {string}
 */
function stripDocExtension(pathname) {
  return pathname.replace(/\.mdx?$/i, '');
}

/**
 * Convert a markdown link destination to an absolute URL based on page permalink.
 * Keeps external/special links unchanged and resolves relative links version-safely.
 *
 * @param {string} destination
 * @param {URL} pageUrl
 * @param {string} siteOrigin
 * @returns {string}
 */
function absolutizeDestination(destination, pageUrl, siteOrigin) {
  if (!destination) return destination;

  const trimmed = destination.trim();
  if (!trimmed) return destination;

  const angleWrapped = trimmed.startsWith('<') && trimmed.endsWith('>');
  const raw = angleWrapped ? trimmed.slice(1, -1).trim() : trimmed;

  if (!raw || isExternalOrSpecialUrl(raw)) {
    return destination;
  }

  /** @type {URL} */
  let resolved;
  if (raw.startsWith('#')) {
    resolved = new URL(pageUrl.toString());
    resolved.hash = raw;
  } else if (raw.startsWith('/')) {
    resolved = new URL(raw, siteOrigin);
  } else {
    resolved = new URL(raw, pageUrl);
  }

  resolved.pathname = stripDocExtension(resolved.pathname);

  const normalized = `${resolved.origin}${resolved.pathname}${resolved.search}${resolved.hash}`;
  return angleWrapped ? `<${normalized}>` : normalized;
}

/**
 * Rewrite markdown inline links/images into absolute URLs using the page permalink.
 * The rewrite is skipped inside fenced code blocks.
 *
 * @param {string} markdown
 * @param {string} permalink
 * @param {string} siteUrl
 * @returns {string}
 */
function absolutizeMarkdownLinks(markdown, permalink, siteUrl) {
  const pageUrl = new URL(permalink, siteUrl);
  const siteOrigin = new URL('/', siteUrl).toString();

  const lines = markdown.split('\n');
  let inFence = false;
  const rewritten = lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return line;
    }

    if (inFence) return line;

    // Matches inline markdown links/images with destinations that don't contain whitespace.
    // Titles are uncommon in this docs set; we keep this intentionally strict to avoid over-rewriting.
    return line.replace(/(!?\[[^\]]*\])\((<[^>]+>|[^\s)]+)\)/g, (_match, text, dest) => {
      const normalizedDest = absolutizeDestination(dest, pageUrl, siteOrigin);
      return `${text}(${normalizedDest})`;
    });
  });

  return rewritten.join('\n');
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
  // 1. Collect all `import X from '.../file.mdx'` statements.
  //    Only local `.mdx` files are inlinable; theme/npm imports are skipped.
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

  // 2. Read and pre-process each referenced component file (deduplicated).
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
        // Strip nested import lines (for example `import Tabs from '@theme/Tabs'`)
        // so the inlined content doesn't contain unresolvable MDX imports.
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

  // 3. Replace self-closing JSX tags `<ComponentName key="val" />` with the
  //    inlined component body (props substituted). Handles optional line breaks
  //    inside the tag (multi-line attribute lists).
  //    Regex breakdown:
  //      <ComponentName   - opening
  //      ([\s\S]*?)       - any attributes (non-greedy, allows newlines)
  //      \s*\/>           - self-closing
  for (const [name, body] of componentBodies) {
    // Escape the component name for use in a regex.
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tagRegex = new RegExp(
      `<${escapedName}([\\s\\S]*?)\\s*\\/>`,
      'g',
    );
    source = source.replace(tagRegex, (_fullMatch, propsStr) => {
      // Parse prop values: key="value" (double-quoted only).
      /** @type {Record<string, string>} */
      const props = {};
      const propRegex = /([A-Za-z0-9_]+)="([^"]*)"/g;
      let pm;
      while ((pm = propRegex.exec(propsStr)) !== null) {
        props[pm[1]] = pm[2];
      }
      // Substitute {props.key} -> value.
      return body.replace(
        /\{props\.([A-Za-z0-9_]+)\}/g,
        (_, key) => props[key] ?? `{props.${key}}`,
      );
    });
  }

  // 4. Remove the import lines for all resolved `.mdx` components (both those
  //    that were inlined above and any that were imported but never used).
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
  const siteUrl = context.siteConfig?.url;

  return {
    name: 'copy-page-source-plugin',

    /**
     * allContentLoaded is the only lifecycle hook that receives allContent
     * (the loaded content from every other plugin, including the docs plugin).
     * We capture the permalink -> source path mapping here for use in postBuild.
     */

    async allContentLoaded({ allContent }) {
      // The docs plugin can register multiple instances (for example, per locale).
      const docsInstances = allContent?.['docusaurus-plugin-content-docs'];

      if (!docsInstances || typeof docsInstances !== 'object') {
        console.warn('[copy-page-source] No docs instances found in allContentLoaded.');
        return;
      }

      docEntries = [];

      for (const docsContent of Object.values(docsInstances)) {
        if (!docsContent?.loadedVersions) continue;
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
      }

      if (docEntries.length === 0) {
        console.warn('[copy-page-source] No docs were found across docs instances.');
        return;
      }

      console.log(`[copy-page-source] Captured ${docEntries.length} doc entries.`);
    },

    async postBuild({ outDir }) {
      if (docEntries.length === 0) {
        console.warn('[copy-page-source] No docs were captured; skipping source.md writes.');
        return;
      }

      const localeDir = path.basename(outDir);

      const writes = docEntries.map(({ permalink, sourcePath }) => {
        const permalinkPath = permalink.replace(/^\//, '');
        const outputPath = permalinkPath.startsWith(`${localeDir}/`)
          ? permalinkPath.slice(localeDir.length + 1)
          : permalinkPath;
        const destPath = path.join(outDir, outputPath, 'source.md');
        return fs.promises
          .readFile(sourcePath, 'utf8')
          .then(async (raw) => {
            let content = stripFrontMatter(raw);
            content = await inlineMdxComponents(content, context.siteDir, componentCache);
            if (siteUrl) {
              content = absolutizeMarkdownLinks(content, permalink, siteUrl);
            }
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
