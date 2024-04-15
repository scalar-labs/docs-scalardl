# Kubernetes クラスター上の Scalar 製品の監視

このドキュメントでは、Helm を使用して Prometheus Operator を Kubernetes にデプロイする方法について説明します。 このドキュメントに従うと、Prometheus、Alertmanager、および Grafana を使用して、Kubernetes 環境上の Scalar 製品を監視できるようになります。

マネージド Kubernetes クラスターを使用しており、監視とログ記録にクラウド サービス機能を使用したい場合は、次のドキュメントを参照してください。

* [Logging and monitoring on Amazon EKS](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/amazon-eks-logging-monitoring.html)
* [Monitoring Azure Kubernetes Service (AKS) with Azure Monitor](https://learn.microsoft.com/en-us/azure/aks/monitor-aks)

## 前提条件

* Kubernetes クラスターを作成します。
    * [Scalar 製品用の EKS クラスターを作成する](CreateEKSClusterForScalarProducts.md)
    * [Scalar 製品用の AKS クラスターを作成する](CreateAKSClusterForScalarProducts.md)
* 要塞サーバーを作成し、`kubeconfig`を設定します。
    * [要塞サーバーの作成](CreateBastionServer.md)

## prometheus-community helm リポジトリを追加します

このドキュメントでは、Prometheus Operator のデプロイメントに Helm を使用します。

```console
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```
```console
helm repo update
```

## カスタム値ファイルを準備する

kube-prometheus-stack のサンプル ファイル [scalar-prometheus-custom-values.yaml](https://github.com/scalar-labs/scalar-kubernetes/blob/master/conf/scalar-prometheus-custom-values.yaml) を取得してください。 Scalar 製品の監視には、このサンプル ファイルの構成をお勧めします。

このサンプル ファイルでは、サービス リソースは Kubernetes クラスターの外部からのアクセスに公開されていません。 Kubernetes クラスターの外部からダッシュボードにアクセスしたい場合は、`*.service.type` を `LoadBalancer` に設定するか、`*.ingress.enabled` を `true` に設定する必要があります。

kube-prometheus-stackの設定の詳細については、以下の公式ドキュメントを参照してください。

* [kube-prometheus-stack - Configuration](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack#configuration)

## Prometheus Operator をデプロイする

Scalar 製品は、Prometheus Operator がデフォルトで `monitoring` 名前空間にデプロイされていることを前提としています。 したがって、`monitoring` 名前空間を作成し、`monitoring` 名前空間に Prometheus Operator をデプロイしてください。

1. Kubernetes 上に名前空間 `monitoring` を作成します。
   ```console
   kubectl create namespace monitoring
   ```

1. kube-prometheus-stack をデプロイします。
   ```console
   helm install scalar-monitoring prometheus-community/kube-prometheus-stack -n monitoring -f scalar-prometheus-custom-values.yaml
   ```

## Prometheus Operator がデプロイされているかどうかを確認する

Prometheus Operator (Prometheus、Alertmanager、Grafana を含む) ポッドが適切にデプロイされている場合は、`kubectl get pod -n monitoring` コマンドを使用して `STATUS` が `Running` であることを確認できます。

```
$ kubectl get pod -n monitoring
NAME                                                     READY   STATUS    RESTARTS   AGE
alertmanager-scalar-monitoring-kube-pro-alertmanager-0   2/2     Running   0          55s
prometheus-scalar-monitoring-kube-pro-prometheus-0       2/2     Running   0          55s
scalar-monitoring-grafana-cb4f9f86b-jmkpz                3/3     Running   0          62s
scalar-monitoring-kube-pro-operator-865bbb8454-9ppkc     1/1     Running   0          62s
```

## Helm Chart を使用して Scalar 製品をデプロイ (またはアップグレード)

1. Scalar 製品の Prometheus 監視を有効にするには、カスタム値ファイルの次の構成に `true` を設定する必要があります。

    * 構成
       * `*.prometheusRule.enabled`
       * `*.grafanaDashboard.enabled`
       * `*.serviceMonitor.enabled`

   各Scalar製品のカスタム値ファイルの詳細については、以下のドキュメントを参照してください。

   * [ScalarDB Cluster](https://github.com/scalar-labs/helm-charts/blob/main/docs/configure-custom-values-scalardb-cluster.md#prometheus-and-grafana-configurations--recommended-in-production-environments)
   * [(Deprecated) ScalarDB Server](https://github.com/scalar-labs/helm-charts/blob/main/docs/configure-custom-values-scalardb.md#prometheusgrafana-configurations--recommended-in-the-production-environment)
   * [(Deprecated) ScalarDB GraphQL](https://github.com/scalar-labs/helm-charts/blob/main/docs/configure-custom-values-scalardb-graphql.md#prometheusgrafana-configurations-recommended-in-the-production-environment)
   * [ScalarDL Ledger](https://github.com/scalar-labs/helm-charts/blob/main/docs/configure-custom-values-scalardl-ledger.md#prometheusgrafana-configurations-recommended-in-the-production-environment)
   * [ScalarDL Auditor](https://github.com/scalar-labs/helm-charts/blob/main/docs/configure-custom-values-scalardl-auditor.md#prometheusgrafana-configurations-recommended-in-the-production-environment)

1. 上記のカスタム値ファイルを含む Helm Chart を使用して、Scalar 製品をデプロイ (またはアップグレード) します。

   Scalar 製品の導入/アップグレード方法の詳細については、次のドキュメントを参照してください。

   * [ScalarDB Cluster](https://github.com/scalar-labs/helm-charts/blob/main/docs/how-to-deploy-scalardb-cluster.md)
   * [(Deprecated) ScalarDB Server](https://github.com/scalar-labs/helm-charts/blob/main/docs/how-to-deploy-scalardb.md)
   * [(Deprecated) ScalarDB GraphQL](https://github.com/scalar-labs/helm-charts/blob/main/docs/how-to-deploy-scalardb-graphql.md)
   * [ScalarDL Ledger](https://github.com/scalar-labs/helm-charts/blob/main/docs/how-to-deploy-scalardl-ledger.md)
   * [ScalarDL Auditor](https://github.com/scalar-labs/helm-charts/blob/main/docs/how-to-deploy-scalardl-auditor.md)

## ダッシュボードにアクセスする方法

`*.service.type` を `LoadBalancer` に設定するか、`*.ingress.enabled` を `true` に設定すると、Kubernetes の Service または Ingress 経由でダッシュボードにアクセスできます。 具体的な実装とアクセス方法はKubernetesクラスタに依存します。 マネージド Kubernetes クラスターを使用する場合、詳細についてはクラウド プロバイダーの公式ドキュメントを参照してください。

* EKS
    * [Network load balancing on Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html)
    * [Application load balancing on Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html)
* AKS
    * [Use a public standard load balancer in Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/load-balancer-standard)
    * [Create an ingress controller in Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/ingress-basic)

## ローカル マシンからダッシュボードにアクセスします (テスト目的のみ / 運用環境では推奨されません)

`kubectl port-forward` コマンドを使用して、ローカル マシンから各ダッシュボードにアクセスできます。

1. ローカル マシンから各サービスへのポート転送。
   * Prometheus
     ```console
     kubectl port-forward -n monitoring svc/scalar-monitoring-kube-pro-prometheus 9090:9090
     ```
   * Alertmanager
     ```console
     kubectl port-forward -n monitoring svc/scalar-monitoring-kube-pro-alertmanager 9093:9093
     ```
   * Grafana
     ```console
     kubectl port-forward -n monitoring svc/scalar-monitoring-grafana 3000:3000
     ```

1. 各ダッシュボードにアクセスします。
   * Prometheus
     ```console
     http://localhost:9090/
     ```
   * Alertmanager
     ```console
     http://localhost:9093/
     ```
   * Grafana
     ```console
     http://localhost:3000/
     ```
       * 注記：
           * Grafanaのユーザーとパスワードは以下で確認できます。
               * ユーザー
                 ```console
                 kubectl get secrets scalar-monitoring-grafana -n monitoring -o jsonpath='{.data.admin-user}' | base64 -d
                 ```
               * パスワード
                 ```console
                 kubectl get secrets scalar-monitoring-grafana -n monitoring -o jsonpath='{.data.admin-password}' | base64 -d
                 ```
