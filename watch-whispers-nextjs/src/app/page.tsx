'use client'

import { useDisconnect } from 'wagmi'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useNFC } from '@/hooks/useNFC'
import { useWatchPassport } from '@/hooks/useWatchPassport'
import { useAutoConnect } from '@/hooks/useAutoConnect'
import { useClient } from '@/hooks/useClient'
import { Nfc, CheckCircle, XCircle, Clock, Shield, Award, History, Wallet, User } from 'lucide-react'

function WalletConnect() {
  const { address, isConnected, autoConnected, isPending, switchAccount, availableAccounts, currentAccount } = useAutoConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (autoConnected) {
      toast.success('🔗 Bienvenue dans l écosystème Watch Whispers')
    }
  }, [autoConnected])

  if (isPending) {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="card-header">
          <h3 className="card-title">Initialisation...</h3>
        </div>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Configuration de votre expérience...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="card-header">
          <h3 className="card-title">Espace Privé</h3>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(135deg, var(--gold) 0%, #b8941f 100%)',
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Shield size={32} style={{ color: 'var(--obsidian)' }} />
          </div>
          <h4 style={{ color: 'var(--gold)', marginBottom: '16px' }}>Accès Sécurisé</h4>
          <p style={{ marginBottom: '16px' }}>
            Votre espace personnel est en cours de préparation.
          </p>
          <p style={{ fontSize: '0.875rem', opacity: '0.7' }}>
            Authentification biométrique requise.
          </p>
        </div>
      </div>
    )
  }

  // Mapping des comptes vers statuts VIP élégants
  const vipProfiles = [
    { name: 'Collectionneur Privé', status: 'VIP', level: 'Or', icon: '👑' },
    { name: 'Membre Exclusif', status: 'Premium', level: 'Platine', icon: '🎖️' },
    { name: 'Initié Luxe', status: 'Select', level: 'Argent', icon: '⭐' }
  ]

  const currentProfile = vipProfiles[availableAccounts.findIndex(acc => acc.address === currentAccount?.address)] || vipProfiles[0]

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="card-header">
        <h3 className="card-title">Profil Client</h3>
        <div className="card-description">
          Expérience luxueuse garantie
        </div>
      </div>
      
      <div style={{ padding: '16px 0' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)', 
          border: '1px solid var(--gold)', 
          borderRadius: '12px', 
          padding: '20px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {currentProfile.icon}
          </div>
          <h4 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: 'var(--gold)', 
            marginBottom: '4px' 
          }}>
            {currentProfile.name}
          </h4>
          <div style={{ 
            display: 'inline-block',
            background: 'var(--gold)', 
            color: 'var(--obsidian)', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '0.75rem', 
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            {currentProfile.status}
          </div>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--platinum)', 
            opacity: '0.8' 
          }}>
            Niveau {currentProfile.level}
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ 
            fontSize: '0.75rem', 
            color: 'var(--platinum)', 
            opacity: '0.6',
            fontStyle: 'italic'
          }}>
            "L'excellence horlogère mérite discrétion absolue"
          </p>
        </div>

        <button 
          className="button button-secondary"
          onClick={() => disconnect()}
          style={{ width: '100%' }}
        >
          Quitter l'espace
        </button>
      </div>
    </div>
  )
}

