# symbol-peers-list

A Web API that returns an initial peer list for Symbol blockchain nodes.

## Overview

- Provides node lists for mainnet/testnet as JSON via a Web API.
- Built with Express + TypeScript.
- Endpoints `/mainnet` and `/testnet` return peer information.
- The `limit` query parameter allows you to specify the number of peers to retrieve.

## Usage

### Install

```
yarn install
```

### Start Development Server

```
yarn dev
```

### Build & Start for Production

```
yarn build
SYMBOL_PEERS_LIST_PORT=8080 yarn start
```

### Endpoints

- `GET /mainnet?limit=10` : Get mainnet node list
- `GET /testnet?limit=10` : Get testnet node list

#### Example Response
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

### Lint/Format

- `yarn lint` / `yarn lint:fix`
- `yarn format` / `yarn format:fix`

## Environment Variables

- `SYMBOL_PEERS_LIST_PORT` : Server port (default: 3000)

## License

Apache License 2.0
