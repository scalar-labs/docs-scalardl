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
    name: '最近の機能',
    categoryLinks: [
      // Links should be to docs about features that have been introduced in this version or the previous version.
      // To add a link, use the format ['link1', 'link2']. Links should be relative to the docs directory and not be anchor links.
      // To add a label, use the format ['label1', 'label2'].
      {
        cell: 0, // First cell
        links: ['getting-started-hashstore'],
        labels: ['ScalarDL HashStore を使用']
      },
      {
        cell: 1, // Second cell
        links: ['getting-started-tablestore'],
        labels: ['ScalarDL TableStore を使用']
      },
      {
        cell: 2, // Third cell
        links: ['sql-grammar'],
        labels: ['ScalarDL TableStore SQL 文法']
      }
    ]
  }
];

const categories = [
  {
    name: 'ScalarDL について',
    categoryLinks: [
      // To add a link, use the format ['link1', 'link2']
      // To add a label, use the format ['label1', 'label2']
      {
        cell: 0, // First cell
        links: ['overview'],
        labels: ['ScalarDL の概要']
      },
      {
        cell: 1, // Second cell
        links: ['design'],
        labels: ['設計']
      },
      {
        cell: 2, // Third cell
        links: ['requirements'],
        labels: ['要件']
      }
    ]
  },
  {
    name: 'クイックスタート',
    categoryLinks: [
      // To add a link, use the format ['link1', 'link2']
      // To add a label, use the format ['label1', 'label2']
      {
        cell: 0, // First cell
        links: ['quickstart-overview'],
        labels: ['クイックスタートの概要']
      },
      {
        cell: 1, // Second cell
        links: ['getting-started'],
        labels: ['ScalarDL Ledger をはじめよう']
      },
      {
        cell: 2, // Third cell
        links: [''],
        labels: ['']
      }
    ]
  },
  {
    name: '開発',
    categoryLinks: [
      // To add a link, use the format ['link1', 'link2']
      // To add a label, use the format ['label1', 'label2']
      {
        cell: 0, // First cell
        links: ['develop-overview'],
        labels: ['開発の概要']
      },
      {
        cell: 1, // Second cell
        links: ['data-modeling'],
        labels: ['データをモデル化する']
      },
      {
        cell: 2, // Third cell
        links: ['how-to-write-applications'],
        labels: ['Java で ScalarDL アプリケーションを書く']
      }
    ]
  },
  {
    name: 'デプロイ',
    categoryLinks: [
      // To add a link, use the format ['link1', 'link2']
      // To add a label, use the format ['label1', 'label2']
      {
        cell: 0, // First cell
        links: ['deploy-overview'],
        labels: ['デプロイの概要']
      },
      {
        cell: 1, // Second cell
        links: ['helm-charts/getting-started-scalardl-auditor'],
        labels: ['Helm Charts を使用してローカルに ScalarDL Ledger と Auditor をデプロイする']
            },
            {
        cell: 2, // Third cell
        links: ['scalar-kubernetes/ManualDeploymentGuideScalarDLAuditorOnEKS'],
        labels: ['ScalarDL Ledger と ScalarDL Auditor を Amazon Elastic Kubernetes Service (EKS) にデプロイする']
      }
    ]
  },
  {
    name: '管理',
    categoryLinks: [
      // To add a link, use the format ['link1', 'link2']
      // To add a label, use the format ['label1', 'label2']
      {
        cell: 0, // First cell
        links: ['manage-overview'],
        labels: ['管理の概要']
      },
      {
        cell: 1, // Second cell
        links: ['scalar-kubernetes/HowToScaleScalarDL'],
        labels: ['ScalarDL をスケーリングする方法']
      },
      {
        cell: 2, // Third cell
        links: ['scalar-kubernetes/HowToUpgradeScalarDL'],
        labels: ['ScalarDL のアップグレード方法']
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
          <p>ScalarDL は、トランザクション型データベースシステムにおけるデータ改ざんや悪意のある攻撃などの任意の障害（ビザンチン故障）を検出することで、改ざん検知型データベースシステムを実現するミドルウェアです。独自のコンセンサスアルゴリズムにより、他に類を見ないスケーラブルかつ実用的な方法で障害検出を可能にします。</p>
          {/* <span className="hero-text-additional">
            <p>PLACEHOLDER TEXT</p>
          </span> */}
        </div>
        <div className="youtube-embed">
          <a href="https://speakerdeck.com/scalar/scalar-dl-technical-overview" target="_blank">
            <img src="/img/scalardl-presentation-overview.png" title="ScalarDL プレゼンテーション概要" />
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
