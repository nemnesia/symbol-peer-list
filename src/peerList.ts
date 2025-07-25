import { SymbolPeerList, SymbolPeer } from './SymbolPeerList.js'

// 指定URLからJSONデータを取得する関数
export async function fetchSymbolNodes(
  hostname: string,
  limit: number = 10,
): Promise<any> {
  const url = `https://${hostname}/nodes?filter=suggested&limit=${limit}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  const data = await res.json()
  return data
}

// 取得したjsonをSymbolPeerList型に編集して返す
export function toSymbolPeerList(raw: any): SymbolPeerList {
  const knownPeers: SymbolPeer[] = (raw || [])
    .filter((peer: any) => {
      const rolesVal = peer.roles || 0
      return rolesVal & 1 && rolesVal & 2
    })
    .map((peer: any) => ({
      publicKey: peer.publicKey,
      endpoint: {
        host: peer.host,
        port: peer.port,
      },
      metadata: {
        name: peer.friendlyName || '',
        roles: (() => {
          const rolesArr = []
          const rolesVal = peer.roles || 0
          if (rolesVal & 1) rolesArr.push('Peer')
          if (rolesVal & 2) rolesArr.push('Api')
          if (rolesVal & 4) rolesArr.push('Voting')
          return rolesArr.join(', ')
        })(),
      },
    }))
  return {
    _info: 'this file contains a list of peers',
    knownPeers,
  }
}
