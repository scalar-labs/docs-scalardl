# Scalar Envoy のカスタム値ファイルを構成する

このドキュメントでは、Scalar Envoy チャートのカスタム値ファイルを作成する方法について説明します。 パラメータの詳細を知りたい場合は、Scalar Envoy チャートの [README](https://github.com/scalar-labs/helm-charts/blob/main/charts/envoy/README.md) を参照してください。

## Scalar Envoy チャートのカスタム値を構成する

Scalar Envoy チャートは他のチャート (scalardb、scalardb-cluster、scalardl、scalardl-audit) 経由で使用されるため、Scalar Envoy チャートのカスタム値ファイルを作成する必要はありません。 Scalar Envoy を設定したい場合は、`envoy.*` 設定を他のチャートに追加する必要があります。

たとえば、ScalarDB Server 用に Scalar Envoy を構成する場合は、次のように ScalarDB のカスタム値ファイルでいくつかの Scalar Envoy 構成を構成できます。

* 例 (scalardb-custom-values.yaml)
  ```yaml
  envoy:
    configurationsForScalarEnvoy: 
      ...
  
  scalardb:
    configurationsForScalarDB: 
       ...
  ```

## 必要な構成

### サービス構成

Kubernetes のサービス リソース タイプを指定するには、`envoy.service.type` を設定する必要があります。

Kubernetes クラスターの内部からのみクライアント リクエストを受け入れる場合 (たとえば、クライアント アプリケーションを Scalar 製品と同じ Kubernetes クラスターにデプロイする場合)、`envoy.service.type` を `ClusterIP` に設定できます。 この構成では、クラウド サービス プロバイダーが提供するロード バランサーは作成されません。

```yaml
envoy:
  service:
    type: ClusterIP
```

クラウド サービス プロバイダーが提供するロード バランサーを使用して、Kubernetes クラスターの外部からのクライアント リクエストを受け入れる場合は、`envoy.service.type` を `LoadBalancer` に設定する必要があります。

```yaml
envoy:
  service:
    type: LoadBalancer
```

アノテーションを介してロードバランサを設定したい場合は、アノテーションを `envoy.service.annotations` に設定することもできます。

```yaml
envoy:
  service:
    type: LoadBalancer
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-internal: "true"
      service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
```

## オプションの構成

### リソース構成 (本番環境で推奨)

Kubernetes のリクエストと制限を使用してポッド リソースを制御したい場合は、`envoy.resources` を使用できます。

これらは、Kubernetes のリクエストと制限と同じ構文を使用して構成できます。 そのため、Kubernetes の要求と制限の詳細については、公式ドキュメント [Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) を参照してください。

```yaml
envoy:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi
```

### アフィニティ構成 (運用環境で推奨)

Kubernetes のアフィニティと反アフィニティを使用してポッドのデプロイメントを制御したい場合は、`envoy.affinity` を使用できます。

Kubernetes のアフィニティと同じ構文を使用して構成できます。 そのため、Kubernetes のアフィニティ設定の詳細については、公式ドキュメント [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) を参照してください。

```yaml
envoy:
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        - podAffinityTerm:
            labelSelector:
              matchExpressions:
                - key: app.kubernetes.io/name
                  operator: In
                  values:
                    - scalardb-cluster
                - key: app.kubernetes.io/app
                  operator: In
                  values:
                    - envoy
            topologyKey: kubernetes.io/hostname
          weight: 50
```

### Prometheus および Grafana 構成 (実稼働環境で推奨)

[kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) を使用して Scalar Envoy ポッドを監視する場合は、`envoy.grafanaDashboard.enabled`、`envoy.serviceMonitor` を使用して、kube-prometheus-stack の ConfigMap、ServiceMonitor、および PrometheusRule リソースをデプロイできます。 `envoy.prometheusRule.enabled` と `envoy.prometheusRule.enabled`。

```yaml
envoy:
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

Scalar Envoy ポッドに SecurityContext と PodSecurityContext を設定する場合は、`envoy.securityContext` と `envoy.podSecurityContext` を使用できます。

KubernetesのSecurityContextやPodSecurityContextと同じ構文を使用して設定できます。 したがって、Kubernetes の SecurityContext および PodSecurityContext 構成の詳細については、公式ドキュメント [Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) を参照してください。

```yaml
envoy:
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

### 画像構成 (デフォルト値を推奨)

イメージ リポジトリとバージョンを変更したい場合は、`envoy.image.repository` を使用して、プルする Scalar Envoy コンテナ イメージのコンテナ リポジトリ情報を指定できます。

```yaml
envoy:
  image:
    repository: <SCALAR_ENVOY_CONTAINER_IMAGE>
```

AWS または Azure を使用している場合、詳細については次のドキュメントを参照してください。

* [How to install Scalar products through AWS Marketplace](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/AwsMarketplaceGuide.md)
* [How to install Scalar products through Azure Marketplace](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/AzureMarketplaceGuide.md)

### TLS 構成 (環境に応じてオプション)

以下の通信で TLS を有効にできます。

- クライアントと Scalar Envoy 間のダウンストリーム接続。
- Scalar Envoy と Scalar 製品間のアップストリーム接続。

#### ダウンストリーム接続で TLS を有効にする

次の設定により、ダウンストリーム接続で TLS を有効にできます。

```yaml
envoy:
  tls:
    downstream:
      enabled: true
      certChainSecret: "envoy-tls-cert"
      privateKeySecret: "envoy-tls-key"
```

この場合、次のように、Scalar Envoy の秘密キーと証明書ファイルを含むシークレットリソースを作成する必要があります。

```console
kubectl create secret generic envoy-tls-cert --from-file=cert-chain=/path/to/your/certificate/file -n <NAMESPACE>
kubectl create secret generic envoy-tls-key --from-file=private-key=/path/to/your/private/key/file -n <NAMESPACE>
```

秘密キーと証明書ファイルを準備する方法の詳細については、[Scalar 製品の秘密キーと証明書ファイルを作成する方法](../scalar-kubernetes/HowToCreateKeyAndCertificateFiles.md) を参照してください。

#### アップストリーム接続で TLS を有効にする

次の設定により、アップストリーム接続で TLS を有効にできます。

```yaml
envoy:
  tls:
    upstream:
      enabled: true
      overrideAuthority: "cluster.scalardb.example.com"
      caRootCertSecret: "scalardb-cluster-tls-ca"
```

この場合、次のように CA の証明書ファイルを含むシークレットリソースを作成する必要があります。 使用するアップストリーム (ScalarDB Cluster、ScalarDL Ledger、または ScalarDL Auditor) に応じて、対応するルート CA 証明書ファイルを設定する必要があります。

* ScalarDB Cluster

  ```console
  kubectl create secret generic scalardb-cluster-tls-ca --from-file=ca-root-cert=/path/to/root/ca/cert/file/for/scalardb-cluster -n <NAMESPACE>
  ```

* ScalarDL Ledger

  ```console
  kubectl create secret generic scalardl-ledger-tls-ca --from-file=ca-root-cert=/path/to/root/ca/cert/file/for/scalardl-ledger -n <NAMESPACE>
  ```

* ScalarDL Auditor

  ```console
  kubectl create secret generic scalardl-auditor-tls-ca --from-file=ca-root-cert=/path/to/root/ca/cert/file/for/scalardl-auditor -n <NAMESPACE>
  ```

秘密キーと証明書ファイルを準備する方法の詳細については、[Scalar 製品の秘密キーと証明書ファイルを作成する方法](../scalar-kubernetes/HowToCreateKeyAndCertificateFiles.md) を参照してください。

また、`envoy.tls.upstream.overrideAuthority` を使用して、TLS 通信のカスタム authority を設定することもできます。 実際に接続されているホストは変わりません。 これはテストを目的としていますが、DNS オーバーライドの代替としてテスト以外でも安全に使用できます。 たとえば、`scalardbCluster.tls.certChainSecret`、`ledger.tls.certChainSecret`、または `auditor.tls.certChainSecret` を使用して設定した証明書チェーンファイルに示されているホスト名を指定できます。 Envoy は、ScalarDB Cluster または ScalarDL との TLS 接続の証明書検証にこの値を使用します。

### レプリカ構成 (環境に応じてオプション)

Scalar Envoy のレプリカ (ポッド) の数は、`envoy.replicaCount` を使用して指定できます。

```yaml
envoy:
  replicaCount: 3
```

### 汚染と許容の構成 (環境に応じてオプション)

Kubernetes のテイントと許容を使用してポッドのデプロイメントを制御したい場合は、`envoy.tolerations` を使用できます。

Kubernetes の許容と同じ構文を使用して、テイントと許容を構成できます。 Kubernetes での許容設定の詳細については、Kubernetes の公式ドキュメント [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) を参照してください。

```yaml
envoy:
  tolerations:
    - effect: NoSchedule
      key: scalar-labs.com/dedicated-node
      operator: Equal
      value: scalardb
```
