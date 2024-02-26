# ScalarDB Cluster の制作チェックリスト

このチェックリストは、実稼働環境に ScalarDB Cluster をデプロイする際の推奨事項を提供します。

## あなたが始める前に

このチェックリストでは、推奨される管理対象 Kubernetes クラスターに ScalarDB Cluster をデプロイしていることを前提としています。

## 実稼働チェックリスト: ScalarDB Cluster

以下は、運用環境で ScalarDB Cluster をセットアップする際の推奨事項のチェックリストです。

### ポッドと Kubernetes ワーカーノードの数

Kubernetes クラスターの高可用性を確保するには、少なくとも 3 つのワーカーノードを使用し、ワーカーノード全体に少なくとも 3 つのポッドをデプロイする必要があります。 3 つのポッドをワーカーノードに分散させるための `podAntiAffinity` の [サンプル構成](../conf/scalardb-cluster-custom-values-indirect-mode.yaml) を参照できます。

{% capture notice--info %}
**注記**

ワーカーノードを異なるアベイラビリティ ゾーン (AZ) に配置すると、AZ の障害に耐えることができます。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

### ワーカーノードの仕様

商用ライセンスの観点から、ScalarDB Cluster を実行する 1 つのポッドのリソースは 2vCPU / 4GB メモリに制限されます。 また、ScalarDB Cluster ポッド以外の一部のポッドがワーカーノード上に存在します。

つまり、次のコンポーネントは 1 つのワーカーノード上で実行できます。

* ScalarDB Cluster ポッド (2vCPU / 4GB)
* Envoy プロキシ (`indirect` クライアント モードを使用する場合、または Java 以外のプログラミング言語を使用する場合)
* アプリケーション ポッド (同じワーカーノード上でアプリケーションのポッドを実行することを選択した場合)
* 監視コンポーネント (`kube-prometheus-stack` などの監視コンポーネントをデプロイする場合)
* Kubernetes コンポーネント

{% capture notice--info %}
**注記**

`direct-kubernetes` モードを使用する場合は、Envoy ポッドをデプロイする必要はありません。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

