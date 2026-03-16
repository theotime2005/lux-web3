import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Toaster as Sonner } from "sonner";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

// Simple Components
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardHeader = ({ children }: any) => (
  <div className="p-6 pb-2">{children}</div>
);

const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardDescription = ({ children }: any) => (
  <p className="text-gray-600 text-sm">{children}</p>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 pt-2 ${className}`}>{children}</div>
);

function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connecté</CardTitle>
          <CardDescription>
            Adresse: {address?.slice(0, 6)}...{address?.slice(-4)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button 
            onClick={() => disconnect()} 
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Déconnexion
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connexion Wallet</CardTitle>
        <CardDescription>
          Connectez votre wallet pour accéder au passeport numérique
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="w-full mb-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            {connector.name}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Watch Whispers
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Passeport Numérique de Montre de Luxe
          </p>
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
