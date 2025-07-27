import express from 'express'
import { fetchSymbolNodes, toSymbolPeerList } from './peerList.js'

const app = express()
const port = process.env.SYMBOL_PEERS_LIST_PORT || 3000

const mainnetHostname = 'symbol.services'
const testnetHostname = 'testnet.symbol.services'

app.get('/mainnet', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10
  try {
    const data = await fetchSymbolNodes(mainnetHostname, limit)
    const peerList = toSymbolPeerList(data)
    res.json(peerList)
  } catch {
    res.status(500).json({ error: 'Failed to fetch mainnet peers' })
  }
})

app.get('/testnet', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10
  try {
    const data = await fetchSymbolNodes(testnetHostname, limit)
    const peerList = toSymbolPeerList(data)
    res.json(peerList)
  } catch {
    res.status(500).json({ error: 'Failed to fetch testnet peers' })
  }
})

// 存在しないパスは404エラー
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
