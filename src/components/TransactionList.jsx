import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY

function TransactionList({ address }) {
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!address) return

    setLoading(true)
    fetch(
      `https://api.etherscan.io/v2/api?chainid=11155111&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        if (data.status === '1') {
          setTxs(data.result)
        } else {
          setError('No transactions found')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch transactions')
        setLoading(false)
      })
  }, [address])

  const formatValue = (wei) => {
    const eth = parseFloat(wei) / 1e18
    return eth.toFixed(6)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const shortHash = (hash) => `${hash.slice(0, 8)}...${hash.slice(-6)}`
  const shortAddr = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  if (loading) return (
    <div className="tx-section">
      <h2 className="section-title">Transaction History</h2>
      <div className="tx-loading">Fetching transactions...</div>
    </div>
  )

  if (error) return (
    <div className="tx-section">
      <h2 className="section-title">Transaction History</h2>
      <div className="tx-empty">{error}</div>
    </div>
  )

  return (
    <div className="tx-section">
      <h2 className="section-title">Transaction History</h2>
      <div className="tx-list">
        {txs.map((tx, i) => {
          const isOut = tx.from.toLowerCase() === address.toLowerCase()
          const isFailed = tx.isError === '1'

          return (
            <motion.div
              key={tx.hash}
              className={`tx-row ${isFailed ? 'tx-failed' : ''}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <div className="tx-left">
                <span className={`tx-badge ${isOut ? 'tx-out' : 'tx-in'}`}>
                  {isFailed ? 'FAILED' : isOut ? 'OUT' : 'IN'}
                </span>
                <div className="tx-meta">
                    <a
                      className="tx-hash"
                      href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {shortHash(tx.hash)}
                  </a>
                  <span className="tx-time">{formatTime(tx.timeStamp)}</span>
                </div>
              </div>
              <div className="tx-right">
                <span className="tx-value">
                  {formatValue(tx.value)} ETH
                </span>
                <span className="tx-addr">
                  {isOut ? `→ ${shortAddr(tx.to)}` : `← ${shortAddr(tx.from)}`}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default TransactionList