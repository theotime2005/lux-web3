import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Toaster as Sonner } from "sonner";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="card-header">
          <h3 className="card-title">Connecté</h3>
          <p className="card-description">
            Adresse: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        <div className="card-content">
          <button 
            onClick={() => disconnect()} 
            className="btn btn-secondary btn-full"
          >
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="card-header">
        <h3 className="card-title">Connexion Wallet</h3>
        <p className="card-description">
          Connectez votre wallet pour accéder au passeport numérique
        </p>
      </div>
      <div className="card-content">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="btn btn-primary btn-full"
            style={{ marginBottom: 'var(--space-sm)' }}
          >
            {connector.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <h1>Watch Whispers</h1>
            <p>Passeport Numérique de Montre de Luxe</p>
          </div>
          <WalletConnect />
        </div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Sonner />
      </div>
    </BrowserRouter>
  );
}

export default App;
