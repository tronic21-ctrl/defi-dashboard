import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import TransactionList from './components/TransactionList'
import IPFSUpload from './components/IPFSUpload'
import StakingAnalytics from './components/StakingAnalytics'
import ProtocolAnalytics from './components/ProtocolAnalytics'
import { useLang } from './context/LanguageContext'
import t from './utils/translations'

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
  const { lang, toggleLang } = useLang()
  const tx = t[lang]
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
          <div className="header-title-group">
            <h1 className="app-title">Tronic DeFi Dashboard</h1>
            <span className="sepolia-badge">Sepolia Testnet</span>
          </div>
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
            <p className="empty-text">{tx.connectWallet}</p>
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
              <span className="address-label">{tx.connectedAddress}</span>
              <span className="address-value">{address}</span>
            </motion.div>

            {/* Language Toggle */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button
                onClick={toggleLang}
                onMouseEnter={e => e.target.style.background = 'rgba(56, 189, 248, 0.25)'}
                onMouseLeave={e => e.target.style.background = 'var(--cyan-dim)'}
                style={{
                  background: 'var(--cyan-dim)',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  color: 'var(--cyan)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {lang === 'en' ? '🇮🇩 ID' : '🇬🇧 EN'}
              </button>
            </div>

            <div className="stats-grid">
              <StatCard
                label={tx.ethBalance}
                value={balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} ETH` : '...'}
                index={1}
              />
              <StatCard
                label={tx.ethPrice}
                value={ethPrice ? `$${ethPrice.toLocaleString('en-US')}` : '...'}
                sub="via CoinGecko"
                index={2}
              />
              <StatCard
                label={tx.portfolioValue}
                value={portfolioValue ? `$${portfolioValue}` : '...'}
                sub={tx.ethHoldings}
                index={3}
              />
            </div>
            <TransactionList address={address} />
            <IPFSUpload />
            <StakingAnalytics />
            <ProtocolAnalytics />
          </>
        )}
      </main>
    </div>
  )
}

export default App