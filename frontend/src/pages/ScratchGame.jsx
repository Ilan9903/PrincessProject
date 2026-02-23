import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import PageTransition from '../components/PageTransition';

// --- 📅 CONFIGURATION DES SECRETS ---
// Ajoute autant de couples image/texte que tu veux ici !
const secrets = [
  {
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800", // Chat mignon
    text: "Bon pour un massage ce soir ! ❤️"
  },
  {
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800", // Coeur
    text: "Ce soir, c'est moi qui cuisine ton plat préféré 🍝"
  },
  {
    image: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800", // Fleurs
    text: "Week-end surprise : prépare ta valise ! 🧳"
  },
  {
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800", // Câlin
    text: "Joker : Tu as gagné le droit de choisir le film ce soir 🎬"
  }
];

const ScratchGame = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // --- LOGIQUE DU JOUR ---
  // On utilise useMemo pour que ça ne change pas si le composant se rafraîchit
  const todaysSecret = useMemo(() => {
    const today = new Date();
    // On utilise le jour du mois (1, 2, ..., 31) pour choisir l'index
    // Le modulo (%) permet de boucler : si on est le 5 et qu'il y a 4 secrets, ça prend le n°1.
    const index = today.getDate() % secrets.length;
    return secrets[index];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secrets]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    
    const triggerWin = () => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
    };

    const resizeCanvas = () => {
      if (!container || !canvas) return;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      ctx.fillStyle = '#cbd5e1'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = 'bold 24px "Playfair Display"';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("✨ Gratte ici ! ✨", canvas.width / 2, canvas.height / 2);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const checkProgress = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) transparentPixels++;
      }

      const totalPixels = pixels.length / 4;
      const currentProgress = (transparentPixels / totalPixels) * 100;

      if (currentProgress > 40) {
        canvas.style.transition = 'opacity 1s ease-out';
        canvas.style.opacity = '0'; 
        setIsRevealed(true);
        triggerWin();
      }
    };

    const scratch = (x, y) => {
      if (canvas.style.opacity === '0') return;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      
      const brushSize = window.innerWidth > 768 ? 40 : 30;
      
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
      
      checkProgress();
    };

    let isDrawing = false;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDraw = (e) => { isDrawing = true; const {x,y} = getPos(e); scratch(x,y); };
    const moveDraw = (e) => { if (isDrawing) { e.preventDefault(); const {x,y} = getPos(e); scratch(x,y); } };
    const endDraw = () => { isDrawing = false; };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', moveDraw);
    canvas.addEventListener('touchend', endDraw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('mousedown', startDraw);
        canvas.removeEventListener('mousemove', moveDraw);
        canvas.removeEventListener('mouseup', endDraw);
        canvas.removeEventListener('touchstart', startDraw);
        canvas.removeEventListener('touchmove', moveDraw);
        canvas.removeEventListener('touchend', endDraw);
      }
    };
  }, []); 

  return (
    <PageTransition>
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 font-['Playfair_Display'] overflow-hidden relative">
        
        <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-pink-500 z-50 text-2xl bg-white/50 p-2 rounded-full backdrop-blur-sm">
          🏠
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2 z-10">Secret du Jour</h1>
        <p className="text-gray-500 mb-8 z-10">Gratte la carte pour découvrir ta surprise...</p>

        {/* --- ZONE DE JEU --- */}
        <div className="relative w-full max-w-sm aspect-4/5 rounded-3xl shadow-2xl overflow-hidden border-8 border-white bg-white">
          
          {/* COUCHE DU DESSOUS (LE SECRET DU JOUR) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-pink-100 p-6 text-center">
            
            {/* Image secrète DYNAMIQUE */}
            <motion.img 
              initial={{ scale: 0.8 }}
              animate={isRevealed ? { scale: 1 } : {}}
              src={todaysSecret.image}  // <--- On utilise todaysSecret ici
              alt="Secret" 
              className="w-full h-64 object-cover rounded-xl shadow-md mb-6"
            />
            
            {/* Texte secret DYNAMIQUE */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
            >
                <h2 className="text-2xl font-bold text-pink-600">{todaysSecret.text}</h2>
                <p className="text-xs text-gray-400 mt-2">(Reviens demain pour un autre ! 📅)</p>
            </motion.div>
          </div>

          <div ref={containerRef} className="absolute inset-0 z-20 cursor-crosshair">
            <canvas 
                ref={canvasRef} 
                className={`w-full h-full touch-none ${isRevealed ? 'pointer-events-none' : ''}`} 
            />
          </div>

        </div>

        {isRevealed && (
            <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => window.location.reload()}
                className="mt-8 px-6 py-2 bg-white text-pink-500 rounded-full font-bold shadow-md text-sm hover:bg-pink-50 transition-colors z-30 hover:cursor-pointer"
            >
                🔄 Revoir le secret
            </motion.button>
        )}

      </div>
    </PageTransition>
  );
};

export default ScratchGame;