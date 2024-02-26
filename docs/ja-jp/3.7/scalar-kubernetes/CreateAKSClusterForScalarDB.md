# ScalarDB Server 用の AKS クラスターを作成するためのガイドライン

このドキュメントでは、ScalarDB Server デプロイ用の Azure Kubernetes Service (AKS) クラスターを作成するための要件と推奨事項について説明します。 ScalarDB Server を AKS クラスターにデプロイする方法の詳細については、[AKS に ScalarDB Server をデプロイする](ManualDeploymentGuideScalarDBServerOnAKS.md) を参照してください。

## あなたが始める前に

次の要件、推奨事項、およびプロジェクトの要件に基づいて AKS クラスターを作成する必要があります。 AKS クラスターの作成方法の詳細については、環境で使用しているツールに基づいて、次の Microsoft 公式ドキュメントを参照してください。

* [Azure CLI](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-cli)
* [PowerShell](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-powershell)
* [Azure Portal](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-portal)

## 要件

ScalarDB Server を展開するときは、次のことを行う必要があります。

* Kubernetes バージョン 1.21 以降を使用して AKS クラスターを作成します。
* Kubernetes のバージョンとプロジェクトの要件に基づいて AKS クラスターを構成します。

## 推奨事項 (オプション)

以下に、ScalarDB Server を展開するための推奨事項をいくつか示します。 これらの推奨事項は必須ではないため、ニーズに基づいてこれらの推奨事項を適用するかどうかを選択できます。

### 少なくとも 3 つのワーカーノードと 3 つのポッドを作成します

AKS クラスターの高可用性を確保するには、少なくとも 3 つのワーカーノードを使用し、ワーカーノード全体に少なくとも 3 つのポッドをデプロイする必要があります。 3 つのポッドをワーカーノードに分散させるための `podAntiAffinity` の [サンプル構成](../conf/scalardb-custom-values.yaml) を参照できます。

{% capture notice--info %}
**注記**

