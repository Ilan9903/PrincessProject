import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import { Link } from 'react-router-dom';
import FloatingHearts from '../components/FloatingHearts';

const DateIdeas = () => {
  const [idea, setIdea] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Ta liste d'idées (Tu peux en rajouter autant que tu veux !)
  const ideasPool = [
    // ❤️ ROMANTIQUE (Rose/Rouge)
    { text: "Massage complet par chéri (huile incluse) 💆‍♀️", type: "Romantique", color: "bg-pink-100 text-pink-600" },
    { text: "Bain moussant à deux & Musique douce 🛁", type: "Romantique", color: "bg-pink-100 text-pink-600" },
    { text: "Dîner aux chandelles à la maison 🕯️", type: "Romantique", color: "bg-red-100 text-red-600" },
    { text: "On retourne sur le lieu de notre 1er date 📍", type: "Nostalgie", color: "bg-rose-100 text-rose-600" },
    { text: "Soirée 'Sans téléphone' juste nous deux 📵", type: "Intime", color: "bg-pink-200 text-pink-700" },
    { text: "Petit-déjeuner royal au lit 🥐", type: "Attentionné", color: "bg-red-50 text-red-500" },
    { text: "Regarder le coucher de soleil avec un verre 🌅", type: "Romantique", color: "bg-orange-100 text-orange-600" },
    { text: "Balade nocturne main dans la main 🌙", type: "Romantique", color: "bg-indigo-100 text-indigo-600" },
    { text: "Je t'écris une lettre d'amour (à lire maintenant) 💌", type: "Emotion", color: "bg-red-200 text-red-700" },

    // 🛋️ CHILL & COCOONING (Bleu/Gris)
    { text: "Soirée Netflix & Plaid (Tu choisis le film) 🍿", type: "Chill", color: "bg-blue-100 text-blue-600" },
    { text: "Marathon Harry Potter (ou ta saga préférée) ⚡", type: "Ciné", color: "bg-blue-100 text-blue-600" },
    { text: "On construit une cabane avec des draps dans le salon ⛺", type: "Mignon", color: "bg-indigo-100 text-indigo-600" },
    { text: "Sieste crapuleuse en après-midi 💤", type: "Repos", color: "bg-slate-100 text-slate-600" },
    { text: "Soirée Lecture / Manga côte à côte 📚", type: "Calme", color: "bg-teal-100 text-teal-600" },
    { text: "On regarde nos vieilles photos/vidéos 📸", type: "Souvenirs", color: "bg-gray-100 text-gray-600" },
    { text: "Spa maison : Masques visages et concombres 🥒", type: "Bien-être", color: "bg-cyan-100 text-cyan-600" },

    // 🍔 GOURMAND (Vert/Jaune)
    { text: "Soirée Pizza maison (on fait la pâte !) 🍕", type: "Miam", color: "bg-green-100 text-green-600" },
    { text: "Uber Eats Roulette (on commande au hasard) 🛵", type: "Aventure", color: "bg-green-100 text-green-600" },
    { text: "Concours de crêpes ou gaufres 🥞", type: "Gourmand", color: "bg-yellow-100 text-yellow-600" },
    { text: "Resto Chic Surprise (prépare-toi !) 👗", type: "Sortie", color: "bg-emerald-100 text-emerald-600" },
    { text: "Pique-nique (au salon ou dehors selon météo) 🧺", type: "Mignon", color: "bg-lime-100 text-lime-600" },
    { text: "Atelier Cocktails / Mocktails maison 🍹", type: "Fun", color: "bg-amber-100 text-amber-600" },
    { text: "Fondue au chocolat et fruits 🍓", type: "Péché Mignon", color: "bg-orange-100 text-orange-600" },
    { text: "On va chercher une glace/gaufre en ville 🍦", type: "Balade", color: "bg-yellow-50 text-yellow-500" },

    // 🎲 FUN & ACTIVITÉS (Violet/Orange)
    { text: "Soirée Jeux de société (je te laisse gagner... peut-être) 🎲", type: "Jeu", color: "bg-purple-100 text-purple-600" },
    { text: "Bowling ou Billard 🎳", type: "Compétition", color: "bg-purple-100 text-purple-600" },
    { text: "Karaoké dans le salon (chante mal autorisé) 🎤", type: "Fou rire", color: "bg-fuchsia-100 text-fuchsia-600" },
    { text: "Escape Game (réel ou kit maison) 🕵️‍♀️", type: "Enigme", color: "bg-violet-100 text-violet-600" },
    { text: "Session Mario Kart / Jeux Vidéo 🎮", type: "Geek", color: "bg-red-100 text-red-600" },
    { text: "On fait un Puzzle de 1000 pièces ensemble 🧩", type: "Patience", color: "bg-sky-100 text-sky-600" },
    { text: "Séance photo drôle / grimaces 🤪", type: "Fun", color: "bg-pink-100 text-pink-500" },
    { text: "On peint ou dessine l'un l'autre 🎨", type: "Artiste", color: "bg-rose-100 text-rose-500" },

    // 🌍 AVENTURE & SORTIES (Bleu Foncé/Vert)
    { text: "On prend la voiture et on roule sans but 🚗", type: "Roadtrip", color: "bg-blue-200 text-blue-800" },
    { text: "Cinéma (Popcorn obligatoire) 🎬", type: "Classique", color: "bg-red-100 text-red-800" },
    { text: "Visite d'un musée ou d'une expo 🖼️", type: "Culture", color: "bg-stone-100 text-stone-600" },
    { text: "Zoo ou Aquarium 🐠", type: "Sortie", color: "bg-teal-100 text-teal-700" },
    { text: "Balade en forêt ou parc 🌳", type: "Nature", color: "bg-green-200 text-green-800" },
    { text: "Shopping (je porte les sacs) 🛍️", type: "Cadeau", color: "bg-pink-50 text-pink-600" },
    { text: "On va voir un spectacle / Stand-up 🎭", type: "Rire", color: "bg-purple-200 text-purple-800" },
    
    // 👑 SPÉCIAL PRINCESS (Or/Jaune)
    { text: "Joker : Tu décides de TOUT pendant 2h 👑", type: "Reine", color: "bg-yellow-200 text-yellow-800" },
    { text: "Je te fais un strip-tease rigolo (ou pas) 🕺", type: "Sexy", color: "bg-red-200 text-red-800" },
    { text: "On planifie nos prochaines vacances ✈️", type: "Rêve", color: "bg-sky-200 text-sky-800" },
    { text: "Action ou Vérité (version couple) 😈", type: "Jeu", color: "bg-purple-100 text-purple-700" },
  ];

  const pickIdea = () => {
    if (isAnimating) return; // On empêche de cliquer pendant l'animation
    setIsAnimating(true);
    setIdea(null);

    // Petit effet "Roulette" : ça change de texte rapidement
    let shuffleCount = 0;
    const maxShuffles = 25;
    const interval = setInterval(() => {
      const randomTemp = ideasPool[Math.floor(Math.random() * ideasPool.length)];
      setIdea(randomTemp);
      shuffleCount++;

      if (shuffleCount >= maxShuffles) {
        clearInterval(interval);
        const finalChoice = ideasPool[Math.floor(Math.random() * ideasPool.length)];
        setIdea(finalChoice);
        setIsAnimating(false);
      }
    }, 80);
  };

  return (
    <PageTransition>
    <div className="fixed inset-0 bg-pink-50 flex flex-col items-center justify-center p-6 font-['Playfair_Display']">
      <FloatingHearts />
      
      <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-2xl border border-pink-100 rounded-full hover:shadow-lg">🏠</Link>

      <div className="z-10 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in-up flex items-center justify-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Qu'est-ce qu'on fait ?
            </span>
            <span className="text-gray-800">🤔</span>
        </h1>

        {/* La Carte de Résultat */}
        <div className={`bg-white rounded-3xl shadow-xl p-8 min-h-[200px] flex flex-col items-center justify-center border-4 border-dashed transition-all duration-300 ${isAnimating ? 'border-purple-200 scale-95' : 'border-pink-300 scale-100'}`}>
          
          {!idea ? (
            <p className="text-gray-400 italic">Clique sur le bouton pour lancer la roue !</p>
          ) : (
            <div className="animate-fade-in flex flex-col items-center gap-4">
              <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${idea.color}`}>
                {idea.type}
              </span>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                {idea.text}
              </p>
            </div>
          )}
        </div>

        {/* Le Bouton d'Action */}
        <button 
          onClick={pickIdea}
          disabled={isAnimating}
          className="mt-10 group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden w-full md:w-auto hover:cursor-pointer"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
            {isAnimating ? 'Recherche en cours...' : '🎲 Trouver une idée'}
          </span>
          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
    </div>
    </PageTransition>
  );
};

export default DateIdeas;