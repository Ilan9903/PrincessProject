import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react'; // <--- Import pour la PWA
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

// --- COMPOSANTS ---
import ScrollToTop from './components/ScrollToTop';
import MusicPlayer from './components/MusicPlayer'; // ✅ Le lecteur audio
import InstallPrompt from './components/InstallPrompt'; // ✅ Le composant d'invite d'installation

// --- PAGES ---
import Login from './pages/Login';
import Home from './pages/Home';
import ValentineRequest from './pages/Valentine-request'; // J'ai remis le nom standard si ton fichier s'appelle Valentine.jsx
import ValentineSuccess from './pages/Valentine-success';          // Idem pour Success.jsx
import DateIdeas from './pages/DateIdeas';
import OpenWhen from './pages/OpenWhen';
import OurStory from './pages/OurStory';
import Reasons from './pages/Reasons';
import Coupons from './pages/Coupons';
import Wheel from './pages/Wheel';
import Quiz from './pages/Quiz';
import ScratchGame from './pages/ScratchGame';

// --- GESTION DES ROUTES ANIMÉES ---
// Ce composant s'occupe de vérifier la sécurité et de gérer les transitions
const AnimatedRoutes = ({ setIsAuthenticated }) => {
  const location = useLocation();

  // Sécurité : Vérifie le token à chaque changement de page
  useEffect(() => {
    const hasAccessed = localStorage.getItem('princess_access') === 'true';
    if (!hasAccessed) {
      setIsAuthenticated(false);
    }
  }, [location, setIsAuthenticated]);

  return (
    // mode="wait" : attend que la page sorte avant de faire entrer la nouvelle
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/valentine" element={<ValentineRequest />} />
        <Route path="/success" element={<ValentineSuccess />} />
        <Route path="/date-ideas" element={<DateIdeas />} />
        <Route path="/open-when" element={<OpenWhen />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/reasons" element={<Reasons />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/wheel" element={<Wheel />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/scratch" element={<ScratchGame />} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
};

// --- APP PRINCIPALE ---
function App() {

  // --- PWA : Enregistrement du service worker pour le mode hors-ligne ---
  useRegisterSW();

  // État de connexion : vérifie le localStorage au chargement
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('princess_access') === 'true';
  });

  // Fonction appelée quand le Login est validé
  const handleLogin = () => {
    localStorage.setItem('princess_access', 'true'); // Sauvegarde le cookie
    setIsAuthenticated(true); // Déclenche l'affichage du site
     // Redirige vers la page d'accueil après login
  };

  return (
    <Router>
      {/* Remonte en haut de page à chaque navigation */}
      <ScrollToTop />
      
      {/* 🎵 LECTEUR MUSIQUE PERSISTANT 🎵 */}
      {/* Il est ici pour ne pas être rechargé quand on change de page */}
      {isAuthenticated && <MusicPlayer />}
      
      {/* Invite d'installation PWA */}
      {isAuthenticated && <InstallPrompt />}
      
      {/* Gestion de l'affichage : Login OU Site */}
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          
          // --- ÉCRAN DE LOGIN ---
          <motion.div 
            key="login"
            exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }} // Animation de sortie vers le haut
            className="fixed inset-0 z-50"
          >
            <Login onLogin={handleLogin} />
          </motion.div>

        ) : (

          // --- LE SITE ---
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }} // Apparition douce
          >
            <AnimatedRoutes setIsAuthenticated={setIsAuthenticated} />
          </motion.div>

        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;