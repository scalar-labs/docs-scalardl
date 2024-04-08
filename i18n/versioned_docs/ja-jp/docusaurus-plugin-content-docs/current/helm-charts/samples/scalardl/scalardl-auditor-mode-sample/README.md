# Kubernetes での ScalarDL デプロイメント サンプル (Auditor モード)

## バージョン

このサンプルでは、各製品の以下のバージョンを使用しています。

* ScalarDL Ledger v3.5.3
* ScalarDL Auditor v3.5.3
* Scalar Envoy v1.3.0
* ScalarDL Schema Loader v3.5.0
* PostgreSQL v14.4
* Helm Chart: scalar-labs/scalardl v4.3.3
* Helm Chart: scalar-labs/scalardl-audit v2.3.3
* Helm Chart: scalar-labs/envoy v2.2.0
* Helm Chart: scalar-labs/schema-loading v2.6.0
* Helm Chart: bitnami/postgresql v11.6.26

## 環境

このサンプルでは、Kubernetes クラスター上に以下の環境を作成します。

```
+-----------------------------------------------------------------------------------------------------------------------------+
| [Kubernetes クラスター]                                                                                                        |
|                                             [ポッド]                                      [ポッド]                   [ポッド]        |
|                                                                                                                             |
|                                           +-------+                                 +---------+                             |
|                                     +---> | Envoy | ---+                      +---> | Ledger  | ---+                        |
|                                     |     +-------+    |                      |     +---------+    |                        |
|                                     |                  |                      |                    |                        |
|                      +---------+    |     +-------+    |     +-----------+    |     +---------+    |     +---------------+  |
|                +---> | サービス | ---+---> | Envoy | ---+---> |  サービス  | ---+---> | Ledger  | ---+---> |  PostgreSQL   |  |
|                |     | (Envoy) |    |     +-------+    |     | (Ledger)  |    |     +---------+    |     | (Ledger 用)  |  |
|                |     +---------+    |                  |     +-----------+    |                    |     +---------------+  |
|                |                    |     +-------+    |                      |     +---------+    |                        |
|                |                    +---> | Envoy | ---+                      +---> | Ledger  | ---+                        |
|  +--------+    |                          +-------+                                 +---------+                             |
|  | クライアント | ---+                                                                                                            |
|  +--------+    |                          +-------+                                 +---------+                             |
|                |                    +---> | Envoy | ---+                      +---> | Auditor | ---+                        |
|                |                    |     +-------+    |                      |     +---------+    |                        |
|                |                    |                  |                      |                    |                        |
|                |     +---------+    |     +-------+    |     +-----------+    |     +---------+    |     +---------------+  |
|                +---> | サービス | ---+---> | Envoy | ---+---> |  サービス  | ---+---> | Auditor | ---+---> |  PostgreSQL   |  |
|                      | (Envoy) |    |     +-------+    |     | (Auditor) |    |     +---------+    |     | (Auditor 用) |  |
|                      +---------+    |                  |     +-----------+    |                    |     +---------------+  |
|                                     |     +-------+    |                      |     +---------+    |                        |
|                                     +---> | Envoy | ---+                      +---> | Auditor | ---+                        |
|                                           +-------+                                 +---------+                             |
|                                                                                                                             |
+-----------------------------------------------------------------------------------------------------------------------------+
```

注記：監査によるビザンチン障害検出を適切に機能させるには、Ledger と Auditor を異なる管理ドメインに展開して管理する必要があります。 ただし、このサンプルでは、同じ Kubernetes クラスターにデプロイします。

## 準備

