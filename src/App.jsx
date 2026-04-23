import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import TransactionList from './components/TransactionList'
import IPFSUpload from './components/IPFSUpload'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

function StatCard({ label, value, sub, index }) {
  return (
    <motion.div
      className="stat-card"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </motion.div>
  )
}

function App() {
  const { address, isConnected } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const [ethPrice, setEthPrice] = useState(null)

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then(res => res.json())
      .then(data => setEthPrice(data.ethereum.usd))
  }, [])

  const portfolioValue = balanceData && ethPrice
    ? (parseFloat(balanceData.formatted) * ethPrice).toFixed(2)
    : null

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null

  return (
    <div className="app-wrapper">
      <div className="bg-grid" />

      <header className="app-header">
        <div className="header-left">
          <span className="logo-dot" />
          <h1 className="app-title">Tronic DeFi Dashboard</h1>
          <span className="sepolia-badge">Sepolia Testnet</span>
        </div>
        <div className="header-right">
          <ConnectButton />
        </div>
      </header>

      <main className="app-main">
        {!isConnected ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-icon">⬡</div>
            <p className="empty-text">Connect your wallet to view your portfolio</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="address-bar"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className="address-label">Connected Address</span>
              <span className="address-value">{address}</span>
            </motion.div>

            <div className="stats-grid">
              <StatCard
                label="ETH Balance"
                value={balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} ETH` : '...'}
                index={1}
              />
              <StatCard
                label="ETH Price"
                value={ethPrice ? `$${ethPrice.toLocaleString('en-US')}` : '...'}
                sub="via CoinGecko"
                index={2}
              />
              <StatCard
                label="Portfolio Value"
                value={portfolioValue ? `$${portfolioValue}` : '...'}
                sub="ETH holdings in USD"
                index={3}
              />
            </div>
            <TransactionList address={address} />
            <IPFSUpload />
          </>
        )}
      </main>
    </div>
  )
}

export default App