# ScalarDL 3.7 リリースノート

このページには、ScalarDL 3.7 のリリース ノートのリストが含まれています。

## v3.7.2

**発売日：** 2023 年 4 月 18 日

### 改善点

- 社内の JRE 8 Docker イメージを 1.1.11 に更新しました。
- 社内の JRE Docker イメージを 1.1.12 に更新しました。
- 社内 JRE イメージを 1.1.10 に更新しました。
- gRPC health probe のバージョンを 0.4.15 に更新しました。
- 最新バージョンの Ubuntu を使用しました。

### バグの修正

- Ledger から署名を読み取るときに署名を検証する修正を追加しました。
- Ledger 検証におけるスレッドの安全性の問題を修正しました。

## v3.7.1

**発売日：** 2023 年 1 月 6 日

### 改善点

- 社内の JRE Docker イメージを更新しました。
- ScalarDBのバージョンを更新しました。

## v3.7.0

**発売日：** 2022 年 12 月 2 日

### 機能強化

- `Asset` が内部メタデータを含む `AssetMetadata` を返せるようにしました。
- Ledger 資産をスキャンするためのトランザクション資産スキャナーを追加しました。
- トランザクションスキャン可能なトレーサマネージャを追加しました。

### 改善点

- `AssetInput` でデータを管理しないようにしました。
- `AuditorAssetScanner` などのクラスの名前が変更されました。
- `ContractsRegistration` と `FunctionsRegistration` を改訂しました。
- SDK にソースを追加しました。

### バグの修正

- `Function` をモック可能にするための `FunctionManager` を追加しました。
- `Contract` 内のストレージ スキャンを実行するスキャン可能な LedgerTracer を使用しました。
- [CVE-2022-27664](https://github.com/advisories/GHSA-69cg-p879-7622) を修正しました。
- [CVE-2022-32149](https://github.com/advisories/GHSA-69ch-w2m2-3vjp "CVE-2022-32149") を修正しました。
- [CVE-2022-42003](https://github.com/advisories/GHSA-jjjh-jjxp-wpff) と [CVE-2022-42004](https://github.com/advisories/GHSA-rgv9-q543-rqg4).
- 脆弱性を修正するために gRPC のバージョンを更新しました。
- ErrorProne からの警告を修正するために [@OverRide](https://github.com/OverRide) を追加しました。
- ScalarDB をバージョンアップしました。
