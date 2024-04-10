// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
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
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'versioned_docs/en-us',
      },
      ja: {
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
          breadcrumbs: false,
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.

          /*
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          */
          lastVersion: 'current',
            versions: {
              // The following is a template for adding a new version to the dropdown menu. Copy this version template when adding a new version to the dropdown menu but don't delete it.
              /*
              current: {
                label: '<VERSION_NUMBER>',
                path: 'latest',
                banner: 'none',
              },
              */
              current: {
                label: '3.9',
                path: 'latest',
                banner: 'none',
              },
              3.8: { // Change this to the version number when a new version is released.
                label: '3.8',
                path: '3.8', // Change this to the version number when a new version is released.
                banner: 'none',
              },
              3.7: {
                label: '3.7',
                path: '3.7',
                banner: 'none',
              },
              3.6: {
                label: '3.6',
                path: '3.6',
                banner: 'none',
              },
              3.5: {
                label: '3.5 (unsupported)',
                path: '3.5',
                banner: 'unmaintained',
              },
              3.4: {
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
            to: '/docs/latest',
            from: ['/', '/docs'],
          },
          // This redirect takes the user to the latest version of the Japanese docs when they land on the Japanese version of the docs site.
          // {
          //   to: '/ja/docs/latest',
          //   from: ['/ja', '/ja/docs'],
          // },
        ],
      },
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/scalardl-logo.png',
      navbar: {
        title: '',
        logo: {
          alt: 'ScalarDL logo',
          src: 'img/scalardl-logo.png',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'left',
            dropdownItemsAfter: [
              {
                type: 'html',
                value: '<hr class="dropdown-separator">',
              },
              {
                to: '/release-support-policy',
                label: 'Release Support Policy'
              }
            ],
            dropdownActiveClassDisabled: true,
          },
          {
            type: 'localeDropdown',
            position: 'right',
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
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/scalar-labs/scalardl',
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
                label: 'Scalar Engineering Blog',
                href: 'https://medium.com/scalar-engineering',
              },
              {
                label: 'Pricing',
                href: 'https://medium.com/scalar-engineering',
              },
              {
                label: 'Support',
                href: 'https://medium.com/scalar-engineering',
              },
              {
                label: 'Contact us',
                href: 'https://medium.com/scalar-engineering',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Scalar, Inc.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
