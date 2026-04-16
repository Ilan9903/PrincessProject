import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';
import RelationshipCounter from '../components/RelationshipCounter';
import { logout } from '../Utils/api';
import babawa from '../assets/profile.webp';

const Home = () => {

  const [showMore, setShowMore] = React.useState(false);

  const mainCards = [
    { to: '/valentine',  emoji: '💌', title: 'La Demande',     subtitle: 'Question très importante...',          border: 'border-pink-100 dark:border-gray-700',  hoverBorder: 'hover:border-red-300',     hoverShadow: 'hover:shadow-red-200/40',     iconBg: 'bg-red-50 dark:bg-red-900/30',       hoverTitle: 'group-hover:text-red-600 dark:group-hover:text-red-400',     arrow: 'text-red-400',     emojiAnim: 'group-hover:rotate-6 group-hover:scale-110', shimmer: true },
    { to: '/date-ideas', emoji: '🎲', title: 'Idée de Date',   subtitle: "Pour ne jamais s'ennuyer ✨",           border: 'border-purple-100 dark:border-gray-700', hoverBorder: 'hover:border-purple-400', hoverShadow: 'hover:shadow-purple-200/40',  iconBg: 'bg-purple-50 dark:bg-purple-900/30', hoverTitle: 'group-hover:text-purple-600 dark:group-hover:text-purple-400', arrow: 'text-purple-400', emojiAnim: 'group-hover:rotate-12' },
    { to: '/open-when',  emoji: '📬', title: 'Ouvrir quand...', subtitle: 'Des mots doux pour chaque humeur',    border: 'border-blue-100 dark:border-gray-700',  hoverBorder: 'hover:border-blue-400',   hoverShadow: 'hover:shadow-blue-200/40',    iconBg: 'bg-blue-50 dark:bg-blue-900/30',     hoverTitle: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',   arrow: 'text-blue-400',   emojiAnim: 'group-hover:-rotate-12' },
    { to: '/our-story',  emoji: '📸', title: 'Notre Histoire', subtitle: 'Nos plus beaux souvenirs',             border: 'border-rose-100 dark:border-gray-700',  hoverBorder: 'hover:border-rose-400',   hoverShadow: 'hover:shadow-rose-200/40',    iconBg: 'bg-rose-50 dark:bg-rose-900/30',     hoverTitle: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',   arrow: 'text-rose-400',   emojiAnim: 'group-hover:scale-110' },
    { to: '/coupons',    emoji: '🎟️', title: 'Bons Cadeaux',   subtitle: 'Tes tickets magiques à utiliser',     border: 'border-indigo-100 dark:border-gray-700', hoverBorder: 'hover:border-indigo-400', hoverShadow: 'hover:shadow-indigo-200/40',  iconBg: 'bg-indigo-50 dark:bg-indigo-900/30', hoverTitle: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400', arrow: 'text-indigo-400', emojiAnim: 'group-hover:rotate-12' },
    { to: '/playlist',   emoji: '🎶', title: 'Notre Playlist',  subtitle: 'Les chansons qui nous accompagnent', border: 'border-purple-100 dark:border-gray-700', hoverBorder: 'hover:border-purple-400', hoverShadow: 'hover:shadow-purple-200/40',  iconBg: 'bg-purple-50 dark:bg-purple-900/30', hoverTitle: 'group-hover:text-purple-600 dark:group-hover:text-purple-400', arrow: 'text-purple-400', emojiAnim: 'group-hover:scale-110' },
  ];

  const extraCards = [
    { to: '/reasons', emoji: '✨', title: 'Pourquoi toi ?',   subtitle: "Petite dose d'amour quotidienne", border: 'border-yellow-100 dark:border-gray-700',  hoverBorder: 'hover:border-yellow-400',  hoverShadow: 'hover:shadow-yellow-200/40',  iconBg: 'bg-yellow-50 dark:bg-yellow-900/30',   hoverTitle: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400', arrow: 'text-yellow-400', emojiAnim: 'group-hover:rotate-12 group-hover:scale-110' },
    { to: '/wheel',   emoji: '🎡', title: 'La Roue du Soir', subtitle: 'Pour les soirées indécises',         border: 'border-emerald-100 dark:border-gray-700', hoverBorder: 'hover:border-emerald-400', hoverShadow: 'hover:shadow-emerald-200/40', iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', hoverTitle: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400', arrow: 'text-emerald-400', emojiAnim: 'group-hover:rotate-180 duration-700' },
    { to: '/quiz',    emoji: '🧠', title: 'Le Quiz',          subtitle: 'Est-ce que tu me connais bien ?',  border: 'border-orange-100 dark:border-gray-700',  hoverBorder: 'hover:border-orange-400',  hoverShadow: 'hover:shadow-orange-200/40',  iconBg: 'bg-orange-50 dark:bg-orange-900/30',   hoverTitle: 'group-hover:text-orange-600 dark:group-hover:text-orange-400', arrow: 'text-orange-400', emojiAnim: 'group-hover:scale-110' },
    { to: '/scratch', emoji: '🍀', title: 'Ticket Surprise',  subtitle: 'Tente ta chance !',                border: 'border-yellow-100 dark:border-gray-700',  hoverBorder: 'hover:border-yellow-400',  hoverShadow: 'hover:shadow-yellow-200/40',  iconBg: 'bg-yellow-50 dark:bg-yellow-900/30',   hoverTitle: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400', arrow: 'text-yellow-400', emojiAnim: 'group-hover:scale-110' },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <PageTransition>
      {/* CONTENEUR PRINCIPAL : Bloqué à la hauteur de l'écran (100dvh) */}
      <div className="h-dvh w-full bg-pink-50 dark:bg-gray-900 flex flex-col items-center justify-between overflow-hidden relative font-['Playfair_Display'] transition-colors duration-300">
        
        <FloatingHearts />

        {/* Bouton de Déconnexion */}
        <button 
          onClick={handleLogout}
          aria-label="Se déconnecter"
          className="absolute top-6 left-6 text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 z-50 p-2 text-2xl active:scale-95 shadow-xl border border-pink-100 dark:border-gray-700 rounded-full hover:shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all hover:cursor-pointer"
        >
          🔒
        </button>
        
        {/* --- 1. EN-TÊTE (Titre + Photo) --- */}
        {/* flex-shrink-0 : Empêche cette partie d'être écrasée */}
        <div className="flex flex-col items-center justify-center w-full max-w-md px-6 z-10 shrink-0 mt-4">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-500 to-pink-600 mb-2 drop-shadow-sm py-2 font-['Playfair_Display'] leading-none">
              Princess<br />Project
            </h1>
            
            <div className="flex items-center justify-center gap-4 mt-4 mb-2">
                <p className="text-lg text-gray-600 dark:text-gray-300 italic font-serif transition-colors">for my wife</p>
                <div className="relative group cursor-default">
                    <div className="absolute -inset-1 bg-linear-to-tr from-pink-400 to-yellow-300 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
                    <img
                      src={babawa}
                      alt="Ma princesse" 
                      width="64"
                      height="64"
                      loading="eager"
                      fetchPriority="high"
                      className="relative w-16 h-16 rounded-full object-cover border-[3px] border-white shadow-sm z-10 transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            </div>
          </div>
        </div>

        {/* --- 2. ZONE SCROLLABLE DES BOUTONS --- */}
        <div className="w-full grow flex flex-col justify-center overflow-hidden px-4 py-2 z-10 max-w-md">
            <div className="w-full max-h-full overflow-y-auto px-2 py-4
                scrollbar-large scrollbar-thumb-pink-200 scrollbar-track-transparent scroll-smooth
                mask-[linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]
                webkit-[mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]"
            >
              <div className="grid grid-cols-1 gap-4 w-full font-serif">
                {mainCards.map((card) => (
                  <Link key={card.to} to={card.to} className={`group relative block p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 ${card.border} transition-all duration-300 ${card.hoverBorder} hover:shadow-xl ${card.hoverShadow} hover:-translate-y-1 active:scale-95 overflow-hidden`}>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`${card.iconBg} p-3 rounded-xl text-2xl transition-transform duration-300 ${card.emojiAnim}`}>{card.emoji}</div>
                      <div>
                        <h2 className={`text-lg font-bold text-gray-800 dark:text-gray-100 ${card.hoverTitle} transition-colors`}>{card.title}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{card.subtitle}</p>
                      </div>
                      <div className={`absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${card.arrow}`}>→</div>
                    </div>
                    {card.shimmer && (
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-0"></div>
                    )}
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={() => setShowMore((prev) => !prev)}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-pink-200 dark:border-gray-700 text-sm font-semibold text-pink-600 dark:text-pink-400 bg-white/70 dark:bg-gray-800/70 hover:cursor-pointer"
                >
                  {showMore ? 'Voir moins' : 'Voir plus'}
                </button>

                {showMore && extraCards.map((card) => (
                  <Link key={card.to} to={card.to} className={`group relative block p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 ${card.border} transition-all duration-300 ${card.hoverBorder} hover:shadow-xl ${card.hoverShadow} hover:-translate-y-1 active:scale-95 overflow-hidden`}>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`${card.iconBg} p-3 rounded-xl text-2xl transition-transform duration-300 ${card.emojiAnim}`}>{card.emoji}</div>
                      <div>
                        <h2 className={`text-lg font-bold text-gray-800 dark:text-gray-100 ${card.hoverTitle} transition-colors`}>{card.title}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{card.subtitle}</p>
                      </div>
                      <div className={`absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${card.arrow}`}>→</div>
                    </div>
                  </Link>
                ))}

              </div>
            </div>
        </div>

        {/* --- 3. PIED DE PAGE (Compteur + Crédits) --- */}
        {/* mb-20 pour laisser de la place au Lecteur Musique en bas */}
        <div className="shrink-0 pb-6 text-center z-10 w-full">
            <RelationshipCounter />
            <div className="text-gray-400 dark:text-gray-500 text-xs font-sans mt-2 transition-colors">Développé avec ❤️ par ton chéri</div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Home;