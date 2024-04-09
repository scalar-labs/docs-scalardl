# ScalarDL Schema Loaderのカスタム値ファイルを構成する

このドキュメントでは、ScalarDL Schema Loader チャートのカスタム値ファイルを作成する方法について説明します。 パラメータの詳細を知りたい場合は、ScalarDL Schema Loader チャートの [README](https://github.com/scalar-labs/helm-charts/blob/main/charts/schema-loading/README.md) を参照してください。

## 必要な構成

### 画像構成

`schemaLoading.image.repository` を設定する必要があります。 コンテナー リポジトリからイメージをプルできるように、ScalarDL Schema Loader コンテナー イメージを必ず指定してください。

```yaml
schemaLoading:
  image:
    repository: <SCALARDL_SCHEMA_LOADER_CONTAINER_IMAGE>
```

AWS または Azure を使用している場合、詳細については次のドキュメントを参照してください。

* [How to install Scalar products through AWS Marketplace](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/AwsMarketplaceGuide.md)
* [How to install Scalar products through Azure Marketplace](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/AzureMarketplaceGuide.md)

### データベース構成

`schemaLoading.databaseProperties` を設定する必要があります。 バックエンド データベースにアクセスするには、`database.properties` をこのパラメータに設定してください。 ScalarDB のデータベース構成の詳細については、[Getting Started with ScalarDB](https://github.com/scalar-labs/scalardb/blob/master/docs/getting-started-with-scalardb.md) を参照してください。

```yaml
schemaLoading:
  databaseProperties: |
    scalar.db.contact_points=cassandra
    scalar.db.contact_port=9042
    scalar.db.username=cassandra
    scalar.db.password=cassandra
    scalar.db.storage=cassandra
```

### スキーマタイプの構成

`schemaLoading.schemaType` を設定する必要があります。

ScalarDL Ledger のスキーマを作成する場合は `ledger` を設定してください。

```yaml
schemaLoading:
  schemaType: ledger
```

ScalarDL Auditor のスキーマを作成する場合は `auditor` を設定してください。

```yaml
schemaLoading:
  schemaType: auditor
```

## オプションの構成

### シークレット構成 (運用環境で推奨)

環境変数を使用して `schemaLoading.databaseProperties` 内の一部のプロパティ (資格情報など) を設定したい場合は、`schemaLoading.secretName` を使用して、いくつかの資格情報を含む Secret リソースを指定できます。

たとえば、環境変数を使用してバックエンド データベースの資格情報 (`scalar.db.username` および `scalar.db.password`) を設定でき、これによりポッドの安全性が高まります。

Secret リソースの使用方法の詳細については、ドキュメント [Secret リソースを使用して資格情報を環境変数としてプロパティ ファイルに渡す方法](use-secret-for-credentials.md) を参照してください。

```yaml
schemaLoading:
  secretName: "schema-loader-credentials-secret"
```

### フラグ設定 (環境に応じてオプション)

複数のフラグを配列として指定できます。 フラグの詳細については、ドキュメント [ScalarDB Schema Loader](https://github.com/scalar-labs/scalardb/blob/master/docs/schema-loader.md) を参照してください。

```yaml
schemaLoading:
  commandArgs:
  - "--alter"
  - "--compaction-strategy"
  - "<compactionStrategy>"
  - "--delete-all"
  - "--no-backup"
  - "--no-scaling"
  - "--repair-all"
  - "--replication-factor"
  - "<replicaFactor>"
  - "--replication-strategy"
  - "<replicationStrategy>"
  - "--ru"
  - "<ru>"
```
