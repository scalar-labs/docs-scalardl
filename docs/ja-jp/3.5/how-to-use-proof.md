include scalardl/end-of-support-ja-jp.html

# ScalarDL でアセットプルーフを使用する方法に関するガイド

このドキュメントでは、ScalarDL で Asset Proofs を使用するためのいくつかのガイドラインを説明します。

## ScalarDL のアセットプルーフとは何ですか?

ScalarDL の Asset Proof は、資産レコードに関する一連の情報であり、資産レコードの存在の証拠として使用されます。 以下の項目で構成されています。

- 資産レコードのID
- 資産記録の古さ
- 資産レコードを作成する実行リクエストのノンス
- 資産レコードの暗号化ハッシュ
- 前の時代の資産記録の暗号化ハッシュ (存在する場合)
- 上記のエントリのデジタル署名

## 資産証明の利点

資産証明は Ledger による実行時の証拠であるため、証明と Ledger の状態が異なるため、証拠作成後に Ledger がデータを改ざんすることは困難です。
したがって、Asset Proof を適切に利用すれば、データ改ざんのリスクを軽減できる可能性があります。

## アセットプルーフの使用方法

結果 ([ ContractExecutionResult](https://scalar-labs.github.io/scalardl/javadoc/latest/common/com/scalar/dl/ledger/model/ContractExecutionResult.html)) SDK の `executeContract` メソッド。 証拠が改ざんされておらず、Ledger からのものである場合は、署名を検証することで証明を検証できます。

一方のドメインでの悪意のあるアクティビティをもう一方のドメインで検出できるように、Ledger が実行されるドメインの外部に証明を保存することをお勧めします。 管理を容易にするために、証拠をクラウド ストレージに保存することを検討する価値があります。

実行時に得られた証明は、`validateLedger` を実行するときに利用できます。 `validateLedger` は、Ledger 側の検証を行った後、指定された資産レコードの証明も返します。 その後、クライアントはその証拠が以前に Ledger から返されたものと同じであるかどうかを確認できます。

## ScalarDL Auditor 

ScalarDL Auditor は、Asset Proofs を利用してビザンチン障害検出機能を実現します。 ScalarDL Auditor の詳細については、[ScalarDL Auditor 入門](getting-started-auditor.md) を参照してください。
