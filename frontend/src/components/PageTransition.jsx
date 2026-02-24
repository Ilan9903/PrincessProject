import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}             // Fade in sans mouvement vertical
      animate={{ opacity: 1 }}             // Apparition fluide
      exit={{ opacity: 0 }}                // Disparition fluide
      transition={{ 
        duration: 0.15,                    // Plus rapide pour éviter les flashs
        ease: "easeInOut"
      }}
      className="w-full min-h-screen"      // Pas de fond, chaque page gère le sien
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;