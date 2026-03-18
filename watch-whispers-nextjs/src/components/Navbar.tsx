import React from 'react';
import { useRouter } from 'next/navigation'; // Utilisation du hook Next.js
import { ShieldCheck, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();

  const navStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.5rem 2rem',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  return (
    <nav style={navStyle}>
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} 
        onClick={() => router.push('/')}
      >
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #d4af37', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '12px' }}>W</span>
        </div>
        <span style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'white' }}>Watchlink</span>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
          <ShieldCheck size={18} /> Vérifier
        </button>
        <button 
          onClick={() => router.push('/boutique')}
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', border: '1px solid #d4af37', padding: '0.5rem 1.5rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          <ShoppingBag size={18} /> Boutique
        </button>
      </div>
    </nav>
  );
};

export default Navbar;