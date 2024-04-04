# Azure で ScalarDB/ScalarDL デプロイ用のデータベースをセットアップする

このガイドでは、Azure 上で ScalarDB/ScalarDL デプロイ用のデータベースをセットアップする方法について説明します。

## Azure Cosmos DB for NoSQL

### 認証方法

Cosmos DB for NoSQL を使用する場合は、ScalarDB/ScalarDL プロパティ ファイルで `COSMOS_DB_URI` と `COSMOS_DB_KEY` を次のように設定する必要があります。

```properties
scalar.db.contact_points=<COSMOS_DB_URI>
scalar.db.password=<COSMOS_DB_KEY>
scalar.db.storage=cosmos
```

Cosmos DB for NoSQL のプロパティの詳細については、次のドキュメントを参照してください。

* [Configure ScalarDB for Cosmos DB for NoSQL](https://github.com/scalar-labs/scalardb/blob/master/docs/getting-started-with-scalardb.md#configure-scalardb-1)

### 必要な構成/手順

#### Azure Cosmos DB アカウントを作成する

NoSQL (コア) API を使用して Azure Cosmos DB アカウントを作成する必要があります。 **Capacity mode**を作成するときは、**Provisioned throughput**として設定する必要があります。 詳細については公式ドキュメントを参照してください。

* [Quickstart: Create an Azure Cosmos DB account, database, container, and items from the Azure portal](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/quickstart-portal)

#### デフォルトの整合性構成を構成する

**Default consistency level**を**Strong**に設定する必要があります。 詳細については公式ドキュメントを参照してください。

* [Configure the default consistency level](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/how-to-manage-consistency#config/ure-the-default-consistency-level)

### オプションの構成/手順

#### バックアップ構成を構成する (実稼働環境で推奨)

PITR の **Backup modes**を **Continuous backup mode**として構成できます。 詳細については公式ドキュメントを参照してください。

* [Backup modes](https://learn.microsoft.com/en-us/azure/cosmos-db/online-backup-and-restore#backup-modes)

継続バックアップ モードでは自動的かつ継続的にバックアップが取得されるため、バックアップ操作のダウンタイム (一時停止期間) を短縮できるため、このモードをお勧めします。 Scalar 製品データのバックアップ/復元方法の詳細については、次のドキュメントを参照してください。

* [Scalar 製品のバックアップ復元ガイド](BackupRestoreGuide.md)

#### Configure monitoring (Recommended in the production environment)

You can configure the monitoring of Cosmos DB using its native feature. Please refer to the official document for more details.

* [Monitor Azure Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/monitor)

It is recommended since the metrics and logs help you to investigate some issues in the production environment when they happen.

#### サービス エンドポイントを有効にする (運用環境で推奨)

仮想ネットワーク (VNet) の特定のサブネットからのアクセスのみを許可するように Azure Cosmos DB アカウントを構成できます。 詳細については公式ドキュメントを参照してください。

* [Configure access to Azure Cosmos DB from virtual networks (VNet)](https://learn.microsoft.com/en-us/azure/cosmos-db/how-to-configure-vnet-service-endpoint)

WAN 経由ではないプライベート内部接続によりシステムの安全性が高まるため、これをお勧めします。

#### リクエスト ユニットを構成します (環境に応じてオプション)

要件に基づいて Cosmos DB の **Request Units** を構成できます。 リクエスト単位の詳細については公式ドキュメントを参照してください。

* [Request Units in Azure Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/request-units)

テーブルの作成時に、ScalarDB/DL Schema Loader を使用してリクエスト ユニットを構成できます。 ScalarDB/DL Schema Loader を使用してリクエスト ユニット (RU) を構成する方法の詳細については、次のドキュメントを参照してください。

* [ScalarDB Schema Loader](https://github.com/scalar-labs/scalardb/blob/master/docs/schema-loader.md)

## Azure Database for MySQL

### 認証方法

Azure Database for MySQL を使用する場合は、ScalarDB/ScalarDL プロパティ ファイルで `JDBC_URL`、`USERNAME`、および `PASSWORD` を次のように設定する必要があります。

```properties
scalar.db.contact_points=<JDBC_URL>
scalar.db.username=<USERNAME>
scalar.db.password=<PASSWORD>
scalar.db.storage=jdbc
```

Azure Database for MySQL (JDBC データベース) のプロパティの詳細については、次のドキュメントを参照してください。

* [Configure ScalarDB for JDBC databases](https://github.com/scalar-labs/scalardb/blob/master/docs/getting-started-with-scalardb.md#configure-scalardb-3)

### 必要な構成/手順

#### データベース サーバーを作成する

データベースサーバーを作成する必要があります。 詳細については公式ドキュメントを参照してください。

* [Quickstart: Use the Azure portal to create an Azure Database for MySQL Flexible Server](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/quickstart-create-server-portal)

導入には **Single Server** または **Flexible Server** を選択できます。 ただし、Azure では Flexible Server が推奨されます。 このドキュメントは、Flexible Server の使用を前提としています。 導入モデルの詳細については、公式ドキュメントを参照してください。

* [What is Azure Database for MySQL?](https://learn.microsoft.com/en-us/azure/mysql/single-server/overview#deployment-models)

### オプションの構成/手順

#### バックアップ構成を構成します (環境に応じてオプション)

Azure Database for MySQL は、既定でバックアップを取得します。 バックアップ機能を手動で有効にする必要はありません。

バックアップの保持期間など、一部のバックアップ構成を変更する場合は、それを構成できます。 詳細については公式ドキュメントを参照してください。

* [Backup and restore in Azure Database for MySQL Flexible Server](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/concepts-backup-restore)

Scalar 製品データのバックアップ/復元方法の詳細については、次のドキュメントを参照してください。

* [Scalar 製品のバックアップ復元ガイド](BackupRestoreGuide.md)

#### 監視を構成する (運用環境で推奨)

Azure Database for MySQL のネイティブ機能を使用して、その監視を構成できます。 詳細については公式ドキュメントを参照してください。

* [Monitor Azure Database for MySQL Flexible Server](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/concepts-monitoring)

メトリクスとログは、運用環境で問題が発生したときにそれを調査するのに役立つため、これをお勧めします。

#### パブリック アクセスを無効にする (運用環境で推奨)

**Private access (VNet Integration)** を **Connectivity method** として構成できます。 詳細については公式ドキュメントを参照してください。

* [Connectivity and networking concepts for Azure Database for MySQL - Flexible Server](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/concepts-networking)

次のように、AKS クラスター上の Scalar 製品ポッドからデータベース サーバーにアクセスできます。

* AKS クラスターと同じ VNet 上にデータベース サーバーを作成します。
* [Virtual network peering](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview) を使用して、Scalar 製品デプロイのデータベース サーバー用の VNet と AKS クラスター用の VNet を接続します。 (// TODO: この機能を Scalar 製品でテストする必要があります。)

WAN 経由ではないプライベート内部接続によりシステムの安全性が高まるため、これをお勧めします。

## Azure Database for PostgreSQL

### 認証方法

Azure Database for PostgreSQL を使用する場合は、ScalarDB/ScalarDL プロパティ ファイルで `JDBC_URL`、`USERNAME`、および `PASSWORD` を次のように設定する必要があります。

```properties
scalar.db.contact_points=<JDBC_URL>
scalar.db.username=<USERNAME>
scalar.db.password=<PASSWORD>
scalar.db.storage=jdbc
```

Azure Database for PostgreSQL (JDBC データベース) のプロパティの詳細については、次のドキュメントを参照してください。

* [Configure ScalarDB for JDBC databases](https://github.com/scalar-labs/scalardb/blob/master/docs/getting-started-with-scalardb.md#configure-scalardb-3)

### 必要な構成/手順

#### データベース サーバーを作成する

データベースサーバーを作成する必要があります。 詳細については公式ドキュメントを参照してください。

* [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server in the Azure portal](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/quickstart-create-server-portal)

導入には **Single Server** または **Flexible Server** を選択できます。 ただし、Azure では Flexible Server が推奨されます。 このドキュメントは、Flexible Server の使用を前提としています。 導入モデルの詳細については、公式ドキュメントを参照してください。

* [What is Azure Database for PostgreSQL?](https://learn.microsoft.com/en-us/azure/postgresql/single-server/overview#deployment-models)

### オプションの構成/手順

#### バックアップ構成を構成します (環境に応じてオプション)

Azure Database for PostgreSQL は、既定でバックアップを取得します。 バックアップ機能を手動で有効にする必要はありません。

バックアップの保持期間など、一部のバックアップ構成を変更する場合は、それを構成できます。 詳細については公式ドキュメントを参照してください。

* [Backup and restore in Azure Database for PostgreSQL - Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-backup-restore)

Scalar 製品データのバックアップ/復元方法の詳細については、次のドキュメントを参照してください。

* [Scalar 製品のバックアップ復元ガイド](BackupRestoreGuide.md)

#### 監視を構成する (運用環境で推奨)

Azure Database for PostgreSQL のネイティブ機能を使用して、その監視を構成できます。 詳細については公式ドキュメントを参照してください。

* [Monitor metrics on Azure Database for PostgreSQL - Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-monitoring)

メトリクスとログは、運用環境で問題が発生したときにそれを調査するのに役立つため、これをお勧めします。

#### パブリック アクセスを無効にする (運用環境で推奨)

**Private access (VNet Integration)** を **Connectivity method** として構成できます。 詳細については公式ドキュメントを参照してください。

* [Networking overview for Azure Database for PostgreSQL - Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-networking)

次のように、AKS クラスター上の Scalar 製品ポッドからデータベース サーバーにアクセスできます。

* AKS クラスターと同じ VNet 上にデータベース サーバーを作成します。
* [Virtual network peering](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview) を使用して、Scalar 製品デプロイのデータベース サーバー用の VNet と AKS クラスター用の VNet を接続します。 (// TODO: この機能を Scalar 製品でテストする必要があります。)

WAN 経由ではないプライベート内部接続によりシステムの安全性が高まるため、これをお勧めします。
