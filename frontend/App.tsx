import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { NFCScanner } from './components/NFCScanner';

const App: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="app">
      <header>
        <h1>Watch Whispers</h1>
        <p>Votre passeport numérique de montre de luxe</p>
      </header>

      <main>
        {!isConnected ? (
          <div className="connect-section">
            <h2>Connexion sans friction</h2>
            <p>Pas de seed phrase. Pas de gas. Simple et sécurisé.</p>
            <div className="connectors">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="connect-button"
                >
                  {connector.name === 'Coinbase Wallet' 
                    ? 'Connexion Smart Wallet' 
                    : connector.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="connected-section">
            <div className="wallet-info">
              <p>Connecté: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              <button onClick={() => disconnect()} className="disconnect-button">
                Déconnexion
              </button>
            </div>
            
            <NFCScanner />
          </div>
        )}
      </main>

      <footer>
        <p>© 2026 Watch Whispers - Le Web3 au service du Luxe</p>
      </footer>
    </div>
  );
};

export default App;
