include scalardl/end-of-support-ja-jp.html

# CFSSL で CA サーバーを起動する方法

このドキュメントでは、CFSSL を使用して CA サーバーを起動する方法について説明します。

## 前提条件

基本的に、CA サーバーと証明書の処理には CFSSL コンポーネントを使用します。

- Golang (v1.8+) のインストール
- [cfssl & cfssljson](https://github.com/cloudflare/cfssl) のインストール

## ルート CA 証明書を作成する

以下のようにjson形式でCSRファイルを作成します。

```
[ca-csr.json]
{
  "CN": "Sample Root CA",
  "key": {
    "algo": "ecdsa",
    "size": 256
  },
  "names": [
    {
      "C":  "JP",
      "L":  "Tokyo",
      "O":  "Sample Root CA",
      "ST": "Tokyo"
    }
  ]
}
```

CSR に基づいて自己署名証明書と秘密キーを生成します。

```
$ cfssl gencert -initca ca-csr.json | cfssljson -bare ca

$ ls
ca-csr.json ca-key.pem  ca.csr      ca.pem
```

## 証明書を保存するためのデータベースを作成する

キー/証明書情報を保存するためのデータベースが必要です。
CFSSL は現在、MySQL、PostgreSQL、SQLite をサポートしています。
今回は簡単にするために SQLite を使用します。

```
$ go get bitbucket.org/liamstask/goose/cmd/goose   
$ goose -path $GOPATH/src/github.com/cloudflare/cfssl/certdb/sqlite up
``` 

これにより、現在の場所に certstore_development.db が作成されます。

## CA サーバーの構成ファイルを作成する

署名アルゴリズム、エンドポイント URL、中間サーバーの使用法などを構成します。
サーバーがローカル環境でのみ実行されることを前提としています。

```
[cfssl-config.json]
{
  "signing": {
    "default": {
      "ocsp_url": "http://localhost:8889",
      "crl_url": "http://localhost:8888/crl",
      "expiry": "26280h",
      "usages": [
        "signing",
        "key encipherment",
        "client auth"
      ]
    },
    "profiles": {
      "ocsp": {
        "usages": ["digital signature", "ocsp signing"],
        "expiry": "26280h"
      },
      "intermediate": {
        "usages": ["cert sign", "crl sign"],
        "expiry": "26280h",
        "ca_constraint": {"is_ca": true}
      },
      "server": {
        "usages": ["signing", "key encipherment", "server auth"],
        "expiry": "26280h"
      },
      "client": {
        "usages": ["signing", "key encipherment", "client auth"],
        "expiry": "26280h"
      }
    }
  }
}
```

TODO: 設定について詳しく調べる

次に、前のセクションで作成したデータベース ファイルを指すデータベースの構成ファイルを作成します。

```
[db-config.json]
{
  "driver":"sqlite3",
  "data_source":"certstore_development.db"
}
```

### Create an intermediate CA certificate

この手順は、ルート CA 証明書の生成に似ています。

```
[server-ca.csr.json]
{
  "CN": "Sample Intermediate CA",
  "key": {
    "algo": "ecdsa",
    "size": 256
  },
  "names": [
    {
      "C":  "JP",
      "L":  "Tokyo",
      "O":  "Sample Intermediate CA",
      "ST": "Tokyo"
    }
  ]
}
```

主な違いは、 `-initca` オプションの代わりにルート CA (`-ca -ca-key`) と cfssl config (`-cfssl-config`) を指定することです。

```
$ cfssl gencert -ca ca.pem -ca-key ca-key.pem -config cfssl-config.json -profile "intermediate" server-ca.csr.json | cfssljson -bare ca-server
```

### OCSP サーバー証明書を生成する

注記: OCSP は、X.509 デジタル証明書の失効ステータスを取得するために使用されるインターネット プロトコルです。

```
[ocsp.csr.json]
{
  "CN": "Sample OCSP",
  "key": {
    "algo": "ecdsa",
    "size": 256
  },
  "names": [
    {
      "C":  "JP",
      "L":  "Tokyo",
      "O":  "Sample OCSP",
      "ST": "Tokyo"
    }
  ]
}
```

```
$ cfssl gencert -ca ca-server.pem -ca-key ca-server-key.pem -config cfssl-config.json -profile "ocsp" ocsp.csr.json | cfssljson -bare server-ocsp
```

## サーバーを起動する

これで準備は完了です。 サーバーを起動しましょう。

### CA サーバー

```
$ cfssl serve -db-config db-config.json -ca-key ca-server-key.pem -ca ca-server.pem -config cfssl-config.json -responder server-ocsp.pem -responder-key server-ocsp-key.pem
```

### OCSP サーバー

```
$ cfssl ocsprefresh -db-config db-config.json -responder server-ocsp.pem -responder-key server-ocsp-key.pem -ca ca-server.pem

// Bundle the Root CA and Intermediate CA
$ cat ca.pem ca-server.pem | tee bundle.pem

// Pre-generate the OCSP response
$ cfssl ocspdump -db-config db-config.json > ocspdump.txt

// Start the server
cfssl ocspserve -port=8889 -responses=ocspdump.txt
```

## 参考文献

- [cfssl & cfssljson](https://github.com/cloudflare/cfssl)
- [Setup Cloudflare CFSSL with OCSP responder](https://medium.com/@vrmvrm/setup-cloudflare-cfssl-with-ocsp-responder-aba44b4134e6)
- [Revoking certificates and running OCSP responder](https://propellered.com/2017/11/19/cfssl_revoking_certs_ocsp_reponder/)