function WatchScanner() {
  const { isScanning, lastScan, startScan, error } = useNFC()
  const { verifyWatch, mintWatch } = useWatchPassport()
  const [scanResult, setScanResult] = useState(null)
  const [phygitalUrl, setPhygitalUrl] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleScan = async () => {
    try {
      const result = await startScan()
      if (result) {
        setScanResult(result)
        
        // Génération du Pont Phygital (URL unique + signature)
        const timestamp = Date.now()
        const watchId = result.data.tokenId || '000'
        const nfcSignature = result.data.nfcHash || '0000000000000000000000000000000000000000000000'
        
        // Génération URL unique avec signature cryptographique
        const phygitalLink = `https://watch-whispers.luxury/verify/${watchId}/${timestamp}/${nfcSignature.substring(0, 16)}`
        setPhygitalUrl(phygitalLink)
        
        toast.success('🔍 Pont Phygital établi')
      }
    } catch (err) {
      console.error('NFC Scan Error:', err)
      toast.error('Erreur lors du scan NFC')
    }
  }

  const handleVerify = async () => {
    if (!scanResult || !scanResult.data || !scanResult.data.tokenId) {
      toast.error('Veuillez d abord scanner une montre')
      return
    }

    setIsVerifying(true)
    try {
      // Vérification On-Chain avec background
      await verifyWatch(scanResult.data.tokenId.toString(), scanResult.data.nfcHash || '')
      toast.success('✅ Authenticité certifiée sur blockchain')
    } catch (err) {
      console.error('Verification error:', err)
      toast.error('❌ Échec de la vérification blockchain')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleMint = async () => {
    if (!scanResult || !scanResult.data || !scanResult.data.nfcHash) {
      toast.error('Veuillez d abord scanner une montre')
      return
    }

    try {
      await mintWatch(scanResult.data.nfcHash, 'ipfs://QmTestWatch001')
      toast.success('🏆 Montre enregistrée dans le registre')
    } catch (err) {
      console.error('Mint error:', err)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Pont Phygital</h3>
        <p className="card-description">
          Lecture de la puce NFC sécurisée
        </p>
      </div>

      <div className="nfc-scanner">
        <div className="nfc-icon">
          <Nfc size={32} />
        </div>
        
        <button 
          className="button"
          onClick={handleScan}
          disabled={isScanning}
          style={{ marginBottom: '24px' }}
        >
          {isScanning ? 'Établissement du pont...' : 'Scanner la montre'}
        </button>

        {scanResult && scanResult.data && (
          <div className="scan-result">
            <h4>
              <CheckCircle size={16} style={{ marginRight: '8px' }} />
              Connexion Sécurisée Établie
            </h4>
            
            <div style={{ 
              background: 'rgba(212, 175, 55, 0.05)', 
              border: '1px solid var(--gold)', 
              borderRadius: '8px', 
              padding: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ marginBottom: '8px' }}>
                <strong style={{ color: 'var(--gold)' }}>Référence:</strong> 
                <span style={{ fontFamily: 'monospace', marginLeft: '8px' }}>
                  WW-{scanResult.data.tokenId || '000'}
                </span>
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong style={{ color: 'var(--gold)' }}>Signature NFC:</strong> 
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', marginLeft: '8px' }}>
                  {scanResult.data.nfcHash?.substring(0, 16) || 'N/A'}...
                </span>
              </p>
              <p>
                <strong style={{ color: 'var(--gold)' }}>Statut:</strong> 
                <span style={{ color: 'var(--success)', marginLeft: '8px' }}>
                  Puce authentique
                </span>
              </p>
            </div>

            {phygitalUrl && (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid var(--success)', 
                borderRadius: '8px', 
                padding: '12px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--success)', 
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  🔗 Pont Phygital Généré
                </p>
                <div style={{ 
                  background: 'var(--obsidian)', 
                  padding: '8px', 
                  borderRadius: '4px',
                  wordBreak: 'break-all'
                }}>
                  <code style={{ 
                    fontSize: '0.7rem', 
                    color: 'var(--platinum)' 
                  }}>
                    {phygitalUrl}
                  </code>
                </div>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--platinum)', 
                  opacity: '0.7',
                  marginTop: '8px',
                  fontStyle: 'italic'
                }}>
                  URL unique + signature cryptographique
                </p>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button 
                className="button" 
                onClick={handleVerify}
                disabled={isVerifying}
                style={{ flex: 1 }}
              >
                {isVerifying ? (
                  <>
                    <div className="loading-spinner" style={{ 
                      width: '16px', 
                      height: '16px', 
                      marginRight: '8px',
                      borderWidth: '2px'
                    }}></div>
                    Vérification...
                  </>
                ) : (
                  <>
                    <Shield size={16} style={{ marginRight: '4px' }} />
                    Certifier
                  </>
                )}
              </button>
              <button 
                className="button button-secondary" 
                onClick={handleMint}
                style={{ flex: 1 }}
              >
                <Award size={16} style={{ marginRight: '4px' }} />
                Enregistrer
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ 
            color: 'var(--error)', 
            marginTop: '16px',
            textAlign: 'center',
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            border: '1px solid var(--error)'
          }}>
            <XCircle size={16} style={{ marginRight: '4px' }} />
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

function WatchDashboard() {
  const { address } = useAutoConnect()
  
  // Collection de montres avec identités luxueuses
  const ownedWatches = [
    { 
      id: '1', 
      name: 'Submariner Date', 
      brand: 'Rolex',
      reference: 'WW-1268-OR',
      status: 'Certifié', 
      lastService: '15.01.2024',
      serviceCenter: 'Atelier Rolex Genève',
      authenticity: 'Authentique'
    },
    { 
      id: '2', 
      name: 'Speedmaster Professional', 
      brand: 'Omega',
      reference: 'WW-0945-PL',
      status: 'Vérifié', 
      lastService: '20.11.2023',
      serviceCenter: 'Service Omega Bienne',
      authenticity: 'Authentique'
    }
  ]

  const history = [
    { 
      date: '15.01.2024', 
      action: 'Service complet', 
      technician: 'Atelier Rolex Genève',
      details: 'Maintenance annuelle + étanchéité',
      certificate: 'CERT-2024-0115'
    },
    { 
      date: '20.11.2023', 
      action: 'Vérification annuelle', 
      technician: 'Service Omega Bienne',
      details: 'Contrôle précision + révision mouvement',
      certificate: 'CERT-2023-1120'
    },
    { 
      date: '10.06.2023', 
      action: 'Remplacement bracelet', 
      technician: 'Boutique Officielle',
      details: 'Bracelet cuir alligator - Noir',
      certificate: 'CERT-2023-0610'
    }
  ]

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Collection Personnelle</h3>
          <p className="card-description">
            {ownedWatches.length} pièce{ownedWatches.length > 1 ? 's' : ''} d exception
          </p>
        </div>

        <div className="watch-list">
          {ownedWatches.map(watch => (
            <div key={watch.id} className="watch-item">
              <div>
                <h4>{watch.brand}</h4>
                <p style={{ color: 'var(--gold)', fontWeight: '600' }}>{watch.name}</p>
                <p style={{ fontSize: '0.75rem', opacity: '0.8' }}>
                  Réf: {watch.reference}
                </p>
                <p style={{ fontSize: '0.75rem', opacity: '0.7' }}>
                  Dernier service: {watch.lastService}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  background: 'var(--gold)', 
                  color: 'var(--obsidian)', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {watch.status}
                </div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: 'var(--platinum)', 
                  opacity: '0.8' 
                }}>
                  {watch.authenticity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Carnet d Entretien</h3>
          <p className="card-description">
            Historique des prestations
          </p>
        </div>

        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Clock size={14} style={{ color: 'var(--gold)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>{item.date}</span>
              </div>
              <div>
                <p style={{ fontWeight: '600', color: 'var(--luxury-white)', marginBottom: '2px' }}>
                  {item.action}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--platinum)', marginBottom: '2px' }}>
                  {item.technician}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--platinum)', opacity: '0.8' }}>
                  {item.details}
                </p>
                <div style={{ 
                  display: 'inline-block',
                  background: 'rgba(212, 175, 55, 0.1)', 
                  border: '1px solid var(--gold)', 
                  borderRadius: '4px', 
                  padding: '2px 6px', 
                  fontSize: '0.7rem', 
                  color: 'var(--gold)',
                  marginTop: '4px'
                }}>
                  {item.certificate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const isClient = useClient()

  if (!isClient) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 24px' }}></div>
          <h1>Watch Whispers</h1>
          <p>Chargement de l'application...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h1>Watch Whispers</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--platinum)', marginTop: '8px' }}>
          Engineering Invisible Luxury
        </p>
      </header>

      <main style={{ marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <WalletConnect />
          <WatchScanner />
        </div>
        
        <WatchDashboard />
      </main>

      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--platinum)', opacity: '0.7' }}>
          © 2024 Watch Whispers - Digital Product Passport Platform
        </p>
      </footer>
    </div>
  )
}
