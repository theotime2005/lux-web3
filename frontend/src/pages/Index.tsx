import { useState } from "react";
import { motion } from "framer-motion";
import { Nfc, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar /> {/* <-- C'est ça qui manquait ! */}
      
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-serif text-[#d4af37] mb-2">Watch Whispers</h1>
        <p className="text-gray-400 mb-16 uppercase tracking-widest text-sm">Engineering Invisible Luxury</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="bg-zinc-900/50 border border-[#d4af37]/20 p-10 rounded-3xl">
            <h2 className="text-xl mb-8">Profil Client</h2>
            <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5 italic">
               <span className="text-[#d4af37] text-3xl block mb-2">👑</span>
               <p className="font-bold">Collectionneur Privé</p>
               <div className="bg-[#d4af37] text-black text-[10px] font-bold px-3 py-1 rounded-full w-fit mx-auto mt-2">NIVEAU OR</div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-[#d4af37]/20 p-10 rounded-3xl">
            <h2 className="text-xl mb-8">Pont Phygital</h2>
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center border border-[#d4af37]/20">
                <Nfc className="text-[#d4af37]" size={32} />
              </div>
              <button className="bg-[#d4af37] text-black font-bold py-4 px-10 rounded-xl hover:scale-105 transition-transform">
                SCANNER LA MONTRE
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;