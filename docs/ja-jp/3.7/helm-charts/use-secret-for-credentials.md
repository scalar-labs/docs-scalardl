# Secret リソースを使用して資格情報を環境変数としてプロパティ ファイルに渡す方法

Kubernetes の `Secret` リソースを介して、**username** や **password** などの資格情報を環境変数として渡すことができます。 Scalar 製品の以前のバージョンの Docker イメージは、プロパティ ファイルのテンプレート化に `dockerize` コマンドを使用します。 Scalar 製品の最新バージョンの Docker イメージは、環境変数から直接値を取得します。

注記：次の環境変数名は、Scalar Helm Chart の内部で使用されるため、カスタム値ファイルで使用できません。
```console
HELM_SCALAR_DB_CONTACT_POINTS
HELM_SCALAR_DB_CONTACT_PORT
HELM_SCALAR_DB_USERNAME
HELM_SCALAR_DB_PASSWORD
HELM_SCALAR_DB_STORAGE
HELM_SCALAR_DL_LEDGER_PROOF_ENABLED
HELM_SCALAR_DL_LEDGER_AUDITOR_ENABLED
HELM_SCALAR_DL_LEDGER_PROOF_PRIVATE_KEY_PATH
HELM_SCALAR_DL_AUDITOR_SERVER_PORT
HELM_SCALAR_DL_AUDITOR_SERVER_PRIVILEGED_PORT
HELM_SCALAR_DL_AUDITOR_SERVER_ADMIN_PORT
HELM_SCALAR_DL_AUDITOR_LEDGER_HOST
HELM_SCALAR_DL_AUDITOR_CERT_HOLDER_ID
HELM_SCALAR_DL_AUDITOR_CERT_VERSION
HELM_SCALAR_DL_AUDITOR_CERT_PATH
HELM_SCALAR_DL_AUDITOR_PRIVATE_KEY_PATH
SCALAR_DB_LOG_LEVEL
SCALAR_DL_LEDGER_LOG_LEVEL
SCALAR_DL_AUDITOR_LOG_LEVEL
SCALAR_DB_CLUSTER_MEMBERSHIP_KUBERNETES_ENDPOINT_NAMESPACE_NAME
SCALAR_DB_CLUSTER_MEMBERSHIP_KUBERNETES_ENDPOINT_NAME
```

1. 環境変数名をカスタム値ファイルのプロパティ構成に設定します。
   * 例
       * ScalarDB Server
           * ScalarDB Server 3.7 以前 (Go テンプレート構文)
           
             {% raw %}
             ```yaml
             scalardb:
                databaseProperties: |
                  ...
                  scalar.db.username={{ default .Env.SCALAR_DB_USERNAME "" }}
                  scalar.db.password={{ default .Env.SCALAR_DB_PASSWORD "" }}
                  ...
             ```
             {% endraw %}

           * ScalarDB Server 3.8 以降 (Apache Commons Text 構文)
             ```yaml
             scalardb:
                databaseProperties: |
                  ...
                  scalar.db.username=${env:SCALAR_DB_USERNAME}
                  scalar.db.password=${env:SCALAR_DB_PASSWORD}
                  ...
             ```
       * ScalarDB Cluster
         ```yaml
         scalardbCluster:
           scalardbClusterNodeProperties: |
             ...
             scalar.db.username=${env:SCALAR_DB_USERNAME}
             scalar.db.password=${env:SCALAR_DB_PASSWORD}
             ...
         ```
       * ScalarDB Analytics with PostgreSQL
         ```yaml
         scalardbAnalyticsPostgreSQL:
           databaseProperties: |
           ...
           scalar.db.username=${env:SCALAR_DB_USERNAME}
           scalar.db.password=${env:SCALAR_DB_PASSWORD}
           ...
         ```
       * ScalarDL Ledger (Go テンプレート構文)
         
         {% raw %} 
         ```yaml
          ledger:
            ledgerProperties: |
              ...
              scalar.db.username={{ default .Env.SCALAR_DB_USERNAME "" }}
              scalar.db.password={{ default .Env.SCALAR_DB_PASSWORD "" }}
              ...
          ```
         {% endraw %}

       * ScalarDL Auditor (Go テンプレート構文)

         {% raw %}
         ```yaml
         auditor:
           auditorProperties: |
             ...
             scalar.db.username={{ default .Env.SCALAR_DB_USERNAME "" }}
             scalar.db.password={{ default .Env.SCALAR_DB_PASSWORD "" }}
             ...
         ```
         {% endraw %}

       * ScalarDL Schema Loader (Go テンプレート構文)

         {% raw %}
         ```yaml
         schemaLoading:
           databaseProperties: |
             ...
             scalar.db.username={{ default .Env.SCALAR_DB_USERNAME "" }}
             scalar.db.password={{ default .Env.SCALAR_DB_PASSWORD "" }}
             ...
         ```
         {% endraw %}

