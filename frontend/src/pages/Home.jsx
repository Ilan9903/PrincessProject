import { Link } from 'react-router-dom';
import FloatingHearts from '../components/FloatingHearts';
import RelationshipCounter from '../components/RelationshipCounter';
import profileImage from '../assets/profile.jpg';

const Home = () => {
  return (
    <div className="fixed inset-0 bg-pink-50 flex flex-col items-center justify-center overflow-hidden">
      <FloatingHearts />
      
      <div className="flex flex-col items-center justify-center w-full max-w-md px-6 gap-8 z-10">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 mb-2 drop-shadow-sm py-4 font-['Playfair_Display'] leading-none">
            Princess<br />Project
          </h1>
            <div className="flex items-center justify-center gap-4 mt-6 mb-6">
                <p className="text-lg text-gray-600 italic font-serif">for my wife</p>
                <div className="relative group cursor-pointer">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-pink-400 to-yellow-300 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
                    <img 
                    src={profileImage} 
                    alt="Ma princesse" 
                    className="relative w-16 h-16 rounded-full object-cover border-[3px] border-white shadow-sm z-10 transition-transform duration-500 group-hover:scale-105 hover:cursor-default"
                    />
                </div>
            </div>
          {/* <p className="text-lg text-gray-600 italic font-serif mt-2">for my wife 👑</p> */}
        </div>

        {/* --- GRILLE DES BOUTONS --- */}
        <div className="grid grid-cols-1 gap-4 w-full font-serif">
          
          {/* 1. Bouton Valentine (Existant) */}
          <Link to="/valentine" className="group relative block p-4 bg-white rounded-2xl border-2 border-pink-100 transition-all duration-300 hover:border-red-300 hover:shadow-xl hover:shadow-red-200/40 hover:-translate-y-1 active:scale-95 overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-red-50 p-3 rounded-xl text-2xl group-hover:rotate-6 transition-transform duration-300 group-hover:scale-110">💌</div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">La Demande</h2>
                <p className="text-gray-500 text-xs group-hover:text-red-400">Question très importante...</p>
              </div>
                <div className="absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-red-400">→</div>
            </div>
          </Link>

          {/* 2. NOUVEAU : Générateur de Date (Actif) */}
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

          {/* 3. NOUVEAU : Bouton "Ouvrir Quand..." */}
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
          
          {/* 3. Bouton Planning (Toujours là mais désactivé) */}
          <div className="block p-4 bg-white/60 rounded-2xl border-2 border-dashed border-gray-200 opacity-60 cursor-not-allowed group relative overflow-hidden">
            <div className="flex items-center gap-4 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100">
              <div className="bg-gray-100 p-3 rounded-xl text-2xl">📅</div>
              <div>
                <h2 className="text-lg font-bold text-gray-500 group-hover:text-gray-700">Planning</h2>
                <p className="text-gray-400 text-xs">Bientôt disponible</p>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Soon</div>
          </div>

          {/* 4. Bouton To-Do (Toujours là mais désactivé) */}
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
        <RelationshipCounter />
      </div>
      <div className="absolute bottom-6 text-gray-400 text-xs font-sans z-10">Développé avec ❤️ par ton chéri</div>
    </div>
  );
};

export default Home;