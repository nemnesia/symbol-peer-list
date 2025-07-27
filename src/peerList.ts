import { SymbolPeer, SymbolPeerList } from './SymbolPeerList.js'

// 指定URLからJSONデータを取得する関数
export async function fetchSymbolNodes(
  hostname: string,
  limit: number = 10,
): Promise<any> {
  const url = `https://${hostname}/nodes?filter=suggested&limit=${limit}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return await res.json()
}

// 取得したjsonをSymbolPeerList型に編集して返す
export function toSymbolPeerList(raw: any): SymbolPeerList {
  const knownPeers: SymbolPeer[] = Array.isArray(raw) ? raw
    .filter(peer => {
      const rolesVal = peer.roles || 0
      return (rolesVal & 1) && (rolesVal & 2)
    })
    .map(peer => ({
      publicKey: peer.publicKey,
      endpoint: {
        host: peer.host,
        port: peer.port,
      },
      metadata: {
        name: peer.friendlyName || '',
        roles: [
          (peer.roles & 1) ? 'Peer' : '',
          (peer.roles & 2) ? 'Api' : '',
          (peer.roles & 4) ? 'Voting' : ''
        ].filter(Boolean).join(', ')
      },
    })) : []
  return {
    _info: 'this file contains a list of peers',
    knownPeers,
  }
}
