# リリースフロー

## 要件
| 名前 | バージョン  | 必須 | リンク |
|:------|:-------|:----------|:------|
| Helm | 3.2.1 以降 | いいえ | https://helm.sh/docs/intro/install/ |

## リリース
* ブランチを作成します (`prepare-release-*`)。 
* タグは必ず対象バージョンの前のバージョンから作成してください。
``` console
$ git checkout -b prepare-release-v3.0.2  refs/tags/scalardl-3.0.1
```

* 各 `helm-charts` の `Chart.yaml` の `version` をリリースするバージョンに設定する必要があります。
``` yaml
version: 3.0.2
```
* コミットをリモート リポジトリにプッシュします。
``` console
$ git push origin prepare-release-v3.0.2
```

* この場合、リリースの `Github Actions` は `Git Push` 時に実行されます。
