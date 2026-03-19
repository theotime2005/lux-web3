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
├── frontend/           # Frontend - Application Next
│   ├── src/          # Code source
│   └── package.json  # Dépendances frontend uniquement
```

## Démarrage rapide
- Cloner le dépôt
    ```shell
    git clone https://github.com/theotime2005/lux-web3
    cd lux-web3
    ```
- Installer les dépendances
    ```shell
    npm run ci:all
    ```
- Lancer le projet globalement
    ```shell
    npm run dev
    ```

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

| Couche | Tech                                   |
|--------|----------------------------------------|
| Backend | Solidity 0.8.26, Hardhat, OpenZeppelin |
| Frontend | Next, TypeScript, Tailwind, shadcn/ui  |
| Web3 | Wagmi, Viem, Coinbase Smart Wallet     |
