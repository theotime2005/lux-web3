'use client'

import { useDisconnect } from 'wagmi'
import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useNFC } from '@/hooks/useNFC'
import { useWatchPassport } from '@/hooks/useWatchPassport'
import { useAutoConnect } from '@/hooks/useAutoConnect'
import { useClient } from '@/hooks/useClient'
import { Nfc, CheckCircle, Clock, Shield, ShoppingBag, ShieldCheck } from 'lucide-react'

// --- COMPOSANT PROFIL CLIENT ---

function WalletConnect() {
  const { isConnected, isPending, availableAccounts, currentAccount } = useAutoConnect()
  const { disconnect } = useDisconnect()

  if (isPending) return <div className="card" style={{ border: '1px solid #d4af37', padding: '20px', textAlign: 'center', color: '#fff', background: '#0A0A0A' }}>Chargement...</div>

  if (!isConnected) {
    return (
      <div className="card" style={{ background: '#0A0A0A', border: '1px solid #d4af37', padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
        <Shield size={48} style={{ color: '#d4af37', marginBottom: '16px' }} />
        <h3 style={{ color: '#d4af37' }}>Espace Privé</h3>
        <p style={{ opacity: 0.7, color: '#fff' }}>Authentification requise</p>
      </div>
    )
  }

  const vipProfiles = [
    { name: 'Collectionneur Privé', status: 'VIP', level: 'Or', icon: '👑' },
    { name: 'Membre Exclusif', status: 'Premium', level: 'Platine', icon: '🎖️' }
  ]
  const currentProfile = vipProfiles[availableAccounts.findIndex(acc => acc.address === currentAccount?.address)] || vipProfiles[0]

  return (
    <div className="card" style={{ background: '#0A0A0A', border: '1px solid #d4af37', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#fff' }}>Profil Client<span style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '8px' }}>Expérience luxueuse garantie</span></h3>
      </div>
      
      <div style={{ border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '12px', padding: '30px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{currentProfile.icon}</div>
        <h4 style={{ color: '#d4af37', margin: '0 0 10px 0' }}>{currentProfile.name}</h4>
        <div style={{ background: '#d4af37', color: '#000', borderRadius: '20px', padding: '2px 12px', fontSize: '0.7rem', fontWeight: 'bold', alignSelf: 'center', marginBottom: '8px' }}>{currentProfile.status}</div>
        <p style={{ fontSize: '0.8rem', opacity: 0.7, color: '#fff' }}>Niveau {currentProfile.level}</p>
      </div>

      <p style={{ fontSize: '0.75rem', fontStyle: 'italic', textAlign: 'center', margin: '20px 0', opacity: 0.6, color: '#fff' }}>
        "L'excellence horlogère mérite discrétion absolue"
      </p>

      <button onClick={() => disconnect()} style={{ width: '100%', background: 'transparent', border: '1px solid #d4af37', color: '#d4af37', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Quitter l'espace
      </button>
    </div>
  )
}

// --- COMPOSANT SCANNER ---

function WatchScanner() {
  const { isScanning, startScan } = useNFC()
  const { verifyWatch, mintWatch } = useWatchPassport()
  const [scanResult, setScanResult] = useState<any>(null)
  const [phygitalUrl, setPhygitalUrl] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleScan = async () => {
    try {
      const result = await startScan()
      if (result) {
        setScanResult(result)
        const timestamp = Date.now()
        const nfcSignature = result.data.nfcHash || '0x123456789abcd000000000000000000000000000'
        const link = `https://watchlink.luxury/verify/${result.data.tokenId || '1268'}/${timestamp}/${nfcSignature.substring(0, 16)}`
        setPhygitalUrl(link)
        toast.success('🔍 Pont Phygital établi')
      }
    } catch (err) { toast.error('Erreur lors du scan NFC') }
  }

  const handleVerify = async () => {
    if (!scanResult || !scanResult.data || !scanResult.data.tokenId) {
      toast.error('Veuillez d abord scanner une montre')
      return
    }
    setIsVerifying(true)
    try {
      await verifyWatch(scanResult.data.tokenId.toString(), scanResult.data.nfcHash || '')
      toast.success('✅ Authenticité certifiée sur blockchain')
    } catch (err) {
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
    } catch (err) { console.error(err) }
  }

  return (
    <div className="card" style={{ background: '#0A0A0A', border: '1px solid #d4af37', borderRadius: '12px', padding: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#fff' }}>Pont Phygital</h3>
        <span style={{ fontSize: '0.7rem', opacity: 0.5, color: '#fff' }}>Lecture de la puce NFC sécurisée</span>
      </div>

      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ width: '60px', height: '60px', background: '#d4af37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Nfc size={30} color="#000" />
        </div>
        <button onClick={handleScan} disabled={isScanning} style={{ background: '#d4af37', border: 'none', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', textTransform: 'uppercase' }}>
          {isScanning ? 'Scan en cours...' : 'Scanner la montre'}
        </button>
      </div>

      {scanResult && (
        <div style={{ border: '1px solid #10b981', borderRadius: '8px', padding: '16px', marginTop: '10px', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#10b981', fontSize: '0.9rem' }}>
            <CheckCircle size={16} /> <strong>Connexion Sécurisée Établie</strong>
          </div>
          <div style={{ border: '1px solid #d4af37', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
             <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#fff' }}><span style={{ color: '#d4af37' }}>Référence:</span> WW-{scanResult.data.tokenId || '1268'}</p>
             <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#fff' }}><span style={{ color: '#d4af37' }}>Signature NFC:</span> {scanResult.data.nfcHash?.substring(0, 16) || '0x123456789abcd'}...</p>
             <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#fff' }}><span style={{ color: '#d4af37' }}>Statut:</span> <span style={{ color: '#10b981' }}>Puce authentique</span></p>
          </div>
          {phygitalUrl && (
            <div style={{ background: '#111', padding: '10px', borderRadius: '6px', border: '1px solid #10b981', marginBottom: '15px' }}>
               <p style={{ color: '#10b981', fontSize: '0.7rem', margin: '0 0 5px 0', textAlign: 'center' }}>🔗 Pont Phygital Généré</p>
               <p style={{ fontSize: '0.65rem', wordBreak: 'break-all', opacity: 0.8, color: '#fff', textAlign: 'center' }}>{phygitalUrl}</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleVerify} disabled={isVerifying} style={{ flex: 1, background: '#d4af37', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', color: '#000', fontSize: '0.75rem' }}>
              {isVerifying ? 'VÉRIFICATION...' : 'CERTIFIER'}
            </button>
            <button onClick={handleMint} style={{ flex: 1, background: 'transparent', border: '1px solid #d4af37', color: '#d4af37', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' }}>
              ENREGISTRER
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// --- COMPOSANT DASHBOARD ---

function WatchDashboard() {
  const ownedWatches = [
    { id: '1', name: 'Submariner Date', brand: 'Rolex', reference: 'WW-1268-OR', status: 'Certifié', lastService: '15.01.2024' },
    { id: '2', name: 'Speedmaster Professional', brand: 'Omega', reference: 'WW-0945-PL', status: 'Vérifié', lastService: '20.11.2023' }
  ]

  const history = [
    { date: '15.01.2024', action: 'Service complet', technician: 'Atelier Rolex Genève', details: 'Maintenance annuelle + étanchéité', cert: 'CERT-2024-0115' },
    { date: '20.11.2023', action: 'Vérification annuelle', technician: 'Service Omega Bienne', details: 'Contrôle précision + révision mouvement', cert: 'CERT-2023-1120' },
    { date: '10.06.2023', action: 'Remplacement bracelet', technician: 'Boutique Officielle', details: 'Bracelet cuir alligator - Noir', cert: 'CERT-2023-0610' }
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div className="card" style={{ background: '#0A0A0A', border: '1px solid #d4af37', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#fff' }}>Collection Personnelle</h3>
          <span style={{ fontSize: '0.8rem', opacity: 0.5, color: '#fff' }}>{ownedWatches.length} pièces d'exception</span>
        </div>
        {ownedWatches.map(w => (
          <div key={w.id} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '15px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#d4af37', margin: 0, fontWeight: 'bold' }}>{w.brand}</p>
              <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#fff' }}>{w.name}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.5, color: '#fff' }}>Réf: {w.reference} | Dernier service: {w.lastService}</p>
            </div>
            <div style={{ background: '#d4af37', color: '#000', padding: '2px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>{w.status}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: '#0A0A0A', border: '1px solid #d4af37', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#fff' }}>Carnet d'Entretien</h3>
          <span style={{ fontSize: '0.8rem', opacity: 0.5, color: '#fff' }}>Historique des prestations</span>
        </div>
        {history.map((h, i) => (
          <div key={i} style={{ marginBottom: '15px', paddingLeft: '15px', borderLeft: '2px solid #d4af37' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#d4af37', marginBottom: '4px' }}>
              <Clock size={12} /> {h.date}
            </div>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>{h.action}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7, color: '#fff' }}>{h.technician}</p>
            <p style={{ margin: '2px 0', fontSize: '0.75rem', opacity: 0.5, color: '#fff' }}>{h.details}</p>
            <span style={{ fontSize: '0.65rem', border: '1px solid #d4af37', color: '#d4af37', padding: '1px 5px', borderRadius: '4px' }}>{h.cert}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- PAGE PRINCIPALE ---

export default function Home() {
  const isClient = useClient()
  const router = useRouter()
  const pathname = usePathname()

  if (!isClient) return null

  const navItemStyle = (path: string) => ({
    background: pathname === path ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
    color: pathname === path ? '#d4af37' : '#fff',
    border: pathname === path ? '1px solid #d4af37' : '1px solid transparent',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem', fontWeight: '600'
  })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: 'body { margin: 0; background-color: #0A0A0A; }' }} />
      <div style={{ background: '#0A0A0A', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
        
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: '#000', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', border: '1px solid #d4af37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontWeight: 'bold' }}>W</div>
            <span style={{ fontWeight: 'bold', letterSpacing: '2px' }}>WATCHLINK</span>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => router.push('/')} style={navItemStyle('/') as any}><ShieldCheck size={18} /> Vérifier</button>
            <button onClick={() => router.push('/Boutique')} style={navItemStyle('/Boutique') as any}><ShoppingBag size={18} /> Boutique</button>
          </div>
        </nav>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <header style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ color: '#d4af37', fontSize: '3.5rem', margin: '0 0 10px 0' }}>Watchlink</h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <img src="/LogoWatchlink.png" alt="Logo" style={{ height: '100px', objectFit: 'contain' }} />
            </div>
            <p style={{ color: '#d4af37', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
              Votre plateforme pour vos montres authentiques
            </p>
          </header>

          <main>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <WalletConnect />
              <WatchScanner />
            </div>
            <WatchDashboard />
          </main>

          <footer style={{ textAlign: 'center', marginTop: '80px', padding: '20px', borderTop: '1px solid rgba(212, 175, 55, 0.1)', opacity: 0.6, fontSize: '0.8rem' }}>
            © 2026 Watchlink - Plateforme de Passeport Numérique Produit
          </footer>
        </div>
      </div>
    </>
  )
}