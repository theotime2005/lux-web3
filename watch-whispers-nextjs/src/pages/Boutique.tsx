'use client'

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Shield, Clock, Check, ChevronRight, Star } from "lucide-react";

// IMPORT DES IMAGES
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
    description: "Mouvement automatique, boîtier en or rose 18 carats, étanche 100m.",
    rating: 5 
  },
  { 
    id: 2, 
    model: "Nautique Royale", 
    brand: "ATELIER MARITIME", 
    price: "8 900 €", 
    image: imgNautique, 
    description: "Chronographe sportif, lunette en céramique, bracelet acier inoxydable.",
    rating: 4
  },
  { 
    id: 3, 
    model: "Éternité Classique", 
    brand: "HORLOGERIE SUISSE", 
    price: "22 000 €", 
    image: imgEternite, 
    description: "Tourbillon visible, cadran guilloché, édition limitée 50 pièces.",
    rating: 5
  },
  { 
    id: 4, 
    model: "Aviateur Pro", 
    brand: "SKY MASTERS", 
    price: "6 750 €", 
    image: imgAviateur, 
    description: "Inspiration aviation, GMT double fuseau, verre saphir anti-reflet.",
    rating: 4
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
      {[...Array(5)].map((_, index) => (
        <Star 
          key={index} 
          size={14} 
          fill={index < rating ? "#d4af37" : "none"} 
          color={index < rating ? "#d4af37" : "#333"} 
        />
      ))}
    </div>
  );
};

export default function Boutique() {
  const [selectedWatch, setSelectedWatch] = useState<any | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const handleBuyClick = (watch: any) => {
    setSelectedWatch(watch);
    setPurchased(false);
  };

  const confirmPurchase = () => {
    setPurchasing(true);
    setTimeout(() => {
      setPurchasing(false);
      setPurchased(true);
    }, 2000);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { margin: 0; padding: 0; background-color: #0a0a0a; color: white; font-family: 'Inter', sans-serif; }
        .watch-card:hover { border-color: rgba(212, 175, 55, 0.3) !important; transform: translateY(-5px); transition: all 0.3s ease; }
      ` }} />

      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
        <Navbar />
        
        {/* HEADER DESIGN (image_d51f46) */}
        <header style={{ textAlign: 'center', padding: '40px 20px 60px' }}>
          <h1 style={{ fontSize: '3.5rem', margin: 0, fontWeight: '500', fontFamily: 'serif' }}>
            Boutique <span style={{ color: '#d4af37' }}>Exclusive</span>
          </h1>
          <p style={{ color: '#888', fontSize: '14px', marginTop: '15px', maxWidth: '700px', margin: '15px auto 0', lineHeight: '1.6' }}>
            Chaque montre est accompagnée de son certificat d'authenticité numérique, garantissant provenance et traçabilité.
          </p>
        </header>

        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '30px' }}>
            {watches.map((watch) => (
              <div key={watch.id} className="watch-card" style={{
                background: '#111111', border: '1px solid #1a1a1a', borderRadius: '1.5rem',
                padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '30px', background: '#141414', borderRadius: '1rem', padding: '40px' }}>
                  <span style={{ 
                    position: 'absolute', top: '30px', right: '30px', color: '#d4af37', border: '1px solid #d4af37', 
                    fontSize: '10px', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' 
                  }}>
                    <Shield size={10} style={{marginRight: '5px', display: 'inline'}} /> CERTIFIÉE
                  </span>
                  <img src={watch.image.src || watch.image} alt={watch.model} style={{ width: '100%', height: '280px', objectFit: 'contain' }} />
                </div>

                <p style={{ color: '#888', fontSize: '11px', letterSpacing: '1.5px', marginBottom: '8px' }}>{watch.brand}</p>
                <h2 style={{ fontSize: '1.8rem', margin: '0 0 12px 0', fontFamily: 'serif' }}>{watch.model}</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', minHeight: '45px' }}>{watch.description}</p>
                
                <StarRating rating={watch.rating} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <span style={{ fontSize: '28px', color: '#d4af37', fontFamily: 'serif' }}>{watch.price}</span>
                  <button 
                    onClick={() => handleBuyClick(watch)}
                    style={{ 
                      background: '#d4af37', color: 'black', border: 'none', padding: '16px', 
                      borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}
                  >
                    <ShoppingBag size={18} /> Acheter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* MODAL SYSTEM (image_d58407 & image_d5815c) */}
        <AnimatePresence>
          {selectedWatch && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', 
                justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', padding: '20px'
              }}
              onClick={() => !purchasing && setSelectedWatch(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                style={{
                  backgroundColor: '#111111', width: '100%', maxWidth: '420px', padding: '40px', 
                  borderRadius: '24px', border: '1px solid #1a1a1a', textAlign: 'center'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {!purchased ? (
                  <>
                    <img src={selectedWatch.image.src || selectedWatch.image} alt="" style={{ height: '150px', margin: '0 auto 20px' }} />
                    <h2 style={{ fontSize: '2rem', marginBottom: '5px', fontFamily: 'serif' }}>{selectedWatch.model}</h2>
                    <p style={{ color: '#888', marginBottom: '30px' }}>{selectedWatch.brand}</p>

                    <div style={{ textAlign: 'left', marginBottom: '30px', borderTop: '1px solid #1a1a1a', paddingTop: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ color: '#666' }}>Prix</span>
                        <span style={{ color: '#d4af37', fontWeight: 'bold' }}>{selectedWatch.price}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ color: '#666' }}>Livraison</span>
                        <span>Gratuite — 3 à 5 jours</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Certificat digital</span>
                        <span style={{ color: '#d4af37' }}>Inclus</span>
                      </div>
                    </div>

                    <div style={{ 
                      backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', 
                      padding: '15px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '30px' 
                    }}>
                      <Shield size={20} color="#d4af37" />
                      <p style={{ fontSize: '12px', color: '#d4af37', margin: 0, textAlign: 'left' }}>
                        Un certificat d'authenticité numérique sera automatiquement généré et lié à cette montre.
                      </p>
                    </div>

                    <button 
                      onClick={confirmPurchase} disabled={purchasing}
                      style={{ 
                        width: '100%', background: '#d4af37', color: 'black', padding: '18px', 
                        borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                      }}
                    >
                      {purchasing ? <Clock className="animate-spin" /> : <ShoppingBag size={18} />}
                      {purchasing ? "Traitement..." : "Confirmer l'achat"}
                    </button>
                    <button onClick={() => setSelectedWatch(null)} style={{ background: 'none', border: 'none', color: '#666', marginTop: '20px', cursor: 'pointer' }}>Annuler</button>
                  </>
                ) : (
                  <div style={{ padding: '20px 0' }}>
                    <div style={{ 
                      width: '70px', height: '70px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' 
                    }}>
                      <Check size={35} color="#d4af37" />
                    </div>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '15px', fontFamily: 'serif' }}>Achat Confirmé !</h2>
                    <p style={{ color: '#888', marginBottom: '30px' }}>Votre montre et son certificat d'authenticité ont été enregistrés avec succès.</p>
                    
                    <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '15px', textAlign: 'left', marginBottom: '30px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                        <span style={{ color: '#666' }}>Réf. commande</span>
                        <span>WL-00000{selectedWatch.id}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#666' }}>Statut</span>
                        <span style={{ color: '#d4af37' }}>Confirmé</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedWatch(null)}
                      style={{ 
                        width: '100%', background: 'none', border: '1px solid #333', color: 'white', 
                        padding: '16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
                      }}
                    >
                      Fermer <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}