include scalardl/end-of-support-ja-jp.html

# ScalarDL でのエラーの処理方法に関するガイド

このドキュメントでは、ScalarDL でのエラーを処理するためのガイドラインをいくつか示します。

## 基本

ScalarDL は、ユーザーが ScalarDL システムと適切に対話するために [クライアント SDK](https://github.com/scalar-labs/scalardl/blob/master/docs/index.md#client-sdks) を使用することを期待しています。
エラーが発生すると、クライアント SDK はステータス コードとともに例外 (JavaScript ベースの SDK ではエラー) をユーザーに返します。
ユーザーはステータス コードを確認してエラーの原因を特定する必要があります。

## エラー処理の書き方

ここでは、エラーが発生した場合の対処方法を詳しく説明します。

Java クライアント SDK では、SDK が [ClientException](https://scalar-labs.github.io/scalardl/javadoc/latest/client/com/scalar/dl/client/Exception/ClientException.html) をスローするため、ユーザーは 次のように例外をキャッチしてエラーを処理します。

```java
ClientService clientService = ...;
try {
    // interact with ScalarDL through a ClientService object
} catch (ClientException) {
    // e.getStatusCode() returns the status of the error
}
```

Javascript ベースのクライアント SDK でも同様にエラーを処理できます。

```javascript
const clientService = ...; // ClientService object
try {

} catch (e) {
    // e.code returns the status of the error
    // e.message returns the error message
}

```

## ステータスコード

ステータス コードは、HTTP ステータス コードと同様に 5 つのクラスにグループ化されています。

* 成功した彫像 (200-299)
* 検証エラー (300-399)
* ユーザーエラー (400-499)
* サーバーエラー (500-599)
* クライアントエラー (600-699)

詳細については、[StatusCode](https://scalar-labs.github.io/scalardl/javadoc/latest/common/com/scalar/dl/ledger/service/StatusCode.html)をご確認ください。
