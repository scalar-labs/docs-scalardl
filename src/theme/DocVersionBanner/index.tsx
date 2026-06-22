import React, {type ComponentType, type ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {
  useActivePlugin,
  useActiveVersion,
  useDocVersionSuggestions,
  type GlobalVersion,
} from '@docusaurus/plugin-content-docs/client';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {
  useDocsPreferredVersion,
  useDocsVersion,
} from '@docusaurus/plugin-content-docs/client';
import type {Props} from '@theme/DocVersionBanner';
import type {
  VersionBanner,
  PropVersionMetadata,
} from '@docusaurus/plugin-content-docs';

type BannerLabelComponentProps = {
  siteTitle: string;
  versionMetadata: PropVersionMetadata;
  releaseSupportPolicyDocPath: string;
};

function UnreleasedVersionLabel({
  siteTitle,
  versionMetadata,
  releaseSupportPolicyDocPath,
}: BannerLabelComponentProps) {
  return (
    <Translate
      id="theme.docs.versions.unreleasedVersionLabel"
      description="The label used to tell the user that he's browsing an unreleased doc version"
      values={{
        siteTitle,
        versionLabel: <b>{versionMetadata.label}</b>,
      }}>
      {
        'This is unreleased documentation for ScalarDL {versionLabel}.'
      }
    </Translate>
  );
}

function UnmaintainedVersionLabel({
  siteTitle,
  versionMetadata,
  releaseSupportPolicyDocPath,
}: BannerLabelComponentProps) {
  return (
    <Translate
      id="theme.docs.versions.unmaintainedVersionLabel"
      description="The label used to tell the user that he's browsing an unmaintained doc version"
      values={{
        siteTitle,
        versionLabel: <b>{versionMetadata.label}</b>,
        releaseSupportPolicyLink: (
          <b>
            <Link to={releaseSupportPolicyDocPath}>
              <Translate
                id="theme.docs.versions.releaseSupportPolicyLinkLabel"
                description="The label used for the release support policy link label when the banner is 'unmaintained'">
                Release Support Policy
              </Translate>
            </Link>
          </b>
        ),
      }}>
      {
        'This is documentation for ScalarDL {versionLabel}, which is no longer under Maintenance Support. For details, see the {releaseSupportPolicyLink}.'
      }
    </Translate>
  );
}

const BannerLabelComponents: {
  [banner in VersionBanner]: ComponentType<BannerLabelComponentProps>;
} = {
  unreleased: UnreleasedVersionLabel,
  unmaintained: UnmaintainedVersionLabel,
};

function BannerLabel(props: BannerLabelComponentProps) {
  const BannerLabelComponent =
    BannerLabelComponents[props.versionMetadata.banner!];
  return <BannerLabelComponent {...props} />;
}

function LatestVersionSuggestionLabel({
  versionLabel,
  to,
  onClick,
  upgradeDocPath,
}: {
  to: string;
  onClick: () => void;
  versionLabel: string;
  upgradeDocPath: string;
}) {
  return (
    <Translate
      id="theme.docs.versions.latestVersionSuggestionLabel"
      description="The label used to tell the user to check the latest version"
      values={{
        versionLabel: (
          <b>{versionLabel}</b>
        ),
        latestVersionLink: (
          <b>
            <Link to={to} onClick={onClick}>
              <Translate
                id="theme.docs.versions.latestVersionLinkLabel"
                description="The label used for the latest version suggestion link label">
                latest version
              </Translate>
            </Link>
          </b>
        ),
        upgradeVersionLink: (
          <b>
            <Link to={upgradeDocPath} onClick={onClick}>
              <Translate
                id="theme.docs.versions.upgradeVersionLinkLabel"
                description="The label used for the latest version suggestion link label when the banner is 'unmaintained'">
                upgrading
              </Translate>
            </Link>
          </b>
        ),
      }}>
      {
        'Please consider {upgradeVersionLink} to ScalarDL {versionLabel}.'
      }
    </Translate>
  );
}

function DocVersionBannerEnabled({
  className,
  versionMetadata,
}: Props & {
  versionMetadata: PropVersionMetadata;
}): ReactNode {
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {pluginId} = useActivePlugin({failfast: true})!;
  const activeVersion = useActiveVersion(pluginId);

  const getVersionMainDoc = (version: GlobalVersion) =>
    version.docs.find((doc) => doc.id === version.mainDocId)!;

  const {savePreferredVersionName} = useDocsPreferredVersion(pluginId);

  const {latestDocSuggestion, latestVersionSuggestion} =
    useDocVersionSuggestions(pluginId);

  // Try to link to same doc in latest version (not always possible), falling
  // back to main doc of latest version
  const latestVersionSuggestedDoc =
    latestDocSuggestion ?? getVersionMainDoc(latestVersionSuggestion);

  const getDocPathInCurrentVersion = (
    docIdPart: string,
    fallbackPath: string
  ): string => {
    const doc = activeVersion?.docs.find((item) => item.id.includes(docIdPart));
    return doc?.path ?? fallbackPath;
  };

  return (
    <div
      className={clsx(
        className,
        ThemeClassNames.docs.docVersionBanner,
        'alert alert--warning margin-bottom--md',
      )}
      role="alert">
      <div>
        <BannerLabel
          siteTitle="ScalarDL"
          versionMetadata={versionMetadata}
          releaseSupportPolicyDocPath={getDocPathInCurrentVersion(
            'releases/release-support-policy',
            latestVersionSuggestedDoc.path
          )}
        />
      </div>
      <div className="margin-top--md">
        <LatestVersionSuggestionLabel
          versionLabel={latestVersionSuggestion.label}
          to={latestVersionSuggestedDoc.path}
          onClick={() => savePreferredVersionName(latestVersionSuggestion.name)}
          upgradeDocPath={getDocPathInCurrentVersion(
            'HowToUpgradeScalarDL',
            latestVersionSuggestedDoc.path
          )}
        />
      </div>
    </div>
  );
}

export default function DocVersionBanner({className}: Props): ReactNode {
  const versionMetadata = useDocsVersion();
  if (versionMetadata.banner) {
    return (
      <DocVersionBannerEnabled
        className={className}
        versionMetadata={versionMetadata}
      />
    );
  }
  return null;
}
