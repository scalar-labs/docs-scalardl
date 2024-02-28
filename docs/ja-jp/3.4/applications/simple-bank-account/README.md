{% include scalardl/end-of-support-ja-jp.html %}

# 簡単な銀行口座申請

## 概要

シンプルな銀行口座申請です。 ユーザーが実行できるアクションは、アカウントの作成、アカウント履歴の表示、アカウントへの資金の入金、アカウントからの資金の引き出し、アカウント間の資金の転送です。 アカウントで実行されたすべてのアクションは ScalarDL に記録されます。これは、ブロックチェーンがブロックを記録する方法と同様に、アカウント履歴が改ざん明示的な方法で記録されることを意味します。 これは、アカウント履歴が (意図的かどうかに関わらず) 変更された場合、これを検出することが可能であることを意味します。
 
ここでは物事を簡単にするために、銀行がすべての契約を実行するための秘密鍵を保持していると仮定します (これがどのように機能するかについては、以下を参照してください)。 おそらくこれは、この銀行アプリケーションを実際に使用する方法ではありません。 この場合、悪意のあるアカウント マネージャーがユーザーのアカウント履歴を実際に変更する可能性があります。たとえば、単にアカウントを再作成し、偽のデータを入力するだけです。 より意味のある設定は、銀行が口座に入金するための秘密鍵を所有し、各ユーザーが自分の秘密鍵を使用して引き出しと送金の契約を登録することです。 その場合、銀行のみが口座に資金を移動でき、ユーザーのみが口座から資金を移動できます。

このアプリケーションでは、次の 5 つのコントラクトを使用します。

- `AccountHistory.java`
- `CreateAccount.java`
- `Deposit.java`
- `Transfer.java`
- `Withdraw.java`

(これらの契約は [`src/main/java/com/scalar/application/bankaccount/contract`](./src/main/java/com/scalar/application/bankaccount/contract) にあります)。 これらの契約は銀行によって登録され、銀行はそれぞれ、口座履歴の表示、口座の作成、口座への入金、口座間の資金移動、口座からの資金の引き出しを行うことができます。

このアプリケーションの全体的なアーキテクチャは次のようになります。 (この使用例は簡素化のためのものであり、実際には少し異なる可能性があることに再度注意してください。)

![architecture](./docs/img/architecture.jpg)

## アプリケーションを試してみる

