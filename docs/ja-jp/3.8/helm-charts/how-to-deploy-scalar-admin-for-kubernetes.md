# Kubernetes 用に Scalar Admin をデプロイする方法

このドキュメントでは、Scalar Helm Chart を使用して Kubernetes に Scalar Admin をデプロイする方法について説明します。 Scalar Admin for Kubernetes のカスタム値ファイルの詳細については、[Scalar Admin for Kubernetes のカスタム値ファイルの構成](configure-custom-values-scalar-admin-for-kubernetes.md) を参照してください。

## Kubernetes 用の Scalar Admin をデプロイする

Scalar Admin for Kubernetes をデプロイするには、次のコマンドを実行します。山かっこ内の内容を説明どおりに置き換えます。

```console
helm install <RELEASE_NAME> scalar-labs/scalar-admin-for-kubernetes -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_SCALAR_ADMIN_FOR_KUBERNETES> --version <CHART_VERSION>
```

## Scalar Admin for Kubernetes ジョブをアップグレードする

Scalar Admin for Kubernetes ジョブをアップグレードするには、次のコマンドを実行して、山かっこ内の内容を説明どおりに置き換えます。

```console
helm upgrade <RELEASE_NAME> scalar-labs/scalar-admin-for-kubernetes -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_SCALAR_ADMIN_FOR_KUBERNETES> --version <CHART_VERSION>
```

## Scalar Admin for Kubernetes ジョブを削除する

Scalar Admin for Kubernetes ジョブを削除するには、次のコマンドを実行して、山括弧内の内容を説明どおりに置き換えます。

```console
helm uninstall <RELEASE_NAME> -n <NAMESPACE>
```
