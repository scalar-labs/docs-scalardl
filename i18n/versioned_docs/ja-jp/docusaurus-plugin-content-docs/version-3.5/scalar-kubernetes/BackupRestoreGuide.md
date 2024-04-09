# Kubernetes 環境で ScalarDB または ScalarDL データをバックアップおよび復元する

このガイドでは、Kubernetes 環境で ScalarDB または ScalarDL データをバックアップおよび復元する方法について説明します。 このガイドは、クラウド サービス プロバイダーのマネージド データベースを ScalarDB または ScalarDL のバックエンド データベースとして使用していることを前提としていることに注意してください。 以下は、このガイドで使用が想定されている管理データベースのリストです。

* NoSQL: トランザクションをサポートしません
    * Amazon DynamoDB
    * Azure Cosmos DB for NoSQL
* リレーショナルデータベース（RDB）：トランザクションをサポート
  * Amazon RDS 
    * MySQL
    * Oracle
    * PostgreSQL
    * SQL Server
  * Amazon Aurora
    * MySQL
    * PostgreSQL
  * Azureデータベース
    * MySQL
    * PostgreSQL

ScalarDB で使用されるデータベースをトランザクション的に一貫した方法でバックアップおよび復元する方法の詳細については、[A Guide on How to Backup and Restore Databases Used Through ScalarDB](https://github.com/scalar-labs/scalardb/blob/master/docs/backup-restore.md) を参照してください。

## バックアップを実行する

### 使用しているデータベースの種類とデータベースの数を確認します。

バックアップと復元の実行方法は、データベースの種類 (NoSQL または RDB) と使用しているデータベースの数によって異なります。

#### NoSQL または複数のデータベース

NoSQL データベースを使用している場合、または [Multi-storage Transactions](https://github.com/scalar-labs/scalardb/blob/master/docs/multi-storage-transactions.md) または [Two-phase Commit Transactions](https://github.com/scalar-labs/scalardb/blob/master/docs/two-phase-commit-transactions.md)  機能が使用するデータベースが 2 つ以上ある場合、詳細については [Kubernetes 環境で NoSQL データベースをバックアップする](BackupNoSQL.md) を参照してください。 バックアップの実行方法について。

#### 単一 RDB

単一のRDBを使用している場合のバックアップ方法については、[Kubernetes環境でRDBをバックアップする](BackupRDB.md) を参照してください。

[Multi-storage Transactions](https://github.com/scalar-labs/scalardb/blob/master/docs/multi-storage-transactions.md) または [Two-phase Commit Transactions](https://github.com/scalar-labs/scalardb/blob/master/docs/two-phase-commit-transactions.md) 機能が使用する RDB が 2 つ以上ある場合は、代わりに [Kubernetes 環境で NoSQL データベースをバックアップする](BackupNoSQL.md) の手順に従う必要があります。

## データベースを復元する

管理されたデータベースからデータを復元する方法の詳細については、[Kubernetes 環境でのデータベースの復元](RestoreDatabase.md) を参照してください。
