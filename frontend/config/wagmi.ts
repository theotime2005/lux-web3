import { http, createConfig } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { coinbaseWallet, walletConnect } from 'wagmi/connectors'

// ERC-4337 Account Abstraction configuration
export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    coinbaseWallet({
      appName: 'Watch Whispers',
      preference: 'smartWalletOnly', // Force smart wallet (ERC-4337)
    }),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID || '',
      metadata: {
        name: 'Watch Whispers',
        description: 'Votre passeport numérique de montre de luxe',
        url: 'https://watchwhispers.com',
        icons: ['https://watchwhispers.com/logo.png'],
      },
    }),
  ],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC || 'https://rpc.sepolia.org'),
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC || 'https://eth.llamarpc.com'),
  },
})

// Smart Contract Configuration
export const CONTRACT_CONFIG = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
  abi: [
    {
      "inputs": [
        { "name": "name", "type": "string" },
        { "name": "symbol", "type": "string" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        { "name": "to", "type": "address" },
        { "name": "nfcHash", "type": "bytes32" },
        { "name": "metadataURI", "type": "string" }
      ],
      "name": "mintWithNFC",
      "outputs": [{ "name": "", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "name": "tokenId", "type": "uint256" },
        { "name": "nfcHash", "type": "bytes32" }
      ],
      "name": "verifyNFC",
      "outputs": [{ "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "nfcHash", "type": "bytes32" }],
      "name": "isNFCLinked",
      "outputs": [{ "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "nfcHash", "type": "bytes32" }],
      "name": "getTokenIdByNFC",
      "outputs": [{ "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "tokenId", "type": "uint256" }],
      "name": "tokenURI",
      "outputs": [{ "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "tokenId", "type": "uint256" }],
      "name": "isResaleLocked",
      "outputs": [{ "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "tokenId", "type": "uint256" }],
      "name": "isEmergencyLocked",
      "outputs": [{ "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "tokenId", "type": "uint256" }],
      "name": "getResaleUnlockTime",
      "outputs": [{ "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "tokenId", "type": "uint256" }],
      "name": "getGuardianCount",
      "outputs": [{ "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const,
}
