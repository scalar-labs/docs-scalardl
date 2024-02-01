# ScalarDL 3.8 Release Notes

This page includes a list of release notes for ScalarDL 3.8.

## v3.8.0

**Release date:** April 19, 2023

### New features

- Added support for hash-based message authentication codes (HMACs). In ScalarDL 3.7 and earlier versions, you could use only digital signatures as the authentication method between client and Ledger, client and Auditor, and Ledger and Auditor. As of ScalarDL 3.8, you can use either digital signatures or HMACs for all authentications. By default, digital signatures are used for authentication.
- Added capability to configure values through environment variables. As of ScalarDL 3.8, you can set values for Client SDK, Ledger, and Auditor configurations through environment variables. This capability enables you to more flexibly and easily configure Client SDK, Ledger and Auditor.
- Added metering capability for pay-as-you-go in the AWS Marketplace. As of ScalarDL 3.8, you can download and use container images of ScalarDL Ledger and Auditor through the AWS Marketplace. You will be automatically billed a fee based on how many hours you use each container.

For more details, please see [ScalarDL 3.8 has been released!](https://medium.com/scalar-engineering/scalardl-3-8-has-been-released-40ed12242d6c)

### Improvements

- Added a cache for DagValidator to reduce validation time by avoiding duplicate contract execution in Auditor.
- Renamed `Scalar DL` to `ScalarDL` for product branding purposes.
- Removed unnecessary code and files.
- Upgraded the supported version of ScalarDB from 3.7.2 to 3.8.0.

### Bug fixes

- Upgraded the integrated Java Runtime Environment (JRE) Docker image to 1.1.12 to fix security issues. [CVE-2023-0286](https://nvd.nist.gov/vuln/detail/CVE-2023-0286), [CVE-2023-0361](https://nvd.nist.gov/vuln/detail/CVE-2023-0361)
- Upgraded gRPC Health Probe to 0.4.17 to fix security issues. [CVE-2022-41721](https://nvd.nist.gov/vuln/detail/CVE-2022-41721), [CVE-2022-41723](https://nvd.nist.gov/vuln/detail/cve-2022-41723)
