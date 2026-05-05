import { useState, useEffect } from 'react'

const DUNE_API_KEY = import.meta.env.VITE_DUNE_API_KEY
const PROTOCOL_STATS_ID = '7425728'
const STAKING_EVENTS_ID = '7423808'

async function fetchDuneQuery(queryId) {
  const res = await fetch(
    `https://api.dune.com/api/v1/query/${queryId}/results?limit=10`,
    { headers: { 'X-Dune-API-Key': DUNE_API_KEY } }
  )
  if (!res.ok) throw new Error(`Dune API error: ${res.status}`)
  const data = await res.json()
  return data.result.rows
}

export function useDuneData() {
  const [protocolStats, setProtocolStats] = useState(null)
  const [stakingEvents, setStakingEvents] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true)
        const [stats, events] = await Promise.all([
          fetchDuneQuery(PROTOCOL_STATS_ID),
          fetchDuneQuery(STAKING_EVENTS_ID),
        ])
        setProtocolStats(stats[0])
        setStakingEvents(events)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return { protocolStats, stakingEvents, loading, error }
}