import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from '../components/FloatingHearts';
import PageTransition from '../components/PageTransition';

const Reasons = () => {
  // --- TA LISTE D'AMOUR (À COMPLÉTER !) ---
  const reasonsArray = [
    "Parce que tu es la plus belle femme du monde (objectivement).",
    "Pour la façon dont tu me regardes quand je dis une bêtise.",
    "Parce que tu me pousses à être une meilleure version de moi-même.",
    "Pour tes câlins qui réparent tout.",
    "Parce que tu es ma meilleure amie.",
    "Pour ton rire qui illumine la pièce.",
    "Parce que tu fais les meilleures pâtes du monde (ou insère son plat).",
    "Pour ta patience avec moi.",
    "Parce que j'adore l'odeur de tes cheveux.",
    "Pour notre avenir qu'on construit ensemble.",
    "Parce que tu es forte, même quand tu en doutes.",
    "Pour la façon dont tes yeux brillent quand tu es heureuse.",
    "Parce que tu es la seule qui me comprenne vraiment.",
    "Pour toutes nos petites blagues que personne d'autre ne comprend.",
    "Parce que je me sens en sécurité avec toi.",
    "Pour ton intelligence et ta vivacité d'esprit.",
    "Parce que tu es une maman/future maman incroyable (si applicable).",
    "Pour ta douceur.",
    "Parce que même en pyjama, tu es canon.",
    "Pour la façon dont tu prends soin des autres.",
    "Parce que tu as toujours raison (enfin, presque).",
    "Pour nos soirées Netflix sous le plaid.",
    "Parce que tu es mon âme sœur.",
    "Pour ton petit nez tout mignon.",
    "Parce que ma vie est 1000x mieux depuis que tu es dedans.",
    "Pour ta gentillesse infinie.",
    "Parce que je ne peux pas imaginer une journée sans toi.",
    "Pour la façon dont tu dors.",
    "Parce que je t'aime, tout simplement.",
    "Pour tout ce que tu es, et tout ce que tu seras."
  ];

  const [currentReason, setCurrentReason] = useState(null);

  const showRandomReason = () => {
    // Choisir une raison au hasard
    const randomIndex = Math.floor(Math.random() * reasonsArray.length);
    setCurrentReason(reasonsArray[randomIndex]);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 font-['Playfair_Display'] overflow-hidden relative">
        <FloatingHearts />
        
        {/* Bouton Retour */}
        <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-2xl border border-pink-100 rounded-full hover:shadow-lg">🏠</Link>

        {/* Contenu Principal */}
        <div className="z-10 text-center w-full max-w-md">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-400 to-pink-600 mb-8 animate-fade-in-up">
            Pourquoi je t'aime ?
          </h1>
          
          <p className="text-gray-500 italic mb-12">
            Clique sur le cœur pour découvrir une raison...
          </p>

          {/* Le Gros Bouton Coeur */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={showRandomReason}
            className="w-40 h-40 bg-linear-to-br hover:cursor-pointer from-red-400 to-pink-500 rounded-full shadow-2xl flex items-center justify-center mx-auto cursor-pointer border-4 border-white/50 relative group"
          >
            <span className="text-6xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">💖</span>
            {/* Onde de choc animée */}
            <div className="absolute inset-0 rounded-full border-2 border-pink-400 opacity-0 group-hover:animate-ping"></div>
          </motion.button>
        </div>

        {/* LA MODALE (Affichage de la raison) */}
        <AnimatePresence>
          {currentReason && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={() => setCurrentReason(null)} // Ferme si on clique à côté
            >
              <motion.div 
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-pink-100 relative"
                onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique DANS la boîte
              >
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed font-serif">
                  "{currentReason}"
                </h3>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={showRandomReason}
                        className="bg-pink-500 text-white py-3 px-6 hover:cursor-pointer rounded-full font-bold shadow-lg hover:bg-pink-600 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                    >
                        Encore une ! 🎲
                    </button>
                    <button 
                        onClick={() => setCurrentReason(null)}
                        className="text-gray-400 text-sm hover:text-gray-600 py-2 hover:cursor-pointer"
                    >
                        Fermer
                    </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

export default Reasons;