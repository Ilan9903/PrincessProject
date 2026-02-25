import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import FloatingHearts from '../components/FloatingHearts';
import ThemeToggle from '../components/ThemeToggle';
import { login } from '../Utils/api';

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (pin.length !== 4) return;

    setIsLoading(true);

    // ✅ NOUVEAU: Appel API sécurisé
    const result = await login(pin);

    setIsLoading(false);

    if (result.success) {
      // ✅ Succès: Appeler onLogin si fourni, puis rediriger
      if (onLogin) onLogin();
      navigate('/home');
    } else {
      // ✅ Erreur: Animation shake
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
    <div className="fixed inset-0 z-100 bg-pink-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 font-['Playfair_Display'] overflow-hidden transition-colors duration-300">
      <FloatingHearts />
      <ThemeToggle />
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-[2px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-sm bg-white/80 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white dark:border-gray-700 flex flex-col items-center text-center transition-colors duration-300"
      >
        <div className="text-4xl mb-4">👑</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Espace Privé</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 italic transition-colors">Accès réservé à ma Princesse</p>

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
              className="w-full text-center text-3xl tracking-[1em] font-bold py-4 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-pink-600 dark:text-pink-400 placeholder:text-pink-300 dark:placeholder:text-gray-500 placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all shadow-inner caret-transparent relative z-0"
              autoFocus
              disabled={isLoading}
            />

            {/* BARRE CLIGNOTANTE PERSONNALISÉE (Version Framer Motion) */}
            {pin.length < 4 && !isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <motion.div 
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="h-8 w-0.5 bg-pink-600 rounded-full"
                  style={{ 
                    x: getCursorPosition(),
                  }} 
                />
              </div>
            )}
          </motion.div>

          <button 
            type="submit"
            disabled={isLoading || pin.length !== 4}
            className="w-full py-4 bg-linear-to-r from-pink-400 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <span>Entrer</span>
                <span>🔓</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 transition-colors">
          Indice : La date de notre rencontre...
        </p>
      </motion.div>
    </div>
  );
};

export default Login;