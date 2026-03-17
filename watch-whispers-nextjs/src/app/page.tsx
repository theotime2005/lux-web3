'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useNFC } from '@/hooks/useNFC'
import { useWatchPassport } from '@/hooks/useWatchPassport'
import { Smartphone, Nfc, CheckCircle, XCircle, Clock, Shield, Award, History } from 'lucide-react'

function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(`Erreur de connexion: ${error.message}`)
    }
  }, [error])

  if (!isClient) {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="card-header">
          <h3 className="card-title">Chargement...</h3>
          <p className="card-description">
            Initialisation en cours
          </p>
        </div>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="card-header">
          <h3 className="card-title">Connecté</h3>
          <p className="card-description">
            Adresse: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        <div className="card-content">
          <button 
            onClick={() => disconnect()} 
            className="btn btn-secondary btn-full"
          >
            Déconnexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="card-header">
        <h3 className="card-title">Connexion Wallet</h3>
        <p className="card-description">
          Connectez votre wallet pour accéder au passeport numérique
        </p>
      </div>
      <div className="card-content">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => {
              try {
                connect({ connector })
              } catch (err) {
                toast.error(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
              }
            }}
            disabled={isPending}
            className="btn btn-primary btn-full"
            style={{ marginBottom: '16px' }}
          >
            {isPending ? 'Connexion...' : connector.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function WatchScanner() {
  const { isScanning, lastScan, error, startScan, stopScan, isClient } = useNFC()
  const { isConnected, mintWatch, verifyWatch } = useWatchPassport()
  const [scanResult, setScanResult] = useState<any>(null)

  const handleScan = async () => {
    if (!isClient) return
    
    try {
      const result = await startScan()
      if (result) {
        setScanResult({
          success: true,
          data: {
            tokenId: 1,
            nfcHash: result.hash,
            owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            metadata: "ipfs://QmTestWatch001",
            serialNumber: result.serialNumber
          }
        })
        toast.success('Scan NFC réussi!')
      }
    } catch (err) {
      toast.error('Erreur lors du scan NFC')
    }
  }

  const handleMint = async () => {
    if (!isConnected || !lastScan) {
      toast.error('Veuillez vous connecter et scanner une montre')
      return
    }

    try {
      await mintWatch(lastScan.hash, 'ipfs://QmTestWatch001')
      toast.success('Montre enregistrée avec succès!')
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
      console.error('Mint error:', err)
    }
  }

  const handleVerify = async () => {
    if (!scanResult) {
      toast.error('Veuillez d\'abord scanner une montre')
      return
    }

    try {
      await verifyWatch(scanResult.data.tokenId.toString(), scanResult.data.nfcHash)
    } catch (err) {
      // L'erreur est déjà gérée dans le hook avec toast
      console.error('Verification error:', err)
    }
  }

  if (!isClient) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Scan NFC</h3>
          <p className="card-description">
            Chargement du scanner...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="nfc-icon">
          <Nfc size={32} color="var(--gold)" />
        </div>
        <h2 className="card-title">Scan NFC</h2>
        <p className="card-description">
          Approchez votre téléphone de la montre pour vérifier son authenticité
        </p>
      </div>
      
      <div className="card-content">
        <button 
          onClick={handleScan} 
          disabled={isScanning}
          className="btn btn-primary btn-full scan-button"
        >
          <Smartphone size={20} />
          {isScanning ? "Scan en cours..." : "Tap NFC"}
        </button>
        
        {error && (
          <div className="error-message">
            <XCircle size={16} />
            {error}
          </div>
        )}
        
        {scanResult && (
          <div className="result-section">
            <div className="result-badge badge-success">
              <CheckCircle size={16} />
              Authentifiée
            </div>
            
            <div className="result-details">
              <p>
                <strong>Token ID:</strong>
                <span>#{scanResult.data.tokenId}</span>
              </p>
              <p>
                <strong>NFC Hash:</strong>
                <span>{scanResult.data.nfcHash.slice(0, 10)}...</span>
              </p>
              <p>
                <strong>Numéro de série:</strong>
                <span>{scanResult.data.serialNumber}</span>
              </p>
              <p>
                <strong>Propriétaire:</strong>
                <span>{scanResult.data.owner.slice(0, 6)}...{scanResult.data.owner.slice(-4)}</span>
              </p>
              <p>
                <strong>Métadonnées:</strong>
                <span>{scanResult.data.metadata}</span>
              </p>
            </div>

            <div className="action-buttons">
              <button onClick={handleVerify} className="btn btn-secondary">
                <Shield size={16} />
                Vérifier
              </button>
              {isConnected && (
                <button onClick={handleMint} className="btn btn-primary">
                  <Award size={16} />
                  Enregistrer
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function WatchDashboard() {
  const { isConnected, address } = useWatchPassport()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="dashboard-grid">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Mes Montres</h3>
          <p className="card-description">
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Non connecté'}
          </p>
        </div>
        <div className="card-content">
          <div className="watch-list">
            <div className="watch-item">
              <div className="watch-info">
                <h4>Rolex Submariner</h4>
                <p>Token #1 • Authenticité vérifiée</p>
              </div>
              <div className="watch-status">
                <CheckCircle size={16} color="var(--gold)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Historique</h3>
          <p className="card-description">
            Services et entretiens
          </p>
        </div>
        <div className="card-content">
          <div className="history-list">
            <div className="history-item">
              <div className="history-icon">
                <Clock size={16} />
              </div>
              <div className="history-info">
                <h4>Dernier service</h4>
                <p>15 Mars 2024 • Romain SA</p>
              </div>
            </div>
            <div className="history-item">
              <div className="history-icon">
                <History size={16} />
              </div>
              <div className="history-info">
                <h4>Changement de propriétaire</h4>
                <p>1 Janvier 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1>Watch Whispers</h1>
            <p>Passeport Numérique de Montre de Luxe</p>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Chargement...</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1>Watch Whispers</h1>
          <p>Passeport Numérique de Montre de Luxe</p>
        </div>
        
        <div className="app-layout">
          <div className="main-section">
            <WalletConnect />
            <div style={{ marginTop: '32px' }}>
              <WatchScanner />
            </div>
          </div>
          
          <div className="side-section">
            <WatchDashboard />
          </div>
        </div>
      </div>
    </div>
  )
}
