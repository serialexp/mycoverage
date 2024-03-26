import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_playful_cat.svg').default,
    description: (
      <>
        mycoverage was designed from the ground up to be as easy to use as possible (given the feature set).
      </>
    ),
  },
  {
    title: 'Do things on the server',
    Svg: require('@site/static/img/undraw_server_cluster.svg').default,
    description: (
      <>
        The only thing you should need to do in your workflow is upload coverage files. Everything else is handled by the server.
      </>
    ),
  },
  {
    title: 'Report back',
    Svg: require('@site/static/img/undraw_data_report.svg').default,
    description: (
      <>
        All the important information will be reported back on your pull requests, so you don't have to break out ot mycoverage unless things go wrong.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
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

export default function HomepageFeatures(): JSX.Element {
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
