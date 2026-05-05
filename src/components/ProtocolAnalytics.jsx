import { motion } from 'framer-motion'
import { useDuneData } from '../hooks/useDuneData'

export default function ProtocolAnalytics() {
  const { protocolStats, stakingEvents, loading, error } = useDuneData()

  // Loading state
  if (loading) return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginTop: '40px' }}
    >
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--cyan-dim), transparent)', marginBottom: '40px' }} />
      <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
        Protocol Analytics
        <span style={{ fontSize: '13px', color: 'var(--cyan)', marginLeft: '12px', fontWeight: '500', background: 'var(--cyan-dim)', padding: '2px 10px', borderRadius: '20px', border: '1px solid var(--cyan)' }}>
          powered by Dune
        </span>
      </h2>
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
        Loading on-chain data...
      </div>
    </motion.div>
  )

  // Error state
  if (error) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444', marginTop: '40px' }}>
      Dune API Error: {error}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: '40px' }}
    >
      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--cyan-dim), transparent)', marginBottom: '40px' }} />

      {/* Title */}
      <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
        Protocol Analytics
        <span style={{
        fontSize: '12px',
        color: '#d97706',
        marginLeft: '12px',
        fontWeight: '500',
        background: 'rgba(217,119,6,0.08)',
        padding: '2px 10px',
        borderRadius: '20px',
        border: '1px solid rgba(217,119,6,0.2)',
        }}>
        powered by Dune
        </span>
      </h2>

      {/* Stats Cards */}
      {protocolStats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Transactions', value: protocolStats.total_transactions },
            { label: 'Unique Wallets', value: protocolStats.unique_txs },
            { label: 'Protocol Live Since', value: new Date(protocolStats.protocol_start).toLocaleDateString() },
            { label: 'Latest Activity', value: new Date(protocolStats.latest_activity).toLocaleDateString() },
          ].map((item) => (
            <div key={item.label} style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '20px 16px',
            textAlign: 'center',
            }}>
            <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                {item.value}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {item.label}
            </div>
            </div>
          ))}
        </div>
      )}

      {/* Staking Events Table */}
      {stakingEvents && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', marginBottom: '14px' }}>
            Staking Events Summary
          </h3>
          {stakingEvents.map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: i < stakingEvents.length - 1 ? '1px solid var(--border)' : 'none',
              fontSize: '13px'
            }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: '500',
                fontSize: '12px',
                background: 'rgba(255,255,255,0.06)',
                color: row.event_type === 'Staked' ? 'var(--cyan)' : '#f87171',
                }}>
                {row.event_type}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Count: <strong style={{ color: 'var(--text-primary)' }}>{row.total_events}</strong>
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Total: <strong style={{ color: 'var(--text-primary)' }}>{Number(row.total_eth).toFixed(4)} ETH</strong>
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                Last: {new Date(row.last_event).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'right', marginTop: '8px' }}>
        <a
          href="https://dune.com/rikotronic/tronic-staking-analytics"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: '12px', color: 'var(--cyan)', textDecoration: 'none' }}
        >
          View full dashboard on Dune Analytics →
        </a>
      </div>
    </motion.div>
  )
}