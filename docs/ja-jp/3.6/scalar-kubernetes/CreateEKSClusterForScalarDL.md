# ScalarDL Ledger の EKS クラスターを作成するためのガイドライン

このドキュメントでは、ScalarDL Ledger デプロイ用の Amazon Elastic Kubernetes Service (EKS) クラスターを作成するための要件と推奨事項について説明します。 ScalarDL Ledger を EKS クラスターにデプロイする方法の詳細については、[ScalarDL Ledger を Amazon EKS にデプロイする](ManualDeploymentGuideScalarDLOnEKS.md)を参照してください。

## あなたが始める前に

EKS クラスターは、次の要件、推奨事項、およびプロジェクトの要件に基づいて作成する必要があります。 EKS クラスターの作成方法の詳細については、Amazon の公式ドキュメント [Creating an Amazon EKS cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html) を参照してください。

## 要件

ScalarDL Ledger を展開するときは、次のことを行う必要があります。

* Kubernetes バージョン 1.21 以降を使用して EKS クラスターを作成します。
* Kubernetes のバージョンとプロジェクトの要件に基づいて EKS クラスターを構成します。

{% capture notice--warning %}
**注意**

ScalarDL でのビザンチン障害検出が適切に機能するには、ScalarDL Ledger デプロイメントと同じ EKS クラスターにアプリケーション ポッドをデプロイしないでください。
{% endcapture %}

<div class="notice--warning">{{ notice--warning | markdownify }}</div>

## 推奨事項 (オプション)

以下は、ScalarDL Ledger を展開するための推奨事項の一部です。 これらの推奨事項は必須ではないため、ニーズに基づいてこれらの推奨事項を適用するかどうかを選択できます。

### 少なくとも 3 つのワーカーノードと 3 つのポッドを作成します

EKS クラスターの高可用性を確保するには、少なくとも 3 つのワーカーノードを使用し、ワーカーノード全体に少なくとも 3 つのポッドをデプロイする必要があります。 3 つのポッドをワーカーノードに分散させるための `podAntiAffinity` の [サンプル構成](../conf/scalardl-custom-values.yaml) を参照できます。

{% capture notice--info %}
**注記**

ワーカーノードを異なる [availability zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) (AZ) に配置すると、AZ の障害に耐えることができます。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

### ScalarDL Ledger ノード グループのワーカーノードには 4vCPU / 8GB メモリ ノードを使用します

商用ライセンスの観点から、ScalarDL Ledger を実行する 1 つのポッドのリソースは 2vCPU / 4GB メモリに制限されます。 ScalarDL Ledger ポッドに加えて、Kubernetes は次のコンポーネントの一部を各ワーカーノードにデプロイできます。

* ScalarDL Ledger ポッド (2vCPU / 4GB)
* Envoy プロキシ
* 監視コンポーネント (`kube-prometheus-stack` などの監視コンポーネントをデプロイする場合)
* Kubernetes コンポーネント

これを念頭に置き、[少なくとも 3 つのワーカーノードと 3 つのポッドを作成する](#create-at-least-three-worker-nodes-and-three-pods) で説明されているように、少なくとも 4vCPU / 8 GB のメモリ リソースを持つワーカーノードを使用し、可用性のために少なくとも 3 つのワーカーノードを使用する必要があります。

ただし、ノードあたり少なくとも 4vCPU / 8GB のメモリ リソースを備えた 3 つのノードが運用環境の最小環境となります。 システムのワークロードに応じて、EKS クラスターのリソース (ワーカーノードの数、ノードあたりの vCPU、ノードあたりのメモリ、ScalarDL Ledger ポッドなど) も考慮する必要があります。 また、[Horizontal Pod Autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) などの機能を使用してポッドを自動的にスケーリングする予定の場合は、ワーカーノードのリソースを決定するときにワーカーノード上の最大ポッド数を考慮する必要があります。

### EKS でクラスター オートスケーラーを構成する

[Horizontal Pod Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/horizontal-pod-autoscaler.html) を使用して ScalarDL Ledger ポッドを自動的にスケーリングする場合は、EKS でクラスター オートスケーラーも構成する必要があります。 詳細については、Amazon の公式ドキュメント [Autoscaling](https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html#cluster-autoscaler) を参照してください。

さらに、クラスター オートスケーラーを構成する場合は、プレフィックス (`/24`など) を付けて EKS 用の Amazon Virtual Private Cloud (VPC) にサブネットを作成し、十分な数の IP が存在することを確認して、EKS がクラスター オートスケーラーなしで動作できるようにする必要があります。 スケーリング後のネットワークの問題。

### プライベート ネットワーク上に EKS クラスターを作成する

ScalarDL Ledger はインターネット アクセス経由でユーザーにサービスを直接提供しないため、プライベート ネットワーク (VPC 内のプライベート サブネット) 上に EKS クラスターを作成する必要があります。 アプリケーションからプライベート ネットワーク経由で ScalarDL Ledger にアクセスすることをお勧めします。

### 要件に基づいていくつかのセキュリティ機能を使用して接続を制限する

ScalarDL Ledger では未使用の接続を制限する必要があります。 未使用の接続を制限するには、[security groups](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) や [network access control lists](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) など、AWS のいくつかのセキュリティ機能を使用できます。

ScalarDL Ledger がデフォルトで使用する接続 (ポート) は次のとおりです。

* ScalarDL Ledger
  * 50051/TCP (クライアントからのリクエストを受け付ける)
  * 50052/TCP (クライアントからの特権リクエストを受け入れます)
  * 50053/TCP (scalar-admin クライアント ツールからの一時停止および一時停止解除リクエストを受け入れます)
  * 8080/TCP (監視リクエストを受け付ける)
* Scalar Envoy (ScalarDL Ledger とともに使用)
  * 50051/TCP (ScalarDL Ledger の負荷分散)
  * 50052/TCP (ScalarDL Ledger の負荷分散)
  * 9001/TCP (Scalar Envoy 自体の監視リクエストを受け入れます)

{% capture notice--info %}
**注記**

- 設定ファイル (`ledger.properties`) で ScalarDL Ledger のデフォルトのリスニング ポートを変更する場合は、設定したポートを使用して接続を許可する必要があります。
- EKS 自体が使用する接続も許可する必要があります。 Amazon EKS セキュリティグループの要件の詳細については、[Amazon EKS security group requirements and considerations](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) を参照してください。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>