1. 資格情報を含む `Secret` リソースを作成します。
   `Secret` のキーとして環境変数名を指定する必要があります。
   * 例
     ```console
     kubectl create secret generic scalardb-credentials-secret \
       --from-literal=SCALAR_DB_USERNAME=postgres \
       --from-literal=SCALAR_DB_PASSWORD=postgres
     ```

1. カスタム値ファイル内の次のキーに `Secret` 名を設定します。  
   * キー
     * `scalardb.secretName` (ScalarDB Server)
     * `scalardbCluster.secretName` (ScalarDB Cluster)
     * `scalardbAnalyticsPostgreSQL.secretName` (ScalarDB Analytics with PostgreSQL)
     * `ledger.secretName` (ScalarDL Ledger)
     * `auditor.secretName` (ScalarDL Auditor)
     * `schemaLoading.secretName` (ScalarDL Schema Loader)
   * 例
     * ScalarDB Server
       ```yaml
       scalardb:
         secretName: "scalardb-credentials-secret"
       ```
     * ScalarDB Cluster
       ```yaml
       scalardbCluster:
         secretName: "scalardb-cluster-credentials-secret"
       ```
     * ScalarDB Analytics with PostgreSQL 
       ```yaml
       scalardbAnalyticsPostgreSQL:
         secretName: scalardb-analytics-postgresql-credentials-secret
       ```
     * ScalarDL Ledger
       ```yaml
       ledger:
         secretName: "ledger-credentials-secret"
       ```
     * ScalarDL Auditor
       ```yaml
       auditor:
         secretName: "auditor-credentials-secret"
       ```
     * ScalarDL Schema Loader
       ```yaml
       schemaLoading:
         secretName: "schema-loader-ledger-credentials-secret"
       ```

1. 上記のカスタム値ファイルを使用して Scalar 製品をデプロイします。

   Scalar 製品をデプロイした後、Go テンプレート文字列 (環境変数) は `Secret` の値に置き換えられます。

   * 例
       * カスタム値ファイル

         {% raw %}
         ```yaml
         scalardb:
           databaseProperties: |
             scalar.db.contact_points=jdbc:postgresql://postgresql-scalardb.default.svc.cluster.local:5432/postgres
             scalar.db.username={{ default .Env.SCALAR_DB_USERNAME "" }}
             scalar.db.password={{ default .Env.SCALAR_DB_PASSWORD "" }}
             scalar.db.storage=jdbc
         ```
         {% endraw %}

       * コンテナ内のプロパティ ファイル
         ```properties
         scalar.db.contact_points=jdbc:postgresql://postgresql-scalardb.default.svc.cluster.local:5432/postgres
         scalar.db.username=postgres
         scalar.db.password=postgres
         scalar.db.storage=jdbc
         ```

   Apache Commons Text 構文を使用する場合、Scalar 製品は環境変数から直接値を取得します。
