import React from "react";
import Navbar from "../components/Navbar";

// IMPORT DES IMAGES DEPUIS ASSETS (Obligatoire car elles ne sont pas dans public)
import imgChronos from "../assets/watch-chronos.png";
import imgNautique from "../assets/watch-nautique.png";
import imgEternite from "../assets/watch-eternite.png";
import imgAviateur from "../assets/watch-aviateur.png";

const watches = [
  { 
    id: 1, 
    model: "Chronos Elite", 
    brand: "MAISON CHRONOS", 
    price: "12 500 €", 
    image: imgChronos, 
    description: "Mouvement automatique, boîtier en or rose 18 carats." 
  },
  { 
    id: 2, 
    model: "Nautique Royale", 
    brand: "ATELIER MARITIME", 
    price: "8 900 €", 
    image: imgNautique, 
    description: "Chronographe sportif, lunette en céramique." 
  },
  { 
    id: 3, 
    model: "Éternité Classique", 
    brand: "HORLOGERIE SUISSE", 
    price: "22 000 €", 
    image: imgEternite, 
    description: "Tourbillon visible, édition limitée 50 pièces." 
  },
  { 
    id: 4, 
    model: "Aviateur Pro", 
    brand: "SKY MASTERS", 
    price: "6 750 €", 
    image: imgAviateur, 
    description: "GMT double fuseau, verre saphir anti-reflet." 
  }
];

export default function Boutique() {
  return (
    <>
      {/* C'est cette ligne qui supprime définitivement le blanc autour de ton site */}
      <style dangerouslySetInnerHTML={{ __html: 'body { margin: 0; padding: 0; background-color: #0a0a0a; }' }} />

      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
        <Navbar />
        
        {/* SECTION TITRE CORRIGÉE */}
        <header style={{ textAlign: 'center', padding: '80px 20px 40px' }}>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '3.5rem', 
            margin: 0,
            fontWeight: '700'
          }}>
            Boutique <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Exclusive</span>
          </h1>
          <p style={{ color: '#666', fontSize: '14px', letterSpacing: '1px', marginTop: '10px' }}>
            CHAQUE MONTRE EST ACCOMPAGNÉE DE SON CERTIFICAT D'AUTHENTICITÉ NUMÉRIQUE.
          </p>
        </header>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 80px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '40px' 
          }}>
            {watches.map((watch) => (
              <div key={watch.id} className="watch-card" style={{
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '2rem',
                padding: '30px',
                textAlign: 'left'
              }}>
                {/* IMAGE DE LA MONTRE */}
                <div style={{ textAlign: 'center', position: 'relative', marginBottom: '20px' }}>
                  <span style={{ 
                    position: 'absolute', top: 0, right: 0, 
                    color: '#d4af37', border: '1px solid #d4af37', 
                    fontSize: '10px', padding: '3px 8px', borderRadius: '4px' 
                  }}>CERTIFIÉE</span>
                  
                  <img 
                    src={watch.image.src} 
                    alt={watch.model} 
                    style={{ width: '100%', height: '300px', objectFit: 'contain' }} 
                  />
                </div>

                {/* DÉTAILS */}
                <p style={{ color: '#d4af37', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '5px' }}>
                  {watch.brand}
                </p>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', margin: '0 0 10px 0' }}>
                  {watch.model}
                </h2>
                <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.5', height: '40px' }}>
                  {watch.description}
                </p>

                {/* FOOTER DE LA CARTE */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '30px',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '20px'
                }}>
                  <span style={{ fontSize: '28px', color: '#d4af37', fontFamily: 'Playfair Display, serif' }}>
                    {watch.price}
                  </span>
                  <button style={{ 
                    background: '#d4af37', 
                    color: 'black', 
                    border: 'none', 
                    padding: '12px 25px', 
                    borderRadius: '10px', 
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    Acheter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}