[ScalarDL Client SDK](https://github.com/scalar-labs/scalardl-client-sdk)をダウンロードします。 ScalarDL が実行されていることを確認し、必要なコントラクトをすべて実行して登録します。

```
$ SCALAR_SDK_HOME=/path/to/scalardl-client-sdk ./register
```

IntelliJ (または選択した IDE) を使用するか、プロジェクトのホーム ディレクトリで `gradle bootRun` を実行して、アプリケーションを実行します。 アプリと対話するために HTTP リクエストを送信できるサーバーを `localhost:8080` 上に作成する必要があります。 詳細については、[API ドキュメント](./docs/api_endpoints.md) を参照してください。 HTTP リクエストを作成するには、[Postman](https://www.getpostman.com/) が非常に優れていることがわかりました。

## ScalarDL アプリケーションの作成に関する短いチュートリアル

Spring Boot を使用して、コントラクトと対話する Web サービスを作成することにしました。 もちろん、これが唯一の選択肢ではありません。 別の選択肢は、たとえば [資産管理アプリケーション](https://github.com/indetail-blockchain/getting-started-with-scalardl) で行われたように、コマンド ライン インターフェイスを作成することです。 そこには、ScalarDL 用のアプリケーションを作成するための非常に優れたチュートリアルもあります。

このチュートリアルでは、Web サービスまたはコマンド ライン インターフェイスのレベルでの詳細については説明せず、代わりにアプリケーションと ScalarDL の間の対話に焦点を当てます。 コントラクトの作成方法、コントラクトの登録方法、そして ScalarDL SDK を使用してアプリケーションからこれらのコントラクトを呼び出す方法について説明します。

### 契約

コントラクトは、 `Contract` クラスを拡張し、 `invoke` メソッドをオーバーライドする Java クラスです。 `Deposit.java` コントラクトを詳しく見てみましょう。

```java
package com.scalar.application.bankaccount.contract;

import com.scalar.dl.ledger.asset.Asset;
import com.scalar.dl.ledger.contract.Contract;
import com.scalar.dl.ledger.exception.ContractContextException;
import com.scalar.dl.ledger.database.Ledger;
import java.util.Optional;
import javax.json.Json;
import javax.json.JsonObject;

public class Deposit extends Contract {
  @Override
  public JsonObject invoke(Ledger ledger, JsonObject argument, Optional<JsonObject> property) {
    if (!(argument.containsKey("id") && argument.containsKey("amount"))) {
      throw new ContractContextException("a required key is missing: id and/or amount");
    }

    String id = argument.getString("id");
    long amount = argument.getJsonNumber("amount").longValue();

    if (amount < 0) {
      throw new ContractContextException("amount is negative");
    }

    Optional<Asset> response = ledger.get(id);

    if (!response.isPresent()) {
      throw new ContractContextException("account does not exist");
    }

    long oldBalance = response.get().data().getInt("balance");
    long newBalance = oldBalance + amount;

    ledger.put(id, Json.createObjectBuilder().add("balance", newBalance).build());
    return Json.createObjectBuilder()
        .add("status", "succeeded")
        .add("old_balance", oldBalance)
        .add("new_balance", newBalance)
        .build();
  }
}
```
この契約が適切に機能するためには、ユーザーはアカウントの `id` と `amount` を指定する必要があります。 したがって、最初に行うことは、引数にこれら 2 つのキーが含まれているかどうかを確認し、含まれていない場合は `ContractContextException` をスローすることです。

**注記:** `ContractContextException` はコントラクト内で唯一スロー可能な例外であり、回復不可能なエラーが発生した場合は常にスローされる必要があります。
 
したがって、`id` と `amount` があると仮定して、`amount` に対して簡単な非負のチェックを行い、負の場合は再度 `ContractContextException` をスローします。 これで、`ledger` を操作する準備が整いました。
 
`ledger` で呼び出すことができるメソッドは 3 つあります: `get(String s)`、 `put(String s, JsonObject jsonObject)`、および `scan(AssetFilterassetFilter)` です。 `get(String s)` は Ledger から資産 `s` を取得します。 `put(String s, JsonObject argument)` は、アセット `s` をデータ `jsonObject` に関連付け、アセットの年齢を増やします。 `scan(AssetFilterassetFilter)` は、`AssetFilter` で指定されたアセットの履歴のバージョンを返します。
 
**注記:** Ledger ではブラインド書き込みは許可されていません。つまり、特定の資産に対して `put` を実行する前に、まずその資産を `get` する必要があります。 さらに、 `scan` は読み取り専用コントラクトでのみ許可されます。つまり、1 つのコントラクトで `scan` と `put` の両方を行うことはできません。
 
契約の残りの部分は単純な方法で進められます。 まず Ledger から資産を `get` し、現在の残高を取得し、それに預金額を追加し、最後に新しい残高で資産を Ledger に `put`。

最後に `JsonObject` を返す必要があります。 `JsonObject` に何が含まれるかは、コントラクトの設計者次第です。 ここでは、`status` メッセージ、`old_balance`、および `new_balance` を含めることにしました。

必要に応じて、このアプリケーションが使用する他のコントラクトを [`scr/main/java/com/scalar/application/bankaccount/contract`](./src/main/java/com/scalar/application/bankaccount/contract) で表示できます。
 
契約書を作成したら、それを編集する必要があります。 これは次のようにして実行できます。

```
$ ./gradlew build
```

### 認定資格と契約の登録

これで契約書を作成し、まとめたはずです。 ただし、それらを実行する前に、ScalarDL ネットワークに登録する必要があります。 [ScalarDL Client SDK](https://github.com/scalar-labs/scalardl-client-sdk) `client/bin` ディレクトリで利用可能なツールを利用して、コントラクトを登録して実行します。 このディレクトリにアクセスできることを確認してください。

ここで、証明書 (例: `client.pem`) とそれに対応する秘密鍵 (例: `client-key.pem`)、および ScalarDL を起動して実行する必要があります。 構成に合わせて `client.properties` （`conf` ディレクトリにあります）を編集します。 次のような行が含まれている必要があります。

```bash
scalar.dl.client.server.host=localhost
scalar.dl.client.server.port=50051
scalar.dl.client.cert_holder_id=alice
scalar.dl.client.cert_path=conf/client.pem
scalar.dl.client.private_key_path=conf/client-key.pem
```

すべてが正しく設定されていれば、次のように証明書を ScalarDL ネットワークに登録できるはずです。

```bash
$ ${SCALAR_SDK_HOME}/client/bin/register-cert --properties ./conf/client.properties
```

成功すると、ステータス コード 200 が返されます。

契約を登録するには、次の形式を使用して `conf` ディレクトリに `contracts.toml` ファイルを作成します。

```toml
[[contracts]]
contract-id = "create-account"
contract-binary-name = "com.scalar.application.bankaccount.contract.CreateAccount"
contract-class-file = "build/classes/java/main/com/scalar/application/bankaccount/contract/CreateAccount.class"

[[contracts]]
contract-id = "deposit"
contract-binary-name = "com.scalar.application.bankaccount.contract.Deposit"
contract-class-file = "build/classes/java/main/com/scalar/application/bankaccount/contract/Deposit.class"

[[contracts]]
contract-id = "transfer"
contract-binary-name = "com.scalar.application.bankaccount.contract.Transfer"
contract-class-file = "build/classes/java/main/com/scalar/application/bankaccount/contract/Transfer.class"  
```

この例では、 `CreateAccount.java`、`Deposit.java`、`Transfer.java` の 3 つのコントラクトを登録します。 `contract-binary-name` と `contract-class-file` は決まっていますが、 `contract-id` は自由に選択できます。 以下で説明するように、`contract-id` は、 `ClientService` を使用して特定のコントラクトを参照する方法です。

toml ファイルを作成したら、次のように指定したすべてのコントラクトを登録できます。

```bash
$ ${SCALAR_SDK_HOME}/client/bin/register-contracts --properties ./conf/client.properties --contracts-file ./conf/contracts.toml
```

正常に登録された各契約はステータス コード 200 を返す必要があります。

### 契約の締結

必要に応じて、登録されている契約を実行できるようになります。 たとえば、登録契約を使用していくつかの口座を作成し、そのうちの 1 つの口座に資金を入金し、これらの資金の一部をもう一方の口座に転送します。

ID が `a111` と `b222` の 2 つのアカウントを作成します。 (契約 ID には任意の文字列を指定できます。)

```bash
$ ${SCALAR_SDK_HOME}/client/bin/execute-contract --properties ./conf/client.properties --contract-id create-account --contract-argument '{"id": "a111"}'
$ ${SCALAR_SDK_HOME}/client/bin/execute-contract --properties ./conf/client.properties --contract-id create-account --contract-argument '{"id": "b222"}'
```

ここで、アカウント `a111` に 100 を入金します。

```bash
$ ${SCALAR_SDK_HOME}/client/bin/execute-contract --properties ./conf/client.properties --contract-id deposit --contract-argument '{"id": "a111", "amount": 100}'
```

最後に、25 を `a111` から `b222` に転送します。

```bash
$ ${SCALAR_SDK_HOME}/client/bin/execute-contract --properties ./conf/client.properties --contract-id transfer --contract-argument '{"from": "a111", "to": "b222", "amount": 100}'
```

アプリケーション自体を実行している場合は、[API エンドポイント](./docs/api_endpoints.md) を使用してこれらのコマンドを実行できます。
 
## 顧客サービス

これで、契約が ScalarDL ネットワークに登録されたはずです。 アプリケーションからこれらのコントラクトを実行するには、[ScalarDL Client SDK](https://github.com/scalar-labs/scalardl-client-sdk) の `ClientService` クラスを利用します。

クライアント SDK は [Maven Central](https://search.maven.org/search?q=a:scalardl-client-sdk) で入手でき、次の依存関係を追加することで Gradle を使用してアプリケーションにインストールできます。 あなたの `build.gradle`:

```groovy
dependencies {
    compile group: 'com.scalar-labs', name: 'scalardl-java-client-sdk', version: '2.0.4'
}
```

次のスニペットは、`ClientService` オブジェクトをインスタンス化する方法を示しています。ここで、`properties` は `client.properties` ファイルへのパスにする必要があります。

```java
Injector injector =
        Guice.createInjector(new ClientModule(new ClientConfig(new File(properties))));
try (ClientService clientService = injector.getInstance(ClientService.class)) {
  ...
}
```

`ClientService` には、もちろんコントラクトを実行するために使用できるメソッド `executeContract(String id, JsonObject argument)` が含まれています。 例えば：

```java
JsonObject argument = Json.createObjectBuilder().add("id", "010-123456789").build();
ContractExecutionResult result = clientService.executeContract("create-account", argument);
```

これにより、上で行ったように、引数 `{"id": "010-123456789"}` を指定して `CreateAccount` コントラクトが実行されます。 コントラクトの登録時に選択した、指定された ID `create-account` を使用してコントラクトを呼び出していることに注意してください。

コントラクトの実行結果は `ContractExecutionResult` です。 これには結果と証明が含まれており、それぞれは次のようにして取得できます。

```java
result.getProofs()
result.getResult();
```

## 次は何ですか？

独自のアプリの作成を始めるのに十分な情報が得られたことを願っています。 次に試してみることができるアイデアをいくつか紹介します。
 
- [ScalarDL クライアント SDK](https://github.com/scalar-labs/scalardl-client-sdk) GitHub ページにアクセスします。
- [ScalarDL エミュレータ](https://github.com/scalar-labs/scalardl-emulator) を使用すると、メモリ内 Ledger でコントラクトをテストできます。
