# ScalarDL ベンチマーク ツール

このチュートリアルでは、ScalarDL のベンチマーク ツールを実行する方法について説明します。 ベンチマークは、一連の標準に対してシステムがどのように動作するかを評価するのに役立ちます。

## ワークロードのベンチマーク

- SmallBank
- TPC-C (新規注文および支払いトランザクションのみ)
- YCSB (ワークロード A、C、および F)

## 前提条件

- 次の Java 開発キット (JDK) のいずれか:
   - [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) LTS バージョン 8
   - [OpenJDK](https://openjdk.org/install/) LTS バージョン 8
- Gradle
- [Kelpie](https://github.com/scalar-labs/kelpie)
   - Kelpie は、システムのベンチマークや検証などのエンドツーエンドのテストを実行するためのフレームワークです。 [Kelpie Releases](https://github.com/scalar-labs/kelpie/releases) から最新バージョンを入手し、アーカイブ ファイルを解凍します。

{% capture notice--info %}
**注記**

現在、ベンチマーク ツールを実行するときに使用できるのは JDK 8 のみです。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

### 環境をセットアップする

ベンチマーク ツールには次のものが必要です。

- ベンチマークを実行するクライアント
- 対象の Ledger サーバー
- ターゲット Auditor サーバー (オプション)

上記のコンポーネントをセットアップし、次のスタート ガイドに従ってクライアント、Ledger、および Auditor  (オプション) のプロパティを構成します。

- [Ledger のみの構成](../getting-started.md)
- [Ledger と Auditor の構成](../getting-started-auditor.md)

{% capture notice--info %}
**注記**

クライアント SDK をダウンロードして証明書を手動で登録する必要はありません。 このチュートリアルで後ほど説明するように、ベンチマーク ツールは必要な証明書と契約を自動的に登録します。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

## ベンチマーク ツールをセットアップする

次のセクションでは、ベンチマーク ツールのセットアップ方法について説明します。

### ScalarDL ベンチマーク リポジトリのクローンを作成します。

**ターミナル**を開き、次のコマンドを実行して ScalarDL ベンチマーク リポジトリのクローンを作成します。

```console
$ git clone https://github.com/scalar-labs/scalardl-benchmarks
```

次に、次のコマンドを実行して、ベンチマーク ファイルが含まれるディレクトリに移動します。

```console
$ cd scalardl-benchmarks
```

### ツールを構築する

ベンチマーク ツールを構築するには、次のコマンドを実行します。

```console
$ ./gradlew shadowJar
```

### ベンチマーク構成ファイルを準備する

ベンチマークを実行するには、ベンチマーク構成ファイルを準備する必要があります。 構成ファイルには、少なくとも実行するワークロード モジュールの場所とクライアント構成が必要です。

以下は、TPC-C ベンチマークを実行するための設定例です。 `client_config` の下の構成は、[以前にセットアップしたベンチマーク環境](#set-up-your-environment) と一致する必要があります。

{% capture notice--info %}
**注記**

あるいは、 `.toml` ファイルで各クライアント構成項目を指定する代わりに、ScalarDL クライアント プロパティ ファイルを使用することもできます。 `config_file` が指定されている場合 (以下でコメントアウトされています)、`client_config` の下にある他のすべての設定は無視されます。
{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

```toml
[modules]
[modules.preprocessor]
name = "com.scalar.dl.benchmarks.tpcc.TpccLoader"
path = "./build/libs/scalardl-benchmarks-all.jar"
[modules.processor]
name = "com.scalar.dl.benchmarks.tpcc.TpccBench"
path = "./build/libs/scalardl-benchmarks-all.jar"
[modules.postprocessor]
name = "com.scalar.dl.benchmarks.tpcc.TpccReporter"
path = "./build/libs/scalardl-benchmarks-all.jar"

[client_config]
config_file = "/<PATH_TO>/client.properties"
#ledger_host = "localhost"
#auditor_host = "localhost"
#auditor_enabled = "true"
#cert_holder_id = "test_holder"
#certificate = "/<PATH_TO>/client.pem"
#private_key = "/<PATH_TO>/client-key.pem"
```

構成ファイル内のモジュールに渡すパラメータを定義できます。 詳細については、以下のサンプル構成ファイルと、[共通パラメータ](#common-parameters) で使用可能なパラメータを参照してください。

- **SmallBank:** [`smallbank-benchmark-config.toml`](https://github.com/scalar-labs/scalardl-benchmarks/blob/master/smallbank-benchmark-config.toml)
- **TPC-C:** [`tpcc-benchmark-config.toml`](https://github.com/scalar-labs/scalardl-benchmarks/blob/master/tpcc-benchmark-config.toml)
- **YCSB:** [`ycsb-benchmark-config.toml`](https://github.com/scalar-labs/scalardl-benchmarks/blob/master/ycsb-benchmark-config.toml)

## ベンチマークを実行する

ベンチマークを選択し、コマンドに従ってベンチマークを実行します。

<div id="tabset-1">
<div class="tab">
  <button class="tablinks" onclick="openTab(event, 'SmallBank_1', 'tabset-1')" id="defaultOpen-1">SmallBank</button>
  <button class="tablinks" onclick="openTab(event, 'TPC-C_1', 'tabset-1')">TPC-C</button>
  <button class="tablinks" onclick="openTab(event, 'YCSB_1', 'tabset-1')">YCSB</button>
</div>

<div id="SmallBank_1" class="tabcontent" markdown="1">

SmallBank ベンチマークを実行するには、次のコマンドを実行します。`<PATH_TO_KELPIE>` を Kelpie ディレクトリへのパスに置き換えます。

```console
$ /<PATH_TO_KELPIE>/bin/kelpie --config smallbank-benchmark-config.toml
```
</div>
<div id="TPC-C_1" class="tabcontent" markdown="1">

TPC-C ベンチマークを実行するには、次のコマンドを実行します。`<PATH_TO_KELPIE>` を Kelpie ディレクトリへのパスに置き換えます。

```console
$ /<PATH_TO_KELPIE>/bin/kelpie --config tpcc-benchmark-config.toml
```
</div>
<div id="YCSB_1" class="tabcontent" markdown="1">

YCSB ベンチマークを実行するには、次のコマンドを実行します。`<PATH_TO_KELPIE>` を Kelpie ディレクトリへのパスに置き換えます。

```console
$ /<PATH_TO_KELPIE>/bin/kelpie --config ycsb-benchmark-config.toml
```
</div>
</div>

さらに、次のオプションが利用可能です。

- `--only-pre`。 証明書と契約を登録し、データをロードするだけです。
- `--only-process`。 ベンチマークのみを実行します。
- `--除く-pre` 証明書と契約の登録とデータのロードを行わずにジョブを実行します。
- `--プロセスを除く`。 ベンチマークを実行せずにジョブを実行します。

## 共通パラメータ

| 名前            | 説明                              | デフォルト |
|:---------------|:----------------------------------|:---------|
| `concurrency`  | ベンチマーク用のスレッドの数。         | `1`      |
| `run_for_sec`  | ベンチマークの継続時間 (秒単位)。      | `60`     |
| `ramp_for_sec` | ベンチマーク前の立ち上げ時間 (秒単位)。 | `0`      |

## ワークロード固有のパラメータ

ワークロードを選択すると、使用可能なパラメータが表示されます。

<div id="tabset-2">
<div class="tab">
  <button class="tablinks" onclick="openTab(event, 'SmallBank_2', 'tabset-2')" id="defaultOpen-2">SmallBank</button>
  <button class="tablinks" onclick="openTab(event, 'TPC-C_2', 'tabset-2')">TPC-C</button>
  <button class="tablinks" onclick="openTab(event, 'YCSB_2', 'tabset-2')">YCSB</button>
</div>

<div id="SmallBank_2" class="tabcontent" markdown="1">

| 名前                | 説明                                      | デフォルト |
|:-------------------|:------------------------------------------|:----------|
| `num_accounts`     | ベンチマークの対象となる銀行口座の数。           | `100000` |
| `load_concurrency` | ロードするスレッドの数。                      | `1`      |
| `load_batch_size`  | 単一の読み込みトランザクション内のアカウントの数。 | `1`      |

</div>
<div id="TPC-C_2" class="tabcontent" markdown="1">

| 名前                | 説明                                    | デフォルト |
|:-------------------|:----------------------------------------|:---------|
| `num_warehouses`   | ベンチマーク用の倉庫の数 (スケールファクター)。 | `1`      |
| `rate_payment`     | 支払いトランザクションの割合。               | `50`     |
| `load_concurrency` | ロードするスレッドの数。                    | `1`      |

</div>
<div id="YCSB_2" class="tabcontent" markdown="1">

| 名前                | 説明                                   | デフォルト |
|:-------------------|:---------------------------------------|:---------|
| `record_count`     | ベンチマークのレコード数。                 | `1000`   |
| `payload_size`     | 各レコードのペイロード サイズ (バイト単位)。  | `1000`   |
| `ops_per_tx`       | 単一トランザクション内の操作の数。           | `2`      |
| `workload`         | ワークロードのタイプ (A、C、または F)。     | `A`      |
| `load_concurrency` | ロードするスレッドの数。                   | `1`      |
| `load_batch_size`  | 単一のロードトランザクション内のレコードの数。 | `1`      |

</div>
</div>
