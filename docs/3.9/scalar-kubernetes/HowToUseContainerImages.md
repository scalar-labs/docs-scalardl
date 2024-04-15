# How to use the container images

You can pull the container images from the public container repository. You must configure the license key and the certificate in your `.properties` file if you use the container images.

## Prerequisites

The public container images are available for the following products and versions:

* ScalarDB Cluster v3.12 or later
* ScalarDL v3.9 or later

## Pull the container images from the public container repository

You can pull the container image of each product from the public container repository.

* ScalarDB Cluster
  * Standard Edition

    https://github.com/orgs/scalar-labs/packages/container/package/scalardb-cluster-node-byol-standard

  * Premium Edition

    https://github.com/orgs/scalar-labs/packages/container/package/scalardb-cluster-node-byol-premium

* ScalarDL Ledger

  https://github.com/orgs/scalar-labs/packages/container/package/scalardl-ledger-byol

* ScalarDL Auditor

  https://github.com/orgs/scalar-labs/packages/container/package/scalardl-auditor-byol

If you're using Scalar Helm Charts, you must set `*.image.repository` in the custom values file for the product that you're using as follows:

* ScalarDB Cluster
  * Standard Edition

    ```yaml
    scalardbCluster:
      image:
        repository: "ghcr.io/scalar-labs/scalardb-cluster-node-byol-standard"
    ```

  * Premium Edition

    ```yaml
    scalardbCluster:
      image:
        repository: "ghcr.io/scalar-labs/scalardb-cluster-node-byol-premium"
    ```

* ScalarDL Ledger

  ```yaml
  ledger:
    image:
      repository: "ghcr.io/scalar-labs/scalardl-ledger-byol"
  ```

* ScalarDL Auditor

  ```yaml
  auditor:
    image:
      repository: "ghcr.io/scalar-labs/scalardl-auditor-byol"
  ```

## Set the license key in the `.properties` file

To run the container images, you must set `license key` and `certificate` in your `.properties` file. If you don't have a license key, please [contact us](https://www.scalar-labs.com/contact).

* ScalarDB Clsuter

  ```properties
  scalar.db.cluster.node.licensing.license_key=<YOUR_LICENSE_KEY>
  scalar.db.cluster.node.licensing.license_check_cert_pem=<CERT_PEM_FOR_LICENSE_KEY>
  ```

* ScalarDL Ledger

  ```properties
  scalar.dl.licensing.license_key=<YOUR_LICENSE_KEY>
  scalar.dl.licensing.license_check_cert_pem=<CERT_PEM_FOR_LICENSE_KEY>
  ```

* ScalarDL Auditor

  ```properties
  scalar.dl.licensing.license_key=<YOUR_LICENSE_KEY>
  scalar.dl.licensing.license_check_cert_pem=<CERT_PEM_FOR_LICENSE_KEY>
  ```

If you're using Scalar Helm Charts, you must set the properties in the custom values file for the product that you're using as follows:

* ScalarDB Cluster

  ```yaml
  scalardbCluster:
    scalardbClusterNodeProperties: |
      scalar.db.cluster.node.licensing.license_key=<YOUR_LICENSE_KEY>
      scalar.db.cluster.node.licensing.license_check_cert_pem=<CERT_PEM_FOR_LICENSE_KEY>
  ```

* ScalarDL Ledger

  ```yaml
  ledger:
    ledgerProperties: |
      scalar.dl.licensing.license_key=<YOUR_LICENSE_KEY>
      scalar.dl.licensing.license_check_cert_pem=<CERT_PEM_FOR_LICENSE_KEY>
  ```

* ScalarDL Auditor

  ```yaml
  auditor:
    auditorProperties: |
      scalar.dl.licensing.license_key=<YOUR_LICENSE_KEY>
      scalar.dl.licensing.license_check_cert_pem=<CERT_PEM_FOR_LICENSE_KEY>
  ```
