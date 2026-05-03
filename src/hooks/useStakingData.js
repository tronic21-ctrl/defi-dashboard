import { useState, useEffect } from 'react'

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1749265/tronic-staking/v0.0.1'

export function useStakingData(userAddress) {
  const [stakingData, setStakingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Kalau belum ada address, jangan fetch
    if (!userAddress) {
      setStakingData(null)
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        const query = `
          {
            stakeds(
              where: { user: "${userAddress.toLowerCase()}" },
              first: 10, 
              orderBy: blockNumber, 
              orderDirection: desc
            ) {
              id
              user
              amount
              blockNumber
            }
            unstakeds(
              where: { user: "${userAddress.toLowerCase()}" },
              first: 10, 
              orderBy: blockNumber, 
              orderDirection: desc
            ) {
              id
              user
              amount
              reward
            }
          }
        `

        const response = await fetch(SUBGRAPH_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        })

        const json = await response.json()

        if (json.errors) {
          throw new Error(json.errors[0].message)
        }

        setStakingData(json.data)
      } catch (err) {
        console.error("GraphQL Error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userAddress])   // Important: re-fetch kalau address berubah

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