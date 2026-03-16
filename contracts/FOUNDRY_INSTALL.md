# Installation de Foundry sur Windows

Foundry (forge, cast, anvil, chisel) est requis pour compiler et tester les smart contracts.

## Option 1: WSL2 (Recommandé)

Si vous avez WSL2 installé :
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Option 2: PowerShell (Manuel)

1. Télécharger les binaires : https://github.com/foundry-rs/foundry/releases
2. Extraire dans un dossier (ex: `C:\foundry`)
3. Ajouter au PATH :
   ```powershell
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\foundry", "User")
   ```
4. Redémarrer PowerShell

## Option 3: VS Code Dev Container

Utiliser un conteneur Docker avec Foundry préinstallé.

## Vérification

```bash
forge --version
cast --version
anvil --version
```

## Commandes essentielles

```bash
# Compiler
forge build

# Tester
forge test

# Déployer (local)
anvil  # Dans un autre terminal
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```
