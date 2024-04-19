# ScalarDB Analytics with PostgreSQL のカスタム値ファイルを構成する

このドキュメントでは、PostgreSQL チャートを使用した ScalarDB Analytics のカスタム値ファイルを作成する方法について説明します。 パラメーターの詳細については、ScalarDB Analytics with PostgreSQL チャートの [README](https://github.com/scalar-labs/helm-charts/blob/main/charts/scalardb-analytics-postgresql/README.md) を参照してください。

## 必要な構成

このセクションでは、PostgreSQL で ScalarDB Analytics のカスタム値ファイルを設定するときに必要な構成について説明します。

### データベース構成

PostgreSQL を使用した ScalarDB Analytics 経由でデータベースにアクセスするには、`database.properties` ファイルの構成に使用するのと同じ構文に従って、`scalardbAnalyticsPostgreSQL.databaseProperties` パラメータを設定する必要があります。 設定の詳細については、[ScalarDB Configurations](https://github.com/scalar-labs/scalardb/blob/master/docs/configurations.md) を参照してください。

```yaml
scalardbAnalyticsPostgreSQL:
  databaseProperties: |
    scalar.db.contact_points=localhost
    scalar.db.username=${env:SCALAR_DB_USERNAME:-}
    scalar.db.password=${env:SCALAR_DB_PASSWORD:-}
    scalar.db.storage=cassandra
```

### データベース名前空間の構成

PostgreSQL を使用した ScalarDB Analytics 経由で読み取りたいテーブルを含むすべてのデータベース名前空間に `schemaImporter.namespaces` を設定する必要があります。

```yaml
schemaImporter:
  namespaces:
    - namespace1
    - namespace2
    - namespace3
```

## オプションの構成

このセクションでは、PostgreSQL で ScalarDB Analytics のカスタム値ファイルを設定する場合のオプションの構成について説明します。

### リソース構成 (実稼働環境で推奨)

Kubernetes でリクエストと制限を使用してポッド リソースを制御するには、`scalardbAnalyticsPostgreSQL.resources` を使用できます。

Kubernetes のリクエストと制限と同じ構文を使用して、リクエストと制限を構成できます。 Kubernetes のリクエストと制限の詳細については、[Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)を参照してください。

```yaml
scalardbAnalyticsPostgreSQL:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi
```

### シークレット構成 (運用環境で推奨)

環境変数を使用して `scalardbAnalyticsPostgreSQL.databaseProperties` で資格情報などのいくつかのプロパティを設定するには、`scalardbAnalyticsPostgreSQL.secretName` を使用していくつかの資格情報を含むシークレット リソースを指定します。

たとえば、環境変数を使用してバックエンド データベースの資格情報 (`scalar.db.username` および `scalar.db.password`) を設定できるため、ポッドの安全性が高まります。

シークレットリソースの使用方法の詳細については、[シークレットリソースを使用して資格情報を環境変数としてプロパティファイルに渡す方法(./use-secret-for-credentials.md) を参照してください。

```yaml
scalardbAnalyticsPostgreSQL:
  secretName: "scalardb-analytics-postgresql-credentials-secret"
```

### アフィニティ構成 (運用環境で推奨)

Kubernetes でアフィニティとアンチアフィニティを使用してポッドのデプロイメントを制御するには、`scalardbAnalyticsPostgreSQL.affinity` を使用できます。

Kubernetes のアフィニティとアンチアフィニティと同じ構文を使用して、アフィニティとアンチアフィニティを構成できます。 Kubernetes でのアフィニティの構成の詳細については、[Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) を参照してください。

```yaml
scalardbAnalyticsPostgreSQL:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchExpressions:
              - key: app.kubernetes.io/name
                operator: In
                values:
                  - scalardb-analytics-postgresql
              - key: app.kubernetes.io/app
                operator: In
                values:
                  - scalardb-analytics-postgresql
          topologyKey: kubernetes.io/hostname
```

### SecurityContext 設定 (デフォルト値を推奨)

PostgreSQL ポッドを使用して ScalarDB Analytics の SecurityContext と PodSecurityContext を設定するには、`scalardbAnalyticsPostgreSQL.securityContext`、`scalardbAnalyticsPostgreSQL.podSecurityContext`、および `schemaImporter.securityContext` を使用できます。

Kubernetes の SecurityContext および PodSecurityContext と同じ構文を使用して、SecurityContext および PodSecurityContext を構成できます。 Kubernetes の SecurityContext および PodSecurityContext 構成の詳細については、[Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) を参照してください。

```yaml
scalardbAnalyticsPostgreSQL:
  podSecurityContext:
    fsGroup: 201
    seccompProfile:
      type: RuntimeDefault
  securityContext:
    capabilities:
      drop:
        - ALL
    runAsNonRoot: true
    runAsUser: 999
    allowPrivilegeEscalation: false

schemaImporter:
  securityContext:
    capabilities:
      drop:
        - ALL
    runAsNonRoot: true
    allowPrivilegeEscalation: false
```

### 画像構成 (デフォルト値を推奨)

イメージ リポジトリを変更する場合は、`scalardbAnalyticsPostgreSQL.image.repository` と `schemaImporter.image.repository` を使用して、プルする ScalarDB Analytics with PostgreSQL および Schema Importer イメージのコンテナ リポジトリ情報を指定できます。

```yaml
scalardbAnalyticsPostgreSQL:
  image:
    repository: <SCALARDB_ANALYTICS_WITH_POSTGRESQL_CONTAINER_IMAGE>

schemaImporter:
  image:
    repository: <SCHEMA_IMPORTER_CONTAINER_IMAGE>
```

### レプリカ構成 (環境に応じてオプション)

`scalardbAnalyticsPostgreSQL.replicaCount` を使用して、PostgreSQL レプリカ (ポッド) を使用した ScalarDB Analytics の数を指定できます。

```yaml
scalardbAnalyticsPostgreSQL:
  replicaCount: 3
```

### PostgreSQL database name configuration (optional based on your environment)

You can specify the database name that you create in PostgreSQL. Schema Importer creates some objects, such as a view of ScalarDB Analytics with PostgreSQL, in this database.

```yaml
scalardbAnalyticsPostgreSQL:
  postgresql:
    databaseName: scalardb
```

### PostgreSQL スーパーユーザーのパスワード設定 (環境に応じてオプション)

PostgreSQL のスーパーユーザーのパスワードを含むシークレット名を指定できます。

```yaml
scalardbAnalyticsPostgreSQL:
  postgresql:
    secretName: scalardb-analytics-postgresql-superuser-password
```

{% capture notice--info %}
**注記**

PostgreSQL で ScalarDB Analytics をデプロイする前に、この名前 (デフォルトでは `scalardb-analytics-postgresql-superuser-password`) でシークレット リソースを作成する必要があります。 詳細については、[シークレットリソースを準備する](how-to-deploy-scalardb-analytics-postgresql.md#シークレットリソースを準備する) を参照してください。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

### 汚染と許容の構成 (環境に応じてオプション)

Kubernetes でテイントと許容を使用してポッドのデプロイメントを制御したい場合は、`scalardbAnalyticsPostgreSQL.tolerations` を使用できます。

Kubernetes の許容と同じ構文を使用して、テイントと許容を構成できます。 Kubernetes での許容設定の詳細については、Kubernetes の公式ドキュメント [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) を参照してください。

```yaml
scalardbAnalyticsPostgreSQL:
  tolerations:
    - effect: NoSchedule
      key: scalar-labs.com/dedicated-node
      operator: Equal
      value: scalardb-analytics-postgresql
```
