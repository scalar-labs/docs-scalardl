# ScalarDL Ledger のカスタム値ファイルを構成する

このドキュメントでは、ScalarDL Ledger チャートのカスタム値ファイルを作成する方法について説明します。 パラメータの詳細を知りたい場合は、ScalarDL Ledger chartの [README](https://github.com/scalar-labs/helm-charts/blob/main/charts/scalardl/README.md) を参照してください。

## 必要な構成

### Scalar Envoy 構成

ScalarDL Ledger のカスタム値ファイルで Scalar Envoy 構成を設定する必要があります。 これは、ScalarDL Ledger を Kubernetes 環境にデプロイする場合、クライアント リクエストが gRPC リクエストのロード バランサーとして Scalar Envoy 経由で ScalarDL Ledger に送信されるためです。

Scalar Envoy 構成の詳細については、ドキュメント [Scalar Envoy のカスタム値ファイルの構成](configure-custom-values-envoy.md) を参照してください。

```yaml
envoy:
  configurationsForScalarEnvoy: 
    ...

ledger:
  configurationsForScalarDLLedger: 
    ...
```

### 画像構成

`ledger.image.repository` を設定する必要があります。 コンテナ リポジトリからイメージをプルできるように、ScalarDL Ledger コンテナ イメージを必ず指定してください。

```yaml
ledger:
  image:
    repository: <SCALARDL_LEDGER_CONTAINER_IMAGE>
```

AWS または Azure を使用している場合、詳細については次のドキュメントを参照してください。

* [How to install Scalar products through AWS Marketplace](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/AwsMarketplaceGuide.md)
* [How to install Scalar products through Azure Marketplace](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/AzureMarketplaceGuide.md)

### Ledger/データベースの構成

`ledger.ledgerProperties` を設定する必要があります。 `ledger.properties` をこのパラメータに設定してください。 ScalarDL Ledger の構成の詳細については、[ledger.properties](https://github.com/scalar-labs/scalar/blob/master/ledger/conf/ledger.properties) を参照してください。

```yaml
ledger:
  ledgerProperties: |
    scalar.db.contact_points=localhost
    scalar.db.username=cassandra
    scalar.db.password=cassandra
    scalar.db.storage=cassandra
    scalar.dl.ledger.proof.enabled=true
    scalar.dl.ledger.auditor.enabled=true
    scalar.dl.ledger.proof.private_key_path=/keys/ledger-key-file
```

### キー/証明書の構成

`scalar.dl.ledger.proof.enabled` を `true` に設定した場合 (この設定は ScalarDL Auditor を使用する場合に必要です)、秘密鍵ファイルを `scalar.dl.ledger.proof.private_key_path` に設定する必要があります。

この場合、秘密キー ファイルを ScalarDL Ledger ポッドにマウントする必要があります。

秘密キー ファイルをマウントする方法の詳細については、[ScalarDL Helm Charts のポッドにキーファイルと証明書ファイルをマウントする](mount-files-or-volumes-on-scalar-pods.md#scalardl-helm-charts-のポッドにキーファイルと証明書ファイルをマウントする) を参照してください。

## オプションの構成

### リソース構成 (本番環境で推奨)

Kubernetes のリクエストと制限を使用してポッド リソースを制御したい場合は、`ledger.resources` を使用できます。

商用ライセンスの観点から、Scalar 製品の 1 つのポッドのリソースは 2vCPU / 4GB メモリに制限されていることに注意してください。 また、AWS Marketplace から提供される従量課金制のコンテナを取得する場合、`resources.limits` で 2vCPU / 4GB を超えるメモリ構成でそれらのコンテナを実行することはできません。 この制限を超えると、ポッドは自動的に停止されます。

これらは、Kubernetes のリクエストと制限と同じ構文を使用して構成できます。 そのため、Kubernetes の要求と制限の詳細については、公式ドキュメント [Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) を参照してください。

```yaml
ledger:
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 2000m
      memory: 4Gi
```

### シークレット構成 (運用環境で推奨)

環境変数を使用して `ledger.ledgerProperties` 内の一部のプロパティ (資格情報など) を設定したい場合は、`ledger.secretName` を使用して、いくつかの資格情報を含む Secret リソースを指定できます。

たとえば、環境変数を使用してバックエンド データベースの資格情報 (`scalar.db.username` および `scalar.db.password`) を設定でき、これによりポッドの安全性が高まります。

Secret リソースの使用方法の詳細については、ドキュメント [Secret リソースを使用して資格情報を環境変数としてプロパティ ファイルに渡す方法](use-secret-for-credentials.md) を参照してください。

```yaml
ledger:
  secretName: "ledger-credentials-secret"
```

### アフィニティ構成 (運用環境で推奨)

Kubernetes のアフィニティと反アフィニティを使用してポッドのデプロイメントを制御したい場合は、`ledger.affinity` を使用できます。

Kubernetes のアフィニティと同じ構文を使用して構成できます。 そのため、Kubernetes のアフィニティ設定の詳細については、公式ドキュメント [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) を参照してください。

```yaml
ledger:
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        - podAffinityTerm:
            labelSelector:
              matchExpressions:
                - key: app.kubernetes.io/name
                  operator: In
                  values:
                    - scalardl
                - key: app.kubernetes.io/app
                  operator: In
                  values:
                    - ledger
            topologyKey: kubernetes.io/hostname
          weight: 50
```

### Prometheus/Grafana 構成 (運用環境で推奨)

[kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) を使用して ScalarDL Ledger ポッドを監視する場合は、`ledger.grafanaDashboard.enabled`、`ledger.serviceMonitor` を使用して、kube-prometheus-stack の ConfigMap、ServiceMonitor、および PrometheusRule リソースをデプロイできます。 `enabled` および `ledger.prometheusRule.enabled`。

```yaml
ledger:
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

ScalarDL Ledger ポッドに SecurityContext と PodSecurityContext を設定したい場合は、`ledger.securityContext` と `ledger.podSecurityContext` を使用できます。

KubernetesのSecurityContextやPodSecurityContextと同じ構文を使用して設定できます。 したがって、Kubernetes の SecurityContext および PodSecurityContext 構成の詳細については、公式ドキュメント [Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) を参照してください。

```yaml
ledger:
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

`ledger.replicaCount` を使用して ScalarDL Ledger のレプリカ(ポッド)の数を指定できます。

```yaml
ledger:
  replicaCount: 3
```

### ロギング構成 (環境に応じてオプション)

ScalarDL Ledger のログレベルを変更したい場合は、`ledger.scalarLedgerConfiguration.ledgerLogLevel` を使用できます。

```yaml
ledger:
  scalarLedgerConfiguration:
    ledgerLogLevel: INFO
```

### 汚染と許容の構成 (環境に応じてオプション)

Kubernetes のテイントと許容を使用してポッドのデプロイメントを制御したい場合は、`ledger.tolerations` を使用できます。

Kubernetes の許容と同じ構文を使用して、テイントと許容を構成できます。 Kubernetes での許容設定の詳細については、Kubernetes の公式ドキュメント [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) を参照してください。

```yaml
ledger:
  tolerations:
    - effect: NoSchedule
      key: scalar-labs.com/dedicated-node
      operator: Equal
      value: scalardl-ledger
```
