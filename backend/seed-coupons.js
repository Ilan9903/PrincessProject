import admin from './src/config/firebase.js';
import { getDb } from './src/config/firebase.js';

const seedCoupons = async () => {
  try {
    const db = getDb();
    console.log('✅ Connecté avec succès');

const couponsData = [
  { 
    title: "Massage VIP", 
    description: "Valable pour 30 min de massage relaxant (dos ou pieds au choix).", 
    icon: "💆‍♀️",
    expirationDate: null,
    isRedeemed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  { 
    title: "Soirée Sans Vaisselle", 
    description: "Ce soir, je m'occupe de tout. Tu mets juste les pieds sous la table !", 
    icon: "🍽️",
    expirationDate: null,
    isRedeemed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  { 
    title: "Resto Surprise", 
    description: "Un dîner dans l'endroit de ton choix, c'est bibi qui régale.", 
    icon: "🍷",
    expirationDate: null,
    isRedeemed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  { 
    title: "Joker 'J'ai Raison'", 
    description: "Utilise ce ticket pour gagner instantanément n'importe quel débat.", 
    icon: "⚖️",
    expirationDate: null,
    isRedeemed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  { 
    title: "Petit Déj au Lit", 
    description: "Croissants, café et jus d'orange servis avec amour au réveil.", 
    icon: "🥐",
    expirationDate: null,
    isRedeemed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  { 
    title: "Grands Câlins Illimités", 
    description: "Une dose de tendresse infinie pendant tout le temps nécessaire.", 
    icon: "🫂",
    expirationDate: null,
    isRedeemed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

    console.log('🎟️ Création des coupons...');
    
    for (const coupon of couponsData) {
      await db.collection('coupons').add(coupon);
      console.log(`✅ 🎁 ${coupon.title}`);
    }
    
    console.log('🎉 Tous les coupons ont été créés avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seedCoupons();
