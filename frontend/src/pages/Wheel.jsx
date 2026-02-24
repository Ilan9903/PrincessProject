import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from 'framer-motion';
import FloatingHearts from '../components/FloatingHearts';
import PageTransition from '../components/PageTransition';

const Wheel = () => {
  const options = [
    "Massage 💆‍♀️", 
    "Netflix & Chill 🍿", 
    "Resto / UberEats 🍕", 
    "Balade Amoureuse 🌙", 
    "Jeu de société 🎲", 
    "Cuisiner à deux 👩‍🍳"
  ];

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  
  // On utilise une Ref pour garder en mémoire la rotation TOTALE accumulée
  const currentRotation = useRef(0);
  const controls = useAnimation();

  const spinWheel = async () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    // 1. On décide d'une nouvelle rotation aléatoire (entre 5 et 10 tours complets)
    const newSpins = 1800 + Math.random() * 1800; // Entre 1800° et 3600° de plus
    
    // 2. IMPORTANT : On AJOUTE cette valeur à la rotation actuelle pour que ça tourne toujours vite
    const nextRotation = currentRotation.current + newSpins;
    
    // 3. On lance l'animation
    await controls.start({
      rotate: nextRotation,
      transition: { duration: 4, ease: [0.2, 0.8, 0.2, 1] } // Courbe de Bézier pour un freinage réaliste
    });

    // 4. On sauvegarde la nouvelle position pour le prochain lancer
    currentRotation.current = nextRotation;

    // 5. Calcul du gagnant
    // La flèche est en haut (0°). Puisque la roue tourne dans le sens horaire,
    // on doit calculer l'angle inverse pour savoir quel segment est arrivé à 0°.
    const degreesPerSegment = 360 / options.length;
    const actualRotation = nextRotation % 360;
    
    // Formule magique pour trouver l'index sous la flèche du haut
    const winningIndex = Math.floor(((360 - actualRotation) % 360) / degreesPerSegment);
    
    setResult(options[winningIndex]);
    setSpinning(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Playfair_Display'] transition-colors">
        <FloatingHearts />
        
        <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-2xl border border-pink-100 dark:border-gray-700 rounded-full hover:shadow-lg bg-white dark:bg-gray-800 transition-colors">🏠</Link>

        <div className="text-center z-10 mb-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">La Roue du Soir</h1>
          <p className="text-gray-500 dark:text-gray-400 italic text-sm mt-1">Laisse le destin choisir...</p>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          
          {/* FLÈCHE (Pointeur) - Fixe en haut */}
          <div className="absolute -top-3.75 z-20 drop-shadow-lg">
             <div className="text-4xl text-pink-600">▼</div>
          </div>

          {/* LA ROUE */}
          <motion.div 
            animate={controls}
            className="w-75 h-75 rounded-full border-8 border-white shadow-2xl relative overflow-hidden"
            style={{ 
                // Dégradé conique calculé pour 6 segments
                background: `conic-gradient(
                    #fecdd3 0deg 60deg, 
                    #fbcfe8 60deg 120deg, 
                    #fae8ff 120deg 180deg, 
                    #e0e7ff 180deg 240deg, 
                    #dcfce7 240deg 300deg, 
                    #fef9c3 300deg 360deg)` 
            }}
          >
            {/* Les segments de texte */}
            {options.map((option, i) => (
              <div 
                key={i}
                className="absolute w-full h-full top-0 left-0 flex justify-center pt-4"
                style={{ 
                    // Rotation du container :
                    // i * 60deg = début du segment
                    // + 30deg = CENTRER le texte au milieu du segment
                    transform: `rotate(${i * 60 + 30}deg)` 
                }}
              >
                {/* Le texte lui-même */}
                <span className="text-gray-700 font-bold text-xs uppercase tracking-wider w-24 text-center leading-tight">
                  {option}
                </span>
              </div>
            ))}
            
            {/* Centre blanc décoratif */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md z-10 border-2 border-pink-100"></div>
          </motion.div>

          {/* BOUTON LANCER */}
          <button 
            onClick={spinWheel}
            disabled={spinning}
            className={`mt-10 px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all active:scale-95 ${spinning ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-pink-500 to-rose-500 hover:shadow-pink-200/50 hover:-translate-y-1 hover:cursor-pointer'}`}
          >
            {spinning ? 'Ça tourne... 🎡' : 'Lancer la roue !'}
          </button>
        </div>

        {/* RÉSULTAT CORRIGÉ */}
        {result && !spinning && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-3xl border-4 border-pink-200 dark:border-pink-700 shadow-2xl z-10 text-center max-w-xs animate-bounce-short transition-colors"
          >
            <p className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Le verdict :</p>
            <h2 className="text-2xl font-bold">
              {/* Le texte coloré (tout sauf les 2 derniers caractères qui sont l'emoji et l'espace) */}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-600">
                {result.substring(0, result.length - 2)}
              </span>
              {/* L'emoji (les 2 derniers caractères) en couleur normale */}
              <span className="ml-2">{result.slice(-2)}</span>
            </h2>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default Wheel;