# Scalar 製品の秘密キーと証明書ファイルを作成する方法

このドキュメントでは、Scalar 製品の秘密キーと証明書ファイルを作成する方法について説明します。

## TLS 接続用の秘密キーと証明書ファイル

ScalarDB Cluster と ScalarDL は、TLS での接続をサポートします。 TLS 機能を有効にする場合は、秘密キーと証明書ファイルを準備する必要があります。

### 証明書の要件

* 秘密鍵と証明書ファイルのアルゴリズムとしては `RSA` または `ECDSA` のみ使用可能です。

### サンプルの秘密キーと証明書ファイルを作成する手順の例

[`cfssl` および `cfssljson`](https://github.com/cloudflare/cfssl) を使用して、サンプルの秘密キーと証明書ファイルを作成できます。 `cfssl` と `cfssljson` をまだインストールしていない場合は、まずインストールしてください。

{% capture notice--info %}
**注記**

* `openssl` などの他のツールを使用して、秘密鍵と証明書ファイルを作成することもできます。 あるいは、サードパーティ CA またはプライベート CA の管理者に本番環境用の秘密キーと証明書の作成を依頼することもできます。
* この例では自己署名証明書を作成します。 ただし、これらの証明書を運用環境では使用しないことを強くお勧めします。 セキュリティ要件に基づいて実稼働環境用の証明書ファイルを作成するように、信頼できる発行者 (パブリック CA またはプライベート CA) に依頼してください。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

1. 作業ディレクトリを作成します。

   ```console
   mkdir -p ${HOME}/scalar/example/certs/
   ```

1. 作業ディレクトリを `${HOME}/scalar/example/certs/` ディレクトリに変更します。

   ```console
   cd ${HOME}/scalar/example/certs/
   ```

1. CA の情報を含む JSON ファイルを作成します。

   ```console
   cat << 'EOF' > ${HOME}/scalar/example/certs/ca.json
   {
       "CN": "scalar-example-ca",
       "key": {
           "algo": "ecdsa",
           "size": 256
       },
       "names": [
           {
               "C": "JP",
               "ST": "Tokyo",
               "L": "Shinjuku",
               "O": "Scalar Example CA"
           }
       ]
   }
   EOF
   ```

1. CA の秘密鍵と証明書ファイルを作成します。

   ```console
   cfssl gencert -initca ca.json | cfssljson -bare ca
   ```

1. CA の設定情報を含む JSON ファイルを作成します。

   ```console
   cat << 'EOF' > ${HOME}/scalar/example/certs/ca-config.json
   {
       "signing": {
           "default": {
               "expiry": "87600h"
           },
           "profiles": {
               "scalar-example-ca": {
                   "expiry": "87600h",
                   "usages": [
                       "signing",
                       "key encipherment",
                       "server auth"
                   ]
               }
           }
       }
   }
   EOF
   ```

1. サーバーの情報を含む JSON ファイルを作成します。

   ```console
   cat << 'EOF' > ${HOME}/scalar/example/certs/server.json
   {
       "CN": "scalar-example-server",
       "hosts": [
           "server.scalar.example.com",
           "localhost"
       ],
       "key": {
           "algo": "ecdsa",
           "size": 256
       },
       "names": [
           {
               "C": "JP",
               "ST": "Tokyo",
               "L": "Shinjuku",
               "O": "Scalar Example Server"
           }
       ]
   }
   EOF
   ```

1. サーバーの秘密キーと証明書ファイルを作成します。

   ```console
   cfssl gencert -ca ca.pem -ca-key ca-key.pem -config ca-config.json -profile scalar-example-ca server.json | cfssljson -bare server
   ```

1. 秘密キーと証明書ファイルが作成されたことを確認します。

   ```console
   ls -1
   ```

   [コマンド実行結果]

   ```console
   ca-config.json
   ca-key.pem
   ca.csr
   ca.json
   ca.pem
   server-key.pem
   server.csr
   server.json
   server.pem
   ```

   この場合：

    * `server-key.pem` は秘密鍵ファイルです。
    * `server.pem` は証明書ファイルです。
    * `ca.pem` はルート CA 証明書ファイルです。


## `digital-signature` 認証用の秘密鍵と証明書ファイル (ScalarDL)

ScalarDLにはいくつかの種類の認証方式があります。 認証方法として `digital-signature` を使用する場合は、秘密鍵と証明書ファイルを準備する必要があります。 認証方法の詳細については、[ScalarDL 認証ガイド](https://github.com/scalar-labs/docs-internal-scalardl/blob/main/docs/ja-jp/authentication.md)を参照してください。

### 証明書の要件

* 秘密鍵と証明書ファイルのアルゴリズムとして `ECDSA` を使用する必要があります。
* カーブパラメータとして `P-256` を使用する必要があります。
* ハッシュ関数として `SHA256` を使用する必要があります。

### サンプルの秘密キーと証明書ファイルを作成する手順の例

[`cfssl` および `cfssljson`](https://github.com/cloudflare/cfssl) を使用して、サンプルの秘密キーと証明書ファイルを作成できます。 `cfssl` と `cfssljson` をまだインストールしていない場合は、まずインストールしてください。

{% capture notice--info %}
**注記**

* `openssl` などの他のツールを使用して、秘密鍵と証明書ファイルを作成することもできます。 あるいは、サードパーティ CA またはプライベート CA の管理者に本番環境用の秘密キーと証明書の作成を依頼することもできます。
* この例では自己署名証明書を作成します。 ただし、これらの証明書を運用環境では使用しないことを強くお勧めします。 セキュリティ要件に基づいて実稼働環境用の証明書ファイルを作成するように、信頼できる発行者 (パブリック CA またはプライベート CA) に依頼してください。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

1. 作業ディレクトリを作成します。

   ```console
   mkdir -p ${HOME}/scalardl/digital-signature/certs/
   ```

1. 作業ディレクトリを `${HOME}/scalardl/digital-signature/certs/` ディレクトリに変更します。

   ```console
   cd ${HOME}/scalardl/digital-signature/certs/
   ```

1. CA の情報を含む JSON ファイルを作成します。

   ```console
   cat << 'EOF' > ${HOME}/scalardl/digital-signature/certs/ca.json
   {
       "CN": "scalardl-example-ca",
       "key": {
           "algo": "ecdsa",
           "size": 256
       },
       "names": [
           {
               "C": "JP",
               "ST": "Tokyo",
               "L": "Shinjuku",
               "O": "ScalarDL Example CA"
           }
       ]
   }
   EOF
   ```

1. CA の鍵ファイルと証明書ファイルを作成します。

   ```console
   cfssl gencert -initca ca.json | cfssljson -bare ca
   ```

1. CA 構成を含む JSON ファイルを作成します。

   ```console
   cat << 'EOF' > ${HOME}/scalardl/digital-signature/certs/ca-config.json
   {
       "signing": {
           "default": {
               "expiry": "87600h"
           },
           "profiles": {
               "scalardl-example-ca": {
                   "expiry": "87600h",
                   "usages": [
                       "signing",
                       "key encipherment",
                       "server auth"
                   ]
               }
           }
       }
   }
   EOF
   ```

1. クライアントの情報を含む JSON ファイルを作成します。

   ```console
   cat << 'EOF' > ${HOME}/scalardl/digital-signature/certs/client.json
   {
       "CN": "scalardl-client",
       "hosts": [
           "client.scalardl.example.com",
           "localhost"
       ],
       "key": {
           "algo": "ecdsa",
           "size": 256
       },
       "names": [
           {
               "C": "JP",
               "ST": "Tokyo",
               "L": "Shinjuku",
               "O": "ScalarDL Client Example"
           }
       ]
   }
   EOF
   ```

1. ScalarDL Ledger の情報を含む JSON ファイルを作成します。

   ```console
   cat << 'EOF' > ${HOME}/scalardl/digital-signature/certs/ledger.json
   {
       "CN": "scalardl-ledger",
       "hosts": [
           "ledger.scalardl.example.com",
           "localhost"
       ],
       "key": {
           "algo": "ecdsa",
           "size": 256
       },
       "names": [
           {
               "C": "JP",
               "ST": "Tokyo",
               "L": "Shinjuku",
               "O": "ScalarDL Ledger Example"
           }
       ]
   }
   EOF
   ```

1. ScalarDL Auditor の情報を含む JSON ファイルを作成します。

   ```console
   cat << 'EOF' > ${HOME}/scalardl/digital-signature/certs/auditor.json
   {
       "CN": "scalardl-auditor",
       "hosts": [
           "auditor.scalardl.example.com",
           "localhost"
       ],
       "key": {
           "algo": "ecdsa",
           "size": 256
       },
       "names": [
           {
               "C": "JP",
               "ST": "Tokyo",
               "L": "Shinjuku",
               "O": "ScalarDL Auditor Example"
           }
       ]
   }
   EOF
   ```

1. クライアントの秘密キーと証明書ファイルを作成します。

   ```console
   cfssl gencert -ca ca.pem -ca-key ca-key.pem -config ca-config.json -profile scalardl-example-ca client.json | cfssljson -bare client
   ```

1. ScalarDL Ledger の秘密キーと証明書ファイルを作成します。

   ```console
   cfssl gencert -ca ca.pem -ca-key ca-key.pem -config ca-config.json -profile scalardl-example-ca ledger.json | cfssljson -bare ledger
   ```

1. ScalarDL Auditor の秘密キーと証明書ファイルを作成します。

   ```console
   cfssl gencert -ca ca.pem -ca-key ca-key.pem -config ca-config.json -profile scalardl-example-ca auditor.json | cfssljson -bare auditor
   ```

1. 秘密キーと証明書ファイルが作成されたことを確認します。

   ```console
   ls -1
   ```

   [コマンド実行結果]

   ```console
   auditor-key.pem
   auditor.csr
   auditor.json
   auditor.pem
   ca-config.json
   ca-key.pem
   ca.csr
   ca.json
   ca.pem
   client-key.pem
   client.csr
   client.json
   client.pem
   ledger-key.pem
   ledger.csr
   ledger.json
   ledger.pem
   ```

   この場合：

   * `client-key.pem` はクライアント用の秘密鍵ファイルです。
   * `client.pem` はクライアント用の証明書ファイルです。
   * `ledger-key.pem` はLedgerの秘密鍵ファイルです。
   * `ledger.pem` はLedger用の証明書ファイルです。
   * `auditor-key.pem` は、Auditor の秘密鍵ファイルです。
   * `auditor.pem` はAuditor用の証明書ファイルです。
   * `ca.pem` はルート CA 証明書ファイルです。
