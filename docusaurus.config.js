// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import { getNotifications } from './src/data/notifications';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const config = {
  title: 'ScalarDL Documentation',
  tagline: 'Scalable and practical Byzantine-fault detection middleware for transactional database systems',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://scalardl.scalar-labs.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'scalar-labs', // Usually your GitHub org/user name.
  projectName: 'docs-scalardl', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'ignore',
  onDuplicateRoutes: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en-us',
    locales: ['en-us', 'ja-jp'],
    localeConfigs: {
      'en-us': {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'versioned_docs/en-us',
      },
      'ja-jp': {
        label: '日本語',
        direction: 'ltr',
        htmlLang: 'ja-JP',
        calendar: 'gregory',
        path: 'versioned_docs/ja-jp',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          breadcrumbs: true,
          sidebarPath: './sidebars.js',
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/scalar-labs/docs-scalardl/edit/main',
          editLocalizedFiles: true, // This allows for the "Edit this page" button to direct users to edit the localized version of the page on GitHub.
          lastVersion: 'current',
            versions: {
              // The following is a template for adding a new version to the dropdown menu. Copy this version template when adding a new version to the dropdown menu but don't delete it.
              /*
              current: { // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                label: '<VERSION_NUMBER>',
                path: 'latest', // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                banner: 'none',
                className: 'X.X.X', // This should be the most recent version (major.minor.patch) so that the Javadoc links point to the latest version based on the major.minor version that the visitor is viewing on the docs site.
              },
              */
              current: { // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                label: '3.14',
                path: 'latest', // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                banner: 'none',
                className: '3.14.0',
              },
              "3.13": { // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                label: '3.13',
                path: '3.13', // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                banner: 'none',
                className: '3.13.0',
              },
              "3.12": { // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                label: '3.12',
                path: '3.12', // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                banner: 'none',
                className: '3.12.3',
              },
              "3.11": { // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                label: '3.11',
                path: '3.11',
                banner: 'none',
                className: '3.11.3',
              },
              "3.10": {
                label: '3.10',
                path: '3.10',
                banner: 'unmaintained',
                className: '3.10.5',
              },
            },
          },
          googleTagManager: {
            containerId: 'GTM-WL9C9L5',
          },
          gtag: {
            trackingID: 'G-Q4TKS77KCP',
            anonymizeIP: true,
          },
        // Maybe we can use this later.
        /*
        blog: {
          showReadingTime: true,
        },
        */
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  customFields: {
    // These pre-written queries are used in the Google AI Mode feature. Update these queries as needed when new features are added or when you want to highlight specific features in the Google AI Mode. For more information, see /src/components/GoogleAIModeSearch/index.js.
    prewrittenQueries: [
      'What is ScalarDL and how does it work?',
      'How does ScalarDL manage assets and data?',
      'How do I develop applications with ScalarDL?',
      'How do I deploy ScalarDL?',
    ],
    prewrittenQueriesJa: [
      'ScalarDL とは何ですか？どのように動作しますか？',
      'ScalarDL はアセットやデータをどう管理しますか？',
      'ScalarDL でアプリケーションをどう開発しますか？',
      'ScalarDL をどのようにデプロイできますか？',
    ],
  },

  plugins: [
    './src/plugins/copy-page-source.js',
    [
      '@docusaurus/plugin-client-redirects',
      buildRedirectsConfig(),
    ],
    require.resolve('docusaurus-plugin-image-zoom'),
    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: false, // Disabled. We're currently using gitingest to generate a more detailed llms-full.txt file. For details, see /scripts/README.md.
        // llmsTxtFilename: 'llms-latest.txt',
        docsDir: 'docs',
        version: 'latest',
        pathTransformation: {
          addPaths: ['latest'],
        },
        title: 'ScalarDL Documentation',
        description: 'Scalable and practical Byzantine-fault detection middleware for transactional database systems',
        // Content cleaning options
        excludeImports: true, // This configuration currently option doesn't seem to work as expected. I don't think it's a major issue, but we should upgrade the plugin when a new version is available to see if the issue is fixed.
        removeDuplicateHeadings: true, // This configuration currently option doesn't seem to work as expected. I don't think it's a major issue, but we should upgrade the plugin when a new version is available to see if the issue is fixed.
        includeUnmatchedLast: true,
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
          'mobile',
          'always',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/favicon.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json', // your PWA manifest
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#2673BB',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#2673BB',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/favicon.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: '/img/favicon.svg',
            color: '#2673BB',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: '/img/favicon.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#2673BB',
          },
        ],
      },
    ],
    // [
    //   require.resolve("docusaurus-lunr-search"),
    //   {
    //     enableHighlight: true,
    //     languages: ['en', 'ja'], // language codes
    //     includeRoutes: ['/docs/latest/**', '/ja-jp/docs/latest/**'],
    //   },
    // ],
  ],
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'ignore',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      // Replace with your project's social card
      image: 'img/scalardl-social-card-preview.png',
      navbar: {
        title: '',
        logo: {
          alt: 'ScalarDL logo',
          src: 'img/scalardl-logo-02.png',
          href: '/docs/latest/',
          target: '_self',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'left',
            dropdownActiveClassDisabled: true,
          },
          {
            href: 'https://developers.scalar-labs.com/docs/',
            position: 'right',
            label: 'Scalar Docs Home',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          // Custom notification function as a React component. Update the notification messages in the /src/data/notifications.js file.
          {
            type: 'custom-NotificationBell',
            position: 'right',
            notifications: getNotifications(),
          },
          {
            href: 'https://github.com/scalar-labs/scalardl',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'CY5H1F29T8',

        // Public API key: it is safe to commit it
        apiKey: 'fe68b2de652056b08dcdf6439691141b',

        indexName: 'scalardl-scalar-labs',

        // Optional: see doc section below
        contextualSearch: true,

        insights: true,

        translations: {
          button: {
            buttonText: 'Algolia',
            buttonAriaLabel: 'Search docs with Algolia',
          },
        },

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: '/docs/', // or as RegExp: /\/docs\//
        //   to: '/',
        // },

        // Optional: Algolia search parameters
        // searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        //... other Algolia params
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Products',
            items: [
              {
                label: 'ScalarDB',
                href: 'https://www.scalar-labs.com/scalardb',
              },
              {
                label: 'ScalarDL',
                href: 'https://www.scalar-labs.com/scalardl',
              },
            ],
          },
          {
            title: 'Company',
            items: [
              {
                label: 'About us',
                href: 'https://www.scalar-labs.com/about-us',
              },
              {
                label: 'News',
                href: 'https://www.scalar-labs.com/news',
              },
              {
                label: 'Scalar Engineering Blog',
                href: 'https://medium.com/scalar-engineering',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/scalar-labs',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/scalarlabs',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/@scalar-labs',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/scalar_labs',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Pricing',
                href: 'https://www.scalar-labs.com/pricing',
              },
              {
                label: 'Docs',
                href: 'https://developers.scalar-labs.com/docs',
              },
              {
                label: 'Support',
                href: 'https://www.scalar-labs.com/support',
              },
              {
                label: 'Contact us',
                href: 'https://www.scalar-labs.com/contact',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Scalar, Inc.`,
      },
      mermaid: {
        theme: {
          light: 'base',
          dark: 'base',
        },
        options: {
          themeVariables: {
            primaryColor: '#D5EAFF',
            primaryTextColor: '#3D4144',
            primaryBorderColor: '#2673BB',
            lineColor: '#3D4144',
            secondaryColor: '#D5EAFF',
            tertiaryColor: '#D5EAFF',
          },
        },
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['csharp', 'docker', 'gradle', 'java', 'json', 'log', 'properties', 'python', 'scala', 'shell-session', 'sql', 'toml'],
      },
      announcementBar: {
        id: 'new_version',
        content:
          'Announcing the release of ScalarDL 3.14!🚀 For details on what\'s included in this new version, see the <a target="_self" href="/docs/latest/releases/release-notes?utm_source=docs-site&utm_medium=announcementbar">release notes</a>.',
          // and <a target="_blank" href="https://medium.com/scalar-engineering/scalardl-3-13-has-been-released-a790a3b8a065?utm_source=docs-site&utm_medium=announcementbar">blog post</a>.',
        backgroundColor: '#2673BB',
        textColor: '#FFFFFF',
        isCloseable: false,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      zoom: {
        selector: '.markdown :not(em) > img:not(.youtube-embed img)',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        },
        config: {
          // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        }
      },
    }),
};

export default config;

// ─────────────────────────────────────────────────────────────────────────────
// Redirect helpers — referenced in the config above via function hoisting.
// ─────────────────────────────────────────────────────────────────────────────

// Cached so the per-page createRedirects() calls don't re-read versions.json each time.
// Must be var (not let/const) — getRetiredVersions() is called during config object
// initialization via hoisting, before a let/const declaration here would be initialized.
var _retiredVersions;

// Returns retired version strings derived from versions.json.
function getRetiredVersions() {
  if (_retiredVersions) return _retiredVersions;
  const active = JSON.parse(fs.readFileSync('./versions.json', 'utf8'));
  if (active.length === 0) return (_retiredVersions = []);
  const oldest = Math.min(...active.map(v => parseInt(v.split('.')[1])));
  // 4 = minor version of the oldest version ever retired (3.4); update if the floor changes.
  return (_retiredVersions = Array.from({ length: oldest - 4 }, (_, i) => `3.${oldest - 1 - i}`));
}

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

// Generates redirects to /docs/latest/ for pages that exist in versioned docs but not in
// latest, so bots and crawlers don't land on a 404 when following cached old-version URLs.
// Returns the plugin-client-redirects configuration object. Defining the static
// redirects here (rather than inline in the config above) lets the exclusion set
// for buildRemovedPageRedirects be derived automatically from the same array,
// avoiding two lists that must be kept in sync.
function buildRedirectsConfig() {
  const staticRedirects = [
    // This redirect takes the user to the latest version of the English docs when they land on the English versions of the docs site.
    {
      to: '/docs/latest/',
      from: ['/', '/docs'],
    },
    {
      to: '/docs/latest/releases/release-support-policy',
      from: '/docs/releases/release-support-policy',
    },
  ];
  const existingFromPaths = new Set(
    staticRedirects.flatMap(r => (Array.isArray(r.from) ? r.from : [r.from]))
  );
  return {
    redirects: [
      ...staticRedirects,
      // Redirects pages removed from latest to the homepage so bots with cached old URLs
      // don't land on a 404.
      ...buildRemovedPageRedirects(existingFromPaths),
    ],
    createRedirects(existingPath) {
      const redirects = [];
      if (existingPath.includes('/ja-jp/docs')) {
        // Redirect from /docs/ja-jp/X to /ja-jp/docs/X.
        redirects.push(existingPath.replace('/ja-jp/docs', '/docs/ja-jp'));
      }
      if (existingPath.startsWith('/docs/latest/')) {
        // Redirect from /docs/<OLD_VERSION>/X to /docs/latest/X for versions
        // that are no longer built (derived from versions.json by getRetiredVersions).
        for (const version of getRetiredVersions()) {
          redirects.push(existingPath.replace('/docs/latest/', `/docs/${version}/`));
        }
      }
      return redirects.length ? redirects : undefined;
    },
  };
}

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
    // maxBuffer raised from the 1MB default; large repos exceed it, causing a silent ENOBUFS failure that produces no redirects.
    const gitOutput = execFileSync(
      'git', ['log', '--diff-filter=D', '--name-only', '--format=', '--', 'versioned_docs/'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 10 * 1024 * 1024 }
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
  } catch (err) {
    // Swallow ENOBUFS (repo history too large), ENOENT (git not available), and shallow-clone
    // failures. Warn on anything else so unexpected errors don't vanish silently.
    if (err.code !== 'ENOBUFS' && err.code !== 'ENOENT' && !String(err.message).includes('ENOBUFS')) {
      console.warn('[buildRemovedPageRedirects] Unexpected git error:', err.message);
    }
  }

  const activeVersions = versionedDirs.map(({ version }) => version);
  const redirects = [];
  for (const [p, versionsWithPage] of pathToActiveVersions) {
    // Redirect every version (and /latest) that does NOT have the page to /docs/latest/.
    // Use a Set to deduplicate versions that appear in both RETIRED_VERSIONS and activeVersions.
    const versionsNeedingRedirect = new Set([
      'latest',
      ...getRetiredVersions(),
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
