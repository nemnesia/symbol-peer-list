# symbol-peers-list

Symbolブロックチェーンノードの初期接続先Peerリストを返すWeb API

## 概要

- mainnet/testnetのノードリストをJSONで取得できるWeb APIです。
- Express + TypeScript製。
- `/mainnet` `/testnet` エンドポイントでピア情報を取得できます。
- クエリパラメータ `limit` で取得数を指定可能。

## 使い方

### インストール

```
yarn install
```

### 開発サーバー起動

```
yarn dev
```

### 本番ビルド・起動

```
yarn build
yarn start
```

※ ポート番号などの環境変数は`.env`ファイルで管理できます。

### エンドポイント

- `GET /mainnet?limit=10` : メインネットのノードリスト取得
- `GET /testnet?limit=10` : テストネットのノードリスト取得

#### レスポンス例

```json
{
  "_info": "this file contains a list of peers",
  "knownPeers": [
    {
      "publicKey": "...",
      "endpoint": { "host": "...", "port": 7900 },
      "metadata": { "name": "...", "roles": "Peer, Api" }
    }
  ]
}
```

### lint/format

- `yarn lint` / `yarn lint:fix`
- `yarn format` / `yarn format:fix`

## 環境変数

- `.env`ファイルで設定できます（例: `.env.sample` を参照）。
- `SYMBOL_PEERS_LIST_PORT` : サーバーのポート番号（デフォルト: 3000）

例: `.env`

```env
SYMBOL_PEERS_LIST_PORT=8080
```

## ライセンス

Apache License 2.0
