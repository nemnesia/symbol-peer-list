export interface SymbolPeerList {
  _info: string
  _create_tool: string
  _url: string
  _author: string
  knownPeers: SymbolPeer[]
}

export interface SymbolPeer {
  publicKey: string
  endpoint: Endpoint
  metadata: PeerMetadata
}

export interface Endpoint {
  host: string
  port: number
}

export interface PeerMetadata {
  name: string
  roles: string
}
