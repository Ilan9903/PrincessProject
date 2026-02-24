import React, { useState, useEffect, useMemo } from 'react';

const RelationshipCounter = () => {
  // --- CONFIGURATION ---
  // Date de début de la relation (année, mois-1, jour, heure, minute)
  const startDate = useMemo(() => new Date(2022, 5, 21, 11, 0), []); 

  const emojis = ['💋', '❤️', '🥰', '🌹', '💌', '👑', '💍'];

  const [mode, setMode] = useState(0); 
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date();
      const diffInMs = now.getTime() - startDate.getTime();

      const sec = 1000, min = sec * 60, hour = min * 60, day = hour * 24;
      const week = day * 7, month = day * 30.44, year = day * 365.25;

      switch (mode) {
        case 0: setValue(Math.floor(diffInMs / sec).toLocaleString()); setLabel("secondes"); break;
        case 1: setValue(Math.floor(diffInMs / min).toLocaleString()); setLabel("minutes"); break;
        case 2: setValue(Math.floor(diffInMs / hour).toLocaleString()); setLabel("heures"); break;
        case 3: setValue(Math.floor(diffInMs / day).toLocaleString()); setLabel("jours"); break;
        case 4: setValue((diffInMs / week).toFixed(1)); setLabel("semaines"); break;
        case 5: setValue((diffInMs / month).toFixed(1)); setLabel("mois"); break;
        case 6: setValue((diffInMs / year).toFixed(2)); setLabel("années"); break;
        case 7: setValue(Math.floor((diffInMs / min) * 75).toLocaleString()); setLabel("battements de cœur"); break;
        default: setMode(0);
      }
    };

    updateCounter();
    const timer = setInterval(updateCounter, 1000);
    return () => clearInterval(timer);
  }, [mode, startDate]);

  useEffect(() => {
    const modeTimer = setInterval(() => {
      setMode((prev) => (prev + 1) % 8);
    }, 6000);
    return () => clearInterval(modeTimer);
  }, []);

  return (
    <div className="h-24 flex flex-col items-center justify-center">
      <p key={mode} className="text-gray-500 dark:text-gray-400 italic font-serif text-sm md:text-base animate-smooth text-center px-2 leading-tight transition-colors">
        <span className="block mb-1 opacity-80">Ensemble depuis</span>
        <span className="whitespace-nowrap flex items-center justify-center gap-2">
          <span className="text-pink-500 dark:text-pink-400 font-bold tracking-wider text-xl md:text-2xl transition-all">
            {value}
          </span>
          <span className="text-gray-500 dark:text-gray-400 transition-colors">{label} {emojis[mode]}</span>
        </span>
      </p>
    </div>
  );
};

export default RelationshipCounter;