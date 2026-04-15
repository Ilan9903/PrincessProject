import { useLocation, Navigate, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import FloatingHearts from '../components/FloatingHearts';

const IMG_YES = "https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif";

const ValentineSuccess = () => {
  const location = useLocation();
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    document.title = 'She said YES! 💕';
  }, []);

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!location.state?.fromValentine) return <Navigate to="/valentine" replace />;

  return (
    <PageTransition>
    <div className="fixed inset-0 bg-red-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 text-center overflow-hidden font-['Playfair_Display'] transition-colors">
      <Confetti width={size.width} height={size.height} />
      <FloatingHearts />
      <div className="z-10 flex flex-col items-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold text-red-600 dark:text-red-400 mb-8 animate-bounce py-4">YAAAAAY ! 🎉</h1>
        <img src={IMG_YES} alt="Happy cat" className="rounded-xl shadow-2xl mb-8 w-64 md:w-80" />
        <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-2xl shadow-sm backdrop-blur-sm max-w-sm mb-8 font-serif transition-colors">
          <p className="text-lg text-gray-800 dark:text-gray-100 font-semibold mb-2">Tu es coincée avec moi !</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">(Rendez-vous le 14 Février ❤️)</p>
        </div>
            <Link to="/" className="group relative block bg-white/50 dark:bg-gray-800/50 border border-pink-100 dark:border-gray-700 font-bold py-2 px-6 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors font-sans overflow-hidden active:scale-95 duration-300 hover:border-red-300 dark:hover:border-red-500 hover:shadow-xl hover:shadow-red-200/40 text-gray-800 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400">← Accueil</Link>      
        </div>
    </div>
    </PageTransition>
  );
};

export default ValentineSuccess;