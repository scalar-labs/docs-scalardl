# Scalar Manager のカスタム値ファイルを構成する

このドキュメントでは、Scalar Manager チャートのカスタム値ファイルを作成する方法について説明します。 パラメータの詳細を知りたい場合は、Scalar Manager チャートの [README](https://github.com/scalar-labs/helm-charts/blob/main/charts/scalar-manager/README.md) を参照してください。

## 必要な構成

### サービス構成

Kubernetes のサービス リソース タイプを指定するには、`service.type` を設定する必要があります。 プロバイダーが提供するロードバランサーを使用する場合は、`service.type`を`LoadBalancer`に設定する必要があります。

```yaml
service:
  type: LoadBalancer
```

### 画像構成

`image.repository`を設定する必要があります。 コンテナー リポジトリからイメージをプルできるように、必ず Scalar Manager コンテナー イメージを指定してください。

```yaml
image:
  repository: <SCALAR_MANAGER_IMAGE>
```

### ターゲット構成

`scalarManager.targets`を設定する必要があります。 ポッドの SRV レコードを返す DNS サービス URL を設定してください。 Kubernetes は、Scalar 製品のヘッドレス サービスの名前付きポートに対してこの URL を作成します。 形式は `_{port name}._{protocol}.{service name}.{namespace}.svc.{cluster domain name}` です。

You must set `scalarManager.targets`. Please set the DNS Service URL that returns the SRV record of pods. Kubernetes creates this URL for the named port of the headless service of the Scalar product. The format is `_{port name}._{protocol}.{service name}.{namespace}.svc.{cluster domain name}`.

```yaml
scalarManager:
  targets: 
    - name: Ledger
      adminSrv: _scalardl-admin._tcp.scalardl-headless.default.svc.cluster.local
      databaseType: cassandra
    - name: Auditor
      adminSrv: _scalardl-auditor-admin._tcp.scalardl-auditor-headless.default.svc.cluster.local
      databaseType: cassandra
```

### Grafana 構成

`scalarManager.grafanaUrl` を設定する必要があります。 Grafana URL を指定してください。

```yaml
scalarManager:
  grafanaUrl: "http://localhost:3000"
```

## オプションの構成

### レプリカ構成 (環境に応じてオプション)

Scalar Manager のレプリカ (ポッド) の数は、`replicaCount` を使用して指定できます。

```yaml
replicaCount: 3
```

### 更新間隔の構成 (環境に応じてオプション)

`scalarManager.refreshInterval` を使用して、Scalar Managerが製品のステータスをチェックする更新間隔を指定できます。

```yaml
scalarManager:
  refreshInterval: 30
```
