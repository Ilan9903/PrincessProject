import React from 'react';
import HomeButton from '../components/HomeButton';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';

const OurStory = () => {
  // --- VOS SOUVENIRS (À PERSONNALISER ICI) ---
  const memories = [
    {
      date: "18 Juin 2022",
      title: "Le Premier Regard 👀",
      description: "Le jour où tout a commencé. Je ne savais pas encore que tu allais changer ma vie, mais j'ai tout de suite su que tu étais spéciale.",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" // Rencontre
    },
    {
      date: "21 Juin 2022",
      title: "Première Rencontre & Bisou 💋",
      description: "Un moment magique, un peu timide mais tellement parfait. C'est là que notre histoire est devenue officielle.",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" // Bisous
    },
    {
      date: "14 Février 2023",
      title: "Notre Première St Valentin 🌹",
      description: "Resto, cadeaux, et surtout beaucoup d'amour. Un souvenir gravé.",
      image: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" // Main dans la main
    },
    {
      date: "Août 2023",
      title: "Nos Premières Vacances ✈️",
      description: "Découvrir le monde avec toi, c'est ma nouvelle passion préférée. On a bien ri (et un peu galéré avec les valises).",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" // Voyage
    },
    {
      date: "Aujourd'hui",
      title: "Toujours nous ❤️",
      description: "Chaque jour passé avec toi est un cadeau. Et le meilleur reste à venir...",
      image: "https://images.unsplash.com/photo-1621112904887-419379ce6824?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" // Couple heureux
    }
  ];

  return (
    <PageTransition>
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900 font-['Playfair_Display'] overflow-x-hidden transition-colors">
      <FloatingHearts />
      
      {/* Bouton Retour */}
      <HomeButton />

      <div className="container mx-auto px-4 py-12 relative z-10 max-w-2xl">
        
        {/* En-tête */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-600 mb-4 py-2">
            Notre Histoire
          </h1>
          <p className="text-gray-500 dark:text-gray-400 italic">Chaque étape à tes côtés est mon moment préféré.</p>
        </div>

        {/* La Timeline */}
        <div className="relative">
          {/* La Ligne Verticale Centrale */}
          <div className="absolute left-4 md:left-1/2 h-full w-1 bg-linear-to-b from-pink-200 via-pink-300 to-pink-200 rounded-full transform md:-translate-x-1/2"></div>

          {/* Les Événements */}
          <div className="flex flex-col gap-12">
            {memories.map((memory, index) => (
              <div key={index} className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Le Point sur la ligne */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-pink-500 border-4 border-white rounded-full shadow-md transform -translate-x-1.5 md:-translate-x-1/2 z-20"></div>

                {/* Espace vide pour l'alternance Desktop */}
                <div className="hidden md:block w-5/12"></div>

                {/* La Carte Souvenir */}
                <div className="ml-12 md:ml-0 w-full md:w-5/12 group">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border-2 border-pink-50 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    
                    {/* Date */}
                    <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 text-xs font-bold rounded-full mb-3">
                      {memory.date}
                    </span>

                    {/* Image */}
                    <div className="rounded-xl overflow-hidden h-40 mb-4 relative">
                      <img 
                        src={memory.image} 
                        alt={memory.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
                    </div>

                    {/* Contenu */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{memory.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-sans">
                      {memory.description}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Fin de timeline */}
          <div className="text-center mt-12 pb-8">
            <span className="inline-block px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-pink-400 dark:text-pink-500 text-sm shadow-sm border border-pink-100 dark:border-gray-700">
              À suivre... ✨
            </span>
          </div>

        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default OurStory;