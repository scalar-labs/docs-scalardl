include scalardl/end-of-support-ja-jp.html

# Docker を使用してローカル環境に ScalarDL をインストールする方法

このドキュメントでは、[Docker Compose](https://docs.docker.com/compose/) を使用して、バックエンド Cassandra サーバーとともに ScalarDL を実行するローカル環境をセットアップする方法を示します。

## 前提条件

- [Docker エンジン](https://docs.docker.com/engine/) および [Docker Compose](https://docs.docker.com/compose/)。

     使用しているプラットフォームに応じて、Docker Web サイトの手順に従ってください。

## scalardl-samples リポジトリのクローンを作成します

[scalar-labs/scalardl-samples](https://github.com/scalar-labs/scalardl-samples) リポジトリは、ユーザーがすぐに ScalarDL の作業を開始できるプロジェクトです。

scalardl-samples アプリを実行するローカル マシン上の場所を決定します。 次に、ターミナルを開いてディレクトリに `cd` し、次のコマンドを実行します。

```
$ git clone https://github.com/scalar-labs/scalardl-samples.git
$ cd scalardl-samples
```

## Docker ログイン

ScalarDL Docker イメージを起動するには `docker login` が必要です。 GitHub Container Registry の [`scalar-ledger`](https://github.com/orgs/scalar-labs/packages/container/package/scalar-ledger) リポジトリは現在プライベートであるため、GitHub アカウントを設定する必要があります コンテナイメージにアクセスする権限が必要です。 担当者にアカウントの準備を依頼してください。 `ghcr.io` にログインするには、パスワードとしてパーソナル アクセス トークン (PAT) を使用する必要があることにも注意してください。 [公式ドキュメント](https://docs.github.com/en/packages/guides/migrated-to-github-container-registry-for-docker-images#authenticating-with-the-container-registry) をお読みください。 詳細については。

```
# read:packages scope needs to be selected in a personal access token to login
$ export CR_PAT=YOUR_PERSONAL_ACCESS_TOKEN
$ echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
```

## ScalarDL Ledgerを起動します

次のコマンドは、Docker コンテナ内のバックエンド Cassandra サーバーとともに ScalarDL Ledger を起動します。 コマンドを初めて実行するときに、必要な Docker イメージが GitHub Container Registry からダウンロードされます。

```
$ docker-compose up
```

コンテナをバックグラウンドで実行することもできます。 `-d` (`--detach`) オプションを追加します。

```
$ docker-compose up -d
```

Auditor コンポーネントを使用する場合は、次のコマンドを実行します。
```
$ docker-compose -f docker-compose.yml -f docker-compose-auditor.yml up -d

```

## ScalarDL Ledger をシャットダウンします

コンテナをシャットダウンするには:

- フォアグラウンドでコンテナを開始した場合は、ターミナルで `Ctrl+C` を入力します。
   ここでは `docker-compose` が実行されています。
- バックグラウンドでコンテナを起動した場合は、次のコマンドを実行します。

```
$ docker-compose down

# Auditor 実行時
$ docker-compose -f docker-compose.yml -f docker-compose-auditor.yml down
```
