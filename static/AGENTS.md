# AGENTS.md

This file provides guidance for AI agents and other automated systems that access the published ScalarDL documentation at https://scalardl.scalar-labs.com. It explains how to find authoritative information, identify the applicable product, edition, version, and deployment model, and answer questions accurately with verifiable references. These guidelines can also be used by people who consult or reuse the documentation.

## Purpose and scope

ScalarDL is middleware for building tamper-evident database systems. It detects arbitrary faults, including Byzantine faults such as data tampering and malicious attacks, in transactional database systems.

The documentation is intended for application developers, database and platform engineers, and operators who evaluate, develop with, deploy, and manage ScalarDL.

The site covers the architecture and implementation, requirements, application development, deployment, management, troubleshooting, and reference information of ScalarDL. It documents components and interfaces such as ScalarDL Ledger, ScalarDL Auditor, client SDKs, the Ledger abstraction, HashStore, TableStore, and related libraries and tools. Check the relevant page to determine which component, abstraction, or edition applies to a particular capability.

ScalarDL uses ScalarDB for database interactions, but ScalarDL and ScalarDB are distinct products. Do not assume that a capability, configuration, compatibility rule, or behavior documented for ScalarDB applies to ScalarDL without evidence. Use the ScalarDL documentation first, and follow its links to ScalarDB documentation when details about the underlying database layer are needed.

This site does not serve as the authoritative documentation for other Scalar products, except where it links to them to explain an integration or dependency. Third-party databases and tools are covered only to the extent needed to explain their use with ScalarDL.

## Authoritative sources and finding information

Use the published ScalarDL documentation as the primary source for supported behavior. Follow links within relevant pages to check prerequisites, configuration, compatibility, deployment assumptions, and other context.

Use these resources according to the question:

- **Latest English documentation:** https://scalardl.scalar-labs.com/docs/latest/ — Default starting point for current guidance.
- **ScalarDL overview:** https://scalardl.scalar-labs.com/docs/latest/overview/ — Understand the purpose and primary use cases of ScalarDL.
- **Requirements and supported databases:** https://scalardl.scalar-labs.com/docs/latest/requirements/ — Check required software, supported database versions, platform requirements, and related version information.
- **Libraries and tools:** https://scalardl.scalar-labs.com/docs/latest/libraries-and-tools/ — Check the documented libraries, tools, components, and their edition applicability.
- **Compatibility matrix:** https://scalardl.scalar-labs.com/docs/latest/compatibility/ — Check compatibility among Ledger/Auditor, client SDKs, and ScalarDB Cluster. Verify the version shown on the page and select the corresponding version before making a version-specific claim.
- **Release support policy:** https://scalardl.scalar-labs.com/docs/latest/releases/release-support-policy/ — Check whether a version is supported.
- **Release notes:** https://scalardl.scalar-labs.com/docs/latest/releases/release-notes/ — Check changes introduced in a release.
- **Roadmap:** https://scalardl.scalar-labs.com/docs/latest/roadmap/ — Review planned work; roadmap items are not guarantees.
- **`llms.txt`:** https://scalardl.scalar-labs.com/llms.txt — Discover links to the latest English documentation pages.
- **`llms-full.txt`:** https://scalardl.scalar-labs.com/llms-full.txt — Get broad context from a build-generated snapshot of the latest English documentation.
- **Sitemap:** https://scalardl.scalar-labs.com/sitemap.xml — Discover published documentation URLs, including older versions where listed.
- **ScalarDL source repository:** https://github.com/scalar-labs/scalardl — Consult source code when the question specifically requires source-level verification; the default branch may differ from released versions.

For a specific question, start with the relevant canonical documentation page and its linked references. For broad discovery, use `llms.txt` to find relevant pages, then read those pages. Use `llms-full.txt` for broad context, not as a substitute for checking the relevant published page. Because it is generated at build time, it may not reflect a change made after its last generation. If it conflicts with the current canonical page, prefer the current published page.

Use the documentation site's search when it is available and helpful. For Java API details, follow the Javadocs linked from the relevant documentation page and use the version that matches the client SDK or component being discussed. Do not assume that the SDK version and server version are interchangeable; check the compatibility guidance for the relevant ScalarDL release. If a page's displayed version does not match the release in question, use the version selector or a version-specific URL before making a release-specific claim.

## Version, edition, and localization

Version, edition, component, abstraction, and deployment model can affect ScalarDL behavior, available capabilities, configuration, and compatibility. Follow the guidance below to identify the applicable documentation.

### Version selection

