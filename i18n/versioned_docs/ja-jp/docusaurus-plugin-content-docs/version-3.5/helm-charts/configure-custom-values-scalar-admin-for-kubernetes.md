# Scalar Admin for Kubernetes のカスタム値ファイルを構成する

このドキュメントでは、Scalar Admin for Kubernetes チャートのカスタム値ファイルを作成する方法について説明します。 パラメーターの詳細については、Scalar Admin for Kubernetes チャートの [README](https://github.com/scalar-labs/helm-charts/blob/main/charts/scalar-admin-for-kubernetes/README.md) を参照してください。

## 必要な構成

このセクションでは、Scalar Admin for Kubernetes のカスタム値ファイルをセットアップするときに必要な構成について説明します。

### フラグ設定

Scalar Admin for Kubernetes を実行するには、配列として `scalarAdminForKubernetes.commandArgs` にいくつかのフラグを指定する必要があります。 フラグの詳細については、Scalar Admin for Kubernetes の [README](https://github.com/scalar-labs/scalar-admin-for-kubernetes/blob/main/README.md) を参照してください。

```yaml
scalarAdminForKubernetes:
  commandArgs:
    - -r
    - <HELM_RELEASE_NAME>
    - -n
    - <SCALAR_PRODUCT_NAMESPACE>
    - -d
    - <PAUSE_DURATION>
    - -z
    - <TIMEZONE>
```

## オプションの構成

このセクションでは、Scalar Admin for Kubernetes のカスタム値ファイルをセットアップするときのオプションの構成について説明します。

### CronJob 構成 (環境に応じてオプション)

デフォルトでは、Scalar Admin for Kubernetes チャートは、Scalar Admin for Kubernetes CLI ツールを 1 回実行するための [Job](https://kubernetes.io/docs/concepts/workloads/controllers/job/) リソースを作成します。 [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) を使用して Scalar Admin for Kubernetes CLI ツールを定期的に実行する場合は、`scalarAdminForKubernetes.jobType` を `cronjob` に設定できます。 また、CronJob リソースのいくつかの構成を設定することもできます。

```yaml
scalarAdminForKubernetes:
  cronJob:
    timeZone: "Etc/UTC"
    schedule: "0 0 * * *"
```

### リソース構成 (実稼働環境で推奨)

Kubernetes でリクエストと制限を使用してポッド リソースを制御するには、`scalarAdminForKubernetes.resources` を使用できます。

Kubernetes のリクエストと制限と同じ構文を使用して、リクエストと制限を構成できます。 Kubernetes のリクエストと制限の詳細については、[Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) を参照してください。

```yaml
scalarAdminForKubernetes:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi
```

### SecurityContext 設定 (デフォルト値を推奨)

Scalar Admin for Kubernetes ポッドの SecurityContext と PodSecurityContext を設定するには、`scalarAdminForKubernetes.securityContext` と `scalarAdminForKubernetes.podSecurityContext` を使用できます。

Kubernetes の SecurityContext および PodSecurityContext と同じ構文を使用して、SecurityContext および PodSecurityContext を構成できます。 Kubernetes の SecurityContext および PodSecurityContext 構成の詳細については、[Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) を参照してください。

```yaml
scalarAdminForKubernetes:
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

イメージ リポジトリを変更する場合は、`scalarAdminForKubernetes.image.repository` を使用して、プルする Scalar Admin for Kubernetes イメージのコンテナ リポジトリ情報を指定できます。

```yaml
scalarAdminForKubernetes:
  image:
    repository: <SCALAR_ADMIN_FOR_KUBERNETES_CONTAINER_IMAGE>
```

### 汚染と許容の構成 (環境に応じてオプション)

Kubernetes のテイントと許容を使用してポッドのデプロイメントを制御したい場合は、`scalarAdminForKubernetes.tolerations` を使用できます。

Kubernetes の許容と同じ構文を使用して、テイントと許容を構成できます。 Kubernetes での許容設定の詳細については、Kubernetes の公式ドキュメント [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) を参照してください。

```yaml
scalarAdminForKubernetes:
  tolerations:
    - effect: NoSchedule
      key: scalar-labs.com/dedicated-node
      operator: Equal
      value: scalardb-analytics-postgresql
```
