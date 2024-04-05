# ScalarDL 3.6 Release Notes

This page includes a list of release notes for ScalarDL 3.6.

## v3.6.4

**Release date:** April 18, 2023

### Improvements

- Updated the in-house JRE 8 Docker image to 1.1.11.
- Updated the in-house JRE Docker image to 1.1.12.
- Updated the in-house JRE image to 1.1.10.
- Updated the version of gRPC health probe to 0.4.15.
- Used the latest version of Ubuntu.

### Bug fixes

- Added a fix to verify signatures when reading them from Ledger.

## v3.6.3

**Release date:** January 6, 2023

### Improvements

- Updated the in-house JRE Docker image.
- Updated the version of ScalarDB.

## v3.6.2

**Release date:** December 2, 2022

### Improvements

- Added `FunctionManager` to make `Function` mockable.
- Used scannable `LedgerTracer` that does storage scan in a `Contract`.
- Updated the version of ScalarDB.

### Bug fixes

- Fixed [CVE-2022-32149](https://github.com/advisories/GHSA-69ch-w2m2-3vjp "CVE-2022-32149").
- Fixed [CVE-2022-42003](https://github.com/advisories/GHSA-jjjh-jjxp-wpff) and [CVE-2022-42004](https://github.com/advisories/GHSA-rgv9-q543-rqg4).
- Added [@OverRide](https://github.com/OverRide) to fix a warning from ErrorProne.
- Fixed [CVE-2022-27664](https://github.com/advisories/GHSA-69cg-p879-7622).
- Updated the version of gRPC to fix a vulnerability.

## v3.6.0

**Release date:** September 22, 2022

### Enhancements

- Updated the release workflow to push the container to the Elastic Container Registry on AWS Marketplace.
- Upgraded the version of ScalarDB.

### Bug fixes

- Updated the in-house JRE 8 Docker image to 1.1.7.
- Updated the in-house JRE 8 Docker image to 1.1.8.
- Fixed Ledger/Auditor/Client configuration loading.
