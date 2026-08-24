const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Auto-derived: any 3.X version below the oldest entry in versions.json is considered retired.
const _activeVersions = JSON.parse(fs.readFileSync('./versions.json', 'utf8'));
const _oldestActiveMinor = Math.min(..._activeVersions.map(v => parseInt(v.split('.')[1])));
const FIRST_RETIRED_MINOR = 4; // minor version of the oldest version ever retired (3.4)
const RETIRED_VERSIONS = Array.from(
  { length: _oldestActiveMinor - FIRST_RETIRED_MINOR },
  (_, i) => `3.${_oldestActiveMinor - 1 - i}` // descending: 3.14, 3.13, ...
);

// Returns a Set of URL paths (no extension, README/index treated as directory index) for all
// non-partial docs in `dir`.
function getDocPaths(dir) {
  const paths = new Set();
  if (!fs.existsSync(dir)) return paths;
  function walk(currentDir, relPath) {
    for (const entry of fs.readdirSync(currentDir)) {
      if (entry.startsWith('_')) continue; // Docusaurus excludes underscore-prefixed files
      const full = path.join(currentDir, entry);
      const rel = relPath ? `${relPath}/${entry}` : entry;
      if (fs.statSync(full).isDirectory()) {
        walk(full, rel);
      } else if (/\.(mdx|md)$/.test(entry)) {
        let urlPath = rel.replace(/\.(mdx|md)$/, '');
        // README and index files are directory indices in Docusaurus
        if (urlPath.endsWith('/README') || urlPath.endsWith('/index')) {
          urlPath = urlPath.slice(0, urlPath.lastIndexOf('/'));
        } else if (urlPath === 'README' || urlPath === 'index') {
          urlPath = '';
        }
        if (urlPath) paths.add(urlPath);
      }
    }
  }
  walk(dir, '');
  return paths;
}

// Generates redirect entries for pages that exist in versioned docs but not in latest, pointing
// to /docs/latest/ for every version (active and retired) that lacks the page.
function buildRemovedPageRedirects(existingFromPaths = new Set()) {
  const latestPaths = getDocPaths('./docs');

  const versionedDocsBase = './versioned_docs';
  const versionedDirs = fs.readdirSync(versionedDocsBase)
    .filter(d => /^version-/.test(d) && fs.statSync(path.join(versionedDocsBase, d)).isDirectory())
    .map(d => ({ version: d.replace('version-', ''), dir: path.join(versionedDocsBase, d) }));

  // Map each removed-from-latest path to the set of active versions that still have it.
  const pathToActiveVersions = new Map();
  for (const { version, dir } of versionedDirs) {
    for (const p of getDocPaths(dir)) {
      if (!latestPaths.has(p)) {
        if (!pathToActiveVersions.has(p)) pathToActiveVersions.set(p, new Set());
        pathToActiveVersions.get(p).add(version);
      }
    }
  }

  // Also detect pages from versioned_docs directories that have since been deleted from the repo.
  try {
    const gitOutput = execFileSync(
      'git', ['log', '--diff-filter=D', '--name-only', '--format=', '--', 'versioned_docs/'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );
    for (const file of gitOutput.split('\n')) {
      const match = file.match(/^versioned_docs\/version-[\d.]+\/(.+)$/);
      if (!match) continue;
      const relativePath = match[1];
      if (!/\.(mdx|md)$/.test(relativePath)) continue;
      if (relativePath.split('/').some(p => p.startsWith('_'))) continue;
      let urlPath = relativePath.replace(/\.(mdx|md)$/, '');
      if (urlPath.endsWith('/README') || urlPath.endsWith('/index')) {
        urlPath = urlPath.slice(0, urlPath.lastIndexOf('/'));
      } else if (urlPath === 'README' || urlPath === 'index') {
        continue;
      }
      if (urlPath && !latestPaths.has(urlPath) && !pathToActiveVersions.has(urlPath)) {
        pathToActiveVersions.set(urlPath, new Set());
      }
    }
  } catch {
    // git unavailable or no history (e.g., shallow clone); pages from deleted versioned_docs
    // directories will not have redirects generated for those paths.
  }

  const activeVersions = versionedDirs.map(({ version }) => version);
  const redirects = [];
  for (const [p, versionsWithPage] of pathToActiveVersions) {
    // Redirect every version (and /latest) that does NOT have the page to /docs/latest/.
    // Use a Set to deduplicate versions that appear in both RETIRED_VERSIONS and activeVersions.
    const versionsNeedingRedirect = new Set([
      'latest',
      ...RETIRED_VERSIONS,
      ...activeVersions.filter(v => !versionsWithPage.has(v)),
    ]);
    for (const v of versionsNeedingRedirect) {
      const from = `/docs/${v}/${p}`;
      if (!existingFromPaths.has(from)) {
        redirects.push({ to: '/docs/latest/', from });
      }
    }
  }
  return redirects;
}

module.exports = { RETIRED_VERSIONS, buildRemovedPageRedirects };
