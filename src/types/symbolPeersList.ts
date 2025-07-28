export interface SymbolPeersList {
  _info: string
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
