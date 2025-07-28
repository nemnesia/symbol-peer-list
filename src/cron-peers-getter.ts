import axios from 'axios'
import dayjs from 'dayjs'
import fs from 'fs/promises'

import type { ChainInfo, NodeInfo, Peer } from './types/types.js'

function logWithTime(message: string) {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${message}`)
}

// SymbolPeersList型（src/SymbolPeersList.ts）に合わせる
import {
  SymbolPeersList as OutputSymbolPeersList,
  SymbolPeer,
} from './types/symbolPeersList.js'

const NETWORKS = [
  { name: 'mainnet', hostname: 'symbol.services' },
  { name: 'testnet', hostname: 'testnet.symbol.services' },
]

const CONCURRENCY = 5

function hasPeerAndApiRole(roles: number): boolean {
  // 1st bit: Peer (1), 2nd bit: Api (2)
  return (roles & 1) !== 0 && (roles & 2) !== 0
}

async function getSuggestedNodes(hostname: string): Promise<string[]> {
  const url = `https://${hostname}/nodes?filter=suggested&ssl=true`
  logWithTime(`Fetching suggested nodes from ${url}`)
  const res = await axios.get(url)
  logWithTime(`Fetched ${res.data.length} nodes from ${hostname}`)
  return res.data.map((node: any) => node.apiStatus.restGatewayUrl)
}

async function getNodeInfo(
  restGatewayUrl: string,
): Promise<{ node: NodeInfo; chain: ChainInfo; responseTime: number }> {
  logWithTime(`Getting node info: ${restGatewayUrl}`)
  const start = Date.now()
  const [nodeRes, chainRes] = await Promise.all([
    axios.get(`${restGatewayUrl}/node/info`),
    axios.get(`${restGatewayUrl}/chain/info`),
  ])
  const responseTime = Date.now() - start
  logWithTime(
    `Got node info: ${restGatewayUrl} (responseTime: ${responseTime}ms)`,
  )
  return {
    node: nodeRes.data,
    chain: chainRes.data,
    responseTime,
  }
}

async function processNodes(restGatewayUrls: string[]): Promise<Peer[]> {
  logWithTime(
    `Processing ${restGatewayUrls.length} nodes (concurrency: ${CONCURRENCY})`,
  )
  const peers: Peer[] = []
  let index = 0
  while (index < restGatewayUrls.length) {
    const batch = restGatewayUrls.slice(index, index + CONCURRENCY)
    logWithTime(`Processing batch: ${index} - ${index + batch.length - 1}`)
    const results = await Promise.allSettled(
      batch.map((url) => getNodeInfo(url)),
    )
    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { node, chain, responseTime } = result.value
        peers.push({
          host: node.host,
          friendlyName: node.friendlyName,
          roles: node.roles,
          height: Number(chain.height),
          responseTime,
          publicKey: node.publicKey,
          port: node.port,
        })
      } else {
        logWithTime(`Failed to get node info: ${(result as any).reason}`)
      }
    }
    index += CONCURRENCY
  }
  logWithTime(`Processed ${peers.length} peers`)
  return peers
}

function filterPeers(peers: Peer[]): Peer[] {
  if (peers.length === 0) return []
  const maxHeight = Math.max(...peers.map((p) => p.height))
  return peers
    .filter(
      (p) => hasPeerAndApiRole(p.roles) && Math.abs(maxHeight - p.height) <= 20,
    )
    .sort((a, b) => a.responseTime - b.responseTime)
}

async function savePeersList(network: string, peers: Peer[]) {
  // roles数値→文字列変換
  function rolesToString(roles: number): string {
    const roleNames = []
    if (roles & 1) roleNames.push('Peer')
    if (roles & 2) roleNames.push('Api')
    if (roles & 4) roleNames.push('Voting')
    return roleNames.join(', ')
  }

  const knownPeers: SymbolPeer[] = peers.map((p) => ({
    publicKey: p.publicKey || '',
    endpoint: {
      host: p.host,
      port: p.port || 3000,
    },
    metadata: {
      name: p.friendlyName,
      roles: rolesToString(p.roles),
    },
  }))

  const data: OutputSymbolPeersList = {
    _info: `Symbol peer list for ${network}`,
    knownPeers,
  }
  const filePath = `public/${network}-peers.json`
  logWithTime(`Saving peers list to ${filePath}`)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  logWithTime(`Saved peers list to ${filePath}`)
}

async function main() {
  logWithTime('Start cron-peers-getter')
  for (const { name, hostname } of NETWORKS) {
    try {
      logWithTime(`[${name}] Start processing`)
      const restGatewayUrls = await getSuggestedNodes(hostname)
      const peers = await processNodes(restGatewayUrls)
      const filteredPeers = filterPeers(peers)
      logWithTime(`[${name}] Filtered peers: ${filteredPeers.length}`)
      await savePeersList(name, filteredPeers)
      logWithTime(`[${name}] Saved ${filteredPeers.length} peers`)
    } catch (e) {
      logWithTime(`[${name}] Error: ${(e as Error).message}`)
      console.error(`[${name}] Error:`, e)
    }
  }
  logWithTime('End cron-peers-getter')
}

main()
