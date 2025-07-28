export type NodeInfo = {
  version: number
  publicKey: string
  networkGenerationHashSeed: string
  roles: number
  port: number
  networkIdentifier: number
  host: string
  friendlyName: string
  nodePublicKey: string
}

export type ChainInfo = {
  height: string
  scoreHigh: string
  scoreLow: string
  latestFinalizedBlock: {
    finalizationEpoch: number
    finalizationPoint: number
    height: string
    hash: string
  }
}

export type Peer = {
  host: string
  friendlyName: string
  roles: number
  height: number
  responseTime: number
  publicKey?: string
  port?: number
}
