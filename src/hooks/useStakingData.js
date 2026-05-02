import { useState, useEffect } from 'react'

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1749265/tronic-staking/v0.0.1'

const STAKING_QUERY = `
  {
    stakeds(first: 10, orderBy: blockNumber, orderDirection: desc) {
      id
      user
      amount
      blockNumber
    }
    unstakeds(first: 10, orderBy: blockNumber, orderDirection: desc) {
      id
      user
      amount
      reward
    }
  }
`

export function useStakingData() {
  const [stakingData, setStakingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(SUBGRAPH_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: STAKING_QUERY })
        })

        const json = await response.json()
        setStakingData(json.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Kalkulasi summary
  const summary = stakingData ? {
  totalStakeEvents: stakingData.stakeds.length,
  totalUnstakeEvents: stakingData.unstakeds.length,
  totalStakedWei: stakingData.stakeds.reduce(
    (acc, s) => acc + BigInt(s.amount), BigInt(0)
  ),
  totalRewardWei: stakingData.unstakeds.reduce(
    (acc, u) => acc + BigInt(u.reward), BigInt(0)
  ),
} : null

  return { stakingData, summary, loading, error }
}