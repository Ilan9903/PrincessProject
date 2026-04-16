import React, { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [dismissed, setDismissed] = useState(false);

  const { isStandalone, platform } = useMemo(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone;

    let detectedPlatform = '';
    if (!standalone) {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        detectedPlatform = 'ios';
      } else if (/android/.test(userAgent)) {
        detectedPlatform = 'android';
      }
    }

    return { isStandalone: standalone, platform: detectedPlatform };
  }, []);

  const showPrompt = !dismissed && !isStandalone && platform !== '';

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-4 right-4 z-100 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-pink-200 dark:border-gray-700 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="text-3xl">📱</div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm">Installer l'application</h4>
            <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 leading-relaxed">
              {platform === 'ios' ? (
                <>Appuie sur <span className="inline-block bg-gray-100 dark:bg-gray-700 p-1 rounded">share</span> puis sur <b>"Sur l'écran d'accueil"</b> pour l'avoir comme une vraie app !</>
              ) : (
                <>Appuie sur les <b>3 petits points</b> puis sur <b>"Installer l'application"</b>.</>
              )}
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fermer la notification d'installation"
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-bold px-2 transition-colors"
          >
            ✕
          </button>
        </div>
        {platform === 'ios' && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-b-2 border-r-2 border-pink-200 dark:border-gray-700 rotate-45 transition-colors"></div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;