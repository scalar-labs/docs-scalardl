# Scalar Helm Charts の入門

このドキュメントでは、Kubernetes クラスター上でテスト環境として Scalar Helm Chart を開始する方法について説明します。 ここでは、テスト用の Mac または Linux 環境がすでにあることを前提としています。 このドキュメントでは **Minikube** を使用しますが、これから説明する手順はどの Kubernetes クラスターでも機能するはずです。

## ツール

テストには次のツールを使用します。

1. minikube (他の Kubernetes ディストリビューションを使用する場合、minikube は必要ありません。)
   1.クベクトル
1. ヘルム
1. cfssl / cfssljson

## ステップ 1. ツールをインストールする

まず、このガイドで使用する次のツールをインストールする必要があります。

1. [minikubeドキュメント](https://minikube.sigs.k8s.io/docs/start/) に従って minikube をインストールします。

1. [Kubernetesドキュメント](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) に従って kubectl をインストールします。

1. [Helmドキュメント](https://helm.sh/docs/intro/install/) に従って helm コマンドをインストールします。

1. [CFSSLドキュメント](https://github.com/cloudflare/cfssl) に従って cfssl と cfssljson をインストールします。
   * 注記：
        * ScalarDL を試す場合は cfssl と cfssljson が必要です。 ScalarDL 以外の Scalar Helm Charts (ScalarDB、Monitoring、Logging など) を試す場合、cfssl および cfssljson は必要ありません。

## ステップ 2. docker ドライバーで minikube を起動する (オプション / minikube を使用する場合)

1. minikube を起動します。
   ```console
   minikube start
   ```

1. minikube とポッドのステータスを確認します。
   ```console
   kubectl get pod -A
   ```
   【コマンド実行結果】
   ```console
   NAMESPACE     NAME                               READY   STATUS    RESTARTS      AGE
   kube-system   coredns-64897985d-lbsfr            1/1     Running   1 (20h ago)   21h
   kube-system   etcd-minikube                      1/1     Running   1 (20h ago)   21h
   kube-system   kube-apiserver-minikube            1/1     Running   1 (20h ago)   21h
   kube-system   kube-controller-manager-minikube   1/1     Running   1 (20h ago)   21h
   kube-system   kube-proxy-gsl6j                   1/1     Running   1 (20h ago)   21h
   kube-system   kube-scheduler-minikube            1/1     Running   1 (20h ago)   21h
   kube-system   storage-provisioner                1/1     Running   2 (19s ago)   21h
   ```
   minikube が適切に起動すると、いくつかのポッドが kube-system 名前空間で**実行中**であることがわかります。

## ステップ 3。

Kubernetes クラスターが起動したら、そのクラスター上で各 Scalar Helm Charts を試すことができます。 詳細については、以下のドキュメントを参照してください。

* [ScalarDB Analytics with PostgreSQL](getting-started-scalardb-analytics-postgresql.md)
* [ScalarDL Ledger (Ledger のみ)](getting-started-scalardl-ledger.md)
* [ScalarDL Ledger と Auditor (Auditor モード)](getting-started-scalardl-auditor.md)
* [Prometheus Operator を使用した監視](getting-started-monitoring.md)
  * [Loki スタックを使用したロギング](getting-started-logging.md)
  * [Scalar Manager](getting-started-scalar-manager.md)
* [[非推奨] ScalarDB Server](getting-started-scalardb.md)
