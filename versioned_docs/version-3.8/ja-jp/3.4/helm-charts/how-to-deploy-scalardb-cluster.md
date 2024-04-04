# ScalarDB Cluster のデプロイする方法

このドキュメントでは、Scalar Helm Chart を使用して ScalarDB Cluster をデプロイする方法について説明します。 ScalarDB Cluster のカスタム値ファイルの詳細については、[ScalarDB Cluster のカスタム値ファイルの構成](configure-custom-values-scalardb-cluster.md) を参照してください。

## ScalarDB Cluster をデプロイする

```console
helm install <RELEASE_NAME> scalar-labs/scalardb-cluster -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_SCALARDB_CLUSTER> --version <CHART_VERSION>
```

## ScalarDB Cluster のデプロイメントをアップグレードする

```console
helm upgrade <RELEASE_NAME> scalar-labs/scalardb-cluster -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_SCALARDB_CLUSTER> --version <CHART_VERSION>
```

## ScalarDB Cluster のデプロイメントを削除する

```console
helm uninstall <RELEASE_NAME> -n <NAMESPACE>
```

## `direct-kubernetes` モードを使用してクライアント アプリケーションを Kubernetes にデプロイします

ScalarDB Cluster を `direct-kubernetes` モードで使用する場合は、次のことを行う必要があります。

1. アプリケーション ポッドを ScalarDB Cluster と同じ Kubernetes クラスターにデプロイします。
2. 3 つの Kubernetes リソース (`Role`、`RoleBinding`、`ServiceAccount`) を作成します。
3. アプリケーション ポッドに `ServiceAccount` をマウントします。

このメソッドが必要なのは、`direct-kubernetes` モードの ScalarDB Cluster クライアント ライブラリがアプリケーション ポッド内から Kubernetes API を実行して、ScalarDB Cluster ポッドに関する情報を取得するためです。

* Role
  ```yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    name: scalardb-cluster-client-role
    namespace: <your namespace>
  rules:
    - apiGroups: [""]
      resources: ["endpoints"]
      verbs: ["get", "watch", "list"]
  ```
* RoleBinding
  ```yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: scalardb-cluster-client-rolebinding
    namespace: <your namespace>
  subjects:
    - kind: ServiceAccount
      name: scalardb-cluster-client-sa
  roleRef:
    kind: Role
    name: scalardb-cluster-role
    apiGroup: rbac.authorization.k8s.io
  ```
* ServiceAccount
  ```yaml
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: scalardb-cluster-client-sa
    namespace: <your namespace>
  ```
