import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import axios from 'axios';
import FloatingHearts from '../components/FloatingHearts';

const API_URL = 'http://localhost:2106/api/valentine-response';
const IMG_ASK = "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHRxeDhpc2h3aWg0OXUybHJ2em95N2d0aHNiMHZydHpueGIweml6ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Zl7u48zLVFgLpRwq6f/giphy.gif";

const ValentineRequest = () => {
  const navigate = useNavigate();
  const [noBtnStyle, setNoBtnStyle] = useState({ position: 'static' }); 
  const [yesSize, setYesSize] = useState(1);

  const moveNoButton = () => {
    setYesSize((prev) => prev + 0.5);
    const btnW = 150; const btnH = 60;
    const yesBtn = document.getElementById('yes-btn');
    const yesRect = yesBtn ? yesBtn.getBoundingClientRect() : { top: 0, left: 0, width: 0, height: 0 };
    const maxWidth = window.innerWidth - btnW - 20; 
    const maxHeight = window.innerHeight - btnH - 20;

    let newX, newY, isOverlapping = true, safety = 0;
    while (isOverlapping && safety < 50) {
      newX = Math.random() * maxWidth; newY = Math.random() * maxHeight;
      const padding = 50;
      if (newX + btnW < yesRect.left - padding || newX > yesRect.right + padding || newY + btnH < yesRect.top - padding || newY > yesRect.bottom + padding) {
        isOverlapping = false;
      }
      safety++;
    }
    setNoBtnStyle({ position: 'fixed', left: `${newX}px`, top: `${newY}px`, transition: 'all 0.2s ease', zIndex: 50 });
  };

  const handleYes = async () => {
    try { await axios.post(API_URL, { answer: 'OUI', timestamp: new Date() }); } catch (error) {
      error// Silently ignore API errors and proceed to success page
    }
    navigate('/success', { state: { fromValentine: true } });
  };

  return (
    <>
      <head>
    <title>Valentine</title>
    </head>
    <PageTransition>
    <div className="fixed inset-0 bg-pink-100 flex flex-col items-center justify-center overflow-hidden font-['Playfair_Display']">
      <FloatingHearts />
      <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-2xl border border-pink-100 rounded-full hover:shadow-lg">🏠</Link>
      <div className="flex flex-col items-center justify-center w-full px-4 text-center z-10">
        <img src={IMG_ASK} alt="Rose cat" className="rounded-2xl shadow-xl mb-8 w-64 md:w-80 object-cover" />
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-12 leading-relaxed">Veux-tu être ma Valentine ? 🌹</h1>
        <div className="flex justify-center items-center gap-8 h-20 w-full font-sans">
          <button id="yes-btn" onClick={handleYes} style={{ transform: `scale(${yesSize})`, transition: 'transform 0.2s ease' }} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg z-20 whitespace-nowrap hover:cursor-pointer hover:shadow-pink-50 active:scale-95">OUI 😍</button>
          <button onMouseEnter={moveNoButton} onTouchStart={moveNoButton} onClick={moveNoButton} style={noBtnStyle} className="bg-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg z-30">NON 😢</button>
        </div>
      </div>
    </div>
    </PageTransition>
    </>
  );
};

export default ValentineRequest;