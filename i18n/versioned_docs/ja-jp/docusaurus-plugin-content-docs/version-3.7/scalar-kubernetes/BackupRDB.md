# Kubernetes 環境で RDB をバックアップする

このガイドでは、ScalarDB または ScalarDL が Kubernetes 環境で使用する単一のリレーショナル データベース (RDB) のバックアップを作成する方法について説明します。 このガイドは、クラウド サービス プロバイダーの管理されたデータベースを使用していることを前提としていることに注意してください。

[Multi-storage Transactions](https://github.com/scalar-labs/scalardb/blob/master/docs/multi-storage-transactions.md) または [Two-phase Commit Transactions](https://github.com/scalar-labs/scalardb/blob/master/docs/two-phase-commit-transactions.md) 機能が使用する RDB が 2 つ以上ある場合は、代わりに [Back up a NoSQL database in a Kubernetes environment](BackupNoSQL.md) の手順に従う必要があります。

## バックアップを実行する

バックアップを実行するには、管理されたデータベースで使用できる自動バックアップ機能を有効にする必要があります。 この機能を有効にすると、追加のバックアップ操作を実行する必要がなくなります。 各管理データベースのバックアップ構成の詳細については、次のガイドを参照してください。

* [AWS での ScalarDB/ScalarDL デプロイメント用のデータベースのセットアップ](SetupDatabaseForAWS.md)
* [Azure 上で ScalarDB/ScalarDL デプロイメント用のデータベースをセットアップする](SetupDatabaseForAzure.md)

マネージド RDB はトランザクションの観点からバックアップ データの一貫性を保つため、マネージド RDB のポイント イン タイム リカバリ (PITR) 機能を使用して、バックアップ データを任意の時点に復元できます。
