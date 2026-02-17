import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'; // On ajoute Framer Motion
import FloatingHearts from '../components/FloatingHearts';

const OpenWhen = () => {
  const [selectedEnvelope, setSelectedEnvelope] = useState(null);

  // --- TES LETTRES ---
  const envelopes = [
    {
      id: 1,
      title: "Quand tu es triste 😢",
      color: "border-blue-200 text-blue-600 bg-blue-50",
      sealColor: "bg-blue-500",
      content: "Mon amour, sache que même les nuages les plus gris finissent par passer. Je suis là pour toi, toujours. Prends une grande inspiration, tout va bien se passer.",
      image: "https://media.giphy.com/media/3oEdv4hwWTzBhWvaU0/giphy.gif"
    },
    {
      id: 2,
      title: "Quand je te manque 🥺",
      color: "border-purple-200 text-purple-600 bg-purple-50",
      sealColor: "bg-purple-500",
      content: "Ferme les yeux et imagine que je suis juste à côté de toi. On se retrouve très vite. En attendant, regarde cette photo qui me fait penser à nous.",
      image: "https://media.giphy.com/media/VbawWIGNtWAu79qQKS/giphy.gif"
    },
    {
      id: 3,
      title: "Quand tu es fâchée contre moi 😡",
      color: "border-red-200 text-red-600 bg-red-50",
      sealColor: "bg-red-500",
      content: "Je suis désolé si j'ai agi comme un idiot (ce qui arrive parfois !). Je ne veux jamais te blesser. Pardonne-moi ? ❤️",
      image: "https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif"
    },
    {
      id: 4,
      title: "Quand tu as besoin de rire 😂",
      color: "border-yellow-200 text-yellow-600 bg-yellow-50",
      sealColor: "bg-yellow-500",
      content: "Rappelle-toi la fois où... (Insère ici un souvenir drôle ou une blague nulle que tu adores). Ton sourire est ce que je préfère au monde.",
      image: "https://media.giphy.com/media/kaq6GnxDlJaBq/giphy.gif"
    },
    {
      id: 5,
      title: "Quand tu doutes de nous 💭",
      color: "border-pink-200 text-pink-600 bg-pink-50",
      sealColor: "bg-pink-500",
      content: "Regarde tout le chemin qu'on a parcouru. Tu es la femme de ma vie et je te choisirai encore et encore, chaque jour.",
      image: "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif"
    },
    {
      id: 6,
      title: "Quand tu as besoin de motivation 💪",
      color: "border-green-200 text-green-600 bg-green-50",
      sealColor: "bg-green-500",
      content: "Tu es capable de tout. Tu es intelligente, forte et incroyable. Ne laisse personne te dire le contraire. Fonce !",
      image: "https://media.giphy.com/media/1xVbRS6j52YSzp9E7Q/giphy.gif"
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-start p-6 overflow-y-auto font-['Playfair_Display'] relative">
        <FloatingHearts />
        
        <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-md bg-white border border-gray-100 rounded-full hover:shadow-lg transition-all">
          🏠
        </Link>
        
        <div className="z-10 w-full max-w-2xl mt-12 mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3 py-2">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-pink-600 leading-normal">
              Ouvrir quand...
            </span>
          </h1>
          <p className="text-gray-500 italic mb-8">Une lettre pour chaque moment de ta vie...</p>

          {/* GRILLE DES ENVELOPPES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-2 pb-20">
            {envelopes.map((env) => (
              <motion.button
                key={env.id}
                whileHover={{ scale: 1.02, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedEnvelope(env)}
                className={`relative p-6 rounded-lg shadow-md border border-gray-200 transition-all text-left overflow-hidden hover:cursor-pointer bg-[#fdfbf7] group`}
              >
                {/* Liseré de couleur en haut */}
                <div className={`absolute top-0 left-0 w-full h-1 ${env.sealColor}`}></div>

                <div className="flex flex-col items-center text-center gap-4 relative z-10">
                  {/* Sceau de cire simulé */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner text-white text-xl font-bold ${env.sealColor} shadow-lg ring-4 ring-white`}>
                    ✉️
                  </div>
                  
                  <div>
                    <h3 className={`font-bold text-lg leading-tight ${env.color.split(' ')[1]}`}>{env.title}</h3>
                    <div className="w-16 h-px bg-gray-300 mx-auto my-3"></div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-sans">Scellé avec amour</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* MODALE (LA LETTRE OUVERTE) */}
        <AnimatePresence>
          {selectedEnvelope && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
              
              {/* Fond sombre */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedEnvelope(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* La Lettre */}
              <motion.div 
                layoutId={`envelope-${selectedEnvelope.id}`} // Animation magique de transition
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className="bg-[#fdfbf7] w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl relative p-8 border-t-8 border-red-800"
                // Style papier ligné
                style={{
                  backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                  backgroundSize: '100% 2rem',
                  lineHeight: '2rem'
                }}
              >
                {/* Bouton Fermer */}
                <button 
                  onClick={() => setSelectedEnvelope(null)}
                  className="hover:cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition-colors"
                >
                  ✕
                </button>

                <div className="flex flex-col items-center text-center">
                  <h2 className="text-2xl font-bold text-red-800 font-serif mb-6">{selectedEnvelope.title}</h2>
                  
                  {/* Image/Gif */}
                  {selectedEnvelope.image && (
                    <div className="rounded-lg overflow-hidden shadow-sm w-full max-h-48 mb-6 rotate-1 border-4 border-white bg-white">
                      <img src={selectedEnvelope.image} alt="Gif mignon" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Le contenu du message */}
                  <div className="w-full text-left">
                    <p className="text-gray-800 font-serif text-lg leading-loose whitespace-pre-line">
                      {selectedEnvelope.content}
                    </p>
                  </div>

                  <div className="mt-8 text-center w-full pt-6 border-t border-gray-200">
                     <p className="font-cursive text-xl text-gray-500">Ton Amour ❤️</p>
                  </div>

                  <button 
                    onClick={() => setSelectedEnvelope(null)}
                    className="mt-6 bg-red-800 text-white px-8 py-2 rounded-full hover:cursor-pointer font-bold shadow-md hover:bg-red-900 transition-colors text-sm uppercase tracking-widest"
                  >
                    Refermer la lettre
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default OpenWhen;