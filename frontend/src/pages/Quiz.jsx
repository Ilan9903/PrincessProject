import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import FloatingHearts from '../components/FloatingHearts';
import PageTransition from '../components/PageTransition';

const Quiz = () => {
  // --- TES QUESTIONS ---
  const questions = [
    {
      id: 1,
      question: "Où nous sommes-nous embrassés pour la première fois ?",
      options: [
        { text: "Dans ta voiture", isCorrect: false },
        { text: "Au cinéma", isCorrect: false },
        { text: "Sur un banc au parc", isCorrect: true },
        { text: "On s'est embrassé ?!", isCorrect: false },
      ],
    },
    {
      id: 2,
      question: "Quel est mon plat préféré que tu cuisines ?",
      options: [
        { text: "Les pâtes carbo", isCorrect: true },
        { text: "La quiche lorraine", isCorrect: false },
        { text: "Les sushis maison", isCorrect: false },
        { text: "Rien, je commande UberEats", isCorrect: false },
      ],
    },
    {
      id: 3,
      question: "Quelle est la date exacte de notre rencontre ?",
      options: [
        { text: "14 Février", isCorrect: false },
        { text: "12 Octobre", isCorrect: true },
        { text: "13 Octobre", isCorrect: false },
        { text: "Je demande à mon avocat", isCorrect: false },
      ],
    },
    {
      id: 4,
      question: "Si on gagnait au loto, on partirait où ?",
      options: [
        { text: "Aux Maldives", isCorrect: false },
        { text: "Au Japon", isCorrect: true },
        { text: "Dans la Creuse", isCorrect: false },
        { text: "À New York", isCorrect: false },
      ],
    },
    {
      id: 5,
      question: "Qui a dit 'Je t'aime' en premier ?",
      options: [
        { text: "C'est toi !", isCorrect: true },
        { text: "C'est moi (évidemment)", isCorrect: false },
        { text: "En même temps", isCorrect: false },
        { text: "Le chien", isCorrect: false },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isFinished) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isFinished]);

const handleAnswer = (isCorrect) => {
  if (isCorrect) {
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      setIsFinished(true);
    }
  } else {
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  }
};

return (
    <PageTransition>
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 font-['Playfair_Display'] relative overflow-hidden">
        <FloatingHearts />

        <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-2xl border border-pink-100 rounded-full hover:shadow-lg">🏠</Link>

        {/* --- ÉCRAN DE JEU --- */}
        {!isFinished ? (
          <div className="w-full max-w-md z-10">
            
            {/* CORRECTION ICI : Le fond de la barre est maintenant bg-pink-200 (au lieu de white) */}
            <div className="w-full bg-pink-200 rounded-full h-2.5 mb-8">
              <div 
                className="bg-linear-to-r from-pink-400 to-rose-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
              ></div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* J'ai aussi ajusté le padding ici (pt-10) pour laisser de la place au badge */}
                <div className="bg-white rounded-3xl shadow-xl px-6 pb-8 pt-10 border-2 border-pink-100 text-center mb-6 relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-pink-200">
                    Question {currentQuestion + 1}/{questions.length}
                  </span>
                  <h2 className="text-xl font-bold text-gray-800 leading-relaxed">
                    {questions[currentQuestion].question}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option.isCorrect)}
                      className="p-4 bg-white rounded-xl border-2 border-pink-50 hover:border-pink-300 hover:bg-pink-50 transition-all text-left text-gray-700 font-medium shadow-sm active:scale-95 hover:cursor-pointer"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {showError && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="fixed bottom-10 left-0 right-0 mx-auto w-max px-6 py-3 bg-red-500 text-white rounded-full shadow-lg font-bold z-50 flex items-center gap-2"
                >
                  <span>🙅‍♀️</span> Aïe ! Tu dors sur le canapé ce soir !
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* --- ÉCRAN DE FIN --- */
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-center z-10 p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-pink-200 max-w-sm"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-600 mb-4">
              100% Correct !
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Bravo mon amour, tu me connais vraiment par cœur. Je t'aime ! ❤️
            </p>
            <Link 
              to="/coupons" 
              className="inline-block px-8 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all"
            >
              Réclamer ma récompense 🎁
            </Link>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default Quiz;