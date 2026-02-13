import React, { useState, useRef, useEffect } from 'react'; // Là, on va s'en servir !
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Assure-toi que le chemin est bon vers ton fichier MP3
import songFile from '../assets/song.mp3';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // 👇 AJOUT : On utilise useEffect pour régler le volume au démarrage
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Règle le volume à 50% (0.5)
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[90]">
      
      <audio ref={audioRef} src={songFile} loop />

      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`relative w-14 h-14 flex items-center justify-center rounded-full shadow-xl border-4 border-white transition-all duration-500 ${isPlaying ? 'bg-pink-500' : 'bg-gray-800'}`}
      >
        <span className="text-2xl text-white z-10">
          {isPlaying ? '⏸️' : '🎵'}
        </span>

        {isPlaying && (
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/50"
            />
        )}
        
        {isPlaying && (
             <div className="absolute -inset-2 bg-pink-500/30 rounded-full animate-ping"></div>
        )}
      </motion.button>
    </div>
  );
};

export default MusicPlayer;