import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import t from '../utils/translations'

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT

function IPFSUpload() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const { lang } = useLang()
  const tx = t[lang]

  const uploadMetadata = async () => {
    if (!name || !description) return

    setLoading(true)
    setError(null)
    setResult(null)

    const metadata = {
      name,
      description,
      attributes: [
        { trait_type: 'Creator', value: 'Riko' },
        { trait_type: 'Project', value: 'DeFi Dashboard' }
      ]
    }

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PINATA_JWT}`
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: { name: `${name}-metadata.json` }
        })
      })

      const data = await response.json()

      if (data.IpfsHash) {
        setResult(data.IpfsHash)
      } else {
        setError('Upload failed')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="ipfs-section"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className="section-title">{tx.ipfsTitle}</h2>
      <div className="ipfs-card">
        <div className="ipfs-form">
          <div className="form-group">
            <label className="form-label">{tx.nftName}</label>
            <input
              className="form-input"
              type="text"
              placeholder={tx.nftNamePlaceholder}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{tx.description}</label>
            <textarea
              className="form-input form-textarea"
              placeholder={tx.descPlaceholder}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <button
            className="upload-btn"
            onClick={uploadMetadata}
            disabled={loading || !name || !description}
          >
            {loading ? tx.uploading : tx.uploadBtn}
          </button>
        </div>

        {result && (
          <motion.div
            className="ipfs-result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="result-label">{tx.ipfsCid}</span>
            <span className="result-hash">{result}</span>
            <a
              className="result-link"
              href={`https://gateway.pinata.cloud/ipfs/${result}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx.viewIPFS} →
            </a>
          </motion.div>
        )}

        {error && (
          <div className="ipfs-error">{error}</div>
        )}
      </div>
    </motion.div>
  )
}

export default IPFSUpload