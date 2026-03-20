import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState, useEffect } from 'react'
import { useClient } from './useClient'

// Comptes simulés pour la démo
const DEMO_ACCOUNTS = [
  {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    name: 'Account #1 (Demo)'
  },
  {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    name: 'Account #2 (Demo)'
  },
  {
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    name: 'Account #3 (Demo)'
  }
]

export function useAutoConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const isClient = useClient()
  const [autoConnected, setAutoConnected] = useState(false)

  useEffect(() => {
    if (!isClient || autoConnected) return

    // Mode démo automatique - pas de vraie connexion
    const autoConnectDemo = async () => {
      try {
        console.log('🎯 Mode démo activé - Simulation de connexion')
        setAutoConnected(true)
      } catch (error) {
        console.log('⚠️ Mode démo activé par défaut')
        setAutoConnected(true)
      }
    }

    autoConnectDemo()
  }, [isClient, autoConnected])

  // Simulation de changement de compte pour la démo
  const switchAccount = async (accountIndex: number) => {
    const account = DEMO_ACCOUNTS[accountIndex]
    if (!account) return

    console.log('🔄 Changé vers compte (demo):', account.name)
    // En mode démo, on ne fait rien de réel
  }

  return {
    address: address || DEMO_ACCOUNTS[0].address, // Adresse par défaut pour la démo
    isConnected: true, // Toujours connecté en mode démo
    autoConnected,
    isPending: false,
    switchAccount,
    availableAccounts: DEMO_ACCOUNTS,
    currentAccount: DEMO_ACCOUNTS[0] // Toujours le premier compte en mode démo
  }
}
