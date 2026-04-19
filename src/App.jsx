import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'

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
    : '...'

  return (
    <div>
      <h1>DeFi Dashboard</h1>
      <ConnectButton />
      {isConnected && (
        <div>
          <p>Address: {address}</p>
          <p>Balance: {parseFloat(balanceData?.formatted).toFixed(4)} ETH</p>
          <p>ETH Price: ${ethPrice}</p>
          <p>Portfolio Value: ${portfolioValue}</p>
        </div>
      )}
    </div>
  )
}

export default App