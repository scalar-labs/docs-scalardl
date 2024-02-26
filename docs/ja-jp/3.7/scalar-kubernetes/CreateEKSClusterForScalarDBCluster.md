# ScalarDB Cluster 用の EKS クラスターを作成するためのガイドライン

このドキュメントでは、ScalarDB Cluster 展開用の Amazon Elastic Kubernetes Service (EKS) クラスターを作成するための要件と推奨事項について説明します。 ScalarDB Cluster を EKS クラスターにデプロイする方法の詳細については、[Amazon EKS に ScalarDB Cluster をデプロイする](ManualDeploymentGuideScalarDBClusterOnEKS.md) を参照してください。

## あなたが始める前に

EKS クラスターは、次の要件、推奨事項、およびプロジェクトの要件に基づいて作成する必要があります。 EKS クラスターの作成方法の詳細については、Amazon の公式ドキュメント [Creating an Amazon EKS cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html) を参照してください。

## 要件

ScalarDB Cluster をデプロイする場合は、次のことを行う必要があります。

* Kubernetes バージョン 1.21 以降を使用して EKS クラスターを作成します。
* Kubernetes のバージョンとプロジェクトの要件に基づいて EKS クラスターを構成します。

## 推奨事項 (オプション)

以下は、ScalarDB Cluster をデプロイするための推奨事項の一部です。 これらの推奨事項は必須ではないため、ニーズに基づいてこれらの推奨事項を適用するかどうかを選択できます。

### 少なくとも 3 つのワーカーノードと 3 つのポッドを作成します

EKS クラスターの高可用性を確保するには、少なくとも 3 つのワーカーノードを使用し、ワーカーノード全体に少なくとも 3 つのポッドをデプロイする必要があります。 3 つのポッドをワーカーノードに分散させるための `podAntiAffinity` の [サンプル構成](../conf/scalardb-cluster-custom-values-indirect-mode.yaml) を参照できます。

{% capture notice--info %}
**注記**

ワーカーノードを異なる [availability zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) (AZ) に配置すると、AZ の障害に耐えることができます。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

### ScalarDB Cluster  ノード グループのワーカーノードには 4vCPU / 8GB メモリ ノードを使用します。

商用ライセンスの観点から、ScalarDB Cluster を実行する 1 つのポッドのリソースは 2vCPU / 4GB メモリに制限されます。 ScalarDB Cluster ポッドに加えて、Kubernetes は次のコンポーネントの一部を各ワーカーノードにデプロイできます。

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

これを念頭に置き、[少なくとも 3 つのワーカーノードと 3 つのポッドを作成する](#create-at-least-three-worker-nodes-and-three-pods) で説明されているように、少なくとも 4vCPU / 8 GB のメモリ リソースを持つワーカーノードを使用し、可用性のために少なくとも 3 つのワーカーノードを使用する必要があります。

ただし、運用環境では、ノードあたり少なくとも 4vCPU / 8GB のメモリ リソースを備えた 3 つのノードが最小条件となります。 システムのワークロードに応じて、EKS クラスターのリソース (ワーカーノードの数、ノードあたりの vCPU、ノードあたりのメモリ、ScalarDB Cluster  ポッド、アプリケーションのポッドなど) も考慮する必要があります。 また、[Horizontal Pod Autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) などの機能を使用してポッドを自動的にスケーリングする予定の場合は、ワーカーノードのリソースを決定するときにワーカーノード上の最大ポッド数を考慮する必要があります。

### EKS でクラスター オートスケーラーを構成する

[Horizontal Pod Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/horizontal-pod-autoscaler.html) を使用して ScalarDB Cluster  ポッドを自動的にスケーリングする場合は、EKS でもクラスター オートスケーラーを構成する必要があります。 詳細については、Amazon の公式ドキュメント [Autoscaling](https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html#cluster-autoscaler) を参照してください。

さらに、クラスター オートスケーラーを構成する場合は、プレフィックス (`/24` など) を付けて EKS 用の Amazon Virtual Private Cloud (VPC) にサブネットを作成し、十分な数の IP が存在することを確認して、EKS がクラスター オートスケーラーなしで動作できるようにする必要があります。 スケーリング後のネットワークの問題。

### プライベート ネットワーク上に EKS クラスターを作成する

ScalarDB Cluster はインターネット アクセス経由でユーザーにサービスを直接提供しないため、EKS クラスターはプライベート ネットワーク (VPC 内のプライベート サブネット) 上に作成する必要があります。 アプリケーションからプライベート ネットワーク経由で ScalarDB Cluster にアクセスすることをお勧めします。

### 要件に基づいていくつかのセキュリティ機能を使用して接続を制限する

ScalarDB Cluster で未使用の接続を制限する必要があります。 未使用の接続を制限するには、[security groups](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) や [network access control lists](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) など、AWS のいくつかのセキュリティ機能を使用できます。

ScalarDB Cluster がデフォルトで使用する接続 (ポート) は次のとおりです。

* ScalarDB Cluster
  * 60053/TCP (クライアントからの gRPC または SQL リクエストを受け入れます)
  * 8080/TCP (クライアントからの GraphQL リクエストを受け入れます)
  * 9080/TCP (監視リクエストを受け付ける)
* Scalar Envoy (ScalarDB Cluster の `間接` モードで使用)
  * 60053/TCP (ScalarDB Cluster の負荷分散)
  * 9001/TCP (Scalar Envoy 自体の監視リクエストを受け入れます)

{% capture notice--info %}
**注記**

- 構成ファイル (`scalardb-cluster-node.properties`) で ScalarDB Clusterのデフォルトのリスニング ポートを変更する場合は、構成したポートを使用して接続を許可する必要があります。
- EKS 自体が使用する接続も許可する必要があります。 Amazon EKS セキュリティグループの要件の詳細については、[Amazon EKS security group requirements and considerations](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) を参照してください。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>
