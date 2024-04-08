# Helm Charts の入門 (Scalar Manager)
Scalar Manager は、ユーザーに次のことを可能にする Web ベースのダッシュボードです。
* Scalar 製品の健全性をチェックします
* Scalar 製品を一時停止および一時停止解除して、基礎となるデータベースをバックアップまたは復元します
* Grafana ダッシュボードを通じて Scalar 製品のメトリクスとログを確認します

ユーザーは、Scalar Manager を通じて Scalar 製品を一時停止または一時停止解除して、基礎となるデータベースをバックアップまたは復元できます。
Scalar Manager には、ユーザーが Scalar 製品のメトリクスやログを確認できる Grafana エクスプローラーも組み込まれています。

## 予測
このガイドは、ユーザーがモニタリングおよびロギング ツールを備えた Scalar 製品を Kubernetes クラスターにデプロイする方法を理解していることを前提としています。
まだの場合は、このガイドの前に [Scalar Helm Charts の入門](getting-started-scalar-helm-charts.md) から始めてください。

## 要件

* [GitHub Packages][GitHub Packages](https://github.com/orgs/scalar-labs/packages) から Scalar Manager コンテナ (`scalar-manager`) をプルするには権限が必要です。
* 上記のコンテナをプルするには、[GitHub ドキュメント](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) に従って `read:packages` スコープの Github Personal Access Token (PAT) を作成する必要があります。

## 私たちが作るもの

次のように、次のコンポーネントを Kubernetes クラスターにデプロイします。

```
+--------------------------------------------------------------------------------------------------+
| +----------------------+                                                                         |
| |    scalar-manager    |                                                                         |
| |                      |                                                                         |
| | +------------------+ | --------------------------(管理)--------------------------+           |
| | |  Scalar Manager  | |                                                             |           |
| | +------------------+ |                                                             |           |
| +--+-------------------+                                                             |           |
|    |                                                                                 |           |
| +------------------------------------+                                               |           |
| |             loki-stack             |                                               V           |
| |                                    |                                       +-----------------+ |
| | +--------------+  +--------------+ | <----------------(ログ)--------------- | Scalar 製品 | |
| | |     Loki     |  |   Promtail   | |                                       |                 | |
| | +--------------+  +--------------+ |                                       |  +-----------+  | |
| +------------------------------------+                                       |  | ScalarDB  |  | |
|    |                                                                         |  +-----------+  | |
| +------------------------------------------------------+                     |                 | |
| |                kube-prometheus-stack                 |                     |  +-----------+  | |
| |                                                      |                     |  | ScalarDL  |  | |
| | +--------------+  +--------------+  +--------------+ | -----(監視)----> |  +-----------+  | |
| | |  Prometheus  |  | Alertmanager |  |   Grafana    | |                     +-----------------+ |
| | +-------+------+  +------+-------+  +------+-------+ |                                         |
| |         |                |                 |         |                                         |
| |         +----------------+-----------------+         |                                         |
| |                          |                           |                                         |
| +--------------------------+---------------------------+                                         |
|    |                       |                                                                     |
|    |                       |         Kubernetes                                                  |
+----+-----------------------+---------------------------------------------------------------------+
     |                       |
  localhost (127.0.0.1) に公開するか、ロードバランサーなどを使用してアクセスします
     |                       |
  (HTTP経由でダッシュボードにアクセス)
     |                       |
+----+----+             +----+----+
| ブラウザ | <-(埋め込む)-- + ブラウザ |
+---------+             +---------+
```

## ステップ 1. Grafana を埋め込めるように `kube-prometheus-stack` をアップグレードします。

1. この値を `kube-prometheus-stack` のカスタム値ファイル (scalar-prometheus-custom-values.yaml など) に追加または修正します。
   ```yaml
   grafana:
     grafana.ini:
       security:
         allow_embedding: true
         cookie_samesite: disabled
   ```

1. Helm インストールをアップグレードします。
   ```console
   helm upgrade scalar-monitoring prometheus-community/kube-prometheus-stack -n monitoring -f scalar-prometheus-custom-values.yaml
   ```

## ステップ 2. Scalar Manager のカスタム値ファイルを準備する

1. `scalar-manager` のサンプル ファイル [scalar-manager-custom-values.yaml](./conf/scalar-manager-custom-values.yaml) を取得します。

1. 管理するターゲットを追加します。 たとえば、台帳クラスターを管理する場合は、次のように値を追加できます。
   ```yaml
   scalarManager:
     targets:
       - name: my-ledgers-cluster
         adminSrv: _scalardl-admin._tcp.scalardl-headless.default.svc.cluster.local
         databaseType: cassandra
   ```
   注記： `adminSrv` は、ポッドの SRV レコードを返す DNS サービス URL です。 Kubernetes は、Scalar 製品のヘッドレス サービスの名前付きポートに対してこの URL を作成します。 形式は `_{port name}._{protocol}.{service name}.{namespace}.svc.{cluster domain name}` です。

1. Grafana URL を設定します。 たとえば、`kube-prometheus-stack` の Grafana が `localhost:3000` で公開されている場合、次のように設定できます。
   ```yaml
   scalarManager:
     grafanaUrl: "http://localhost:3000"
   ```

1. Scalar Manager が製品のステータスをチェックする更新間隔を設定します。 デフォルト値は `30` 秒ですが、次のように変更できます。
   ```yaml
   scalarManager:
     refreshInterval: 60 # one minute
   ```

1. Scalar Manager にアクセスするためのサービス タイプを設定します。 デフォルト値は `ClusterIP` ですが、`minikubetunnel` コマンドや何らかのロードバランサを使ってアクセスする場合は、`LoadBalancer` として設定することができます。
   ```yaml
   service:
     type: LoadBalancer
   ```

## ステップ 3. `scalar-manager` をデプロイする

1. GitHub パッケージから Scalar Manager コンテナ イメージをプルするためのシークレット リソース `reg-docker-secrets` を作成します。
   ```console
   kubectl create secret docker-registry reg-docker-secrets --docker-server=ghcr.io --docker-username=<github-username> --docker-password=<github-personal-access-token>
   ```

1. `scalar-manager` Helm Chart をデプロイします。
   ```console
   helm install scalar-manager scalar-labs/scalar-manager -f scalar-manager-custom-values.yaml
   ```

## ステップ 4. Scalar Manager にアクセスする

### minikubeを使用する場合

1. Scalar Manager のサービス リソースを `localhost (127.0.0.1)` として公開するには、別のターミナルを開き、`minikube tunnel` コマンドを実行します。
   ```console
   minikube tunnel
   ```

1. URL `http://localhost:8000` でブラウザを開きます。

### minikube 以外の Kubernetes を使用する場合

minikube 以外の Kubernetes クラスターを使用する場合は、各 Kubernetes クラスターの方式に従って LoadBalancer サービスにアクセスする必要があります。 たとえば、クラウド サービスによって提供されるロード バランサーや `kubectl port-forward` コマンドを使用します。

## ステップ 5. Scalar Manager を削除する
1. `scalar-manager` をアンインストールします。
   ```console
   helm uninstall scalar-manager
   ```
