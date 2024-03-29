{% include scalardl/end-of-support-ja-jp.html %}

# [非推奨] ScalarDB Server をデプロイする方法

{% capture notice--info %}
**注記**

ScalarDB Server は非推奨になりました。 代わりに [ScalarDB Cluster](how-to-deploy-scalardb-cluster.md) を使用してください。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

このドキュメントでは、Scalar Helm Chart を使用して ScalarDB Server をデプロイする方法について説明します。 カスタム値ファイルを準備する必要があります。 ScalarDB Server のカスタム値ファイルの詳細については、次のドキュメントを参照してください。

* [[非推奨] ScalarDB Server のカスタム値ファイルを構成する](configure-custom-values-scalardb.md)

## ScalarDB Server をデプロイする

```console
helm install <RELEASE_NAME> scalar-labs/scalardb -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_SCALARDB_SERVER> --version <CHART_VERSION>
```

## ScalarDB Server のデプロイメントをアップグレードする

```console
helm upgrade <RELEASE_NAME> scalar-labs/scalardb -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_SCALARDB_SERVER> --version <CHART_VERSION>
```

## ScalarDB Server のデプロイメントを削除します

```console
helm uninstall <RELEASE_NAME> -n <NAMESPACE>
```
