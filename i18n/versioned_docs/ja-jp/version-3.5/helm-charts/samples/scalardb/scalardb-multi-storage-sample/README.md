# Kubernetes での ScalarDB デプロイメント サンプル (マルチストレージ トランザクション)

## バージョン

このサンプルでは、各製品の以下のバージョンを使用しています。

* ScalarDB Server v3.6.0
* ScalarDB SQL CLI v3.6.0
* Scalar Envoy v1.2.0
* MySQL v8.0.30
* PostgreSQL v14.4
* Helm Chart: scalar-labs/scalardb v2.3.0
* Helm Chart: scalar-labs/envoy v2.0.1
* Helm Chart: bitnami/mysql v9.2.6
* Helm Chart: bitnami/postgresql v11.6.26

## 環境

このサンプルでは、Kubernetes クラスター上に以下の環境を作成します。

```
+----------------------------------------------------------------------------------------------------------------------------------------------+
| [Kubernetes クラスター]                                                                                                                         |
|                                         [ポッド]                                                 [ポッド]                            [ポッド]         |
|                                                                                                                                              |
|                                       +-------+                                         +-----------------+                                  |
|                                 +---> | Envoy | ---+                              +---> | ScalarDB Server | ---+         +----------------+  |
|                                 |     +-------+    |                              |     +-----------------+    |         |     MySQL      |  |
|                                 |                  |                              |                            |   +---> | (schema0.tbl0) |  |
|  +--------+      +---------+    |     +-------+    |     +-------------------+    |     +-----------------+    |   |     +----------------+  |
|  | クライアント | ---> | サービス | ---+---> | Envoy | ---+---> |      サービス      | ---+---> | ScalarDB Server | ---+---+                         |
|  +--------+      | (Envoy) |    |     +-------+    |     | (ScalarDB Server) |    |     +-----------------+    |   |     +----------------+  |
|                  +---------+    |                  |     +-------------------+    |                            |   +---> |   PostgreSQL   |  |
|                                 |     +-------+    |                              |     +-----------------+    |         | (schema1.tbl1) |  |
|                                 +---> | Envoy | ---+                              +---> | ScalarDB Server | ---+         +----------------+  |
|                                       +-------+                                         +-----------------+                                  |
|                                                                                                                                              |
+----------------------------------------------------------------------------------------------------------------------------------------------+
```

## 準備

1. サンプルファイルを入手します。.
   ```console
   git clone https://github.com/scalar-labs/helm-charts.git
   cd helm-charts/docs/samples/scalardb/scalardb-multi-storage-sample/
   ```

1. Helm リポジトリを追加します。
   ```console
   helm repo add bitnami https://charts.bitnami.com/bitnami
   ```
   ```console
   helm repo add scalar-labs https://scalar-labs.github.io/helm-charts
   ```

1. プライベート コンテナー レジストリ (GitHub Packages) にアクセスするためのシークレット リソースを作成します。
   ```console
   kubectl create secret docker-registry reg-docker-secrets \
     --docker-server=ghcr.io \
     --docker-username=<USERNAME> \
     --docker-password=<GITHUB_PERSONAL_ACCESS_TOKEN>
   ```

1. Deploy MySQL.
   ```console
   helm install mysql-scalardb bitnami/mysql \
     --set auth.rootPassword=mysql \
     --set primary.persistence.enabled=false \
     --version 9.2.6
   ```

1. PostgreSQL をデプロイします。
   ```console
   helm install postgresql-scalardb bitnami/postgresql \
     --set auth.postgresPassword=postgres \
     --set primary.persistence.enabled=false \
     --version 11.6.26
   ```

## ScalarDB Server をデプロイする

1. DB 認証情報を含むシークレット リソースを作成します。
   ```console
   kubectl create secret generic scalardb-credentials-secret \
     --from-literal=SCALAR_DB_MYSQL_USERNAME=root \
     --from-literal=SCALAR_DB_MYSQL_PASSWORD=mysql \
     --from-literal=SCALAR_DB_POSTGRES_USERNAME=postgres \
     --from-literal=SCALAR_DB_POSTGRES_PASSWORD=postgres
   ```

1. ScalarDB Server をデプロイする。
   ```console
   helm install scalardb scalar-labs/scalardb \
     -f ./scalardb-server.yaml \
     --version 2.3.0
   ```

## クライアントのデプロイ (ScalarDB SQL CLI コンテナー)

1. `database.properties` を含む configmap リソースを作成します。
   ```console
   kubectl create configmap database-properties \
     --from-file=./database.properties
   ```

1. ScalarDB SQL CLI コンテナをデプロイします。
   ```console
   kubectl apply -f ./scalardb-sql-cli.yaml
   ```

## ScalarDB SQL CLI を使用して SQL を実行する

1. ScalarDB SQL CLI を実行します。
   ```console
   kubectl exec -it scalardb-sql-cli -- java -jar /app.jar --config /conf/database.properties
   ```

1. Coordinator テーブルを作成します。
   ```sql
   CREATE COORDINATOR TABLES;
   ```

1. ネームスペースを作成します。
   ```sql
   CREATE NAMESPACE schema0;
   ```
   ```sql
   CREATE NAMESPACE schema1;
   ```

1. テーブルを作成します。
   ```sql
   CREATE TABLE schema0.t0 (
       c1 INT PRIMARY KEY,
       c2 INT,
       c3 TEXT
   );
   ```
   ```sql
   CREATE TABLE schema1.t1 (
       c1 INT PRIMARY KEY,
       c2 INT,
       c3 TEXT
   );
   ```

1. レコードを挿入します。
   ```sql
   INSERT INTO schema0.t0 VALUES (1, 11, 'A');
   ```
   ```sql
   INSERT INTO schema1.t1 VALUeS (2, 22, 'B');
   ```
   ```sql
   BEGIN;
   INSERT INTO schema0.t0 VALUES (3, 33, 'C');
   INSERT INTO schema1.t1 VALUeS (4, 44, 'D');
   COMMIT;
   ```

1. すべてのレコードを選択します。
   ```sql
   SELECT * FROM schema0.t0;
   ```
   ```sql
   SELECT * FROM schema1.t1;
   ```

## バックエンド DB のレコードを確認します (テスト専用。本番環境ではバックエンド DB から直接レコードを取得することは推奨されません。)

1. MySQL (バックエンド DB 0) からレコードを選択します。
   ```sql
   kubectl exec -it mysql-scalardb-0 -- mysql -u root -p schema0 -e "SELECT c1, c2, c3, tx_id FROM t0"
   ```
   * パスワードは `mysql` です。

1. PostgreSQL (バックエンド DB 1) からレコードを選択します。
   ```sql
   kubectl exec -it postgresql-scalardb-0 -- psql -U postgres -c "SELECT c1, c2, c3, tx_id FROM schema1.t1"
   ```
   * パスワードは`postgres` です。
