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

const CardsAbout = [
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'overview',
    },
    description: (
      <Translate id="home.about.description">
        Overview
      </Translate>
    ),
  },
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'implementation',
    },
    description: (
      <Translate id="home.about.description">
        Implementation
      </Translate>
    ),
  },
]

const CardsGettingStarted = [
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'getting-started',
    },
    description: (
      <Translate id="home.gettingStarted.description">
        Getting started with ScalarDL
      </Translate>
    ),
  },
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'getting-started-auditor',
    },
    description: (
      <Translate id="home.gettingStarted.description">
        Getting started with ScalarDL Auditor
      </Translate>
    ),
  },
]

const CardsSamples = [
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'applications/simple-bank-account',
    },
    description: (
      <Translate id="home.samples.description">
        Bank account application
      </Translate>
    ),
  },
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'applications/escrow-payment',
    },
    description: (
      <Translate id="home.samples.description">
        Escrow payment CLI
      </Translate>
    ),
  },
]

const CardsDevelop = [
  {
    // name: 'For database engineers',
    // image: '<LINK_TO>.png',
    url: {
      page: 'schema-loader',
    },
    description: (
      <Translate id="home.develop.description">
        Load a database schema
      </Translate>
    ),
  },
  {
    // name: 'For infrastructure engineers',
    // image: '<LINK_TO>.png',
    url: {
      page: 'ca/caclient-getting-started',
    },
    description: (
      <Translate id="home.develop.description">
        Get a certificate for the network
      </Translate>
    ),
  },
]

const CardsDeploy = [
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'scalar-kubernetes/SetupDatabaseForAWS',
    },
    description: (
      <Translate id="home.deploy.description">
        Set up a database for ScalarDL on AWS
      </Translate>
    ),
  },
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'scalar-kubernetes/ProductionChecklistForScalarDLLedger',
    },
    description: (
      <Translate id="home.deploy.description">
        See the ScalarDL Ledger production checklist
      </Translate>
    ),
  },
]

const CardsManage = [
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'scalar-kubernetes/K8sMonitorGuide',
    },
    description: (
      <Translate id="home.manage.description">
        Monitor ScalarDL in a Kubernetes cluster
      </Translate>
    ),
  },
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'scalar-kubernetes/BackupRestoreGuide',
    },
    description: (
      <Translate id="home.manage.description">
        Back up and restore in a Kubernetes environment
      </Translate>
    ),
  },
]

const CardsReference = [
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'compatibility',
    },
    description: (
      <Translate id="home.reference.description">
        Compatibility matrix
      </Translate>
    ),
  },
  {
    // name: '',
    // image: '<LINK_TO>.png',
    url: {
      page: 'scalardl-benchmarks',
    },
    description: (
      <Translate id="home.reference.description">
        Benchmarking tools
      </Translate>
    ),
  },
];

interface Props {
  // name: string;
  // image: string;
  url: {
    page?: string;
  };
  description: JSX.Element;
}

function Card({ /* name, image,*/ url, description }: Props) {
  return (
    <div className="col col--6 margin-bottom--lg">
      <div className={clsx('card')}>
        <div className={clsx('card__image')}>
          {/* <Link to={url.page}>
            <img src={image}></img>}
          </Link> */}
        </div>
        <Link to={url.page}>
          <div className="card__body">
            {/* <h3>{name}</h3> */}
            <p>{description}</p>
          </div>
        </Link>
        {/* <div className="card__footer">
          <div className="button-group button-group--block">
            <Link className="button button--secondary" to={url.page}>
              <Translate id="button.readMore">Read more</Translate>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export function CardRowAbout(): JSX.Element {
  return (
    <div className="row">
      {CardsAbout.map((special) => (
        <Card key={special.name} {...special} />
      ))}
    </div>
  );
}

export function CardRowGettingStarted(): JSX.Element {
  return (
    <div className="row">
      {CardsGettingStarted.map((special) => (
        <Card key={special.name} {...special} />
      ))}
    </div>
  );
}

export function CardRowSamples(): JSX.Element {
  return (
    <div className="row">
      {CardsSamples.map((special) => (
        <Card key={special.name} {...special} />
      ))}
    </div>
  );
}

export function CardRowDevelop(): JSX.Element {
  return (
    <div className="row">
      {CardsDevelop.map((special) => (
        <Card key={special.name} {...special} />
      ))}
    </div>
  );
}

export function CardRowDeploy(): JSX.Element {
  return (
    <div className="row">
      {CardsDeploy.map((special) => (
        <Card key={special.name} {...special} />
      ))}
    </div>
  );
}

export function CardRowManage(): JSX.Element {
  return (
    <div className="row">
      {CardsManage.map((special) => (
        <Card key={special.name} {...special} />
      ))}
    </div>
  );
}
export function CardRowReference(): JSX.Element {
  return (
    <div className="row">
      {CardsReference.map((special) => (
        <Card key={special.name} {...special} />
      ))}
    </div>
  );
}
