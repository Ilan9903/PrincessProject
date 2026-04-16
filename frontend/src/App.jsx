import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react'; // <--- Import pour la PWA
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { isAuthenticated } from './Utils/api';

// --- COMPOSANTS (chargés immédiatement) ---
import ScrollToTop from './components/ScrollToTop';
import MusicPlayer from './components/MusicPlayer';
import InstallPrompt from './components/InstallPrompt';
import ThemeToggle from './components/ThemeToggle';
import ErrorBoundary from './components/ErrorBoundary';

// --- PAGES (lazy loading → code splitting automatique) ---
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const ValentineRequest = lazy(() => import('./pages/Valentine-request'));
const ValentineSuccess = lazy(() => import('./pages/Valentine-success'));
const DateIdeas = lazy(() => import('./pages/DateIdeas'));
const OpenWhen = lazy(() => import('./pages/OpenWhen'));
const OurStory = lazy(() => import('./pages/OurStory'));
const Reasons = lazy(() => import('./pages/Reasons'));
const Coupons = lazy(() => import('./pages/Coupons'));
const Wheel = lazy(() => import('./pages/Wheel'));
const Quiz = lazy(() => import('./pages/Quiz'));
const ScratchGame = lazy(() => import('./pages/ScratchGame'));
const Playlist = lazy(() => import('./pages/Playlist'));

// --- Fallback de chargement ---
const PageLoader = () => (
  <div className="fixed inset-0 bg-linear-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 mx-auto mb-3"></div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Chargement...</p>
    </div>
  </div>
);

// --- GESTION DES ROUTES ANIMÉES ---
// Ce composant s'occupe de gérer les transitions entre pages
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    // mode="wait" : attend que la page sorte avant de faire entrer la nouvelle
    <AnimatePresence mode="wait">
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </ErrorBoundary>
    </AnimatePresence>
  );
};

// --- APP PRINCIPALE ---
function App() {

  // --- PWA : Enregistrement du service worker pour le mode hors-ligne ---
  useRegisterSW();

  // État de connexion + infos utilisateur
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedAuth = useRef(false);

  // Vérifier la validité du token au chargement initial
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkTokenValidity = async () => {
      const result = await isAuthenticated();
      setIsAuth(result.authenticated);
      setUser(result.user);
      setIsLoading(false);
    };
    
    checkTokenValidity();
  }, []);

  // Fonction appelée quand le Login est validé
  const handleLogin = (userData) => {
    setIsAuth(true);
    setUser(userData || null);
  };

  return (
    <Router>
      {/* Remonte en haut de page à chaque navigation */}
      <ScrollToTop />
      
      {/* � TOGGLE DARK MODE 🌙 */}
      {isAuth && <ThemeToggle />}
      
      {/* �🎵 LECTEUR MUSIQUE PERSISTANT 🎵 */}
      {/* Il est ici pour ne pas être rechargé quand on change de page */}
      {isAuth && <MusicPlayer />}
      
      {/* Invite d'installation PWA */}
      {isAuth && <InstallPrompt />}
      
      {/* Loading screen pendant la vérification du token */}
      {isLoading ? (
        <div className="fixed inset-0 bg-linear-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
          </div>
        </div>
      ) : (
        // Gestion de l'affichage : Login OU Site
        <AnimatePresence mode="wait">
          {!isAuth ? (
            
            // --- ÉCRAN DE LOGIN ---
            <Suspense fallback={<PageLoader />}>
              <motion.div 
                key="login"
                exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
                className="fixed inset-0 z-50"
              >
                <Login onLogin={handleLogin} />
              </motion.div>
            </Suspense>

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
      )}
    </Router>
  );
}

export default App;