import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, LogOut } from "lucide-react";
import { NFCScanner } from "@/components/NFCScanner";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Connecté</p>
              <p className="font-mono font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => disconnect()}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Connexion sans friction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">
          Pas de seed phrase. Pas de gas. Simple et sécurisé.
        </p>
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="w-full"
            variant={connector.name === 'Coinbase Wallet' ? 'default' : 'outline'}
          >
            {connector.name === 'Coinbase Wallet' 
              ? 'Connexion Smart Wallet' 
              : connector.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function WatchWhispersApp() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Watch Whispers
          </h1>
          <p className="text-slate-600">
            Votre passeport numérique de montre de luxe
          </p>
        </header>

        <WalletConnect />
        
        {isConnected && <NFCScanner />}
        
        <footer className="text-center mt-12 text-sm text-slate-500">
          © 2026 Watch Whispers - Le Web3 au service du Luxe
        </footer>
      </div>
    </div>
  );
}

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WatchWhispersApp />} />
        <Route path="/index" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
