// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import { getNotifications } from './src/data/notifications';

const config = {
  title: 'ScalarDL Documentation',
  tagline: 'Scalable and practical byzantine-fault detection middleware for transactional database systems',
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
  onBrokenMarkdownLinks: 'ignore',
  onBrokenAnchors: 'ignore',

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
                label: '3.11',
                path: 'latest', // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                banner: 'none',
                className: '3.11.0',
              },
              "3.10": {
                label: '3.10',
                path: '3.10',
                banner: 'none',
                className: '3.10.2',
              },
              "3.9": {
                label: '3.9',
                path: '3.9',
                banner: 'none',
                className: '3.9.6',
              },
              "3.8": {
                label: '3.8',
                path: '3.8',
                banner: 'none',
                className: '3.8.5',
              },
              "3.7": {
                label: '3.7 (unsupported)',
                path: '3.7',
                banner: 'unmaintained',
              },
              "3.6": {
                label: '3.6 (unsupported)',
                path: '3.6',
                banner: 'unmaintained',
              },
              "3.5": {
                label: '3.5 (unsupported)',
                path: '3.5',
                banner: 'unmaintained',
              },
              "3.4": {
                label: '3.4 (unsupported)',
                path: '3.4',
                banner: 'unmaintained',
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

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // This redirect takes the user to the latest version of the English docs when they land on the English versions of the docs site.
          {
            to: '/docs/latest/',
            from: ['/', '/docs'],
          },
          {
            to: '/docs/latest/releases/release-support-policy',
            from: '/docs/releases/release-support-policy',
          },
          {
            to: '/docs/latest/helm-charts/getting-started-scalar-manager',
            from: '/docs/latest/helm-charts/how-to-deploy-scalar-manager',
          },
          {
            to: '/docs/3.8/helm-charts/getting-started-scalar-manager',
            from: '/docs/3.8/helm-charts/how-to-deploy-scalar-manager',
          },
        ],
        createRedirects(existingPath) {
          if (existingPath.includes('/ja-jp/docs')) {
            // Redirect from /docs/ja-jp/X to /ja-jp/docs/X.
            return [
              existingPath.replace('/ja-jp/docs', '/docs/ja-jp'),
            ];
          }
          return undefined; // Return a falsy value: no redirect created
        },
      },
    ],
    require.resolve('docusaurus-plugin-image-zoom'),
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
          src: 'img/scalardl-logo.png',
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
          'Announcing the release of ScalarDL 3.11!🚀 For details on what\'s included in this new version, see the <a target="_self" href="/docs/latest/releases/release-notes?utm_source=docs-site&utm_medium=announcementbar">release notes</a>.',
          // '<b>Announcing the release of ScalarDL X.X!🚀 For details on what\'s included in this new version, see the <a target="_self" href="/docs/latest/releases/release-notes?utm_source=docs-site&utm_medium=announcementbar">release notes</a>.</b>',
        backgroundColor: '#2673BB',
        textColor: '#FFFFFF',
        isCloseable: false,
      },
      zoom: {
        selector: '.markdown :not(em) > img',
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
