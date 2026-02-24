import admin from './src/config/firebase.js';
import { getDb } from './src/config/firebase.js';

const seedMessages = async () => {
  try {
    const db = getDb();
    console.log('✅ Connecté avec succès');

    // 🗑️ Supprimer tous les anciens messages
    console.log('🗑️ Suppression des anciens messages...');
    const existingMessages = await db.collection('messages').get();
    const deletePromises = existingMessages.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`✅ ${existingMessages.size} ancien(s) message(s) supprimé(s)`);

const messagesData = [
  {
    title: "Quand tu es triste 😢",
    content: "Mon amour, sache que même les nuages les plus gris finissent par passer. Je suis là pour toi, toujours. Prends une grande inspiration, tout va bien se passer.",
    category: "triste",
    imageUrl: "https://media.giphy.com/media/3oEdv4hwWTzBhWvaU0/giphy.gif",
    lockedUntil: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Quand je te manque 🥺",
    content: "Ferme les yeux et imagine que je suis juste à côté de toi. On se retrouve très vite. En attendant, regarde cette photo qui me fait penser à nous.",
    category: "manque",
    imageUrl: "https://media.giphy.com/media/VbawWIGNtWAu79qQKS/giphy.gif",
    lockedUntil: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Quand tu es fâchée contre moi 😡",
    content: "Je suis désolé si j'ai agi comme un idiot (ce qui arrive parfois !). Je ne veux jamais te blesser. Pardonne-moi ? ❤️",
    category: "fachee",
    imageUrl: "https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif",
    lockedUntil: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Quand tu as besoin de rire 😂",
    content: "Rappelle-toi la fois où... (Insère ici un souvenir drôle ou une blague nulle que tu adores). Ton sourire est ce que je préfère au monde.",
    category: "rire",
    imageUrl: "https://media.giphy.com/media/kaq6GnxDlJaBq/giphy.gif",
    lockedUntil: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Quand tu doutes de nous 💭",
    content: "Regarde tout le chemin qu'on a parcouru. Tu es la femme de ma vie et je te choisirai encore et encore, chaque jour.",
    category: "doute",
    imageUrl: "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif",
    lockedUntil: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Quand tu as besoin de motivation 💪",
    content: "Tu es capable de tout. Tu es intelligente, forte et incroyable. Ne laisse personne te dire le contraire. Fonce !",
    category: "motivation",
    imageUrl: "https://media.giphy.com/media/1xVbRS6j52YSzp9E7Q/giphy.gif",
    lockedUntil: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Message Secret 🎁",
    content: "Surprise ! Tu as déverrouillé ce message spécial. Je t'aime encore plus que le jour où j'ai écrit ceci. ❤️",
    category: "special",
    imageUrl: "https://media.giphy.com/media/g5R9dok94mrIvplmZd/giphy.gif",
    lockedUntil: Date.now() + 7 * 24 * 60 * 60 * 1000,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

    console.log('💌 Création des messages...');
    
    for (const message of messagesData) {
      await db.collection('messages').add(message);
      const locked = message.lockedUntil ? '🔒' : '✉️';
      console.log(`✅ ${locked} ${message.title}`);
    }
    
    console.log('🎉 Tous les messages ont été créés avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seedMessages();
