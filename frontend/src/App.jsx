import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react'; // <--- Import pour la PWA
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { isAuthenticated, verifyToken } from './Utils/api';

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
import Playlist from './pages/Playlist';

// --- GESTION DES ROUTES ANIMÉES ---
// Ce composant s'occupe de gérer les transitions entre pages
const AnimatedRoutes = () => {
  const location = useLocation();

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
        <Route path="/playlist" element={<Playlist />} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
};

// --- APP PRINCIPALE ---
function App() {

  // --- PWA : Enregistrement du service worker pour le mode hors-ligne ---
  useRegisterSW();

  // État de connexion : vérifie le JWT au chargement
  const [isAuth, setIsAuth] = useState(() => {
    return isAuthenticated();
  });

  // Vérifier la validité du token au chargement initial
  useEffect(() => {
    const checkTokenValidity = async () => {
      // Seulement si on pense être authentifié
      if (isAuth) {
        const isValid = await verifyToken();
        if (!isValid) {
          // Token invalide/expiré, déconnecter
          setIsAuth(false);
        }
      }
    };
    
    checkTokenValidity();
  }, []); // Seulement au montage initial

  // Fonction appelée quand le Login est validé
  const handleLogin = () => {
    setIsAuth(true); // Déclenche l'affichage du site
  };

  return (
    <Router>
      {/* Remonte en haut de page à chaque navigation */}
      <ScrollToTop />
      
      {/* 🎵 LECTEUR MUSIQUE PERSISTANT 🎵 */}
      {/* Il est ici pour ne pas être rechargé quand on change de page */}
      {isAuth && <MusicPlayer />}
      
      {/* Invite d'installation PWA */}
      {isAuth && <InstallPrompt />}
      
      {/* Gestion de l'affichage : Login OU Site */}
      <AnimatePresence mode="wait">
        {!isAuth ? (
          
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
            <AnimatedRoutes />
          </motion.div>

        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;