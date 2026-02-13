import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}      // Arrive un peu du bas
      animate={{ opacity: 1, y: 0 }}       // Se place correctement
      exit={{ opacity: 0, y: -15 }}        // Part un peu vers le haut
      transition={{ 
        duration: 0.3,                     // Un peu plus rapide
        ease: "easeInOut"                  // Courbe d'accélération plus naturelle
      }}
      className="w-full min-h-screen"      // Assure que le conteneur prend toute la place
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;