import React, { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import HomeButton from '../components/HomeButton';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'; // On ajoute Framer Motion
import FloatingHearts from '../components/FloatingHearts';
import { authenticatedFetch } from '../Utils/api';

const OpenWhen = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnvelope, setSelectedEnvelope] = useState(null);
  const [shakeId, setShakeId] = useState(null);

  // Charger les messages depuis l'API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await authenticatedFetch('/api/messages');
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : data.messages || []);
      } catch (error) {
        console.error('Erreur chargement messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Configuration des couleurs par catégorie
  const getCategoryStyle = (category) => {
    const styles = {
      triste: { color: "border-blue-200 text-blue-600 bg-blue-50", seal: "bg-blue-500" },
      manque: { color: "border-purple-200 text-purple-600 bg-purple-50", seal: "bg-purple-500" },
      fachee: { color: "border-red-200 text-red-600 bg-red-50", seal: "bg-red-500" },
      rire: { color: "border-yellow-200 text-yellow-600 bg-yellow-50", seal: "bg-yellow-500" },
      doute: { color: "border-pink-200 text-pink-600 bg-pink-50", seal: "bg-pink-500" },
      motivation: { color: "border-green-200 text-green-600 bg-green-50", seal: "bg-green-500" },
      default: { color: "border-gray-200 text-gray-600 bg-gray-50", seal: "bg-gray-500" }
    };
    return styles[category] || styles.default;
  };

  // Vérifier si message est verrouillé
  const isLocked = (message) => {
    if (!message.lockedUntil) return false;
    return new Date(message.lockedUntil) > new Date();
  };

  // Gérer le clic sur une enveloppe
  const handleEnvelopeClick = (message) => {
    if (isLocked(message)) {
      // Animation shake si verrouillé
      setShakeId(message.id);
      setTimeout(() => setShakeId(null), 500);
    } else {
      setSelectedEnvelope(message);
    }
  };

  // Formater la date de déverrouillage
  const formatUnlockDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-stone-100 dark:bg-gray-900 flex items-center justify-center font-['Playfair_Display']">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-bounce">💌</div>
            <p className="text-gray-500 italic">Chargement de tes lettres...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-stone-100 dark:bg-gray-900 flex flex-col items-center justify-start p-6 overflow-y-auto font-['Playfair_Display'] relative transition-colors">
        <FloatingHearts />
        
        <HomeButton />
        
        <div className="z-10 w-full max-w-2xl mt-12 mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3 py-2">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-pink-600 leading-normal">
              Ouvrir quand...
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 italic mb-8">Une lettre pour chaque moment de ta vie...</p>

          {/* GRILLE DES ENVELOPPES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-2 pb-20">
            {messages.map((msg) => {
              const locked = isLocked(msg);
              const style = getCategoryStyle(msg.category);
              
              return (
              <motion.button
                key={msg.id}
                whileHover={{ scale: locked ? 1 : 1.02, rotate: locked ? 0 : 1 }}
                whileTap={{ scale: 0.95 }}
                animate={shakeId === msg.id ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } : {}}
                onClick={() => handleEnvelopeClick(msg)}
                className={`relative p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all text-left overflow-hidden hover:cursor-pointer bg-[#fdfbf7] dark:bg-gray-800 group ${locked ? 'opacity-75' : ''}`}
              >
                {/* Liseré de couleur en haut */}
                <div className={`absolute top-0 left-0 w-full h-1 ${style.seal}`}></div>

                <div className="flex flex-col items-center text-center gap-4 relative z-10">
                  {/* Sceau de cire simulé ou cadenas */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner text-white text-xl font-bold ${style.seal} shadow-lg ring-4 ring-white dark:ring-gray-700`}>
                    {locked ? '🔒' : '✉️'}
                  </div>
                  
                  <div>
                    <h3 className={`font-bold text-lg leading-tight ${style.color.split(' ')[1]}`}>{msg.title}</h3>
                    <div className="w-16 h-px bg-gray-300 dark:bg-gray-600 mx-auto my-3"></div>
                    {locked ? (
                      <p className="text-xs text-red-400 uppercase tracking-widest font-sans font-bold">
                        Déverrouillage : {formatUnlockDate(msg.lockedUntil)}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 dark:text-gray-300 uppercase tracking-widest font-sans">Scellé avec amour</p>
                    )}
                  </div>
                </div>
              </motion.button>
              );
            })}
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
                className="bg-[#fdfbf7] dark:bg-gray-800 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl relative p-8 border-t-8 border-red-800 dark:border-red-600 transition-colors bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(75,85,99,0.3)_1px,transparent_1px)]"
                style={{
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
                  <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 font-serif mb-6">{selectedEnvelope.title}</h2>
                  
                  {/* Image/Gif */}
                  {selectedEnvelope.imageUrl && (
                    <div className="rounded-lg overflow-hidden shadow-sm w-full max-h-48 mb-6 rotate-1 border-4 border-white bg-white">
                      <img src={selectedEnvelope.imageUrl} alt="Gif mignon" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Le contenu du message */}
                  <div className="w-full text-left">
                    <p className="text-gray-800 dark:text-gray-200 font-serif text-lg leading-loose whitespace-pre-line">
                      {selectedEnvelope.content}
                    </p>
                  </div>

                  <div className="mt-8 text-center w-full pt-6 border-t border-gray-200 dark:border-gray-700">
                     <p className="font-cursive text-xl text-gray-500 dark:text-gray-400">Ton Amour ❤️</p>
                  </div>

                  <button 
                    onClick={() => setSelectedEnvelope(null)}
                    className="mt-6 bg-red-800 dark:bg-red-700 text-white px-8 py-2 rounded-full hover:cursor-pointer font-bold shadow-md hover:bg-red-900 dark:hover:bg-red-800 transition-colors text-sm uppercase tracking-widest"
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