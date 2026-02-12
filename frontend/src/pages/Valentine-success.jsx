import { useLocation, Navigate, Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import FloatingHearts from '../components/FloatingHearts';

const IMG_YES = "https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif";

const ValentineSuccess = () => {
  const location = useLocation();
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!location.state?.fromValentine) return <Navigate to="/valentine" replace />;

  return (
    <>
      <head>
    <title>She said YES!</title>
    </head>
    <div className="fixed inset-0 bg-red-50 flex flex-col items-center justify-center p-4 text-center overflow-hidden font-['Playfair_Display']">
      <Confetti width={size.width} height={size.height} />
      <FloatingHearts />
      <div className="z-10 flex flex-col items-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-8 animate-bounce py-4">YAAAAAY ! 🎉</h1>
        <img src={IMG_YES} alt="Happy cat" className="rounded-xl shadow-2xl mb-8 w-64 md:w-80" />
        <div className="bg-white/90 p-6 rounded-2xl shadow-sm backdrop-blur-sm max-w-sm mb-8 font-serif">
          <p className="text-lg text-gray-800 font-semibold mb-2">Tu es coincée avec moi !</p>
          <p className="text-sm text-gray-500 italic">(Rendez-vous le 14 Février ❤️)</p>
        </div>
            <Link to="/" className="group relative block bg-white/50 border border-pink-100 font-bold py-2 px-6 rounded-full hover:bg-white transition-colors font-sans overflow-hidden active:scale-95 transition-all duration-300 hover:border-red-300 hover:shadow-xl hover:shadow-red-200/40 text-gray-800 hover:text-red-600">← Acceuil</Link>      
        </div>
    </div>
    </>
  );
};

export default ValentineSuccess;