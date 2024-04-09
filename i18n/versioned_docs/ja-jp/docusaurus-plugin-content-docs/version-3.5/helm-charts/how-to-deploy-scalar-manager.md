# Scalar Manager のデプロイする方法

このドキュメントでは、Scalar Helm Chart を使用して Scalar Manager をデプロイする方法について説明します。 カスタム値ファイルを準備する必要があります。 Scalar Manager のカスタム値ファイルの詳細については、次のドキュメントを参照してください。

* [Scalar Manager のカスタム値ファイルを構成する]((./configure-custom-values-scalar-manager.md))

## kube-prometheus-stack と loki-stack をデプロイする

Scalar Manager を使用する場合は、kube-prometheus-stack と loki-stack をデプロイする必要があります。 導入方法の詳細については、次のドキュメントを参照してください。

* [Helm Charts の入門 (Prometheus Operator を使用したモニタリング)](getting-started-monitoring.md)
* [Helm Charts の入門 (Loki スタックを使用したロギング)](getting-started-logging.md)

kube-prometheus-stack をデプロイするときは、kube-prometheus-stack のカスタム値ファイルで次の構成を設定する必要があります。

```yaml
grafana:
  grafana-ini:
    security:
      allow_embedding: true
      cookie_samesite: disabled
```

すでに kube-prometheus-stack をデプロイしている場合は、次のコマンドを使用して構成をアップグレードしてください。

```console
helm upgrade <RELEASE_NAME> prometheus-community/kube-prometheus-stack -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_KUBE_PROMETHEUS_STACK> --version <CHART_VERSION>
```

## Scalar Manager をデプロイする

```console
helm install <RELEASE_NAME> scalar-labs/scalar-manager -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_SCALAR_MANAGER> --version <CHART_VERSION>
```

## Scalar Manager のデプロイメントをアップグレードする

```console
helm upgrade <RELEASE_NAME> scalar-labs/scalar-manager -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_SCALAR_MANAGER> --version <CHART_VERSION>
```

## Scalar Manager のデプロイメントを削除します

```console
helm uninstall <RELEASE_NAME> -n <NAMESPACE>
```
