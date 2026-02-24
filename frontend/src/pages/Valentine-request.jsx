import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { authenticatedFetch } from '../Utils/api';
import FloatingHearts from '../components/FloatingHearts';
import ThemeToggle from '../components/ThemeToggle';

const IMG_ASK = "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHRxeDhpc2h3aWg0OXUybHJ2em95N2d0aHNiMHZydHpueGIweml6ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Zl7u48zLVFgLpRwq6f/giphy.gif";

const ValentineRequest = () => {
  const navigate = useNavigate();
  const [noBtnStyle, setNoBtnStyle] = useState({ position: 'static' }); 
  const [yesSize, setYesSize] = useState(1);

  useEffect(() => {
    document.title = 'Valentine ❤️';
  }, []);

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
    try {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      await authenticatedFetch('/api/valentine', {
        method: 'POST',
        body: JSON.stringify({ 
          title: 'Tu es coincée avec moi !',
          description: '(Rendez-vous le 14 Février ❤️)',
          date: dateStr,
          imageUrl: IMG_ASK
        })
      });
    } catch {
      // Silently ignore API errors and proceed to success page
    }
    navigate('/success', { state: { fromValentine: true } });
  };

  return (
    <PageTransition>
    <div className="fixed inset-0 bg-pink-100 dark:bg-gray-900 flex flex-col items-center justify-center overflow-hidden font-['Playfair_Display'] transition-colors">
      <FloatingHearts />
      <ThemeToggle />
      <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-lg border border-pink-100 dark:border-gray-700 rounded-full hover:shadow-md bg-white dark:bg-gray-800 transition-colors">🏠</Link>
      <div className="flex flex-col items-center justify-center w-full px-4 text-center z-10">
        <img src={IMG_ASK} alt="Rose cat" className="rounded-2xl shadow-lg mb-8 w-64 md:w-80 object-cover" />
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 dark:text-red-400 mb-12 leading-relaxed">Veux-tu être ma Valentine ? 🌹</h1>
        <div className="flex justify-center items-center gap-8 h-20 w-full font-sans">
          <button id="yes-btn" onClick={handleYes} style={{ transform: `scale(${yesSize})`, transition: 'transform 0.2s ease' }} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg z-20 whitespace-nowrap hover:cursor-pointer hover:shadow-pink-50 active:scale-95">OUI 😍</button>
          <button onMouseEnter={moveNoButton} onTouchStart={moveNoButton} onClick={moveNoButton} style={noBtnStyle} className="bg-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg z-30">NON 😢</button>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default ValentineRequest;