これを念頭に置いて、[ポッドと Kubernetes ワーカーノードの数](ProductionChecklistForScalarDBCluster.md#ポッドと-kubernetes-ワーカーノードの数) で説明されているように、少なくとも 4vCPU / 8GB のメモリ リソースを持つワーカーノードを使用し、可用性のために少なくとも 3 つのワーカーノードを使用する必要があります。

ただし、実稼働環境では、ノードあたり少なくとも 4vCPU / 8GB のメモリ リソースを備えた 3 つのノードが最小限です。 システムのワークロードに応じて、Kubernetes クラスターのリソース (ワーカーノードの数、ノードあたりの vCPU、ノードあたりのメモリ、ScalarDB Cluster  ポッド、アプリケーションのポッドなど) も考慮する必要があります。 また、[Horizontal Pod Autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) などの機能を使用してポッドを自動的にスケーリングすることを計画している場合は、ワーカーノード上のポッドの最大数を考慮してワーカーノードのリソースを決定する必要があります。

#### 通信網

ScalarDB Cluster はインターネット アクセス経由でユーザーに直接サービスを提供しないため、Kubernetes クラスターはプライベート ネットワーク上に作成する必要があります。 アプリケーションからプライベート ネットワーク経由で ScalarDB Cluster にアクセスすることをお勧めします。

### 監視とログ記録

デプロイされたコンポーネントを監視し、そのログを収集する必要があります。 詳細については、[Kubernetes クラスター上の Scalar 製品の監視](K8sMonitorGuide.md) および `Kubernetes クラスター上の Scalar 製品からのログの収集](./K8sLogCollectionGuide.md) を参照してください。

### バックアップと復元

バックエンド データベースで自動バックアップ機能とポイントインタイム リカバリ (PITR) 機能を有効にする必要があります。 詳細については、[ScalarDB/ScalarDL 導入用のデータベースのセットアップ](SetupDatabase.md) を参照してください。

## 運用チェックリスト: ScalarDB Cluster にアクセスするクライアント アプリケーション

以下は、実稼働環境で ScalarDB Cluster にアクセスするクライアント アプリケーションをセットアップする際の推奨事項のチェックリストです。

### クライアント モード (Java クライアント ライブラリのみ)

アプリケーションに Java を使用する場合、公式の Java クライアント ライブラリを使用できます。 この場合、[`direct-kubernetes mode`](https://github.com/scalar-labs/scalardb-cluster/blob/main/docs/developer-guide-for-scalardb-cluster-with-java-api.md#direct-kubernetes-client-mode) または [`indirect mode`](https://github.com/scalar-labs/scalardb-cluster/blob/main/docs/developer-guide-for-scalardb-cluster-with-java-api.md#indirect-client-mode) の 2 つのクライアント モードのいずれかを選択できます。

パフォーマンスの観点から、`direct-kubernetes` モードの使用をお勧めします。 `direct-kubernetes` モードを使用するには、アプリケーション ポッドを ScalarDB Cluster  ポッドと同じ Kubernetes クラスターにデプロイする必要があります。 この場合、Envoy ポッドをデプロイする必要はありません。

何らかの理由で Java アプリケーション ポッドを ScalarDB Cluster  ポッドと同じ Kubernetes クラスターにデプロイできない場合は、`indirect` モードを使用する必要があります。 この場合、Envoy ポッドをデプロイする必要があります。

{% capture notice--info %}
**注記**

クライアント モード設定は Java クライアント ライブラリ専用です。 アプリケーションに Java 以外のプログラミング言語を使用する場合 (基本的に、[gRPC API](https://github.com/scalar-labs/scalardb-cluster/blob/main/docs/scalardb-cluster-grpc-api-guide.md) または [gRPC SQL API](https://github.com/scalar-labs/scalardb-cluster/blob/main/docs/scalardb-cluster-sql-grpc-api-guide.md) をプログラミング言語から直接使用する場合)、そのような構成は存在しません。 この場合、Envoy ポッドをデプロイする必要があります。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

### トランザクション マネージャーの構成 (Java クライアント ライブラリのみ)

クライアント アプリケーションは、常に ScalarDB Cluster を通じてデータベースにアクセスする必要があります。 リクエストが適切に実行されていることを確認するには、クライアント アプリケーションのプロパティ ファイルをチェックし、CRUD API の使用時に `scalar.db.transaction_manager=cluster` が設定されていることを確認します。

#### 実稼働環境に推奨

```mermaid
flowchart LR
  app["<b>アプリ</b><br />gRPC を使用した ScalarDB Cluster ライブラリ"]
  server["<b>ScalarDB Cluster </b><br />Consensus Commit を備えた<br />ScalarDBライブラリ"]
  db[(基盤となるストレージまたはデータベース)]
  app --> server --> db
```

#### Not recommended for production environments (for testing purposes only)

```mermaid
flowchart LR
  app["<b>アプリ</b><br />Consensus Commit を備えた<br />ScalarDB Cluster ライブラリ"]
  db[(基盤となるストレージまたはデータベース)]
  app --> db
```

### SQL 接続構成 (Java クライアント ライブラリのみ)

クライアント アプリケーションは、常に ScalarDB Cluster を通じてデータベースにアクセスする必要があります。 リクエストが適切に実行されていることを確認するには、クライアント アプリケーションのプロパティ ファイルをチェックし、SQL API を使用するときに `scalar.db.sql.connection_mode=cluster` が設定されていることを確認します。

#### 実稼働環境に推奨

```mermaid
flowchart LR
  app["<b>アプリ</b><br />ScalarDB SQL ライブラリ (クラスター モード)"]
  server["<b>ScalarDB Cluster</b><br />Consensus Commit を備えた<br />ScalarDB ライブラリ"]
  db[(基盤となるストレージまたはデータベース)]
  app --> server --> db
```

#### 運用環境では推奨されません (テスト目的のみ)

```mermaid
flowchart LR
  app["<b>アプリ</b><br />ScalarDB SQL ライブラリ (ダイレクト モード)"]
  db[(基盤となるストレージまたはデータベース)]
  app --> db
```

### `direct-kubernetes` クライアント モードを使用する場合のクライアント アプリケーションのデプロイメント (Java クライアント ライブラリのみ)

[`direct-kubernetes` client mode](https://github.com/scalar-labs/scalardb-cluster/blob/main/docs/developer-guide-for-scalardb-cluster-with-java-api.md#direct-kubernetes-client-mode) を使用する場合は、クライアント アプリケーションを ScalarDB Cluster  デプロイメントと同じ Kubernetes クラスターにデプロイする必要があります。

また、`direct-kubernetes` クライアント モードを使用する場合は、クライアント アプリケーションが適切に動作するように追加の Kubernetes リソースをデプロイする必要があります。 詳細については、[Deploy your client application on Kubernetes with `direct-kubernetes` mode](https://github.com/scalar-labs/helm-charts/blob/main/docs/how-to-deploy-scalardb-cluster.md#deploy-your-client-application-on-kubernetes-with-direct-kubernetes-mode) を参照してください。

### トランザクション処理 (Java クライアント ライブラリと gRPC API)

トランザクションを [`begin()`](https://github.com/scalar-labs/scalardb/blob/master/docs/api-guide.md#begin-or-start-a-transaction) した後、アプリケーションが常に [`commit()`](https://github.com/scalar-labs/scalardb/blob/master/docs/api-guide.md#commit-a-transaction) または [`rollback()`](https://github.com/scalar-labs/scalardb/blob/master/docs/api-guide.md#roll-back-or-abort-a-transaction) を実行するようにする必要があります。 アプリケーションが `commit()` または `rollback()` を実行しない場合、アプリケーションで予期しない問題が発生したり、バックエンド データベースから一貫性のないデータが読み取られる可能性があります。

{% capture notice--info %}
**注記**

[gRPC API](https://github.com/scalar-labs/scalardb-cluster/blob/main/docs/scalardb-cluster-grpc-api-guide.md) または [SQL gRPC API](https://github.com/scalar-labs/scalardb-cluster/blob/main/docs/scalardb-cluster-sql-grpc-api-guide.md) を使用する場合、アプリケーションは、`Begin` サービスを呼び出してトランザクションを開始した後、`Commit` サービスまたは `Rollback` サービスを呼び出す必要があります。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

### 例外処理 (Java クライアント ライブラリと gRPC API)

アプリケーションがトランザクション例外を処理することを確認する必要があります。 詳細については、使用している API のドキュメントを参照してください。

* [Handle exceptions (Transactional API)](https://github.com/scalar-labs/scalardb/blob/master/docs/api-guide.md#handle-exceptions).
* [Handle exceptions (two-phase commit transactions API)](https://github.com/scalar-labs/scalardb/blob/master/docs/two-phase-commit-transactions.md#handle-exceptions)
* [Execute transactions (ScalarDB SQL API)](https://github.com/scalar-labs/scalardb-sql/blob/main/docs/sql-api-guide.md#execute-transactions)
* [Handle SQLException (ScalarDB JDBC)](https://github.com/scalar-labs/scalardb-sql/blob/main/docs/jdbc-guide.md#handle-sqlexception)
* [Error handling (ScalarDB Cluster gRPC API)](https://github.com/scalar-labs/scalardb-cluster/blob/main/docs/scalardb-cluster-grpc-api-guide.md#error-handling-1)
* [Error handling (ScalarDB Cluster SQL gRPC API)](https://github.com/scalar-labs/scalardb-cluster/blob/main/docs/scalardb-cluster-sql-grpc-api-guide.md#error-handling-1)
