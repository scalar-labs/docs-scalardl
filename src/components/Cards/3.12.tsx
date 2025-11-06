/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

const recentFeatures = [
  {
    name: 'Recent features',
    categoryLinks: [
      // Links should be to docs about features that have been introduced in this version or the previous version.
      // To add a link, use the format ['link1', 'link2']. Links should be relative to the docs directory and not be anchor links.
      // To add a label, use the format ['label1', 'label2'].
      {
        cell: 0, // First cell
        links: ['getting-started-hashstore'],
        labels: ['Use ScalarDL HashStore Abstraction']
      },
      {
        cell: 1, // Second cell
        links: ['getting-started-tablestore'],
        labels: ['Use ScalarDL TableStore Abstraction']
      },
      {
        cell: 2, // Third cell
        links: ['sql-grammar'],
        labels: ['ScalarDL TableStore SQL Grammar']
      }
    ]
  }
];

const categories = [
  {
    name: 'About ScalarDL',
    categoryLinks: [
      // To add a link, use the format ['link1', 'link2']
      // To add a label, use the format ['label1', 'label2']
      {
        cell: 0, // First cell
        links: ['overview'],
        labels: ['ScalarDL Overview']
      },
      {
        cell: 1, // Second cell
        links: ['design'],
        labels: ['Design']
      },
      {
        cell: 2, // Third cell
        links: ['requirements'],
        labels: ['Requirements']
      }
    ]
  },
  {
    name: 'Quickstart',
    categoryLinks: [
      // To add a link, use the format ['link1', 'link2']
      // To add a label, use the format ['label1', 'label2']
      {
        cell: 0, // First cell
        links: ['quickstart-overview'],
        labels: ['Quickstart Overview']
      },
      {
        cell: 1, // Second cell
        links: ['getting-started-hashstore'],
        labels: ['Use ScalarDL HashStore Abstraction']
      },
      {
        cell: 2, // Third cell
        links: ['getting-started-tablestore'],
        labels: ['Use ScalarDL TableStore Abstraction']
      }
    ]
  },
  {
    name: 'Develop',
    categoryLinks: [
      // To add a link, use the format ['link1', 'link2']
      // To add a label, use the format ['label1', 'label2']
      {
        cell: 0, // First cell
        links: ['develop-overview'],
        labels: ['Develop Overview']
      },
      {
        cell: 1, // Second cell
        links: ['data-modeling'],
        labels: ['Model Your Data']
      },
      {
        cell: 2, // Third cell
        links: ['how-to-write-applications'],
        labels: ['Write a ScalarDL Application with Ledger Abstraction']
      }
    ]
  },
  {
    name: 'Deploy',
    categoryLinks: [
      // To add a link, use the format ['link1', 'link2']
      // To add a label, use the format ['label1', 'label2']
      {
        cell: 0, // First cell
        links: ['deploy-overview'],
        labels: ['Deploy Overview']
      },
      {
        cell: 1, // Second cell
        links: ['helm-charts/getting-started-scalardl-auditor'],
        labels: ['Deploy ScalarDL Ledger and Auditor Locally by Using Helm Chart']
      },
      {
        cell: 2, // Third cell
        links: ['scalar-kubernetes/ManualDeploymentGuideScalarDLAuditorOnEKS'],
        labels: ['Deploy ScalarDL Ledger and Auditor on Amazon EKS']
      }
    ]
  },
  {
    name: 'Manage',
    categoryLinks: [
      // To add a link, use the format ['link1', 'link2']
      // To add a label, use the format ['label1', 'label2']
      {
        cell: 0, // First cell
        links: ['manage-overview'],
        labels: ['Manage Overview']
      },
      {
        cell: 1, // Second cell
        links: ['scalar-kubernetes/HowToScaleScalarDL'],
        labels: ['Scale ScalarDL']
      },
      {
        cell: 2, // Third cell
        links: ['scalar-kubernetes/HowToUpgradeScalarDL'],
        labels: ['Upgrade ScalarDL']
      }
    ]
  }
];

const CategoryGrid = () => {
  return (
    <div className="grid-container">
      {/* Hero section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>ScalarDL</h1>
          <p>ScalarDL is middleware for realizing a tamper-evident database system by detecting arbitrary faults (that is, Byzantine faults), such as data tampering and malicious attacks, in transactional database systems. It achieves such detection in a scalable and practical way like no other with its novel consensus algorithm.</p>
          {/* <span className="hero-text-additional">
            <p>PLACEHOLDER TEXT</p>
          </span> */}
        </div>
        <div className="youtube-embed">
          <a href="https://speakerdeck.com/scalar/scalar-dl-technical-overview" target="_blank">
            <img src="/img/scalardl-presentation-overview.png" title="ScalarDL presentation overview" />
          </a>
        </div>
      </div>

      {/* Recent features table */}
      <div className="category-table">
        {recentFeatures.map((doc, i) => (
          <React.Fragment key={i}>
            <div className="category-label">
              {/* <FontAwesomeIcon icon={faBook} className="recent-features-icon" />
              &nbsp;{doc.name}*/}
              {doc.name}
            </div>
            {doc.categoryLinks.map((categoryLinkCell, j) => (
              <div key={j} className="category-cell-multiple-links">
                {categoryLinkCell.links.map((cellLink, k) => (
                  cellLink ? (
                    <Link key={`${j}-${k}`} className="category-cell-link" to={cellLink}>
                      {categoryLinkCell.labels[k]}
                    </Link>
                  ) : (
                    <span key={`${j}-${k}`} className="recent-features-cell">
                      {categoryLinkCell.labels[k]}
                    </span>
                  )
                ))}
              </div>
            ))}
          </React.Fragment>
        ))}

      {/* Category table */}
        {categories.map((cat, i) => (
          <React.Fragment key={i}>
            <div className="category-label">{cat.name}</div>
            {cat.categoryLinks.map((categoryLinkCell, j) => (
              <div key={j} className="category-cell-multiple-links">
                {categoryLinkCell.links.map((cellLink, k) => (
                  cellLink ? (
                    <Link key={`${j}-${k}`} className="category-cell-link" to={cellLink}>
                      {categoryLinkCell.labels[k]}
                    </Link>
                  ) : (
                    <span key={`${j}-${k}`} className="category-cell">
                      {categoryLinkCell.labels[k]}
                    </span>
                  )
                ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
