{% include scalardl/end-of-support-ja-jp.html %}

# 証明書の取得方法

このドキュメントでは、ScalarDL ネットワークに登録するための証明書を取得する方法について説明します。

## 前提条件

基本的に、CA サーバーと証明書の処理には CFSSL コンポーネントを使用します。

- Golang (v1.8+) のインストール
- openssl のインストール
- [cfssl & cfssljson](https://github.com/cloudflare/cfssl) のインストール

### 秘密キーと CSR を生成する

```
$ openssl ecparam -name prime256v1 -out prime256v1.pem
$ openssl req -new -newkey ec:prime256v1.pem -nodes -keyout client-key.pem.pkcs8 -out client.csr
$ openssl ec -in client-key.pem.pkcs8 -out client-key.pem
```

または

```
$ cat << EOF > client-cert.json
{
    "CN": "client.example",
    "key": {
        "algo": "ecdsa",
        "size": 256
    },
    "names": [
        {
            "O": "Client Example",
            "L": "Shinjuku",
            "ST": "Tokyo",
            "C": "JP"
        }
    ]
}
EOF

$ cfssl selfsign "" ./client-cert.json | cfssljson -bare client
$ ls -1
client-cert.json
client-key.pem
client.csr
client.pem
```

### CA サーバーから証明書を取得する

```
cfssl sign -remote "localhost:8888" -profile "client" client.csr | cfssljson -bare client -
```

- 注記: CA エンドポイント URI を指定するには、 `-remote` オプションが必要です
- 注記: 出力キーファイルのプレフィックスを指定するには、cfssljson の `-bare` オプションが必要です

CA から `client.pem` という名前の証明書を取得すると、契約を実行する準備がほぼ整います。
