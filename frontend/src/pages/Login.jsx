import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; // On utilise motion ici
import FloatingHearts from '../components/FloatingHearts';

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // --- LE MOT DE PASSE ---
  const SECRET_CODE = "2106"; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === SECRET_CODE) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPin("");
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    // On accepte uniquement les chiffres
    if (/^\d*$/.test(value)) {
      setPin(value);
    }
  };

  const getCursorPosition = () => {
    switch (pin.length) {
      case 0: return '0px';   
      case 1: return '20px';  
      case 2: return '40px';  
      case 3: return '60px';  
      default: return '0px';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-pink-50 flex flex-col items-center justify-center p-6 font-['Playfair_Display'] overflow-hidden">
      <FloatingHearts />
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-sm bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white flex flex-col items-center text-center"
      >
        <div className="text-4xl mb-4">👑</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Espace Privé</h1>
        <p className="text-gray-500 text-sm mb-8 italic">Accès réservé à ma Princesse</p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          
          <motion.div 
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative w-full flex justify-center"
          >
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="4"
              value={pin}
              onChange={handlePinChange}
              placeholder="Code PIN" 
              className="w-full text-center text-3xl tracking-[1em] font-bold py-4 bg-pink-50 border-2 border-pink-200 rounded-xl text-pink-600 placeholder:text-pink-300 placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all shadow-inner caret-transparent relative z-0"
              autoFocus
            />

            {/* BARRE CLIGNOTANTE PERSONNALISÉE (Version Framer Motion) */}
            {pin.length < 4 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <motion.div 
                  // Animation de clignotement (Opacité 1 -> 0 -> 1)
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ 
                    duration: 1.5,         // Durée d'un cycle
                    repeat: Infinity,    // Répéter à l'infini
                    ease: "linear"       // Mouvement régulier
                  }}
                  className="h-8 w-0.5 bg-pink-600 rounded-full"
                  style={{ 
                    x: getCursorPosition(), // Position gérée par Framer Motion
                  }} 
                />
              </div>
            )}
          </motion.div>

          <button 
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 hover:cursor-pointer"
          >
            <span>Entrer</span>
            <span>🔓</span>
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-400">
          Indice : La date de notre rencontre...
        </p>
      </motion.div>
    </div>
  );
};

export default Login;