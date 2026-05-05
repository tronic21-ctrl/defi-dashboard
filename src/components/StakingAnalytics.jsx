import { useStakingData } from '../hooks/useStakingData'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import t from '../utils/translations'

export default function StakingAnalytics() {
  const { address, isConnected } = useAccount()
  const { stakingData, summary, loading, error } = useStakingData(address)
  const { lang } = useLang()
  const tx = t[lang]

  const toETH = (weiBigInt) => {
    if (!weiBigInt) return '0'
    const wei = BigInt(weiBigInt)
    const eth = Number(wei) / 1e18
    return eth.toFixed(4)
  }

  const shortAddr = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  // 1. Belum connect wallet
  if (!isConnected || !address) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          marginTop: '20px'
        }}
      >
        <p>{tx.connectStaking}</p>
      </motion.div>
    )
  }

  // 2. Loading dengan skeleton
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginTop: '40px' }}
      >
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--cyan-dim), transparent)', marginBottom: '40px' }} />
        
        <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          Staking Analytics
          <span style={{ fontSize: '13px', color: 'var(--cyan)', marginLeft: '12px', fontWeight: '500' }}>
            powered by The Graph
          </span>
        </h2>

        {/* Skeleton Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              height: '88px',
            }} />
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          {tx.loadingStaking}
        </div>
      </motion.div>
    )
  }

  // 3. Error
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444', marginTop: '40px' }}>
        Error: {error}
      </div>
    )
  }

  // 4. No activity yet
  if (!stakingData || (stakingData.stakeds.length === 0 && stakingData.unstakeds.length === 0)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          marginTop: '20px'
        }}
      >
        <p style={{ fontSize: '18px', marginBottom: '8px' }}>{tx.noStaking}</p>
        <p>{tx.noStakingDesc}</p>
      </motion.div>
    )
  }

  // 5. Tampilan normal (ada data)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: '40px' }}
    >
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--cyan-dim), transparent)', marginBottom: '40px' }} />

      <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
        {tx.stakingTitle}
        <span style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        marginLeft: '12px',
        fontWeight: '500',
        background: 'rgba(255,255,255,0.05)',
        padding: '2px 10px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        powered by The Graph
      </span>
      </h2>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: tx.stakeEvents, value: summary?.totalStakeEvents || 0 },
          { label: tx.unstakeEvents, value: summary?.totalUnstakeEvents || 0 },
          { label: tx.totalStaked, value: `${toETH(summary?.totalStakedWei)} ETH` },
          { label: tx.totalReward, value: `${summary?.totalRewardWei?.toString() || 0} wei` },
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

      {/* Recent Stakes */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', marginBottom: '14px' }}>{tx.recentStakes}</h3>
        {stakingData.stakeds.map((stake) => (
          <div key={stake.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{shortAddr(stake.user)}</span>
            <span style={{ color: 'var(--cyan)', fontWeight: '500', fontSize: '13px' }}>+{toETH(stake.amount)} ETH</span>
            <span style={{ color: 'var(--text-secondary)' }}>Block #{stake.blockNumber}</span>
          </div>
        ))}
      </div>

      {/* Recent Unstakes */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', marginBottom: '14px' }}>{tx.recentUnstakes}</h3>
        {stakingData.unstakeds.map((unstake) => (
          <div key={unstake.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{shortAddr(unstake.user)}</span>
            <span style={{ color: '#f87171', fontWeight: '500', fontSize: '13px' }}>-{toETH(unstake.amount)} ETH</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>+{unstake.reward} wei reward</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}