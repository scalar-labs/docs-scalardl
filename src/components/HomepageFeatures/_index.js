/* 
This file is currently not being used. If we want to use it in the future, remove the underline from the beginning of the file name and fix the error that occurs when trying to build the site.
*/
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    // Svg: require('@site/static/img/image.svg').default,
    title: 'Tamper evident',
    description: (
      <>
        Make your data tamper evident.
      </>
    ),
  },
  {
    // Svg: require('@site/static/img/image.svg').default,
    title: 'Easy to use',
    description: (
      <>
        Deploy and use without difficulty.
      </>
    ),
  },
  {
    // Svg: require('@site/static/img/image.svg').default,
    title: 'Scalable',
    description: (
      <>
        Linearly scale performance and availability.
      </>
    ),
  },
  {
    // Svg: require('@site/static/img/image.svg').default,
    title: 'Database agnostic',
    description: (
      <>
        No dependency on particular database products.
      </>
    ),
  },
  {
    // Svg: require('@site/static/img/image.svg').default,
    title: 'Correctness',
    description: (
      <>
        Ensure that your data is always correctly managed with ACID.
      </>
    ),
  },
  {
    // Svg: require('@site/static/img/image.svg').default,
    title: 'Cloud agnostic',
    description: (
      <>
        No dependency on a particular cloud service provider
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
