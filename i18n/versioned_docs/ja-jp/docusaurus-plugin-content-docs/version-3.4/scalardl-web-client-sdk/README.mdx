## ScalarDL Web クライアント SDK

これは、アプリケーションが [ScalarDL](https://github.com/scalar-labs/scalardl) ネットワークと対話できる Web アプリケーション用のライブラリです。

## 開発とテストに使用されるノードのバージョン

このパッケージは、Node LTS v14.16.0 を使用して開発およびテストされています。 名前は「fermium」。
これは、他のノード バージョンを使用する場合、パッケージの通常の動作を保証できないことを意味します。

## インストール

パッケージマネージャーを使用してこのライブラリをインストールできます。 たとえば、NPM を使用してインストールするには:

**NPM**

```
npm install @scalar-labs/scalardl-web-client-sdk
```

@scalardl-labs/scalardl-web-client-sdk/dist に静的にインポートできるバンドル `scalardl-web-client-sdk.bundle.js` もあります。

## 方法

### ClientService インスタンスを作成する

`ClientService` クラスはこのパッケージのメインクラスです。
ScalarDLネットワークをリクエストするために以下の機能を提供します。

|名前|用途|
|----|---|
|registerCertificate|クライアントの証明書を ScalarDL ネットワークに登録するには|
|registerContract|ScalarDL ネットワークの登録済みクライアントに契約を登録するには|
|listContracts|クライアントの登録されているすべての契約を一覧表示するには|
|executeContract|お客様の登録された契約を履行するため|
|validateLedger|ScalarDL ネットワークの資産を検証して改ざんされているかどうかを確認するには|

上記のメソッドのいずれかの実行時にエラーが発生した場合、`ClientError` がスローされます。 `ClientError.statusCode` は追加のコンテキストを提供します。 ステータス コードの仕様については、以下の [実行時エラー](#runtime-error) セクションを参照してください。

以下のコード スニペットを使用して、ClientService インスタンスを作成します。

```javascript
import { ClientService } from '@scalar-labs/scalardl-web-client-sdk';
const clientService = new ClientService(clientProperties);
```

または、静的リリースを使用している場合は、次のことを試してください。

```html
<head>
    <meta charset="utf-8">
    <script src="scalardl-web-client-sdk.bundle.js"></script>
</head>

<script>
    const clientService = new Scalar.ClientService(clientProperties);
</script>
```

`clientProperties` 引数はコンストラクターにとって必須です。
これは、ユーザー `foo@example.com` が ScalarDL ネットワークのサーバー `scalardl.example.com:50051` に接続するために使用するプロパティの例です。

```javascript
{
    'scalar.dl.client.server.host': 'scalardl.example.com',
    'scalar.dl.client.server.port': 50051,
    'scalar.dl.client.server.privileged_port': 50052,
    'scalar.dl.client.cert_holder_id': 'foo@example.com',
    'scalar.dl.client.private_key_pem': "-----BEGIN EC PRIVATE KEY-----\nMHc...",
    'scalar.dl.client.cert_pem': "-----BEGIN CERTIFICATE-----\nMIICjTCCAj...n",
    'scalar.dl.client.cert_version': 1,
    'scalar.dl.client.tls.enabled': false,
}
```

ScalarDL ネットワークで Auditor 機能が有効になっている場合は、次の例のように追加のプロパティを指定します。 この例では、クライアントは Auditor 機関 `scalardl-auditor.example.com` と対話し、契約実行時のデータ改ざんなどのビザンチン障害を検出します。

```javascript
{
    'scalar.dl.client.auditor.enabled': true,
    'scalar.dl.client.auditor.host': 'scalardl-auditor.example.com',
    'scalar.dl.client.auditor.port': 40051,
    'scalar.dl.client.auditor.privileged_port': 40052,
}
```

以下の説明では、clientService インスタンスがあると仮定します。

### 証明書を登録する

`registerCertificate` 関数を使用して、ScalarDL ネットワークに証明書を登録します。

```javascript
await clientService.registerCertificate();
```

ステータスの詳細については、下記の[ステータスコード](#status-code)セクションを参照してください。

### 契約書を登録する

契約を登録するには、`registerContract` 関数を使用します。

```javascript
await clientService.registerContract('contractId', 'com.example.contract.contractName', contractUint8Array, propertiesObject);
```

### 関数を登録する

関数を登録するには、`registerFunction` 関数を使用します。

```javascript
await clientService.registerFunction('functionId, 'com.example.function.functionName', functionUint8Array);
```

### 登録された契約をリストする

`listContracts` 関数を使用して、登録されているすべての契約を一覧表示します。

```javascript
const constracts = await clientService.listContracts();
```

### 契約を締結する

登録された契約を実行するには、`executeContract` 関数を使用します。 引数に `_functions_` が指定されている場合も関数を実行します。

```javascript
const response = await clientService.executeContract('contractId', argumentObject);
const executionResult = response.getResult();
const proofsList = response.getProofs();
```

```javascript
const response = await clientService.executeContract('contractId', { 'arg1': 'a', '_functions_': [functionId] }, { 'arg2': 'b' });
```

`{ 'arg1': 'a', ` は [contractArgument](https://github.com/scalarindetail/scalardl-node-client-sdk/blob/3e531b4c62fb14702a873b07f44cb37212f04be4/test/TestFunction.java#L14) 経由で渡され、`{ 'arg2': 'b' }` は [functionArgument](https://github.com/scalarindetail/scalardl-node-client-sdk/blob/3e531b4c62fb14702a873b07f44cb37212f04be4/test/TestFunction.java#L15) 経由で渡されます。

### アセットを検証する

`validateLedger` 関数を使用して、ScalarDL ネットワーク内のアセットを検証します。

```javascript
const response = await clientService.validateLedger('assetId');
const status = response.getCode();
const proof = response.getProof();
```

#### アセットを線形的に検証する

Auditor が有効な ScalarDL ネットワークにおけるデフォルトの Ledger 検証は非線形化可能です。 つまり、Ledger と Auditor が一時的に矛盾しているように見える場合があります。
ScalarDL は、線形化可能な Ledger 検証をサポートします。
これを使用するには、次のようにプロパティを設定します。

```javascript
{
    'scalar.dl.client.auditor.enabled': true,
    ...
    'scalar.dl.client.auditor.linearizable_validation.enabled': true,
    'scalar.dl.client.auditor.linearizable_validation.contract_id': '<choose a contract ID>',
}
```

次に、[ValidateLedger](https://github.com/scalar-labs/scalardl-java-client-sdk/blob/master/src/main/java/com/scalar/dl/client/contract/ValidateLedger.java) を登録します。 コントラクトをプロパティで指定したコントラクト ID として使用します。
次に、ClientService.validateLedger 関数は線形化可能な Ledger 検証を提供できます。

### ランタイムエラー

クライアントによってスローされたエラーにはステータス コードが表示されます。

```javascript
try {
    await clientService.registerCertificate();
} catch (clientError) {
    const message = clientError.message;
    const statusCode = clientError.code;
}
```

列挙型 `StatusCode` は、考えられるすべてのステータスを列挙します。

```
StatusCode = {
  OK: 200,
  INVALID_HASH: 300,
  INVALID_PREV_HASH: 301,
  INVALID_CONTRACT: 302,
  INVALID_OUTPUT: 303,
  INVALID_NONCE: 304,
  INCONSISTENT_STATES: 305,
  INVALID_SIGNATURE: 400,
  UNLOADABLE_KEY: 401,
  UNLOADABLE_CONTRACT: 402,
  CERTIFICATE_NOT_FOUND: 403,
  CONTRACT_NOT_FOUND: 404,
  CERTIFICATE_ALREADY_REGISTERED: 405,
  CONTRACT_ALREADY_REGISTERED: 406,
  INVALID_REQUEST: 407,
  CONTRACT_CONTEXTUAL_ERROR: 408,
  ASSET_NOT_FOUND: 409,
  FUNCTION_NOT_FOUND: 410,
  UNLOADABLE_FUNCTION: 411,
  INVALID_FUNCTION: 412,
  DATABASE_ERROR: 500,
  UNKNOWN_TRANSACTION_STATUS: 501,
  RUNTIME_ERROR: 502,
  CLIENT_IO_ERROR: 600,
  CLIENT_DATABASE_ERROR: 601,
  CLIENT_RUNTIME_ERROR: 602,
};
```

## IndexedDB のサポート

このライブラリは、ブラウザの [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) への秘密キーの保存をサポートします。
この機能を利用するには、以下のように `ClientService` オブジェクトを `ClientServiceWithIndexedDb` で装飾してください。

```
const clientService = await new ClientServiceWithIndexedDb(new ClientService(properties));
```

`ClientServiceWithIndexedDb` は、キーがクライアント プロパティで指定されている場合は IndexedDB に秘密キーを保存し、キーがクライアント プロパティで指定されていない場合は IndexedDB から秘密キーを読み取ります。

挙動を踏まえると以下のような使い方が推奨されます。
秘密キーが見つからない場合、 `IndexedDbKeyNotFoundError` がスローされ、アプリケーションは外部サービスから秘密キーを取得する必要があります。

```javascript
let properties = {
    'scalar.dl.client.cert_holder_id': 'foo@example.com',
    'scalar.dl.client.cert_version': 1,
    ...
}; // Not specify 'scalar.dl.client.private_key_pem' or 'scalar.dl.client.private_key_cryptokey'

let clientService;
try {
    // It tries to read a private key from IndexedDB
    clientService = await new ClientServiceWithIndexedDb(new ClientService(properties));
} catch (err) {
    if (err instanceof IndexedDbKeyNotFoundError) {
        properties['scalar.dl.client.private_key_pem'] = /* from some place */
        // This time, it stores the specified private key in IndexedDB
        clientService = await new ClientServiceWithIndexedDb(new ClientService(properties));
    } else {
        throw err; // How to handle the error should be decided by application side
    }
}
```

### deleteIndexedDb

deleteIndexedDb は、クライアント プロパティの `scalar.dl.client.cert_holder_id` および `scalar.dl.client.cert_version` に従って、IndexedDB 内の秘密キーを削除します。

```javascript
clientService = await new ClientServiceWithIndexedDb(new ClientService(properties));
clientService.deleteIndexedDb(); // Remove stored key in indexedDb
```

## Envoy の設定

ScalarDLT サーバー (grpc) は、 `rpc.status-bin` と呼ばれるカスタム ヘッダーを使用して、エラー メタデータをクライアントと共有します。 これは、ヘッダーをクライアントに公開するように envoy を構成する必要があることを意味します。
具体的には、[cors configuration](https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/route/route_components.proto#envoy-api-msg-route-corspolicy) の `expose-headers` フィールドに `rpc.status-bin` を追加する必要があります。

## 貢献する

このライブラリは主に Scalar Engineering チームによって保守されていますが、もちろん、どんなご支援にも感謝いたします。

* 質問したり、回答を見つけたり、他のユーザーを支援するには、[stackoverflow](https://stackoverflow.com/) にアクセスし、[scalardl](https://stackoverflow.com/questions/tagged/scalardl) タグを使用してください。
* バグの報告、改善の提案、新機能のリクエストについては、問題を開いてご協力ください。

## ライセンス

ScalarDL クライアント SDK は、AGPL (ルート ディレクトリの LICENSE ファイルにあります) と商用ライセンスの両方に基づいてデュアル ライセンスが付与されています。 必要に応じて、上記のライセンスのいずれかを選択できます。 商用ライセンスについては、[お問い合わせ](https://www.scalar-labs.com/contact/) までお問い合わせください。
