# Kubernetes クラスター上の Scalar 製品からのログの収集

このドキュメントでは、Helm を使用して Grafana Loki と Promtail を Kubernetes にデプロイする方法について説明します。 このドキュメントに従うと、Kubernetes 環境で Scalar 製品のログを収集できます。

マネージド Kubernetes クラスターを使用しており、監視とログ記録にクラウド サービス機能を使用したい場合は、次のドキュメントを参照してください。

* [Logging and monitoring on Amazon EKS](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/amazon-eks-logging-monitoring.html)
* [Monitoring Azure Kubernetes Service (AKS) with Azure Monitor](https://learn.microsoft.com/en-us/azure/aks/monitor-aks)

## 前提条件

* Kubernetes クラスターを作成します。
  * [Scalar 製品用の EKS クラスターを作成する](CreateEKSClusterForScalarProducts.md)
  * [Scalar 製品用の AKS クラスターを作成する](CreateAKSClusterForScalarProducts.md)
* 要塞サーバーを作成し、`kubeconfig` を設定します。
  * [要塞サーバーの作成](CreateBastionServer.md)
* Prometheus Operator をデプロイします (収集されたログを調査するために Grafana を使用します)
  * [Kubernetes クラスター上の Scalar 製品の監視](K8sMonitorGuide.md)

## Grafana helm リポジトリを追加します

このドキュメントでは、Prometheus Operator のデプロイメントに Helm を使用します。

```console
helm repo add grafana https://grafana.github.io/helm-charts
```
```console
helm repo update
```

## カスタム値ファイルを準備する

loki-stack のサンプルファイル [scalar-loki-stack-custom-values.yaml](https://github.com/scalar-labs/scalar-kubernetes/blob/master/conf/scalar-loki-stack-custom-values.yaml)  を入手してください。 Scalar 製品のロギングには、このサンプル ファイルの構成をお勧めします。

### カスタム値ファイルに nodeSelector を設定します(本番環境で推奨)

本番環境では、次のように Scalar 製品のワーカーノードにラベルを追加することをお勧めします。

* [EKS - Add a label to the worker node that is used for nodeAffinity](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/CreateEKSClusterForScalarProducts.md#add-a-label-to-the-worker-node-that-is-used-for-nodeaffinity)
* [AKS - Add a label to the worker node that is used for nodeAffinity](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/CreateAKSClusterForScalarProducts.md#add-a-label-to-the-worker-node-that-is-used-for-nodeaffinity)

このドキュメントでデプロイされた promtail ポッドは Scalar 製品ログのみを収集するため、Scalar 製品が実行されているワーカーノードにのみ promtail ポッドをデプロイするだけで十分です。 したがって、Kubernetes ワーカーノードにラベルを追加する場合は、カスタム値ファイル (scalar-loki-stack-custom-values.yaml) で次のように nodeSelector を設定する必要があります。

* ScalarDB Cluster の例
  ```yaml
  promtail:
    nodeSelector:
      scalar-labs.com/dedicated-node: scalardb-cluster
  ```
* (非推奨)) ScalarDB Server の例
  ```yaml
  promtail:
    nodeSelector:
      scalar-labs.com/dedicated-node: scalardb
  ```
* ScalarDL Ledger の例
  ```yaml
  promtail:
    nodeSelector:
      scalar-labs.com/dedicated-node: scalardl-ledger
  ```
* ScalarDL Auditor の例
  ```yaml
  promtail:
    nodeSelector:
      scalar-labs.com/dedicated-node: scalardl-auditor
  ```

### カスタム値ファイルで許容値を設定する (運用環境で推奨)

運用環境では、次のように Scalar 製品のワーカーノードにテイントを追加することをお勧めします。

* [EKS - Add taint to the worker node that is used for toleration](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/CreateEKSClusterForScalarProducts.md#add-taint-to-the-worker-node-that-is-used-for-toleration)
* [AKS - Add taint to the worker node that is used for toleration](https://github.com/scalar-labs/scalar-kubernetes/blob/master/docs/CreateAKSClusterForScalarProducts.md#add-taint-to-the-worker-node-that-is-used-for-toleration)

promtail ポッドは DaemonSet としてデプロイされるため、Kubernetes ワーカーノードにテイントを追加する場合は、次のようにカスタム値ファイル (scalar-loki-stack-custom-values.yaml) で許容範囲を設定する必要があります。

* ScalarDB Cluster の例
  ```yaml
  promtail:
    tolerations:
      - effect: NoSchedule
        key: scalar-labs.com/dedicated-node
        operator: Equal
        value: scalardb-cluster
  ```
* (非推奨)) ScalarDB Server の例
  ```yaml
  promtail:
    tolerations:
      - effect: NoSchedule
        key: scalar-labs.com/dedicated-node
        operator: Equal
        value: scalardb
  ```
* ScalarDL Ledger の例
  ```yaml
  promtail:
    tolerations:
      - effect: NoSchedule
        key: scalar-labs.com/dedicated-node
        operator: Equal
        value: scalardl-ledger
  ```
* ScalarDL Auditor の例
  ```yaml
  promtail:
    tolerations:
      - effect: NoSchedule
        key: scalar-labs.com/dedicated-node
        operator: Equal
        value: scalardl-auditor
  ```

## Loki と Promtail をデプロイする

Loki と Promtail は、Prometheus や Grafana と同じ名前空間 `Monitoring` にデプロイすることをお勧めします。 `Monitoring` 名前空間は、ドキュメント [Kubernetes クラスター上の Scalar 製品の監視](K8sMonitorGuide.md) ですでに作成済みです。

```console
helm install scalar-logging-loki grafana/loki-stack -n monitoring -f scalar-loki-stack-custom-values.yaml
```

## Loki と Promtail がデプロイされているかどうかを確認する

Loki および Promtail ポッドが適切にデプロイされている場合は、`kubectl get pod -n monitoring` コマンドを使用して、`STATUS` が `Running` であることが確認できます。 promtail ポッドは DaemonSet としてデプロイされるため、promtail ポッドの数は Kubernetes ノードの数によって異なります。 次の例では、Kubernetes クラスター内に Scalar 製品のワーカーノードが 3 つあります。

```
$ kubectl get pod -n monitoring
NAME                                 READY   STATUS    RESTARTS   AGE
scalar-logging-loki-0                1/1     Running   0          35m
scalar-logging-loki-promtail-2fnzn   1/1     Running   0          32m
scalar-logging-loki-promtail-2pwkx   1/1     Running   0          30m
scalar-logging-loki-promtail-gfx44   1/1     Running   0          32m
```

## Grafana ダッシュボードでログを表示する

収集されたログは、次のように Grafana ダッシュボードで確認できます。

1. Grafana ダッシュボードにアクセスします。
1. `Explore` ページに移動します。
1. 左上のプルダウンから `Loki` を選択します。
1. ログを問い合わせる条件を設定する。
1. 右上の `Run query` ボタンを選択します。

Grafana ダッシュボードへのアクセス方法の詳細については、[Kubernetes クラスター上の Scalar 製品の監視](K8sMonitorGuide.md) を参照してください。