1. サンプルファイルを入手します。
   ```console
   git clone https://github.com/scalar-labs/helm-charts.git
   cd helm-charts/docs/samples/scalardl/scalardl-auditor-mode-sample/
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

1. Ledger 用に PostgreSQL をデプロイします。
   ```console
   helm install postgresql-ledger bitnami/postgresql \
     --set auth.postgresPassword=postgres \
     --set primary.persistence.enabled=false \
     --version 11.6.26
   ```

1. Auditor 用に PostgreSQL をデプロイします。
   ```console
   helm install postgresql-auditor bitnami/postgresql \
     --set auth.postgresPassword=postgres \
     --set primary.persistence.enabled=false \
     --version 11.6.26
   ```

## ScalarDL Ledger をデプロイする

1. DB 認証情報を含むシークレット リソースを作成します。
   ```console
   kubectl create secret generic ledger-credentials-secret \
     --from-literal=SCALAR_DB_USERNAME=postgres \
     --from-literal=SCALAR_DB_PASSWORD=postgres
   ```

1. 秘密鍵ファイルを含むシークレットリソースを作成します。
   ```console
   kubectl create secret generic ledger-key-secret \
     --from-file=ledger-key-file=./ledger-key.pem
   ```

1. ScalarDL Schema Loader をデプロイして、PostgreSQL 上に Ledger 用のスキーマを作成します。
   ```console
   helm install schema-ledger scalar-labs/schema-loading \
     -f ./schema-loader-ledger-custom-values.yaml \
     --version 2.6.0
   ```

1. ScalarDL Ledger を展開します。
   ```console
   helm install scalardl-ledger scalar-labs/scalardl \
     -f ./scalardl-ledger-custom-values.yaml \
     --version 4.3.3
   ```

## ScalarDL Auditor をデプロイする

1. DB 認証情報を含むシークレット リソースを作成します。
   ```console
   kubectl create secret generic auditor-credentials-secret \
     --from-literal=SCALAR_DB_USERNAME=postgres \
     --from-literal=SCALAR_DB_PASSWORD=postgres
   ```

1. 秘密キーと証明書ファイルを含むシークレット リソースを作成します。
   ```console
   kubectl create secret generic auditor-key-secret \
     --from-file=auditor-key-file=./auditor-key.pem \
     --from-file=auditor-cert-file=./auditor.pem
   ```

1. ScalarDL Schema Loader をデプロイして、PostgreSQL 上に Auditor 用のスキーマを作成します。
   ```console
   helm install schema-auditor scalar-labs/schema-loading \
     -f ./schema-loader-auditor-custom-values.yaml \
     --version 2.6.0
   ```

1. ScalarDL Auditor をデプロイします。
   ```console
   helm install scalardl-auditor scalar-labs/scalardl-audit \
     -f ./scalardl-auditor-custom-values.yaml \
     --version 2.3.3
   ```

## クライアントをデプロイする

1. 各秘密キーと証明書ファイルを含む秘密リソースを作成します。
   ```console
   kubectl create secret generic client-ledger-key-secret \
     --from-file=ledger-key-file=./ledger-key.pem \
     --from-file=ledger-cert-file=./ledger.pem
   ```
   ```console
   kubectl create secret generic client-auditor-key-secret \
     --from-file=auditor-key-file=./auditor-key.pem \
     --from-file=auditor-cert-file=./auditor.pem
   ```
   ```console
   kubectl create secret generic client-key-secret \
     --from-file=client-key-file=./client-key.pem \
     --from-file=client-cert-file=./client.pem
   ```

1. 各プロパティ ファイルを含む configmap リソースを作成します。
   ```console
   kubectl create configmap ledger-as-client-properties \
     --from-file=./ledger.as.client.properties
   ```
   ```console
   kubectl create configmap auditor-as-client-properties \
     --from-file=./auditor.as.client.properties
   ```
   ```console
   kubectl create configmap client-properties \
     --from-file=./client.properties
   ```

1. クライアントを展開します。
   ```console
   kubectl apply -f ./scalardl-client.yaml
   ```

## サンプルコントラクトを実行する

1. bash を使用してクライアント コンテナにアタッチします。
   ```console
   kubectl exec -it scalardl-client -- bash
   ```

1. サンプル コントラクトを構築して実行するためのいくつかのツールをインストールします。
   ```console
   apt update && DEBIAN_FRONTEND="noninteractive" TZ="Etc/UTC" apt install -y git openjdk-8-jdk curl unzip
   ```

1. ScalarDL Java Client SDK git リポジトリを複製し、サンプル コントラクトを構築します。
   ```console
   git clone https://github.com/scalar-labs/scalardl-java-client-sdk.git
   cd /scalardl-java-client-sdk/ 
   git checkout -b v3.5.3 refs/tags/v3.5.3
   ./gradlew assemble
   ```

1. ScalarDL の CLI ツールをダウンロードし、解凍します。
   ```console
   curl -OL https://github.com/scalar-labs/scalardl-java-client-sdk/releases/download/v3.5.3/scalardl-java-client-sdk-3.5.3.zip
   unzip ./scalardl-java-client-sdk-3.5.3.zip
   ```

1. Ledger、Auditor、client の証明書ファイルを登録します。
   ```console
   ./scalardl-java-client-sdk-3.5.3/bin/register-cert --properties /conf/ledger/ledger.as.client.properties
   ./scalardl-java-client-sdk-3.5.3/bin/register-cert --properties /conf/auditor/auditor.as.client.properties
   ./scalardl-java-client-sdk-3.5.3/bin/register-cert --properties /conf/client/client.properties
   ```

1. サンプルコントラクト `StateUpdater` を登録します。
   ```console
   ./scalardl-java-client-sdk-3.5.3/bin/register-contract --properties /conf/client/client.properties --contract-id StateUpdater --contract-binary-name com.org1.contract.StateUpdater --contract-class-file ./build/classes/java/main/com/org1/contract/StateUpdater.class
   ```

1. サンプルコントラクト `StateReader` を登録します。
   ```console
   ./scalardl-java-client-sdk-3.5.3/bin/register-contract --properties /conf/client/client.properties --contract-id StateReader --contract-binary-name com.org1.contract.StateReader --contract-class-file ./build/classes/java/main/com/org1/contract/StateReader.class
   ```

1. コントラクト `ValidateLedger` を登録します。
   ```console
   ./scalardl-java-client-sdk-3.5.3/bin/register-contract --properties /conf/client/client.properties --contract-id validate-ledger --contract-binary-name com.scalar.dl.client.contract.ValidateLedger --contract-class-file ./build/classes/java/main/com/scalar/dl/client/contract/ValidateLedger.class
   ```

1. コントラクト `StateUpdater` を実行します。 このサンプル コントラクトは、`test_asset` という名前のアセットの `state` (値) を `3` に更新します。
   ```console
   ./scalardl-java-client-sdk-3.5.3/bin/execute-contract --properties /conf/client/client.properties --contract-id StateUpdater --contract-argument '{"asset_id": "test_asset", "state": 3}'
   ```

1. コントラクト `StateReader` を実行します。
   ```console
   ./scalardl-java-client-sdk-3.5.3/bin/execute-contract --properties /conf/client/client.properties --contract-id StateReader --contract-argument '{"asset_id": "test_asset"}'
   ```

1. アセットの検証リクエストを実行します。
   ```console
   ./scalardl-java-client-sdk-3.5.3/bin/validate-ledger --properties /conf/client/client.properties --asset-id "test_asset"
   ```
