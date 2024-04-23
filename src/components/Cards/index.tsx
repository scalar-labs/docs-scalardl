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

const Cards = [
  {
    name: 'For self-starters',
    // image: '<LINK_TO>.png',
    url: {
      page: 'overview',
    },
    description: (
      <Translate id="engineers.selfStarters.description">
        Learn about what ScalarDL is and its use cases
      </Translate>
    ),
  },
  {
    name: 'For developers',
    // image: '<LINK_TO>.png',
    url: {
      page: 'getting-started',
    },
    description: (
      <Translate id="engineers.developers.description">
        Check out the ScalarDL getting started guide
      </Translate>
    ),
  },
  {
    name: 'For infrastructure engineers',
    // image: '<LINK_TO>.png',
    url: {
      page: 'scalar-kubernetes/ProductionChecklistForScalarDLLedger',
    },
    description: (
      <Translate id="engineers.infrastructure.description">
        See the production checklist for ScalarDL Ledger
      </Translate>
    ),
  },
  {
    name: 'For database engineers',
    // image: '<LINK_TO>.png',
    url: {
      page: 'scalar-kubernetes/SetupDatabaseForAWS',
    },
    description: (
      <Translate id="engineers.database.description">
        Read the guide for how to set up databases for AWS
      </Translate>
    ),
  },
];

interface Props {
  name: string;
  // image: string;
  url: {
    page?: string;
  };
  description: JSX.Element;
}

function Card({ name, /* image,*/ url, description }: Props) {
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
            <h3>{name}</h3>
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

export function CardRow(): JSX.Element {
  return (
    <div className="row">
      {Cards.map((special) => (
        <Card key={special.name} {...special} />
      ))}
    </div>
  );
}
