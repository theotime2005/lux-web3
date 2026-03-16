import { http, createConfig } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

// Réseau Hardhat local
const hardhat = {
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
};

export const config = createConfig({
  chains: [hardhat, sepolia, mainnet],
  connectors: [
    coinbaseWallet({
      appName: 'Watch Whispers',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http('https://rpc.sepolia.org'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
  },
});

export const CONTRACT_CONFIG = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`,
  abi: [
    {
      inputs: [{ name: 'name', type: 'string' }, { name: 'symbol', type: 'string' }],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'nfcHash', type: 'bytes32' },
        { name: 'metadataURI', type: 'string' },
      ],
      name: 'mintWithNFC',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { name: 'tokenId', type: 'uint256' },
        { name: 'nfcHash', type: 'bytes32' },
      ],
      name: 'verifyNFC',
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ name: 'nfcHash', type: 'bytes32' }],
      name: 'getTokenIdByNFC',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ name: 'tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ name: 'tokenId', type: 'uint256' }],
      name: 'isResaleLocked',
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ name: 'tokenId', type: 'uint256' }],
      name: 'isEmergencyLocked',
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const,
};