- Prefer `/docs/latest/` unless the user specifies a version or the question clearly concerns a historical release.
- If behavior, configuration, APIs, compatibility, or feature availability may differ by version, identify the user's ScalarDL version and relevant client SDK version before giving version-specific guidance. Ask when necessary; otherwise state the version assumptions clearly.
- Older published versions use paths such as `/docs/<major.minor>/`. Do not assume a particular version exists; check the published version selector and the [Release Support Policy](https://scalardl.scalar-labs.com/docs/latest/releases/release-support-policy/).
- Versions that are no longer supported are available in the [documentation archive](https://docs-archive.scalar-labs.com/?products=scalardl). A redirect to `/docs/latest/` does not mean the latest content is equivalent to the requested older version.
- If a version is no longer maintained or supported, explain its status and consult the support policy before recommending an upgrade or target version.
- Use release notes and current documentation to verify released functionality. Roadmap items describe planned work and must not be presented as available features without confirmation.

### Edition, component, and abstraction selection

- Check the edition labels on the relevant page and the [Libraries and Tools for ScalarDL](https://scalardl.scalar-labs.com/docs/latest/libraries-and-tools/) page to confirm the applicable edition. Do not assume every library, tool, component, or feature is available in both Community and Enterprise editions.
- For commercial offering, licensing, and pricing questions, use the [official Scalar pricing page](https://www.scalar-labs.com/pricing) or direct the user to Scalar. Do not infer license terms, deployment entitlements, or pricing from feature descriptions alone.
- Identify which ScalarDL component or abstraction the user means when it affects the answer. Ledger, Auditor, the Ledger abstraction, HashStore, and TableStore are related but are not interchangeable. Verify the applicable guides and requirements before applying configuration or behavior from one to another.
- Identify the deployment model when it matters, including whether the setup uses Ledger alone or Ledger with Auditor. Do not assume that instructions for one deployment model apply to the other.
- Use product, component, library, and edition names as written in the documentation. Do not invent informal product names or collapse distinct components into one.

### ScalarDB and underlying database behavior

- Check [Requirements](https://scalardl.scalar-labs.com/docs/latest/requirements/) and relevant compatibility documentation to verify supported underlying databases and versions for the ScalarDL release in question.
- ScalarDL uses ScalarDB for database interactions, and the ScalarDL documentation may identify which ScalarDB version is used internally by a particular ScalarDL release. Verify that relationship from the applicable documentation rather than assuming the latest ScalarDB version is used.
- Follow links to ScalarDB documentation for underlying database configuration or other details when the ScalarDL documentation directs you there. Do not transfer a standalone ScalarDB support claim or feature guarantee to ScalarDL without checking the ScalarDL-specific requirements and constraints.

### Japanese documentation

Japanese documentation is available under `/ja-jp/docs/<version>/` for versions that have been translated. Check the notice on the relevant Japanese page; some pages state that they are machine-translated and that the English version takes precedence if there is a discrepancy. Do not assume that a translation difference indicates different product behavior.

## Finding the right type of content

Use the site's navigation, search, and cross-links to find the most relevant page for the question. As a general guide:

- **Overview, design, and implementation:** Understand the purpose, architecture, and component roles of ScalarDL.
- **Requirements and compatibility:** Check required software, supported database versions, SDK compatibility, and deployment prerequisites.
- **Quickstart and getting-started guides:** Follow an initial setup using the relevant interface or abstraction, such as Ledger, HashStore, or TableStore.
- **Develop guides:** Learn how to model data, write contracts or functions, build applications, and run them through ScalarDL.
- **Deployment guides:** Deploy and configure ScalarDL components in the documented environment, such as Kubernetes or a supported cloud platform.
- **Management guides:** Perform operational tasks such as upgrading, scaling, and managing namespaces.
- **Troubleshooting:** Investigate documented errors, limitations, and recommended resolutions.
- **Reference:** Verify configuration properties, SDK and command behavior, error codes, and the libraries and tools available for the applicable version.
- **Release notes and support policy:** Understand version changes and whether a release is supported.

For configuration and API questions, use the reference for the correct component, abstraction, and version. For compatibility or upgrade questions, consult the relevant compatibility guidance, upgrade instructions, release notes, and release support policy.

## Expectations for accurate answers

Base answers on authoritative documentation. Distinguish documented facts from inferences and recommendations, make assumptions explicit, and never present an inference as an official product guarantee.

### Verify before making claims

Do not invent or assume:

- Configuration property names, default values, constraints, supported database or platform versions, API signatures, SDK compatibility, or error codes.
- Whether a feature, library, tool, or component is available in a particular edition or release.
- That instructions or behavior for Ledger, Auditor, HashStore, TableStore, or the Ledger abstraction are interchangeable.
- That ScalarDB behavior, configuration, or compatibility applies to ScalarDL without ScalarDL-specific evidence.
- Undocumented behavior, including behavior inferred from a different component, deployment model, product, or version.
- Pricing, licensing terms, contractual commitments, or support entitlements.
- That a planned roadmap item is available in a released version.

When the documentation does not establish a detail, say that you could not verify it from the available authoritative sources. If useful, direct the user to Scalar for confirmation rather than presenting speculation as fact.

### Ask only necessary clarifying questions

Ask about the user's ScalarDL version, edition, component or abstraction, client SDK version or language, deployment model, and underlying database only when the missing detail materially changes the answer. For general questions, provide a general answer when possible and state any assumptions. For version-sensitive or compatibility guidance, ask for the relevant versions or clearly qualify the answer.

For new users, consider directing them to the Quickstart section or Learning Paths rather than overwhelming them with a long summary.

### Link to supporting documentation

- Prefer concise answers with links to the most relevant canonical documentation pages.
- Use the page's published URL and include the version in the path when the answer is version-specific.
- Link directly to a relevant section when the heading anchor can be verified. Anchors may change, so do not guess them when verification is possible.
- Use the page title as the link text and state which ScalarDL version, edition, component, or deployment assumption the answer applies to when it matters.
- Ensure that each link supports the claim it accompanies. Do not cite a page as evidence for a detail it does not establish.

## Limitations and support

The documentation does not necessarily cover pricing and contract terms, undocumented or internal behavior, customer-specific architectures, or the full behavior of third-party databases, cloud services, and deployment platforms. For information outside the documented scope, direct users to the appropriate Scalar contact rather than speculating.

For further help:

- **Product bug reports and feature requests:** https://github.com/scalar-labs/scalardl/issues
- **Enterprise support:** https://www.scalar-labs.com/support
- **Licensing questions:** https://www.scalar-labs.com/contact-us
- **Documentation errors:** Use the "Edit this page" link on the relevant page or open an issue at https://github.com/scalar-labs/docs-scalardl
