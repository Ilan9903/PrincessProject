import React, { useMemo } from 'react';

const FloatingHearts = () => {
  const emojis = ['❤️', '💋', '💌', '🌹', '💍', '🎀', '💖', '💗', '🥰', '💞', '✨', '👑'];

  // On utilise useMemo pour fixer les valeurs aléatoires au montage du composant
  const heartsData = useMemo(() => {
    // Génération des données brute de manière isolée
    return Array.from({ length: 24 }).map((_, i) => {
      const randomEmojiIndex = Math.floor(Math.random() * emojis.length);
      const randomLeft = Math.random() * 100;
      const randomTop = Math.random() * 110;
      const randomSize = Math.random() * (25 - 12) + 12;
      const randomDelay = Math.random() * 10;
      const randomDuration = Math.random() * (20 - 12) + 12;
      const randomOpacity = Math.random() * (0.5 - 0.2) + 0.2;

      return {
        id: i,
        emoji: emojis[randomEmojiIndex],
        left: `${randomLeft}%`,
        top: `${randomTop}%`,
        fontSize: `${randomSize}px`,
        animationDelay: `${randomDelay}s`,
        animationDuration: `${randomDuration}s`,
        opacity: randomOpacity,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] assure que ce n'est calculé qu'une seule fois

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {heartsData.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float"
          style={{
            left: heart.left,
            top: heart.top,
            fontSize: heart.fontSize,
            animationDelay: heart.animationDelay,
            animationDuration: heart.animationDuration,
            opacity: heart.opacity,
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;