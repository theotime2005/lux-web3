# Watch Whispers - Schémas UML

## Diagramme de Flux Global

```mermaid
graph TD
    A[Utilisateur] --> B[Coinbase Smart Wallet]
    B --> C[Bundler ERC-4337]
    C --> D[Paymaster Pimlico]
    D --> E[WatchPassport Contract]
    E --> F[Stockage IPFS/Arweave]
    
    G[Montre Physique] --> H[Scan NFC]
    H --> I[Hash NFC]
    I --> E
    
    J[Propriétaire] --> K[Emergency Lock]
    K --> E
    
    L[Gardiens] --> M[Social Recovery]
    M --> E
    
    N[Marketplace] --> O[Gray Market Lock]
    O --> E
    
    subgraph "Account Abstraction (ERC-4337)"
        C
        D
    end
    
    subgraph "Smart Contract Functions"
        E
        F
    end
    
    subgraph "Crisis Management"
        K
        M
        O
    end
```

## Diagramme de Séquence - Mint NFC

```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant Wallet as Coinbase Smart Wallet
    participant Bundler as Bundler ERC-4337
    participant Paymaster as Paymaster Pimlico
    participant Contract as WatchPassport
    participant IPFS as Stockage IPFS
    
    User->>Wallet: 1. Connexion wallet
    Wallet->>User: 2. Adresse Smart Account
    
    User->>Wallet: 3. Scan NFC montre
    Wallet->>Wallet: 4. Génération hash NFC
    
    User->>Wallet: 5. Demande mint
    Wallet->>Bundler: 6. Création UserOperation
    Bundler->>Paymaster: 7. Demande sponsorisation gas
    Paymaster->>Bundler: 8. Gas sponsorisé
    Bundler->>Contract: 9. mintWithNFC()
    Contract->>IPFS: 10. Stockage métadonnées
    Contract->>Wallet: 11. Token ID + Confirmation
    Wallet->>User: 12. Montre enregistrée
```

## Diagramme de Séquence - Emergency Lock

```mermaid
sequenceDiagram
    participant Owner as Propriétaire
    participant Contract as WatchPassport
    participant User1 as Utilisateur 1
    participant User2 as Utilisateur 2
    participant Guardian1 as Gardien 1
    participant Guardian2 as Gardien 2
    
    Note over Owner,Contract: Phase 1: Verrouillage d'urgence
    Owner->>Contract: emergencyLock(tokenId)
    Contract->>Owner: Token verrouillé
    
    Note over User1,User2: Phase 2: Double signature requise
    User1->>Contract: unlockWithDoubleSig(sig1, sig2)
    Contract->>Contract: Vérification signature 1
    Contract->>Contract: Vérification signature 2
    Contract->>User1: Déverrouillage réussi
    
    Note over Guardian1,Guardian2: Alternative: Social Recovery
    Guardian1->>Contract: requestRecovery(tokenId)
    Guardian2->>Contract: requestRecovery(tokenId)
    Contract->>Contract: Vérification seuil gardiens
    Contract->>User2: Transfert ownership
```

## Diagramme de Séquence - ERC-4337 Flow Complet

```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant SmartAccount as Smart Account
    participant Bundler as Bundler
    participant Paymaster as Paymaster
    participant Contract as WatchPassport
    participant Network as Réseau Ethereum
    
    Note over User,SmartAccount: Initialisation
    User->>SmartAccount: Création compte
    SmartAccount->>User: Adresse Smart Account
    
    Note over User,Contract: Transaction sans gas
    User->>SmartAccount: Demande transaction
    SmartAccount->>Bundler: Création UserOperation
    Bundler->>Paymaster: Demande sponsorisation
    Paymaster->>Bundler: Approbation gas
    Bundler->>Network: Soumission UserOperation
    Network->>Contract: Exécution transaction
    Contract->>Network: Événement WatchMinted
    Network->>SmartAccount: Receipt transaction
    SmartAccount->>User: Confirmation succès
```

## Diagramme de Classes - Architecture

```mermaid
classDiagram
    class WatchPassport {
        +mintWithNFC(address, bytes32, string)
        +verifyNFC(uint256, bytes32)
        +emergencyLock(uint256)
        +unlockWithDoubleSig(uint256, bytes, bytes)
        +setResaleLock(uint256, bool)
        +setupSocialRecovery(uint256, address[])
        +requestRecovery(uint256)
        +executeRecovery(uint256, address)
        +supportsERC4337()
        -WatchData watchData
        -mapping nfcToTokenId
    }
    
    class ERC4337Manager {
        +createSmartAccount(privateKey)
        +sendSponsoredTransaction(to, data, value)
        +checkERC4337Support()
        +getBalance()
        +getSmartAccountAddress()
    }
    
    class NFCScanner {
        +startScan()
        +verifyNFC()
        +generateHash()
    }
    
    class CoinbaseWallet {
        +connect()
        +disconnect()
        +signMessage()
        +getAddress()
    }
    
    WatchPassport --> ERC4337Manager : utilise
    NFCScanner --> WatchPassport : vérifie
    CoinbaseWallet --> ERC4337Manager : crée
```

## Flux de Données - Architecture Complète

```mermaid
graph LR
    subgraph "Frontend React"
        A[Interface NFC]
        B[Wallet Connect]
        C[Transaction UI]
    end
    
    subgraph "Layer Abstraction"
        D[Wagmi/Viem]
        E[ERC-4337 SDK]
        F[Permissionless.js]
    end
    
    subgraph "Infrastructure"
        G[Pimlico Bundler]
        H[Pimlico Paymaster]
        I[Sepolia Testnet]
    end
    
    subgraph "Smart Contract"
        J[WatchPassport ERC-721]
        K[Crisis Management]
        L[Social Recovery]
    end
    
    subgraph "Stockage"
        M[IPFS]
        N[Arweave]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    G --> I
    H --> I
    I --> J
    J --> K
    J --> L
    J --> M
    J --> N
```

## Spécifications Techniques

### Account Abstraction (ERC-4337)
- **Bundler**: Pimlico (https://api.pimlico.io)
- **Paymaster**: Sponsorisation du gas automatique
- **Smart Account**: Compte abstrait sans seed phrase
- **User Operation**: Transaction groupée optimisée

### Sécurité Cryptographique
- **Double Signature**: Vérification ECDSA EIP-712
- **Message Hash**: keccak256(abi.encodePacked(tokenId, owner))
- **Recovery**: Multi-signature gardiens (seuil = 2)

### Flux Crisis Cards
1. **NFC Cloné**: Emergency lock + double signature
2. **Gray Market**: Resale lock 365 jours
3. **Social Recovery**: Guardian multi-sig recovery

### Intégrations Externes
- **IPFS**: Métadonnées des montres
- **Arweave**: Stockage permanent
- **Coinbase**: Smart Wallet uniquement
- **Sepolia**: Testnet Ethereum
