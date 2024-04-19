# [非推奨] ScalarDB GraphQL をデプロイする方法

{% capture notice--info %}
**注記**

ScalarDB GraphQL サーバーは非推奨になりました。 代わりに [ScalarDB Cluster](how-to-deploy-scalardb-cluster.md) を使用してください。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

このドキュメントでは、Scalar Helm Chart を使用して ScalarDB GraphQL をデプロイする方法について説明します。 カスタム値ファイルを準備する必要があります。 ScalarDB GraphQL のカスタム値ファイルの詳細については、次のドキュメントを参照してください。

* [[非推奨] ScalarDB GraphQL のカスタム値ファイルを構成する](configure-custom-values-scalardb-graphql.md)

## ScalarDB Server のデプロイ (推奨オプション)

ScalarDB GraphQL をデプロイする場合は、次のように ScalarDB GraphQL とバックエンド データベースの間に ScalarDB Server をデプロイすることをお勧めします。

```
[クライアント] ---> [ScalarDB GraphQL] ---> [ScalarDB Server] ---> [バックエンドデータベース]
```

ScalarDB GraphQLをデプロイする前に、ドキュメント [ScalarDB Server をデプロイする方法](how-to-deploy-scalardb.md) に従ってScalarDB Serverをデプロイしてください。

## ScalarDB GraphQL をデプロイする

```console
helm install <RELEASE_NAME> scalar-labs/scalardb-graphql -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_SCALARDB_GRAPHQL> --version <CHART_VERSION>
```

## ScalarDB GraphQL のデプロイメントをアップグレードする

```console
helm upgrade <RELEASE_NAME> scalar-labs/scalardb-graphql -n <NAMESPACE> -f /<PATH_TO_YOUR_CUSTOM_VALUES_FILE_FOR_SCALARDB_GRAPHQL> --version <CHART_VERSION>
```

## ScalarDB GraphQL のデプロイメントを削除する

```console
helm uninstall <RELEASE_NAME> -n <NAMESPACE>
```
