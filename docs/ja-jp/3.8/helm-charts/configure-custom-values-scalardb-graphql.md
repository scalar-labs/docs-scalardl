# [非推奨] ScalarDB GraphQL のカスタム値ファイルを構成する

{% capture notice--info %}
**注記**

ScalarDB GraphQL サーバーは非推奨になりました。 代わりに[ScalarDB Cluster](configure-custom-values-scalardb-cluster.md) を使用してください。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

このドキュメントでは、ScalarDB GraphQL チャートのカスタム値ファイルを作成する方法について説明します。 パラメータの詳細を知りたい場合は、ScalarDB GraphQL チャートの [README](https://github.com/scalar-labs/helm-charts/blob/main/charts/scalardb-graphql/README.md) を参照してください。

## 必要な構成

### イングレス構成

クライアントリクエストをリッスンするには `ingress` を設定する必要があります。 複数の GraphQL サーバーをデプロイする場合、トランザクションを適切に処理するにはセッション アフィニティが必要です。 これは、GraphQL サーバーがトランザクションをメモリ内に保持するため、継続トランザクションを使用する GraphQL クエリは、トランザクションを開始したのと同じサーバーにルーティングする必要があるためです。

たとえば、NGINX Ingress Controller を使用する場合、次のように Ingress 構成を設定できます。

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/session-cookie-path: /
    nginx.ingress.kubernetes.io/affinity: cookie
    nginx.ingress.kubernetes.io/session-cookie-name: INGRESSCOOKIE
    nginx.ingress.kubernetes.io/session-cookie-hash: sha1
    nginx.ingress.kubernetes.io/session-cookie-max-age: "300"
  hosts:
    - host: ""
      paths:
        - path: /graphql
          pathType: Exact
```

AWSのALBを利用する場合、以下のようにIngress設定を行うことができます。

```yaml
ingress:
  enabled: true
  className: alb
  annotations:
    alb.ingress.kubernetes.io/scheme: internal
    alb.ingress.kubernetes.io/target-group-attributes: stickiness.enabled=true,stickiness.lb_cookie.duration_seconds=60
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/healthcheck-path: /graphql?query=%7B__typename%7D
  hosts:
    - host: ""
      paths:
        - path: /graphql
          pathType: Exact
```

### 画像構成

`image.repository`を設定する必要があります。 コンテナー リポジトリからイメージをプルできるように、ScalarDB GraphQL コンテナー イメージを必ず指定してください。

```yaml
image:
  repository: <SCALARDB_GRAPHQL_SERVER_CONTAINER_IMAGE>
```

AWS または Azure を使用している場合、詳細については次のドキュメントを参照してください。

* [How to install Scalar products through AWS Marketplace](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/AwsMarketplaceGuide.md)
* [How to install Scalar products through Azure Marketplace](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/AzureMarketplaceGuide.md)

### データベース構成

`scalarDbGraphQlConfiguration`を設定する必要があります。

ScalarDB Server を ScalarDB GraphQL とともに使用する場合 (推奨)、ScalarDB Server ポッドにアクセスするように構成を設定する必要があります。

```yaml
scalarDbGraphQlConfiguration:
  contactPoints: <ScalarDB Server host>
  contactPort: 60051
  storage: "grpc"
  transactionManager: "grpc"
  namespaces: <Schema name includes tables>
```

## オプションの構成

### リソース構成 (本番環境で推奨)

Kubernetes のリクエストと制限を使用してポッド リソースを制御したい場合は、`resources` を使用できます。

商用ライセンスの観点から、Scalar 製品の 1 つのポッドのリソースは 2vCPU / 4GB メモリに制限されていることに注意してください。 また、AWS Marketplace から提供される従量課金制のコンテナを取得する場合、`resources.limits` で 2vCPU / 4GB を超えるメモリ構成でそれらのコンテナを実行することはできません。 この制限を超えると、ポッドは自動的に停止されます。

これらは、Kubernetes のリクエストと制限と同じ構文を使用して構成できます。 そのため、Kubernetes の要求と制限の詳細については、公式ドキュメント [Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) を参照してください。

```yaml
resources:
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 2000m
    memory: 4Gi
```

### アフィニティ構成 (運用環境で推奨)

Kubernetes のアフィニティと反アフィニティを使用してポッドのデプロイメントを制御したい場合は、`affinity` を使用できます。

Kubernetes のアフィニティと同じ構文を使用して構成できます。 そのため、Kubernetes のアフィニティ設定の詳細については、公式ドキュメント [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) を参照してください。

```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - podAffinityTerm:
          labelSelector:
            matchExpressions:
              - key: app.kubernetes.io/app
                operator: In
                values:
                  - scalardb-graphql
          topologyKey: kubernetes.io/hostname
        weight: 50
```

### Prometheus/Grafana 構成 (運用環境で推奨)

[kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) を使用して ScalarDB GraphQL ポッドを監視する場合は、`grafanaDashboard.enabled`、`serviceMonitor.enabled`、および  `prometheusRule.enabled`。

```yaml
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

ScalarDB GraphQL ポッドに SecurityContext と PodSecurityContext を設定したい場合は、`securityContext` と `podSecurityContext` を使用できます。

KubernetesのSecurityContextやPodSecurityContextと同じ構文を使用して設定できます。 したがって、Kubernetes の SecurityContext および PodSecurityContext 構成の詳細については、公式ドキュメント [Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) を参照してください。

```yaml
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

### GraphQL サーバー構成 (環境に応じてオプション)

graphql クエリを実行するパスを変更したい場合は、`scalarDbGraphQlConfiguration.path` を使用できます。 デフォルトでは、`http://<FQDN of ingress>:80/graphql` を使用して graphql クエリを実行できます。

`scalarDbGraphQlConfiguration.graphiql`を使用して[GraphiQL](https://github.com/graphql/graphiql/tree/main/packages/graphiql) を有効/無効にすることもできます。

```yaml
scalarDbGraphQlConfiguration:
  path: /graphql
  graphiql: "true"
```

### TLS 構成 (環境に応じてオプション)

クライアントとイングレスの間で TLS を使用したい場合は、`ingress.tls` を使用できます。

秘密キーと証明書ファイルを含むシークレット リソースを作成する必要があります。 Ingress の Secret リソースの詳細については、公式ドキュメント [Ingress - TLS](https://kubernetes.io/docs/concepts/services-networking/ingress/#tls) を参照してください。

```yaml
ingress:
  tls:
    - hosts:
        - foo.example.com
        - bar.example.com
        - bax.example.com
      secretName: graphql-ingress-tls
```

### レプリカ構成 (環境に応じてオプション)

ScalarDB GraphQL のレプリカ (ポッド) の数は、`replicaCount` を使用して指定できます。

```yaml
replicaCount: 3
```

### ロギング構成 (環境に応じてオプション)

ScalarDB GraphQL のログレベルを変更したい場合は、`scalarDbGraphQlConfiguration.logLevel` を使用できます。

```yaml
scalarDbGraphQlConfiguration:
  logLevel: INFO
```

### 汚染と許容の構成 (環境に応じてオプション)

Kubernetes のテイントと許容範囲を使用してポッドのデプロイメントを制御したい場合は、`tolerations` を使用できます。

Kubernetes の許容と同じ構文を使用して、テイントと許容を構成できます。 Kubernetes での許容設定の詳細については、Kubernetes の公式ドキュメント [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) を参照してください。

```yaml
tolerations:
  - effect: NoSchedule
    key: scalar-labs.com/dedicated-node
    operator: Equal
    value: scalardb
```
