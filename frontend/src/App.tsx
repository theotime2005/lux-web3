import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Index from "./pages/Index"; 
import Boutique from "./pages/Boutique"; 

// Simulation du composant WalletConnect pour supprimer l'erreur rouge
const WalletConnect = () => <div className="hidden" />;

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* On place la Navbar ici pour qu'elle soit visible sur TOUTES les pages */}
        <Navbar /> 
        
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/Boutique" element={<Boutique />} />
          </Routes>
        </main>

        {/* On définit WalletConnect pour que TypeScript ne bloque plus */}
        <WalletConnect />
      </div>
    </BrowserRouter>
  );
}

export default App;