ワーカーノードを異なる [availability zones](https://learn.microsoft.com/en-us/azure/availability-zones/az-overview) (AZ) に配置すると、AZ の障害に耐えることができます。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

### ScalarDB Server ノード プールのワーカーノードには 4vCPU / 8GB メモリ ノードを使用します。

商用ライセンスの観点から、ScalarDB Server を実行する 1 つのポッドのリソースは 2vCPU / 4GB メモリに制限されます。 ScalarDB Server ポッドに加えて、Kubernetes は次のコンポーネントの一部を各ワーカーノードにデプロイできます。

* ScalarDB Server ポッド (2vCPU / 4GB)
* Envoy プロキシ
* アプリケーション ポッド (同じワーカーノード上でアプリケーションのポッドを実行することを選択した場合)
* 監視コンポーネント (`kube-prometheus-stack` などの監視コンポーネントをデプロイする場合)
* Kubernetes コンポーネント

これを念頭に置き、[少なくとも 3 つのワーカーノードと 3 つのポッドを作成する](#create-at-least-three-worker-nodes-and-three-pods) で説明されているように、少なくとも 4vCPU / 8 GB のメモリ リソースを持つワーカーノードを使用し、可用性のために少なくとも 3 つのワーカーノードを使用する必要があります。

ただし、運用環境では、ノードあたり少なくとも 4vCPU / 8GB のメモリ リソースを備えた 3 つのノードが最小条件となります。 また、システムのワークロードに応じて、AKS クラスターのリソース (ワーカーノードの数、ノードあたりの vCPU、ノードあたりのメモリ、ScalarDB Server  ポッド、アプリケーションのポッドなど) も考慮する必要があります。 また、[Horizontal Pod Autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) などの機能を使用してポッドを自動的にスケーリングする予定の場合は、ワーカーノードのリソースを決定するときにワーカーノード上の最大ポッド数を考慮する必要があります。

### ScalarDB Server ポッドのノード プールを作成する

AKS は、既定でシステム ポッド (AKS を実行し続けるために使用される) に優先される **agentpool** という名前のシステム ノード プールを 1 つ作成します。 ScalarDB Server ポッド用に **user** モードで別のノード プールを作成し、この追加のノード プールに ScalarDB Server ポッドをデプロイすることをお勧めします。

### AKS でクラスター オートスケーラーを構成する

[Horizontal Pod Autoscaler](https://learn.microsoft.com/en-us/azure/aks/concepts-scale#horizontal-pod-autoscaler) を使用して ScalarDB Server ポッドを自動的にスケーリングする場合は、AKS でもクラスター オートスケーラーを構成する必要があります。 詳細については、Microsoft の公式ドキュメント [Cluster autoscaler](https://learn.microsoft.com/en-us/azure/aks/concepts-scale#cluster-autoscaler) を参照してください。

さらに、クラスター オートスケーラーを構成する場合は、AKS がスケーリング後にネットワークの問題なく動作できるように、十分な数の IP が存在することを確認するために、AKS の仮想ネットワーク (VNet) にサブネットを作成する必要があります。 必要な IP の数は、ネットワーク プラグインによって異なります。 必要な IP 数の詳細については、以下を参照してください。

* [Use kubenet networking with your own IP address ranges in Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/configure-kubenet)
* [Configure Azure CNI networking in Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni)

### プライベート ネットワーク上に AKS クラスターを作成する

ScalarDB Server はインターネット アクセス経由でユーザーにサービスを直接提供しないため、プライベート ネットワーク (VNet のプライベート サブネット) 上に AKS クラスターを作成する必要があります。 アプリケーションからプライベート ネットワーク経由で ScalarDB Server にアクセスすることをお勧めします。

### 必要に応じて、Azure CNI を使用して AKS クラスターを作成します。

AKS の既定のネットワーク プラグインは [kubenet](https://learn.microsoft.com/en-us/azure/aks/configure-kubenet) です。 要件が kubenet と一致しない場合は、[Azure Container Networking Interface (CNI)](https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni) を使用する必要があります。

たとえば、1 つの AKS クラスターに複数の ScalarDB Server 環境をデプロイし (マルチテナントの ScalarDB Server をデプロイするなど)、[Kubernetes NetworkPolicies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) を使用して各テナント間の接続を制御したい場合、kubenet は Calico Network のみをサポートします。 [Azure support team does not support](https://learn.microsoft.com/en-us/azure/aks/use-network-policies#differences-between-azure-network-policy-manager-and-calico-network-policy-and-their-capabilities) ポリシー。 Calico ネットワーク ポリシーは、Calico コミュニティまたは追加の有料サポートを通じてのみサポートされることに注意してください。

ただし、Azure サポート チームとエンジニアリング チームは Azure CNI をサポートします。 したがって、Kubernetes NetworkPolicies を使用して Azure サポート チームからサポートを受けたい場合は、Azure CNI を使用する必要があります。 kubenet と Azure CNI の違いの詳細については、次の Microsoft 公式ドキュメントを参照してください。

* [Network concepts for applications in Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/concepts-network)
* [Use kubenet networking with your own IP address ranges in Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/configure-kubenet)
* [Configure Azure CNI networking in Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni)

### 要件に基づいていくつかのセキュリティ機能を使用して接続を制限する

ScalarDB Server では未使用の接続を制限する必要があります。 未使用の接続を制限するには、[network security groups](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview) など、Azure のいくつかのセキュリティ機能を使用できます。

ScalarDB Server がデフォルトで使用する接続 (ポート) は次のとおりです。

* ScalarDB Server
  * 60051/TCP (クライアントからのリクエストを受け付ける)
  * 8080/TCP (監視リクエストを受け付ける)
* Scalar Envoy (ScalarDB Server とともに使用)
  * 60051/TCP (ScalarDB Server の負荷分散)
  * 9001/TCP (Scalar Envoy 自体の監視リクエストを受け入れます)

{% capture notice--info %}
**注記**

- 構成ファイル (`database.properties`) で ScalarDB Server のデフォルトのリスニング ポートを変更する場合は、構成したポートを使用して接続を許可する必要があります。
- AKS 自体が使用する接続も許可する必要があります。 AKS トラフィック要件の詳細については、[Control egress traffic using Azure Firewall in Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/limit-egress-traffic) を参照してください。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>
