/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  /* tutorialSidebar: [{type: 'autogenerated', dirName: '.'}], */

  // But you can create a sidebar manually

  docs: [
    {
      type: 'doc',
      label: 'ScalarDL Docs Home',
      id: 'index',
    },
    {
      'type': 'category',
      'label': 'About ScalarDL',
      'collapsible': true,
      'items': [
        'overview',
        'design',
        'implementation',
        'glossary',
        'requirements',
        'roadmap',
      ]
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: true,
      items: [
        'getting-started',
        'getting-started-auditor',
      ],
    },
    {
      type: 'category',
      label: 'Samples',
      collapsible: true,
      items: [
        'applications/simple-bank-account/README',
      ],
    },
    {
      type: 'category',
      label: 'Develop',
      collapsible: true,
      items: [
        {
          type: 'category',
          label: 'SDKs',
          collapsible: true,
          items: [
            'scalardl-java-client-sdk/README',
          ],
        },
        'configurations',
        'schema-loader',
        'ca/caclient-getting-started',
        'authentication',
        'how-to-handle-errors',
        'how-to-write-contract',
        'how-to-write-function',
        'use-generic-contracts',
        'how-to-use-proof',
      ],
    },
    {
      type: 'category',
      label: 'Deploy',
      collapsible: true,
      items: [
        {
          type: 'category',
          label: 'Scalar Kubernetes',
          collapsible: true,
          items: [
            {
              type: 'category',
              label: 'Database Setup Guides',
              collapsible: true,
              items: [
                'scalar-kubernetes/SetupDatabaseForAWS',
                'scalar-kubernetes/SetupDatabaseForAzure',
              ],
            },
            {
              type: 'category',
              label: 'Installation Guides',
              collapsible: true,
              items: [
                'scalar-kubernetes/ProductionChecklistForScalarDLLedger',
                'scalar-kubernetes/ProductionChecklistForScalarDLAuditor',
                'scalar-kubernetes/AwsMarketplaceGuide',
                'scalar-kubernetes/AzureMarketplaceGuide',
                'scalar-kubernetes/CreateBastionServer',
              ],
            },
            {
              type: 'category',
              label: 'Cluster Guides',
              collapsible: true,
              items: [
                'scalar-kubernetes/CreateEKSClusterForScalarDL',
                'scalar-kubernetes/CreateEKSClusterForScalarDLAuditor',
                'scalar-kubernetes/CreateAKSClusterForScalarDL',
                'scalar-kubernetes/CreateAKSClusterForScalarDLAuditor',
              ],
            },
            {
              type: 'category',
              label: 'Container Image Guides',
              collapsible: true,
              items: [
                'scalar-kubernetes/HowToGetContainerImages',
                'scalar-kubernetes/HowToUseContainerImages',
              ],
            },
            {
              type: 'category',
              label: 'Deployment Guides',
              collapsible: true,
              items: [
                'scalar-kubernetes/ManualDeploymentGuideScalarDLOnEKS',
                'scalar-kubernetes/ManualDeploymentGuideScalarDLAuditorOnEKS',
                'scalar-kubernetes/ManualDeploymentGuideScalarDLOnAKS',
                'scalar-kubernetes/ManualDeploymentGuideScalarDLAuditorOnAKS',
              ],
            },
            {
              type: 'category',
              label: 'Configuration Guides',
              collapsible: true,
              items: [
                'scalar-kubernetes/AccessScalarProducts',
                'scalar-kubernetes/HowToCreateKeyAndCertificateFiles',
                'scalar-kubernetes/NetworkPeeringForScalarDLAuditor',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Scalar Helm Charts',
          collapsible: true,
          items: [
            {
              type: 'category',
              label: 'Getting Started',
              collapsible: true,
              items: [
                'helm-charts/getting-started-scalar-helm-charts',
                'helm-charts/getting-started-scalardl-ledger',
                'helm-charts/getting-started-scalardl-auditor',
                'helm-charts/getting-started-scalardl-auditor-tls',
                'helm-charts/getting-started-scalardl-auditor-tls-cert-manager',
                'helm-charts/getting-started-monitoring',
                'helm-charts/getting-started-logging',
                'helm-charts/getting-started-scalar-manager',
              ]
            },
            {
              type: 'category',
              label: 'Configure custom values',
              collapsible: true,
              items: [
                'helm-charts/configure-custom-values-scalardl-ledger',
                'helm-charts/configure-custom-values-scalardl-auditor',
                'helm-charts/configure-custom-values-scalardl-schema-loader',
                'helm-charts/configure-custom-values-scalar-admin-for-kubernetes',
                'helm-charts/configure-custom-values-scalar-manager',
                'helm-charts/configure-custom-values-envoy',
              ],
            },
            'helm-charts/how-to-deploy-scalar-products',
            'helm-charts/how-to-deploy-scalardl-ledger',
            'helm-charts/how-to-deploy-scalardl-auditor',
            'helm-charts/how-to-deploy-scalar-admin-for-kubernetes',
            'helm-charts/mount-files-or-volumes-on-scalar-pods',
            'helm-charts/use-secret-for-credentials',
          ],
        },
        'scalar-licensing/README',
        'installation-with-docker',
        'ca/caserver-getting-started',
      ],
    },
    {
      type: 'category',
      label: 'Manage',
      collapsible: true,
      items: [
        {
          type: 'category',
          label: 'Scalar Kubernetes',
          collapsible: true,
          items: [
            {
              type: 'category',
              label: 'Monitoring Guides',
              collapsible: true,
              items: [
                {
                  type: 'category',
                  label: 'Alerts',
                  collapsible: true,
                  items: [
                    'scalar-kubernetes/alerts/Envoy',
                    'scalar-kubernetes/alerts/Ledger',
                  ],
                },
                'scalar-kubernetes/K8sMonitorGuide',
                'scalar-kubernetes/K8sLogCollectionGuide',
              ],
            },
            {
              type: 'category',
              label: 'Backup and Restore Guides',
              collapsible: true,
              items: [
                'scalar-kubernetes/BackupRestoreGuide',
                'scalar-kubernetes/BackupRDB',
                'scalar-kubernetes/BackupNoSQL',
                'scalar-kubernetes/RestoreDatabase',
                'scalar-kubernetes/RegularCheck',
              ],
            },
          ],
        },
        'backup-restore',
        'scalar-kubernetes/HowToScaleScalarDL',
        'scalar-kubernetes/HowToUpgradeScalarDL',
        'scalar-manager/overview',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsible: true,
      items: [
        'compatibility',
        'scalardl-command-reference',
        'generic-contracts-reference',
        'scalardl-benchmarks/README',
        {
          type: 'category',
          label: 'Error codes',
          collapsible: true,
          items: [
            'scalardl-auditor-status-codes',
            'scalardl-client-status-codes',
            'scalardl-common-status-codes',
            'scalardl-ledger-status-codes',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Releases',
      collapsible: true,
      items: [
        'releases/release-notes',
        'releases/release-support-policy',
      ],
    },
  ],
};

export default sidebars;
