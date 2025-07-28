
# symbol-peer-p2p

Web API that returns the initial peer list for Symbol blockchain nodes (Symbol Peer P2P)

## Overview

- Provides node lists for mainnet/testnet as JSON via Web API.
- Built with Express + TypeScript.
- Get peer info via `/peers-p2p/mainnet` and `/peers-p2p/testnet` endpoints.
- You can specify the number of results with the `limit` query parameter.

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
yarn start
```

* You can manage environment variables such as the port number using a `.env` file.


### Endpoints

- `GET /peers-p2p/mainnet?limit=10` : Get mainnet node list
- `GET /peers-p2p/testnet?limit=10` : Get testnet node list


#### Example Response
```json
{
  "_info": "this file contains a list of peers",
  "knownPeers": [
    {
      "publicKey": "...", // Node public key (string)
      "endpoint": { "host": "...", "port": 7900 }, // Host and port
      "metadata": { "name": "...", "roles": "Peer, Api" } // Node name and roles
    }
  ]
}
```

Field details:
- `publicKey`: Node public key (Base64-encoded string)
- `endpoint.host`: Node hostname or IP address
- `endpoint.port`: Port number (usually 7900)
- `metadata.name`: Node name
- `metadata.roles`: Node roles (e.g., Peer, Api, Voter, etc.)


### Lint/Format

- `yarn lint` / `yarn lint:fix`
- `yarn format` / `yarn format:fix`



## Environment Variables

- Can be set in a `.env` file (see `.env.sample` for example).
- `SYMBOL_PEER_P2P_PORT` : Server port (default: 3000)

Example: `.env`
```env
SYMBOL_PEER_P2P_PORT=8080
```

## Requirements & Dependencies

- Node.js v22 or later recommended
- yarn v4 or later

See `package.json` for details of dependencies.

---

*Please also refer to the Japanese README (`README.md`). Make sure the contents are consistent between languages.*


## License

Apache License 2.0
