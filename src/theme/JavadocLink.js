import React from 'react';
import { useActiveVersion } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function JavadocLink({ packageName, path, className }) {
  const { siteConfig } = useDocusaurusContext();
  const activeVersion = useActiveVersion();

  // Retrieve className from siteConfig based on the active version.
  const docsClassName =
    siteConfig.presets?.[0]?.[1]?.docs?.versions?.[activeVersion.name]?.className;

  // Log for debugging
  console.log('Active Version:', activeVersion?.name);
  console.log('Docs ClassName:', docsClassName);

  // The link in the <a> code below is generated based on the following JavadocLink component that must be added in place of a static Javadoc link in the doc:
  // <JavadocLink packageName="<PACKAGE_NAME>" path="<PATH>" className="<CLASS_NAME>" />
  // In addition, be sure to add the following below the title to import the component:
  // import JavadocLink from "/src/theme/JavadocLink.js";
  return (
    <a
      href={`https://javadoc.io/static/com.scalar-labs/${packageName}/${docsClassName}/${path}/${className}.html`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {className}
    </a>
  );
}
