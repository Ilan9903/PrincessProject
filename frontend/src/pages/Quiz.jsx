import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import FloatingHearts from '../components/FloatingHearts';
import PageTransition from '../components/PageTransition';
import { authenticatedFetch } from '../Utils/api';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Charger les questions depuis l'API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await authenticatedFetch('/api/quiz/questions');
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
          setTotalQuestions(data.length);
        }
      } catch (error) {
        console.error('Erreur chargement questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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

  const handleAnswer = async (selectedAnswer) => {
    const currentQ = questions[currentQuestion];
    
    try {
      // Soumettre la réponse à l'API
      const response = await authenticatedFetch('/api/quiz/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQ.id,
          selectedAnswer
        })
      });
      
      const data = await response.json();
      const isCorrect = data.isCorrect;
      
      if (isCorrect) {
        setScore(score + 1);
        
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
    } catch (error) {
      console.error('Erreur soumission réponse:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center">
          <div className="text-6xl animate-bounce">❓</div>
          <p className="mt-4 text-gray-600 font-['Playfair_Display']">Chargement des questions...</p>
        </div>
      </PageTransition>
    );
  }

  if (questions.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-gray-600 font-['Playfair_Display']">Aucune question disponible</p>
          <Link to="/" className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-full">Retour</Link>
        </div>
      </PageTransition>
    );
  }

return (
    <PageTransition>
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 font-['Playfair_Display'] relative overflow-hidden transition-colors">
        <FloatingHearts />

        <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-2xl border border-pink-100 dark:border-gray-700 rounded-full hover:shadow-lg bg-white dark:bg-gray-800 transition-colors">🏠</Link>

        {/* --- ÉCRAN DE JEU --- */}
        {!isFinished ? (
          <div className="w-full max-w-md z-10">
            
            {/* CORRECTION ICI : Le fond de la barre est maintenant bg-pink-200 (au lieu de white) */}
            <div className="w-full bg-pink-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
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
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl px-6 pb-8 pt-10 border-2 border-pink-100 dark:border-gray-700 text-center mb-6 relative transition-colors">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-pink-200 dark:border-pink-700">
                    Question {currentQuestion + 1}/{questions.length}
                  </span>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
                    {questions[currentQuestion].question}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="p-4 bg-white dark:bg-gray-700 rounded-xl border-2 border-pink-50 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-gray-600 transition-all text-left text-gray-700 dark:text-gray-200 font-medium shadow-sm active:scale-95 hover:cursor-pointer"
                    >
                      {option}
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
            className="text-center z-10 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-pink-200 dark:border-pink-700 max-w-sm transition-colors"
          >
            <div className="text-6xl mb-4">{score === totalQuestions ? '🏆' : score >= totalQuestions * 0.7 ? '🎉' : '💪'}</div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-600 mb-4">
              {score === totalQuestions ? '100% Correct !' : `${score}/${totalQuestions} Correct !`}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {score === totalQuestions 
                ? "Bravo mon amour, tu me connais vraiment par cœur. Je t'aime ! ❤️" 
                : score >= totalQuestions * 0.7
                ? "Pas mal ! Tu me connais bien, mais il y a encore quelques secrets... 😘"
                : "On dirait que quelqu'un a besoin de passer plus de temps avec moi ! 😉"}
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                to="/coupons" 
                className="inline-block px-8 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all"
              >
                Réclamer ma récompense 🎁
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-white dark:bg-gray-700 border-2 border-pink-300 dark:border-pink-600 text-pink-600 dark:text-pink-400 rounded-full font-bold hover:bg-pink-50 dark:hover:bg-gray-600 transition-all"
              >
                Recommencer 🔄
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default Quiz;