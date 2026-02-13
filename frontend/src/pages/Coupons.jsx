import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import FloatingHearts from '../components/FloatingHearts';
import PageTransition from '../components/PageTransition';

const Coupons = () => {
  const couponsData = [
    { id: 1, title: "Massage VIP", content: "Valable pour 30 min de massage relaxant (dos ou pieds au choix).", icon: "💆‍♀️", color: "bg-rose-100" },
    { id: 2, title: "Soirée Sans Vaisselle", content: "Ce soir, je m'occupe de tout. Tu mets juste les pieds sous la table !", icon: "🍽️", color: "bg-blue-100" },
    { id: 3, title: "Resto Surprise", content: "Un dîner dans l'endroit de ton choix, c'est bibi qui régale.", icon: "🍷", color: "bg-purple-100" },
    { id: 4, title: "Joker 'J'ai Raison'", content: "Utilise ce ticket pour gagner instantanément n'importe quel débat.", icon: "⚖️", color: "bg-yellow-100" },
    { id: 5, title: "Petit Déj au Lit", content: "Croissants, café et jus d'orange servis avec amour au réveil.", icon: "🥐", color: "bg-orange-100" },
    { id: 6, title: "Grands Câlins Illimités", content: "Une dose de tendresse infinie pendant tout le temps nécessaire.", icon: "🫂", color: "bg-pink-100" },
  ];

  const [flippedId, setFlippedId] = useState(null);

  return (
    <PageTransition>
      <div className="min-h-screen bg-pink-50 flex flex-col items-center p-6 font-['Playfair_Display'] relative">
        <FloatingHearts />
        
        <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-2xl border border-pink-100 rounded-full hover:shadow-lg">🏠</Link>

        <div className="z-10 text-center mt-12 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tes Bons Cadeaux</h1>
          <p className="text-gray-500 italic">Clique sur un ticket pour l'activer...</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl z-10 pb-12">
          {couponsData.map((coupon) => (
            <div 
              key={coupon.id} 
              className="perspective-1000 h-48 cursor-pointer"
              onClick={() => setFlippedId(flippedId === coupon.id ? null : coupon.id)}
            >
              <motion.div 
                className="relative w-full h-full transition-all duration-500 preserve-3d"
                animate={{ rotateY: flippedId === coupon.id ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {/* Recto (Côté visible au début) */}
                <div className={`absolute inset-0 backface-hidden rounded-3xl border-4 border-dashed border-white shadow-xl ${coupon.color} flex flex-col items-center justify-center p-4`}>
                  <span className="text-5xl mb-2">{coupon.icon}</span>
                  <h3 className="font-bold text-xl text-gray-700">{coupon.title}</h3>
                  <div className="mt-4 text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">Ticket n°000{coupon.id}</div>
                </div>

                {/* Verso (Le cadeau révélé) */}
                <div 
                  className="absolute inset-0 backface-hidden rounded-3xl border-4 border-pink-300 shadow-2xl bg-white flex flex-col items-center justify-center p-6 text-center rotate-y-180"
                >
                  <p className="text-gray-700 font-serif leading-relaxed italic">
                    "{coupon.content}"
                  </p>
                  <div className="mt-4 bg-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Utilisable 1 fois</div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS nécessaire pour l'effet 3D */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </PageTransition>
  );
};

export default Coupons;