# ScalarDL 3.4 Release Notes

This page includes a list of release notes for ScalarDL 3.4.

## 3.4.5

**Release date:** April 18, 2023

### Improvements

- Updated the in-house JRE 8 Docker image to 1.1.11.
- Updated the in-house JRE Docker image to 1.1.12.
- Updated the in-house JRE image to 1.1.10.
- Updated the version of gRPC health probe to 0.4.15.
- Used the latest version of Ubuntu.

## 3.4.5

**Release date:** January 6, 2023

### Improvements

- Updated the in-house JRE Docker image.
- Updated the version of ScalarDB.

## 3.4.4

**Release date:** December 2, 2022

### Improvements

- Added `FunctionManager` to make `Function` mockable.

### Bug fixes

- Fixed [CVE-2022-32149](https://github.com/advisories/GHSA-69ch-w2m2-3vjp "CVE-2022-32149").
- Fixed [CVE-2022-42003](https://github.com/advisories/GHSA-jjjh-jjxp-wpff) and [CVE-2022-42004](https://github.com/advisories/GHSA-rgv9-q543-rqg4).
- Fixed [CVE-2022-27664](https://github.com/advisories/GHSA-69cg-p879-7622).
- Added [@OverRide](https://github.com/OverRide) to fix a warning from ErrorProne.

## 3.4.3

**Release date:** September 22, 2022

### Improvements

- Updated the in-house JRE 8 Docker image to 1.1.8.
- Updated the in-house JRE 8 Docker image to 1.1.7.
- Updated JRE 8 to 1.1.6.
- Updated JRE 8 to 1.1.5.

## 3.4.2

**Release date:** August 3, 2022

### Improvements

- Updated the internal JRE Docker image to 1.1.3.
- Updated the internal JRE Docker image to 1.1.4.

## 3.4.1

**Release date:** June 21, 2022

### Improvements

- Added a `USER 201` setting in the Dockerfile to run as a non-root user.
- Updated the version of ScalarDB to 3.5.2.
- Updated the internal JRE Docker base image to 1.1.2.
- Updated the base image JRE 8 to 1.1.0.

### Bug fixes

- Fixed [CVE-2022-27191](https://github.com/advisories/GHSA-8c26-wmh5-6g9v).

## 3.4.0

**Release date:** February 22, 2022

### Improvements

- Used an internal JRE 8 image to avoid patching in Dockerfile.
- Added crashing SmallBank application in GitHub Action.
- Specified the Cassandra container to not be deleted if a inconsistent state error happens.
- Redirected the ledger and auditor's logs to files.
- Made preservation of input data configurable.
- Improved configuration-related aspects by adding more comments, fixing scopes, and fixing minor issues.
- Updated the `ValidateLedger` contract and the BFD test for the linearizable ledger validation.
- Upgraded the version of ScalarDB.
- Made logging in mandatory before being able to pull a JRE container.

### Bug fixes

- Upgraded Log4j to address. [CVE-2021-44228](https://github.com/advisories/GHSA-jfh8-c2jp-5v3q)
- Updated the version of Log4j to 2.17.0.
- Fixed multi-byte handling.
- Updated the versions of gRPC and protoc to fix a vulnerability issue.
- Added a permission configuration for the Cosmos DB driver.
- Updated the version of `grpc_health_probe` to fix a vulnerability issue.
- Fixed a false-positive inconsistency bug.
- Updated the version of Log4j to 2.17.1.
- Made scan in a contract work even with Auditor.
- Avoided scanning and writing in a contract even with Auditor.
- Fixed bugs and incomplete tests around `LedgerSimulator`.
- Refactored scan in Auditor.
- Fixed `validateLedger`.