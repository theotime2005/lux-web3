# Watch Whispers - Web3 Luxury Watch Passport

Digital Product Passport pour montres de luxe avec ERC-721, Account Abstraction (ERC-4337) et NFC.

## Structure du projet

```
.
├── contracts/          # Backend - Smart Contracts (Hardhat)
│   ├── src/           # Contrats Solidity
│   ├── test/          # Tests Hardhat
│   └── scripts/       # Scripts de déploiement
│
├── frontend/           # Frontend - Application React (Vite)
│   ├── src/          # Code source React
│   └── package.json  # Dépendances frontend uniquement
│
└── lux-web3/         # Déploiement GitHub (mirror)
```

## Démarrage rapide

### 1. Backend (Smart Contracts)

```bash
cd contracts
npm install
npx hardhat node
```

Dans un autre terminal :
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Frontend (Application)

```bash
cd frontend
npm install
npm run dev
```

→ Application sur http://localhost:5174

## Architecture

```
NFC Tag → Smart Contract → IPFS/Arweave
         ↓
    Coinbase Smart Wallet (ERC-4337)
```

## Fonctionnalités

- **ERC-721 WatchPassport** - Unicité garantie par NFT
- **Account Abstraction ERC-4337** - Pas de seed phrase, pas de gas
- **NFC Linking** - Vérification physique par puce NFC
- **Stockage décentralisé** - IPFS + Arweave
- **Crisis Cards** : NFC Cloning, Gray Market, Social Recovery

## Technologies

| Couche | Tech |
|--------|------|
| Backend | Solidity 0.8.26, Hardhat, OpenZeppelin |
| Frontend | React 18, Vite, TypeScript, Tailwind, shadcn/ui |
| Web3 | Wagmi, Viem, Coinbase Smart Wallet |

## Tests

```bash
cd contracts
npx hardhat test
```

**14 tests passants** (TDD)

---

**Hackathon Web3 au service du Luxe** - Mars 2026
