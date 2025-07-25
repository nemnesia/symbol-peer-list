# symbol-peers-list

SymbolブロックチェーンのピアリストWeb API

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
SYMBOL_PEERS_LIST_PORT=8080 yarn start
```

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

- `SYMBOL_PEERS_LIST_PORT` : サーバーのポート番号（デフォルト: 3000）

## ライセンス

Apache License 2.0
