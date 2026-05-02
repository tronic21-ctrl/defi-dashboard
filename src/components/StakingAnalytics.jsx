import { useStakingData } from '../hooks/useStakingData'
import { motion } from 'framer-motion'

export default function StakingAnalytics() {
  const { stakingData, summary, loading, error } = useStakingData()

  // Format wei ke ETH
  const toETH = (weiBigInt) => {
  const wei = BigInt(weiBigInt)
  const eth = Number(wei) / 1e18
  return eth.toFixed(4)
  }

  // Format alamat jadi pendek
  const shortAddr = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
      Loading staking data...
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
      Error: {error}
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
    <div style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, var(--cyan-dim), transparent)',
      marginBottom: '40px',
      }} />
      <h2 style={{
        color: 'var(--text-primary)',
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '20px',
      }}>
        ⚡ Staking Analytics
        <span style={{
            fontSize: '13px',
            color: 'var(--cyan)',
            marginLeft: '12px',
            fontWeight: '500',
            background: 'var(--cyan-dim)',
            padding: '2px 10px',
            borderRadius: '20px',
            border: '1px solid var(--cyan)',
        }}>
            powered by The Graph
        </span>
      </h2>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {[
          { label: 'Stake Events', value: summary.totalStakeEvents },
          { label: 'Unstake Events', value: summary.totalUnstakeEvents },
          { label: 'Total Staked', value: `${toETH(summary.totalStakedWei)} ETH` },
          { label: 'Total Reward', value: `${summary.totalRewardWei.toString()} wei` },
        ].map((item) => (
          <div key={item.label} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--cyan)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 0 12px var(--cyan-dim)',
            transition: 'transform 0.2s',
            }}>
            <div style={{
              fontSize: '22px',
              fontWeight: '700',
              color: 'var(--cyan)',
              marginBottom: '6px',
            }}>
              {item.value}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Stakes */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
      }}>
        <h3 style={{
          color: 'var(--text-primary)',
          fontSize: '15px',
          marginBottom: '14px',
        }}>
          Recent Stakes
        </h3>
        {stakingData.stakeds.map((stake) => (
          <div key={stake.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid var(--border)',
            fontSize: '13px',
          }}>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
              {shortAddr(stake.user)}
            </span>
            <span style={{ color: 'var(--cyan)', fontWeight: '600' }}>
              +{toETH(stake.amount)} ETH
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Block #{stake.blockNumber}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Unstakes */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h3 style={{
          color: 'var(--text-primary)',
          fontSize: '15px',
          marginBottom: '14px',
        }}>
          Recent Unstakes
        </h3>
        {stakingData.unstakeds.map((unstake) => (
          <div key={unstake.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid var(--border)',
            fontSize: '13px',
          }}>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
              {shortAddr(unstake.user)}
            </span>
            <span style={{ color: '#ef4444', fontWeight: '600' }}>
              -{toETH(unstake.amount)} ETH
            </span>
            <span style={{ color: '#22c55e', fontSize: '12px' }}>
              Reward: {unstake.reward} wei
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}