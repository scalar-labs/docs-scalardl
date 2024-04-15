# [非推奨] ScalarDB Server のカスタム値ファイルを構成する

{% capture notice--info %}
**注記**

ScalarDB Server は非推奨になりました。 代わりに [ScalarDB Cluster](configure-custom-values-scalardb-cluster.md) を使用してください。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

このドキュメントでは、ScalarDB Server  チャートのカスタム値ファイルを作成する方法について説明します。 パラメータの詳細を知りたい場合は、ScalarDB Server チャートの [README](https://github.com/scalar-labs/helm-charts/blob/main/charts/scalardb/README.md) を参照してください。

## 必要な構成

### Scalar Envoy 構成

ScalarDB Server のカスタム値ファイルに Scalar Envoy 構成を設定する必要があります。 これは、ScalarDB Server を Kubernetes 環境にデプロイする場合、クライアント リクエストが gRPC リクエストのロード バランサーとして Scalar Envoy 経由で ScalarDB Server に送信されるためです。

Scalar Envoy 構成の詳細については、ドキュメント [Scalar Envoy のカスタム値ファイルの構成](configure-custom-values-envoy.md) を参照してください。

```yaml
envoy:
  configurationsForScalarEnvoy: 
    ...

scalardb:
  configurationsForScalarDB: 
    ...
```

### 画像構成

`scalardb.image.repository`を設定する必要があります。 コンテナー リポジトリからイメージをプルできるように、必ず ScalarDB Server コンテナー イメージを指定してください。

```yaml
scalardb:
  image:
    repository: <SCALARDB_SERVER_CONTAINER_IMAGE>
```

AWS または Azure を使用している場合、詳細については次のドキュメントを参照してください。

* [How to install Scalar products through AWS Marketplace](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/AwsMarketplaceGuide.md)
* [How to install Scalar products through Azure Marketplace](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/AzureMarketplaceGuide.md)

### データベース構成

`scalardb.databaseProperties` を設定する必要があります。 `database.properties` をこのパラメータに設定してください。 ScalarDB Server の設定の詳細については、[Configure ScalarDB Server](https://github.com/scalar-labs/scalardb/blob/master/docs/scalardb-server.md#configure-scalardb-server) を参照してください。

```yaml
scalardb:
  databaseProperties: |
    scalar.db.server.port=60051
    scalar.db.server.prometheus_exporter_port=8080
    scalar.db.server.grpc.max_inbound_message_size=
    scalar.db.server.grpc.max_inbound_metadata_size=
    scalar.db.contact_points=localhost
    scalar.db.username=cassandra
    scalar.db.password=cassandra
    scalar.db.storage=cassandra
    scalar.db.transaction_manager=consensus-commit
    scalar.db.consensus_commit.isolation_level=SNAPSHOT
    scalar.db.consensus_commit.serializable_strategy=
    scalar.db.consensus_commit.include_metadata.enabled=false
```

## オプションの構成

### リソース構成 (本番環境で推奨)

Kubernetes のリクエストと制限を使用してポッド リソースを制御したい場合は、`scalardb.resources` を使用できます。

商用ライセンスの観点から、Scalar 製品の 1 つのポッドのリソースは 2vCPU / 4GB メモリに制限されていることに注意してください。 また、AWS Marketplace から提供される従量課金制のコンテナを取得する場合、`resources.limits` で 2vCPU / 4GB を超えるメモリ構成でそれらのコンテナを実行することはできません。 この制限を超えると、ポッドは自動的に停止されます。

これらは、Kubernetes のリクエストと制限と同じ構文を使用して構成できます。 そのため、Kubernetes の要求と制限の詳細については、公式ドキュメント [Pod およびコンテナーのリソース管理](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) を参照してください。

```yaml
scalardb:
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 2000m
      memory: 4Gi
```

### シークレット構成 (運用環境で推奨)

環境変数を使用して `scalardb.databaseProperties` 内の一部のプロパティ (資格情報など) を設定したい場合は、`scalardb.secretName` を使用して、いくつかの資格情報を含む Secret リソースを指定できます。

たとえば、環境変数を使用してバックエンド データベースの資格情報 (`scalar.db.username` および `scalar.db.password`) を設定でき、これによりポッドの安全性が高まります。

Secret リソースの使用方法の詳細については、ドキュメント [Secret リソースを使用して資格情報を環境変数としてプロパティ ファイルに渡す方法](use-secret-for-credentials.md) を参照してください。

```yaml
scalardb:
  secretName: "scalardb-credentials-secret"
```

### アフィニティ構成 (運用環境で推奨)

Kubernetes のアフィニティと反アフィニティを使用してポッドのデプロイメントを制御したい場合は、`scalardb.affinity` を使用できます。

Kubernetes のアフィニティと同じ構文を使用して構成できます。 そのため、Kubernetes のアフィニティ設定の詳細については、公式ドキュメント [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) を参照してください。

```yaml
scalardb:
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        - podAffinityTerm:
            labelSelector:
              matchExpressions:
                - key: app.kubernetes.io/name
                  operator: In
                  values:
                    - scalardb
                - key: app.kubernetes.io/app
                  operator: In
                  values:
                    - scalardb
            topologyKey: kubernetes.io/hostname
          weight: 50
```

### Prometheus/Grafana 構成 (運用環境で推奨)

[kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) を使用して ScalarDB Server ポッドを監視する場合は、`scalardb.grafanaDashboard.enabled`、`scalardb.serviceMonitor` を使用して、kube-prometheus-stack の ConfigMap、ServiceMonitor、および PrometheusRule リソースをデプロイできます。 `enabled`および `scalardb.prometheusRule.enabled`。

```yaml
scalardb:
  grafanaDashboard:
    enabled: true
    namespace: monitoring
  serviceMonitor:
    enabled: true
    namespace: monitoring
    interval: 15s
  prometheusRule:
    enabled: true
    namespace: monitoring
```

### SecurityContext 設定 (デフォルト値を推奨)

ScalarDB Server ポッドに SecurityContext と PodSecurityContext を設定したい場合は、`scalardb.securityContext` と `scalardb.podSecurityContext` を使用できます。

KubernetesのSecurityContextやPodSecurityContextと同じ構文を使用して設定できます。 したがって、Kubernetes の SecurityContext および PodSecurityContext 構成の詳細については、公式ドキュメント [Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) を参照してください。

```yaml
scalardb:
  podSecurityContext:
    seccompProfile:
      type: RuntimeDefault
  securityContext:
    capabilities:
      drop:
        - ALL
    runAsNonRoot: true
    allowPrivilegeEscalation: false
```

### レプリカ構成 (環境に応じてオプション)

`scalardb.replicaCount` を使用して、ScalarDB Serverのレプリカ(ポッド)の数を指定できます。

```yaml
scalardb:
  replicaCount: 3
```

### ロギング構成 (環境に応じてオプション)

ScalarDB Server のログレベルを変更したい場合は、`scalardb.storageConfiguration.dbLogLevel` を使用できます。

```yaml
scalardb:
  storageConfiguration:
    dbLogLevel: INFO
```

### 汚染と許容の構成 (環境に応じてオプション)

Kubernetes のテイントと許容を使用してポッドのデプロイメントを制御したい場合は、`scalardb.tolerations` を使用できます。

Kubernetes の許容と同じ構文を使用して、テイントと許容を構成できます。 Kubernetes での許容設定の詳細については、Kubernetes の公式ドキュメント [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) を参照してください。

```yaml
scalardb:
  tolerations:
    - effect: NoSchedule
      key: scalar-labs.com/dedicated-node
      operator: Equal
      value: scalardb
```
