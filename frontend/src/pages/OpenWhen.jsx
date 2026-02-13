import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import { Link } from 'react-router-dom';
import FloatingHearts from '../components/FloatingHearts';

const OpenWhen = () => {
  const [selectedEnvelope, setSelectedEnvelope] = useState(null);

  // --- TES LETTRES ---
  // Tu peux modifier le titre, le contenu (texte) et l'image pour chaque humeur.
  const envelopes = [
    {
      id: 1,
      title: "Quand tu es triste 😢",
      color: "border-blue-200 text-blue-600", // Juste la bordure et le texte
      content: "Mon amour, sache que même les nuages les plus gris finissent par passer. Je suis là pour toi, toujours. Prends une grande inspiration, tout va bien se passer.",
      image: "https://media.giphy.com/media/3oEdv4hwWTzBhWvaU0/giphy.gif"
    },
    {
      id: 2,
      title: "Quand je te manque 🥺",
      color: "border-purple-200 text-purple-600",
      content: "Ferme les yeux et imagine que je suis juste à côté de toi. On se retrouve très vite. En attendant, regarde cette photo qui me fait penser à nous.",
      image: "https://media.giphy.com/media/VbawWIGNtWAu79qQKS/giphy.gif"
    },
    {
      id: 3,
      title: "Quand tu es fâchée contre moi 😡",
      color: "border-red-200 text-red-600",
      content: "Je suis désolé si j'ai agi comme un idiot (ce qui arrive parfois !). Je ne veux jamais te blesser. Pardonne-moi ? ❤️",
      image: "https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif"
    },
    {
      id: 4,
      title: "Quand tu as besoin de rire 😂",
      color: "border-yellow-200 text-yellow-600", // La carte dorée est rentrée dans le rang !
      content: "Rappelle-toi la fois où... (Insère ici un souvenir drôle ou une blague nulle que tu adores). Ton sourire est ce que je préfère au monde.",
      image: "https://media.giphy.com/media/kaq6GnxDlJaBq/giphy.gif"
    },
    {
      id: 5,
      title: "Quand tu doutes de nous 💭",
      color: "border-pink-200 text-pink-600",
      content: "Regarde tout le chemin qu'on a parcouru. Tu es la femme de ma vie et je te choisirai encore et encore, chaque jour.",
      image: "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif"
    },
    {
      id: 6,
      title: "Quand tu as besoin de motivation 💪",
      color: "border-green-200 text-green-600",
      content: "Tu es capable de tout. Tu es intelligente, forte et incroyable. Ne laisse personne te dire le contraire. Fonce !",
      image: "https://media.giphy.com/media/1xVbRS6j52YSzp9E7Q/giphy.gif"
    },
  ];

  return (
    <PageTransition>
    <div className="fixed inset-0 bg-pink-50 flex flex-col items-center justify-start p-6 overflow-y-auto font-['Playfair_Display']">
      <FloatingHearts />
        <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-2xl border border-pink-100 rounded-full hover:shadow-lg">🏠</Link>
      <div className="z-10 w-full max-w-2xl mt-12 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up flex items-center justify-center gap-3 py-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 leading-normal">
            Ouvrir quand...
          </span>
          <span className="text-gray-800">💌</span>
        </h1>
        <p className="text-gray-500 italic mb-8">Choisis une enveloppe selon ton humeur du moment.</p>

        {/* GRILLE DES ENVELOPPES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-2">
          {envelopes.map((env) => (
            <button
              key={env.id}
              onClick={() => setSelectedEnvelope(env)}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 text-left overflow-hidden hover:cursor-pointer bg-white ${env.color}`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">✉️</span>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{env.title}</h3>
                  <p className="text-xs opacity-70 mt-1 uppercase tracking-wider font-sans">Scellé avec amour</p>
                </div>
              </div>
              {/* Effet brillant au survol */}
              <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          ))}
        </div>
      </div>

      {/* MODALE (LA LETTRE OUVERTE) */}
      {selectedEnvelope && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in-up border-4 border-pink-100">
            
            {/* Bouton Fermer */}
            <button 
              onClick={() => setSelectedEnvelope(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl w-8 h-8 flex items-center hover:cursor-pointer justify-center rounded-full hover:bg-red-50 transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center gap-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedEnvelope.title}</h2>
              
              {/* L'image/Gif */}
              <div className="rounded-xl overflow-hidden shadow-md w-full max-h-48 object-cover">
                <img src={selectedEnvelope.image} alt="Gif mignon" className="w-full h-full object-cover" />
              </div>

              {/* Le contenu du message */}
              <div className="bg-pink-50 p-6 rounded-xl w-full">
                <p className="text-gray-700 font-serif text-lg leading-relaxed italic">
                  "{selectedEnvelope.content}"
                </p>
              </div>

              <button 
                onClick={() => setSelectedEnvelope(null)}
                className="bg-pink-500 text-white px-6 py-2 rounded-full hover:cursor-pointer font-bold shadow-md hover:bg-pink-600 transition-colors"
              >
                Ça va mieux ❤️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </PageTransition>
  );
};

export default OpenWhen;