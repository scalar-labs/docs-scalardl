# AWS Marketplace を通じて Scalar 製品をインストールする方法

Scalar 製品 (ScalarDB、ScalarDL、およびそれらのツール) は、AWS Marketplace でコンテナイメージとして入手できます。 このガイドでは、AWS Marketplace を通じて Scalar 製品をインストールする方法について説明します。

一部の Scalar 製品は商用ライセンスで利用可能であり、AWS Marketplace ではそれらの製品を従量課金制価格または Bring Your Own License (BYOL) オプションとして提供していることに注意してください。 従量課金制の価格設定を選択した場合、AWS は使用量に基づいて製品ライセンス料金を請求します。 BYOL を選択する場合は、製品に適切なライセンスを持っていることを確認してください。

## AWS Marketplace から Scalar 製品を購読する

1. AWS Marketplace へのアクセス。
   * [ScalarDB Cluster Standard Edition (Pay-As-You-Go)](https://aws.amazon.com/marketplace/pp/prodview-jx6qxatkxuwm4)
   * [ScalarDB Cluster Premium Edition (Pay-As-You-Go)](https://aws.amazon.com/marketplace/pp/prodview-djqw3zk6dwyk6)
   * [ScalarDB Cluster (BYOL)](https://aws.amazon.com/marketplace/pp/prodview-alcwrmw6v4cfy)
   * [ScalarDL Ledger (Pay-As-You-Go)](https://aws.amazon.com/marketplace/pp/prodview-wttioaezp5j6e)
   * [ScalarDL Auditor (Pay-As-You-Go)](https://aws.amazon.com/marketplace/pp/prodview-ke3yiw4mhriuu)
   * [ScalarDL Ledger (BYOL)](https://aws.amazon.com/marketplace/pp/prodview-3jdwfmqonx7a2)
   * [ScalarDL Auditor (BYOL)](https://aws.amazon.com/marketplace/pp/prodview-tj7svy75gu7m6)
   * [[Deprecated] ScalarDB Server (BYOL)](https://aws.amazon.com/marketplace/pp/prodview-rzbuhxgvqf4d2)

1. [**購読を続ける**] を選択します。

1. IAM ユーザーを使用して AWS Marketplace にサインインします。
   すでにサインインしている場合、この手順は自動的にスキップされます。

1. **利用規約**を読み、**利用規約に同意する**を選択します。
   時間がかかります。 完了すると、**発効日**列に現在の日付が表示されます。
   また、AWS コンソールの  [Manage subscriptions](https://us-east-1.console.aws.amazon.com/marketplace/home#/subscriptions) ページでも製品を確認できます。

## Scalar Helm Charts を使用して AWS Marketplace から EKS (Amazon Elastic Kubernetes Service) にコンテナをデプロイする
AWS Marketplace で Scalar 製品をサブスクライブすると、AWS Marketplace のプライベート コンテナ レジストリ ([ECR](https://aws.amazon.com/ecr/)) から Scalar 製品のコンテナ イメージをプルできます。 このセクションでは、プライベート コンテナー レジストリから [EKS](https://aws.amazon.com/eks/) クラスターに従量課金制の価格で Scalar 製品をデプロイする方法について説明します。

1. OIDC プロバイダーを作成します。

   ScalarDL ポッドから AWS Marketplace Metering Service を実行するには、ID およびアクセス管理 (IAM) OpenID Connect (OIDC) プロバイダーを作成する必要があります。

   ```console
   eksctl utils associate-iam-oidc-provider --region <REGION> --cluster <EKS_CLUSTER_NAME> --approve
   ```

詳細については、[Creating an IAM OIDC provider for your cluster](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) を参照してください。

1. サービスアカウントを作成します。

   ポッドが AWS Marketplace Metering Service を実行できるようにするには、[IAM roles for service accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) を使用できます。

   ```console
   eksctl create iamserviceaccount \
       --name <SERVICE_ACCOUNT_NAME> \
       --namespace <NAMESPACE> \
       --region <REGION> \
       --cluster <EKS_CLUSTER_NAME> \
       --attach-policy-arn arn:aws:iam::aws:policy/AWSMarketplaceMeteringFullAccess \
       --approve \
       --override-existing-serviceaccounts
   ```

1. インストールする Scalar 製品の Helm Chart のカスタム値ファイルを更新します。

   カスタム値ファイルの `[].image.repository` の値として、AWS Marketplace のプライベート コンテナ レジストリ (ECR) を指定する必要があります。 また、前の手順で作成したサービス アカウント名を `[].serviceAccount.serviceAccountName` の値として指定し、 `[].serviceAccount.automountServiceAccountToken` を `true` に設定する必要があります。

   * ScalarDB Cluster の例
     * ScalarDB Cluster Standard Edition (scalardb-cluster-standard-custom-values.yaml)
        ```yaml
        scalardbCluster:
          image:
            repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardb-cluster-node-aws-payg-standard"
          serviceAccount:
            serviceAccountName: "<SERVICE_ACCOUNT_NAME>"
            automountServiceAccountToken: true
        ```
     * ScalarDB Cluster Premium Edition (scalardb-cluster-premium-custom-values.yaml)
       ```yaml
       scalardbCluster:
         image:
           repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardb-cluster-node-aws-payg-premium"
          serviceAccount:
            serviceAccountName: "<SERVICE_ACCOUNT_NAME>"
            automountServiceAccountToken: true
       ```
   * ScalarDL の例
      * ScalarDL Ledger (scalardl-ledger-custom-values.yaml)
        ```yaml
        ledger:
          image:
            repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardl-ledger-aws-payg"
          serviceAccount:
            serviceAccountName: "<SERVICE_ACCOUNT_NAME>"
            automountServiceAccountToken: true
        ```
      * ScalarDL Auditor (scalardl-auditor-custom-values.yaml)
        ```yaml
        auditor:
          image:
            repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardl-auditor-aws-payg"
          serviceAccount:
            serviceAccountName: "<SERVICE_ACCOUNT_NAME>"
            automountServiceAccountToken: true
        ```
      * Ledger 用の ScalarDL Schema Loader (schema-loader-ledger-custom-values.yaml)
        ```yaml
        schemaLoading:
          image:
            repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardl-schema-loader-ledger-aws-payg"
        ```
      * Auditor 用の ScalarDL Schema Loader (schema-loader-auditor-custom-values.yaml)
        ```yaml
        schemaLoading:
          image:
            repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardl-schema-loader-auditor-aws-payg"
        ```

1. Helm Charts を上記のカスタム値ファイルと組み合わせて使用して、Scalar 製品をデプロイします。
   * ScalarDB Cluster の例
     * ScalarDB Cluster Standard Edition
       ```console
       helm install scalardb-cluster-standard scalar-labs/scalardb-cluster -f scalardb-cluster-standard-custom-values.yaml
       ```
     * ScalarDB Cluster Premium Edition
       ```console
       helm install scalardb-cluster-premium scalar-labs/scalardb-cluster -f scalardb-cluster-premium-custom-values.yaml
       ```
   * ScalarDL の例
      * ScalarDL Ledger
        ```console
        helm install scalardl-ledger scalar-labs/scalardl -f ./scalardl-ledger-custom-values.yaml
        ```
      * ScalarDL Auditor
        ```console
        helm install scalardl-auditor scalar-labs/scalardl-audit -f ./scalardl-auditor-custom-values.yaml
        ```
      * ScalarDL Schema Loader (Ledger)
        ```console
        helm install schema-loader scalar-labs/schema-loading -f ./schema-loader-ledger-custom-values.yaml
        ```
      * ScalarDL Schema Loader (Auditor)
        ```console
        helm install schema-loader scalar-labs/schema-loading -f ./schema-loader-auditor-custom-values.yaml
        ```

## **[BYOL]** Scalar Helm Chart を使用して AWS Marketplace から EKS (Amazon Elastic Kubernetes Service) にコンテナをデプロイする

AWS Marketplace で Scalar 製品をサブスクライブすると、AWS Marketplace のプライベート コンテナ レジストリ ([ECR](https://aws.amazon.com/ecr/)) から Scalar 製品のコンテナ イメージをプルできます。 このセクションでは、プライベート コンテナー レジストリから [EKS](https://aws.amazon.com/eks/)  クラスターに BYOL オプションを使用して Scalar 製品をデプロイする方法について説明します。

1. インストールする Scalar 製品の Helm Chart のカスタム値ファイルを更新します。
   AWS Marketplace のプライベート コンテナ レジストリ (ECR) をカスタム値ファイルの `[].image.repository` の値として指定する必要があります。
   * ScalarDB Cluster の例
     ```yaml
     scalardbCluster:
       image:
         repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardb-cluster-node-aws-byol"
     ```
   * ScalarDL の例
      * ScalarDL Ledger (scalardl-ledger-custom-values.yaml)
        ```yaml
        ledger:
          image:
            repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalar-ledger"
        ```
      * ScalarDL Auditor (scalardl-auditor-custom-values.yaml)
        ```yaml
        auditor:
          image:
            repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalar-auditor"
        ```
      * Ledger 用の ScalarDL Schema Loader (schema-loader-ledger-custom-values.yaml)
        ```yaml
        schemaLoading:
          image:
            repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardl-schema-loader-ledger"
        ```
      * Auditor 用の ScalarDL Schema Loader (schema-loader-auditor-custom-values.yaml)
        ```yaml
        schemaLoading:
          image:
            repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardl-schema-loader-auditor"
        ```

1. 上記のカスタム値ファイルを含む Helm Chart を使用して、Scalar 製品をデプロイします。
   * ScalarDB Cluster の例
     ```console
     helm install scalardb-cluster scalar-labs/scalardb-cluster -f scalardb-cluster-custom-values.yaml
     ```
   * ScalarDL の例
      * ScalarDL Ledger
        ```console
        helm install scalardl-ledger scalar-labs/scalardl -f ./scalardl-ledger-custom-values.yaml
        ```
      * ScalarDL Auditor
        ```console
        helm install scalardl-auditor scalar-labs/scalardl-audit -f ./scalardl-auditor-custom-values.yaml
        ```
      * ScalarDL Schema Loader (Ledger)
        ```console
        helm install schema-loader scalar-labs/schema-loading -f ./schema-loader-ledger-custom-values.yaml
        ```
      * ScalarDL Schema Loader (Auditor)
        ```console
        helm install schema-loader scalar-labs/schema-loading -f ./schema-loader-auditor-custom-values.yaml
        ```

## **[BYOL]** Scalar Helm Chart を使用して、AWS Marketplace から EKS 以外の Kubernetes にコンテナをデプロイする

1. [AWS Official Document (Installing or updating the latest version of the AWS CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) に従って `aws` コマンドをインストールします。

1. [AWS Official Document (Configuration basics)](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) に従って、認証情報を使用して AWS CLI を設定します。

1. AWS Marketplace の ECR からコンテナイメージをプルするための `reg-ecr-mp-secrets` シークレットリソースを作成します。

   ```console
   kubectl create secret docker-registry reg-ecr-mp-secrets \
     --docker-server=709825985650.dkr.ecr.us-east-1.amazonaws.com \
     --docker-username=AWS \
     --docker-password=$(aws ecr get-login-password --region us-east-1)
   ```

1. インストールする Scalar 製品の Helm Chart のカスタム値ファイルを更新します。
   AWS Marketplace のプライベート コンテナ レジストリ (ECR) をカスタム値ファイルの `[].image.repository` の値として指定する必要があります。
   また、`[].imagePullSecrets` の値として `reg-ecr-mp-secrets` を指定する必要があります。
   * ScalarDB Cluster の例
     ```yaml
     scalardbCluster:
       image:
         repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardb-cluster-node-aws-byol"
       imagePullSecrets:
         - name: "reg-ecr-mp-secrets"
     ```
   * ScalarDL の例
       * ScalarDL Ledger (scalardl-ledger-custom-values.yaml)
         ```yaml
         ledger:
           image:
             repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalar-ledger"
           imagePullSecrets:
             - name: "reg-ecr-mp-secrets"
         ```
       * ScalarDL Auditor (scalardl-auditor-custom-values.yaml)
         ```yaml
         auditor:
           image:
             repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalar-auditor"
           imagePullSecrets:
             - name: "reg-ecr-mp-secrets"
         ```
       * Ledger 用の ScalarDL Schema Loader (schema-loader-ledger-custom-values.yaml)
         ```yaml
         schemaLoading:
           image:
             repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardl-schema-loader-ledger"
           imagePullSecrets:
             - name: "reg-ecr-mp-secrets"
         ```
       * Auditor 用の ScalarDL Schema Loader (schema-loader-auditor-custom-values.yaml)
         ```yaml
         schemaLoading:
           image:
             repository: "709825985650.dkr.ecr.us-east-1.amazonaws.com/scalar/scalardl-schema-loader-auditor"
           imagePullSecrets:
             - name: "reg-ecr-mp-secrets"
         ```

1. 上記のカスタム値ファイルを含む Helm Chart を使用して、Scalar 製品をデプロイします。
   * 例  
     このドキュメントの **[BYOL] Scalar Helm Chart を使用して AWS Marketplace から EKS (Amazon Elastic Kubernetes Service) にコンテナをデプロイする** セクションを参照してください。
