import express from 'express'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = process.env.SYMBOL_PEERS_LIST_PORT || process.env.PORT || 3000

const NETWORKS = ['mainnet', 'testnet']

function getJsonFilePath(network: string) {
  return path.join('./public', `${network}-peers.json`)
}

function readJsonFile(filePath: string) {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading JSON file at ${filePath}:`, error)
    return null
  }
}

app.get('/peers-p2p/:network', (req, res) => {
  const { network } = req.params
  const limit = parseInt(req.query.limit as string) || 10

  if (!NETWORKS.includes(network)) {
    return res
      .status(400)
      .json({ code: 'INVALID_NETWORK', message: 'Invalid network' })
  }

  const filePath = getJsonFilePath(network)
  const data = readJsonFile(filePath)

  if (!data) {
    return res
      .status(404)
      .json({ code: 'DATA_NOT_FOUND', message: 'Data not found' })
  }

  // _info等のメタ情報も含めて返し、knownPeersのみlimitを適用
  const { knownPeers, ...meta } = data
  res.json({
    ...meta,
    knownPeers: Array.isArray(knownPeers) ? knownPeers.slice(0, limit) : [],
  })
})

app.get('/active-api/:network', (req, res) => {
  try {
    const { network } = req.params
    const limit = parseInt(req.query.limit as string) || 10

    if (!NETWORKS.includes(network)) {
      return res
        .status(400)
        .json({ code: 'INVALID_NETWORK', message: 'Invalid network' })
    }

    const filePath = getJsonFilePath(network)
    const data = readJsonFile(filePath)

    if (!data) {
      return res
        .status(404)
        .json({ code: 'DATA_NOT_FOUND', message: 'Data not found' })
    }

    // Convert to https://host:port format
    let result
    try {
      result = data.knownPeers
        .slice(0, limit)
        .map((node: any) => {
          if (node.endpoint && node.endpoint.host && node.endpoint.port) {
            return `https://${node.endpoint.host}:${node.endpoint.port}`
          }
          return null
        })
        .filter(Boolean)
    } catch {
      return res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Failed to process knownPeers',
      })
    }

    // ランダムシャッフル
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }

    res.json(result)
  } catch (err) {
    console.error('Unexpected error in /active-api/:network:', err)
    res
      .status(500)
      .json({ code: 'INTERNAL_ERROR', message: 'Unexpected server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
