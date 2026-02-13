import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';
import RelationshipCounter from '../components/RelationshipCounter';
import babawa from '../assets/profile.jpg';

const handleLogout = () => {
  localStorage.setItem('princess_access', 'false');
  window.location.href = '/login';
};

const Home = () => {
  return (
    <PageTransition>
      {/* CONTENEUR PRINCIPAL : Bloqué à la hauteur de l'écran (100dvh) */}
      <div className="h-[100dvh] w-full bg-pink-50 flex flex-col items-center justify-between overflow-hidden relative font-['Playfair_Display']">
        
        <FloatingHearts />

        {/* Bouton de Déconnexion */}
        <button 
          onClick={handleLogout} 
          className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-xl border border-pink-100 rounded-full hover:shadow-lg bg-white/50 backdrop-blur-sm transition-all"
        >
          🔒
        </button>
        
        {/* --- 1. EN-TÊTE (Titre + Photo) --- */}
        {/* flex-shrink-0 : Empêche cette partie d'être écrasée */}
        <div className="flex flex-col items-center justify-center w-full max-w-md px-6 z-10 flex-shrink-0 mt-4">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 mb-2 drop-shadow-sm py-2 font-['Playfair_Display'] leading-none">
              Princess<br />Project
            </h1>
            
            <div className="flex items-center justify-center gap-4 mt-4 mb-2">
                <p className="text-lg text-gray-600 italic font-serif">for my wife</p>
                <div className="relative group cursor-default">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-pink-400 to-yellow-300 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
                    <img
                      src={babawa}
                      alt="Ma princesse" 
                      className="relative w-16 h-16 rounded-full object-cover border-[3px] border-white shadow-sm z-10 transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            </div>
          </div>
        </div>

        {/* --- 2. ZONE SCROLLABLE DES BOUTONS --- */}
        {/* flex-grow : Prend tout l'espace libre au milieu */}
        <div className="w-full flex-grow flex flex-col justify-center overflow-hidden px-4 py-2 z-10 max-w-md">
            
            {/* La liste scrollable elle-même */}
            <div className="w-full max-h-full overflow-y-auto px-2 py-4
                scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent scroll-smooth
                [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]
                webkit-[mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]"
            >
          
              <div className="grid grid-cols-1 gap-4 w-full font-serif">
                
                {/* 1. Bouton Valentine */}
                <Link to="/valentine" className="group relative block p-4 bg-white rounded-2xl border-2 border-pink-100 transition-all duration-300 hover:border-red-300 hover:shadow-xl hover:shadow-red-200/40 hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-red-50 p-3 rounded-xl text-2xl group-hover:rotate-6 transition-transform duration-300 group-hover:scale-110">💌</div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">La Demande</h2>
                      <p className="text-gray-500 text-xs group-hover:text-red-400">Question très importante...</p>
                    </div>
                    <div className="absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-red-400">→</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 z-0"></div>
                </Link>

                {/* 2. Bouton Idée de Date */}
                <Link to="/date-ideas" className="group relative block p-4 bg-white rounded-2xl border-2 border-purple-100 transition-all duration-300 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-200/40 hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-purple-50 p-3 rounded-xl text-2xl group-hover:rotate-12 transition-transform duration-300">🎲</div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Idée de Date</h2>
                      <p className="text-gray-500 text-xs group-hover:text-purple-400">Pour ne jamais s'ennuyer ✨</p>
                    </div>
                    <div className="absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-purple-400">→</div>
                  </div>
                </Link>

                {/* 3. Bouton Ouvrir Quand... */}
                <Link to="/open-when" className="group relative block p-4 bg-white rounded-2xl border-2 border-blue-100 transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-200/40 hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-blue-50 p-3 rounded-xl text-2xl group-hover:-rotate-12 transition-transform duration-300">📬</div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Ouvrir quand...</h2>
                      <p className="text-gray-500 text-xs group-hover:text-blue-400">Des mots doux pour chaque humeur</p>
                    </div>
                    <div className="absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-400">→</div>
                  </div>
                </Link>

                {/* 4. Bouton Notre Histoire */}
                <Link to="/our-story" className="group relative block p-4 bg-white rounded-2xl border-2 border-rose-100 transition-all duration-300 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-200/40 hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-rose-50 p-3 rounded-xl text-2xl group-hover:scale-110 transition-transform duration-300">📸</div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-rose-600 transition-colors">Notre Histoire</h2>
                      <p className="text-gray-500 text-xs group-hover:text-rose-400">Nos plus beaux souvenirs</p>
                    </div>
                    <div className="absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-rose-400">→</div>
                  </div>
                </Link>

                {/* 5. Bouton 100 Raisons */}
                <Link to="/reasons" className="group relative block p-4 bg-white rounded-2xl border-2 border-yellow-100 transition-all duration-300 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-200/40 hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-yellow-50 p-3 rounded-xl text-2xl group-hover:rotate-12 transition-transform duration-300 group-hover:scale-110">✨</div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">Pourquoi toi ?</h2>
                      <p className="text-gray-500 text-xs group-hover:text-yellow-500">Petite dose d'amour quotidienne</p>
                    </div>
                    <div className="absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-yellow-400">→</div>
                  </div>
                </Link>

                {/* 6. NOUVEAU : Bons Cadeaux (Remplace Planning) */}
                <Link to="/coupons" className="group relative block p-4 bg-white rounded-2xl border-2 border-indigo-100 transition-all duration-300 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-200/40 hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-indigo-50 p-3 rounded-xl text-2xl group-hover:rotate-12 transition-transform duration-300">🎟️</div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Bons Cadeaux</h2>
                      <p className="text-gray-500 text-xs group-hover:text-indigo-400">Tes tickets magiques à utiliser</p>
                    </div>
                    <div className="absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-400">→</div>
                  </div>
                </Link>

                {/* 7. LA ROUE DU DESTIN (Remplace To-Do List) */}
                <Link to="/wheel" className="group relative block p-4 bg-white rounded-2xl border-2 border-emerald-100 transition-all duration-300 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-200/40 hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-emerald-50 p-3 rounded-xl text-2xl group-hover:rotate-180 transition-transform duration-700">🎡</div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">La Roue du Soir</h2>
                      <p className="text-gray-500 text-xs group-hover:text-emerald-400">Pour les soirées indécises</p>
                    </div>
                    <div className="absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-400">→</div>
                  </div>
                </Link>

                {/* 7. Bouton Planning (WIP) */}
                <div className="block p-4 bg-white/60 rounded-2xl border-2 border-dashed border-gray-200 opacity-60 cursor-not-allowed group relative overflow-hidden">
                  <div className="flex items-center gap-4 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100">
                    <div className="bg-gray-100 p-3 rounded-xl text-2xl">📅</div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-500 group-hover:text-gray-700">Planning</h2>
                      <p className="text-gray-400 text-xs">Bientôt disponible</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">WIP</div>
                </div>

                {/* 8. Bouton To-Do List (WIP) */}
                <div className="block p-4 bg-white/60 rounded-2xl border-2 border-dashed border-gray-200 opacity-60 cursor-not-allowed group relative overflow-hidden">
                  <div className="flex items-center gap-4 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100">
                    <div className="bg-gray-100 p-3 rounded-xl text-2xl">✅</div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-500 group-hover:text-gray-700">To-Do List</h2>
                      <p className="text-gray-400 text-xs">En construction</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">WIP</div>
                </div>

              </div>
            </div>
        </div>

        {/* --- 3. PIED DE PAGE (Compteur + Crédits) --- */}
        {/* mb-20 pour laisser de la place au Lecteur Musique en bas */}
        <div className="flex-shrink-0 pb-6 text-center z-10 w-full">
            <RelationshipCounter />
            <div className="text-gray-400 text-xs font-sans mt-2">Développé avec ❤️ par ton chéri</div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Home;