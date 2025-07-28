# symbol-peer-p2p

Symbolブロックチェーンノードの初期接続先PeerリストをJSONで返すWeb API

## 概要

- mainnet/testnetのノードリストを取得できるAPIサーバーです。
- Express + TypeScript製。
- `/peers-p2p/mainnet` `/peers-p2p/testnet` エンドポイントでピア情報を取得できます。
- クエリパラメータ `limit` で取得件数を指定可能。

## 使い方

### インストール

```sh
yarn install
```

### 開発サーバー起動

```sh
yarn dev
```

### 本番ビルド・起動

```sh
yarn build
yarn start
```

※ ポート番号などの環境変数は `.env` ファイルで管理できます。

### エンドポイント

- `GET /peers-p2p/mainnet?limit=10` : メインネットのノードリスト取得
- `GET /peers-p2p/testnet?limit=10` : テストネットのノードリスト取得


#### レスポンス例
```json
{
  "_info": "this file contains a list of peers",
  "knownPeers": [
    {
      "publicKey": "...", // ノードの公開鍵（string）
      "endpoint": { "host": "...", "port": 7900 }, // 接続先ホスト・ポート
      "metadata": { "name": "...", "roles": "Peer, Api" } // ノード名・ロール
    }
  ]
}
```

各項目の詳細:
- `publicKey`: ノードの公開鍵（Base64エンコード文字列）
- `endpoint.host`: ノードのホスト名またはIPアドレス
- `endpoint.port`: ポート番号（通常7900）
- `metadata.name`: ノード名
- `metadata.roles`: ノードの役割（例: Peer, Api, Voter など）

### コード整形・Lint

- `yarn lint` / `yarn lint:fix`
- `yarn format` / `yarn format:fix`


## 環境変数

- `.env` ファイルで設定できます（例: `.env.sample` を参照）。
- `SYMBOL_PEER_P2P_PORT` : サーバーのポート番号（デフォルト: 3000）

例: `.env`
```env
SYMBOL_PEER_P2P_PORT=8080
```

## 動作環境・依存

- Node.js v22 以上推奨
- yarn v4 以上

依存パッケージの詳細は `package.json` を参照してください。

---

※ 英語README（README.en.md）も併せてご利用ください。内容の整合性にご注意ください。

## ライセンス

Apache License 2.0
