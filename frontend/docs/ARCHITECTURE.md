# Watch Whispers - Architecture & Flux

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            WATCH WHISPERS - ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     NFC Tap     ┌─────────────┐     ┌─────────────────────────────┐
│   MONTRE    │ ──────────────► │  SMARTPHONE │────►│    WEB APP (Next.js)        │
│  (Puce NFC) │                 │   (Client)  │     │  - Wagmi/Viem               │
└─────────────┘                 └─────────────┘     │  - ERC-4337 Bundler         │
                                                      └──────────────┬────────────┘
                                                                     │
                          ┌──────────────────────────────────────────┘
                          │ Paymaster (Gasless)
                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BLOCKCHAIN (EVM Compatible)                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐  │
│  │  SMART CONTRACT    │    │  ERC-4337 ENTRYPOINT │   │  PAYMASTER          │  │
│  │  WatchPassport.sol │◄───│  (Account Abstraction) │◄──│  (Cover Gas Fees)   │  │
│  │  - ERC-721         │    │  - UserOperation     │    │                     │  │
│  │  - NFC Linking     │    │  - Validation        │    │                     │  │
│  │  - Metadata URI    │    └─────────────────────┘    └─────────────────────┘  │
│  └─────────┬───────────┘                                                        │
│            │                                                                     │
│            │ tokenURI()                                                          │
│            ▼                                                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           STOCKAGE DÉCENTRALISÉ                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────┐         ┌─────────────────────────────────────┐   │
│  │        IPFS             │         │              ARWEAVE                │   │
│  │  - Métadonnées JSON     │         │  - Visuels 3D (haute résolution)   │   │
│  │  - Matériaux            │         │  - Documents PDF                   │   │
│  │  - Calibre              │         │  - Certificats d'authenticité      │   │
│  │  - Historique           │         │  - Archives perpétuelles           │   │
│  └─────────────────────────┘         └─────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

## Flux d'Authentification NFC → Blockchain

┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────┐
│  MONTRE  │───►│   NFC    │───►│  WEB APP     │───►│ BUNDLER  │───►│ BLOCKCHAIN│
│ (Tag NFC)│    │  Reader  │    │ (Next.js)    │    │ ERC-4337 │    │           │
└──────────┘    └──────────┘    └──────────────┘    └──────────┘    └──────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │  SIGNATURE   │
                              │  Biométrique │
                              │  ou Passkey  │
                              └──────────────┘
```

## Structure du Contrat WatchPassport

```solidity
WatchPassport (ERC-721)
│
├── State Variables
│   ├── mapping(bytes32 => uint256) nfcToTokenId
│   ├── mapping(uint256 => WatchData) watchData
│   └── mapping(uint256 => bool) isLocked (anti revente)
│
├── Core Functions
│   ├── mintWithNFC(bytes32 nfcHash, string memory metadataURI)
│   ├── verifyNFC(uint256 tokenId, bytes32 nfcHash)
│   └── updateMetadata(uint256 tokenId, string memory newURI)
│
├── ERC-4337 Integration
│   └── validateUserOp(UserOperation calldata userOp, ...)
│
└── Crisis Cards Functions
    ├── emergencyLock(uint256 tokenId)          // Faille NFC
    ├── setResaleLock(uint256 tokenId, bool)    // Marché gris
    └── setupSocialRecovery(address[] guardians) // Hacking VIP
```

## Stockage des Métadonnées

### IPFS (Métadonnées techniques)
```json
{
  "name": "Watch Whispers #001",
  "description": "Pièce unique de haute horlogerie",
  "image": "ar://...",
  "attributes": [
    { "trait_type": "Matériau Boîtier", "value": "Platine 950" },
    { "trait_type": "Calibre", "value": "WW-001 Manual" },
    { "trait_type": "Réserve de marche", "value": "72h" },
    { "trait_type": "Série", "value": "Genesis" },
    { "trait_type": "Numéro", "value": "1/50" }
  ],
  "nfc_hash": "0x...",
  "certificate_url": "ar://..."
}
```

### Arweave (Actifs permanents)
- Rendus 3D haute résolution
- Certificats PDF d'authenticité
- Documentation technique
- Archives photographiques

## User Flow (Sans MetaMask)

1. **Première utilisation** : L'utilisateur crée un compte avec email + biometrie (passkey)
2. **Smart Account** : Un compte ERC-4337 est déployé automatiquement
3. **Connexion** : Simple tap NFC + biométrie
4. **Transactions** : Paymaster couvre les frais de gas
5. **Propriété** : Le certificat numérique est indissociable de la montre physique
