import React from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import { ShieldCheck, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Détecte la page actuelle pour le style doré

  const navStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 2.5rem',
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  // Style dynamique pour les boutons
  const getButtonStyle = (path: string): React.CSSProperties => {
    const isActive = pathname === path;
    return {
      background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
      color: isActive ? '#d4af37' : '#888',
      border: isActive ? '1px solid #d4af37' : '1px solid transparent',
      padding: '0.6rem 1.2rem',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      fontSize: '14px'
    };
  };

  return (
    <nav style={navStyle}>
      {/* Logo à gauche */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} 
        onClick={() => router.push('/')}
      >
        <div style={{ 
          width: '32px', height: '32px', borderRadius: '50%', 
          border: '2px solid #d4af37', display: 'flex', 
          justifyContent: 'center', alignItems: 'center' 
        }}>
          <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '12px' }}>W</span>
        </div>
        <span style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'white', fontWeight: '600' }}>
          Watchlink
        </span>
      </div>
      
      {/* Boutons à droite */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        
        {/* BOUTON VÉRIFIER (Accueil) */}
        <button 
          onClick={() => router.push('/')}
          style={getButtonStyle('/')}
        >
          <ShieldCheck size={18} />
          Vérifier
        </button>

        {/* BOUTON BOUTIQUE (Avec le B majuscule) */}
        <button 
          onClick={() => router.push('/Boutique')}
          style={getButtonStyle('/Boutique')}
        >
          <ShoppingBag size={18} />
          Boutique
        </button>
        
      </div>
    </nav>
  );
};

export default Navbar;